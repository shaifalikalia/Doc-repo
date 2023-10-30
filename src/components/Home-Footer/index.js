import React from "react";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";
import { withTranslation } from "react-i18next";
import { useHistory } from "react-router";

const HomeFooter = (props) => {
  const history = useHistory();

  const moveToAbout = () => {
    history.push("/about-us");
    moveToDiv("blogs-resources-section", 500);
  };

  const moveToDiv = (className, timer) => {
    setTimeout(() => {
      const errors = document.getElementsByClassName(className);
      if (errors && errors?.length) {
        errors[0].scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "start",
        });
      }
    }, timer);
  };

  return (
    <div className="footer-section">
      <div className="footer-block">
        <div className="container">
          <div className="row no-gutters">
            <div className="col-lg-4">
              <div className="footer-logo">
                <div className="logo">
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

              <p className="cpy-text d-lg-block d-none">
                &copy; {new Date().getFullYear()} {props.t("footer.text")}
              </p>
            </div>
            <div className="col-lg-1 col-6 col-md-4 platform-menu">
              <div className="footer-links">
                <h4>{props.t("homePage.platform")}</h4>
                <ul>
                  <li>
                    <Link to="/overview">{props.t("navbar.overview")}</Link>
                  </li>
                  <li>
                    <Link to="/products">{props.t("navbar.products")}</Link>{" "}
                  </li>
                  <li>
                    <Link to="/features">{props.t("navbar.features")}</Link>{" "}
                  </li>
                  <li>
                    <Link to="/pricing">{props.t("navbar.pricing")}</Link>{" "}
                  </li>
                  <li>
                    <Link to="/faq">{props.t("navbar.fAQ")}</Link>{" "}
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3 col-md-8 col-12 customer-menu">
              <div className="footer-links">
                <h4>{props.t("navbar.ourCustomers")}</h4>
                <ul>
                  <li>
                    {" "}
                    <Link to="/dentist"> {props.t("dentist")}</Link>{" "}
                  </li>
                  <li>
                    {" "}
                    <Link to="/patient">
                      {" "}
                      {props.t("homePage.patient")}{" "}
                    </Link>{" "}
                  </li>
                  <li>
                    {" "}
                    <Link to="/physician"> {props.t("physician")} </Link>{" "}
                  </li>
                  <li>
                    {" "}
                    <Link to="/supplier">
                      {props.t("navbar.supplier")}{" "}
                    </Link>{" "}
                  </li>
                  <li>
                    {" "}
                    <Link to="/pharmacist"> {props.t("pharmacist")} </Link>{" "}
                  </li>
                  <li>
                    {" "}
                    <Link to="/healthcare-enterprise">
                      {" "}
                      {props.t("navbar.enterprise")}{" "}
                    </Link>{" "}
                  </li>
                  <li>
                    {" "}
                    <Link to="/personnel"> {props.t("personnel")} </Link>{" "}
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-2 col-md-4 col-6 company-menu">
              <div className="footer-links">
                <h4>{props.t("company")}</h4>
                <ul>
                  <li>
                    <Link to="/about-us">{props.t("aboutUs")}</Link>
                  </li>
                  <li>
                    <button className="blogResourcesBtn" onClick={moveToAbout}>
                      {props.t("blogsAndResources.blogsAndResources")}
                    </button>
                  </li>
                  <li>
                    <Link to="/contact">{props.t("contactUs")}</Link>
                  </li>
                  <li>
                    <Link to="/contact">{props.t("support")}</Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-lg-2 col-md-4 col-12 policy-menu">
              <div className="footer-links">
                <h4>{props.t("policies")}</h4>
                <ul>
                  <li>
                    <Link to="/terms-conditions">
                      {props.t("termsOfService")}
                    </Link>
                  </li>
                  <li>
                    <Link to="/privacy-policy">{props.t("privacyPolicy")}</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <p className="cpy-text d-lg-none d-block text-center">
            &copy; {new Date().getFullYear()} {props.t("footer.text")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default withRouter(withTranslation()(HomeFooter));
