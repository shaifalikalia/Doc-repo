import React, { useState, useEffect, memo, useCallback } from "react";
import Empty from "components/Empty";
import Table from "components/table";
import { withTranslation } from "react-i18next";
import "./../../Detail/Detail.scss";
import { useSalesRepDetails } from "repositories/admin-vendor-repository";
import useHandleApiError from "hooks/useHandleApiError";
import { setStorage, getStorage } from "utils";
import styles from "./../../../ManageVendors/ManageVendors.module.scss";
import constants from "../../../../../../constants";
import { debounce } from "lodash";
import { isValueEmpty } from "utils";
import Loader from "components/Loader";
import { SalesRepChangedStatus } from "../SalesRepChangeStatus";
import { toast } from "react-toastify";
import { updateSalesRepStatus } from "repositories/admin-vendor-repository";

const SalesRep = ({ t, isGetDetail, vendorId, isSalesTab }) => {
  const PAGE_SIZE = 7;
  const cacheValue = getStorage(constants.vendor.cache.salesRepVendorInAdmin);
  const [pageNumber, setPageNumber] = useState(cacheValue?.pageNumber || 1);
  const [searchText, setSearchText] = useState(cacheValue?.searchText || null);
  const [apiSearchText, setApiSearchText] = useState(
    cacheValue?.searchText || null
  );
  const [showLoader, setShowLoader] = useState(false);
  const [isDeactive, setIsDeactive] = useState({ isOpen: false });
  const {
    data: salesRep,
    isLoading,
    error,
    isFetching,
    refetch,
  } = useSalesRepDetails(pageNumber, apiSearchText ?? "", PAGE_SIZE, vendorId, {
    enabled: isGetDetail && isSalesTab,
  });
  useHandleApiError(isLoading, isFetching, error);
  useEffect(() => {
    setStorage(constants.vendor.cache.salesRepVendorInAdmin, {
      searchText: searchText || null,
      pageNumber,
    });
  }, [pageNumber, searchText]);

  const handleSearchText = useCallback(
    debounce((searchTextUpdated) => {
      setPageNumber(1);
      setApiSearchText(searchTextUpdated);
    }, 1000),
    []
  );

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearchText(value);
    handleSearchText(value);
  };

  const isChangedStatus = (details) => {
    setIsDeactive({
      isOpen: true,
      ...details,
    });
  };

  const closeStatusModel = () => {
    setIsDeactive({
      isOpen: false,
    });
  };

  const updateStatus = async () => {
    setShowLoader(true);
    try {
      let res = await updateSalesRepStatus({
        id: isDeactive.id,
        isActive: !isDeactive.isActive,
      });
      refetch();
      toast.success(res?.message);
      closeStatusModel();
    } catch (err) {
      toast.error(err?.message);
    }
    setShowLoader(false);
  };

  const columns = [
    {
      text: t("superAdminVendorManagement.vendorName"),
      dataField: "vendorName",
      formatter: (cellContent, row, rowIndex) => (
        <span>
          {row?.firstName} {row?.lastName}
        </span>
      ),
    },
    {
      text: t("superAdminVendorManagement.emailAddress"),
      dataField: "emailId",
      formatter: (cellContent) => {
        return cellContent;
      },
    },
    {
      text: t("superAdminVendorManagement.contactNo"),
      dataField: "contactNumber",
      formatter: (cellContent, row, rowIndex) => (
        <span>{isValueEmpty(row?.contactNumber)}</span>
      ),
    },
    {
      text: t("superAdminVendorManagement.status"),
      dataField: "status",
      formatter: (cellContent, row, rowIndex) => (
        <span>{row.isActive ? t("active") : t("inactive")}</span>
      ),
    },
    {
      text: t("superAdminVendorManagement.null"),
      dataField: "null",
      formatter: (cellContent, row, rowIndex) => (
        <>
          {!row.isActive ? (
            <span className="link-btn" onClick={() => isChangedStatus(row)}>
              {" "}
              {t("activate")}
            </span>
          ) : (
            <span
              className="link-btn font-color-red"
              onClick={() => isChangedStatus(row)}
            >
              {" "}
              {t("deactivate")}
            </span>
          )}
        </>
      ),
    },
  ];

  return (
    <>
      <div className="d-sm-flex my-4 py-2 justify-content-between align-items-center">
        {(isLoading || isFetching || showLoader) && <Loader />}

        <div className={"search-box " + styles["search"]}>
          <input
            type="text"
            onChange={handleSearch}
            value={searchText}
            placeholder={t(
              "superAdminVendorManagement.searchBySalesRepNameEmail"
            )}
          />
          <span className="ico">
            <img
              src={require("assets/images/search-icon.svg").default}
              alt="icon"
            />
          </span>
        </div>
      </div>
      <div className="vendor-table">
        {!!salesRep?.data?.length ? (
          <Table
            columns={columns}
            data={salesRep.data}
            keyField="id"
            handlePagination={setPageNumber}
            pageNumber={pageNumber}
            totalItems={salesRep?.pagination?.totalItems}
            pageSize={PAGE_SIZE}
          />
        ) : (
          <Empty Message={t("noRecordFound")} />
        )}
      </div>
      <SalesRepChangedStatus
        t={t}
        isDeactive={isDeactive}
        updateStatus={updateStatus}
        closeStatusModel={closeStatusModel}
        showLoader={false}
      />
    </>
  );
};

export default withTranslation()(memo(SalesRep));
