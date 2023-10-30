import React from "react";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const CustomErorPage = ({ t }) => {
  return (
    <div className="page-error-block">
      <div className="container">
        <div className="page-error-container">
          <img
            className="bg-image"
            alt="img"
            src={require("assets/images/error-graphic-bg.svg").default}
          />
          <div className="page404Wrapper">
            <img
              alt="img"
              src={require("assets/images/error-graphic.svg").default}
            />
            <h5>{t("CustomErrorMsg")}</h5>
          </div>
        </div>
        <Link to="/">
          {" "}
          <button
            className="button button-round button-shadow"
            title="Save Office"
          >
            {t("BackToHome")}
          </button>
        </Link>
      </div>
    </div>
  );
};

export default withTranslation()(CustomErorPage);
