import React, { useState } from "react";
import { Modal, ModalBody } from "reactstrap";
import { withTranslation } from "react-i18next";
import crossIcon from "./../../../../../assets/images/cross.svg";
import Text from "components/Text";
import styles from "./RequestModal.scss";

function RequestModal({ isModalOpen, closeModal, confirmSend, t }) {
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState("");

  const handleChange = (val) => {
    if (val && val.trim().length && val.trim().length > 400) {
      val = val.trim().substring(0, 400);
    }
    setReason(val);
    setReasonError("");
  };
  const submitReason = () => {
    if (reason && reason.trim().length > 1) {
      confirmSend(reason);
    } else {
      setReasonError(`${t("staff.reasonError")}`);
    }
  };
  return (
    <Modal
      isOpen={isModalOpen}
      toggle={closeModal}
      className="modal-dialog-centered draft-modal"
      modalClassName="custom-modal"
    >
      <span className="close-btn" onClick={closeModal}>
        <img src={crossIcon} alt="close" />
      </span>
      <ModalBody className="text-left">
        <Text size="25px" marginBottom="10px" weight="500" color="#111b45">
          <span className="modal-title-25">{t("staff.reasonModalTitle")}</span>
        </Text>
        <div className={styles["custom-box"]}>
          <div className="c-field">
            <label>{t("staff.reason")}</label>
            <textarea
              placeholder={t("form.placeholder1", { field: t("staff.reason") })}
              className={"c-form-control " + styles["custom-textarea-control"]}
              name="reason"
              maxLength="400"
              onChange={(e) => handleChange(e.currentTarget.value)}
              value={reason}
            ></textarea>
            {(!reason || !reason.trim().length) && reasonError && (
              <span className="error-msg">{reasonError}</span>
            )}
          </div>
        </div>
        <button
          className="button button-round button-shadow mr-md-4 mb-3 w-sm-100"
          title={t("staff.sendRequestToEdit")}
          onClick={() => submitReason()}
        >
          {t("staff.sendRequestToEdit")}
        </button>
        <button
          className="button button-round button-border button-dark btn-mobile-link"
          title={t("cancel")}
          onClick={closeModal}
        >
          {t("cancel")}
        </button>
      </ModalBody>
    </Modal>
  );
}

export default withTranslation()(RequestModal);
