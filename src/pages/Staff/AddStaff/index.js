import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  getstaffDesignation,
  addEditStaff,
  addEditStaffInvite,
  editStaff,
  getOfficesDetail,
} from "actions/index";

/*components*/
import Input from "components/Input";
import Select from "components/Select";
import CustomSelect from "components/CustomSelect";
import _isLoading from "hoc/isLoading";
import Helper from "utils/helper";
import Toast from "components/Toast";
import { withTranslation } from "react-i18next";
import SubstituteSelectorFactory from "./../../../components/SubstituteSelector";
import constants from "./../../../constants";
import LeavesInput from "./LeavesInput";
import { getLeaveDetail } from "repositories/leave-repository";
import { getPerformanceReviews } from "repositories/performance-repository";
import TitleInput from "components/TitleInput";
import * as moment from "moment";
import Tooltip from "reactstrap/lib/Tooltip";
import { decodeId, encodeId } from "utils";

class AddStaff extends Component {
  state = {
    staffId: 0,
    inviteId: 0,
    userId: 0,
    officeId: parseInt(decodeId(this.props.match.params.id)),
    title: 6,
    firstName: "",
    lastName: "",
    emailId: "",
    staffType: "",
    designationId: "",
    performanceReviewId: null,
    hourlyRate: 0,
    isAdmin: false,
    isDoctor: false,
    isReceptionist: false,
    isOrderManager: false,
    schedule: "",
    errors: {},
    isToastView: false,
    isProps: true,
    scheduleWeek: [],
    statusType: null,
    defatultSelected: null,

    substituteSelectorEvent: null,
    IsInventoryManager: false,

    loadingLeaveDetail: false,
    loadingReviewList: false,
    leaves: [],
    reviewFormList: [{ id: "0", name: "Select Performance Review" }],
    isAccountOwner: false,
    tooltipObj: {
      tooltipAdmin: false,
      tooltipDoctor: false,
      tooltipReceptionist: false,
      tooltipInventory: false,
      tooltipOrder: false,
    },
  };

  componentDidMount() {
    if (
      this.props.profile.role.systemRole === constants.systemRoles.accountOwner
    )
      this.setState({ isAccountOwner: true });

    const officeId = parseInt(decodeId(this.props.match.params.id));
    this.props.getstaffDesignation(officeId);

    if (
      (this.props.profile &&
        this.props.profile.profileSetupStep === "packageExpired") ||
      this.props.profile.profileSetupStep === "subscriptionTerminated"
    ) {
      this.props.history.push(
        constants.routes.accountOwner.staffGrid.replace(":officeId", officeId)
      );
    }

    this.props.getOfficesDetail({ Id: decodeId(this.props.match.params.id) });
    if (
      officeId &&
      this.props.location &&
      this.props.location.state &&
      this.props.location.state.staffDetail &&
      this.props.location.state.staffDetail.staffMemberId
    ) {
      this.getPerformanceReviews(
        officeId,
        this.props.location.state.staffDetail.staffMemberId
      );
    }

    if (
      this.props.location &&
      this.props.location.pathname &&
      !this.props.location.pathname.includes("AddStaff")
    ) {
      if (this.state.inviteId)
        this.setState({ loadingLeaveDetail: true }, () =>
          this.getLeaveDetail(null, this.state.inviteId)
        );
      else
        this.setState({ loadingLeaveDetail: true }, () =>
          this.getLeaveDetail(this.state.staffId)
        );
    }
  }

  getPerformanceReviews = async (officeId, userId) => {
    let apiRes = await getPerformanceReviews(officeId, userId);
   

    if (apiRes.statusCode !== 200) return;
    const reviewType = [
      "General",
      "ProbationPeriod",
      "MonthlyReview",
      "QuarterlyReview",
      "YearlyReview",
      "Others",
    ];
    const reviewFormList = [...this.state.reviewFormList];
    apiRes.data.map((it) =>
      reviewFormList.push({
        id: it.id,
        name:
          moment(it.createdAt).format("MMMM DD, YYYY") +
          " - " +
          reviewType[it.type],
      })
    );
    this.setState({ loadingReviewList: false, reviewFormList });
  };
  getLeaveDetail = async (staffId, invitationId) => {
    let apiRes = null;
    if (staffId) apiRes = await getLeaveDetail(staffId);
    else apiRes = await getLeaveDetail(null, invitationId);

    if (apiRes.statusCode !== 200) return;

    const leaves = apiRes.data.map((it) => ({
      typeId: it.typeId,
      value: it.leaves.toString(),
      error: "",
    }));

    this.setState({ loadingLeaveDetail: false, leaves });
  };

  static getDerivedStateFromProps(props, state) {
    if (
      props.location.state &&
      props.location.pathname !== "/AddStaff" &&
      Object.keys(props.location.state.staffDetail).length > 0 &&
      state.isProps
    ) {
      let schedules = [
        { value: "7", label: "S", active: false },
        { value: "1", label: "M", active: false },
        { value: "2", label: "T", active: false },
        { value: "3", label: "W", active: false },
        { value: "4", label: "T", active: false },
        { value: "5", label: "F", active: false },
        { value: "6", label: "S", active: false },
      ];
      const scheduleDays = props.location.state.staffDetail.schedule.split(",");
      let interselection = schedules.filter((item) => {
        if (scheduleDays.includes(item.value)) {
          item.active = true;
          return item;
        } else {
          return item;
        }
      });

      return {
        inviteId: props.location.state.staffDetail.inviteId,
        title: props.location.state.staffDetail.honorific,
        firstName: props.location.state.staffDetail.firstName,
        lastName: props.location.state.staffDetail.lastName,
        emailId: props.location.state.staffDetail.emailId,
        staffType: props.location.state.staffDetail.staffRoleId,
        designationId: props.location.state.staffDetail.designationId,
        isAdmin: props.location.state.staffDetail.isAdmin,
        isOrderManager: props.location.state.staffDetail.isOrderManager,
        isDoctor: props.location.state.staffDetail.isDoctor,
        isReceptionist: props.location.state.staffDetail.isReceptionist,
        IsInventoryManager: props.location.state.staffDetail.isInventoryManager,

        scheduleWeek: interselection,
        schedule: scheduleDays,
        statusType: props.location.state.staffDetail.type,
        staffId: props.location.state.staffDetail.staffId,
        hourlyRate: props.location.state.staffDetail.hourlyRate,
        performanceReviewId:
          props.location.state.staffDetail.performanceReviewId > 0
            ? props.location.state.staffDetail.performanceReviewId
            : null,
      };
    }

    let defatultSelected = null;

    if (props.staffDesignation && props.staffDesignation.designations_list) {
      defatultSelected = props.staffDesignation.designations_list.filter(
        (item) => item.isDefaultRole
      );
    }

    if (defatultSelected && state.isProps && defatultSelected.length > 0) {
      return {
        designationId: defatultSelected[0].id,
      };
    }

    return {
      defatultSelected: defatultSelected,
    };
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.officeDetail &&
      Object.keys(this.props.officeDetail)?.length > 0 &&
      prevProps?.officeDetail !== this.props.officeDetail &&
      !this.props.officeDetail?.isActive
    ) {
      this.props.history.push(
        constants.routes.accountOwner.staffGrid.replace(
          ":officeId",
          encodeId(this.state?.officeId)
        )
      );
    }

    if (
      prevProps.isStaffAdd !== this.props.isStaffAdd ||
      prevProps.isAddedError !== this.props.isAddedError
    ) {
      window.scrollTo(0, 0);

      this.setState({ isToastView: true });
      setTimeout(() => {
        if (this.props.isStaffAdd) {
          this.props.history.push(
            constants.routes.accountOwner.staffGrid.replace(
              ":officeId",
              encodeId(this.state.officeId)
            )
          );
        }
      }, 3500);
    }
  }

  isNumberKey = (evt) => {
    let RegExpVal = new RegExp(/^\d+\.?\d*$/);

    if (evt.currentTarget.value && !RegExpVal.test(evt.currentTarget.value)) {
      return;
    }
    this.InputChange(evt);
  };

  InputChange = (event) => {
    this.setState({ isProps: false });
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleWeekDays = (event) => {
    this.setState({ isProps: false });
    let weekArray = [...this.state.schedule];

    if (event.target.checked) {
      weekArray.push(event.target.value);
      this.setState({ schedule: [...weekArray] });
    } else {
      const index = weekArray.indexOf(event.target.value);
      weekArray.splice(index, 1);
      this.setState({ schedule: [...weekArray] });
    }
  };

  handleWeekDaysEdit = (row, event, index) => {
    const dataValue = [...this.state.scheduleWeek];
    dataValue[index].active = event.target.checked;
    this.setState({ isProps: false, scheduleWeek: dataValue });

    let weekArray = [...this.state.schedule];

    if (event.target.checked) {
      weekArray.push(event.target.value);
      this.setState({ schedule: [...weekArray] });
    } else {
      const _index = weekArray.indexOf(event.target.value);
      weekArray.splice(_index, 1);
      this.setState({ schedule: [...weekArray] });
    }
  };

  handleAccountAdmin = (event) => {
    this.setState({ isProps: false });
    this.setState({ isAdmin: event.target.checked });
  };

  onDoctorCheckChange = (e) => {
    const v = e.target.checked;
    this.setState((s) => ({
      isProps: false,
      isDoctor: v,
      isReceptionist: v ? false : s.isReceptionist,
    }));
  };

  onReceptionistCheckChange = (e) => {
    const v = e.target.checked;
    this.setState((s) => ({
      isProps: false,
      isReceptionist: v,
      isDoctor: v ? false : s.isDoctor,
    }));
  };

  onOrderChange = (e) => {
    const v = e.target.checked;
    this.setState((s) => ({ isProps: false, isOrderManager: v }));
  };

  InventoryManager = (e) => {
    const v = e.target.checked;
    this.setState((s) => ({ isProps: false, IsInventoryManager: v }));
  };

  isValid = () => {
    const {
      emailId,
      title,
      staffType,
      firstName,
      lastName,
      designationId,
      schedule,
    } = this.state;
    const errors = {};
    let isValid = true;

    const { t } = this.props;
    if (!title) {
      errors.title = t("form.errors.emptySelection", { field: t("title") });
      isValid = false;
    }

    if (!firstName) {
      errors.firstname = t("form.errors.emptyField", {
        field: t("form.fields.firstName"),
      });
      isValid = false;
    }

    if (!lastName) {
      errors.lastname = t("form.errors.emptyField", {
        field: t("form.fields.lastName"),
      });
      isValid = false;
    }

    if (!emailId) {
      errors.emailId = t("form.errors.emptyField", {
        field: t("form.fields.emailAddress"),
      });
      isValid = false;
    }

    if (emailId && !Helper.validateEmail(emailId)) {
      errors.emailId = t("form.errors.invalidValue", {
        field: t("form.fields.emailAddress"),
      });
      isValid = false;
    }

    if (!staffType) {
      errors.staffType = t("form.errors.emptySelection", {
        field: t("form.fields.staffType"),
      });
      isValid = false;
    }

    if (!designationId) {
      errors.designationId = t("form.errors.emptySelection", {
        field: t("form.fields.designation"),
      });
      isValid = false;
    }

    if (schedule.length <= 0) {
      errors.schedule = t("form.errors.emptySelection", {
        field: t("form.fields.schedule"),
      });
      isValid = false;
    }

    const leaves = [...this.state.leaves];
    leaves.forEach((l) => {
      if (!l.value) {
        isValid = false;
        l.error = t("form.errors.invalidValue2");
      } else if (!/^\d+$/.test(l.value)) {
        isValid = false;
        l.error = t("form.errors.numericValue");
      } else if (parseInt(l.value) > 366) {
        isValid = false;
        l.error = t("form.errors.maxLeaveCount");
      } else if (parseInt(l.value) < 0) {
        isValid = false;
        l.error = t("form.errors.minLeaveCount");
      }
    });

    this.setState({ errors, leaves });

    return isValid;
  };

  handleAddstaff = () => {
    const isValid = this.isValid();

    if (isValid) {
      if (
        this.props.location.state &&
        this.props.location.state.staffDetail.isAdmin &&
        !this.state.isAdmin &&
        this.props.location.state.staffDetail.staffId
      )
        this.startSubstituteSelectionJourney();
      else this.performAction();
    }
  };

  performAction = (transferWorkItemsTo, removeAsAdminFromAllOffices) => {
    const {
      staffId,
      IsInventoryManager,
      inviteId,
      officeId,
      title,
      firstName,
      lastName,
      emailId,
      staffType,
      designationId,
      isAdmin,
      isDoctor,
      isReceptionist,
      schedule,
      statusType,
      hourlyRate,
      performanceReviewId,
      isOrderManager,
    } = this.state;
    const payload = {
      staffId,
      userId: this.props.profile.id,
      officeId,
      honorific: title,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      emailId: emailId.trim(),
      staffType: parseInt(staffType),
      designationId: parseInt(designationId),
      isAdmin,
      isDoctor,
      IsOrderManager: isOrderManager,
      isReceptionist,
      IsInventoryManager,
      schedule: schedule.toString(),
      transferWorkItemsTo,
      removeAsAdminFromAllOffices,
      leaves: this.state.leaves.map((l) => ({
        leaveTypeId: l.typeId,
        leaves: parseInt(l.value),
      })),
      hourlyRate: parseFloat(hourlyRate),
      performanceReviewId: parseInt(performanceReviewId),
    };

    if (statusType === 3) {
      const payloadInvite = {
        inviteId,
        userId: this.props.profile.id,
        officeId,
        honorific: title,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        emailId: emailId.trim(),
        staffType: parseInt(staffType),
        designationId: parseInt(designationId),
        isAdmin,
        IsOrderManager: isOrderManager,
        IsInventoryManager,
        isDoctor,
        isReceptionist,
        schedule: schedule.toString(),
        leaves: this.state.leaves.map((l) => ({
          leaveTypeId: l.typeId,
          leaves: parseInt(l.value),
        })),
        hourlyRate: parseFloat(hourlyRate),
        performanceReviewId: parseInt(performanceReviewId),
      };
      this.props.addEditStaffInvite({ ...payloadInvite });
      return;
    }

    if (this.props.location.state) {
      this.props.editStaff({ ...payload });
    } else {
      this.props.addEditStaff({ ...payload });
    }
  };

  toastHide = () => {
    this.setState({ isToastView: false });
  };

  startSubstituteSelectionJourney = () => {
    this.setState({
      substituteSelectorEvent: constants.staffActionEvents.removalAsAdmin,
    });
  };

  exitSubstituteSelectionJourney = () => {
    this.setState({ substituteSelectorEvent: null });
  };

  substituteSelectorAction = (userId, officeId, transferWorkItemsTo) => {
    this.setState({ substituteSelectorEvent: null }, async () => {
      this.performAction(transferWorkItemsTo, officeId === null ? true : false);
    });
  };

  render() {
    const { staffDesignation, statusMessage, isAddedError, t } = this.props;
    const {
      errors,
      isToastView,
      firstName,
      lastName,
      emailId,
      staffType,
      hourlyRate,
      performanceReviewId,
      isAdmin,
      isReceptionist,
      isDoctor,
      scheduleWeek,
      reviewFormList,
      isOrderManager,
      IsInventoryManager,
    } = this.state;

    const officeId = this.state.officeId;

    if (this.state.substituteSelectorEvent !== null) {
      const { staffDetail } = this.props.location.state;
      const staff = {
        id: staffDetail.staffId,
        userId: staffDetail.staffMemberId,
        profilePicURL: staffDetail.profilePic,
        firstName: staffDetail.firstName,
        lastName: staffDetail.lastName,
        officeId: officeId,
      };
      return (
        <SubstituteSelectorFactory
          staff={staff}
          event={this.state.substituteSelectorEvent}
          onAction={this.substituteSelectorAction}
          onCancel={this.exitSubstituteSelectionJourney}
        />
      );
    }

    const getSelectedOption = () => {
      const selectedData =
        staffDesignation?.designations_list.find(
          (designation) =>
            designation.id.toString() === this.state.designationId?.toString()
        ) || {};
      return selectedData.name;
    };

    const handleCustomDropDown = (value, name) => {
      const eventObject = {
        target: {
          value: value.id.toString(),
          name: name,
        },
      };

      this.InputChange(eventObject);
    };

    return (
      <div className="add-staff-block">
        {isToastView && statusMessage && (
          <Toast
            message={statusMessage}
            handleClose={this.toastHide}
            errorToast={
              isAddedError ||
              statusMessage ===
                "User account already exists and cannot be added as a staff member" ||
              statusMessage ===
                "Account admin has already been assigned to the office"
                ? true
                : false
            }
          />
        )}

        <div className="container">
          <button className="back-btn">
            {this.props.location.state ? (
              <Link to={`/Staff/${encodeId(officeId)}`}>
                <span className="ico">
                  <img
                    src={require("assets/images/arrow-back-icon.svg").default}
                    alt="arrow"
                  />
                </span>
                {t("back")}
              </Link>
            ) : (
              <Link to="/">
                <span className="ico">
                  <img
                    src={require("assets/images/arrow-back-icon.svg").default}
                    alt="arrow"
                  />
                </span>
                {t("back")}
              </Link>
            )}
          </button>
        </div>
        <div className="container container-smd">
          <div className="row no-gutters align-items-center mt-2">
            <div className="col-md-7">
              <h2 className="title">{this.props.officeDetail?.name || null}</h2>
              <p className="sub-title">
                {this.props.location.state
                  ? t("accountOwner.editStaffMember")
                  : t("accountOwner.addStaffMember")}
              </p>
            </div>
          </div>
          <div className="form-wrapper">
            <div className="add-staff-form">
              <TitleInput
                value={this.state.title}
                onChange={(v) =>
                  this.setState({
                    isProps: false,
                    title: v,
                  })
                }
                error={errors.title}
              />

              <Input
                Title={t("form.fields.firstName")}
                Type="text"
                Placeholder={t("form.placeholder1", {
                  field: t("form.fields.firstName"),
                })}
                Name={"firstName"}
                HandleChange={this.InputChange}
                Error={errors.firstname}
                Value={firstName}
              />

              <Input
                Title={t("form.fields.lastName")}
                Type="text"
                Placeholder={t("form.placeholder1", {
                  field: t("form.fields.lastName"),
                })}
                Name={"lastName"}
                HandleChange={this.InputChange}
                Error={errors.lastname}
                Value={lastName}
              />

              {this.state.statusType &&
                this.state.statusType === 3 &&
                this.props.location.state && (
                  <Input
                    Title={t("form.fields.emailAddress")}
                    ReadOnly={
                      this.state.statusType && this.state.statusType !== 3
                        ? true
                        : false
                    }
                    Type="email"
                    Placeholder={t("form.placeholder1", {
                      field: t("form.fields.emailAddress"),
                    })}
                    Name={"emailId"}
                    HandleChange={this.InputChange}
                    Error={errors.emailId}
                    Value={emailId}
                  />
                )}

              {!this.props.location.state && (
                <Input
                  Title={t("form.fields.emailAddress")}
                  ReadOnly={
                    this.state.statusType && this.state.statusType !== 3
                      ? true
                      : false
                  }
                  Type="email"
                  Placeholder={t("form.placeholder1", {
                    field: t("form.fields.emailAddress"),
                  })}
                  Name={"emailId"}
                  HandleChange={this.InputChange}
                  Error={errors.emailId}
                  Value={emailId}
                />
              )}

              {this.state.statusType &&
                this.state.statusType !== 3 &&
                this.props.location.state && (
                  <Input
                    Title={t("form.fields.emailAddress")}
                    ReadOnly={
                      this.state.statusType && this.state.statusType !== 3
                        ? true
                        : false
                    }
                    Type="email"
                    Placeholder={t("form.placeholder1", {
                      field: t("form.fields.emailAddress"),
                    })}
                    Name={"emailId"}
                    Error={errors.emailId}
                    Value={emailId}
                  />
                )}

              <div className="c-field c-field-sm">
                <label>{t("form.fields.staffType")}</label>
                <div className="radio-list">
                  <ul>
                    <li>
                      <div className="ch-radio">
                        <label>
                          <input
                            type="radio"
                            name="staffType"
                            value="2"
                            onChange={this.InputChange}
                            checked={staffType == 2 ? true : false}
                          />
                          <span>{t("form.values.permanent")}</span>
                        </label>
                      </div>
                    </li>
                    <li>
                      <div className="ch-radio">
                        <label>
                          <input
                            type="radio"
                            name="staffType"
                            value="1"
                            onChange={this.InputChange}
                            checked={staffType == 1 ? true : false}
                          />
                          <span>{t("form.values.temporary")}</span>
                        </label>
                      </div>
                    </li>
                  </ul>
                </div>
                {errors.staffType && (
                  <span className="error-msg"> {errors.staffType} </span>
                )}
              </div>

              {staffDesignation &&
                staffDesignation.designations_list &&
                staffDesignation.designations_list.length > 0 && (
                  <div className="custom-dropdown-only">
                    <CustomSelect
                      Title="Role"
                      options={staffDesignation?.designations_list}
                      id={"designationId"}
                      dropdownClasses={"custom-select-scroll"}
                      selectedOption={{ name: getSelectedOption() }}
                      selectOption={(value) =>
                        handleCustomDropDown(value, "designationId")
                      }
                    />
                  </div>
                )}
              {errors.designationId && (
                <span className="error-msg">{errors.designationId}</span>
              )}

              {/* Schedule list  */}
              <div className="schedule-list">
                <label>{t("accountOwner.selectSchedule")}</label>

                <ul>
                  {scheduleWeek.length > 0 &&
                    scheduleWeek.map((item, index) => (
                      <li key={item.value}>
                        <label>
                          <input
                            type="checkbox"
                            value={item.value}
                            onChange={(e) =>
                              this.handleWeekDaysEdit(item, e, index)
                            }
                            checked={item.active}
                          />
                          <span>{item.label}</span>
                        </label>
                      </li>
                    ))}

                  {scheduleWeek.length === 0 && (
                    <Fragment>
                      <li>
                        <label>
                          <input
                            type="checkbox"
                            value="7"
                            onChange={this.handleWeekDays}
                          />
                          <span>S</span>
                        </label>
                      </li>
                      <li>
                        <label>
                          <input
                            type="checkbox"
                            value="1"
                            onChange={this.handleWeekDays}
                          />
                          <span>M</span>
                        </label>
                      </li>
                      <li>
                        <label>
                          <input
                            type="checkbox"
                            value="2"
                            onChange={this.handleWeekDays}
                          />
                          <span>T</span>
                        </label>
                      </li>
                      <li>
                        <label>
                          <input
                            type="checkbox"
                            value="3"
                            onChange={this.handleWeekDays}
                          />
                          <span>W</span>
                        </label>
                      </li>
                      <li>
                        <label>
                          <input
                            type="checkbox"
                            value="4"
                            onChange={this.handleWeekDays}
                          />
                          <span>T</span>
                        </label>
                      </li>
                      <li>
                        <label>
                          <input
                            type="checkbox"
                            value="5"
                            onChange={this.handleWeekDays}
                          />
                          <span>F</span>
                        </label>
                      </li>
                      <li>
                        <label>
                          <input
                            type="checkbox"
                            value="6"
                            onChange={this.handleWeekDays}
                          />
                          <span>S</span>
                        </label>
                      </li>
                    </Fragment>
                  )}
                </ul>
                {errors.schedule && (
                  <span className="error-msg"> {errors.schedule} </span>
                )}
              </div>

              {/* Leave group input */}
              {!this.state.loadingLeaveDetail && (
                <LeavesInput
                  leaves={this.state.leaves}
                  onChange={(leaves) => this.setState({ leaves })}
                />
              )}

              <Input
                Title={t("staff.hourlyRate")}
                Type="text"
                Placeholder={t("form.placeholder1", {
                  field: t("staff.hourlyRate"),
                })}
                Name={"hourlyRate"}
                HandleChange={this.isNumberKey}
                HelperLabel={<strong>{t("superAdmin.cad")}</strong>}
                Value={hourlyRate}
              />
              {this.props.location.state && (
                <Select
                  Title={t("form.fields.selectPerformanceReview")}
                  selectedOption={
                    performanceReviewId ? performanceReviewId : "0"
                  }
                  Options={reviewFormList}
                  Name={"performanceReviewId"}
                  HandleChange={this.InputChange}
                />
              )}

              {/* Assign Account Admin Role checkbox */}
              {this.state.isAccountOwner && (
                <div className="account-checkbox d-flex">
                  <div className="ch-checkbox ">
                    <label>
                      <input
                        type="checkbox"
                        name="isAdmin"
                        onChange={this.handleAccountAdmin}
                        checked={isAdmin}
                      />
                      <span>{t("accountOwner.assignAccountAdminRole")}</span>
                    </label>
                  </div>
                  <img
                    className="ml-2 cursor-pointer mb-2"
                    onClick={() => {
                      this.setState({ tooltipObj: { tooltipAdmin: true } });
                    }}
                    id="TooltipAdmin"
                    src={
                      require("assets/images/info_black-tooltip.svg").default
                    }
                    alt="icon"
                  />

                  <Tooltip
                    className="new-item-card-catalogue-tooltip"
                    isOpen={this.state.tooltipObj.tooltipAdmin}
                    placement="top"
                    target="TooltipAdmin"
                    toggle={() => {
                      this.setState({
                        tooltipObj: {
                          tooltipAdmin: !this.state.tooltipObj.tooltipAdmin,
                        },
                      });
                    }}
                  >
                    {t("accountOwner.adminTooltipText")}
                  </Tooltip>
                </div>
              )}

              {(this.state.isAccountOwner || this.props.location.state) && (
                <div>
                  {/* Assign Doctor Role */}
                  <div className="account-checkbox d-flex">
                    <div className="ch-checkbox">
                      <label className="mt-1">
                        <input
                          type="checkbox"
                          name="isDoctor"
                          onChange={this.onDoctorCheckChange}
                          checked={isDoctor}
                        />
                        <span>{t("accountOwner.assignDoctorRole")}</span>
                      </label>
                    </div>
                    <img
                      className="ml-2 cursor-pointer mb-4"
                      onClick={() => {
                        this.setState({ tooltipObj: { tooltipDoctor: true } });
                      }}
                      id="TooltipDoctor"
                      src={
                        require("assets/images/info_black-tooltip.svg").default
                      }
                      alt="icon"
                    />

                    <Tooltip
                      className="new-item-card-catalogue-tooltip"
                      isOpen={this.state.tooltipObj.tooltipDoctor}
                      placement="top"
                      target="TooltipDoctor"
                      toggle={() => {
                        this.setState({
                          tooltipObj: {
                            tooltipDoctor: !this.state.tooltipObj.tooltipDoctor,
                          },
                        });
                      }}
                    >
                      {t("accountOwner.doctorTooltipText")}
                    </Tooltip>
                  </div>
                  {/* Assign Doctor Role */}

                  {/* Assign Receptionist Role */}
                  <div className="account-checkbox d-flex">
                    <div className="ch-checkbox">
                      <label>
                        <input
                          type="checkbox"
                          name="isReceptionist"
                          onChange={this.onReceptionistCheckChange}
                          checked={isReceptionist}
                        />
                        <span>{t("accountOwner.assignReceptionistRole")}</span>
                      </label>
                    </div>
                    <img
                      className="ml-2 cursor-pointer mb-2"
                      onClick={() => {
                        this.setState({
                          tooltipObj: { tooltipReceptionist: true },
                        });
                      }}
                      id="TooltipReceptionist"
                      src={
                        require("assets/images/info_black-tooltip.svg").default
                      }
                      alt="icon"
                    />

                    <Tooltip
                      className="new-item-card-catalogue-tooltip"
                      isOpen={this.state.tooltipObj.tooltipReceptionist}
                      placement="top"
                      target="TooltipReceptionist"
                      toggle={() => {
                        this.setState({
                          tooltipObj: {
                            tooltipReceptionist:
                              !this.state.tooltipObj.tooltipReceptionist,
                          },
                        });
                      }}
                    >
                      {t("accountOwner.receptionistTooltipText")}
                    </Tooltip>
                  </div>
                  {/* Assign Receptionist Role */}

                  {/* Assign Receptionist Role */}
                  <div className="account-checkbox d-flex">
                    <div className="ch-checkbox ">
                      <label>
                        <input
                          type="checkbox"
                          name="isReceptionist"
                          onChange={this.onOrderChange}
                          checked={isOrderManager}
                        />
                        <span>{t("Com")}</span>
                      </label>
                    </div>
                    <img
                      className="ml-2 cursor-pointer mb-2"
                      onClick={() => {
                        this.setState({ tooltipObj: { tooltipOrder: true } });
                      }}
                      id="TooltipOrderManager"
                      src={
                        require("assets/images/info_black-tooltip.svg").default
                      }
                      alt="icon"
                    />

                    <Tooltip
                      className="new-item-card-catalogue-tooltip"
                      isOpen={this.state.tooltipObj.tooltipOrder}
                      placement="top"
                      target="TooltipOrderManager"
                      toggle={() => {
                        this.setState({
                          tooltipObj: {
                            tooltipOrder: !this.state.tooltipObj.tooltipOrder,
                          },
                        });
                      }}
                    >
                      {t("accountOwner.ordermanagerTooltipText")}
                    </Tooltip>
                  </div>
                  {/* Assign Receptionist Role */}

                  {/* Inventory Manager */}
                  <div className="account-checkbox d-flex">
                    <div className="ch-checkbox ">
                      <label>
                        <input
                          type="checkbox"
                          name="isReceptionist"
                          onChange={this.InventoryManager}
                          checked={IsInventoryManager}
                        />
                        <span>{t("Assign Inventory Manager")}</span>
                      </label>
                    </div>
                    <img
                      className="ml-2 cursor-pointer mb-2"
                      onClick={() => {
                        this.setState({
                          tooltipObj: { tooltipInventory: true },
                        });
                      }}
                      id="TooltipInventory"
                      src={
                        require("assets/images/info_black-tooltip.svg").default
                      }
                      alt="icon"
                    />

                    <Tooltip
                      className="new-item-card-catalogue-tooltip align-top"
                      isOpen={this.state.tooltipObj.tooltipInventory}
                      placement="top"
                      target="TooltipInventory"
                      toggle={() => {
                        this.setState({
                          tooltipObj: {
                            tooltipInventory:
                              !this.state.tooltipObj.tooltipInventory,
                          },
                        });
                      }}
                    >
                      {t("accountOwner.inventoryTooltipText")}
                    </Tooltip>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="btn-field">
                <div className="row gutters-12">
                  <div className="col-md-auto">
                    <button
                      className="button button-round button-shadow"
                      disabled={isToastView}
                      title={t("accountOwner.sendInvitation")}
                      onClick={this.handleAddstaff}
                    >
                      {this.props.location.state
                        ? t("accountOwner.updateUser")
                        : t("accountOwner.sendInvitation")}
                    </button>
                  </div>
                  <div className="col-md-auto">
                    <Link to={`/Staff/${encodeId(officeId)}`}>
                      <button
                        className="button button-round button-border button-dark"
                        title={t("cancel")}
                      >
                        {t("cancel")}
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({
  userProfile: { profile },
  staff: {
    staffDesignation,
    isLoading,
    statusMessage,
    isStaffAdd,
    isAddedError,
  },
  offices: { officeDetail },
  errors: { isError },
}) => ({
  staffDesignation,
  isLoading,
  isError,
  profile,
  statusMessage,
  isStaffAdd,
  isAddedError,
  officeDetail,
});

export default connect(mapStateToProps, {
  getstaffDesignation,
  addEditStaff,
  addEditStaffInvite,
  editStaff,
  getOfficesDetail,
})(_isLoading(withTranslation()(AddStaff)));
