import React from "react";
import { Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import constants from "../../constants";

const Footer = ({ t }) => {
  const profile = useSelector((state) => state.userProfile.profile);
  let isPatient = false;

  if (profile && profile.role) {
    isPatient = profile.role.systemRole === constants.systemRoles.patient;
  }

  return (
    <footer>
      <div className="container">
        <div className="row no-gutters">
          <div className="col-md-6">
            <ul>
              <li>
                <Link
                  to={`${
                    isPatient
                      ? constants.routes.termsAndConditionsPatient
                      : "/terms-conditions"
                  }`}
                >
                  {t("termsAndConditions")}
                </Link>
              </li>
              <li>
                <Link
                  to={`${
                    isPatient
                      ? constants.routes.privacyPolicyPatient
                      : "/privacy-policy"
                  }`}
                >
                  {t("privacyPolicy")}
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-md-6">
            <p>
              &copy;{" "}
              {t("footer.copyrightReserved", {
                year: new Date().getFullYear(),
              })}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default withTranslation()(Footer);
