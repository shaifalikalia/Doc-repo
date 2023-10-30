import React from "react";
import { Link } from "react-router-dom";
//import AnchorLink from 'react-anchor-link-smooth-scroll'
import { withRouter } from "react-router";
import { withTranslation } from "react-i18next";
import "./../../LandingPages.scss";
import "./../../LandingPages.scss";

const Header = (props) => {
  return (
    <div className="static-thank-you-header">
      <div className="container">
        <div className="row no-guters align-items-center">
          <div className="col-lg-2">
            <div className="logo-block">
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
    </div>
  );
};

export default withRouter(withTranslation()(Header));
