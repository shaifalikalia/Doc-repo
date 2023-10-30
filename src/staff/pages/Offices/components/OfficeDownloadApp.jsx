import React from "react";
import { withTranslation } from "react-i18next";
import constants from "../../../../constants";
import styles from "../Offices.module.scss";
import { useSelector } from "react-redux";

const OfficeDownloadApp = ({ t }) => {
  const profile = useSelector((state) => state.userProfile.profile);
  let isPatient = false;

  if (profile && profile.role) {
    isPatient = profile.role.systemRole === constants.systemRoles.patient;
  }

  return (
    <div
      className={
        styles["download-app-wrapper"] + " " + styles["download-app-bottom"]
      }
    >
      <div>
        {" "}
        <div className={styles["main-heading"]}>
          {t("staff.downloadTheApplication")}
        </div>
        <div> {t("staff.downloadTheApplicationDesc")}</div>
      </div>
      <div className={styles["badge-img-box"]}>
        <a
          href={
            isPatient
              ? constants.DOWNLOADLINKFORPATIENT.playStore
              : constants.DOWNLOADLINK.playStore
          }
          target="blank"
        >
          <img
            src={require("assets/images/office/google-play-badge.svg").default}
            alt="icon"
          />
        </a>
        <a
          href={
            isPatient
              ? constants.DOWNLOADLINKFORPATIENT.appStore
              : constants.DOWNLOADLINK.appStore
          }
          target="blank"
        >
          <img
            src={require("assets/images/office/app-store-badge.svg").default}
            alt="icon"
          />
        </a>
      </div>
    </div>
  );
};

export default withTranslation()(OfficeDownloadApp);
