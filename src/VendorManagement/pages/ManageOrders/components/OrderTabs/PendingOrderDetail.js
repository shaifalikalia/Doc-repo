import React, { Fragment } from "react";
import styles from "./../../ManageOrders.module.scss";
import "./../../Orders.scss";
import { withTranslation } from "react-i18next";
import Table from "components/table";
import { convertIntoTwoDecimal } from "utils";

import Card from "components/Card";

const PendingOrderDetail = ({
  t,
  vendorOrderProductDetails,
  totalAmount,
  details,
}) => {
  const columns = [
    {
      attrs: { datatitle: t("vendorManagement.orderItem") },
      dataField: "orderItem",
      text: t("vendorManagement.orderItem"),
      formatter: (cellContent, row, rowIndex) => (
        <Fragment>{row?.vendorCatalogue?.productName}</Fragment>
      ),
    },
    {
      attrs: { datatitle: t("vendorManagement.sKUNo") },
      dataField: "sKUNo",
      text: t("vendorManagement.sKUNo"),
      formatter: (cellContent, row, rowIndex) => (
        <Fragment>{row?.vendorCatalogue?.productId}</Fragment>
      ),
    },
    {
      attrs: { datatitle: t("vendorManagement.price") },
      dataField: "price",
      text: t("vendorManagement.price"),
      formatter: (cellContent, row, rowIndex) => (
        <Fragment>CAD {convertIntoTwoDecimal(row?.unitPrice)}</Fragment>
      ),
    },
    {
      attrs: { datatitle: t("vendorManagement.qty") },
      dataField: "qty",
      text: t("vendorManagement.qty"),
      formatter: (cellContent, row, rowIndex) => (
        <Fragment>{`${row?.totalQuantity}X`}</Fragment>
      ),
    },
    {
      attrs: { datatitle: t("vendorManagement.totalPrice") },
      dataField: "totalPrice",
      text: t("vendorManagement.totalPrice"),
      formatter: (cellContent, row, rowIndex) => (
        <Fragment>
          CAD {convertIntoTwoDecimal(row?.totalQuantity * row?.unitPrice)}
        </Fragment>
      ),
    },
  ];
  return (
    <Fragment>
      <div
        className={
          "table-td-last-50 cancelled-table " + styles["cancelled-table"]
        }
      >
        <Table
          keyField="id"
          data={vendorOrderProductDetails}
          columns={columns}
        />
      </div>
      <Card
        className={
          styles["not-shipped-btn-card"] + " " + styles["total-refund"]
        }
      >
        <div
          className={
            "justify-content-md-end " +
            styles["text-box"] +
            " " +
            styles["text-box2"]
          }
        >
          <div>
            <div className={"mb-2 " + styles["custom-text-box"]}>
              {" "}
              <div className={styles["label"]}>
                {t("vendorManagement.itemTotal")}{" "}
              </div>
              <div className={styles["value"]}>
                {t("vendorManagement.cad")}{" "}
                {convertIntoTwoDecimal(details?.totalAmount)}
              </div>{" "}
            </div>
            <div className={"mb-2 " + styles["custom-text-box"]}>
              {" "}
              <div className={styles["label"]}>
                {t("vendorManagement.promocode")}{" "}
              </div>{" "}
              <div className={styles["value"]}>
                {" "}
                - {t("vendorManagement.cad")}{" "}
                {convertIntoTwoDecimal(details?.totalPromoCodeDiscount)}
              </div>
            </div>
            <div className={"mb-2 " + styles["custom-text-box"]}>
              {" "}
              <div className={styles["label"]}>
                {" "}
                {t("vendorManagement.taxes")}{" "}
              </div>{" "}
              <div className={styles["value"]}>
                + {t("vendorManagement.cad")}{" "}
                {convertIntoTwoDecimal(details?.totalTaxApplied)}
              </div>
            </div>

            <div className={styles["custom-text-box"]}>
              <div className={styles["label"]}>
                {" "}
                {t("vendorManagement.grandTotal")}
              </div>{" "}
              <div className={styles["value"]}>
                {t("vendorManagement.cad")} {convertIntoTwoDecimal(totalAmount)}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Fragment>
  );
};

export default withTranslation()(PendingOrderDetail);
