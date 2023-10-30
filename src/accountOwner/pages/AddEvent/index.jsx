import Page from "components/Page";
import React, { useState, useEffect } from "react";
import { withTranslation } from "react-i18next";
import styles from "./AddEvent.module.scss";
import "./AddEvent.scss";
import CustomSelect from "components/CustomSelect";
import CustomDropdown from "components/Dropdown";
import DatePicker from "react-datepicker";
import TimePicker from "rc-time-picker";
import { Row, Col } from "reactstrap";
import AddEmployeeModal from "./components/AddEmployeeModal";
import AddRolesModal from "./components/AddRolesModal";
import moment from "moment";
import {
  updateTimeToUpcomingQuater,
  testRegexCheck,
  testRegexCheckDescription,
} from "utils";
import constants from "../../../constants";
import CustomInputTag from "./components/CustomInputTag";
import { getOfficeDetail } from "repositories/office-repository";
import {
  useAllActiveOffices,
  useStaffDesignation,
  getStaffMembers,
  useCreateSchedulerEventMutation,
} from "repositories/scheduler-repository";
import toast from "react-hot-toast";
import Loader from "components/Loader";
import Alert from "reactstrap/lib/Alert";
import Text from "components/Text";
import useReadOnlyDateTextInput from "hooks/useReadOnlyDateTextInput";

const AddEvent = ({ t, history }) => {
  const goBack = () => history.push(constants.routes.scheduler.calendar);
  const selectedOwnerId = localStorage.getItem("selectedOwner")
    ? JSON.parse(localStorage.getItem("selectedOwner")).id
    : null;

  const [today, setToday] = useState(moment().toDate());
  const [issaveEmployeeModalOpen, setIsSaveEmployeeModalOpen] = useState(false);
  const [issaveRolesModalOpen, setIsSaveRolesModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [eventDate, setEventDate] = useState(today);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [isAllDayEvent, setIsAllDayEvent] = useState(false);
  const [repeatedType, setRepeatedType] = useState(1);
  const [repeatedEndDate, setRepeatedEndDate] = useState(today);
  const [eventLocation, setEventLocation] = useState("");
  const [blockForPatient, setBlockForPatient] = useState(false);
  const [note, setNote] = useState("");
  const [publishAsEvent, setPublishAsEvent] = useState(false);
  const [userIds, setUserIds] = useState([]);
  const [designationIds, setDesignationIds] = useState([]);
  const [eventTags, setEventTags] = useState([]);
  const [errors, seterrors] = useState({});
  const [loader, setLoader] = useState(false);
  const startDatePickerRef = useReadOnlyDateTextInput();
  const endDatePickerRef = useReadOnlyDateTextInput();

  const RepeatOptions = [
    { id: 1, name: `${t("scheduler.never")}` },
    {
      id: 2,
      name: `${t("scheduler.repeatForAll")} ${moment(eventDate).format(
        "dddd"
      )}`,
    },
    { id: 3, name: `${t("scheduler.repeatForAllFuture")}` },
  ];
  const [officeType, setOfficeType] = useState(null);
  const [allMembersList, setAllMembersList] = useState([]);

  const [officeDetails, setOfficeDetails] = useState([]);
  const { isLoading, data: officeData } = useAllActiveOffices(
    1,
    400,
    selectedOwnerId
  );
  let OfficeOptions = [];
  if (!isLoading && officeData && officeData.data && officeData.data.length) {
    OfficeOptions = officeData.data;
  }

  const { isLoading: loadinStaffData, data: roleData } = useStaffDesignation();
  const createSchedulerEventMutation = useCreateSchedulerEventMutation();

  useEffect(() => {
    if (officeType) {
      setAllMembersList([]);
      setUserIds([]);
      setOfficeDetails(null);
      getOfficeMembers();
      getOfficeDetails();
    }
    // eslint-disable-next-line
  }, [officeType]);

  const getOfficeDetails = async () => {
    setLoader(true);
    try {
      const res = await getOfficeDetail(officeType);
      if (res) {
        const timezoneDate = moment(
          moment.tz(res.state.timezoneId).format("MMMM Do YYYY, h:mm:ss a"),
          "MMMM Do YYYY, h:mm:ss a"
        ).toDate();
        setOfficeDetails(res);
        setToday(timezoneDate);
        setEventDate(timezoneDate);
        setStartTime(null);
        setEndTime(null);
      }
      setLoader(false);
    } catch (e) {
      console.log(e.message);
      setLoader(false);
    }
  };

  const getOfficeMembers = async () => {
    setLoader(true);

    try {
      const res = await getStaffMembers(officeType);

      if (res && res.length) {
        setAllMembersList(res);
      }
      setLoader(false);
    } catch (e) {
      setLoader(false);
      console.log(e.message);
    }
  };
  const handleChange = (key, value) => {
    let errorsData = JSON.parse(JSON.stringify(errors));

    if (key === "title") {
      if (value.trim().length > 400) {
        errorsData.title = t("form.errors.maxLimit", { limit: "400" });
      } else if (value.trim().length == 0) {
        errorsData.title = t("form.errors.emptyField", { field: t("title") });
      } else {
        delete errorsData["title"];
      }
    }

    if (key === "allDay") {
      setIsAllDayEvent(value);
      if (value) {
        setStartTime(null);
        setEndTime(null);
        delete errorsData["startTime"];
        delete errorsData["endTime"];
      }
    }

    if (key === "eventLocation") {
      if (value.trim().length > 400) {
        errorsData.eventLocation = t("form.errors.maxLimit", { limit: "400" });
      } else if (value.trim().length == 0) {
        errorsData.eventLocation = t("form.errors.emptyField", {
          field: t("location"),
        });
      } else {
        delete errorsData["eventLocation"];
      }
    }

    if (key === "note") {
      if (value.trim().note > 1000) {
        errorsData.note = t("form.errors.maxLimit", { limit: "400" });
      } else if (value.trim().length == 0) {
        errorsData.note = t("form.errors.emptyField", {
          field: t("accountOwner.notes"),
        });
      } else {
        delete errorsData["note"];
      }
    }

    if (key === "officeType") {
      setOfficeType(value);
      if (value) {
        delete errorsData["selectEmployees"];
        delete errorsData["officeType"];
      }
    }
    if (key === "startTime") {
      const newStartTimeSlot = value;
      setStartTime(newStartTimeSlot);
      if (value && endTime) {
        const duration = moment
          .duration(moment(endTime).diff(moment(value)))
          .asMinutes();
        if (duration < 15) {
          setEndTime(moment(newStartTimeSlot).add(15, "minutes"));
        }
        delete errorsData["endTime"];
      }
    }

    if (key === "endTime") {
      const newEndTimeSlot = updateTimeToUpcomingQuater(value);
      setEndTime(newEndTimeSlot);
      if (startTime) {
        const duration = moment
          .duration(moment(newEndTimeSlot).diff(moment(startTime)))
          .asMinutes();
        if (duration > 14) {
          delete errorsData["endTime"];
        } else {
          errorsData["endTime"] = t("form.errors.endTimeShouldBeGreater");
        }
      }
    }

    seterrors(errorsData);
  };

  const isValidEvent = () => {
    let isValid = true;
    let errorsData = JSON.parse(JSON.stringify(errors));
    if (title.trim().length === 0 || title.trim().length > 400) {
      if (title.trim().length > 400) {
        errorsData.title = t("form.errors.maxLimit", { limit: "400" });
        isValid = false;
      } else if (title.trim().length == 0) {
        errorsData.title = t("form.errors.emptyField", { field: t("title") });
        isValid = false;
      } else {
        delete errorsData["title"];
      }
    }

    if (
      eventLocation.trim().length === 0 ||
      eventLocation.trim().length > 400
    ) {
      if (eventLocation.trim().length > 400) {
        errorsData.eventLocation = t("form.errors.maxLimit", { limit: "400" });
        isValid = false;
      } else if (eventLocation.trim().length == 0) {
        errorsData.eventLocation = t("form.errors.emptyField", {
          field: t("title"),
        });
        isValid = false;
      } else {
        delete errorsData["eventLocation"];
      }
    }

    if (note.trim().length === 0 || note.trim().length > 1000) {
      if (note.trim().length > 1000) {
        errorsData.note = t("form.errors.maxLimit", { limit: "400" });
        isValid = false;
      } else if (note.trim().length == 0) {
        errorsData.note = t("form.errors.emptyField", {
          field: t("accountOwner.notes"),
        });
        isValid = false;
      } else {
        delete errorsData["note"];
      }
    }

    if (!officeType) {
      errorsData.officeType = t("form.errors.emptySelection", {
        field: t("superAdmin.office"),
      });
      isValid = false;
    } else {
      delete errorsData["selectEmployees"];
      delete errorsData["officeType"];
    }

    if (!isAllDayEvent) {
      if (!startTime && endTime) {
        errorsData["startTime"] = t("form.errors.emptySelection", {
          field: t("staff.startTime"),
        });
        isValid = false;
        delete errorsData["endTime"];
      } else if (startTime && !endTime) {
        errorsData["endTime"] = t("form.errors.emptySelection", {
          field: t("staff.endTime"),
        });
        isValid = false;

        delete errorsData["startTime"];
      } else if (startTime && endTime) {
        const duration = moment
          .duration(moment(endTime).diff(moment(startTime)))
          .asMinutes();
        if (duration > 14) {
          delete errorsData["endTime"];
        } else {
          errorsData["endTime"] = t("form.errors.endTimeShouldBeGreater");
          isValid = false;
        }
      } else {
        errorsData["startTime"] = t("form.errors.emptySelection", {
          field: t("staff.startTime"),
        });
        errorsData["endTime"] = t("form.errors.emptySelection", {
          field: t("staff.endTime"),
        });
        isValid = false;
      }
    } else {
      delete errorsData["startTime"];
      delete errorsData["endTime"];
    }

    if (!userIds.length) {
      errorsData["selectEmployees"] = t("form.errors.emptySelection", {
        field: t("accountOwner.employees"),
      });
      isValid = false;
    } else {
      delete errorsData["selectEmployees"];
    }

    if (!designationIds.length) {
      errorsData["selectRoles"] = t("form.errors.emptySelection", {
        field: t("roles"),
      });
      isValid = false;
    } else {
      delete errorsData["selectRoles"];
    }

    seterrors(errorsData);
    return isValid;
  };

  const saveEvent = async () => {
    setLoader(true);
    if (isValidEvent() && officeDetails) {
      const params = {
        OwnerId: officeDetails.owner.id,
        OfficeId: officeDetails.id,
        Title: title,
        Date: moment(eventDate).format("YYYY-MM-DDTHH:mm"),
        StartTime: isAllDayEvent
          ? moment(eventDate).startOf("day").format("YYYY-MM-DDTHH:mm")
          : moment(eventDate).format("YYYY-MM-DDT") +
            moment(startTime).format("HH:mm"),
        EndTime: isAllDayEvent
          ? moment(eventDate).endOf("day").format("YYYY-MM-DDTHH:mm")
          : moment(eventDate).format("YYYY-MM-DDT") +
            moment(endTime).format("HH:mm"),
        IsAllDayEvent: isAllDayEvent,
        RepeatedType: +repeatedType,
        RepeatedDay: moment(eventDate).isoWeekday(),
        RepeatedEndDate:
          repeatedType !== 1
            ? moment(repeatedEndDate).format("YYYY-MM-DDTHH:mm")
            : null,
        Location: eventLocation,
        BlockForPatient: blockForPatient,
        Note: note,
        PublishAsEvent: publishAsEvent,
        eventEmployees: userIds,
        EventRoles: designationIds,
        EventTags: eventTags,
        CreatedAt: moment().format("YYYY-MM-DDTHH:mm"),
      };

      try {
        await createSchedulerEventMutation.mutateAsync(params);
        toast.success(t("staff.eventAdded"));
        setLoader(false);
        goBack();
      } catch (e) {
        toast.error(e.message);
        setLoader(false);
      }
    } else {
      scrollToError();
      setLoader(false);
    }
  };
  const openEmployeePopUp = () => {
    let errorsData = JSON.parse(JSON.stringify(errors));

    if (officeType) {
      setIsSaveEmployeeModalOpen(true);
      delete errorsData["selectEmployees"];
    } else {
      errorsData["selectEmployees"] = t("form.errors.emptySelection", {
        field: t("superAdmin.office"),
      });
    }
    seterrors(errorsData);
    scrollToError();
  };
  const scrollToError = () => {
    setTimeout(() => {
      const error = document.getElementsByClassName("error-msg");
      if (error && error.length) {
        error[0].scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "start",
        });
      }
    }, 1000);
  };

  const firstUserName = () => {
    let users = userIds?.filter((e) => e.IsDeleted === false);
    if (users?.length === 1 && allMembersList?.length) {
      let { firstName, lastName } = allMembersList?.find(
        (e) => e.id === users?.[0]?.userId
      );
      return `${firstName} ${lastName}`;
    } else {
      return `${users?.length} ${t("Selected")}`;
    }
  };

  const getDesignationName = () => {
    let designationRole = designationIds.filter((e) => e.IsDeleted === false);
    if (designationRole?.length === 1) {
      let val = roleData?.filter((data) => {
        let finalData = data?.designations?.find(
          (item) => item.id === designationRole?.[0]?.designationsId
        );
        if (finalData?.id) {
          data.finalData = finalData;
          return data;
        }
      });
      return val?.[0]?.name ?? "";
    } else {
      return `${designationRole.length} ${t("Selected")}`;
    }
  };

  const clearAllTags = () => {
    setEventTags([]);
  };

  const getSelectedOption = () => {
    const selectedData =
      OfficeOptions.find(
        (val) => val.id.toString() === officeType?.toString()
      ) || {};
    return selectedData.name;
  };

  return (
    <Page
      onBack={() => {
        goBack();
      }}
    >
      {(loader || loadinStaffData || isLoading) && <Loader />}

      <div className="p-0 container container-smd">
        <h2 className="page-title add-event-title">
          {t("accountOwner.addNewEvent")}
        </h2>
        <div className="form-wrapper mb-5">
          {!isLoading && !(OfficeOptions && OfficeOptions.length) && (
            <Text size="14px" marginBottom="25px" weight="400" color="red">
              {t("scheduler.noOfficeFoundForEvent")}
            </Text>
          )}
          <div className={styles["add-event-form"]}>
            <div className="custom-dropdown-only">
              <CustomSelect
                Title={t("superAdmin.office")}
                options={OfficeOptions}
                id={"OfficeOptions"}
                dropdownClasses={"custom-select-scroll"}
                Classes={
                  !(OfficeOptions && OfficeOptions.length)
                    ? "custom-disabled-field"
                    : ""
                }
                selectedOption={{ name: getSelectedOption() }}
                selectOption={(value) =>
                  handleChange("officeType", value.id.toString())
                }
              />
            </div>
            {errors.officeType && (
              <span className="error-msg">{errors.officeType}</span>
            )}
            {officeDetails &&
              officeDetails.state &&
              officeDetails.state.timezoneName && (
                <Alert color="warning" className="event-alert-box">
                  This event will be created using your office time zone:{" "}
                  {officeDetails.state.timezoneName}
                </Alert>
              )}

            <div className="c-field">
              <label>{t("title")}</label>
              <textarea
                className="c-form-control"
                placeholder={t("form.placeholder1", { field: t("title") })}
                name="title"
                maxLength="400"
                value={title}
                onChange={(e) => {
                  if (testRegexCheck(e.currentTarget.value)) {
                    handleChange("title", e.currentTarget.value);
                    setTitle(e.currentTarget.value);
                  }
                }}
              ></textarea>
              {errors.title && (
                <span className="error-msg">{errors.title}</span>
              )}
            </div>
            <div className="ch-checkbox c-field all-event-checkbox">
              <label>
                <input
                  type="checkbox"
                  defaultChecked={isAllDayEvent}
                  onChange={() => handleChange("allDay", !isAllDayEvent)}
                />
                <span>{t("accountOwner.allDayEvent")}</span>
              </label>
            </div>
            <div className="c-field">
              <label>{t("accountOwner.date")}</label>
              <div className="d-flex inputdate">
                <DatePicker
                  dateFormat="dd-MM-yyyy"
                  className="c-form-control"
                  onChange={(e) => {
                    setEventDate(e);
                    setRepeatedEndDate(e);
                  }}
                  minDate={today}
                  selected={eventDate}
                  ref={startDatePickerRef}
                />
              </div>
            </div>
            <Row>
              <Col xs="6">
                <div className="c-field">
                  <label>{t("start")}</label>
                  <TimePicker
                    showSecond={false}
                    placeholder="--"
                    format="h:mm A"
                    use12Hours
                    onChange={(e) => {
                      handleChange("startTime", e);
                    }}
                    className="event-time-picker"
                    disabled={isAllDayEvent}
                    value={startTime}
                    minuteStep={15}
                  />
                  {errors.startTime && (
                    <span className="error-msg">{errors.startTime}</span>
                  )}
                </div>
              </Col>
              <Col xs="6">
                <div className="c-field">
                  <label>{t("end")}</label>
                  <TimePicker
                    showSecond={false}
                    placeholder="--"
                    format="h:mm A"
                    use12Hours
                    onChange={(e) => {
                      handleChange("endTime", e);
                    }}
                    className={["event-time-picker"]}
                    disabled={isAllDayEvent}
                    value={endTime}
                    minuteStep={15}
                  />
                  {errors.endTime && (
                    <span className="error-msg">{errors.endTime}</span>
                  )}
                </div>
              </Col>
            </Row>
            <div className="c-field">
              <label>{t("repeat")}</label>

              <div className="custom-dropdown-only">
                <CustomDropdown
                  options={RepeatOptions}
                  selectedOption={repeatedType}
                  selectOption={(id) => {
                    setRepeatedType(id);
                  }}
                />
              </div>
            </div>
            {repeatedType != 1 && (
              <div className="c-field">
                <label>{t("accountOwner.endDateRepeatedEvents")}</label>
                <div className="d-flex inputdate">
                  <DatePicker
                    dateFormat="dd-MM-yyyy"
                    className="c-form-control"
                    onChange={(e) => {
                      setRepeatedEndDate(e);
                    }}
                    minDate={eventDate}
                    selected={repeatedEndDate}
                    ref={endDatePickerRef}
                  />
                </div>
              </div>
            )}

            <div className="c-field">
              <label>{t("location")}</label>
              <textarea
                className="c-form-control"
                placeholder={t("form.placeholder1", { field: t("location") })}
                name="location"
                maxLength="400"
                value={eventLocation}
                onChange={(e) => {
                  if (testRegexCheckDescription(e.currentTarget.value)) {
                    handleChange("eventLocation", e.currentTarget.value);
                    setEventLocation(e.currentTarget.value);
                  }
                }}
              ></textarea>
              {errors.eventLocation && (
                <span className="error-msg">{errors.eventLocation}</span>
              )}
            </div>

            <div className="c-field">
              <div className={" d-flex justify-content-between  "}>
                <label className={styles["c-field-label"]}>{t("roles")}</label>
                <span
                  className="link-btn"
                  onClick={() => {
                    setIsSaveRolesModalOpen(true);
                  }}
                >
                  {t("accountOwner.selectRoles")}
                </span>
              </div>
              <div className="c-form-control ">
                <span>
                  {designationIds.length === 0
                    ? t("accountOwner.noRolesSelected")
                    : getDesignationName()}
                </span>
              </div>
              {!designationIds.length && errors.selectRoles && (
                <span className="error-msg">{errors.selectRoles}</span>
              )}
            </div>
            <div className="c-field">
              <label className="mb-3">
                {t("accountOwner.blockTimeslotAallDoctors")}
              </label>
              <div className="ch-radio">
                <label
                  className="mr-5"
                  onClick={() => setBlockForPatient(true)}
                >
                  <input
                    type="radio"
                    name="blockTimeslotAallDoctors"
                    checked={blockForPatient}
                  />
                  <span> Yes </span>
                </label>

                <label onClick={() => setBlockForPatient(false)}>
                  <input
                    type="radio"
                    name="blockTimeslotAallDoctors"
                    checked={!blockForPatient}
                  />
                  <span>No</span>
                </label>
              </div>
            </div>
            <div className="c-field">
              <label className="c-field-label  d-flex justify-content-between">
                {t("accountOwner.employe")}
                <span
                  className="link-btn"
                  onClick={() => {
                    openEmployeePopUp();
                  }}
                >
                  {t("accountOwner.selectEmployees")}
                </span>
              </label>

              <div className="c-form-control ">
                <span>
                  {userIds?.length === 0
                    ? t("accountOwner.noEmployeesSelected")
                    : firstUserName()}
                </span>
              </div>
              {!userIds.length && errors.selectEmployees && (
                <span className="error-msg">{errors.selectEmployees}</span>
              )}
            </div>
            <div className="c-field">
              <label>{t("accountOwner.notes")}</label>
              <textarea
                className="c-form-control"
                placeholder={t("form.placeholder1", {
                  field: t("accountOwner.notes"),
                })}
                name="Notes"
                maxLength="1000"
                value={note}
                onChange={(e) => {
                  if (testRegexCheck(e.currentTarget.value)) {
                    handleChange("note", e.currentTarget.value);
                    setNote(e.currentTarget.value);
                  }
                }}
              ></textarea>
              {errors.note && <span className="error-msg">{errors.note}</span>}
            </div>
            <div className="c-field">
              <div className={" d-flex justify-content-between  "}>
                <label className="c-field-label">
                  {t("accountOwner.tags")}
                </label>
                <span
                  className="link-btn"
                  type="button"
                  data-testid="button-clearAll"
                  onClick={() => {
                    clearAllTags();
                  }}
                >
                  Clear all
                </span>
              </div>

              <CustomInputTag
                tagslist={eventTags}
                setTagslist={(value) => setEventTags(value)}
              />
            </div>
            <div className="c-field">
              <label className="mb-3">
                {t("accountOwner.publishAsAnEvent")}
              </label>
              <div className="ch-radio">
                <label className="mr-5" onClick={() => setPublishAsEvent(true)}>
                  <input
                    type="radio"
                    name="publishEvent"
                    checked={publishAsEvent}
                  />
                  <span> Yes </span>
                </label>

                <label onClick={() => setPublishAsEvent(false)}>
                  <input
                    type="radio"
                    name="publishEvent"
                    checked={!publishAsEvent}
                  />
                  <span>No</span>
                </label>
              </div>
            </div>
            <div className="add-event-btn-box">
              <button
                className="button button-round button-shadow mr-4"
                title={t("accountOwner.addEvent")}
                onClick={() => saveEvent()}
              >
                {t("accountOwner.addEvent")}
              </button>
              <button
                className="button button-round button-dark button-border"
                title={t("cancel")}
                onClick={() => {
                  goBack();
                }}
              >
                {t("cancel")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {issaveEmployeeModalOpen && (
        <AddEmployeeModal
          issaveEmployeeModalOpen={issaveEmployeeModalOpen}
          setIsSaveEmployeeModalOpen={setIsSaveEmployeeModalOpen}
          allMembersList={allMembersList}
          setAllMembersList={setAllMembersList}
          memberIds={userIds}
          setMemberIds={setUserIds}
          officeType={officeType}
        />
      )}

      {issaveRolesModalOpen && (
        <AddRolesModal
          issaveRolesModalOpen={issaveRolesModalOpen}
          setIsSaveRolesModalOpen={setIsSaveRolesModalOpen}
          designationIds={designationIds}
          setDesignationIds={setDesignationIds}
          userRoles={roleData ? roleData : []}
        />
      )}
    </Page>
  );
};

export default withTranslation()(AddEvent);
