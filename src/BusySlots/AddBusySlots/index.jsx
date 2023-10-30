import Page from "components/Page";
import React, { useEffect, useState, useMemo } from "react";
import { withTranslation } from "react-i18next";
import styles from "./AddBusySlots.module.scss";
import "./AddBusySlots.scss";
import CustomSelect from "components/CustomSelect";
import CustomDropdown from "components/Dropdown";
import DatePicker from "react-datepicker";
import TimePicker from "rc-time-picker";
import { Row, Col } from "reactstrap";
import Text from "components/Text";
import Alert from "reactstrap/lib/Alert";
import {
  createBusySlot,
  useAllActiveOffices,
} from "repositories/scheduler-repository";
import constants from "../../constants.js";
import { useOfficeDetail } from "repositories/office-repository";
import Loader from "components/Loader";
import moment from "moment";
import { scrollToError, updateTimeToUpcomingQuater } from "utils";
import { cloneDeep } from "lodash";
import toast from "react-hot-toast";
import { testRegexCheck, testRegexCheckDescription } from "utils";
import useReadOnlyDateTextInput from "hooks/useReadOnlyDateTextInput";

const AddBusySlots = ({ t, history }) => {
  const goBack = () => history.push(constants.routes.scheduler.calendar);

  const [selectedOfficeId, setSelectedOfficeId] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [errors, setErrors] = useState({});
  const [eventDate, setEventDate] = useState(null);
  const [repeatType, setRepeatType] = useState("1");
  const [repeatEndDate, setRepeatEndDate] = useState(null);
  const [eventTitle, setEventTitle] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [inProgress, setInProgress] = useState(false);
  const startDatePickerRef = useReadOnlyDateTextInput();
  const endDatePickerRef = useReadOnlyDateTextInput();

  const selectedOwner = localStorage.getItem("selectedOwner");
  const selectedOwnerId = selectedOwner ? JSON.parse(selectedOwner)?.id : null;

  const { isLoading: officeListLoading, data: officeList } =
    useAllActiveOffices(1, 100, selectedOwnerId);

  const { isLoading: officeDetailsLoading, data: officeDetails } =
    useOfficeDetail(selectedOfficeId, { enabled: !!selectedOfficeId });

  //for event Date
  const selectedOfficeCurrentDate = useMemo(() => {
    if (officeDetails?.state?.timezoneId) {
      return moment(
        moment
          .tz(officeDetails.state.timezoneId)
          .format("MMMM Do YYYY, h:mm:ss a"),
        "MMMM Do YYYY, h:mm:ss a"
      ).toDate();
    }
    return moment().toDate();
  }, [officeDetails]);

  useEffect(() => {
    setEventDate(selectedOfficeCurrentDate);
    setRepeatEndDate(selectedOfficeCurrentDate);
    setStartTime(null);
    setEndTime(null);
  }, [selectedOfficeCurrentDate]);

  const RepeatOptions = [
    { id: 1, name: `${t("scheduler.never")}` },
    {
      id: 2,
      name: `${t("scheduler.repeatForAll")} ${moment(
        eventDate || selectedOfficeCurrentDate
      ).format("dddd")}s`,
    },
    { id: 3, name: `${t("scheduler.repeatForAllFuture")}` },
  ];

  //for office
  let OfficeOptions = [];
  if (
    !officeListLoading &&
    officeList &&
    officeList.data &&
    officeList.data.length
  ) {
    OfficeOptions = officeList.data;
  }

  useEffect(() => {
    if (officeList?.data?.length === 1) {
      setSelectedOfficeId(officeList.data[0].id);
    }
  }, [officeList]);

  const handleChange = (field, value) => {
    let errorsData = cloneDeep(errors);
    if (field === "selectOffice") {
      setSelectedOfficeId(value);
      if (!value) {
        errorsData.officeList = t("form.errors.emptySelection", {
          field: t("form.fields.office"),
        });
      } else {
        delete errorsData.officeList;
      }
    }
    if (field === "startTime") {
      setStartTime(value);
      if (value) delete errorsData.startTime;
      if (value && endTime) {
        const duration = moment
          .duration(moment(endTime).diff(moment(value)))
          .asMinutes();
        if (duration < 15) {
          setEndTime(moment(value).add(15, "minutes"));
          delete errorsData.endTime;
        }
      }
    }
    if (field === "endTime") {
      const newEndTimeSlot = updateTimeToUpcomingQuater(value);
      setEndTime(newEndTimeSlot);
      if (newEndTimeSlot) delete errorsData.endTime;
      if (startTime) {
        const duration = moment
          .duration(moment(newEndTimeSlot).diff(moment(startTime)))
          .asMinutes();
        if (duration > 14) {
          delete errorsData.endTime;
        } else {
          errorsData.endTime = t("form.errors.endTimeShouldBeGreater");
        }
      }
    }
    if (field === "eventLocation") {
      setEventLocation(value);
      if (!value.trim().length) {
        errorsData.eventLocation = t("form.errors.emptyField", {
          field: t("location"),
        });
      } else {
        delete errorsData.eventLocation;
      }
    }
    if (field === "eventDescription") {
      setEventDescription(value);
      if (!value.trim().length) {
        errorsData.eventDescription = t("form.errors.emptyField", {
          field: t("form.fields.description"),
        });
      } else {
        delete errorsData.eventDescription;
      }
    }
    if (field === "eventTitle") {
      setEventTitle(value);
      if (!value.trim().length) {
        errorsData.eventTitle = t("form.errors.emptyField", {
          field: t("title"),
        });
      } else {
        delete errorsData.eventTitle;
      }
    }
    setErrors(errorsData);
  };

  const isValidEvent = () => {
    const errorsData = cloneDeep(errors);
    //Office
    if (!selectedOfficeId) {
      errorsData.officeList = t("form.errors.emptySelection", {
        field: t("form.fields.office"),
      });
    } else {
      delete errorsData.officeList;
    }
    //Title
    if (!eventTitle.trim().length) {
      errorsData.eventTitle = t("form.errors.emptyField", {
        field: t("title"),
      });
    } else {
      delete errorsData.eventTitle;
    }
    //startTime
    if (!startTime) {
      errorsData.startTime = t("form.errors.emptySelection", {
        field: t("staff.startTime"),
      });
    } else {
      delete errorsData.startTime;
    }
    //endTime
    if (!endTime) {
      errorsData.endTime = t("form.errors.emptySelection", {
        field: t("staff.endTime"),
      });
    } else {
      delete errorsData.endTime;
    }
    //startTime and endTime gap
    if (startTime && endTime) {
      const duration = moment
        .duration(moment(endTime).diff(moment(startTime)))
        .asMinutes();
      if (duration > 14) {
        delete errorsData.endTime;
      } else {
        errorsData.endTime = t("form.errors.endTimeShouldBeGreater");
      }
    }
    //location
    if (!eventLocation.trim().length) {
      errorsData.eventLocation = t("form.errors.emptyField", {
        field: t("location"),
      });
    } else {
      delete errorsData.eventLocation;
    }
    //description
    if (!eventDescription.trim().length) {
      errorsData.eventDescription = t("form.errors.emptyField", {
        field: t("form.fields.description"),
      });
    } else {
      delete errorsData.eventDescription;
    }

    setErrors(errorsData);
    //Returns true if form is valid, and false otherwise.
    if (!!Object.values(errorsData).some((err) => !!err)) {
      scrollToError();
    }
    return !Object.values(errorsData).some((err) => !!err);
  };

  const handleBlock = async () => {
    if (isValidEvent() && officeDetails) {
      const body = {
        OwnerId: officeDetails.ownerId,
        OfficeId: officeDetails.id,
        Title: eventTitle,
        Date: moment(eventDate).format("YYYY-MM-DD"),
        StartTime:
          moment(eventDate).format("YYYY-MM-DDT") +
          moment(startTime).format("HH:mm"),
        EndTime:
          moment(eventDate).format("YYYY-MM-DDT") +
          moment(endTime).format("HH:mm"),
        repeatedType: +repeatType,
        isRepeated: +repeatType > 1,
        repeatedDay: +repeatType === 1 ? null : moment(eventDate).isoWeekday(),
        RepeatedEndDate:
          +repeatType === 1 ? null : moment(repeatEndDate).format("YYYY-MM-DD"),
        Location: eventLocation,
        Description: eventDescription,
      };
      setInProgress(true);
      try {
        await createBusySlot(body);
        toast.success(t("scheduler.busySlotAdded"));
        setInProgress(false);
        goBack();
      } catch (err) {
        toast.error(err.message);
        setInProgress(false);
      }
    }
  };

  const getSelectedOption = () => {
    const selectedData =
      OfficeOptions.find(
        (val) => val.id.toString() === selectedOfficeId?.toString()
      ) || {};
    return selectedData.name;
  };

  return (
    <Page
      onBack={() => {
        goBack();
      }}
    >
      {(officeListLoading || officeDetailsLoading || inProgress) && <Loader />}
      <div className="mx-auto p-0 container container-smd">
        <h2 className="page-title mb-3">
          {t("accountOwner.addBusyTimeslots")}
        </h2>
        <Text size="14px" marginBottom="25px" weight="300" color="#000">
          {" "}
          {t("accountOwner.addBusyTimeslotsDesc")}
        </Text>
        <div className="form-wrapper mb-5">
          {!officeListLoading && !(OfficeOptions && OfficeOptions.length) && (
            <Text size="14px" marginBottom="25px" weight="400" color="red">
              {t("scheduler.noOfficeFoundForBusyslots")}
            </Text>
          )}
          <div className={styles["busy-timeslots-form"]}>
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
                  handleChange("selectOffice", value.id.toString())
                }
              />
            </div>
            {errors.officeList && (
              <span className="error-msg">{errors.officeList}</span>
            )}

            {!!officeDetails && (
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
                value={eventTitle}
                onChange={(e) =>
                  testRegexCheck(e.target.value) &&
                  handleChange("eventTitle", e.target.value)
                }
              ></textarea>
              {errors.eventTitle && (
                <span className="error-msg">{errors.eventTitle}</span>
              )}
            </div>
            <div className="c-field">
              <label>{t("accountOwner.date")}</label>
              <div className="d-flex inputdate">
                <DatePicker
                  dateFormat="dd-MM-yyyy"
                  className="c-form-control"
                  onChange={(e) => {
                    setEventDate(e);

                    setRepeatEndDate(e);
                  }}
                  minDate={selectedOfficeCurrentDate}
                  selected={eventDate || selectedOfficeCurrentDate}
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
                    onChange={(e) => handleChange("startTime", e)}
                    className={"busy-slot-time-picker"}
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
                    onChange={(e) => handleChange("endTime", e)}
                    className={"busy-slot-time-picker"}
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
                  selectedOption={repeatType}
                  selectOption={(id) => {
                    setRepeatType(id.toString());
                  }}
                />
              </div>
            </div>
            {repeatType !== "1" && (
              <div className="c-field">
                <label>{t("accountOwner.endDateRepeatedEvents")}</label>
                <div className="d-flex inputdate">
                  <DatePicker
                    dateFormat="dd-MM-yyyy"
                    className="c-form-control"
                    minDate={eventDate}
                    selected={repeatEndDate || selectedOfficeCurrentDate}
                    onChange={(e) => setRepeatEndDate(e)}
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
                onChange={(e) =>
                  testRegexCheckDescription(e.target.value) &&
                  handleChange("eventLocation", e.target.value)
                }
              ></textarea>
              {errors.eventLocation && (
                <span className="error-msg">{errors.eventLocation}</span>
              )}
            </div>

            <div className="c-field">
              <label>{t("superAdmin.description")}</label>
              <textarea
                className="c-form-control"
                placeholder={t("form.placeholder1", {
                  field: t("superAdmin.description"),
                })}
                name="Description"
                maxLength="1000"
                value={eventDescription}
                onChange={(e) =>
                  handleChange("eventDescription", e.target.value)
                }
              ></textarea>
              {errors.eventDescription && (
                <span className="error-msg">{errors.eventDescription}</span>
              )}
            </div>
            <button
              className="button button-round button-shadow mr-4 mb-3"
              title={t("accountOwner.blockSlot")}
              onClick={handleBlock}
            >
              {t("accountOwner.blockSlot")}
            </button>
            <button
              className="button button-round button-dark button-border"
              title={t("cancel")}
              onClick={goBack}
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default withTranslation()(AddBusySlots);
