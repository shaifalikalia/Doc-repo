import React from "react";
import { withTranslation } from "react-i18next";

const ReachUs = (props) => {
  const email =
    (props.companyInformation && props.companyInformation.email) || "";
  return (
    <div className="reach-us-block">
      <h2>{props.t("homePage.reachUs")}</h2>
      <div className="contact-dtl">
        <div className="content-container">
          <ul>
            <li>
              <a href={`mailto:${email}`}>{email}</a>
            </li>
            <li>
              {props.companyInformation && props.companyInformation.phone}
            </li>
            <li>
              {props.companyInformation && props.companyInformation.address}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default withTranslation()(ReachUs);
