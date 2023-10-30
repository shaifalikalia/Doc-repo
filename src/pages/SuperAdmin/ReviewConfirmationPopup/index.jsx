import Text from "components/Text";
import React from "react";
import toast from "react-hot-toast";
import { withTranslation } from "react-i18next";
import { Modal, ModalBody } from "reactstrap";
import { useUpdateReviewActiveStatusMutation } from "repositories/review-repository";

function ReviewConfirmationPopup({ onClose, onActionComplete, review, t }) {
  const mutation = useUpdateReviewActiveStatusMutation();

  const onSubmit = async () => {
    try {
      await mutation.mutateAsync({
        appointmentId: review.appointmentId,
        status: !review.isFeedbackApproved,
      });
      toast.success(
        review.isFeedbackApproved
          ? t("superAdmin.reviewDeactivatedSuccessfully")
          : t("superAdmin.reviewActivatedSuccessfully")
      );
      if (onActionComplete) {
        onActionComplete();
      }
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <Modal
      isOpen={true}
      toggle={onClose}
      className="modal-dialog-centered"
      modalClassName="custom-modal"
    >
      <span className="close-btn" onClick={onClose}>
        <img src={require("assets/images/cross.svg").default} alt="close" />
      </span>
      <ModalBody>
        <Text size="25px" weight="500" color="#111b45">
          {t(
            review.isFeedbackApproved
              ? "superAdmin.reviewDeactivateTitle"
              : "superAdmin.reviewActivateTitle"
          )}
        </Text>
        <p className="mt-4">
          {t(
            review.isFeedbackApproved
              ? "superAdmin.reviewDeactivationConfirmationText"
              : "superAdmin.reviewActivationConfirmationText"
          )}
        </p>

        <div className="d-flex">
          <button
            className={
              "button button-round button-shadow button-min-100 margin-right-2x" +
              (mutation.isLoading ? " button-loading" : "")
            }
            disabled={mutation.isLoading}
            onClick={onSubmit}
          >
            {t("yes")}
            {mutation.isLoading && <div className="loader"></div>}
          </button>
          <button
            className="button button-round button-border button-dark"
            disabled={mutation.isLoading}
            onClick={onClose}
          >
            {t("cancel")}
          </button>
        </div>
      </ModalBody>
    </Modal>
  );
}

export default withTranslation()(ReviewConfirmationPopup);
