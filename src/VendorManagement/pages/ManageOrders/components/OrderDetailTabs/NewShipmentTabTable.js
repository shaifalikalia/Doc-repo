import React, { Fragment, useState } from "react";
import styles from "./../../ManageOrders.module.scss";
import { withTranslation } from "react-i18next";
import Table from "components/table";
import { convertIntoTwoDecimal } from "utils";
import Empty from "components/Empty";
import TrackOrderDetails from "./TrackOrderDetails";

const DetailTabTable = ({ t, data, exportOrder }) => {
  const [traceDetails, setTraceDetails] = useState(null);

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
        const { products = [] } = row;
        return (
          <Fragment>
            {products.map((item, idx) => {
              const { productName } = item;
              return <div key={idx}>{productName}</div>;
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
        const { products = [] } = row;
        return (
          <Fragment>
            {products.map((item, idx) => {
              const { productId } = item;
              return <div key={idx}>{productId}</div>;
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
        const { products = [] } = row;
        return (
          <Fragment>
            {products.map((item, idx) => {
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
        const { products = [] } = row;
        return (
          <Fragment>
            {products.map((item, idx) => {
              const { quantityShipped } = item;
              return <div key={idx}>{quantityShipped}x</div>;
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
        const { products = [] } = row;
        return (
          <Fragment>
            {products.map((item, idx) => {
              const { totalAmount } = item;
              return (
                <div key={idx}>CAD {convertIntoTwoDecimal(totalAmount)}</div>
              );
            })}
          </Fragment>
        );
      },
    },
    {
      dataField: "col-7",
      text: "",
      formatter: (cellContent, row, rowIndex) => (
        <Fragment>
          <span
            className="link-btn"
            onClick={() => {
              exportOrder(row?.id);
            }}
          >
            {" "}
            {t("vendorManagement.exportShipmentDetails")}
          </span>

          <span
            className="link-btn"
            onClick={() => {
              setTraceDetails(row?.trackingDetail);
            }}
          >
            {" "}
            {t("vendorManagement.viewTrackingDetails")}
          </span>
        </Fragment>
      ),
    },
  ];

  if (!data?.length) {
    return (
      <>
        <Empty Message={t("vendorManagement.noNewShipmentMsg")} />
      </>
    );
  }

  return (
    <Fragment>
      <div className={"pt-2  " + styles["order-detail-table"]}>
        <Table keyField="id" data={data} columns={columns} />
      </div>

      {traceDetails && (
        <TrackOrderDetails
          trackDetails={traceDetails}
          closeModel={() => setTraceDetails(null)}
        />
      )}
    </Fragment>
  );
};

export default withTranslation()(DetailTabTable);
