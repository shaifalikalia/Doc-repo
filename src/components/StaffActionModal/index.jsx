import constants from "./../../constants";
import React from "react";
import { Trans, withTranslation } from "react-i18next";
import { Modal, ModalBody } from "reactstrap";
import "./StaffActionModal.scss";

const StaffActionModal = ({ isOpen, onAction, onClose, event, t }) => {
  if (!isOpen) return null;

  const text = constructText(event, t);

  return (
    <Modal
      isOpen={true}
      className="modal-dialog-centered modal-lg free-trial-modal"
      modalClassName="custom-modal"
    >
      <span className="close-btn" onClick={onClose}>
        <img src={require("assets/images/cross.svg").default} alt="close" />
      </span>

      <ModalBody>
        <h3 className="sam-header">{text.title}</h3>
        <div className="sam-body-text">
          {text.description()}

          <div className="sam-button-group">
            <button
              onClick={onAction}
              className={"button button-round button-shadow"}
            >
              {text.buttonTitle}
            </button>
            <button
              onClick={onClose}
              className="button button-round button-border button-dark"
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

const constructText = (event, t) => {
  switch (event) {
    case constants.staffActionEvents.activation:
      return {
        title: `${t("accountOwner.activateStaff")} ?`,
        description: () => (
          <Trans i18nKey="accountOwner.activateStaffModalDescription">
            <p>
              The activated staff member will be associated with the office
              again and can also submit timesheets.
            </p>
            <p>Are you sure you want to activate the staff member?</p>
          </Trans>
        ),
        buttonTitle: t("accountOwner.activateStaff"),
      };
    case constants.staffActionEvents.deactivation:
      return {
        title: `${t("accountOwner.deactivateStaff")} ?`,
        description: () => (
          <Trans i18nKey="accountOwner.deactivateStaffModalDescription">
            <p>
              The staff member will no longer be associated with the office and
              cannot submit timesheets but can still view previous timesheets.
            </p>
            <p>The staff member can be re-activated later if they re-join.</p>
          </Trans>
        ),
        buttonTitle: t("accountOwner.deactivateStaff"),
      };
    case constants.staffActionEvents.removal:
      return {
        title: `${t("accountOwner.removeStaff")} ?`,
        description: () => (
          <Trans i18nKey="accountOwner.removeStaffModalDescription">
            <p>
              The staff member will be permanently removed and there will be no
              association with the office.
            </p>
            <p>
              The staff member can still view their timesheets but cannot take
              any action.
            </p>
          </Trans>
        ),
        buttonTitle: t("accountOwner.removeStaff"),
      };
    case constants.staffActionEvents.removalAsAdmin:
      return {
        title: t("accountOwner.removeAsAnAccountAdmin"),
        description: () => (
          <Trans i18nKey="accountOwner.removeAsAnAdminModalDescription">
            <p>Are you sure you want to remove the person as an Admin?</p>
          </Trans>
        ),
        buttonTitle: t("remove"),
      };
    default:
      throw new Error("Not a valid event");
  }
};

export default withTranslation()(StaffActionModal);
