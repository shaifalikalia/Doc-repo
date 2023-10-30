import React from "react";
import { withRouter } from "react-router";
import { withTranslation } from "react-i18next";
import "./../../ThankYouDownload.scss";

const Footer = (props) => {
  return (
    <div className="static-thank-you-footer">
      <div className="footer-block">
        <div className="container">
          <div className="no-gutters footer-wrapper justify-content-between">
            <div className="">
              <div className="footer-logo">
                <div className="logo">
                  <img
                    src={
                      require("assets/images/landing-pages/site-logo-white.svg")
                        .default
                    }
                    alt="img"
                    className="img-fluid"
                  />
                </div>
              </div>
            </div>
            <div className="">
              <div className="social-media-links">
                <ul>
                  <li>
                    <a
                      href={
                        "https://www.facebook.com/Miraxis-Technology-Soutions-106384531416744"
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        src={require("assets/images/facebook.svg").default}
                        alt="img"
                        className="img-fluid"
                      />
                    </a>
                  </li>
                  <li>
                    <a
                      href={
                        "https://www.linkedin.com/company/miraxis-technology-solutions/"
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        src={require("assets/images/linkedin.svg").default}
                        alt="img"
                        className="img-fluid"
                      />
                    </a>
                  </li>
                  <li>
                    <a
                      href={"https://twitter.com/miraxistechsol"}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        src={require("assets/images/twitter.svg").default}
                        alt="img"
                        className="img-fluid"
                      />
                    </a>
                  </li>
                  <li>
                    <a
                      href={"https://www.instagram.com/miraxistechnology/"}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        src={require("assets/images/instagram.svg").default}
                        alt="img"
                        className="img-fluid"
                      />
                    </a>
                  </li>

                  <li>
                    <a
                      href={
                        "https://www.youtube.com/channel/UCdJkXQEZBcgbUENXGLn5rDw"
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        src={require("assets/images/youtube.svg").default}
                        alt="img"
                        className="img-fluid"
                      />
                    </a>
                  </li>
                </ul>
              </div>

              <p className="cpy-text">
                &copy; {new Date().getFullYear()} {props.t("footer.text")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(withTranslation()(Footer));
