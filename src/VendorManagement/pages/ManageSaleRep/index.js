import React from "react";
import LayoutVendor from "../../components/LayoutVendor";
import { withTranslation } from "react-i18next";
import Page from "components/Page";
import styles from "./ManageSaleRep.module.scss";
import "./ManageSaleRep.scss";
import Table from "components/table";
import { Col, Row } from "reactstrap";
import "../../VendorCommon.scss";
import useSalesRepList from "./hooks/useSalesRepList";
import Loader from "components/Loader";
import Empty from "components/Empty";
import ModuleDisabled from "components/ModuleDisabled";

const ManageSaleRep = ({ t }) => {
  const { state, otherData, methods } = useSalesRepList({ t });
  const { columnData, totalItems, currentPage, searchTerm } = state;
  const { loading, columns, pageSize } = otherData;
  const { handlePageNumber, handleSearchTerm } = methods;

  return (
    <LayoutVendor>
      <Page className={"vendor-page-pt-16"}>
        <ModuleDisabled
          isOpen={state.showDisableModel}
          closeModal={() => methods.closeModel()}
          content={state.content}
        />
        {loading && <Loader />}
        <Row className="align-items-center">
          <Col md="7">
            <h2 className="page-title mt-0 mb-md-0 mb-3">
              {t("vendorManagement.manageSalesRepresentative")}
            </h2>
          </Col>
          <Col md="5" className="text-md-right">
            <button
              onClick={methods.handleRedirect}
              className={`button w-sm-100 button-round button-shadow ${state.disabledClass}`}
              title={t("vendorManagement.inviteSalesRep")}
            >
              {t("vendorManagement.inviteSalesRep")}
            </button>
          </Col>
        </Row>
        <div className="d-sm-flex my-md-4 my-3 py-md-2 justify-content-between align-items-center">
          <div className={"search-box " + styles["search"]}>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchTerm}
              placeholder={t("accountOwner.searchByName")}
            />
            <span className="ico">
              <img
                src={require("assets/images/search-icon.svg").default}
                alt="icon"
              />
            </span>
          </div>
        </div>
        {!!columnData.length && (
          <div className="table-td-last-50 td-first-col-color common-fw-400 sales-representative-table shadow-responsive">
            <Table
              keyField="id"
              data={columnData}
              columns={columns}
              handlePagination={handlePageNumber}
              pageNumber={currentPage}
              totalItems={totalItems}
              pageSize={pageSize}
            />
          </div>
        )}
        {!columnData.length && (
          <div className={styles["empty-list"]}>
            <Empty Message={t("vendorManagement.noItemAvailable")} />
          </div>
        )}
      </Page>
    </LayoutVendor>
  );
};

export default withTranslation()(ManageSaleRep);
