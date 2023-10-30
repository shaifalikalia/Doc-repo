import React, { memo } from "react";
import { Modal, ModalBody } from "reactstrap";
import Loader from "components/Loader";
import { withTranslation } from "react-i18next";

function ChangeStatusModal({
  t,
  description,
  isSubmit,
  closeModal,
  isLoading,
  isOpen,
  buttonTitle,
}) {
  return (
    <Modal
      isOpen={isOpen}
      className="modal-dialog-centered deactivate-modal"
      modalClassName="custom-modal"
      toggle={closeModal}
    >
      {isLoading && <Loader />}
      <span className="close-btn" onClick={closeModal}>
        <img src={require("assets/images/cross.svg").default} alt="close" />
      </span>
      <ModalBody>
        <div className="content-block">
          {description && <p>{description}</p>}
          <button
            className="button button-round button-min-100 margin-right-2x"
            title={buttonTitle}
            onClick={isSubmit}
          >
            {buttonTitle}
          </button>
          <button
            class="button button-round button-border button-dark"
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

export default withTranslation()(memo(ChangeStatusModal));
