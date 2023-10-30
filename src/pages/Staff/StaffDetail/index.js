import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { connect } from "react-redux";
import _isLoading from "hoc/isLoading";
import {
  DeleteMembers,
  getOfficesDetail,
  startLoading,
  stopLoading,
} from "actions/index";
import { Modal, ModalBody } from "reactstrap";

/*components*/
import Toast from "components/Toast";
import { withTranslation } from "react-i18next";
import SubstituteSelectorFactory from "components/SubstituteSelector";
import constants from "./../../../constants";
import staffRepository from "repositories/staff-repository";
import StaffActionModal from "components/StaffActionModal";
import LeaveDetail from "./LeaveDetail";
import { getLeaveDetail } from "repositories/leave-repository";
import { getPerformanceReviews } from "repositories/performance-repository";
import HourlyRate from "./HourlyRate";
import * as moment from "moment";
import { encodeId } from "utils";

class StaffDetail extends Component {
  state = {
    dropdownOpen: false,
    schedules: [
      { value: "7", label: "S", active: false },
      { value: "1", label: "M", active: false },
      { value: "2", label: "T", active: false },
      { value: "3", label: "W", active: false },
      { value: "4", label: "T", active: false },
      { value: "5", label: "F", active: false },
      { value: "6", label: "S", active: false },
    ],
    isToastView: false,
    deleteModal: false,

    substituteSelectionEvent: null,
    isSubstituteSelectorActionExecuting: false,
    substituteSelectorErrorMessage: "",

    staffActionEvent: null,
    isStaffActionEventExecuting: false,

    reviewFormList: null,
    leaves: [],
  };

  async componentDidMount() {
    if (this.props.location.state) {
      const staffDetail = this.props.location.state.detail;
      if (staffDetail.inviteId)
        await this.getLeaveDetail(null, staffDetail.inviteId);
      else await this.getLeaveDetail(staffDetail.staffId);

      if (staffDetail && staffDetail.staffMemberId) {
        this.getPerformanceReviews(
          this.props.location.state.OfficeId,
          staffDetail.staffMemberId
        );
      }
      const scheduleDays = this.props.location.state.detail.schedule.split(",");
      let interselection = this.state.schedules.filter((item) => {
        if (scheduleDays.includes(item.value)) {
          item.active = true;
          return item;
        } else {
          return item;
        }
      });
      this.setState({ schedules: interselection });
      this.props.getOfficesDetail({ Id: this.props.location.state.OfficeId });
    }
  }

  getPerformanceReviews = async (officeId, userId) => {
    let apiRes = await getPerformanceReviews(officeId, userId);
    if (apiRes.statusCode !== 200 || !apiRes.data || !apiRes.data.length)
      return;
    const reviewType = [
      "General",
      "ProbationPeriod",
      "MonthlyReview",
      "QuarterlyReview",
      "YearlyReview",
      "Others",
    ];

    apiRes.data.forEach((elm) => {
      if (
        this.props.location.state.detail.performanceReviewId &&
        +elm.id === +this.props.location.state.detail.performanceReviewId
      ) {
        const reviewFormList =
          moment(elm.createdAt).format("MMMM DD, YYYY") +
          " - " +
          reviewType[elm.type];
        this.setState({ reviewFormList });
      }
    });
    this.setState({ loadingReviewList: false });
  };
  getLeaveDetail = async (staffId, invitationId) => {
    let apiRes = null;
    if (staffId) apiRes = await getLeaveDetail(staffId);
    else apiRes = await getLeaveDetail(null, invitationId);

    if (apiRes.statusCode !== 200) return;

    this.setState({ leaves: apiRes.data });
  };

  componentDidUpdate(prevProps) {
    if (
      prevProps.isStaffDelete !== this.props.isStaffDelete ||
      prevProps.isStaffDeleteError !== this.props.isStaffDeleteError
    ) {
      this.setState({ isToastView: true });
      const officeId = this.props.location.state.OfficeId;
      setTimeout(() => {
        this.setState({ isToastView: false });
        if (this.props.isStaffDelete) {
          if (this.props.location.state) {
            this.props.history.push(`/Staff/${encodeId(officeId)}`);
          }
        }
      }, 2500);
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (!props.location.state) {
      props.history.push("/Offices");
    }
  }

  toggle = () => {
    this.setState((prev) => ({
      dropdownOpen: !prev.dropdownOpen,
    }));
  };

  handleUserDelete = () => {
    const InviteId = this.props.location.state.detail.inviteId;
    this.props.DeleteMembers(InviteId);
    this.setState({ deleteModal: false });
  };

  openModal = () => {
    this.setState({ deleteModal: true });
  };

  closeModal = () => {
    this.setState({ deleteModal: false });
  };

  ConfirmModal = () => (
    <Modal
      isOpen={this.state.deleteModal}
      className="modal-dialog-centered  delete-modal"
      modalClassName="custom-modal"
      toggle={this.closeModal}
    >
      <span className="close-btn" onClick={this.closeModal}>
        <img src={require("assets/images/cross.svg").default} alt="close" />
      </span>
      <ModalBody>
        <div className="change-modal-content">
          <p>{this.props.t("accountOwner.staffDeleteConfirmation")}</p>
          <button
            className="button button-round button-shadow  button-min-100"
            title={this.props.t("ok")}
            onClick={this.handleUserDelete}
          >
            {this.props.t("ok")}
          </button>
        </div>
      </ModalBody>
    </Modal>
  );

  exitSubstituteSelectionJourney = () => {
    this.setState({
      substituteSelectionEvent: null,
      substituteSelectorErrorMessage: "",
      isSubstituteSelectorActionExecuting: false,
    });
  };

  substituteSelectorAction = (userId, officeId, transferWorkItemsTo) => {
    this.setState(
      {
        isSubstituteSelectorActionExecuting: true,
        substituteSelectorErrorMessage: "",
      },
      async () => {
        let res;

        if (
          this.state.substituteSelectionEvent ===
          constants.staffActionEvents.removal
        )
          res = await staffRepository.removeStaff(
            userId,
            officeId,
            transferWorkItemsTo
          );
        else
          res = await staffRepository.deactivateStaff(
            userId,
            officeId,
            transferWorkItemsTo
          );

        if (res.statusCode === 200) {
          this.exitSubstituteSelectionJourney();
          this.goBackToStaffList();
        } else {
          this.setState({
            substituteSelectorErrorMessage: res.message,
            isSubstituteSelectorActionExecuting: false,
          });
        }
      }
    );
  };

  clearSubstituteSelectorErrorMessage = () => {
    this.setState({ substituteSelectorErrorMessage: "" });
  };

  goBackToStaffList = () => {
    const officeId = this.props.location.state.OfficeId;
    this.props.history.push(`/Staff/${encodeId(officeId)}`);
  };

  onRemoveStaffDropdownItemClick = () => {
    const isAdmin = this.props.location.state.detail.isAdmin;
    if (isAdmin) {
      this.setState({
        substituteSelectionEvent: constants.staffActionEvents.removal,
      });
    } else {
      this.setState({ staffActionEvent: constants.staffActionEvents.removal });
    }
  };

  onDeactivateStaffDropdownItemClick = () => {
    const isAdmin = this.props.location.state.detail.isAdmin;
    if (isAdmin) {
      this.setState({
        substituteSelectionEvent: constants.staffActionEvents.deactivation,
      });
    } else {
      this.setState({
        staffActionEvent: constants.staffActionEvents.deactivation,
      });
    }
  };

  onActivateStaffDropdownItemClick = () => {
    this.setState({ staffActionEvent: constants.staffActionEvents.activation });
  };

  onAction = () => {
    const eventWas = this.state.staffActionEvent;
    this.setState({ staffActionEvent: null }, () => {
      this.props.startLoading();
      if (eventWas === constants.staffActionEvents.activation)
        this.activateStaff();
      else if (eventWas === constants.staffActionEvents.deactivation)
        this.deactivateStaff();
      else if (eventWas === constants.staffActionEvents.removal)
        this.removeStaff();
    });
  };

  activateStaff = async () => {
    const userId = this.props.location.state.detail.staffMemberId;
    const officeId = this.props.location.state.OfficeId;

    var res = await staffRepository.activateStaff(userId, officeId);
    this.props.stopLoading();
    if (res.statusCode === 200) {
      this.goBackToStaffList();
    }
  };

  deactivateStaff = async () => {
    const userId = this.props.location.state.detail.staffMemberId;
    const officeId = this.props.location.state.OfficeId;

    var res = await staffRepository.deactivateStaff(userId, officeId, null);
    this.props.stopLoading();
    if (res.statusCode === 200) {
      this.goBackToStaffList();
    }
  };

  removeStaff = async () => {
    const userId = this.props.location.state.detail.staffMemberId;
    const officeId = this.props.location.state.OfficeId;

    var res = await staffRepository.removeStaff(userId, officeId, null);
    this.props.stopLoading();
    if (res.statusCode === 200) {
      this.goBackToStaffList();
    }
  };

  render() {
    if (this.props.location.state) {
      const { schedules, isToastView } = this.state;
      const {
        statusMessage,
        isStaffDeleteError,
        t,
        location: {
          state: { detail },
        },
      } = this.props;
      const {
        profilePic,
        designation,
        firstName,
        lastName,
        staffRoleId,
        isAdmin,
        emailId,
        type,
      } = detail;
      const officeId = this.props.location.state.OfficeId;

      if (this.state.substituteSelectionEvent !== null) {
        return (
          <SubstituteSelectorFactory
            staff={{
              id: detail.staffId,
              userId: detail.staffMemberId,
              profilePicURL: profilePic,
              firstName,
              lastName,
              officeId,
            }}
            event={this.state.substituteSelectionEvent}
            onAction={this.substituteSelectorAction}
            isActionExecuting={this.state.isSubstituteSelectorActionExecuting}
            errorMessage={this.state.substituteSelectorErrorMessage}
            onClearErrorMessage={this.clearSubstituteSelectorErrorMessage}
            onCancel={this.exitSubstituteSelectionJourney}
          />
        );
      }

      let dropdownContent = null;
      if (type === 1 || type === 3 || type === 2) {
        dropdownContent = (
          <div className="staff-dropdown">
            <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
              <DropdownToggle caret={false} tag="div">
                <span className="ico">
                  <img
                    src={require("assets/images/dots-icon.svg").default}
                    alt="icon"
                  />
                </span>
              </DropdownToggle>

              <DropdownMenu right>
                {(type === 1 || type === 3) && (
                  <DropdownItem>
                    <Link
                      to={{
                        pathname: `/editStaff/${encodeId(officeId)}`,
                        state: {
                          staffDetail: this.props.location.state.detail,
                        },
                      }}
                    >
                      <span>{t("edit")}</span>
                    </Link>
                  </DropdownItem>
                )}

                {type === 1 && (
                  <>
                    <DropdownItem>
                      <span onClick={this.onDeactivateStaffDropdownItemClick}>
                        {t("accountOwner.deactivateStaff")}
                      </span>
                    </DropdownItem>
                    <DropdownItem>
                      <span onClick={this.onRemoveStaffDropdownItemClick}>
                        {t("accountOwner.removeStaff")}
                      </span>
                    </DropdownItem>
                  </>
                )}

                {type === 2 && (
                  <>
                    <DropdownItem>
                      <span onClick={this.onActivateStaffDropdownItemClick}>
                        {t("accountOwner.activateStaff")}
                      </span>
                    </DropdownItem>
                    <DropdownItem>
                      <span onClick={this.onRemoveStaffDropdownItemClick}>
                        {t("accountOwner.removeStaff")}
                      </span>
                    </DropdownItem>
                  </>
                )}

                {type === 3 && (
                  <DropdownItem onClick={this.openModal}>
                    <span>{t("accountOwner.cancelInvitation")}</span>
                  </DropdownItem>
                )}
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      }

      return (
        <div className="staff-detail-block">
          {isToastView && statusMessage && (
            <Toast
              message={statusMessage}
              handleClose={this.toastHide}
              errorToast={isStaffDeleteError ? true : false}
            />
          )}
          <div className="container">
            <button className="back-btn">
              <Link to={`/Staff/${encodeId(officeId)}`}>
                <span className="ico">
                  <img
                    src={require("assets/images/arrow-back-icon.svg").default}
                    alt="arrow"
                  />
                </span>
                {t("back")}
              </Link>
            </button>
          </div>
          <div className="container container-smd">
            <div className="row no-gutters align-items-center mt-2">
              <div className="col-md-7">
                <h2 className="title">
                  {this.props.officeDetail?.name || null}
                </h2>
                <p className="sub-title">{t("accountOwner.staffDetails")}</p>
              </div>
            </div>
            <div className="staff-detail-content">
              <div className="row no-gutters">
                <div className="col-md-4">
                  <div className="staff-pic">
                    {profilePic ? (
                      <img src={`${profilePic}`} alt="staff" />
                    ) : (
                      <img
                        src={require("assets/images/default-image.svg").default}
                        alt="staff"
                      />
                    )}

                    <h3>
                      {firstName} {lastName}
                    </h3>
                  </div>
                </div>
                <div className="col-md-8">
                  <div className="staff-job-detail">
                    <div className="data-box">
                      <div className="media">
                        <img
                          src={require("assets/images/job-title.svg").default}
                          className="align-self-center"
                          alt="job"
                        />
                        <div className="media-body">
                          <label>{t("accountOwner.jobTitle")}</label>
                          <h4>{designation}</h4>
                        </div>
                      </div>
                    </div>

                    <div className="data-box">
                      <div className="media">
                        <img
                          src={require("assets/images/job-type.svg").default}
                          className="align-self-center"
                          alt="job"
                        />
                        <div className="media-body">
                          <label>{t("accountOwner.jobType")}</label>
                          <h4>
                            {" "}
                            {staffRoleId === 1
                              ? t("form.values.temporary")
                              : t("form.values.permanent")}
                          </h4>
                        </div>
                      </div>
                    </div>

                    {isAdmin && (
                      <div className="data-box">
                        <div className="media">
                          <img
                            src={
                              require("assets/images/job-access.svg").default
                            }
                            className="align-self-center"
                            alt="job"
                          />
                          <div className="media-body">
                            <label>{t("accountOwner.access")}</label>
                            <h4>{t("accountAdmin")}</h4>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="data-box">
                      <div className="media">
                        <img
                          src={require("assets/images/job-email.svg").default}
                          className="align-self-center"
                          alt="job"
                        />
                        <div className="media-body">
                          <label>{t("form.fields.emailAddress")}</label>
                          <h4>{emailId}</h4>
                        </div>
                      </div>
                    </div>

                    <div className="data-box">
                      <div className="media">
                        <img
                          src={
                            require("assets/images/job-schedule.svg").default
                          }
                          className="align-self-center"
                          alt="job"
                        />
                        <div className="media-body">
                          <label>{t("form.fields.schedule")}</label>
                          <div className="schedule-list mb-0">
                            <ul>
                              {schedules.map((item) => (
                                <li
                                  className={`${item.active ? "active" : ""}`}
                                  key={item.value}
                                >
                                  {" "}
                                  {item.label}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <LeaveDetail staffLeaves={this.state.leaves} />
                    <HourlyRate
                      staffDetails={this.props.location.state.detail}
                      selectedReview={this.state.reviewFormList}
                      officeId={this.props.location.state.OfficeId}
                    />
                  </div>
                </div>
              </div>
              {this.props.location.state &&
                this.props.officeDetail &&
                this.props.officeDetail.isActive &&
                this.props.profile &&
                this.props.profile.profileSetupStep !== "packageExpired" &&
                this.props.profile.profileSetupStep !==
                  "subscriptionTerminated" && (
                  <Fragment>{dropdownContent}</Fragment>
                )}
              {this.ConfirmModal()}
            </div>
          </div>
          <StaffActionModal
            isOpen={this.state.staffActionEvent !== null}
            event={this.state.staffActionEvent}
            onAction={this.onAction}
            onClose={() => this.setState({ staffActionEvent: null })}
          />
        </div>
      );
    }

    return null;
  }
}

const mapStateToProps = ({
  userProfile: { profile },
  staff: { statusMessage, isLoading, isStaffDelete, isStaffDeleteError },
  offices: { officeDetail },
  errors: { isError },
}) => ({
  statusMessage,
  isLoading,
  isError,
  isStaffDelete,
  isStaffDeleteError,
  profile,
  officeDetail,
});

export default connect(mapStateToProps, {
  DeleteMembers,
  getOfficesDetail,
  startLoading,
  stopLoading,
})(_isLoading(withTranslation()(StaffDetail)));
