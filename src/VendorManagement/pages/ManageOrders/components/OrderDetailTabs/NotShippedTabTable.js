import React, { Fragment } from "react";
import styles from "./../../ManageOrders.module.scss";
import { withTranslation } from "react-i18next";
import Table from "components/table";
import Card from "components/Card";
import CancelItemsModal from "../Modals/CancelItemsModal";
import Empty from "components/Empty";
import constants from "../../../../../constants";
import TraceOrderModel from "../Modals/TraceOrderModel";

const NotShippedTabTable = ({ t, data, ...props }) => {
  const {
    openCancelItemsModal,
    closeCancelItemsModal,
    isCancelItemsModalOpen,
    handleSelectItems,
    handleQuantity,
    openTrackModel,
    markAsCancelled,
    loading,
    handleSelectAllItems,
    isAnyNotShippedItemSelected,
    closeTrackModel,
    isTrackOrderModel,
    markAsShipped,
  } = props;

  const columns = [
    {
      //attrs: { datatitle: t('vendorManagement.checkbox') },
      dataField: "checkbox",
      text: "",
      formatter: (cellContent, row, rowIndex) => {
        const { selected } = row;
        return (
          <div className="ch-checkbox">
            <label className="cursor-pointer">
              <input
                type="checkbox"
                checked={!!selected}
                onChange={(e) => handleSelectItems(e, rowIndex)}
              />
              <span>&nbsp; </span>
            </label>
          </div>
        );
      },
    },
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
      attrs: { datatitle: t("vendorManagement.qtyShipped") },
      dataField: "quantityShipped",
      text: t("vendorManagement.qtyShipped"),
    },
    {
      attrs: { datatitle: t("vendorManagement.qtyRemaining") },
      dataField: "quantityRemaining",
      text: t("vendorManagement.qtyRemaining"),
    },
    {
      attrs: { datatitle: t("vendorManagement.totalQty") },
      dataField: "quantityAccepted",
      text: t("vendorManagement.totalQty"),
    },

    {
      //  attrs: { datatitle: t('vendorManagement.actions') },
      dataField: "actions",
      text: "",
      formatter: (cellContent, row, rowIndex) => {
        const { quantityRemaining, selectedQuantity, isSelectedAll, selected } =
          row;
        return (
          <div
            className={`${styles["table-radio-number-col"]} ${
              selected ? "" : "disable-btns"
            }`}
          >
            <div className={"ch-radio " + styles["ch-radio"]}>
              <label>
                <input
                  type="radio"
                  name={`all-selected-${rowIndex}`}
                  checked={
                    selected &&
                    isSelectedAll &&
                    quantityRemaining === selectedQuantity
                  }
                  onChange={(e) => {
                    e.stopPropagation();
                    handleSelectAllItems(
                      row,
                      rowIndex,
                      constants.selectType.selectAll
                    );
                  }}
                />
                <span> {t("vendorManagement.selectAll")} </span>
              </label>

              <label>
                <input
                  type="radio"
                  name={`few-selected-${rowIndex}`}
                  checked={
                    selected &&
                    (!isSelectedAll || quantityRemaining !== selectedQuantity)
                  }
                  onChange={(e) => {
                    e.stopPropagation();
                    handleSelectAllItems(
                      row,
                      rowIndex,
                      constants.selectType.selectQuantity
                    );
                  }}
                />
                <span> {t("vendorManagement.selectQty")}</span>
              </label>
            </div>
            <div className={styles["input-number"]}>
              <div
                className={styles["img-box"]}
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuantity(row, rowIndex, "-");
                }}
              >
                {" "}
                -{" "}
              </div>
              <span>{selectedQuantity || quantityRemaining}</span>
              <div
                className={styles["img-box"]}
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuantity(row, rowIndex);
                }}
              >
                +{" "}
              </div>
            </div>
          </div>
        );
      },
    },
  ];

  if (!data?.length) {
    return (
      <>
        <Empty Message={t("vendorManagement.noNonShippedMsg")} />
      </>
    );
  }
  return (
    <Fragment>
      <div className={"pt-2 " + styles["not-shipped-table"]}>
        <Table
          keyField="vendorOrderProductDetailId"
          data={data}
          columns={columns}
        />
      </div>
      {isAnyNotShippedItemSelected() && (
        <Card className={styles["not-shipped-btn-card"]}>
          <div className={styles["btn-box"]}>
            <button
              onClick={openTrackModel}
              className="button button-round button-dark btn-small-40 button-border mr-3 mb-3 mb-md-4"
              title={t("vendorManagement.markedAsShipped")}
            >
              {t("vendorManagement.markedAsShipped")}
            </button>
            <button
              onClick={openCancelItemsModal}
              className="button button-round button-dark  btn-small-40  button-border mr-3"
              title={t("vendorManagement.cancelItems")}
            >
              {t("vendorManagement.cancelItems")}
            </button>
          </div>
        </Card>
      )}
      {isCancelItemsModalOpen && (
        <CancelItemsModal
          loading={loading}
          isCancelItemsModalOpen={isCancelItemsModalOpen}
          closeCancelItemsModal={closeCancelItemsModal}
          itemsToCancel={data?.filter((item) => item.selected) || []}
          markAsCancelled={markAsCancelled}
        />
      )}

      {isTrackOrderModel && (
        <TraceOrderModel
          closeModel={closeTrackModel}
          markAsShipped={markAsShipped}
        />
      )}
    </Fragment>
  );
};

export default withTranslation()(NotShippedTabTable);
