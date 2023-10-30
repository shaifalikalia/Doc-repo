import React from "react";
import { withTranslation } from "react-i18next";
const HomePersonnel = (props) => {
  return (
    <div className="personnel-plan-section">
      <div className="container">
        <h2>{props.t("userPages.createFreeAccount")}</h2>
        <p>{props.t("userPages.text4")}</p>
        <div className="plan-block">
          <div className="plan-header">
            <img
              src={require("assets/images/nurse-personnel.svg").default}
              alt="img"
            />
            <h3>{props.t("userPages.signupForStaff")}</h3>
            <h4>{props.t("userPages.free")}</h4>
            <div className="button_block">
              <button
                className="button button-round button-shadow button-block"
                title={props.t("userPages.createAccount")}
                onClick={props.SignupClick}
              >
                {props.t("userPages.createAccount")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default withTranslation()(HomePersonnel);
