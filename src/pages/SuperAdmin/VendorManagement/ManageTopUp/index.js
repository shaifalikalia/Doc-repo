import React, { Fragment } from "react";
import { withTranslation } from "react-i18next";
import Page from "components/Page";
import "./topUp.scss";
import AddTopUpModal from "./components/AddTopUp";
import Table from "components/table";
import { Col, Row } from "reactstrap";
import Select from "react-select";
import useTopUp from "../Hooks/useTopUp";
import Empty from "components/Empty";
import { convertIntoTwoDecimal } from "utils";
import Loader from "components/Loader";
import ChangeStatusModal from "components/ChangeStatusModal";

const ManageTopUp = ({ t }) => {
  const { data, methods } = useTopUp({ t });

  const columns = [
    {
      attrs: { datatitle: t("superAdminTopUp.topUpName") },
      dataField: "name",
      text: t("superAdminTopUp.topUpName"),
    },
    {
      attrs: { datatitle: t("superAdminTopUp.noOfPromotions") },
      dataField: "numberOfPromotions",
      text: t("superAdminTopUp.noOfPromotions"),
    },
    {
      attrs: { datatitle: t("superAdminTopUp.price") },
      dataField: "price",
      text: t("superAdminTopUp.price"),
      formatter: (cellContent, row, rowIndex) => (
        <span> CAD {`${convertIntoTwoDecimal(row?.price)}`}</span>
      ),
    },
    {
      attrs: { datatitle: t("superAdminTopUp.status") },
      dataField: "status",
      text: t("superAdminTopUp.status"),
      formatter: (cellContent, row, rowIndex) => (
        <>
          {row.isActive ? (
            <span> {t("active")} </span>
          ) : (
            <span> {t("inactive")} </span>
          )}
        </>
      ),
    },

    {
      attrs: { datatitle: t(" superAdminTopUp.deactivate") },
      dataField: "deactivate",
      text: t("superAdminTopUp.deactivate"),
      formatter: (cellContent, row, rowIndex) => (
        <Fragment>
          <span
            className="table-row-main-link"
            onClick={() => {
              data.setOpenModel({
                isOpen: true,
                type: data.modelType.EDIT,
                ...row,
              });
            }}
          >
            <u>{t("edit")}</u>{" "}
          </span>
          {!row.isActive ? (
            <span
              className="pointer"
              style={{ color: "#587E85" }}
              onClick={() => {
                methods.openStatusChangeModel(row);
              }}
              title="Activate"
            >
              <u>Activate</u>
            </span>
          ) : (
            <span
              className="pointer"
              style={{ color: "#e76f2a" }}
              onClick={() => {
                methods.openStatusChangeModel(row);
              }}
              title="Deactivate"
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
      {data.isLoading && <Loader />}
      <Row className="align-items-center">
        <Col md="7">
          <h2 class="page-title mb-md-0 mb-4">
            {t("superAdminTopUp.manageTopUpPromotions")}
          </h2>
        </Col>
        <Col md="5" className="text-md-right add-topUp">
          <div
            onClick={() => {
              data.setOpenModel({
                isOpen: true,
                type: data.modelType.ADD,
              });
            }}
            className="button button-round button-shadow"
            title={t("superAdminTopUp.addPromotion")}
          >
            {t("superAdminTopUp.addPromotion")}
          </div>
        </Col>
      </Row>
      <div className="d-sm-flex my-4 py-2 justify-content-between align-items-center">
        <div className={"search-box "}>
          <input
            type="text"
            placeholder={t("superAdminTopUp.searchByName")}
            onChange={methods.handleSearch}
            value={data.searchText}
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
            options={data.options}
            defaultValue={data.selectedOption}
            className={["react-select-container pl-2"]}
            onChange={methods.handleStatus}
            classNamePrefix="react-select"
          />
        </div>
      </div>
      <div className="topUp-table">
        {!!data.promotionList.length ? (
          <Table
            keyField="id"
            data={data.promotionList}
            columns={columns}
            handlePagination={methods.updatePageNumber}
            pageNumber={data.pageNumber}
            totalItems={data.totalItems}
            pageSize={data.PAGE_SIZE}
          />
        ) : (
          <Empty Message={t("superAdmin.noDataAvaliable")} />
        )}
      </div>

      <AddTopUpModal
        addTopUpModalOpen={data.openModel.isOpen}
        setAddTopUpModalOpen={data.setOpenModel}
        details={data.openModel}
        isLoading={data.isLoading}
        methods={methods}
      />

      <ChangeStatusModal
        t={t}
        description={data.statusDescription}
        buttonTitle={data.statusTitle}
        isOpen={data.statusChangeIsOpen}
        closeModal={methods.closeStausModel}
        isSubmit={methods.statusChange}
        isLoading={data.isLoading}
      />
    </Page>
  );
};

export default withTranslation()(ManageTopUp);
