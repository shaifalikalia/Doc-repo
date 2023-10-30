import React from "react";
import { Modal, ModalBody } from "reactstrap";
import { withTranslation } from "react-i18next";
import crossIcon from "./../../../../../../../assets/images/cross.svg";
import Text from "components/Text";
import "./DeleteSectionModal.scss";

function DeleteSectionModal({ isModalOpen, closeModal, confirmDelete, t }) {
  return (
    <Modal
      isOpen={isModalOpen}
      toggle={closeModal}
      className="modal-dialog-centered  delete-modal"
      modalClassName="custom-modal"
    >
      <span className="close-btn" onClick={closeModal}>
        <img src={crossIcon} alt="close" />
      </span>
      <ModalBody>
        <div className="change-modal-content">
          <Text size="25px" marginBottom="10px" weight="500" color="#111b45">
            <span className="modal-title-25">{t("staff.deleteTask")}</span>
          </Text>{" "}
          <Text size="16px" marginBottom="35px" weight="300" color=" #535b5f">
            {t("staff.deleteTaskDesc")}
          </Text>
          <button
            className="button button-round  button-shadow  button-min-100 mr-md-4 mb-3 w-sm-100"
            title={t("yes")}
            onClick={confirmDelete}
          >
            {t("yes")}
          </button>
          <button
            className="button button-round   button-min-100 button-dark btn-mobile-link"
            title={t("cancel")}
            onClick={closeModal}
          >
            {t("cancel")}
          </button>
        </div>
      </ModalBody>
    </Modal>
  );
}

export default withTranslation()(DeleteSectionModal);
