import React, { useState, useEffect, useCallback } from "react";
import { withTranslation } from "react-i18next";
import Page from "components/Page";
import "./commission.scss";
import EditCommissionsModal from "./components/EditCommissions";
import Table from "components/table";
import { Col, Row } from "reactstrap";
import { setStorage, getStorage } from "utils";
import constants from "../../../../constants";
import { debounce } from "lodash";
import useHandleApiError from "hooks/useHandleApiError";
import {
  useManageCommisionListing,
  changeCommission,
} from "repositories/admin-vendor-repository";
import { toast } from "react-hot-toast";
import Loader from "components/Loader";
import Empty from "components/Empty";

const PAGE_SIZE = 7;

const ManageCommissions = ({ t }) => {
  const cacheValue =
    getStorage(constants.vendor.cache.manageCommissionsCache) || {};
  const [editCommissionsModalOpen, setEditCommissionsModalOpen] = useState({
    isOpen: false,
  });
  const [pageNumber, setPageNumber] = useState(cacheValue?.pageNumber || 1);
  const [searchText, setSearchText] = useState(cacheValue?.searchText || null);
  const [apiSearchText, setApiSearchText] = useState(
    cacheValue?.searchText || null
  );
  const [isLoader, setisLoader] = useState(false);
  const searchTextValue = apiSearchText === null ? "" : apiSearchText?.trim();
  const {
    data,
    isLoading,
    error: isError,
    isFetching,
    refetch,
  } = useManageCommisionListing(pageNumber, searchTextValue, PAGE_SIZE);
  const commissionListing = data?.data || [];
  useHandleApiError(isLoading, isFetching, isError);

  useEffect(() => {
    setStorage(constants.vendor.cache.manageCommissionsCache, {
      pageNumber,
      searchText,
    });
    return () => {
      sessionStorage.removeItem(constants.vendor.cache.manageCommissionsCache);
    };
  }, [pageNumber, searchText]);

  const columns = [
    {
      attrs: { datatitle: t("superAdminCommissions.vendorName") },
      dataField: "name",
      text: t("superAdminCommissions.vendorName"),
      formatter: (cellContent, row, rowIndex) => <span>{row?.name}</span>,
    },
    {
      attrs: { datatitle: t("superAdminCommissions.emailAddress") },
      dataField: "emailId",
      text: t("superAdminCommissions.emailAddress"),
    },
    {
      attrs: { datatitle: t("superAdminCommissions.adminCommission") },
      dataField: "adminCommission",
      text: t("superAdminCommissions.adminCommission"),
      formatter: (cellContent, row, rowIndex) => (
        <span> {`${row?.adminCommission}%`}</span>
      ),
    },
    {
      attrs: { datatitle: t("superAdminCommissions.edit") },
      dataField: "name",
      text: t("superAdminCommissions.edit"),
      formatter: (cellContent, row, rowIndex) => (
        <span
          className="link-btn"
          onClick={() => {
            setEditCommissionsModalOpen({
              isOpen: true,
              ...row,
            });
          }}
        >
          {t("edit")}
        </span>
      ),
    },
  ];

  const updateCommission = async (value) => {
    setisLoader(true);
    try {
      let res = await changeCommission({
        vendorDetailId: editCommissionsModalOpen?.id,
        adminCommission: +value,
      });
      refetch();
      toast.success(res?.message);
      setEditCommissionsModalOpen({ isOpen: false });
    } catch (err) {
      toast.error(err?.message);
    }
    setisLoader(false);
  };

  const handleSearch = (event) => {
    const { value } = event.target;
    setSearchText(value);
    searchHandle(value);
  };

  const searchHandle = useCallback(
    debounce((searchValue) => {
      setPageNumber(1);
      setApiSearchText(searchValue);
    }, 1000),
    []
  );

  return (
    <Page>
      {isLoading && <Loader />}
      <Row className="align-items-center">
        <Col md="12">
          <h2 class="page-title mb-md-0 mb-4">
            {t("superAdminCommissions.manageCommissions")}
          </h2>
        </Col>
      </Row>
      <div className="d-sm-flex my-4 py-2 justify-content-between align-items-center">
        <div className={"search-box "}>
          <input
            type="text"
            placeholder={`${t("superAdminCommissions.searchByName")}/${t(
              "Email"
            )}`}
            onChange={handleSearch}
            value={searchText}
          />
          <span className="ico">
            <img
              src={require("assets/images/search-icon.svg").default}
              alt="icon"
            />
          </span>
        </div>
      </div>
      <div className="commissions-table">
        {!!commissionListing?.length ? (
          <Table
            keyField="id"
            data={commissionListing}
            columns={columns}
            handlePagination={(e) => setPageNumber(e)}
            pageNumber={pageNumber}
            totalItems={data?.pagination?.totalItems || 1}
            pageSize={PAGE_SIZE}
          />
        ) : (
          <Empty Message={t("superAdmin.noDataAvaliable")} />
        )}
      </div>

      {editCommissionsModalOpen?.isOpen && (
        <EditCommissionsModal
          editCommissionsModalOpen={editCommissionsModalOpen}
          setEditCommissionsModalOpen={setEditCommissionsModalOpen}
          updateCommission={updateCommission}
          isLoading={isLoader}
        />
      )}
    </Page>
  );
};

export default withTranslation()(ManageCommissions);
