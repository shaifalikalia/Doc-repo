import React, { Fragment, useState } from "react";
import styles from "./Header.module.scss";
import logo from "./../../../assets/images/home-logo.svg";
import userProfileImage from "./../../../assets/images/staff-default.svg";
import caret from "./../../../assets/images/caret.svg";
import Button from "components/Button";
import { withTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import { Link } from "react-router-dom";
import ListYourPracticeModal from "./ListYourPracticeModal";

function Header({ onLogin, onSignup, t }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const profile = useSelector((state) => state.userProfile.profile);
  const [isListYourPracticeModalOpen, setIsListYourPracticeModalOpen] =
    useState(false);
  const loginButtonProps = {
    bordered: true,
    onClick: onLogin,
    children: t("patientLogin"),
  };
  const signupButtonProps = {
    bordered: true,
    onClick: onSignup,
    children: t("patientSignup"),
  };

  const toggleDropdown = () => setIsDropdownOpen((v) => !v);

  const addDefaultSrc = (ev) => {
    ev.target.src = userProfileImage;
    ev.target.onerror = null;
  };

  const showNav = () => {
    document.querySelector(".btn").classList.toggle("active");
  };
  const openListPracticeModal = () => {
    setIsListYourPracticeModalOpen(true);
  };
  return (
    <Fragment>
      <div className={`header-section ${styles.header}`}>
        <div className="d-flex align-items-center h-100">
          <div className="container">
            <div className="d-flex align-items-center justify-content-between">
              <Link to="/">
                <img alt="" className={styles.logo} src={logo} />
              </Link>

              {!profile && (
                <div className={styles.actions}>
                  <div className={styles["btn-group"]}>
                    <div
                      onClick={() => {
                        openListPracticeModal();
                      }}
                      className={styles["practice-menu"]}
                    >
                      {t("patient.listYourPractice")}
                    </div>
                    <Button
                      {...loginButtonProps}
                      marginRight="10px"
                      className={styles["login-btn"]}
                    />
                    <Button {...signupButtonProps} />
                  </div>

                  <div
                    className="box menu-button"
                    onClick={() => {
                      setIsDropdownOpen((v) => !v);
                      showNav();
                    }}
                  >
                    <div className="btn">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}

              {profile && (
                <Dropdown isOpen={isDropdownOpen} toggle={toggleDropdown}>
                  <DropdownToggle
                    caret={false}
                    className="user-dropdown"
                    tag="div"
                  >
                    <div className={styles["usr-info"]}>
                      <div className="media">
                        <img
                          className={styles["user-img"]}
                          src={profile.profilePic || userProfileImage}
                          onError={addDefaultSrc}
                          alt="profile"
                        />
                        <div className="media-body align-self-center d-none d-md-block">
                          <span>{`${profile.firstName} ${profile.lastName}`}</span>
                          <img
                            className={styles["caret"]}
                            src={caret}
                            alt="profile"
                          />
                        </div>
                      </div>
                    </div>
                  </DropdownToggle>

                  <DropdownMenu right>
                    <DropdownItem>
                      <span>{t("navbar.logout")}</span>
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              )}
            </div>
          </div>
        </div>

        {/* Dropdown  */}
        {!profile && (
          <div
            className={`${styles.dropdown} ${
              isDropdownOpen
                ? styles["dropdown-open"]
                : styles["dropdown-close"]
            }`}
          >
            <div className="d-flex flex-column align-items-center">
              <div
                onClick={() => {
                  openListPracticeModal();
                }}
                className={"d-none " + styles["practice-menu"]}
              >
                {t("patient.listYourPractice")}
              </div>
              <Button
                {...loginButtonProps}
                height="36px"
                fontSize="14px"
                marginBottom="10px"
              />
              <Button height="36px" fontSize="14px" {...signupButtonProps} />
            </div>
          </div>
        )}
      </div>
      {isListYourPracticeModalOpen && (
        <ListYourPracticeModal
          isListYourPracticeModalOpen={isListYourPracticeModalOpen}
          setIsListYourPracticeModalOpen={setIsListYourPracticeModalOpen}
          onSignup={onSignup}
        />
      )}
    </Fragment>
  );
}

export default withTranslation()(Header);
