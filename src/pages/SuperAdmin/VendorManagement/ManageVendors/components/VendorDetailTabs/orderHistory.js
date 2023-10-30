import Empty from "components/Empty";
import Table from "components/table";
import React, { useState, useEffect, memo, useCallback } from "react";
import { withTranslation } from "react-i18next";
import "./../../Detail/Detail.scss";
import Select from "react-select";
import styles from "./../../../ManageVendors/ManageVendors.module.scss";
import { useVendorOrderDetail } from "repositories/admin-vendor-repository";
import useHandleApiError from "hooks/useHandleApiError";
import { setStorage, getStorage } from "utils";
import constants, { paymentStatus } from "../../../../../../constants";
import Loader from "components/Loader";
import moment from "moment";
import { debounce } from "lodash";
import { convertIntoTwoDecimal } from "utils";

const OrderHistory = ({ t, isGetDetail, vendorId }) => {
  const options = [
    {
      value: "",
      label: t("superAdminVendorManagement.allPaymentStatus"),
    },
    {
      value: 2,
      label: "Paid",
    },
    {
      value: 1,
      label: "Not Paid",
    },
  ];
  const PAGE_SIZE = 3;

  const cacheValue = getStorage(
    constants.vendor.cache.orderHistoryVendorInAdmin
  );
  const [pageNumber, setPageNumber] = useState(cacheValue?.pageNumber || 1);
  const [searchText, setSearchText] = useState(cacheValue?.searchText || null);
  const [apiSearchText, setApiSearchText] = useState(
    cacheValue?.searchText || null
  );
  const [status, setStatus] = useState(cacheValue?.status || options[0].value);
  const {
    data: orders,
    isLoading,
    error,
    isFetching,
  } = useVendorOrderDetail(
    vendorId,
    pageNumber,
    apiSearchText ? apiSearchText : "",
    status,
    PAGE_SIZE,
    { enabled: isGetDetail }
  );
  useHandleApiError(isLoading, isFetching, error);
  useEffect(() => {
    setStorage(constants.vendor.cache.orderHistoryVendorInAdmin, {
      searchText: searchText || null,
      pageNumber,
      status,
    });
  }, [pageNumber, searchText, status]);

  const handleSearchText = useCallback(
    debounce((searchTextUpdated) => {
      setPageNumber(1);
      setApiSearchText(searchTextUpdated);
    }, 1000),
    []
  );

  const handleSelect = (e) => {
    setPageNumber(1);
    setStatus(e?.value);
  };

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearchText(value);
    handleSearchText(value);
  };

  const columns = [
    {
      text: t("superAdminVendorManagement.orderNo"),
      dataField: "orderNo",
      formatter: (cellContent) => (
        <u className="cursor-pointer">{cellContent}</u>
      ),
    },
    {
      text: t("superAdminVendorManagement.orderDate"),
      dataField: "orderDate",
      formatter: (cellContent, row, rowIndex) => (
        <span>{moment(row.date).format("MMM DD, YYYY")}</span>
      ),
    },
    {
      text: t("superAdminVendorManagement.customerName"),
      dataField: "customerName",
      formatter: (cellContent, row, rowIndex) => (
        <span>
          {row?.orderBy?.firstName} {row?.orderBy?.lastName}
        </span>
      ),
    },
    {
      text: t("superAdminVendorManagement.officeName"),
      dataField: "officeName",
      formatter: (cellContent, row, rowIndex) => (
        <span>{row?.office?.name}</span>
      ),
    },
    {
      text: t("superAdminVendorManagement.accountOwnerName"),
      dataField: "accountOwnerName",
      formatter: (cellContent, row, rowIndex) => {
        return (
          <span>
            {row?.office?.owner?.firstName} {row?.office?.owner?.lastName}
          </span>
        );
      },
    },
    {
      text: t("superAdminVendorManagement.amount"),
      dataField: "totalAmount",
      formatter: (cellContent, row, rowIndex) => (
        <span>{`CAD ${convertIntoTwoDecimal(row?.totalPayableAmount)}`}</span>
      ),
    },
    {
      text: t("superAdminVendorManagement.paymentStatus"),
      dataField: "paymentStatus",
      formatter: (cellContent, row, rowIndex) => (
        <span>{paymentStatus(row?.paymentStatus)}</span>
      ),
    },
  ];

  return (
    <>
      <div className="d-sm-flex my-4 py-2 justify-content-between align-items-center">
        {(isLoading || isFetching) && <Loader />}
        <div className={"search-box " + styles["search"]}>
          <input
            type="text"
            value={searchText}
            onChange={handleSearch}
            placeholder={t("superAdminVendorManagement.searchByOrderNo")}
          />
          <span className="ico">
            <img
              src={require("assets/images/search-icon.svg").default}
              alt="icon"
            />
          </span>
        </div>
        <div className="member-filter review-rating-filter">
          <Select
            options={options}
            defaultValue={options.find((key) => key === status)}
            className={["react-select-container pl-2"]}
            onChange={handleSelect}
            classNamePrefix="react-select"
          />
        </div>
      </div>
      <div className="vendor-table">
        {!!orders?.data?.length ? (
          <Table
            columns={columns}
            data={orders?.data}
            keyField="id"
            handlePagination={setPageNumber}
            pageNumber={pageNumber}
            totalItems={orders?.pagination?.totalItems}
            pageSize={PAGE_SIZE}
          />
        ) : (
          <Empty Message={t("noRecordFound")} />
        )}
      </div>
    </>
  );
};

export default withTranslation()(memo(OrderHistory));
