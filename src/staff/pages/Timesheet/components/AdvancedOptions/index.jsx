import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import styles from "./AdvancedOptions.module.scss";
import UpArrow from "./../../../../../assets/images/up-arrow.svg";
import AllDayForm from "./AllDay/AllDayForm";
import HourlyForm from "./Hourly/HourlyForm";

function TimesheetAdvancedOptions({
  t,
  officeId,
  setAdvanceTimeSheetData,
  previousTSData,
  statusRadio,
  setStatusRadio,
  startTime,
  endTime,
  disableOptions,
  selectedDay,
}) {
  const [showLogTimesheet, setShowLogTimesheet] = useState(false);
  const advancedOptionClick = () => {
    if (!startTime || disableOptions) {
      setShowLogTimesheet(false);
      return;
    }
    setShowLogTimesheet(!showLogTimesheet);
  };
  useEffect(() => {
    setShowLogTimesheet(false);
  }, [selectedDay]);
  useEffect(() => {
    if (
      previousTSData &&
      previousTSData[0] &&
      previousTSData[0].advanceTimesheetType &&
      statusRadio === 0
    ) {
      setStatusRadio(previousTSData[0].advanceTimesheetType);
    }
    // eslint-disable-next-line
  }, [previousTSData]);

  const radioHandler = (_statusRadio) => {
    setStatusRadio(_statusRadio);
    setAdvanceTimeSheetData({
      IsTypeAdvance: true,
      AdvanceTimesheetType: _statusRadio,
      TimesheetTasks: [],
    });
  };
  const handleChange = (data) => {
    if (statusRadio === 1) {
      const startDateTime =
        startTime !== null ? startTime.format("YYYY-MM-DDTHH:mm") : null;
      const endDateTime =
        endTime !== null ? endTime.format("YYYY-MM-DDTHH:mm") : null;
      data.forEach((v, i) => {
        data[i]["startTime"] = startDateTime;
        data[i]["endTime"] = endDateTime;
      });
    }
    setAdvanceTimeSheetData({
      IsTypeAdvance: true,
      AdvanceTimesheetType: statusRadio,
      TimesheetTasks: data,
    });
  };
  return (
    <div className={styles["timesheet-advanced-options"]}>
      <span
        onClick={() => advancedOptionClick()}
        className={`link-btn ${styles["advanced-option-btn"]} ${
          !startTime || disableOptions ? styles.disable : ""
        }  ${showLogTimesheet ? styles.show : ""}`}
      >
        {t("staff.advancedOptions")} <img src={UpArrow} alt="up-arrow" />
      </span>
      {
        <div
          style={{ display: showLogTimesheet ? "block" : "none" }}
          className={styles["log-timesheet"]}
        >
          <div className="c-field mb-3">
            <label> {t("staff.howDoYouWantToLogYourTimesheet")}</label>
            <div className="d-flex mt-3">
              <div className="ch-radio mr-5">
                <label>
                  <input
                    type="radio"
                    name="logtimesheet"
                    checked={statusRadio === 1}
                    onClick={(e) => radioHandler(1)}
                  />
                  <span> {t("staff.allDay")} </span>
                </label>
              </div>
              <div className="ch-radio">
                <label>
                  <input
                    type="radio"
                    name="logtimesheet"
                    checked={statusRadio === 2}
                    onClick={(e) => radioHandler(2)}
                  />
                  <span> {t("staff.hourly")}</span>
                </label>
              </div>
            </div>
          </div>
          {statusRadio === 1 && (
            <AllDayForm
              officeId={officeId}
              handleChange={handleChange}
              previousTSData={previousTSData}
            />
          )}
          {statusRadio === 2 && (
            <HourlyForm
              officeId={officeId}
              handleChange={handleChange}
              previousTSData={previousTSData}
            />
          )}
        </div>
      }
    </div>
  );
}

export default withTranslation()(TimesheetAdvancedOptions);
