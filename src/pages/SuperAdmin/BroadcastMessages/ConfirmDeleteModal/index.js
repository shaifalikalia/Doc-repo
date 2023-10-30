import React from "react";
import { Modal, ModalBody } from "reactstrap";
import { withTranslation } from "react-i18next";
import crossIcon from "./../../../../assets/images/cross.svg";
import Text from "components/Text";

function ConfirmDeleteModal({
  closeModal,
  confirmDelete,
  confirmDeleteMessage,
  t,
}) {
  return (
    <Modal
      isOpen={confirmDelete}
      toggle={closeModal}
      className="modal-dialog-centered"
      modalClassName="custom-modal"
    >
      <span className="close-btn" onClick={closeModal}>
        <img src={crossIcon} alt="close" />
      </span>
      <ModalBody>
        <div className="content-block">
          <Text size="16px" marginBottom="35px" weight="300" color=" #535b5f">
            {t("confirmDelete")}
          </Text>
          <button
            className="button button-round button-shadow button-min-100 margin-right-2x"
            onClick={() => confirmDeleteMessage()}
          >
            {t("confirm")}
          </button>
          <button
            className="button button-round button-border button-dark"
            onClick={closeModal}
          >
            {t("cancel")}
          </button>
        </div>
      </ModalBody>
    </Modal>
  );
}

export default withTranslation()(ConfirmDeleteModal);
