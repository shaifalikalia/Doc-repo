import React, { useState } from "react";
import Page from "components/Page";
import { withTranslation } from "react-i18next";
import styles from "./TimesheetView.module.scss";
import DatePicker from "react-datepicker";
import arrowIcon from "./../../../assets/images/down-arrow-white.svg";
import { useTimesheetDetail } from "repositories/timesheet-repository";
import { encodeId } from "utils";
import Empty from "components/Empty";
import Toast from "components/Toast/Alert";
import moment from "moment";
import constants from "../../../constants";
import Loader from "components/Loader";

function TimesheetView({ t, location, history }) {
  const startMonthDate = moment(location.state.selectedDate)
    .startOf("month")
    .toDate();
  const endMonthDate = moment(location.state.selectedDate)
    .endOf("month")
    .toDate();
  const [startDate, setStartDate] = useState(startMonthDate);
  const [endDate, setEndDate] = useState(endMonthDate);
  let vitualOffice = false;
  if (
    location.state &&
    location.state.officeData &&
    location.state.officeData.isReferenceOffice
  ) {
    vitualOffice = location.state.officeData.isReferenceOffice;
  }
  const goToPreviousScreen = () => {
    let locationData = location.state;
    locationData["viewMode"] = false;

    history.push({
      pathname: constants.routes.staff.timesheet.replace(
        ":officeId",
        encodeId(location.state.officeId)
      ),
      state: locationData,
    });
  };
  const {
    isLoading,
    error,
    data: timesheetData,
  } = useTimesheetDetail(
    location.state.userId,
    location.state.officeId,
    startDate,
    endDate
  );

  const [showHeader, toggleHeader] = useState(false);
  const handleToggle = () => {
    toggleHeader(!showHeader);
  };

  if (!isLoading && error) {
    return (
      <Page titleKey={t("staff.hourlyRateHistory")} onBack={goToPreviousScreen}>
        <Toast errorToast message={error.message} />
      </Page>
    );
  }

  if (!isLoading && !(timesheetData && timesheetData.timesheet_details)) {
    return (
      <Page titleKey={t("staff.hourlyRateHistory")} onBack={goToPreviousScreen}>
        <Empty Message={t("noRecordFound")} />
      </Page>
    );
  }
  const hourFormat = (val) => {
    if (!val) return 0;
    return (val / 60).toFixed(2);
  };
  const viewTimeSheetDetails = (data) => {
    let locationData = location.state;
    locationData["timeSheetId"] = data.id;
    locationData["selectedDate"] = data.timesheetDate;
    locationData["viewMode"] = true;
    history.push({
      pathname: constants.routes.staff.timesheet.replace(
        ":officeId",
        encodeId(location.state.officeId)
      ),
      state: locationData,
    });
  };

  const calculateHoursFormat = (time) => {
    const Hours = Math.floor(time / 60);
    const minutes = time % 60;
    const compute = parseFloat(
      Hours +
        "." +
        Math.round((minutes / 60) * 100)
          .toString()
          .padStart(2, "0")
    );
    const computeTime = compute.toString() + " Hrs ";
    return computeTime;
  };
  return (
    <Page onBack={goToPreviousScreen} titleKey="staff.timesheet">
      {isLoading && <Loader />}
      {timesheetData && timesheetData.timesheet_details && (
        <div className={styles["timesheet-view-wrapper"]}>
          <div className={styles["page-sub-heading"]}> </div>
          <div className={styles["calendar-box"]}>
            <div className="c-field">
              <label>{t("staff.dateFrom")}</label>
              <div className="d-flex inputdate">
                <DatePicker
                  selected={startDate}
                  onChange={(e) => {
                    setStartDate(e);
                  }}
                  dateFormat="dd-MM-yyyy"
                  className="c-form-control"
                  maxDate={endDate}
                />
              </div>
            </div>
            <div className="c-field ml-3">
              <label>{t("staff.dateTo")}</label>
              <div className="d-flex inputdate">
                <DatePicker
                  selected={endDate}
                  onChange={(e) => {
                    setEndDate(e);
                  }}
                  dateFormat="dd-MM-yyyy"
                  className="c-form-control"
                  maxDate={endMonthDate}
                  minDate={startDate}
                  popperPlacement="bottom-end"
                />
              </div>
            </div>
          </div>
          <div className={styles["timesheet-table"]}>
            <div
              className={`${styles["table-header-row"]}   ${
                showHeader ? styles["show"] : ""
              }`}
            >
              <div className={styles["icon-arrow"]} onClick={handleToggle}>
                <img src={arrowIcon} alt="icon" />
              </div>
              <div className={styles["header-left"]}>
                <div className={styles["label-text"]}>
                  {" "}
                  {t("staff.totalHoursOfPayment")}{" "}
                </div>
                <div className={styles["main-text"]}>
                  {hourFormat(
                    timesheetData.timesheet_details.totalApprovedMinutes +
                      timesheetData.timesheet_details.totalHolidayMinutes
                  )}{" "}
                  Hours
                </div>
              </div>
              <ul className={styles["header-right"]}>
                <li>
                  <div className={styles["label-text"]}>
                    {t("staff.logged")}{" "}
                  </div>
                  <div className={styles["main-text"]}>
                    {hourFormat(timesheetData.timesheet_details.logged)} hrs
                  </div>
                </li>
                <li>
                  <div className={styles["label-text"]}>
                    {" "}
                    {t("staff.approved")}{" "}
                  </div>
                  <div className={styles["main-text"]}>
                    {hourFormat(
                      timesheetData.timesheet_details.totalApprovedMinutes
                    )}{" "}
                    hrs
                  </div>
                </li>
                {!vitualOffice && (
                  <li>
                    <div className={styles["label-text"]}>
                      {t("staff.holiday")}{" "}
                    </div>
                    <div className={styles["main-text"]}>
                      {hourFormat(
                        timesheetData.timesheet_details.totalHolidayMinutes
                      )}{" "}
                      hrs{" "}
                    </div>
                  </li>
                )}
                <li>
                  <div className={styles["label-text"]}>
                    {" "}
                    {t("staff.workingDays")}{" "}
                  </div>
                  <div className={styles["main-text"]}>
                    {timesheetData.timesheet_details.workingDays} Day
                    {timesheetData.timesheet_details.workingDays > 1 ? "s" : ""}
                  </div>
                </li>
                <li>
                  <div className={styles["label-text"]}>
                    {t("staff.leaves")}{" "}
                  </div>
                  <div className={styles["main-text"]}>
                    {timesheetData.timesheet_details.leaves}{" "}
                  </div>
                </li>
                {!vitualOffice && (
                  <li>
                    <div className={styles["label-text"]}>
                      {t("staff.overtime")}{" "}
                    </div>
                    <div className={styles["main-text"]}>
                      {hourFormat(
                        timesheetData.timesheet_details.totalOvertimeInMins
                      )}{" "}
                      hrs
                    </div>
                  </li>
                )}
              </ul>
            </div>
            {timesheetData.timesheet_details.timesheetList.length > 0 && (
              <div className={styles["table-body"]}>
                {timesheetData.timesheet_details.timesheetList.map(
                  (item, key) => (
                    <div
                      className={styles["table-body-row"]}
                      key={key}
                      onClick={() => viewTimeSheetDetails(item)}
                    >
                      <div className={styles["body-left"]}>
                        <div className={styles["main-text"]}>
                          {moment(item.timesheetDate).format("MMM DD, dddd")}
                        </div>
                      </div>
                      <ul className={styles["body-right"]}>
                        {/*<li>
                                                <div className={styles["label-text"]}>{t("staff.timesheetType")} </div>
                                                <div className={styles["main-text"]}> All Day </div>
                                            </li>
                                             <li>
                                                <div className={styles["label-text"]}> {t("staff.totalAmountForPayment")} </div>
                                                <div className={styles["main-text"]}>CAD 13.00</div>
                                            </li> */}
                        <li>
                          <div className={styles["label-text"]}>
                            {t("staff.totalHours")}{" "}
                          </div>
                          <div className={styles["main-text"]}>
                            {calculateHoursFormat(item.timeSpent)}{" "}
                          </div>
                        </li>
                        <li>
                          <div className={styles["label-text"]}>
                            {t("staff.startTime")}{" "}
                          </div>
                          <div className={styles["main-text"]}>
                            {item.startTime}{" "}
                          </div>
                        </li>
                        <li>
                          <div className={styles["label-text"]}>
                            {t("staff.finishTime")}{" "}
                          </div>
                          <div className={styles["main-text"]}>
                            {item.endTime}{" "}
                          </div>
                        </li>
                        <li>
                          <div className={styles["label-text"]}>
                            {" "}
                            {t("staff.breakDuration")}{" "}
                          </div>
                          <div className={styles["main-text"]}>
                            {calculateHoursFormat(item.breakTime)}
                          </div>
                        </li>
                        {!vitualOffice && (
                          <li>
                            <div className={styles["label-text"]}>
                              {" "}
                              {t("staff.overtime")}{" "}
                            </div>
                            <div className={styles["main-text"]}>
                              {calculateHoursFormat(item.overtimeInMins)}
                            </div>
                          </li>
                        )}

                        {vitualOffice && (
                          <li>
                            <div className={styles["label-text"]}>
                              {" "}
                              {t("staff.hourlyRate")}{" "}
                            </div>
                            <div className={styles["main-text"]}>
                              CAD{" "}
                              {item.hourlyRate
                                ? item.hourlyRate.toFixed(2)
                                : "0.00"}
                            </div>
                          </li>
                        )}
                        <li>
                          <div className={styles["label-text"]}>
                            {" "}
                            {t("staff.totalAmount")}{" "}
                          </div>
                          <div className={styles["main-text"]}>
                            CAD{" "}
                            {item.totalAmountForPayment
                              ? item.totalAmountForPayment.toFixed(2)
                              : "0.00"}
                          </div>
                        </li>
                      </ul>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </Page>
  );
}

export default withTranslation()(TimesheetView);
