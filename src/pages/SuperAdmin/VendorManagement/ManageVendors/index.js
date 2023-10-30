import React, { Fragment } from "react";
import { withTranslation } from "react-i18next";
import Page from "components/Page";
import styles from "./../ManageVendors/ManageVendors.module.scss";
import "./vendor.scss";
import Table from "components/table";
import { Col, Row } from "reactstrap";
import Select from "react-select";
import { useManageVendor } from "../Hooks/useManageVendor";
import Loader from "components/Loader";
import Empty from "components/Empty";
import { ChangedStatus } from "./components/ChangeStatus";
import { isValueEmpty } from "utils";
import { getsubcriptionPlanTitle } from "../../../../constants";

// getsubcriptionPlanTitle
const ManageVendors = ({ t }) => {
  const {
    selectedOption,
    pageNumber,
    pageSize,
    options,
    searchText,
    vendorListing,
    showLoader,
    totalItems,
    isDeactive,
    updateStatus,
    closeStatusModel,
    setPageNumber,
    handleSearch,
    isChangedStatus,
    redirectToVendorDetails,
    updateSelectedOptions,
  } = useManageVendor({ t });

  const columns = [
    {
      attrs: { datatitle: t("superAdminVendorManagement.vendorName") },
      dataField: "firstName",
      text: t("superAdminVendorManagement.vendorName"),
      formatter: (cellContent, row, rowIndex) => (
        <>
          <u
            className="cursor-pointer"
            onClick={() => redirectToVendorDetails(row)}
          >
            {row?.user?.firstName.length < 7
              ? `${row?.user?.firstName}`
              : `${row?.user?.firstName.substring(0, 6)}...`}{" "}
            {row?.user?.lastName.length < 6
              ? `${row?.user?.lastName}`
              : `${row?.user?.lastName.substring(0, 5)}...`}
          </u>
          {!row?.isApproved && (
            <span className={styles["tag"]}>{t("needApproval")}</span>
          )}
        </>
      ),
    },
    {
      attrs: { datatitle: t("superAdminVendorManagement.emailAddress") },
      dataField: "emailId",
      text: t("superAdminVendorManagement.emailAddress"),
      formatter: (cellContent, row, rowIndex) => (
        <span>{isValueEmpty(row?.user?.emailId)}</span>
      ),
    },
    {
      attrs: { datatitle: t("superAdminVendorManagement.contactNo") },
      dataField: "contactNumber",
      text: t("superAdminVendorManagement.contactNo"),
      formatter: (cellContent, row, rowIndex) => (
        <span>{isValueEmpty(row?.user?.contactNumber)}</span>
      ),
    },
    {
      attrs: { datatitle: t("superAdminVendorManagement.currentActivePlan") },
      dataField: "currentActivePlan",
      text: t("superAdminVendorManagement.currentActivePlan"),
      formatter: (cellContent, row, rowIndex) => (
        <Fragment>
          {getsubcriptionPlanTitle(row?.vendorSubscription?.subscriptionPlan)}
        </Fragment>
      ),
    },
    {
      attrs: { datatitle: t("superAdminVendorManagement.status") },
      dataField: "status",
      text: t("superAdminVendorManagement.status"),
      formatter: (cellContent, row, rowIndex) => (
        <Fragment>
          {!row.user.isActive || !row.isApproved ? (
            <span
              style={{ fontSize: "12px", color: "#535b5f" }}
              title="Inactive"
            >
              Inactive
            </span>
          ) : (
            <span style={{ fontSize: "12px", color: "#535b5f" }} title="Active">
              Active
            </span>
          )}
        </Fragment>
      ),
    },
    {
      attrs: { datatitle: t(" superAdminVendorManagement.null") },
      dataField: "null",
      text: t("superAdminVendorManagement.null"),
      formatter: (cellContent, row, rowIndex) => (
        <Fragment>
          {!row.user.isActive || !row.isApproved ? (
            <span
              className="pointer"
              style={{ fontSize: "12px", color: "#587E85" }}
              title="Activate"
              onClick={(e) => isChangedStatus(row)}
            >
              <u>Activate</u>
            </span>
          ) : (
            <span
              className="pointer"
              style={{ fontSize: "12px", color: "#e76f2a" }}
              title="Deactivate"
              onClick={(e) => isChangedStatus(row)}
            >
              <u>Deactivate</u>
            </span>
          )}
        </Fragment>
      ),
    },
  ];

  return (
    <Page>
      {showLoader && <Loader />}
      <Row className="align-items-center">
        <Col md="7">
          <h2 class="page-title mb-md-0 mb-4">
            {t("superAdminVendorManagement.manageVendors")}
          </h2>
        </Col>
      </Row>
      <div className="d-sm-flex my-4 py-2 justify-content-between align-items-center">
        <div className={"search-box " + styles["search"]}>
          <input
            type="text"
            placeholder={`${t("accountOwner.searchByName")}/${t("Email")}`}
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
        <div className="member-filter review-rating-filter">
          <Select
            options={options}
            defaultValue={options.find((item) => item.value === selectedOption)}
            className={["react-select-container pl-2"]}
            onChange={updateSelectedOptions}
            isSearchable={false}
            classNamePrefix="react-select"
          />
        </div>
      </div>
      {!!vendorListing?.length ? (
        <div className="vendor-table">
          <Table
            keyField="id"
            data={vendorListing}
            columns={columns}
            handlePagination={(e) => setPageNumber(e)}
            pageNumber={pageNumber}
            totalItems={totalItems}
            pageSize={pageSize}
          />
        </div>
      ) : (
        <Empty Message={t("superAdmin.noDataAvaliable")} />
      )}

      <ChangedStatus
        t={t}
        isDeactive={isDeactive}
        updateStatus={updateStatus}
        closeStatusModel={closeStatusModel}
        showLoader={showLoader}
      />
    </Page>
  );
};

export default withTranslation()(ManageVendors);
