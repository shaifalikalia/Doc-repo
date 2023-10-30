import React from "react";
import { Modal, ModalBody } from "reactstrap";
import { withTranslation } from "react-i18next";
import Loader from "components/Loader";

const CancelSubscription = (props) => {
  const { t, CancelPlan, closeModal, isLoader } = props;

  return (
    <>
      <Modal
        isOpen={props.show}
        className=" modal-lg cancel-sub-modal"
        modalClassName="custom-modal"
        toggle={props.closeModal}
      >
        {isLoader && <Loader />}
        <span className="close-btn" onClick={props.closeModal}>
          <img src={require("assets/images/cross.svg").default} alt="close" />
        </span>
        <ModalBody>
          <div className="CancelSubscription-block">
            <h2 className="title text-center">
              {t("accountOwner.terminateSubscription")}
            </h2>
            <p className="text-center">
              {t("accountOwner.terminateSubscriptionWarningMessage")}
            </p>
            <div className="button-block">
              <div className="row gutters-12">
                <div className="col-md-12 text-center">
                  <button
                    className="button button-round button-shadow margin-bottom-3x"
                    title={t("accountOwner.sureAboutTermination")}
                    onClick={CancelPlan}
                  >
                    {t("accountOwner.sureAboutTermination")}
                  </button>

                  <button
                    class="button button-round button-border button-dark"
                    title={t("accountOwner.notSureAboutTermination")}
                    onClick={closeModal}
                  >
                    {t("accountOwner.notSureAboutTermination")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default withTranslation()(CancelSubscription);
