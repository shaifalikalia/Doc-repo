import React from "react";
import { withTranslation } from "react-i18next";
import { Modal } from "reactstrap";
import ModalBody from "reactstrap/lib/ModalBody";
import crossIcon from "../../../../assets/images/cross.svg";
import Text from "components/Text";
import styles from "./CompleteRequest.module.scss";

function CompleteAppointmentModal({
  t,
  setCompleteModal,
  completeModal,
  confirmMarkComplete,
}) {
  const closeModal = () => {
    setCompleteModal(false);
  };

  return (
    <>
      <Modal
        isOpen={completeModal}
        toggle={closeModal}
        className={
          "modal-dialog-centered " + styles["complete-appointment-modal-dialog"]
        }
        modalClassName="custom-modal"
      >
        <span className="close-btn" onClick={closeModal}>
          <img src={crossIcon} alt="close" />
        </span>

        <ModalBody className="text-center">
          <Text size="25px" marginBottom="10px" weight="500" color="#111b45">
            <span className="modal-title-25">
              {" "}
              {t("superAdmin.completeAppointmentRequestTitle")}
            </span>{" "}
          </Text>
          <Text size="16px" weight="300" color="#535b5f">
            {t("superAdmin.completeAppointmentRequestSubtitle1")}
          </Text>
          <Text size="16px" marginBottom="40px" weight="300" color="#535b5f">
            {t("superAdmin.completeAppointmentRequestSubtitle2")}
          </Text>
          <button
            className="button button-round button-shadow mr-md-4 mb-3 w-sm-100"
            onClick={confirmMarkComplete}
            title={t("confirm")}
          >
            {t("confirm")}
          </button>
          <button
            className="button button-round button-border button-dark btn-mobile-link"
            onClick={closeModal}
            title={t("cancel")}
          >
            {t("cancel")}
          </button>
        </ModalBody>
      </Modal>
    </>
  );
}

export default withTranslation()(CompleteAppointmentModal);
