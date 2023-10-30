import React, { Fragment } from "react";
import LayoutVendor from "../../components/LayoutVendor";
import { withTranslation } from "react-i18next";
import Page from "components/Page";
import styles from "./ManageCustomers.module.scss";
import "./Customers.scss";
import Table from "components/table";
import { Link } from "react-router-dom";
import { Col, Row } from "reactstrap";
import Select from "react-select";
import constants from "../../../constants";
import useManageCustomers from "./hooks/useManageCustomers";
import Loader from "components/Loader";
import Empty from "components/Empty";

const ManageCustomers = ({ t }) => {
  const { data, methods } = useManageCustomers({ t });
  const {
    customersList,
    PAGE_SIZE,
    totalItems,
    currentPage,
    loading,
    options,
    selectedOption,
  } = data;
  const { handlePageNumber, handleSearchTerm, handleSelectOption } = methods;

  const columns = [
    {
      attrs: { datatitle: t("vendorManagement.officeName") },
      dataField: "officeName",
      text: t("vendorManagement.officeName"),
      formatter: (cellContent, row) => {
        const { to } = row;
        return (
          <Fragment>
            <Link to={to} className="table-row-main-link">
              {cellContent}
            </Link>
          </Fragment>
        );
      },
    },
    {
      attrs: { datatitle: t("superAdmin.accountOwnerName") },
      dataField: "accountOwnerName",
      text: t("superAdmin.accountOwnerName"),
    },
    {
      attrs: { datatitle: t("vendorManagement.billMeLaterAccess") },
      dataField: "billMeLaterAccess",
      text: t("vendorManagement.billMeLaterAccess"),
    },
  ];

  return (
    <LayoutVendor>
      <Page className={"vendor-page-pt-16"}>
        {loading && <Loader />}
        <Row className="align-items-center">
          <Col md="7">
            <h2 className="page-title mt-0 mb-md-0 mb-4">
              {t("vendorManagement.manageCustomers")}
            </h2>
          </Col>
          <Col md="5" className="text-md-right">
            <Link
              to={constants.routes.vendor.inviteCustomers}
              className="button w-sm-100 button-round button-shadow"
              title={t("vendorManagement.inviteCustomers")}
            >
              {t("vendorManagement.inviteCustomers")}
            </Link>
          </Col>
        </Row>
        <div className="d-sm-flex my-4 py-md-2 justify-content-between align-items-center">
          <div className={"search-box " + styles["search"]}>
            <input
              onChange={handleSearchTerm}
              type="text"
              placeholder={t("accountOwner.searchByName")}
            />
            <span className="ico">
              <img
                src={require("assets/images/search-icon.svg").default}
                alt="icon"
              />
            </span>
          </div>
          <div className={"member-filter review-rating-filter customer-icon"}>
            <Select
              options={options}
              defaultValue={selectedOption}
              className={["react-select-container "]}
              onChange={handleSelectOption}
              classNamePrefix="react-select"
            />
          </div>
        </div>
        {!!customersList?.length && (
          <div className="manage-customer-table table-td-last-50 common-fw-400 shadow-responsive">
            <Table
              keyField="id"
              data={customersList}
              columns={columns}
              handlePagination={handlePageNumber}
              pageNumber={currentPage}
              totalItems={totalItems}
              pageSize={PAGE_SIZE}
            />
          </div>
        )}
        {!customersList?.length && (
          <Empty Message={t("vendorManagement.noCustomersFound")} />
        )}
      </Page>
    </LayoutVendor>
  );
};

export default withTranslation()(ManageCustomers);
