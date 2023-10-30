import Card from "components/Card";
import Text from "components/Text";
import React from "react";
import styles from "./Home.module.scss";
import { withTranslation } from "react-i18next";

import userDefaultImage from "./../../../assets/images/staff-default.svg";
import Rating from "patient-scheduling/components/Rating";
import { getDoctorFullName, getFullAddress } from "utils";

function DoctorCard({ doctor, t }) {
  const addDefaultSrc = (ev) => {
    ev.target.src = userDefaultImage;
    ev.target.onerror = null;
  };

  return (
    <Card
      radius="15px"
      marginBottom="28px"
      shadow="0 0 15px 0 rgba(0, 0, 0, 0.06)"
    >
      <div className={styles["doctor-card-container"]}>
        <img
          src={doctor.profilePic || userDefaultImage}
          onError={addDefaultSrc}
          alt="profile"
        />

        <Text
          secondary
          width="232px"
          size="16px"
          weight="600"
          marginTop="21px"
          align="center"
          ellipsis
        >
          {getDoctorFullName(
            doctor.firstName,
            doctor.lastName,
            doctor.honorific
          )}
        </Text>

        <Text
          width="180px"
          align="center"
          height="15px"
          size="10px"
          color="#87928d"
          ellipsis
        >
          {doctor.specialities}
        </Text>

        <Rating rating={doctor.overallRating} />

        <Text secondaryDark1 width="232px" size="12px" align="center" ellipsis>
          {doctor.office.name}
        </Text>

        <Text
          className="addressField"
          size="12px"
          minHeight="50px"
          align="center"
          color="#6f7788"
          overflow="hidden"
        >
          {getFullAddress(doctor.officeLocation, t)}
        </Text>
      </div>
    </Card>
  );
}

export default withTranslation()(DoctorCard);
