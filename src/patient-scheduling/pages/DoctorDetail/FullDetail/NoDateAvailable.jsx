import React from "react";
import Text from "components/Text";
import styles from "./../DoctorDetail.module.scss";
import scheduleIcon from "./../../../../assets/images/schedule-icon.svg";

export default function NoDateAvailable({
  office,
  t,
  goToRequestAppointmentPage,
}) {
  return (
    <div className={styles["book-appointment-card"]}>
      <Text secondary size="16px" weight="600" marginBottom="10px">
        {t("patient.bookAppointment")}
      </Text>

      <div className={styles["border-row"]}>
        <Text size="10px" weight="400" color="#87928d">
          {t("patient.showingSlots")}
        </Text>
        <Text
          secondary
          size="14px"
          weight="500"
          marginBottom="5px"
          color="#102c42"
        >
          {office.name}
        </Text>
      </div>

      <div className={styles["border-row"]}>
        <Text size="10px" weight="400" color="#87928d">
          {t("patient.timezone")}
        </Text>
        <Text
          secondary
          size="14px"
          weight="500"
          marginBottom="5px"
          color="#102c42"
        >
          {office.timezoneCode}
        </Text>
      </div>

      <div className={styles["border-row"] + " " + "mt-3"}>
        <Text size="12px" weight="400" color="#6f7788" marginBottom="0px">
          {t("patient.couldNotFindTheDesiredTimeslots")}
        </Text>
        <span
          className="link-btn d-inline-block mb-4"
          onClick={goToRequestAppointmentPage}
        >
          {t("patient.requestAppointment")}
        </span>
      </div>

      <div className="d-flex flex-column align-items-center">
        <img
          src={scheduleIcon}
          width={100}
          height={105}
          style={{ marginTop: 30, marginBottom: 20 }}
          alt=""
        />

        <Text width="295px" align="center" size="12px" color="#6f7788">
          {t("patient.noAvailableDateMessage")}
        </Text>
      </div>
    </div>
  );
}
