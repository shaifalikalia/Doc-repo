import React from "react";
import { withRouter, useHistory } from "react-router";
import { withTranslation } from "react-i18next";
import "./../../ThankYouDownload.scss";
import constants from "../../../../constants";

const Header = (props) => {
  const history = useHistory();

  const moveToAbout = () => {
    if (
      window.location.pathname == constants.routes.demoRequestThank ||
      window.location.pathname == constants.routes.demoRequestPage
    ) {
      history.push("/");
    } else {
      history.push("/about-us");
      moveToDiv("blogs-resources-section", 10);
    }
  };

  const moveToDiv = (className, timer) => {
    setTimeout(() => {
      const errors = document.getElementsByClassName(className);
      if (errors && errors?.length) {
        errors[0].scrollIntoView();
      }
    }, timer);
  };

  return (
    <div className="static-thank-you-header">
      <div className="container">
        <div className="row no-guters align-items-center">
          <div className="col-lg-2">
            <div className="logo-block">
              <div className="logo" onClick={moveToAbout}>
                <img
                  src={require("assets/images/home-logo.svg").default}
                  alt="img"
                  className="img-fluid"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(withTranslation()(Header));
