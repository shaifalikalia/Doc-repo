import React from "react";
import { withTranslation } from "react-i18next";
import "rc-time-picker/assets/index.css";
import { Modal, ModalBody } from "reactstrap";
import crossIcon from "./../../../assets/images/cross.svg";
import Text from "components/Text";
import "./PricingPlan.scss";

const MultiplePricingPlanModal = ({
  t,
  isMultiplePricePlanModalOpen,
  closeMultiplePricingPlanModal,
}) => {
  return (
    <Modal
      isOpen={isMultiplePricePlanModalOpen}
      toggle={closeMultiplePricingPlanModal}
      className="modal-dialog-centered pricing-plan-modal modal-width-660"
      modalClassName="custom-modal"
    >
      <span className="close-btn" onClick={closeMultiplePricingPlanModal}>
        <img src={crossIcon} alt="close" />
      </span>
      <ModalBody>
        <div className="modal-custom-title">
          <Text size="25px" marginBottom="30px" weight="500" color="#111B45">
            <span className="modal-title-25">
              {t("accountOwner.multipleOfficePricingPlan")}
            </span>
          </Text>
        </div>
        <div className="d-flex">
          <div className="aod-dc-title w-50">
            {t("accountOwner.multipleOfficeSubscription")}
          </div>
          <div class="aod-dc-value w-50 d-md-flex justify-content-end">
            {"CAD 30/per office"}
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
              {"CAD 220/per month"}
            </div>
          </div>

          <hr />
        </>
        <div className="d-flex">
          <div className="aod-dc-title w-50">
            {t("accountOwner.perActiveTempStaffUser")}
          </div>
          <div class="aod-dc-value w-50 d-md-flex justify-content-end">
            {"CAD 110/per month"}
          </div>
        </div>
        <hr />
        <div className="d-flex">
          <div className="aod-dc-title w-50">
            {t("accountOwner.perStaffPlacement")}
          </div>
          <div class="aod-dc-value w-50 d-md-flex justify-content-end">
            {" "}
            {"CAD 12"}
          </div>
        </div>
        <hr />
        <div className="d-flex flex-row justify-content-center">
          <button
            onClick={closeMultiplePricingPlanModal}
            className="button button-round button-width-large mt-3 w-sm-100"
          >
            {t("accountOwner.okay")}
          </button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default withTranslation()(MultiplePricingPlanModal);
