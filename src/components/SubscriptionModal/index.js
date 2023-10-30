import React from "react";
import { Modal, ModalBody } from "reactstrap";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

const SubscriptionPopup = (props) => {
  return (
    <Modal
      isOpen={props.show}
      className="modal-dialog-centered modal-md status-modal"
      modalClassName="custom-modal"
    >
      <span className="close-btn" onClick={props.closeModal}>
        <img src={require("assets/images/cross.svg").default} alt="close" />
      </span>
      <ModalBody>
        <div className="status-block text-center">
          {props.profile && props.profile.billingPreferenceType === 1 ? (
            <h2>
              Subscription payment has failed. Please update credit card details
              to continue using the subscription
            </h2>
          ) : (
            <h2>
              Subscription payment for office's has failed. Please update.
            </h2>
          )}

          {props.profile && props.profile.billingPreferenceType === 1 ? (
            <Link
              to="/manage-cards"
              onClick={props.closeModal}
              className="button button-round button-shadow"
              title="Update Card"
            >
              Update Card
            </Link>
          ) : (
            <Link
              to="/manage-cards"
              onClick={props.closeModal}
              className="button button-round button-shadow"
              title="Update Cards"
            >
              Update Cards
            </Link>
          )}
        </div>
      </ModalBody>
    </Modal>
  );
};

const mapStateToProps = ({ userProfile: { profile } }) => ({
  profile,
});

export default connect(mapStateToProps)(SubscriptionPopup);
