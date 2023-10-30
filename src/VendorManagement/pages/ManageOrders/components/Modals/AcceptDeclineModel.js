import React from "react";
import { withTranslation } from "react-i18next";
import { Modal } from "reactstrap";
import ModalBody from "reactstrap/lib/ModalBody";
import Text from "components/Text";
import crossIcon from "../../../../../assets/images/cross.svg";
import constants from "../../../../../constants";

function AcceptDeclineModel({ t, closeModel, modelView, onSubmit }) {
  const isAccept = modelView?.isAccept;
  let title = t("vendorManagement.orderCancelAlltitle");
  let description = t("vendorManagement.orderCancelAllDesc");
  let button = t("confirm");

  if (isAccept) {
    title = t("vendorManagement.AcceptAllOrder");
    description = t("vendorManagement.AcceptAllOrderDes");
    button = t("accept");
  }

  return (
    <>
      <Modal
        isOpen={true}
        toggle={closeModel}
        className={"modal-dialog-centered "}
        modalClassName="custom-modal"
      >
        <span className="close-btn" onClick={closeModel}>
          <img src={crossIcon} alt="close" />
        </span>

        <ModalBody className="text-center">
          <Text size="25px" marginBottom="10px" weight="500" color="#111b45">
            <span className="modal-title-25">{title}</span>{" "}
          </Text>
          <Text size="16px" marginBottom="40px" weight="300" color="#535b5f">
            {description}
          </Text>

          <button
            className="button button-round button-shadow mr-md-4 mb-3 w-sm-100"
            onClick={() =>
              onSubmit(
                isAccept
                  ? constants.orderDetails.ACCEPT
                  : constants.orderDetails.DECLINE
              )
            }
            title={button}
          >
            {button}
          </button>
          <button
            className="button button-round button-border button-dark btn-mobile-link"
            onClick={closeModel}
            title={t("cancel")}
          >
            {t("cancel")}
          </button>
        </ModalBody>
      </Modal>
    </>
  );
}

export default withTranslation()(AcceptDeclineModel);
