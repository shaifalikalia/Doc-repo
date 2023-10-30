import React from "react";
import { withTranslation } from "react-i18next";
import constants from "../../constants";
const MobileApp = ({ t }) => {
  return (
    <div className="mobile-app-container">
      <div className="container">
        <div className="mobile-app-block">
          <h2>{t("staff.downloadAppText")}</h2>
          <div className="button-block">
            <a
              href={constants.appLinks.patientIosAppStoreLink}
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={require("assets/images/apple.svg").default}
                alt="apple"
              />
            </a>
            <a
              href={constants.appLinks.patientAndroidAppStoreLink}
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={require("assets/images/google-play.svg").default}
                alt="google-play"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withTranslation()(MobileApp);
