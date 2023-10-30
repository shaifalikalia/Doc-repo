import React from "react";
import { withTranslation } from "react-i18next";
import { Modal, ModalBody } from "reactstrap";
import "./SubscriptionAndInvoices.scss";

function InvoiceDetailModal({ invoiceEntry, isOpen, onClose, t }) {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={true}
      toggle={onClose}
      className="modal-dialog-centered deactivate-modal sai-pi-invoice-modal"
      modalClassName="custom-modal"
    >
      <span className="close-btn" onClick={onClose}>
        <img src={require("assets/images/cross.svg").default} alt="close" />
      </span>

      <ModalBody>
        <h3 className="sai-pi-invoice-modal-title">
          {t("superAdmin.invoiceDetails")}
        </h3>

        <div className="d-flex justify-content-between">
          <span className="sai-pi-invoice-modal-key">
            {invoiceEntry.packageName} {t("subscription")}
          </span>
          <span className="sai-pi-invoice-modal-value">
            {t("cad")}{" "}
            {(invoiceEntry.perOfficeChargeAmountInCents / 100).toFixed(2)} /{" "}
            {t("perMonth")}
          </span>
        </div>

        <hr />

        <div className="d-flex justify-content-between">
          <span className="sai-pi-invoice-modal-key">
            {t("superAdmin.totalOffices")}
          </span>
          <span className="sai-pi-invoice-modal-value">
            {invoiceEntry.officeCount}{" "}
            {t("superAdmin.office", { count: invoiceEntry.officeCount })}
          </span>
        </div>

        <hr />

        <div className="d-flex justify-content-between">
          <span className="sai-pi-invoice-modal-key">
            {t("superAdmin.totalCost")}
          </span>
          <span className="sai-pi-invoice-modal-value">
            {t("cad")}{" "}
            {(invoiceEntry.totalOfficeChargeAmountInCents / 100).toFixed(2)} /{" "}
            {t("perMonth")}
          </span>
        </div>

        <div className="d-flex justify-content-between mt-5">
          <span className="sai-pi-invoice-modal-key">
            {t("perActivePermanentStaffMember")}
          </span>
          <span className="sai-pi-invoice-modal-value">
            {t("cad")}{" "}
            {(invoiceEntry.perPermanentStaffChargeAmountInCents / 100).toFixed(
              2
            )}{" "}
            / {t("perMonth")}
          </span>
        </div>

        <hr />

        <div className="d-flex justify-content-between">
          <span className="sai-pi-invoice-modal-key">
            {t("superAdmin.totalActivePermanentStaffMember")}
          </span>
          <span className="sai-pi-invoice-modal-value">
            {invoiceEntry.permanentStaffCount}{" "}
            {t("superAdmin.permanentStaff", {
              count: invoiceEntry.permanentStaffCount,
            })}
          </span>
        </div>

        <hr />

        <div className="d-flex justify-content-between">
          <span className="sai-pi-invoice-modal-key">
            {t("superAdmin.totalCost")}
          </span>
          <span className="sai-pi-invoice-modal-value">
            {t("cad")}{" "}
            {(
              invoiceEntry.totalPermanentStaffChargeAmountInCents / 100
            ).toFixed(2)}{" "}
            / {t("perMonth")}
          </span>
        </div>

        <div className="d-flex justify-content-between mt-5">
          <span className="sai-pi-invoice-modal-key">
            {t("perActiveTemporaryStaffMember")}
          </span>
          <span className="sai-pi-invoice-modal-value">
            {t("cad")}{" "}
            {(invoiceEntry.perTemporaryStaffChargeAmountInCents / 100).toFixed(
              2
            )}{" "}
            / {t("perMonth")}
          </span>
        </div>

        <hr />

        <div className="d-flex justify-content-between">
          <span className="sai-pi-invoice-modal-key">
            {t("superAdmin.totalActiveTemporaryStaffMember")}
          </span>
          <span className="sai-pi-invoice-modal-value">
            {invoiceEntry.temporaryStaffCount}{" "}
            {t("superAdmin.temporaryStaff", {
              count: invoiceEntry.temporaryStaffCount,
            })}
          </span>
        </div>

        <hr />

        <div className="d-flex justify-content-between">
          <span className="sai-pi-invoice-modal-key">
            {t("superAdmin.totalCost")}
          </span>
          <span className="sai-pi-invoice-modal-value">
            {t("cad")}{" "}
            {(
              invoiceEntry.totalTemporaryStaffChargeAmountInCents / 100
            ).toFixed(2)}{" "}
            / {t("perMonth")}
          </span>
        </div>

        <div className="d-flex justify-content-between mt-5">
          <span className="sai-pi-invoice-modal-key">
            {t("superAdmin.totalNumberOfPlacements")}
          </span>
          <span className="sai-pi-invoice-modal-value">
            {invoiceEntry.placementCount}
          </span>
        </div>

        <hr />

        <div className="d-flex justify-content-between">
          <span className="sai-pi-invoice-modal-key">
            {t("superAdmin.costPerPlacement")}
          </span>
          <span className="sai-pi-invoice-modal-value">
            {t("cad")}{" "}
            {(invoiceEntry.perPlacementChargeAmountInCents / 100).toFixed(2)} /{" "}
            {t("perMonth")}
          </span>
        </div>

        <hr />

        <div className="d-flex justify-content-between">
          <span className="sai-pi-invoice-modal-key">
            {t("superAdmin.totalCost")}
          </span>
          <span className="sai-pi-invoice-modal-value">
            {t("cad")}{" "}
            {(invoiceEntry.totalPlacementChargeAmountInCents / 100).toFixed(2)}{" "}
            / {t("perMonth")}
          </span>
        </div>

        <hr className="my-5" />

        <div className="d-flex justify-content-between">
          <span className="sai-pi-invoice-modal-key">
            <strong>{t("superAdmin.totalCost")}</strong>
          </span>
          <span className="sai-pi-invoice-modal-value">
            {t("cad")}{" "}
            {(invoiceEntry.totalChargeAmountInCents / 100).toFixed(2)} /{" "}
            {t("perMonth")}
          </span>
        </div>
      </ModalBody>
    </Modal>
  );
}

export default withTranslation()(InvoiceDetailModal);
