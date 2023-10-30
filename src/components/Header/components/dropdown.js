import React, { useState } from "react";
import { connect } from "react-redux";
import { config, parameters, options } from "services/authProvider";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { Link, useHistory } from "react-router-dom";
import { withTranslation } from "react-i18next";
import constants from "./../../../constants";
import { MsalAuthProvider } from "react-aad-msal";
import { useAccountOwners } from "repositories/scheduler-repository";
import MessageDot from "components/MessageDot";
import userDefaultImage from "../../../assets/images/staff-default.svg";

const HeaderDropdown = (props) => {
  const { t, newNotification, isDisabledClass, redirectWithCheck, location } =
    props;
  const history = useHistory();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownNotificationOpen, setDropdownNotificationOpen] =
    useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const toggleNotificafation = () =>
    setDropdownNotificationOpen((prevState) => !prevState);
  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    new MsalAuthProvider(config, parameters, options).logout();
  };

  const { role, profileSetupStep, userSubscription } = props.profile;
  const { data: ownerList } = useAccountOwners({
    enabled: role?.systemRole === constants.systemRoles.staff,
  });
  let dropdownItems = null;
  if (role.systemRole === constants.systemRoles.accountOwner) {
    dropdownItems = (
      <AccountOwnerDropdownItems
        profileSetupStep={profileSetupStep}
        subscription={userSubscription}
        t={t}
        isDisabledClass={isDisabledClass}
        redirectWithCheck={redirectWithCheck}
        location={location}
      />
    );
  } else if (role.systemRole === constants.systemRoles.superAdmin) {
    dropdownItems = <SuperAdminDropdownItems t={t} />;
  } else if (role.systemRole === constants.systemRoles.staff) {
    dropdownItems = (
      <StaffDropdownItems
        t={t}
        profile={props.profile}
        ownerList={ownerList}
        isDisabledClass={isDisabledClass}
        redirectWithCheck={redirectWithCheck}
        location={location}
      />
    );
  } else if (role.systemRole === constants.systemRoles.patient) {
    dropdownItems = <PatientDropdownItems t={t} />;
  }

  const moveToNotificationPage = () => {
    history.push(constants.routes.notification.notificationDetail);
  };

  let showNotificationIcon = true;
  if (role?.systemRole === constants.systemRoles.staff && !ownerList?.length) {
    showNotificationIcon = false;
  }

  const bellIconRoles = [
    constants.systemRoles.accountOwner,
    constants.systemRoles.staff,
  ];

  const addDefaultSrc = (ev) => {
    ev.target.src = userDefaultImage;
    ev.target.onerror = null;
  };

  return (
    <>
      {showNotificationIcon && (
        <Dropdown
          isOpen={dropdownNotificationOpen}
          toggle={toggleNotificafation}
          className="notify-dropdown"
        >
          <DropdownToggle caret={false} tag="div">
            {bellIconRoles.includes(role.systemRole) &&
              (newNotification ? (
                <img
                  src={require("assets/images/header-notification.svg").default}
                  alt="icon"
                  onClick={moveToNotificationPage}
                />
              ) : (
                <img
                  src={require("assets/images/Notification.svg").default}
                  alt="icon"
                  onClick={moveToNotificationPage}
                />
              ))}
          </DropdownToggle>
        </Dropdown>
      )}

      <Dropdown isOpen={dropdownOpen} toggle={toggle}>
        <DropdownToggle caret={false} className="user-dropdown" tag="div">
          <div className="usr-info">
            <div className="media">
              {props?.profile?.profilePic ? (
                <img
                  className="user-img"
                  src={props?.profile?.profilePic}
                  onError={addDefaultSrc}
                  alt="caret"
                />
              ) : (
                <img
                  className="user-img"
                  src={require("assets/images/staff-default.svg").default}
                  alt="usr"
                />
              )}

              <div className="responsive-dot-container">
                <MessageDot />
              </div>
              <div className="media-body align-self-center d-none d-md-block">
                <span>
                  {role.systemRole === constants.systemRoles.superAdmin
                    ? `${props.profile.firstName} ${props.profile.lastName}`
                    : props.profile.firstName}
                </span>
                <MessageDot />
                <img
                  src={require("assets/images/caret.svg").default}
                  alt="caret"
                />
              </div>
            </div>
          </div>
        </DropdownToggle>

        <DropdownMenu right>
          {dropdownItems}
          <DropdownItem onClick={logout}>
            <span>{t("navbar.logout")}</span>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </>
  );
};

function AccountOwnerDropdownItems({
  profileSetupStep,
  subscription,
  t,
  isDisabledClass,
  redirectWithCheck,
  location,
}) {
  if (
    profileSetupStep === "packageExpired" ||
    profileSetupStep === "subscriptionTerminated" ||
    !subscription
  ) {
    return (
      <>
        <DropdownItem>
          <Link
            to={{
              pathname: constants.routes.addSubscription,
              state: { choosePlan: true },
            }}
          >
            <span>{t("navbar.chooseSubscription")}</span>
          </Link>
        </DropdownItem>
        <DropdownItem>
          <Link to={constants.routes.help}>
            <span>{t("navbar.help")}</span>
          </Link>
        </DropdownItem>
      </>
    );
  } else if (
    profileSetupStep === "completed" &&
    subscription &&
    subscription.packageType !== constants.packageTypes.free
  ) {
    return (
      <div className="superadmin-dropdown-list">
        <div className="dropdown-group">
          <DropdownItem>
            <Link to="/Offices">
              <span>{t("navbar.MyOffices")}</span>
            </Link>
          </DropdownItem>
        </div>

        <div className="dropdown-group">
          <DropdownItem
            className={isDisabledClass.scheduler}
            onClick={() => {
              redirectWithCheck(
                {
                  pathname: "/scheduler",
                  state: location?.state,
                },
                !!isDisabledClass.scheduler
              );
            }}
          >
            <span>{t("navbar.scheduler")}</span>
          </DropdownItem>
          <DropdownItem
            className={isDisabledClass.liveChat}
            onClick={() => {
              redirectWithCheck(
                {
                  pathname: constants.routes.chatModule,
                  state: location?.state,
                },
                !!isDisabledClass.liveChat
              );
            }}
          >
            <>
              <span>{t("messenger.teamConversation")}</span>
              <MessageDot />
            </>
          </DropdownItem>
        </div>

        <div className="dropdown-group">
          <DropdownItem>
            <Link to={constants.routes.accountOwner.profile}>
              <span>{t("navbar.viewMyProfile")}</span>
            </Link>
          </DropdownItem>

          <DropdownItem>
            <Link to="/change-password">
              <span>{t("navbar.changePassword")}</span>
            </Link>
          </DropdownItem>
          <DropdownItem>
            <Link to="/manage-plan">
              <span>{t("navbar.manageSubscription")}</span>
            </Link>
          </DropdownItem>
          <DropdownItem>
            <Link to="/staff-roles">
              <span>{t("navbar.addstaffRoles")}</span>
            </Link>
          </DropdownItem>
          <DropdownItem>
            <Link to="/manage-holidays">
              <span>{t("navbar.addholidays")}</span>
            </Link>
          </DropdownItem>
        </div>

        <div className="dropdown-group">
          <DropdownItem>
            <Link to={constants.routes.help}>
              <span>{t("navbar.help")}</span>
            </Link>
          </DropdownItem>
          <DropdownItem>
            <Link to={constants.routes.feedback}>
              <span>{t("navbar.feedback")}</span>
            </Link>
          </DropdownItem>
        </div>
      </div>
    );
  } else if (
    profileSetupStep === "completed" &&
    subscription &&
    subscription.packageType === constants.packageTypes.free
  ) {
    return (
      <>
        <DropdownItem>
          <Link to={constants.routes.accountOwner.profile}>
            <span>{t("navbar.viewProfile")}</span>
          </Link>
        </DropdownItem>
        <DropdownItem>
          <Link to="/manage-plan">
            <span>{t("navbar.manageSubscription")}</span>
          </Link>
        </DropdownItem>
        <DropdownItem>
          <Link to="/change-password">
            <span>{t("navbar.changePassword")}</span>
          </Link>
        </DropdownItem>
      </>
    );
  } else {
    return null;
  }
}

function SuperAdminDropdownItems({ t }) {
  return (
    <div className="superadmin-dropdown-list">
      <div className="dropdown-group">
        <DropdownItem>
          <Link to="/manage-owner">
            <span>{t("navbar.manageAccountOwners")}</span>
          </Link>
        </DropdownItem>
        <DropdownItem>
          <Link to={constants.routes.superAdmin.manageVendors}>
            <span>{t("navbar.manageVendors")}</span>
          </Link>
        </DropdownItem>

        <DropdownItem>
          <Link to={constants.routes.superAdmin.manageSalesRepAdmin}>
            <span>{t("navbar.manageSalesRepresentatives")}</span>
          </Link>
        </DropdownItem>

        <DropdownItem>
          <Link to="/manage-personnel">
            <span>{t("navbar.managePersonnel")}</span>
          </Link>
        </DropdownItem>
        <DropdownItem>
          <Link to={constants.routes.superAdmin.patientList}>
            <span>{t("navbar.managePatients")}</span>
          </Link>
        </DropdownItem>
      </div>
      <div className="dropdown-group">
        <DropdownItem>
          <Link to={constants.routes.superAdmin.broadCastMessages}>
            <span>{t("superAdmin.broadcastMessages")}</span>
          </Link>
        </DropdownItem>

        <DropdownItem>
          <Link to="/demo-request">
            <span>{t("navbar.demoRequests")}</span>
          </Link>
        </DropdownItem>

        <DropdownItem>
          <Link to={constants.routes.superAdmin.feedback}>
            <span>{t("navbar.feedback")}</span>
          </Link>
        </DropdownItem>
        <DropdownItem>
          <Link to={constants.routes.superAdmin.SupportAndHelp}>
            <span>{t("navbar.support")}</span>
          </Link>
        </DropdownItem>

        <DropdownItem>
          <Link to={constants.routes.appVersionList}>
            <span>{t("navbar.appVersions")}</span>
          </Link>
        </DropdownItem>
      </div>
      <div className="dropdown-group">
        <DropdownItem>
          <Link to={constants.routes.superAdmin.reviews}>
            <span>{t("navbar.reviewsAndRatings")}</span>
          </Link>
        </DropdownItem>

        <DropdownItem>
          <Link to={constants.routes.superAdmin.appointmentRequestList}>
            <span>{t("navbar.appointmentRequests")}</span>
          </Link>
        </DropdownItem>
      </div>
      <div className="dropdown-group">
        <DropdownItem>
          <Link to={constants.routes.superAdmin.vendorSubscriptionPlans}>
            <span>{t("navbar.vendorSubscriptionPlans")}</span>
          </Link>
        </DropdownItem>

        <DropdownItem>
          <Link to="/subscription-management">
            <span>{t("navbar.subscriptionPlans")}</span>
          </Link>
        </DropdownItem>

        <DropdownItem>
          <Link to="/staff-roles">
            <span>{t("navbar.addstaffRoles")}</span>
          </Link>
        </DropdownItem>
        <DropdownItem>
          <Link to={constants.routes.specialtyList}>
            <span>{t("navbar.specialtiesOrServices")}</span>
          </Link>
        </DropdownItem>

        <DropdownItem>
          <Link to="/manage-holidays">
            <span>{t("navbar.holidays")}</span>
          </Link>
        </DropdownItem>

        <DropdownItem>
          <Link to="/manage-testimonial">
            <span>{t("navbar.manageTestimonials")}</span>
          </Link>
        </DropdownItem>

        <DropdownItem>
          <Link to="/manage-content">
            <span>{t("navbar.manageContent")}</span>
          </Link>
        </DropdownItem>
        <DropdownItem>
          <Link to={constants.routes.superAdmin.TopUpPromotions}>
            <span>{t("navbar.manageTopUp")}</span>
          </Link>
        </DropdownItem>

        <DropdownItem>
          <Link to={constants.routes.superAdmin.categories}>
            <span>{t("navbar.manageCategories")}</span>
          </Link>
        </DropdownItem>

        <DropdownItem>
          <Link to={constants.routes.superAdmin.tax}>
            <span>{t("navbar.taxManagement")}</span>
          </Link>
        </DropdownItem>

        <DropdownItem>
          <Link to={constants.routes.superAdmin.manageCommissions}>
            <span>{t("navbar.manageCommissions")}</span>
          </Link>
        </DropdownItem>
      </div>
      <div className="dropdown-group">
        <DropdownItem>
          <Link to="/edit-profile">
            <span>{t("navbar.viewMyProfile")}</span>
          </Link>
        </DropdownItem>

        <DropdownItem>
          <Link to="/change-password">
            <span>{t("navbar.changePassword")}</span>
          </Link>
        </DropdownItem>
      </div>
    </div>
  );
}

function StaffDropdownItems({
  t,
  profile,
  ownerList,
  isDisabledClass,
  redirectWithCheck,
  location,
}) {
  const { isAdmin, isMessenger } = profile;
  return (
    <>
      {!!(ownerList && ownerList.length) && (
        <DropdownItem
          className={isDisabledClass.scheduler}
          onClick={() => {
            redirectWithCheck(
              {
                pathname: "/scheduler",
                state: location?.state,
              },
              !!isDisabledClass.scheduler
            );
          }}
        >
          <span>{t("navbar.scheduler")}</span>
        </DropdownItem>
      )}
      {(isAdmin || !!isMessenger) && (
        <DropdownItem
          className={isDisabledClass.liveChat}
          onClick={() => {
            redirectWithCheck(
              {
                pathname: constants.routes.chatModule,
                state: location?.state,
              },
              !!isDisabledClass.liveChat
            );
          }}
        >
          <>
            <div className="d-flex pt-3 pb-3">
              <span>{t("messenger.teamConversation")}</span>
              <MessageDot />
            </div>
          </>
        </DropdownItem>
      )}
      <DropdownItem>
        <Link to={constants.routes.viewProfile}>
          <span>{t("navbar.viewProfile")}</span>
        </Link>
      </DropdownItem>
      <DropdownItem>
        <Link to={constants.routes.help}>
          <span>{t("navbar.help")}</span>
        </Link>
      </DropdownItem>
      <DropdownItem>
        <Link to={constants.routes.feedback}>
          <span>{t("navbar.feedback")}</span>
        </Link>
      </DropdownItem>
    </>
  );
}

function PatientDropdownItems({ t }) {
  return (
    <>
      <DropdownItem>
        <Link to={constants.routes.doctors}>
          <span>{t("doctors")}</span>
        </Link>
      </DropdownItem>
      <DropdownItem>
        <Link to={constants.routes.familyMembers}>
          <span>{t("navbar.familyMembers")}</span>
        </Link>
      </DropdownItem>
      <DropdownItem>
        <Link to={constants.routes.help}>
          <span>{t("navbar.help")}</span>
        </Link>
      </DropdownItem>
      <DropdownItem>
        <Link to={constants.routes.feedback}>
          <span>{t("navbar.feedback")}</span>
        </Link>
      </DropdownItem>
    </>
  );
}

const mapStateToProps = ({ userProfile: { profile } }) => ({
  profile,
});
export default connect(
  mapStateToProps,
  null
)(withTranslation()(HeaderDropdown));
