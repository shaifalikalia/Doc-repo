import React from "react";
import { Modal, ModalBody } from "reactstrap";
import { withTranslation } from "react-i18next";
import crossIcon from "./../../../../assets/images/cross.svg";
import Text from "components/Text";
import { useDeleteAccountMutation } from "repositories/user-repository";
import toast from "react-hot-toast";

function DeleteAccountConfirmationPopup({ onClose, t }) {
  const deleteAccountMutation = useDeleteAccountMutation();

  const onConfirm = async () => {
    try {
      await deleteAccountMutation.mutateAsync();
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <Modal
      isOpen={true}
      toggle={onClose}
      className="modal-dialog-centered profile-specialty-modal"
      modalClassName="custom-modal"
    >
      <span className="close-btn" onClick={onClose}>
        <img src={crossIcon} alt="close" />
      </span>
      <ModalBody>
        <Text size="25px" marginBottom="30px" weight="500" color="#111b45">
          <span className="modal-title-25">
            {" "}
            {t("accountOwner.deleteAccount")}
          </span>{" "}
        </Text>

        <div>{t("accountOwner.deleteAccountDescription")}</div>

        <div className="d-md-flex flex-row btn-box">
          <button
            className={
              "button button-round button-shadow mr-md-4 mb-3 w-sm-100" +
              (deleteAccountMutation.isLoading ? " button-loading" : "")
            }
            onClick={onConfirm}
            disabled={deleteAccountMutation.isLoading}
          >
            {t("delete")}
            {deleteAccountMutation.isLoading && <div className="loader"></div>}
          </button>

          <button
            className="button mb-md-3 button-round button-border button-dark btn-mobile-link"
            onClick={onClose}
            disabled={deleteAccountMutation.isLoading}
          >
            {t("cancel")}
          </button>
        </div>
      </ModalBody>
    </Modal>
  );
}

export default withTranslation()(DeleteAccountConfirmationPopup);
