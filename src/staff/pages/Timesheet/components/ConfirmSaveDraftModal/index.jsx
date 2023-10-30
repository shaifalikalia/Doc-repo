import React from "react";
import { Modal, ModalBody } from "reactstrap";
import { withTranslation } from "react-i18next";
import crossIcon from "./../../../../../assets/images/cross.svg";
import Text from "components/Text";

function ConfirmSaveDraftModal({
  isModalOpen,
  closeModal,
  confirmSave,
  cancelSave,
  t,
}) {
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
      <ModalBody className="text-center">
        <Text size="25px" marginBottom="10px" weight="500" color="#111b45">
          <span className="modal-title-25"> {t("staff.saveDraft")}</span>
        </Text>
        <Text size="16px" color="#535b5f" marginBottom="30px" weight="300">
          {t("staff.saveDraftDesc")}
        </Text>
        <button
          className="button button-round button-shadow mr-md-4 mb-3 w-sm-100"
          title={t("save")}
          onClick={confirmSave}
        >
          {t("save")}
        </button>
        <button
          className="button button-round button-border button-dark btn-mobile-link"
          title={t("cancel")}
          onClick={cancelSave}
        >
          {t("cancel")}
        </button>
      </ModalBody>
    </Modal>
  );
}

export default withTranslation()(ConfirmSaveDraftModal);
