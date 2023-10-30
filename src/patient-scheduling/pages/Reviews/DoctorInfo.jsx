import Text from "components/Text";
import Toast from "components/Toast/Alert";
import Rating from "patient-scheduling/components/Rating";
import React from "react";
import { useDoctorDetail } from "repositories/doctor-repository";
import { getDoctorFullName } from "utils";
import styles from "./Reviews.module.scss";
import userDefaultImage from "./../../../assets/images/staff-default.svg";

export default function DoctorInfo({ doctorId, officeId, t }) {
  const { isLoading, data, error } = useDoctorDetail(doctorId, officeId);

  let content = null;
  if (isLoading) {
    content = <LoadingState />;
  }

  if (!isLoading && error) {
    content = <Toast errorToast message={error.message} />;
  }

  const addDefaultSrc = (ev) => {
    ev.target.src = userDefaultImage;
    ev.target.onerror = null;
  };
  if (!isLoading && data) {
    content = (
      <div className="d-flex flex-column">
        <div className={styles["doctor-profile-container"]}>
          <img
            src={data.profilePic || userDefaultImage}
            onError={addDefaultSrc}
            className={`${styles["doctor-profile-image"]} ${styles["image-bg"]} shimmer-animation`}
            alt="profile"
          />
          <div className="d-flex flex-column">
            <Text secondary size="18px" weight="600">
              {getDoctorFullName(data.firstName, data.lastName, data.honorific)}
            </Text>
            <Text>{data.designation && data.designation.name}</Text>
          </div>
        </div>

        <Text weight="600" color="#102c42">
          {t("patient.averageRating")}
        </Text>

        <Rating rating={data.overallRating} size="medium" />
      </div>
    );
  }

  return <div>{content}</div>;
}

function LoadingState() {
  return (
    <div className="d-flex flex-column">
      <div className={styles["doctor-profile-container"]}>
        <div
          className={`${styles["doctor-profile-image"]} ${styles["placeholder-bg"]} shimmer-animation`}
        ></div>
        <div className="d-flex flex-column">
          <div className="shimmer-animation text-placeholder-150 mb-2"></div>
          <div className="shimmer-animation text-placeholder-100"></div>
        </div>
      </div>

      <div className="shimmer-animation text-placeholder-100 mb-3"></div>

      <div className="shimmer-animation text-placeholder-100"></div>
    </div>
  );
}
