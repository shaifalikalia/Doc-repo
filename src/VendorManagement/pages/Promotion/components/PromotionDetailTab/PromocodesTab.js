import React, { Fragment } from "react";
import styles from "./../../Promotion.module.scss";
import { withTranslation } from "react-i18next";
import Table from "components/table";

const PromocodesTab = ({ t, vendorPromoCode }) => {
  let discountData = [
    {
      promoCode: "--",
      discountAllowed: "--",
    },
  ];
  if (vendorPromoCode) {
    discountData = [vendorPromoCode];
  }

  const columns = [
    {
      attrs: { datatitle: t("vendorManagement.promocodes") },
      dataField: "promoCode",
      text: t("vendorManagement.promocodes"),
    },
    {
      attrs: { datatitle: t("vendorManagement.discountAllowed") },
      dataField: "discountAllowed",
      text: t("vendorManagement.discountAllowed"),
      formatter: (cellContent, row) => {
        return <span> {row.discountAllowed}% </span>;
      },
    },
  ];

  return (
    <Fragment>
      <div
        className={
          "table-td-last-50 " +
          styles["tab-table-list"] +
          " table-td-last-50-invoices"
        }
      >
        <Table keyField="id" data={discountData} columns={columns} />
      </div>
    </Fragment>
  );
};

export default withTranslation()(PromocodesTab);
