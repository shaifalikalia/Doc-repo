import React, { useEffect, useState } from "react";
import {
  Link,
  useHistory,
  matchPath,
  NavLink,
  useLocation,
} from "react-router-dom";
import { withTranslation } from "react-i18next";

const HomeHeader = (props) => {
  const history = useHistory();
  const [dropdownopen, setDropdownopen] = useState(false);

  const showNav = () => {
    document.querySelector(".nav-section").classList.toggle("open");
    document.querySelector(".btn").classList.toggle("active");
  };

  const hideNave = () => {
    document.querySelector(".nav-section").classList.remove("open");
    document.querySelector(".btn").classList.remove("active");
  };

  const moveToAbout = () => {
    history.push("/about-us");
    hideNave();
    moveToDiv("blogs-resources-section", 10);
  };

  const moveToOverView = () => {
    const match = matchPath(window.location.pathname, ["/about-us"]);
    if (match) {
      window.scrollTo(0, 0);
      hideNave();
    } else {
      hideNave();
      history.push("/about-us");
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

  const [scroll, setScroll] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(0);
  const isActiveSubmenu = (idx) => idx === activeSubmenu;
  const toggleSubmenu = (idx) => {
    if (activeSubmenu !== idx) {
      setActiveSubmenu(idx);
    }
    if (activeSubmenu === idx) {
      setActiveSubmenu(0);
    }
  };

  const location = useLocation();
  useEffect(() => {
    window.addEventListener("scroll", () => {
      setScroll(window.scrollY > 100);
    });
  }, []);

  const isPlatformActive = () =>
    !!matchPath(location.pathname, [
      "/overview",
      "/faq",
      "/products",
      "/pricing",
      "/features",
    ]);
  const isIndustryActive = () => !!matchPath(location.pathname, []);
  const isOurCustomersActive = () =>
    !!matchPath(location.pathname, [
      "/dentist",
      "/physician",
      "/pharmacist",
      "/personnel",
      "/patient",
      "/supplier",
      "/healthcare-enterprise",
    ]);
  const isAboutUsActive = () => !!matchPath(location.pathname, ["/about-us"]);

  const handleLogin = () => {
    props.LoginClick();
  };

  const handleSignup = () => {
    props.SignupClick();
  };

  return (
    <div className={scroll ? "header-section  header-fixed" : "header-section"}>
      <div className="container">
        <div className="row no-guters align-items-center">
          <div className="col-lg-2">
            <div className="logo-block">
              <Link to="/" onClick={hideNave}>
                <div className="logo">
                  <img
                    src={require("assets/images/home-logo.svg").default}
                    alt="img"
                    className="img-fluid"
                  />
                </div>
              </Link>
            </div>
            <div className="box menu-button" onClick={showNav}>
              <div className="btn">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
          <div className="col-lg-10">
            <div className="nav-section">
              <div className="d-flex d-lg-none button-container">
                <nav className="d-inline-block w-auto custom-nav-container">
                  <ul className="position-relative custom-menu-list">
                    <li className="doctor-btn d-flex align-items-center px-3 float-none custom-menu">
                      <div>
                        <span className="mr-1">
                          {dropdownopen ? (
                            <img
                              src={
                                require("assets/images/doctor-arrow.svg")
                                  .default
                              }
                              alt="img"
                              className="show"
                              onClick={() => setDropdownopen((pre) => !pre)}
                            />
                          ) : (
                            <img
                              src={
                                require("assets/images/doctor-arrow.svg")
                                  .default
                              }
                              alt="img"
                              onClick={() => setDropdownopen((pre) => !pre)}
                            />
                          )}
                        </span>
                        <span>
                          <img
                            src={
                              require("assets/images/find-doctor-vertical-line.jpg")
                                .default
                            }
                            alt="img"
                            className="find-doctor-vertical-line"
                          />
                        </span>
                      </div>
                      <Link to="/doctors" className="ml-1">
                        <div>
                          {props.t("patient.findDoctorsTitle")}
                      
                        </div>
                      </Link>
                      <div className="doctor-btn-search-icon ">
                      <img
                            src={
                              require("assets/images/search-icon.svg").default
                            }
                            alt="img"
                            className="img-fluid ml-2"
                          />
                      </div>
                    </li>
                    {dropdownopen && (
                      <li className="position-absolute z-index2 sub-menu-list pt-0 m-3">
                        <img
                          src={
                            require("assets/images/submenu-triangle.svg")
                              .default
                          }
                          alt="img"
                          className="img-fluid submenu-triangle"
                        />
                        <ul>
                          <li>
                            <button
                              className="blogResources"
                              id="mob-blg-res"
                              onClick={handleSignup}
                            >
                              Find Jobs
                            </button>
                          </li>
                          <li>
                            <button
                              className="blogResources"
                              onClick={handleSignup}
                            >
                              Find Staff
                            </button>
                          </li>
                          <li>
                            <button
                              className="blogResources"
                              onClick={handleSignup}
                            >
                              Find Supplies
                            </button>
                          </li>
                        </ul>
                      </li>
                    )}
                  </ul>
                </nav>

                <div className="d-inline-block custom-btn-container">
                  <button
                    className="button button-round button-border button-theme margin-right-2x custom-btn"
                    onClick={handleLogin}
                  >
                    {props.t("login")}
                  </button>
                  <button
                    className="button  button-round button-border button-theme custom-btn"
                    onClick={handleSignup}
                  >
                    {props.t("signup1")}
                  </button>
                </div>
              </div>
              <nav>
                <ul>
                  <li
                    onClick={() => toggleSubmenu(1)}
                    className={`${
                      isPlatformActive() ? "active-nav-item" : ""
                    } ${isActiveSubmenu(1) ? "active-li" : ""}`}
                  >
                    <Link to="#">
                      {props.t("homePage.platform")}
                      <span>
                        <img
                          src={require("assets/images/down-arrow.svg").default}
                          alt="img"
                        />
                      </span>
                    </Link>
                    <div className="sub-menu">
                      <ul>
                        <li>
                          <NavLink
                            to="/overview"
                            activeClassName="active"
                            onClick={hideNave}
                          >
                            {props.t("navbar.overview")}
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            to="/products"
                            activeClassName="active"
                            onClick={hideNave}
                          >
                            {props.t("navbar.products")}
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            to="/features"
                            activeClassName="active"
                            onClick={hideNave}
                          >
                            {props.t("navbar.features")}
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            to="/pricing"
                            activeClassName="active"
                            onClick={hideNave}
                          >
                            {props.t("navbar.pricing")}
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            to="/faq"
                            activeClassName="active"
                            onClick={hideNave}
                          >
                            {props.t("navbar.fAQ")}
                          </NavLink>
                        </li>
                      </ul>
                    </div>
                  </li>
                  <li
                    onClick={() => toggleSubmenu(2)}
                    className={`${
                      isIndustryActive() ? "active-nav-item" : ""
                    } ${isActiveSubmenu(2) ? "active-li" : ""}`}
                  >
                    <Link to="#">
                      {props.t("navbar.industry")}
                      <span>
                        <img
                          src={require("assets/images/down-arrow.svg").default}
                          alt="img"
                        />
                      </span>
                    </Link>
                    <div className="sub-menu">
                      <ul>
                        <li>
                          <NavLink
                            to="/"
                            activeClassName="active1"
                            onClick={hideNave}
                          >
                            {props.t("navbar.healthcare")}
                          </NavLink>
                        </li>
                      </ul>
                    </div>
                  </li>
                  <li
                    onClick={() => toggleSubmenu(3)}
                    className={`${
                      isOurCustomersActive() ? "active-nav-item" : ""
                    } ${isActiveSubmenu(3) ? "active-li" : ""}`}
                  >
                    <Link to="#">
                      {props.t("navbar.ourCustomers")}
                      <span>
                        <img
                          src={require("assets/images/down-arrow.svg").default}
                          alt="img"
                        />
                      </span>
                    </Link>

                    <div className="sub-menu">
                      <ul>
                        <li>
                          <NavLink
                            to="/dentist"
                            activeClassName="active"
                            onClick={hideNave}
                          >
                            {props.t("dentist")}
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            to="/physician"
                            activeClassName="active"
                            onClick={hideNave}
                          >
                            {props.t("physician")}
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            to="/pharmacist"
                            activeClassName="active"
                            onClick={hideNave}
                          >
                            {props.t("pharmacist")}
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            to="/personnel"
                            activeClassName="active"
                            onClick={hideNave}
                          >
                            {props.t("personnel")}
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            to="/patient"
                            activeClassName="active"
                            onClick={hideNave}
                          >
                            {props.t("homePage.patient")}
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            to="/supplier"
                            activeClassName="active"
                            onClick={hideNave}
                          >
                            {props.t("navbar.supplier")}
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            to="/healthcare-enterprise"
                            activeClassName="active"
                            onClick={hideNave}
                          >
                            {props.t("navbar.enterprise")}
                          </NavLink>
                        </li>
                      </ul>
                    </div>
                  </li>
                  <li
                    onClick={() => toggleSubmenu(4)}
                    className={`${isAboutUsActive() ? "active-nav-item" : ""} ${
                      isActiveSubmenu(4) ? "active-li" : ""
                    }`}
                  >
                    <Link to="#">
                      {props.t("navbar.aboutUs")}
                      <span>
                        <img
                          src={require("assets/images/down-arrow.svg").default}
                          alt="img"
                        />
                      </span>
                    </Link>
                    <div className="sub-menu">
                      <ul>
                        <li>
                          <button
                            className="blogResources"
                            activeClassName="active1"
                            onClick={moveToOverView}
                          >
                            {props.t("navbar.overview")}
                          </button>
                        </li>
                        <li>
                          <button
                            className="blogResources"
                            activeClassName="active1"
                            onClick={moveToAbout}
                          >
                            {props.t("navbar.blogAndResources")}
                          </button>
                        </li>
                      </ul>
                    </div>
                  </li>
                </ul>
                <ul>
                  <li className="doctor-btn d-none d-lg-flex align-items-center px-3 custom-menu">
                    <div className="cursor-pointer">
                      <span className="mr-2">
                        {dropdownopen ? (
                          <img
                            src={
                              require("assets/images/doctor-arrow.svg").default
                            }
                            alt="img"
                            className="show"
                            onClick={() => setDropdownopen((pre) => !pre)}
                          />
                        ) : (
                          <img
                            src={
                              require("assets/images/doctor-arrow.svg").default
                            }
                            alt="img"
                            onClick={() => setDropdownopen((pre) => !pre)}
                          />
                        )}
                      </span>
                      <span>
                        <img
                          src={
                            require("assets/images/find-doctor-vertical-line.jpg")
                              .default
                          }
                          alt="img"
                          className="find-doctor-vertical-line"
                        />
                      </span>
                    </div>

                    <Link to="/doctors" className="ml-2">
                      <div>
                        {props.t("patient.findDoctorsTitle")}
                        <img
                          src={require("assets/images/search-icon.svg").default}
                          alt="img"
                          className="img-fluid ml-2"
                        />
                      </div>
                    </Link>
                    {dropdownopen && (
                      <div className="sub-menu-list">
                        <img
                          src={
                            require("assets/images/submenu-triangle.svg")
                              .default
                          }
                          alt="img"
                          className="img-fluid submenu-triangle"
                        />
                        <ul>
                          <li>
                            <button
                              className="blogResources"
                              id="blg-resource"
                              onClick={handleSignup}
                            >
                              Find Jobs
                            </button>
                          </li>
                          <li>
                            <button
                              className="blogResources"
                              onClick={handleSignup}
                            >
                              Find Staff
                            </button>
                          </li>
                          <li>
                            <button
                              className="blogResources"
                              onClick={handleSignup}
                            >
                              Find Supplies
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </li>
                </ul>
              </nav>
              <div className="reg-btn-block d-lg-inline-block d-none">
                <button
                  className="button button-round button-border button-theme login-btn"
                  onClick={handleLogin}
                >
                  {props.t("login")}
                </button>
                <button
                  className="button  button-round button-border button-theme "
                  onClick={handleSignup}
                >
                  {props.t("signup1")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default withTranslation()(HomeHeader);
