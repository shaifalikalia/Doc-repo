import React from "react";
import { Modal, ModalBody } from "reactstrap";
import Loader from "components/Loader";

export const ChangedStatus = ({
  isDeactive,
  t,
  closeStatusModel,
  updateStatus,
  showLoader,
}) => {
  const isActive = !isDeactive?.user?.isActive || !isDeactive?.isApproved;
  const buttonTitle = isActive
    ? t("superAdmin.vendor.Activate")
    : t("superAdmin.vendor.Deactivate");
  const content = isActive
    ? t("superAdmin.vendor.ActivateVendorContent")
    : t("superAdmin.vendor.DecActivateVendorContent");

  return (
    <Modal
      isOpen={isDeactive?.isOpen}
      className="modal-dialog-centered deactivate-modal"
      modalClassName="custom-modal"
      toggle={closeStatusModel}
    >
      {showLoader && <Loader />}
      <span className="close-btn" onClick={closeStatusModel}>
        <img src={require("assets/images/cross.svg").default} alt="close" />
      </span>
      <ModalBody>
        <div className="content-block">
          <p>{content}</p>
          <button
            className="button button-round button-min-100 margin-right-2x"
            title={buttonTitle}
            onClick={updateStatus}
          >
            {buttonTitle}
          </button>
          <button
            class="button button-round button-border button-dark"
            title={t("cancel")}
            onClick={closeStatusModel}
          >
            {t("cancel")}
          </button>
        </div>
      </ModalBody>
    </Modal>
  );
};
