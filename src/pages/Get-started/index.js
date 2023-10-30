import React from "react";
import { withTranslation } from "react-i18next";
import "./GetStarted.scss";
import { Nav, NavItem, NavLink } from "reactstrap";
import { MsalAuthProvider } from "react-aad-msal";
import {
  config as configSU,
  parameters,
  options as optionsSU,
} from "../../services/authProviderSignup";
import { useHistory, Link } from "react-router-dom";
import HomeFooter from "components/Home-Footer";

function GetStarted({ t }) {
  const history = useHistory();

  const moveToSignUp = () => {
    const provider = new MsalAuthProvider(configSU, parameters, optionsSU);
    provider.login();
  };

  const moveToHome = () => {
    history.push("/");
    moveToDiv("contact-section-home", 1000);
  };

  const moveToContact = () => {
    history.push("/contact");
    moveToDiv("reach-us-support", 500);
  };

  const moveToDiv = (className, duration) => {
    setTimeout(() => {
      const divToMoved = document.getElementsByClassName(className);
      if (divToMoved && divToMoved?.length) {
        divToMoved[0].scrollIntoView();
      }
    }, duration);
  };

  return (
    <div className="app-page">
      <div className="banner-block  get-started-banner">
        <div className="container">
          <div className="get-started-header">
            <div className="row">
              <div className="col-lg-12">
                <div className="getstarted-logo">
                  <Link to="/">
                    <div className="logo">
                      <img
                        src={require("assets/images/home-logo.svg").default}
                        alt="img"
                        className="img-fluid"
                      />
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="banner-caption">
            <h2>{t("getstarted.getstarted")}</h2>

            <p>{t("getstarted.getstartedDesc")}</p>
            <Nav tabs className="get-started-tabs">
              <NavItem>
                <NavLink onClick={moveToSignUp}>
                  <img
                    className="icon-grey"
                    src={
                      require("assets/images/landing-pages/signup-icon.svg")
                        .default
                    }
                    alt="icon"
                  />

                  {t("getstarted.signup")}
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink onClick={moveToHome}>
                  <img
                    className="icon-grey"
                    src={
                      require("assets/images/landing-pages/request-demo-icon.svg")
                        .default
                    }
                    alt="icon"
                  />

                  {t("getstarted.requestDemo")}
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink onClick={moveToContact}>
                  <img
                    className="icon-grey"
                    src={
                      require("assets/images/landing-pages/contact-icon.svg")
                        .default
                    }
                    alt="icon"
                  />
                  {t("getstarted.contact")}
                </NavLink>
              </NavItem>
            </Nav>
          </div>
        </div>
      </div>
      <HomeFooter />
    </div>
  );
}
export default withTranslation()(GetStarted);
