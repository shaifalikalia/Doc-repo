import React from "react";
import { Store } from "containers/routes";
import { useContext } from "react";
import { Modal } from "reactstrap";
import ModalBody from "reactstrap/lib/ModalBody";
import crossIcon from "../../assets/images/cross.svg";
import Text from "components/Text";
import { withTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import constants, { getsubcriptionPlanTitle } from "../../constants";

function UpdateSubscptionModel({ t }) {
  const { isSubscriptionModel, setIsSubscriptionModel } = useContext(Store);
  const { isModelOpenForNotification, setIsModelOpenForNotification } =
    useContext(Store);
  const profile = useSelector((pre) => pre.userProfile?.profile);
  const currentPlan = useSelector((pre) => pre?.Subscription?.subscriptionPlan);
  const isAdmin =
    profile?.role?.systemRole === constants.systemRoles.accountOwner;

  const closeModel = () => {
    setIsSubscriptionModel(false);
    setIsModelOpenForNotification(false);
  };

  return (
    <Modal
      isOpen={isSubscriptionModel}
      toggle={closeModel}
      className={
        "modal-dialog-centered currency-confirmation-modal modal-width-660"
      }
      modalClassName="custom-modal"
    >
      <span className="close-btn" onClick={closeModel}>
        <img src={crossIcon} alt="close" />
      </span>
      <ModalBody>
        <div className="modal-custom-title title-location-center">
          <Text size="25px" marginBottom="10px" weight="500" color="#111b45">
            <span className="modal-title-25">
              {" "}
              {t("accountOwner.updateCurrency")}
            </span>
          </Text>
        </div>

        <Text size="16px" marginBottom="40px" weight="300" color="#535B5F">
          <span className="modal-title-25">
            {!isModelOpenForNotification ? (
              <>
                {isAdmin
                  ? t("accountOwner.updatePlan", {
                      field: getsubcriptionPlanTitle(currentPlan),
                    })
                  : t("accountOwner.updatePlanOwner", {
                      field: getsubcriptionPlanTitle(currentPlan),
                    })}
              </>
            ) : (
              t("accountOwner.updatePlanForNotification")
            )}
          </span>
        </Text>
        <button
          className="button button-round button-shadow mr-sm-3  w-sm-100"
          title={t("okayGotIt")}
          onClick={closeModel}
        >
          {t("okayGotIt")}
        </button>
      </ModalBody>
    </Modal>
  );
}

export default withTranslation()(UpdateSubscptionModel);
