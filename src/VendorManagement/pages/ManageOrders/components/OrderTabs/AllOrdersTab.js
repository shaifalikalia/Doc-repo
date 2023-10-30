import React, { Fragment } from "react";
import styles from "./../../ManageOrders.module.scss";
import { withTranslation } from "react-i18next";
import Table from "components/table";
import DatePicker from "react-datepicker";
import constants, {
  orderStatus,
  paymentMethodStatus,
  paymentStatus,
} from "../../../../../constants";
import { useManageOrders } from "../../Hooks/useManageOrders";
import Loader from "components/Loader";
import moment from "moment";
import Empty from "components/Empty";
import { useHistory } from "react-router-dom";
import { encodeId, convertIntoTwoDecimal } from "utils";

const AllOrdersTab = ({ t, status }) => {
  const PAGE_SIZE = 10;
  const history = useHistory();
  const {
    pageNumber,
    searchText,
    date,
    isLoading,
    orderListing,
    totalItems,
    changeDate,
    handleChange,
    updatePageNumber,
  } = useManageOrders({ status, PAGE_SIZE });

  const moveToOrderDetailsPage = (id) => {
    history.push(
      constants.routes.vendor.orderDetail.replace(":orderId", encodeId(id))
    );
  };

  const formatDate = (dateToFormat) => {
    return moment(dateToFormat).format("MMM DD, YYYY");
  };

  const columns = [
    {
      attrs: { datatitle: t("vendorManagement.orderNo") },
      dataField: "orderNo",
      text: t("vendorManagement.orderNo"),

      formatter: (cellContent, row, rowIndex) => (
        <Fragment>
          <span
            className="link-btn"
            onClick={() => moveToOrderDetailsPage(row.id)}
          >
            {row?.orderNumber}
          </span>
        </Fragment>
      ),
    },
    {
      attrs: { datatitle: t("vendorManagement.officeName") },
      dataField: "officeName",
      text: t("vendorManagement.officeName"),
    },
    {
      attrs: { datatitle: t("accountOwner.date") },
      dataField: "date",
      text: t("accountOwner.date"),
      formatter: (cellContent, row, rowIndex) => (
        <Fragment>{formatDate(row?.date)}</Fragment>
      ),
    },
    {
      attrs: { datatitle: t("vendorManagement.price") },
      dataField: "price",
      text: t("vendorManagement.price"),
      formatter: (cellContent, row, rowIndex) => (
        <Fragment>{convertIntoTwoDecimal(row.totalPayableAmount)}</Fragment>
      ),
    },
    {
      attrs: { datatitle: t("vendorManagement.payment") },
      dataField: "payment",
      text: t("vendorManagement.paymentMethod"),
      formatter: (cellContent, row, rowIndex) => (
        <Fragment>{paymentMethodStatus(row.paymentMethod)}</Fragment>
      ),
    },
    {
      attrs: { datatitle: t("vendorManagement.orderStatus") },
      dataField: "status",
      text: t("vendorManagement.orderStatus"),
      formatter: (cellContent, row, rowIndex) => (
        <Fragment>{orderStatus(row.status)}</Fragment>
      ),
    },

    {
      attrs: { datatitle: t("vendorManagement.paymentStatus") },
      dataField: "salesRepOrder",
      text: t("vendorManagement.paymentStatus"),
      formatter: (cellContent, row, rowIndex) => {
        return <Fragment>{paymentStatus(row.paymentStatus)}</Fragment>;
      },
    },
    {
      attrs: { datatitle: t("vendorManagement.salesRepOrder") },
      dataField: "salesRepOrder",
      text: t("vendorManagement.salesRepOrder"),
      formatter: (cellContent, row, rowIndex) => {
        let fullname = "--";
        if (
          row?.salesRepresentativeFirstName ||
          row?.salesRepresentativeLastName
        ) {
          fullname = `${row?.salesRepresentativeFirstName} ${
            row?.salesRepresentativeLastName
              ? row?.salesRepresentativeLastName
              : ""
          }`;
        }
        return <Fragment>{fullname}</Fragment>;
      },
    },
  ];

  return (
    <Fragment>
      {isLoading && <Loader />}
      <div className={styles["order-tabs-header"]}>
        <div className={"search-box " + styles["vendor-search"]}>
          <input
            type="text"
            value={searchText}
            onChange={handleChange}
            placeholder={t("vendorManagement.searchByOrderNoOfficeName")}
          />
          <span className="ico">
            <img
              src={require("assets/images/search-icon.svg").default}
              alt="icon"
            />
          </span>
        </div>
        <div className={styles["calendar-box"]}>
          <div className="c-field">
            <label>{t("from")}</label>
            <div className="d-flex inputdate">
              <DatePicker
                dateFormat="dd-MM-yyyy"
                className="c-form-control"
                selected={date.from}
                onSelect={(value) => changeDate({ from: value })}
                maxDate={date.to}
              />
            </div>
          </div>
          <div className="c-field">
            <label>{t("to")}</label>
            <div className="d-flex inputdate">
              <DatePicker
                popperPlacement="bottom-end"
                dateFormat="dd-MM-yyyy"
                className="c-form-control"
                selected={date.to}
                onSelect={(value) => changeDate({ to: value })}
                minDate={date.from}
              />
            </div>
          </div>
        </div>
      </div>
      <div
        className={
          "table-td-last-50 table-td-last-50-invoices common-fw-400 " +
          styles["order-table-list"]
        }
      >
        {orderListing?.length > 0 && (
          <Table
            keyField="id"
            handlePagination={updatePageNumber}
            data={orderListing}
            columns={columns}
            pageNumber={pageNumber}
            totalItems={totalItems}
            pageSize={PAGE_SIZE}
          />
        )}
        {!orderListing?.length > 0 && !isLoading && (
          <Empty Message={t("vendorManagement.noOrderForSelection")} />
        )}
      </div>
    </Fragment>
  );
};

export default withTranslation()(AllOrdersTab);
