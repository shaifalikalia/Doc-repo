import React, { Fragment } from "react";
import { withTranslation } from "react-i18next";
import Table from "components/table";
import "./../Customers.scss";
import ConfirmationModal from "VendorManagement/components/Modals/CommonCenteredModal";
import { Link } from "react-router-dom";
import Empty from "components/Empty";
import Tooltip from "reactstrap/lib/Tooltip";

const OrderTable = ({ t, orderListHookData, isLoading }) => {
  const modeOfPaymentLimit = 200;
  const { data, methods } = orderListHookData;
  const {
    isConfirmationModalOpen,
    currentPageNumber,
    pageSize,
    totalItems,
    columnData,
    selectedAll,
    modalInputValue,
    modalInputError,
  } = data;
  const {
    openConfirmationModal,
    handleConfirmMarkAsPaid,
    closeConfirmationModal,
    handlePageNumber,
    toggleCheckbox,
    isSelected,
    toggleAllCheckbox,
    toggleTooltip,
    handleModalInputValue,
  } = methods;

  const columns = [
    {
      attrs: { datatitle: t("vendorManagement.orderNo") },
      dataField: "orderNo",
      text: t("vendorManagement.orderNo"),
      headerFormatter: () => (
        <div className="ch-checkbox">
          <label className="mb-0">
            <input
              type="checkbox"
              checked={selectedAll}
              onChange={toggleAllCheckbox}
            />
            <span className="py-1"> {t("vendorManagement.orderNo")}</span>
          </label>
        </div>
      ),
      formatter: (cellContent, row, rowIndex) => {
        const { id, to } = row;
        const selected = isSelected(row);
        return (
          <div className="ch-checkbox">
            <label>
              <input
                type="checkbox"
                value={id}
                checked={selected}
                onChange={(e) => toggleCheckbox(e, row)}
              />
              <span>
                <Link className="text-nowrap link-btn-14" to={to}>
                  {cellContent}
                </Link>
              </span>
            </label>
          </div>
        );
      },
    },
    {
      attrs: { datatitle: t("accountOwner.date") },
      dataField: "date",
      text: t("accountOwner.date"),
    },
    {
      attrs: { datatitle: t("vendorManagement.customerName") },
      dataField: "customerName",
      text: t("vendorManagement.customerName"),
    },
    {
      attrs: { datatitle: t("vendorManagement.paymentMethod") },
      dataField: "paymentMethod",
      text: t("vendorManagement.paymentMethod"),
    },
    {
      attrs: { datatitle: t("vendorManagement.paymentStatus") },
      dataField: "paymentStatus",
      text: t("vendorManagement.paymentStatus"),
    },
    {
      attrs: { datatitle: t("vendorManagement.orderStatus") },
      dataField: "orderStatus",
      text: t("vendorManagement.orderStatus"),
    },
    {
      attrs: { datatitle: t("vendorManagement.invoiceNo") },
      dataField: "invoiceNo",
      text: t("vendorManagement.invoiceNo"),
    },
    {
      attrs: { datatitle: t("vendorManagement.actions") },
      dataField: "actions",
      text: "",
      formatter: (cellContent, row, rowIndex) => {
        const { tooltip, isBillMeLater, isNotPaid } = row;
        return (
          <Fragment>
            <span
              className={`link-btn ${
                !isBillMeLater || !isNotPaid ? "disable-btns" : ""
              }`}
              onClick={() => {
                if (isBillMeLater && isNotPaid) {
                  openConfirmationModal(row?.id);
                }
              }}
              title={t("vendorManagement.markAsPaid")}
            >
              {t("vendorManagement.markAsPaid")}
            </span>
            <img
              className="ml-2 cursor-pointer"
              id={`tooltip-number-${rowIndex + 1}`}
              src={require("assets/images/info_black-tooltip.svg").default}
              alt="icon"
            />
            <Tooltip
              isOpen={tooltip}
              placement="top"
              target={`tooltip-number-${rowIndex + 1}`}
              toggle={() => toggleTooltip(rowIndex)}
            >
              {row?.billMeLaterModeOfPayment || t("nodetailsadded")}
            </Tooltip>
          </Fragment>
        );
      },
    },
  ];

  return (
    <Fragment>
      {!!columnData?.length && (
        <div className=" table-td-last-50 order-table-page manage-cust-order-list-table">
          <Table
            keyField="id"
            data={columnData}
            columns={columns}
            handlePagination={handlePageNumber}
            pageNumber={currentPageNumber}
            totalItems={totalItems}
            pageSize={pageSize}
          />
        </div>
      )}
      {!columnData?.length && (
        <Empty Message={t("vendorManagement.noOrdersFound")} />
      )}

      {isConfirmationModalOpen && (
        <ConfirmationModal
          Title={t("vendorManagement.markAsPaidModalTitle")}
          Desc={t("vendorManagement.markAsPaidModalDesc")}
          btnText={t("confirm")}
          isOpen={isConfirmationModalOpen}
          handleClose={closeConfirmationModal}
          handleConfirm={handleConfirmMarkAsPaid}
          MaxLength={modeOfPaymentLimit}
          //For Input
          inputField={true}
          loading={isLoading}
          inputValue={modalInputValue}
          handleInputValue={handleModalInputValue}
          inputError={modalInputError}
        />
      )}
    </Fragment>
  );
};

export default withTranslation()(OrderTable);
