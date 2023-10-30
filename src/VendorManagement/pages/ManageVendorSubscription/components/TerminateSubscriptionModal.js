import React from "react";
import { withTranslation } from "react-i18next";
import "./../../ManageVendorSubscription/VendorSubscription.scss";
import crossIcon from "../../../../assets/images/cross.svg";
import Text from "components/Text";
import { Modal, ModalBody } from "reactstrap";
import Loader from "components/Loader";

const TerminateSubscriptionModal = ({
  t,
  isTerminateSubscriptionModalOpen,
  setIsTerminateSubscriptionModalOpen,
  terminateSub,
  showLoader,
}) => {
  const closeTerminateSubscriptionModal = () =>
    setIsTerminateSubscriptionModalOpen(false);
  return (
    <Modal
      isOpen={isTerminateSubscriptionModalOpen}
      toggle={closeTerminateSubscriptionModal}
      className="modal-dialog-centered terminate-modal modal-width-660"
      modalClassName="custom-modal"
    >
      <span className="close-btn" onClick={closeTerminateSubscriptionModal}>
        <img src={crossIcon} alt="close" />
      </span>
      <ModalBody>
        {showLoader && <Loader />}
        <div className="modal-custom-title title-location-center mw-100 text-nowrap">
          <Text size="25px" weight="500" color="#111b45">
            <span className="modal-title-25 text-nowrap">
              {t("vendorManagement.terminateSubscription")}
            </span>
          </Text>
        </div>
        <Text size="16px" weight="300" color=" #535b5f">
          {t("vendorManagement.terminateSubscriptionWarning")}
        </Text>

        <div className="btn-box">
          <button
            className="button button-round button-shadow sure-btn"
            title={t("vendorManagement.sureBtn")}
            onClick={terminateSub}
          >
            {t("vendorManagement.sureBtn")}
          </button>
          <button
            className="button button-round button-border btn-mobile-link button-dark "
            title={t("vendorManagement.notSureBtn")}
            onClick={closeTerminateSubscriptionModal}
          >
            {t("vendorManagement.notSureBtn")}
          </button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default withTranslation()(TerminateSubscriptionModal);
