import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import { Col, Row } from "reactstrap";
import styles from "./Timesheet.module.scss";
import "./timesheet-calendar.scss";
import { withTranslation } from "react-i18next";
import { formatDate, setTimeToStartTime } from "utils";
import { useTimesheet } from "repositories/timesheet-repository";
import { useSelector } from "react-redux";
import DetailView from "./DetailView";
import { useOfficeDetailForStaff } from "repositories/office-repository";
import { useIPs } from "repositories/static-ip-repository";
import { useIP } from "repositories/ip-repository";
import PreviousTimesheetDetails from "./components/PreviousTimesheetDetails";
import moment from "moment";
import { useHistory } from "react-router-dom";
import toast from "react-hot-toast";

function TimesheetForm({ officeId, onError, location, t }) {
  const today = moment().toDate();
  const history = useHistory();
  const profile = useSelector((state) => state.userProfile.profile);
  const [selectedDate, setSelectedDdate] = useState(today);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedMonthYear, setSelectedMonthYear] = useState(today);
  const [datesMap, setDatesMap] = useState(new Array(31).fill({}));
  const [viewMode, setViewMode] = useState(false);
  const [isFormViewOnly, setIsFormViewOnly] = useState(true);
  const [viewOnlyReason, setViewOnlyReason] = useState("");

  const {
    isLoading: isLoadingTimesheet,
    isFetching: isFetchingTimesheet,
    error: timesheetError,
    data: timesheetData,
  } = useTimesheet(
    profile.id,
    officeId,
    getMonthStartDate(selectedMonthYear),
    getMonthEndDate(selectedMonthYear)
  );

  const {
    isLoading: isLoadingOfficeDetail,
    isFetching: isFetchingOfficeDetail,
    error: officeDetailError,
    data: officeDetail,
  } = useOfficeDetailForStaff(officeId);

  const {
    isLoading: isLoadingIPs,
    isFetching: isFetchingIPs,
    error: IPsError,
    data: IPs,
  } = useIPs(officeId);

  const {
    isLoading: isLoadingIP,
    isFetching: isFetchingIP,
    data: IP,
  } = useIP();

  useEffect(() => {
    if (timesheetData) {
      const _datesMap = createFullMonthDateMap(
        selectedMonthYear,
        timesheetData
      );
      setDatesMap(_datesMap);
      if (
        selectedDay === null ||
        (selectedMonthYear.getMonth() === selectedDate.getMonth() &&
          selectedMonthYear.getFullYear() === selectedDate.getFullYear())
      ) {
        setSelectedDay(_datesMap[selectedDate.getDate() - 1]);
      }
      if (
        location &&
        location.state &&
        location.state.viewMode &&
        selectedDay == null
      ) {
        setSelectedDay(
          _datesMap[
            moment(location.state.selectedDate, "YYYY-MM-DD")
              .toDate()
              .getDate() - 1
          ]
        );
        setSelectedDdate(
          moment(location.state.selectedDate, "YYYY-MM-DD").toDate()
        );
        setSelectedMonthYear(
          moment(location.state.selectedDate, "YYYY-MM-DD").toDate()
        );
        setViewMode(true);
      }
    }
    // eslint-disable-next-line
  }, [timesheetData, selectedMonthYear]);

  useEffect(() => {
    if (officeDetail && !isLoadingIPs && !IPsError && IP) {
      const { isTimesheetPreferenceTypeOnPremises, isTypeStaticIP } =
        officeDetail;

      if (isOfficeDisabledForUser()) {
        setIsFormViewOnly(true);
        setViewOnlyReason(t("staff.timesheetOfficeDisabled"));
      } else if (isTimesheetPreferenceTypeOnPremises && !isTypeStaticIP) {
        setIsFormViewOnly(true);
        setViewOnlyReason(t("staff.timesheetStaticIPDisabled"));
      } else if (
        isTimesheetPreferenceTypeOnPremises &&
        !IPs.find((it) => it.ip === IP)
      ) {
        setIsFormViewOnly(true);
        setViewOnlyReason(t("staff.timesheetNotOnPremises"));
      } else {
        setIsFormViewOnly(false);
        setViewOnlyReason("");
      }
    }
    // eslint-disable-next-line
  }, [officeDetail, IPs, isLoadingIPs, IPsError, IP]);

  useEffect(() => {
    if (timesheetError) {
      onError(timesheetError.message);
    }

    if (officeDetailError) {
      onError(officeDetailError.message);
    }
    // eslint-disable-next-line
  }, [timesheetError, officeDetailError]);

  const isOfficeDisabledForUser = () => {
    const {
      hasOwnerPackageExpired,
      isActive,
      isDeleted,
      isForcedDisabled,
      isUserActiveOfficeStaff,
      isUserRemovedFromOffice,
    } = officeDetail;

    return (
      hasOwnerPackageExpired ||
      !isActive ||
      isDeleted ||
      isForcedDisabled ||
      !isUserActiveOfficeStaff ||
      isUserRemovedFromOffice
    );
  };

  const shouldRenderLoader = () =>
    isLoadingTimesheet ||
    isFetchingTimesheet ||
    isLoadingOfficeDetail ||
    isFetchingOfficeDetail ||
    isLoadingIPs ||
    isFetchingIPs ||
    isLoadingIP ||
    isFetchingIP;
  const gotoSummary = () => {
    if (
      timesheetData &&
      timesheetData.total_logged_working_hours_in_minutes > 0
    ) {
      let locationData = location && location.state ? location.state : {};
      locationData["userId"] = profile.id;
      locationData["officeId"] = officeId;
      locationData["selectedDate"] = selectedDate;
      locationData["officeData"] =
        location && location.state && location.state.officeData
          ? location.state.officeData
          : officeDetail;
      history.push({
        pathname: "/timesheet-summary",
        state: locationData,
      });
    } else {
      toast.error(t("staff.notimeEntered"));
    }
  };
  return (
    <div className={styles["timesheet-calendar-wrapper"]}>
      {shouldRenderLoader() && (
        <div className={`${styles["loader-position"]} loader`} />
      )}
      <Row className="no-gutters">
        {/* Calendar */}
        <Col xl="4" lg="5">
          <div className={styles["calendar-col"]}>
            <div className={styles["calendar-header"]}>
              <LoggedWorkingHours
                minutes={
                  timesheetData
                    ? timesheetData.total_logged_working_hours_in_minutes
                    : 0
                }
                t={t}
              />
              {/* eslint-disable-next-line */}
              {!viewMode && (
                <a onClick={() => gotoSummary()}>
                  <span className="link-btn mb-3">
                    {t("staff.viewSummary")}
                  </span>
                </a>
              )}
            </div>
            <Calendar
              className="timesheet-calendar"
              calendarType="US"
              value={selectedDate}
              minDate={
                timesheetData &&
                getCalendarMinDate(new Date(timesheetData.date_Of_Joining))
              }
              onChange={(e) => !viewMode && setSelectedDdate(e)}
              onClickDay={(date) => {
                !viewMode && setSelectedDay(datesMap[date.getDate() - 1]);
              }}
              onActiveStartDateChange={({ activeStartDate, view }) => {
                if (view !== "month" || viewMode) return;

                setDatesMap(new Array(31).fill({}));
                setSelectedMonthYear(activeStartDate);
              }}
              tileClassName={({ view, date }) => {
                if (view !== "month") {
                  return "";
                }

                const dayInfo = datesMap[date.getDate() - 1];
                if (!dayInfo.isWorking) {
                  return "non-working-day";
                }

                if (dayInfo.type === "holiday") {
                  return "holiday";
                }

                if (dayInfo.type === "leave") {
                  return "leave";
                }

                if (
                  dayInfo.type === "timesheet" &&
                  dayInfo.timesheetStatus === 5
                ) {
                  return "paid";
                }

                if (dayInfo.type === "timesheet") {
                  return "filled";
                }

                if (
                  timesheetData &&
                  date.getTime() >=
                    setTimeToStartTime(
                      new Date(timesheetData.date_Of_Joining)
                    ).getTime() &&
                  !dayInfo.isFutureDate
                ) {
                  return "not-filled";
                } else {
                  return "no-border";
                }
              }}
            />
            <div className={styles["legend-wrapper"]}>
              <ul>
                <li>
                  <span
                    className={
                      styles["legend-icon"] + " " + styles["current-color"]
                    }
                  ></span>
                  <span className={styles["text-box"]}>
                    {t("staff.currentDay")}
                  </span>
                </li>
                <li>
                  <span
                    className={
                      styles["legend-icon"] + " " + styles["holiday-color"]
                    }
                  ></span>
                  <span className={styles["text-box"]}>
                    {t("staff.holiday")}
                  </span>
                </li>
                <li>
                  <span
                    className={
                      styles["legend-icon"] + " " + styles["leaves-color"]
                    }
                  ></span>
                  <span className={styles["text-box"]}>
                    {t("staff.leaves")}
                  </span>
                </li>
                <li>
                  <span
                    className={
                      styles["legend-icon"] + " " + styles["non-working-color"]
                    }
                  ></span>
                  <span className={styles["text-box"]}>
                    {t("staff.nonWorkingDay")}
                  </span>
                </li>
                <li className={styles["width-100"]}>
                  <span
                    className={
                      styles["legend-icon"] + " " + styles["pending-color"]
                    }
                  ></span>
                  <span className={styles["text-box"]}>
                    {t("staff.pastDatesAndTimesheetPending")}
                  </span>
                </li>
                <li className={styles["width-100"]}>
                  <span
                    className={
                      styles["legend-icon"] + " " + styles["added-color"]
                    }
                  ></span>
                  <span className={styles["text-box"]}>
                    {t("staff.pastDatesAndTimesheetAdded")}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </Col>

        {/* Form */}
        <Col xl="8" lg="7">
          {!viewMode && (
            <DetailView
              userId={profile.id}
              officeId={officeId}
              selectedDate={selectedDate}
              selectedDay={selectedDay}
              viewOnly={isFormViewOnly}
              viewOnlyReason={viewOnlyReason}
              IP={IP}
              t={t}
              officeDetail={officeDetail}
            />
          )}
          {viewMode && (
            <PreviousTimesheetDetails
              selectedDate={selectedDate}
              selectedDay={selectedDay}
            />
          )}
          {/* <DetailsHourly /> */}
          {/* <DetailsAllDay /> */}
        </Col>
      </Row>
    </div>
  );
}

function LoggedWorkingHours({ minutes, t }) {
  const hours = parseInt(minutes / 60);
  const minutesPercentage = (minutes % 60) / 60;

  const fractionHours = hours + minutesPercentage;

  return (
    <div className={styles["hour-box"]}>
      {fractionHours.toFixed(2)} {t("staff.hour", { count: fractionHours })}
    </div>
  );
}

function getMonthStartDate(date) {
  return formatDate(
    new Date(date.getFullYear(), date.getMonth(), 1),
    "YYYY-MM-DD"
  );
}

function getMonthEndDate(date) {
  return formatDate(
    new Date(date.getFullYear(), date.getMonth() + 1, 0),
    "YYYY-MM-DD"
  );
}

function getCalendarMinDate(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function createFullMonthDateMap(selectedMonthYear, timesheetData) {
  const dates = new Array(31).fill({});

  const monthStartDate = new Date(
    selectedMonthYear.getFullYear(),
    selectedMonthYear.getMonth(),
    1,
    0,
    0,
    0,
    0
  );
  const workingDays = timesheetData.working_days
    .split(",")
    .map((it) => (parseInt(it) === 7 ? 0 : parseInt(it)));
  markDayType(dates, new Date(monthStartDate), workingDays);

  markIsFutureDate(
    dates,
    new Date(monthStartDate),
    setTimeToStartTime(moment().toDate())
  );

  addTimesheetDays(dates, timesheetData);
  addLeaveDays(dates, selectedMonthYear, timesheetData);
  addHolidays(dates, timesheetData);

  return dates;
}

function markDayType(dates, monthStartDate, workingDays) {
  for (let i = 0; i < 31; i++) {
    dates[i] = { isWorking: false };
    if (workingDays.includes(monthStartDate.getDay())) {
      dates[i] = { isWorking: true };
    }
    monthStartDate.setDate(monthStartDate.getDate() + 1);
  }
}

function markIsFutureDate(dates, monthStartDate, today) {
  for (let i = 0; i < 31; i++) {
    dates[i] = {
      ...dates[i],
      isFutureDate: monthStartDate.getTime() > today.getTime(),
    };

    monthStartDate.setDate(monthStartDate.getDate() + 1);
  }
}

function addTimesheetDays(dates, timesheetData) {
  timesheetData.timesheet_list.forEach((it) => {
    const date = moment(it.timesheetDate, "YYYY-MM-DD").toDate();
    dates[date.getDate() - 1] = {
      ...dates[date.getDate() - 1],
      type: "timesheet",
      timesheetId: it.id,
      timesheetisAdvance: it.isTypeAdvance,
      timesheetType: it.advanceTimesheetType,
      timesheetStatus: it.statusId,
      timesheetStartTime: it.startTime,
      timesheetEndTime: it.endTime,
      timesheetBreakDuration: it.breakTime,
      timesheetRejectionReason: it.reason,
    };
  });
}

function addLeaveDays(dates, selectedMonthYear, timesheetData) {
  timesheetData.leave_list
    .filter((it) => it.leaveType !== 0)
    .forEach((it) => {
      const startDate = moment(it.fromDate, "YYYY-MM-DD").toDate();
      const endDate = moment(it.toDate, "YYYY-MM-DD").toDate();

      let currentDate = startDate;
      while (currentDate <= endDate) {
        if (
          currentDate.getMonth() !== selectedMonthYear.getMonth() ||
          currentDate.getFullYear() !== selectedMonthYear.getFullYear()
        ) {
          currentDate.setDate(currentDate.getDate() + 1);
          continue;
        }

        dates[currentDate.getDate() - 1] = {
          ...dates[currentDate.getDate() - 1],
          type: "leave",
          leaveStatus: it.status,
          leaveType: it.leaveType,
        };

        currentDate.setDate(currentDate.getDate() + 1);
      }
    });
}

function addHolidays(dates, timesheetData) {
  timesheetData.leave_list
    .filter((it) => it.leaveType === 0)
    .forEach((it) => {
      const date = moment(it.fromDate, "YYYY-MM-DD").toDate();

      dates[date.getDate() - 1] = {
        ...dates[date.getDate() - 1],
        type: "holiday",
        holidayTitle: it.description,
      };
    });
}

export default withTranslation()(TimesheetForm);
