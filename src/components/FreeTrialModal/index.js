import React from "react";
import { Modal, ModalBody } from "reactstrap";
import { withRouter } from "react-router";
import constants from "../../constants";
import { handleError } from "utils";

const FreeTrialPopup = (props) => {
  const handleChoosePlan = () => {
    try {
      if (props?.data?.role?.systemRole === constants.systemRoles.vendor) {
        props.history.push(constants.routes.vendor.manageSubscription, {
          choosePlan: true,
        });
        props.closeModal();
      } else {
        props.history.push("/add-subscription", { choosePlan: true });
        props.closeModal();
      }
    } catch (error) {
      handleError(error);
    }
  };
  return (
    <Modal
      isOpen={props.show}
      className="modal-dialog-centered modal-lg free-trial-modal"
      modalClassName="custom-modal"
    >
      <span className="close-btn" onClick={props.closeModal}>
        <img src={require("assets/images/cross.svg").default} alt="close" />
      </span>

      <ModalBody>
        <div className="trial-block">
          <img
            src={require("assets/images/free-trial.svg").default}
            alt="img"
          />
          <h2 className="title">
            {props.data &&
              props.data.userSubscription &&
              props.data.userSubscription.packageName}{" "}
            Subscription Expired
          </h2>
          {props.data &&
          props.data.userSubscription &&
          props.data.userSubscription.packageType !== "trial" ? (
            <p>
              Sorry, but it looks like your{" "}
              {props.data &&
                props.data.userSubscription &&
                props.data.userSubscription.packageName}{" "}
              has expired. <br />
              Please choose one subscription to access your offices.
            </p>
          ) : (
            <p>
              You can activate your account by extending your subscription.
              Please close this message and choose the subscription that is
              suitable to your needs.
            </p>
          )}

          {props.data &&
          props.data.userSubscription &&
          props.data.userSubscription.packageType !== "trial" ? (
            <div className="button-block">
              <button
                className="button button-round button-shadow"
                title="Choose Subscription"
                onClick={handleChoosePlan}
              >
                Choose Subscription
              </button>
            </div>
          ) : (
            <div className="button-block">
              <button
                className="button button-round button-shadow"
                title="Close"
                onClick={props.closeModal}
              >
                Close
              </button>
            </div>
          )}
        </div>
      </ModalBody>
    </Modal>
  );
};

export default withRouter(FreeTrialPopup);
