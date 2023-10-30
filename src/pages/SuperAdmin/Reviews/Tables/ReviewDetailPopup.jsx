import React from "react";
import { withTranslation } from "react-i18next";
import { Modal, ModalBody } from "reactstrap";
import orangeStarIcon from "./../../../../assets/images/orange-star.svg";
import greyStarIcon from "./../../../../assets/images/grey-star.svg";
import crossIcon from "./../../../../assets/images/cross.svg";
import { formatDate } from "utils";
import { useUpdateReviewActiveStatusMutation } from "repositories/review-repository";
import toast from "react-hot-toast";

function ReviewDetailPopup({ review, onClose, t }) {
  const mutation = useUpdateReviewActiveStatusMutation();

  const onSubmit = async () => {
    try {
      await mutation.mutateAsync({
        appointmentId: review.appointmentId,
        status: !review.isFeedbackApproved,
      });
      toast.success(
        t(
          review.isFeedbackApproved
            ? "superAdmin.reviewDeactivatedSuccessfully"
            : "superAdmin.reviewActivatedSuccessfully"
        )
      );
      review.isFeedbackApproved = !review.isFeedbackApproved;
    } catch (e) {
      toast.error(e.message);
    }
  };

  const stars = new Array(5).fill({}).map((it, i) => {
    const imgSrc = i + 1 > review.rating ? greyStarIcon : orangeStarIcon;
    return <img width={14} height={14} src={imgSrc} alt="star" />;
  });

  return (
    <Modal
      isOpen={true}
      toggle={onClose}
      className="modal-dialog-centered review-rating-modal"
      modalClassName="custom-modal"
    >
      <span className="close-btn" onClick={onClose}>
        <img src={crossIcon} alt="close" />
      </span>

      <h2 className="modal-title">{t("superAdmin.reviewsAndRatings2")}</h2>

      <ModalBody>
        <div className="review-rating-wrapper">
          <div className="green-review-box">
            <div className="d-flex justify-content-between mb-2 pb-1">
              <div>
                <div className="review-title1">
                  {review.patient.firstName + " " + review.patient.lastName}
                </div>
                <div>
                  <span>{formatDate(review.feedbackSubmittedAt, "ll")}</span>
                  <span className="mx-2" style={{ color: "#e0e4dc" }}>
                    &#8226;
                  </span>
                  <span>{formatDate(review.feedbackSubmittedAt, "LT")}</span>
                </div>
              </div>
              <div className={"d-flex  star-rating"}>{stars}</div>
            </div>
            <div>{review.feedback}</div>
          </div>

          {review.feedbackComment && (
            <div className={["grey-review-box"]}>
              <div className="mb-2 pb-1">
                <div className={["review-title1"]}>
                  {review.doctor.firstName + " " + review.doctor.lastName}
                </div>
                <div>
                  <span>{formatDate(review.feedbackCommentedAt, "ll")}</span>
                  <span className="mx-2" style={{ color: "#e0e4dc" }}>
                    &#8226;
                  </span>
                  <span>{formatDate(review.feedbackCommentedAt, "LT")}</span>
                </div>
              </div>

              <div>{review.feedbackComment}</div>
            </div>
          )}

          <div className="d-flex  mt-4">
            <button
              className={
                "button button-round button-shadow button-width-large mr-3" +
                (mutation.isLoading ? " button-loading" : "")
              }
              onClick={onSubmit}
              disabled={mutation.isLoading}
            >
              {t(
                review.isFeedbackApproved
                  ? "superAdmin.deactivateThisComment"
                  : "superAdmin.activateThisComment"
              )}
              {mutation.isLoading && <div className="loader"></div>}
            </button>
            <button
              className="button button-round button-border button-dark"
              onClick={onClose}
              disabled={mutation.isLoading}
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
}

export default withTranslation()(ReviewDetailPopup);
