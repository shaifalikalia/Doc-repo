import React from "react";
import { withTranslation } from "react-i18next";
import "rc-time-picker/assets/index.css";
import { Modal, ModalBody } from "reactstrap";
import crossIcon from "./../../../assets/images/cross.svg";
import "./PricingPlan.scss";
import Text from "components/Text";

const SinglePricingPlanModal = ({
  t,
  isPricePlanModalOpen,
  closePricingPlanModal,
}) => {
  return (
    <Modal
      isOpen={isPricePlanModalOpen}
      toggle={closePricingPlanModal}
      className="modal-dialog-centered pricing-plan-modal modal-width-660"
      modalClassName="custom-modal"
    >
      <span className="close-btn" onClick={closePricingPlanModal}>
        <img src={crossIcon} alt="close" />
      </span>
      <ModalBody>
        <div className="modal-custom-title">
          <Text size="25px" marginBottom="30px" weight="500" color="#111B45">
            <span className="modal-title-25">
              {t("accountOwner.singleOfficePricingPlan")}
            </span>
          </Text>
        </div>

        <div className="d-flex">
          <div className="aod-dc-title w-50">
            {t("accountOwner.singleOfficeSubscription")}
          </div>
          <div class="aod-dc-value w-50 d-md-flex justify-content-end">
            {"CAD 30/per month"}
          </div>
        </div>

        <hr />

        <>
          <div className="d-flex">
            <div className="aod-dc-title w-50">
              {t("accountOwner.perActivePermanentStaffMember")}
            </div>
            <div class="aod-dc-value w-50 d-md-flex justify-content-end">
              {" "}
              {"CAD 10.4/per month"}
            </div>
          </div>

          <hr />
        </>

        <div className="d-flex">
          <div className="aod-dc-title w-50">
            {t("accountOwner.perActiveTempStaffUser")}
          </div>
          <div class="aod-dc-value w-50 d-md-flex justify-content-end">
            {"CAD 10.4/per month"}
          </div>
        </div>

        <hr />

        <div className="d-flex">
          <div className="aod-dc-title w-50">
            {t("accountOwner.perStaffPlacement")}
          </div>
          <div class="aod-dc-value w-50 d-md-flex justify-content-end">
            {" "}
            {"CAD 10.4"}
          </div>
        </div>

        <hr />

        <div className="d-flex flex-row justify-content-center">
          <button
            onClick={closePricingPlanModal}
            className="button button-round button-width-large mt-3 w-sm-100"
          >
            {t("accountOwner.okay")}
          </button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default withTranslation()(SinglePricingPlanModal);
