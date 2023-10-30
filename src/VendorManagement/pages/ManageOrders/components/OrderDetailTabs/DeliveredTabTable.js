import React, { Fragment } from "react";
import styles from "./../../ManageOrders.module.scss";
import { withTranslation } from "react-i18next";
import Table from "components/table";
import Empty from "components/Empty";
import { convertIntoTwoDecimal, isValueEmpty } from "utils";

const DeliveredTabTable = ({ t, data }) => {
  const columns = [
    {
      attrs: { datatitle: t("accountOwner.date") },
      dataField: "date",
      text: t("accountOwner.date"),
    },
    {
      attrs: { datatitle: t("vendorManagement.itemName") },
      text: t("vendorManagement.itemName"),
      dataField: "col-2",
      formatter: (cellContent, row) => {
        const { vendorOrderProductShipment = [] } = row;
        return (
          <Fragment>
            {vendorOrderProductShipment?.map((item, idx) => {
              const { productName } = item;
              return <div key={idx}>{isValueEmpty(productName)}</div>;
            })}
          </Fragment>
        );
      },
    },
    {
      attrs: { datatitle: t("vendorManagement.sKUNo") },
      text: t("vendorManagement.sKUNo"),
      dataField: "col-3",
      formatter: (cellContent, row) => {
        const { vendorOrderProductShipment = [] } = row;
        return (
          <Fragment>
            {vendorOrderProductShipment?.map((item, idx) => {
              const { productId } = item;
              return <div key={idx}>{isValueEmpty(productId)}</div>;
            })}
          </Fragment>
        );
      },
    },
    {
      attrs: { datatitle: t("vendorManagement.price") },
      text: t("vendorManagement.price"),
      dataField: "col-4",
      formatter: (cellContent, row) => {
        const { vendorOrderProductShipment = [] } = row;
        return (
          <Fragment>
            {vendorOrderProductShipment.map((item, idx) => {
              const { unitPrice } = item;
              return (
                <div key={idx}>CAD {convertIntoTwoDecimal(unitPrice)}</div>
              );
            })}
          </Fragment>
        );
      },
    },
    {
      attrs: { datatitle: t("vendorManagement.qtyShipped") },
      text: t("vendorManagement.qtyShipped"),
      dataField: "col-5",
      formatter: (cellContent, row) => {
        const { vendorOrderProductShipment = [] } = row;
        return (
          <Fragment>
            {vendorOrderProductShipment?.map((item, idx) => {
              const { quantityShipped } = item;
              return <div key={idx}>{isValueEmpty(quantityShipped)}x</div>;
            })}
          </Fragment>
        );
      },
    },
    {
      attrs: { datatitle: t("vendorManagement.totalPrice") },
      text: t("vendorManagement.totalPrice"),
      dataField: "col-6",
      formatter: (cellContent, row) => {
        const { vendorOrderProductShipment = [] } = row;
        return (
          <Fragment>
            {vendorOrderProductShipment?.map((item, idx) => {
              const { totalAmount } = item;
              return (
                <div key={idx}>CAD {convertIntoTwoDecimal(totalAmount)}</div>
              );
            })}
          </Fragment>
        );
      },
    },
  ];

  if (!data?.length) {
    return (
      <>
        <Empty Message={t("vendorManagement.noneDeliveredMsg")} />
      </>
    );
  }

  return (
    <Fragment>
      <div className={"pt-2 table-td-last-50 " + styles["order-detail-table"]}>
        <Table keyField="id" data={data} columns={columns} />
      </div>
    </Fragment>
  );
};

export default withTranslation()(DeliveredTabTable);
