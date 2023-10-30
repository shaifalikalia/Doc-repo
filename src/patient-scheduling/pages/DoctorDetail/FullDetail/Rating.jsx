import React from "react";
import { withTranslation } from "react-i18next";
import Text from "components/Text";
import styles from "./../DoctorDetail.module.scss";
import { Link } from "react-router-dom";
import AverageRating from "./../../../components/Rating";
import userDefaultImage from "./../../../../assets/images/staff-default.svg";
import { useReviewsForDoctor } from "repositories/review-repository";
import Toast from "components/Toast/Alert";
import { encodeId, formatDate, getDoctorFullName } from "utils";
import qs from "query-string";
import constants from "./../../../../constants";

function Rating({ doctorId, officeId, averageRating, t }) {
  const { data, error, isLoading } = useReviewsForDoctor(
    doctorId,
    officeId,
    1,
    1
  );

  if (isLoading || (!isLoading && !error && data.items.length === 0)) {
    return null;
  }

  if (!isLoading && error) {
    return <Toast errorToast message={error.message} />;
  }

  const review = data.items[0];

  const addDefaultSrc = (ev) => {
    ev.target.src = userDefaultImage;
    ev.target.onerror = null;
  };
  return (
    <div>
      <Text size="12px" color="#6f7788">
        {t("patient.ratingsReviewsTitle")}
      </Text>
      <Text
        secondary
        size="14px"
        weight="600"
        color="#102c42"
        marginBottom="9px"
      >
        {t("patient.averageRating")}
        <br />
      </Text>

      <AverageRating
        rating={averageRating}
        size="medium"
        margin="16px 0 0px 0"
      />

      <div className="mb-4">
        <Link
          to={{
            pathname: constants.routes.doctorReviews,
            search: qs.stringify({
              doctorId: encodeId(doctorId),
              officeId: encodeId(officeId),
            }),
          }}
          className={styles["anchor-link"]}
        >
          {t("patient.seeAllRatings")}
        </Link>
      </div>

      <div className={styles["review-rating-wrapper"]}>
        <div className={styles["green-review-box"]}>
          <div className="d-flex justify-content-between mb-2 w-100">
            <div className="d-flex w-100">
              <img
                class={styles["review-img"]}
                src={review.patient.profilePic || userDefaultImage}
                onError={addDefaultSrc}
                alt="profile"
              />
              <div className="w-100">
                <div className="d-flex flex-row justify-content-between w-100">
                  <Text secondary size="10px" weight="600" uppercase>
                    {review.patient.firstName + " " + review.patient.lastName}
                  </Text>
                  <AverageRating rating={review.rating} margin="0px" />
                </div>
                <Text size="12px" weight="500" color="#2f3245">
                  <div>
                    <span>{formatDate(review.feedbackSubmittedAt, "ll")}</span>
                    <span className="mx-2" style={{ color: "#e0e4dc" }}>
                      &#8226;
                    </span>
                    <span>{formatDate(review.feedbackSubmittedAt, "LT")}</span>
                  </div>
                </Text>
              </div>
            </div>
          </div>

          <Text size="12px" weight="500" color="#2f3245">
            {review.feedback}
          </Text>
        </div>

        {review.feedbackComment && (
          <div className={styles["grey-review-box"]}>
            <div className="d-flex mb-2">
              <img
                class={styles["review-img"]}
                src={review.doctor.profilePic || userDefaultImage}
                onError={addDefaultSrc}
                alt="profile"
              />
              <div>
                <Text secondary size="10px" weight="600" uppercase>
                  {getDoctorFullName(
                    review.doctor.firstName,
                    review.doctor.lastName,
                    review.doctor.honorific
                  )}
                </Text>
                <Text size="12px" weight="500" color="#2f3245">
                  <div>
                    <span>{formatDate(review.feedbackCommentedAt, "ll")}</span>
                    <span className="mx-2" style={{ color: "#e0e4dc" }}>
                      &#8226;
                    </span>
                    <span>{formatDate(review.feedbackCommentedAt, "LT")}</span>
                  </div>
                </Text>
              </div>
            </div>
            <Text size="12px" weight="500" color="#2f3245">
              {review.feedbackComment}
            </Text>
          </div>
        )}
      </div>
    </div>
  );
}

export default withTranslation()(Rating);
