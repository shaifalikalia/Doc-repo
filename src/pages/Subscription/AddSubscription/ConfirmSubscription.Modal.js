import React from "react";
import { withTranslation } from "react-i18next";
import "rc-time-picker/assets/index.css";
import { Modal, ModalBody } from "reactstrap";
import crossIcon from "./../../../assets/images/cross.svg";
import Text from "components/Text";
import { Link } from "react-router-dom";
import "./PricingPlan.scss";

const ConfirmSubscription = ({
  t,
  isConfirmSubscriptionModalOpen,
  closeConfirmSubscriptionModal,
}) => {
  return (
    <Modal
      isOpen={isConfirmSubscriptionModalOpen}
      toggle={closeConfirmSubscriptionModal}
      className="modal-dialog-centered pricing-plan-modal modal-width-660 confirm-subscription-modal"
      modalClassName="custom-modal"
    >
      <span className="close-btn" onClick={closeConfirmSubscriptionModal}>
        <img src={crossIcon} alt="close" />
      </span>
      <ModalBody className="text-center confirm-subscription-body">
        <div className="modal-custom-title title-location-center">
          <Text size="25px" marginBottom="4px" weight="500" color="#111b45">
            <span className="modal-title-25">
              {t("accountOwner.confirmSubscription")}
            </span>
          </Text>
        </div>
        <div className="modal-mobile-para">
          <Text size="16px" marginBottom="10px" weight="300" color=" #535b5f">
            {t("accountOwner.confirmSubscriptionDetail")}
          </Text>
          <div className="modal-mobile-para-line">
            <Text size="16px" marginBottom="40px" weight="300" color=" #535b5f">
              {t("accountOwner.doYouConfirmThisSubscription")}
            </Text>
          </div>
        </div>

        <div className="btn-box mb-0 mb-md-2">
          <Link to="/confirm-subscription">
            <button
              className="button button-round button-shadow  w-sm-100 mr-md-4"
              title={t("accountOwner.yesConfirm")}
            >
              {t("accountOwner.yesConfirm")}
            </button>
          </Link>
          <button
            className="button button-round button-border btn-mobile-link button-dark mt-3 mt-md-0"
            onClick={closeConfirmSubscriptionModal}
            title={t("cancel")}
          >
            {t("cancel")}
          </button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default withTranslation()(ConfirmSubscription);
