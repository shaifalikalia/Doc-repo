import React, { useState, Fragment, useCallback, useEffect } from "react";
import LayoutVendor from "../../components/LayoutVendor";
import { withTranslation } from "react-i18next";
import Page from "components/Page";
import styles from "./ManageInvoices.module.scss";
import Select from "react-select";
import Table from "components/table";
import {
  useToGetInvoice,
  generatePdfVendorOrders,
} from "repositories/vendor-repository";
import useHandleApiError from "hooks/useHandleApiError";
import Empty from "components/Empty";
import {
  isValueEmpty,
  getStorage,
  setStorage,
  handleError,
  handleSuccess,
  isMobileTab,
  encodeId,
} from "utils";
import constants from "../../../constants";
import { debounce } from "lodash";
import Loader from "components/Loader";
import FileSaver from "file-saver";
import moment from "moment/moment";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

const PAGE_SIZE = 10;

const ManageInvoices = ({ t }) => {
  const options = [
    {
      value: null,
      label: t("vendorManagement.allPaymentMethods"),
    },
    {
      value: 1,
      label: t("vendorManagement.billMelater"),
    },
    {
      value: 2,
      label: t("paidOnline"),
    },
  ];

  const cacheValue = getStorage(constants.vendor.cache.vendorInvoiceCache);
  const [pageNumber, setPageNumber] = useState(cacheValue?.pageNumber || 1);
  const [selectedOption, setSelectedOption] = useState(
    cacheValue?.selectedOption || options[0]
  );
  const [searchText, setSearchText] = useState(cacheValue?.searchText || null);
  const [apiSearchText, setApiSearchText] = useState(
    cacheValue?.searchText || null
  );
  const [isLoader, setIsLoader] = useState(false);

  const { data, isLoading, isFetching, error } = useToGetInvoice(
    PAGE_SIZE,
    pageNumber,
    apiSearchText,
    selectedOption.value
  );
  useHandleApiError(isLoading, isFetching, error);
  const invoiceList = data?.data || [];
  let isLoaderShow = isLoader || isLoading;

  useEffect(() => {
    setStorage(constants.vendor.cache.vendorInvoiceCache, {
      pageNumber,
      searchText: apiSearchText,
      selectedOption,
    });
  }, [pageNumber, selectedOption, apiSearchText]);

  const handleSearchText = useCallback(
    debounce((searchTextValue) => {
      setPageNumber(1);
      setApiSearchText(searchTextValue);
    }, 1000),
    []
  );

  const handleChange = (event) => {
    const { value } = event.target;
    setSearchText(value);
    handleSearchText(value);
  };

  const handleSelect = (v) => {
    setSelectedOption(v);
    setPageNumber(1);
  };

  const b64toBlob = (b64Data, contentType = "", sliceSize = 512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  };

  const paymentMethodstatus = [
    { value: 1, title: t("vendorManagement.billMelater") },
    { value: 2, title: t("paidOnline") },
  ];

  const paymentMethodStatus = (id) => {
    const status = paymentMethodstatus.find(
      (paymentMethod) => paymentMethod.value === id
    );
    return status?.title;
  };

  const generatePdf = async (item) => {
    try {
      const { id, date, paymentMethod, paymentStatus } = item;

      let body = {
        vendorOrderIds: [id],
        StartDate: moment(date).format("YYYY-MM-DD"),
        EndDate: moment(date).format("YYYY-MM-DD"),
        PaymentMethod: paymentMethod,
        PaymentStatus: paymentStatus,
      };

      setIsLoader(true);
      let res = await generatePdfVendorOrders(body);
      if (res && res.data) {
        const blob = b64toBlob(res.data, "application/pdf");
        if (isMobileTab()) {
          FileSaver.saveAs(blob);
        } else {
          const blobUrl = URL.createObjectURL(blob);
          const pdfWindow = window.open("");
          if (
            !pdfWindow ||
            pdfWindow.closed ||
            typeof pdfWindow.closed == "undefined"
          ) {
            toast.error(t("vendorManagement.browserPopUpSupportMessage"), {
              duration: 5000,
            });
            setIsLoader(false);
            return;
          }
          pdfWindow.document.write(
            "<iframe width='100%' height='100%' src='" + blobUrl + "'></iframe>"
          );
          pdfWindow.document.close();
        }
      }
      handleSuccess(res?.message);
    } catch (err) {
      handleError(err);
    }
    setIsLoader(false);
  };

  const columns = [
    {
      attrs: { datatitle: t("vendorManagement.orderNo") },
      dataField: "orderNo",
      text: t("vendorManagement.orderNo"),
      formatter: (cellContent, row, rowIndex) => (
        <span className="link-btn">
          <Link
            to={`${constants.routes.vendor.orderDetail.replace(
              ":orderId",
              encodeId(row.id)
            )}`}
          >
            {row.orderNo}
          </Link>
        </span>
      ),
    },
    {
      attrs: { datatitle: t("vendorManagement.invoiceNo") },
      dataField: "invoiceNumber",
      text: t("vendorManagement.invoiceNo"),
    },
    {
      attrs: { datatitle: t("vendorManagement.officeName") },
      dataField: "officeName",
      text: t("vendorManagement.officeName"),
      formatter: (cellContent, row, rowIndex) => (
        <Fragment>{isValueEmpty(row?.office?.name)}</Fragment>
      ),
    },
    {
      attrs: { datatitle: t("vendorManagement.paymentMethod") },
      dataField: "paymentMethod",
      text: t("vendorManagement.paymentMethod"),
      formatter: (cellContent, row, rowIndex) => (
        <Fragment>{paymentMethodStatus(row.paymentMethod)}</Fragment>
      ),
    },
    {
      attrs: { datatitle: t("vendorManagement.actions") },
      dataField: "id",
      text: t("vendorManagement.actions"),
      formatter: (cellContent, row, rowIndex) => (
        <Fragment>
          {cellContent && (
            <span
              onClick={() => generatePdf(row)}
              className="pointer"
              style={{ fontSize: "12px", color: "#587E85" }}
              title={t("vendorManagement.exportInvoice")}
            >
              <u>{t("vendorManagement.exportInvoice")}</u>
            </span>
          )}
        </Fragment>
      ),
    },
  ];

  return (
    <LayoutVendor>
      <Page title={t("vendorManagement.manageInvoices")}>
        <div className="d-sm-flex mb-3 my-md-4 py-md-2 justify-content-between align-items-center">
          <div className={"search-box " + styles["invoices-search"]}>
            <input
              type="text"
              placeholder={t(
                "vendorManagement.manageInvoicesSearchPlaceholder"
              )}
              onChange={handleChange}
              value={searchText}
            />
            <span className="ico">
              <img
                src={require("assets/images/search-icon.svg").default}
                alt="icon"
              />
            </span>
          </div>
          {isLoaderShow && <Loader />}
          <div
            className={
              "member-filter review-rating-filter " + styles["invoices-select"]
            }
          >
            <Select
              options={options}
              defaultValue={selectedOption}
              className={["react-select-container pl-sm-2"]}
              onChange={handleSelect}
              classNamePrefix="react-select"
            />
          </div>
        </div>
        <div
          className={"table-td-last-50 table-td-last-50-invoices common-fw-400"}
        >
          {!!invoiceList?.length ? (
            <Table
              keyField="id"
              data={invoiceList}
              columns={columns}
              handlePagination={(e) => setPageNumber(e)}
              pageNumber={pageNumber}
              totalItems={data?.pagination?.totalItems}
              pageSize={PAGE_SIZE}
            />
          ) : (
            <Empty Message={t("noRecordFound")} />
          )}
        </div>
      </Page>
    </LayoutVendor>
  );
};

export default withTranslation()(ManageInvoices);
