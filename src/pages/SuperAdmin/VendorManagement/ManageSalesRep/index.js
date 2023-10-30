import React from "react";
import { withTranslation } from "react-i18next";
import Page from "components/Page";
import Table from "components/table";
import { Col, Row } from "reactstrap";
import { useManageSales } from "../Hooks/useManageSales";
import Loader from "components/Loader";
import ChangeStatusModal from "components/ChangeStatusModal";
import Empty from "components/Empty";
import { isValueEmpty } from "utils";
import "./salesRep.scss";

const ManageSalesRep = ({ t }) => {
  const {
    pageNumber,
    pageSize,
    searchText,
    salesRepListing,
    showLoader,
    totalItems,
    isDeactive,
    closeStatusModel,
    isChangedStatus,
    updateStatus,
    setPageNumber,
    handleSearch,
  } = useManageSales({ t });

  const columns = [
    {
      attrs: { datatitle: t("superAdminSales.saleRepName") },
      dataField: "saleRepName",
      text: t("superAdminSales.saleRepName"),
      formatter: (cellContent, row, rowIndex) => {
        return (
          <span>
            {row?.firstName} {row?.lastName}
          </span>
        );
      },
    },
    {
      attrs: { datatitle: t("superAdminSales.emailAddress") },
      dataField: "emailId",
      text: t("superAdminSales.emailAddress"),
    },
    {
      attrs: { datatitle: t("superAdminSales.vendorsName") },
      dataField: "saleRepName",
      text: t("superAdminSales.vendorsName"),
      formatter: (cellContent, row, rowIndex) => {
        let fullName =
          row?.createdByUser?.firstName + " " + row?.createdByUser?.lastName;
        return <span>{isValueEmpty(fullName)}</span>;
      },
    },
    {
      attrs: { datatitle: t("superAdminSales.contactNo") },
      dataField: "contactNo",
      text: t("superAdminSales.contactNo"),
      formatter: (cellContent, row, rowIndex) => (
        <span>{isValueEmpty(row?.contactNumber)}</span>
      ),
    },

    {
      attrs: { datatitle: t("superAdminSales.status") },
      dataField: "status",
      text: t("superAdminSales.status"),
      formatter: (cellContent, row, rowIndex) => (
        <span>{row.isActive ? t("active") : t("inactive")}</span>
      ),
    },

    {
      attrs: { datatitle: t(" superAdminSales.action") },
      dataField: "action",
      text: t("superAdminSales.action"),
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
    <Page>
      {showLoader && <Loader />}
      <Row className="align-items-center">
        <Col md="12">
          <h2 class="page-title mb-md-0 mb-4">
            {t("superAdminSales.manageSalesRep")}
          </h2>
        </Col>
      </Row>
      <div className="d-sm-flex my-4 py-2 justify-content-between align-items-center">
        <div className={"search-box sale-search-box"}>
          <input
            type="text"
            placeholder={t("superAdminSales.searchByName")}
            value={searchText}
            onChange={handleSearch}
          />
          <span className="ico">
            <img
              src={require("assets/images/search-icon.svg").default}
              alt="icon"
            />
          </span>
        </div>
      </div>
      <div className="salesRepo-table">
        {!!salesRepListing?.length ? (
          <Table
            className="vendor-table"
            keyField="id"
            data={salesRepListing}
            columns={columns}
            handlePagination={(e) => setPageNumber(e)}
            pageNumber={pageNumber}
            totalItems={totalItems}
            pageSize={pageSize}
          />
        ) : (
          <Empty Message={t("noRecordFound")} />
        )}
      </div>

      <ChangeStatusModal
        description={
          isDeactive?.isActive
            ? t("superAdmin.vendor.salesDecActivate")
            : t("superAdmin.vendor.salesActivate")
        }
        isLoading={showLoader}
        isOpen={isDeactive?.isOpen}
        isSubmit={updateStatus}
        closeModal={closeStatusModel}
        buttonTitle={
          isDeactive?.isActive
            ? t("superAdmin.vendor.Deactivate")
            : t("superAdmin.vendor.Activate")
        }
      />
    </Page>
  );
};

export default withTranslation()(ManageSalesRep);
