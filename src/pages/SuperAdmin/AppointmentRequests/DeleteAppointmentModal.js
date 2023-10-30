import React from "react";
import { withTranslation } from "react-i18next";
import { Modal } from "reactstrap";
import ModalBody from "reactstrap/lib/ModalBody";
import crossIcon from "../../../assets/images/cross.svg";
import Text from "components/Text";
import styles from "./AppointmentRequest.module.scss";

function DeleteAppointmentModal({
  t,
  setDeleteModal,
  deleteModal,
  confirmDelete,
}) {
  const closeModal = () => {
    setDeleteModal(false);
  };

  return (
    <>
      <Modal
        isOpen={deleteModal}
        toggle={closeModal}
        className={
          "modal-dialog-centered " + styles["delete-appointment-modal-dialog"]
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
              {t("superAdmin.deleteAppointmentRequestTitle")}
            </span>{" "}
          </Text>
          <Text size="16px" marginBottom="40px" weight="300" color="#535b5f">
            {t("superAdmin.deleteAppointmentRequestSubtitle")}
          </Text>
          <button
            className="button button-round button-shadow mr-md-4 mb-3 w-sm-100"
            onClick={confirmDelete}
            title={t("delete")}
          >
            {t("delete")}
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

export default withTranslation()(DeleteAppointmentModal);
