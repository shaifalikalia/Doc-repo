import React from "react";
import { Modal, ModalBody } from "reactstrap";

export default function ActDecCategories({
  t,
  changeCategory,
  setChangeCategory,
  actiDecCategory,
}) {
  const isActive = !changeCategory?.isActive;
  const buttonTitle = isActive
    ? t("superAdmin.vendor.Activate")
    : t("superAdmin.vendor.Deactivate");
  const content = isActive
    ? t("superAdmin.vendor.ActivateDesc")
    : t("superAdmin.vendor.DeactivateDesc");

  const closeModal = (e) => {
    setChangeCategory({ open: false });
  };

  return (
    <Modal
      isOpen={changeCategory?.open}
      className="modal-dialog-centered deactivate-modal"
      modalClassName="custom-modal"
      toggle={closeModal}
    >
      <span className="close-btn" onClick={closeModal}>
        <img src={require("assets/images/cross.svg").default} alt="close" />
      </span>
      <ModalBody>
        <div className="content-block">
          <p>{content}</p>
          <button
            className="button button-round button-min-100 margin-right-2x"
            title={buttonTitle}
            onClick={actiDecCategory}
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
