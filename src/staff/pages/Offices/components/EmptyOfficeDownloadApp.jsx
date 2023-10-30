import React from "react";
import { withTranslation } from "react-i18next";
import constants from "../../../../constants";

import styles from "../Offices.module.scss";
const EmptyOfficeDownloadApp = ({ t }) => {
  return (
    <div className={styles["download-app-wrapper"]}>
      <div className={styles["main-heading"]}>
        {t("staff.downloadTheApplication")}
      </div>
      <p> {t("staff.downloadTheApplicationDesc")}</p>
      <div className={styles["badge-img-box"]}>
        <a href={constants.DOWNLOADLINK.playStore} target="blank">
          <img
            src={require("assets/images/office/google-play-badge.svg").default}
            alt="icon"
          />
        </a>
        <a href={constants.DOWNLOADLINK.appStore} target="blank">
          <img
            src={require("assets/images/office/app-store-badge.svg").default}
            alt="icon"
          />
        </a>
      </div>
    </div>
  );
};

export default withTranslation()(EmptyOfficeDownloadApp);
