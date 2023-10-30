import React, { Fragment } from "react";
import styles from "./../../ManageOrders.module.scss";
import { withTranslation } from "react-i18next";
import Table from "components/table";
import Card from "components/Card";
import Empty from "components/Empty";
import { convertIntoTwoDecimal } from "utils";

const CancelledTabTable = ({ t, data }) => {
  const {
    grandTotal,
    products = [],
    itemTotal,
    totalPromoCodeDiscount,
    totalTaxPrice,
  } = data || {};

  const columnData = products?.map((item, idx) => {
    const {
      productName,
      productId,
      quantityCancelled,
      unitPrice,
      totalAmount,
    } = item;
    return {
      id: idx,
      productName,
      productId,
      qty: `${quantityCancelled}x`,
      price: `CAD ${convertIntoTwoDecimal(unitPrice)}`,
      totalPrice: `CAD ${convertIntoTwoDecimal(totalAmount)}`,
    };
  });

  const columns = [
    {
      attrs: { datatitle: t("vendorManagement.orderItem") },
      dataField: "productName",
      text: t("vendorManagement.orderItem"),
    },
    {
      attrs: { datatitle: t("vendorManagement.sKUNo") },
      dataField: "productId",
      text: t("vendorManagement.sKUNo"),
    },
    {
      attrs: { datatitle: t("vendorManagement.price") },
      dataField: "price",
      text: t("vendorManagement.price"),
    },
    {
      attrs: { datatitle: t("vendorManagement.qty") },
      dataField: "qty",
      text: t("vendorManagement.qty"),
    },
    {
      attrs: { datatitle: t("vendorManagement.totalPrice") },
      dataField: "totalPrice",
      text: t("vendorManagement.totalPrice"),
    },
  ];

  if (!data || !data?.products?.length) {
    return (
      <>
        <Empty Message={t("vendorManagement.noneCancelledMsg")} />
      </>
    );
  }

  return (
    <Fragment>
      <div className={"pt-2 table-td-last-50 " + styles["cancelled-table"]}>
        <Table keyField="id" data={columnData} columns={columns} />
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
                {t("vendorManagement.itemAmount")}{" "}
              </div>
              <div className={styles["value"]}>
                {t("vendorManagement.cad")} {convertIntoTwoDecimal(itemTotal)}
              </div>{" "}
            </div>
            <div className={"mb-2 " + styles["custom-text-box"]}>
              {" "}
              <div className={styles["label"]}>
                {t("vendorManagement.promocode")}{" "}
              </div>
              <div className={styles["value"]}>
                - {t("vendorManagement.cad")}{" "}
                {convertIntoTwoDecimal(totalPromoCodeDiscount)}
              </div>{" "}
            </div>
            <div className={"mb-3 " + styles["custom-text-box"]}>
              {" "}
              <div className={styles["label"]}>
                {t("vendorManagement.taxes")}{" "}
              </div>
              <div className={styles["value"]}>
                + {t("vendorManagement.cad")}{" "}
                {convertIntoTwoDecimal(totalTaxPrice)}
              </div>{" "}
            </div>
            <div className={" " + styles["custom-text-box"]}>
              {" "}
              <div className={styles["label"]}>
                {t("vendorManagement.totalRefundableAmount")}{" "}
              </div>
              <div className={styles["value"]}>
                + {t("vendorManagement.cad")}{" "}
                {convertIntoTwoDecimal(grandTotal)}
              </div>{" "}
            </div>
          </div>
        </div>
      </Card>
    </Fragment>
  );
};

export default withTranslation()(CancelledTabTable);
