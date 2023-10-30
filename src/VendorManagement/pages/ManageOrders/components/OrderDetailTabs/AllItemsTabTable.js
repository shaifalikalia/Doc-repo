import React, { Fragment } from "react";
import styles from "./../../ManageOrders.module.scss";
import { withTranslation } from "react-i18next";
import Table from "components/table";
import Card from "components/Card";
import Empty from "components/Empty";
import { orderStatus } from "../../../../../constants";
import { convertIntoTwoDecimal } from "utils";

const AllItemsTabTable = ({ t, data }) => {
  const {
    grandTotal,
    refundTotal,
    products = [],
    totalPromoCodeDiscount,
    totalTaxPrice,
    itemTotal,
  } = data || {};
  const columnData = products?.map((item, idx) => {
    const {
      productName,
      productId,
      unitPrice,
      totalQuantity,
      quantityShipped,
      quantityRemaining,
      quantityCancelled,
      totalAmount,

      status,
    } = item;
    return {
      id: idx,
      productName,
      productId,
      price: `CAD ${convertIntoTwoDecimal(unitPrice)}`,
      totalQty: `${totalQuantity}x`,
      qtyShipped: `${quantityShipped}x`,
      qtyRemaining: `${quantityRemaining}x`,
      qtyCancelled: `${quantityCancelled}x`,
      totalPrice: `CAD ${convertIntoTwoDecimal(totalAmount)}`,
      status: status === 2 ? orderStatus(status, true) : orderStatus(status),
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
      attrs: { datatitle: t("vendorManagement.totalQty") },
      dataField: "totalQty",
      text: t("vendorManagement.totalQty"),
    },
    {
      attrs: { datatitle: t("vendorManagement.qtyShipped") },
      dataField: "qtyShipped",
      text: t("vendorManagement.qtyShipped"),
    },
    {
      attrs: { datatitle: t("vendorManagement.qtyRemaining") },
      dataField: "qtyRemaining",
      text: t("vendorManagement.qtyRemaining"),
    },
    {
      attrs: { datatitle: t("vendorManagement.qtyCancelled") },
      dataField: "qtyCancelled",
      text: t("vendorManagement.qtyCancelled"),
    },
    {
      attrs: { datatitle: t("vendorManagement.totalPrice") },
      dataField: "totalPrice",
      text: t("vendorManagement.totalPrice"),
    },
    {
      attrs: { datatitle: t("status") },
      dataField: "status",
      text: t("status"),
    },
  ];

  if (!data) {
    return (
      <>
        <Empty Message={t("vendorManagement.noDataFound")} />
      </>
    );
  }

  return (
    <Fragment>
      <div className={"pt-2 table-td-last-50"}>
        <Table keyField="id" data={columnData} columns={columns} />
      </div>
      <Card
        className={
          styles["all-items-btn-card"] + " " + styles["not-shipped-btn-card"]
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
            {t("vendorManagement.itemTotal")}
            <div className="mt-3">{t("vendorManagement.promocode")}</div>
            <div className="mt-3">{t("vendorManagement.taxes")}</div>
            <div className="mt-3">
              {t("vendorManagement.refundTotalCancelledItemsAndQuantities")}
            </div>
            <div className="mt-3">{t("vendorManagement.grandTotal")}</div>
          </div>

          <div className="text-right">
            CAD {convertIntoTwoDecimal(itemTotal)}
            <div className="mt-3">
              - CAD {convertIntoTwoDecimal(totalPromoCodeDiscount)}
            </div>
            <div className="mt-3">
              + CAD {convertIntoTwoDecimal(totalTaxPrice)}
            </div>
            <div className="mt-3">
              {" "}
              CAD {convertIntoTwoDecimal(refundTotal)}
            </div>
            <div className="mt-3"> CAD {convertIntoTwoDecimal(grandTotal)}</div>
          </div>
        </div>
      </Card>
    </Fragment>
  );
};

export default withTranslation()(AllItemsTabTable);
