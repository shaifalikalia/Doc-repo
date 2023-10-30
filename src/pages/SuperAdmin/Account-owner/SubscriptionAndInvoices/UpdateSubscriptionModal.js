import React from "react";
import { Modal, ModalBody } from "reactstrap";
import { withTranslation } from "react-i18next";
import Text from "components/Text";

function UpdateSubscriptionModal({
  isModalOpen,
  closeModal,
  handleEditPlan,
  t,
}) {
  return (
    <Modal
      isOpen={isModalOpen}
      toggle={closeModal}
      className="modal-dialog-centered modal-width-660 update-subscription-modal"
      modalClassName="custom-modal"
    >
      <span className="close-btn" onClick={closeModal}>
        <img src={require("assets/images/cross.svg").default} alt="close" />
      </span>
      <ModalBody className="text-center">
        <Text size="25px" marginBottom="10px" weight="500" color="#111b45">
          {t("superAdmin.updateSubscription")}
        </Text>
        <div className="text-box">{t("superAdmin.updateSubscriptionDesc")}</div>
        <div className="d-flex justify-content-center">
          <button
            onClick={handleEditPlan}
            className={"button button-round button-shadow mr-3"}
          >
            {t("confirm")}
          </button>

          <button
            type="button"
            onClick={closeModal}
            className="button button-round button-border button-dark"
          >
            {t("cancel")}
          </button>
        </div>
      </ModalBody>
    </Modal>
  );
}

export default withTranslation()(UpdateSubscriptionModal);
