import React from "react";
import { Modal } from "reactstrap";
import ModalBody from "reactstrap/lib/ModalBody";
import crossIcon from "../../../../assets/images/cross.svg";
import Text from "components/Text";
import "./CurrencyConfirmation.scss";

export default function CurrencyConfirmation({
  t,
  closeModel,
  isOpen,
  onSubmit,
  isCadCurrency,
}) {
  let description = isCadCurrency
    ? t("accountOwner.confirmCadCurrency")
    : t("accountOwner.confirmUsdurrency");

  return (
    <Modal
      isOpen={isOpen}
      toggle={() => closeModel(false)}
      className={
        "modal-dialog-centered currency-confirmation-modal modal-width-660"
      }
      modalClassName="custom-modal"
    >
      <span className="close-btn" onClick={() => closeModel(false)}>
        <img src={crossIcon} alt="close" />
      </span>
      <ModalBody>
        <div className="modal-custom-title title-location-center">
          <Text size="25px" marginBottom="10px" weight="500" color="#111b45">
            <span className="modal-title-25">
              {" "}
              {t("accountOwner.confirmCurrency")}
            </span>
          </Text>
        </div>
        <Text size="16px" marginBottom="10px" weight="300" color="#535B5F">
          <span className="modal-title-25"> {description}</span>
        </Text>

        <Text size="16px" marginBottom="40px" weight="300" color="#535B5F">
          <span className="modal-title-25">
            {" "}
            {t("accountOwner.confirmSelectionCurrency")}
          </span>
        </Text>

        <button
          className="button button-round button-shadow mr-sm-3  w-sm-100"
          title={t("Confirm")}
          onClick={onSubmit}
        >
          {t("Confirm")}
        </button>
        <button
          className="button button-round button-border btn-mobile-link button-dark"
          onClick={() => closeModel(false)}
          title={t("cancel")}
        >
          {t("cancel")}
        </button>
      </ModalBody>
    </Modal>
  );
}
