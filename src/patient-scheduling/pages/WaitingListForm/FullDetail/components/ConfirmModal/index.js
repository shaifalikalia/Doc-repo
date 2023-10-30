import React from "react";
import { withTranslation } from "react-i18next";
import "rc-time-picker/assets/index.css";
import { Modal } from "reactstrap";
import ModalBody from "reactstrap/lib/ModalBody";
import crossIcon from "../../../../../../assets/images/cross.svg";
import Text from "components/Text";
import styles from "../Modals.module.scss";

function ConfirmAcceptModal({ t, isOpen, onSubmit, toggleConfirmModal }) {
  return (
    <>
      <Modal
        isOpen={isOpen}
        toggle={toggleConfirmModal}
        className={
          "modal-dialog-centered modal-width-660 " +
          styles["confirem-accept-modal-dialog"]
        }
        modalClassName="custom-modal"
      >
        <span className="close-btn" onClick={toggleConfirmModal}>
          <img src={crossIcon} alt="close" />
        </span>

        <ModalBody className="text-center">
          <Text size="25px" marginBottom="10px" weight="500" color="#111b45">
            <span className="modal-title-25">{t("confirmation")}</span>
          </Text>
          <Text
            size="16px"
            marginBottom="40px"
            className={styles["desc-text"]}
            weight="300"
            color="#535b5f"
          >
            {t("patient.waitingListModal.confirmModalSubTitle")}
          </Text>

          <button
            className="button button-round button-shadow mr-md-4 mb-3 w-sm-100"
            title={t("submit")}
            onClick={onSubmit}
          >
            {t("submit")}
          </button>
          <button
            className="button button-round button-border button-dark btn-mobile-link"
            onClick={toggleConfirmModal}
            title={t("cancel")}
          >
            {t("cancel")}
          </button>
        </ModalBody>
      </Modal>
    </>
  );
}

export default withTranslation()(ConfirmAcceptModal);
