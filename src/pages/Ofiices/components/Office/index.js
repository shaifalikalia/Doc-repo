import React, { useState, Fragment } from "react";
import { Link } from "react-router-dom";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { useHistory } from "react-router";
import { connect } from "react-redux";
import { officeFieldData, setOfficeStatus } from "actions/index";
import { push } from "connected-react-router";
import { Modal, ModalBody } from "reactstrap";
import { withTranslation, Trans } from "react-i18next";
import constants from "./../../../../constants";
import RequestApprovalModal from "../../../../staff/pages/Offices/components/RequestApprovalModal";
import { encodeId } from "utils";

const Office = (props) => {
  const {
    profile,
    t,
    showSubscriptionTerminatedModal,
    isSubscriptionTerminated,
  } = props;
  const history = useHistory();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showDetailId, setShowDetailId] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const [deactivateModal, setdeactivateModal] = useState(false);
  const [isRequestApprovalModalOpen, setIsRequestApprovalModalOpen] =
    useState(false);
  const [rejectAprrovalCount, setRejectAprrovalCount] = useState(
    props.data.numberOfPendingRequestsApprovals
  );

  const handleOffice = () => {
    history.push("/editOffice", { officeId: props.data.id });
  };

  const redirectToTimesheet = (pathname) => {
    history.push(pathname);
  };

  const moveToOffices = () => {
    if (
      props?.profile?.userSubscription?.subscriptionPlan ===
      constants.subscriptionType.free
    )
      return false;
    history.push({
      pathname: constants.routes.accountOwner.officeOptions.replace(
        ":officeId",
        encodeId(props.data.id)
      ),
      state: { officeName: props.data.name },
    });
  };

  const handleManagers = (data) => {
    props.showSelectedManagers(data);
  };
  const handleActivateOffice = (id) => {
    props.setOfficeStatus({
      officeId: id,
      status: true,
      id: props.profile.id,
      currentPage: props.currentPage,
    });
  };
  const handleDeactivateOffice = () => {
    props.setOfficeStatus({
      officeId: props.data.id,
      status: false,
      id: props.profile.id,
      currentPage: props.currentPage,
    });
    setdeactivateModal(false);
  };
  const handleDeactivateModalOpen = () => {
    setdeactivateModal(true);
  };
  const handleDeactivateModalClose = () => {
    setdeactivateModal(false);
  };
  const DeactivateConfirm = () => (
    <Modal
      isOpen={deactivateModal}
      className="modal-dialog-centered deactivate-modal"
      modalClassName="custom-modal"
      toggle={handleDeactivateModalClose}
    >
      <span className="close-btn" onClick={handleDeactivateModalClose}>
        <img src={require("assets/images/cross.svg").default} alt="close" />
      </span>
      <ModalBody>
        <div className="content-block text-center">
          <p>
            <Trans i18nKey="accountOwner.officeDeactivationWarning">
              You will not be able to take any action associated with the office
              and it will no longer be considered as part of the subscription
              plan. Are you sure you want to <br /> de-activate the office?
            </Trans>
          </p>
          <button
            className="button button-round button-min-100 mr-md-3 mb-2 w-sm-100 button-shadow"
            title={t("yes")}
            onClick={handleDeactivateOffice}
          >
            {t("yes")}
          </button>
          <button
            class="button button-round button-border button-dark mb-md-2 btn-mobile-link"
            title={t("cancel")}
            onClick={handleDeactivateModalClose}
          >
            {t("cancel")}
          </button>
        </div>
      </ModalBody>
    </Modal>
  );

  const hourFormat = (val) => {
    return (val / 60).toFixed(2);
  };
  const {
    data: {
      name,
      address,
      city,
      country,
      activeStaffCount,
      activeStaffImage,
      officeImage,
      managerImages,
      numberOfOfficeManager,
    },
  } = props;
  let activeStaffImageArray = [];
  let managersImageArray = [];
  if (numberOfOfficeManager > 0) {
    managersImageArray = managerImages.split(", ");
  }
  if (activeStaffCount > 0) {
    activeStaffImageArray = activeStaffImage.split(", ");
  }

  let staffSection = null;
  if (
    profile &&
    profile.userSubscription &&
    profile.userSubscription.packageType === constants.packageTypes.free
  ) {
    staffSection = (
      <div>
        <h5 className="office-card-staff-member-title">{t("staffMembers")}</h5>
        <strong className="office-card-staff-members-not-allowed-text">
          {t("accountOwner.noStaffMembersAllowed")}
        </strong>
      </div>
    );
  } else {
    staffSection = (
      <div className="staff-list">
        <div className="office-manager common-member">
          <h5>{t("officeManagers")}</h5>
          {managersImageArray.length > 0 ? (
            <ul onClick={handleManagers.bind(this, props.data)}>
              {managersImageArray.slice(0, 2).map((item, index) => (
                <li key={index}>
                  <img
                    src={
                      item === "null"
                        ? require("assets/images/default-image.svg").default
                        : item
                    }
                    alt=""
                    onError={(i) =>
                      (i.target.src =
                        require("assets/images/default-image.svg").default)
                    }
                  />
                </li>
              ))}

              {numberOfOfficeManager > 2 && (
                <li>
                  <div className="more">
                    <span>{numberOfOfficeManager - 2}+</span>
                  </div>
                </li>
              )}
            </ul>
          ) : (
            <ul>
              <li>&nbsp;</li>
            </ul>
          )}
        </div>
        <div className="staff-members common-member">
          <h5>{t("staffMembers")}</h5>
          {activeStaffImageArray.length > 0 ? (
            <ul>
              {activeStaffImageArray.slice(0, 4).map((item, index) => (
                <li key={index}>
                  <img
                    src={
                      item === "null"
                        ? require("assets/images/default-image.svg").default
                        : item
                    }
                    alt=""
                    onError={(i) =>
                      (i.target.src =
                        require("assets/images/default-image.svg").default)
                    }
                  />
                </li>
              ))}
              {activeStaffCount > 4 && (
                <li>
                  <div className="more">
                    <span>{activeStaffCount - 4}+</span>
                  </div>
                </li>
              )}
            </ul>
          ) : (
            <ul>
              <li>&nbsp;</li>
            </ul>
          )}
        </div>
      </div>
    );
  }

  let detailSection = null;
  if (
    profile &&
    profile.userSubscription &&
    profile.userSubscription.packageType === constants.packageTypes.free
  ) {
    detailSection = <div></div>;
  } else {
    detailSection = (
      <div className="staff-detail-card">
        <ul>
          {/* eslint-disable-next-line  */}
          <li className="p-0">
            <svg
              className="mr-2"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <mask
                id="mask0_8301_206394"
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="16"
                height="16"
              >
                <rect width="16" height="16" fill="#D9D9D9" />
              </mask>
              <g mask="url(#mask0_8301_206394)">
                <path
                  d="M13.1167 13.5833L13.5833 13.1167L12.3333 11.8667V10H11.6667V12.1333L13.1167 13.5833ZM3.33333 14C2.96667 14 2.65278 13.8694 2.39167 13.6083C2.13056 13.3472 2 13.0333 2 12.6667V3.33333C2 2.96667 2.13056 2.65278 2.39167 2.39167C2.65278 2.13056 2.96667 2 3.33333 2H12.6667C13.0333 2 13.3472 2.13056 13.6083 2.39167C13.8694 2.65278 14 2.96667 14 3.33333V7.8C13.7889 7.7 13.5722 7.61389 13.35 7.54167C13.1278 7.46944 12.9 7.41667 12.6667 7.38333V3.33333H3.33333V12.6667H7.36667C7.4 12.9111 7.45278 13.1444 7.525 13.3667C7.59722 13.5889 7.68333 13.8 7.78333 14H3.33333ZM3.33333 12.6667V3.33333V7.38333V7.33333V12.6667ZM4.66667 11.3333H7.38333C7.41667 11.1 7.46944 10.8722 7.54167 10.65C7.61389 10.4278 7.69444 10.2111 7.78333 10H4.66667V11.3333ZM4.66667 8.66667H8.73333C9.08889 8.33333 9.48611 8.05556 9.925 7.83333C10.3639 7.61111 10.8333 7.46111 11.3333 7.38333V7.33333H4.66667V8.66667ZM4.66667 6H11.3333V4.66667H4.66667V6ZM12 15.3333C11.0778 15.3333 10.2917 15.0083 9.64167 14.3583C8.99167 13.7083 8.66667 12.9222 8.66667 12C8.66667 11.0778 8.99167 10.2917 9.64167 9.64167C10.2917 8.99167 11.0778 8.66667 12 8.66667C12.9222 8.66667 13.7083 8.99167 14.3583 9.64167C15.0083 10.2917 15.3333 11.0778 15.3333 12C15.3333 12.9222 15.0083 13.7083 14.3583 14.3583C13.7083 15.0083 12.9222 15.3333 12 15.3333Z"
                  fill="#8CAEB4"
                />
              </g>
            </svg>
            <span
              onClick={() =>
                redirectToTimesheet({
                  pathname: constants.routes.accountOwner.timesheet.replace(
                    ":officeId",
                    encodeId(props.data?.id)
                  ),
                  state: { officeName: props.data?.name },
                })
              }
              className="link-btn font-regular font-11"
            >
              {t("timesheetDashboard")}
            </span>
          </li>
          <a>
            <li>
              <img
                src={require("assets/images/office/mail.svg").default}
                alt="icon"
              />
              <span
                className="link-btn font-regular font-11"
                onClick={() => {
                  setIsRequestApprovalModalOpen(true);
                }}
              >
                {rejectAprrovalCount ||
                  props.data.numberOfPendingRequestsApprovals}{" "}
                {t("requestAndApproval")}
              </span>
            </li>
          </a>
          <li>
            <img
              src={require("assets/images/office/staff.svg").default}
              alt="icon"
            />{" "}
            {props.data.activeStaffCount} {t("activeStaffs")}
          </li>
          <li>
            <img
              src={require("assets/images/office/hours.svg").default}
              alt="icon"
            />{" "}
            {props.data.numberOfApprovedTimesheetHoursInMinutesForCurrentMonth
              ? hourFormat(
                  props.data
                    .numberOfApprovedTimesheetHoursInMinutesForCurrentMonth
                )
              : "0"}{" "}
            {t("approvedHours")}
          </li>
          {showDetailId && (
            <>
              <li>
                <img
                  src={
                    require("assets/images/office/estimated-amount.svg").default
                  }
                  alt="icon"
                />{" "}
                ${props.data.chargesToStaff} {t("staffCharges")}
              </li>
              <li>
                <img
                  src={
                    require("assets/images/office/production-value.svg").default
                  }
                  alt="icon"
                />{" "}
                ${props.data.totalOfficeRevenueForCurrentMonth}{" "}
                {t("officeProduction")}
              </li>
              <li>
                <img
                  src={require("assets/images/office/timesheets.svg").default}
                  alt="icon"
                />{" "}
                {props.data.numberOfNewTimesheets} {t("newPendingTimesheets")}
              </li>
              <li>
                <img
                  src={require("assets/images/office/leaves.svg").default}
                  alt="icon"
                />{" "}
                {props.data.numberOfNewLeaves} {t("pendingLeaves")}
              </li>
              <li>
                <img
                  src={require("assets/images/office/applicant.svg").default}
                  alt="icon"
                />{" "}
                {props.data.numberOfNewJobApplicantsToday}{" "}
                {t("newApplicantsToday")}
              </li>
              <li>
                <img
                  src={require("assets/images/office/alert.svg").default}
                  alt="icon"
                />{" "}
                {props.data.numberOfNewCovidAlertsToday} {t("covidAlertsToday")}
              </li>
              <li>
                <img
                  src={require("assets/images/office/tasks.svg").default}
                  alt="icon"
                />{" "}
                {props.data.numberOfTaskUpdatesToday} {t("tasksUpdatedToday")}
              </li>
            </>
          )}
        </ul>
        <div className="show-hide-btn">
          {!showDetailId ? (
            <span
              className="link-btn"
              onClick={(e) => {
                e.stopPropagation();
                setShowDetailId(true);
              }}
            >
              <img
                src={require("assets/images/office/down-arrow.svg").default}
                alt="icon"
              />
              Show More
            </span>
          ) : (
            <span
              className="link-btn"
              onClick={(e) => {
                e.stopPropagation();
                setShowDetailId(false);
              }}
            >
              <img
                src={require("assets/images/office/up-arrow.svg").default}
                alt="icon"
              />
              Show Less
            </span>
          )}
        </div>
      </div>
    );
  }
  const officeBody = (
    <div className="office-card-body">
      <span onClick={moveToOffices} className="pointer">
        <div className="office-card-header">
          <div className="img-box">
            <img
              src={
                officeImage && officeImage !== null
                  ? officeImage
                  : require("assets/images/default-image.svg").default
              }
              width="40"
              alt="icon"
            />
          </div>
          <div className="text-box">
            <h3>{name}</h3>
            <div className="media">
              <span className="ico">
                <img
                  src={require("assets/images/address-icon.svg").default}
                  alt="icon"
                />
              </span>
              <div className="media-body align-self-center min-height-55">
                <p>
                  {[address, " ", city]} {country}{" "}
                </p>
              </div>
            </div>
          </div>
        </div>
      </span>

      {staffSection}
      {detailSection}
    </div>
  );

  let officeFooter = null;
  if (
    profile &&
    profile.userSubscription &&
    profile.userSubscription.packageType !== constants.packageTypes.free
  ) {
    officeFooter = (
      <div className="office-card-footer">
        <span className="ico">
          <img
            src={require("assets/images/add-staff-icon.svg").default}
            alt="icon"
          />
        </span>
        <span className="link-btn font-regular">
          {t("accountOwner.addStaff")}
        </span>
      </div>
    );
  }

  let dropdown = null;
  if (
    props.profile &&
    props.profile.userSubscription &&
    props.profile.userSubscription.packageType !== "single-office" &&
    props.profile.profileSetupStep !== "packageExpired" &&
    props.profile.profileSetupStep !== "subscriptionTerminated"
  ) {
    let deactivateOption = (
      <DropdownItem onClick={handleDeactivateModalOpen}>
        <span>{t("accountOwner.deactivateOffice")}</span>
      </DropdownItem>
    );

    if (
      profile &&
      profile.userSubscription &&
      profile.userSubscription.packageType === constants.packageTypes.free
    ) {
      deactivateOption = null;
    }

    dropdown = (
      <div className="office-dropdown">
        <Dropdown isOpen={dropdownOpen} toggle={toggle}>
          <DropdownToggle caret={false} tag="div">
            <span className="ico">
              <img
                src={require("assets/images/dots-icon.svg").default}
                alt="icon"
              />
            </span>
          </DropdownToggle>
          <DropdownMenu right>
            {props.data.isActive ? (
              <Fragment>
                <DropdownItem onClick={handleOffice.bind(this, props.data)}>
                  <span>{t("edit")}</span>
                </DropdownItem>
                {deactivateOption}
              </Fragment>
            ) : (
              <DropdownItem
                onClick={handleActivateOffice.bind(this, props.data.id)}
              >
                <span>{t("activate")}</span>
              </DropdownItem>
            )}
          </DropdownMenu>
        </Dropdown>
      </div>
    );
  }
  if (
    props.data.isActive &&
    props.profile.userSubscription &&
    props.profile.userSubscription.packageType === "single-office" &&
    props.profile.profileSetupStep !== "packageExpired" &&
    props.profile.profileSetupStep !== "subscriptionTerminated"
  ) {
    dropdown = (
      <div className="office-dropdown">
        <Dropdown isOpen={dropdownOpen} toggle={toggle}>
          <DropdownToggle caret={false} tag="div">
            <span className="ico">
              <img
                src={require("assets/images/dots-icon.svg").default}
                alt="icon"
              />
            </span>
          </DropdownToggle>
          <DropdownMenu right>
            <Fragment>
              <DropdownItem onClick={handleOffice.bind(this, props.data)}>
                <span>{t("edit")}</span>
              </DropdownItem>
            </Fragment>
          </DropdownMenu>
        </Dropdown>
      </div>
    );
  }

  let cardBody = <div className="card-content">{officeBody}</div>;

  if (
    profile &&
    profile.userSubscription &&
    profile.userSubscription.packageType === constants.packageTypes.free
  ) {
    cardBody = <div className="card-content">{officeBody}</div>;
  }

  let officeCardStyle = {};
  if (
    profile &&
    profile.userSubscription &&
    profile.userSubscription.packageType === constants.packageTypes.free
  ) {
    officeCardStyle = {
      paddingBottom: 0,
      minHeight: "unset",
    };
  }

  return (
    <>
      <div
        onClick={showSubscriptionTerminatedModal}
        style={officeCardStyle}
        className={`${
          isSubscriptionTerminated ? "disable-office-links" : ""
        } office-card office-card-v2 ${
          !props.data.isActive
            ? "office-card-disable"
            : (props.profile &&
                props.profile.profileSetupStep === "packageExpired") ||
              props.profile.profileSetupStep === "subscriptionTerminated"
            ? "office-card-disable"
            : ""
        } `}
      >
        {cardBody}
        {dropdown}
        {(props.profile &&
          props.profile.profileSetupStep === "packageExpired") ||
        props.profile.profileSetupStep === "subscriptionTerminated" ||
        !props.data.isActive ? (
          <span className="disable-badge">{t("accountOwner.readOnly")}</span>
        ) : null}
        <Fragment>
          {props.profile.profileSetupStep !== "packageExpired" &&
          props.profile.profileSetupStep !== "subscriptionTerminated" &&
          props.data.isActive ? (
            // eslint-disable-next-line
            <Link to={`/AddStaff/${encodeId(props.data.id)}`}>
              {officeFooter}
            </Link>
          ) : (
            <a className="disabled">{officeFooter}</a>
          )}
        </Fragment>
        {DeactivateConfirm()}
      </div>
      {isRequestApprovalModalOpen && (
        <RequestApprovalModal
          isRequestApprovalModalOpen={isRequestApprovalModalOpen}
          setIsRequestApprovalModalOpen={setIsRequestApprovalModalOpen}
          officeId={props.data.id}
          onUpdate={(updatedCount) => setRejectAprrovalCount(updatedCount)}
        />
      )}
    </>
  );
};
const mapStateToProps = ({
  userProfile: { profile },
  errors: { isError },
}) => ({
  profile,
  isError,
});
export default connect(mapStateToProps, {
  officeFieldData,
  setOfficeStatus,
  push,
})(withTranslation()(Office));
