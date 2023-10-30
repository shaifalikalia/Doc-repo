import React from "react";
import { Modal, ModalBody } from "reactstrap";
import { withTranslation } from "react-i18next";
import crossIcon from "./../../../../assets/images/cross.svg";
import Text from "components/Text";

function ChangeStatusmodal({
  modal,
  toggle,
  resolveHandler,
  inProgressHandler,
  ticketId,
  changeStatus,
  t,
}) {
  const changeStatusHandler = () => {
    if (changeStatus == 2) {
      inProgressHandler(ticketId);
    } else {
      resolveHandler(ticketId);
    }
  };
  return (
    <Modal
      isOpen={modal}
      toggle={toggle}
      className="modal-dialog-centered  delete-modal"
      modalClassName="custom-modal"
    >
      <span className="close-btn" onClick={toggle}>
        <img src={crossIcon} alt="close" />
      </span>
      <ModalBody>
        <Text size="25px" marginBottom="10px" weight="500" color="#111b45">
          {changeStatus == 2
            ? t("superAdmin.markAsInProgress")
            : t("superAdmin.markAsResolved")}
        </Text>
        <Text size="16px" marginBottom="35px" weight="300" color=" #535b5f">
          {changeStatus == 2
            ? t("superAdmin.confirmStatusChangeToInProgress")
            : t("superAdmin.confirmStatusChangeToResolved")}
          ?
        </Text>

        <div className="btn-box d-md-flex">
          <button
            className="button button-round button-shadow mr-2"
            title={t("delete")}
            onClick={() => changeStatusHandler()}
          >
            {t("confirm")}
          </button>
          <button
            className="button button-round button-border button-dark "
            title={t("cancel")}
            onClick={() => toggle()}
          >
            {t("cancel")}
          </button>
        </div>
      </ModalBody>
    </Modal>
  );
}

export default withTranslation()(ChangeStatusmodal);
