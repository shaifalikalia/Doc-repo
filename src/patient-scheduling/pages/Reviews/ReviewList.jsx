import React, { useEffect, useState } from "react";
import { useReviewsForDoctor } from "repositories/review-repository";
import styles from "./Reviews.module.scss";
import userDefaultImage from "./../../../assets/images/staff-default.svg";
import Rating from "patient-scheduling/components/Rating";
import Text from "components/Text";
import { formatDate, getDoctorFullName } from "utils";
import InfiniteScroll from "react-infinite-scroll-component";

const pageSize = 10;

export default function ReviewList({ doctorId, officeId, t }) {
  const [pageNumber, setPageNumber] = useState(1);
  const { isLoading, data } = useReviewsForDoctor(
    doctorId,
    officeId,
    pageNumber,
    pageSize
  );
  const [reviews, setReviews] = useState([]);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    if (!isLoading && data.items) {
      setReviews((r) => [...r, ...data.items]);
      setTotalItems(data.totalItems);
    }
  }, [isLoading, data]);

  if (isLoading && reviews.length === 0) {
    return (
      <div>
        <LoadingState />
      </div>
    );
  }

  if (!isLoading && reviews.length === 0) {
    return <div>{t("patient.noReviewsYet")}</div>;
  }

  const items = reviews.map((it, i) => {
    return (
      <>
        {i === 0 ? null : <hr className={styles["review-separator"]} />}
        <ListItem review={it} t={t} />
      </>
    );
  });

  return (
    <div>
      <InfiniteScroll
        dataLength={reviews.length}
        hasMore={reviews.length < totalItems}
        next={() => setPageNumber((p) => p + 1)}
      >
        {items}
      </InfiniteScroll>
    </div>
  );
}

function ListItem({ review, t }) {
  return (
    <div className={`${styles["review-container"]}`}>
      <Feedback review={review} t={t} />
      <Reply review={review} t={t} />
    </div>
  );
}

function Feedback({ review, t }) {
  const addDefaultSrc = (ev) => {
    ev.target.src = userDefaultImage;
    ev.target.onerror = null;
  };

  return (
    <div
      className={`${styles["review-item"]} ${styles["feedback-margin"]} ${styles["feedback-bg"]}`}
    >
      <div className="d-flex flex-row w-100">
        <img
          src={review.patient.profilePic || userDefaultImage}
          onError={addDefaultSrc}
          className={styles["review-profile-image"]}
          alt="profile"
        />
        <div className={styles["patient-info-container"]}>
          <div className={styles["patient-name-container"]}>
            <Text secondary size="12px" uppercase>
              {review.patient.firstName + " " + review.patient.lastName}
            </Text>
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

          <Rating rating={review.rating} margin="0px" />
        </div>
      </div>
      <Text size="12px" color="#2f3245" marginTop="10px" weight="500">
        {review.feedback}
      </Text>
    </div>
  );
}

function Reply({ review, t }) {
  if (review.feedbackComment === null) {
    return null;
  }

  const addDefaultSrc = (ev) => {
    ev.target.src = userDefaultImage;
    ev.target.onerror = null;
  };
  return (
    <div
      className={`${styles["review-item"]} ${styles["comment-margin"]} ${styles["comment-bg"]} mt-2`}
    >
      <div className="d-flex flex-row w-100">
        <img
          src={review.doctor.profilePic || userDefaultImage}
          onError={addDefaultSrc}
          className={styles["review-profile-image"]}
          alt="profile"
        />
        <div className="d-flex flex-column">
          <Text secondary size="12px" uppercase>
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
      <Text size="12px" color="#2f3245" marginTop="10px" weight="500">
        {review.feedbackComment}
      </Text>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="d-flex flex-column">
      <div className={styles["review-container"]}>
        <div
          className={`${styles["review-item"]} ${styles["placeholder-bg"]} ${styles["review-placeholder"]} ${styles["feedback-margin"]} shimmer-animation mb-2`}
        ></div>
        <div
          className={`${styles["review-item"]} ${styles["placeholder-bg"]} ${styles["review-placeholder"]} ${styles["comment-margin"]} shimmer-animation`}
        ></div>
      </div>
      <hr className={styles["review-separator"]} />
      <div className={styles["review-container"]}>
        <div
          className={`${styles["review-item"]} ${styles["placeholder-bg"]} ${styles["review-placeholder"]} ${styles["feedback-margin"]} shimmer-animation mb-2`}
        ></div>
        <div
          className={`${styles["review-item"]} ${styles["placeholder-bg"]} ${styles["review-placeholder"]} ${styles["comment-margin"]} shimmer-animation`}
        ></div>
      </div>
    </div>
  );
}
