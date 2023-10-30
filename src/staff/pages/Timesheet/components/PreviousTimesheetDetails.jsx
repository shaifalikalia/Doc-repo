import Card from "components/Card";
import Text from "components/Text";
import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { Row, Col } from "reactstrap";
import styles from "./AdvancedOptions/AdvancedOptions.module.scss";
import { formatDate } from "utils";
import { getTimesheetStatusById } from "./../../../../constants";
import { AnimatePresence, motion } from "framer-motion";
import { getAdvancedTimesheetDetails } from "repositories/timesheet-repository";
import moment from "moment";
function PreviousTimesheetDetails({ t, selectedDate, selectedDay }) {
  const [advanceTimeSheetData, setAdvanceTimeSheetData] = useState({});
  useEffect(() => {
    if (selectedDay.timesheetStatus) {
      getAdvanceSetting(selectedDay);
    }
  }, [selectedDay]);

  const getAdvanceSetting = async (data) => {
    try {
      const resp = await getAdvancedTimesheetDetails(
        data.timesheetId,
        data.timesheetType
      );
      if (resp) {
        setAdvanceTimeSheetData(resp);
      }
    } catch (e) {
      console.log(e.message);
    }
  };
  const shouldRenderTimesheetStatus = () =>
    selectedDay.isWorking ||
    (!selectedDay.isWorking && selectedDay.timesheetId);

  const calculateHrs = (start, end) => {
    if (!start || !end) {
      return " - ";
    }
    const duration = moment.duration(moment(end).diff(moment(start)));
    const hours = duration.asHours();
    return (hours <= 9 ? "0" : "") + hours.toFixed(2) + " Hrs ";
  };

  const calculateHrs2 = (start, end) => {
    if (!start || !end) {
      return " - ";
    }
    const duration = moment.duration(
      moment(end, "hh:mm A").diff(moment(start, "hh:mm A"))
    );
    const hours =
      (duration.asMinutes() - selectedDay.timesheetBreakDuration) / 60;
    return (hours <= 9 ? "0" : "") + hours.toFixed(2) + " Hrs ";
  };

  const [expandArray, setExpandArray] = useState([0]);
  const taskClick = (id) => {
    let temp = [...expandArray];
    const key = temp.indexOf(id);
    if (key > -1) {
      temp.splice(key, 1);
    } else {
      temp.push(id);
    }
    setExpandArray(temp);
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
    <div className={styles["details-common"]}>
      <div className={styles["detail-status-box"]}>
        <Text color="#111b45" size="25px" weight="500">
          {formatDate(selectedDate, "MMMM, D YYYY")}
        </Text>
        <AnimatePresence>
          {shouldRenderTimesheetStatus() && (
            <motion.div
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              exit={{ opacity: 0 }}
            >
              <div>
                <div className={styles["status-box"]}>
                  <TimesheetStatus selectedDay={selectedDay} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {selectedDay && (
        <>
          <Card
            radius="6px"
            marginBottom="10px"
            className={styles["detail-card"]}
          >
            <Row>
              <Col sm="4" xs="6">
                <div className={"c-field " + styles["c-field"]}>
                  <label>{t("staff.startTime")}</label>
                  <Text color="#102c42" size="14px" weight="600">
                    {selectedDay.timesheetStartTime
                      ? selectedDay.timesheetStartTime
                      : "-"}
                  </Text>
                </div>
              </Col>
              <Col sm="4" xs="6">
                <div className={"c-field " + styles["c-field"]}>
                  <label>{t("staff.breakDuration")}</label>
                  <Text color="#102c42" size="14px" weight="600">
                    {selectedDay.timesheetBreakDuration
                      ? calculateHoursFormat(selectedDay.timesheetBreakDuration)
                      : "-"}{" "}
                  </Text>
                </div>
              </Col>
              <Col sm="4" xs="6">
                <div className={"c-field " + styles["c-field"]}>
                  <label>{t("staff.finishTime")}</label>
                  <Text color="#102c42" size="14px" weight="600">
                    {selectedDay.timesheetEndTime
                      ? selectedDay.timesheetEndTime
                      : "-"}
                  </Text>
                </div>
              </Col>
            </Row>
          </Card>
          <Card
            radius="6px"
            marginBottom="10px"
            className={styles["detail-card"]}
          >
            <Row className="gutters-5">
              <Col sm="3" xs="6">
                <div className={"c-field " + styles["c-field"]}>
                  <label>{t("staff.timesheetType")}</label>
                  {selectedDay.timesheetisAdvance ? (
                    <Text color="#102c42" size="14px" weight="600">
                      {advanceTimeSheetData.advanceTimesheetType == "1"
                        ? t("staff.allDay")
                        : t("staff.hourly")}
                    </Text>
                  ) : (
                    <Text color="#102c42" size="14px" weight="600">
                      {" "}
                      {t("accountOwner.basic")}{" "}
                    </Text>
                  )}
                </div>
              </Col>
              <Col sm="3" xs="6">
                <div className={"c-field " + styles["c-field"]}>
                  <label>{t("staff.hourlyRate")}</label>
                  <Text color="#102c42" size="14px" weight="600">
                    {advanceTimeSheetData.hourlyRate
                      ? t("cad") +
                        " " +
                        advanceTimeSheetData.hourlyRate.toFixed(2)
                      : " - "}
                  </Text>
                </div>
              </Col>
              <Col sm="3" xs="6">
                <div className={"c-field " + styles["c-field"]}>
                  <label>{t("staff.totalHours")}</label>
                  <Text color="#102c42" size="14px" weight="600">
                    {advanceTimeSheetData.advanceTimesheetType == "1"
                      ? selectedDay.timesheetStartTime &&
                        selectedDay.timesheetEndTime
                        ? calculateHrs2(
                            selectedDay.timesheetStartTime,
                            selectedDay.timesheetEndTime
                          )
                        : " - "
                      : advanceTimeSheetData.totalHoursInMins
                      ? calculateHoursFormat(
                          advanceTimeSheetData.totalHoursInMins
                        )
                      : " - "}
                  </Text>
                </div>
              </Col>
              <Col sm="3" xs="6">
                <div className={"c-field " + styles["c-field"]}>
                  <label>{t("staff.totalAmount")}</label>
                  <Text color="#102c42" size="14px" weight="600">
                    {advanceTimeSheetData.totalAmountForPayment
                      ? t("cad") +
                        " " +
                        advanceTimeSheetData.totalAmountForPayment.toFixed(2)
                      : " - "}
                  </Text>
                </div>
              </Col>
            </Row>
          </Card>

          {advanceTimeSheetData.timesheetTasks &&
            advanceTimeSheetData.timesheetTasks.length > 0 &&
            advanceTimeSheetData.timesheetTasks.map((item, key) => (
              <Card
                radius="6px"
                marginBottom="10px"
                className={styles["detail-card"]}
                key={key}
              >
                {advanceTimeSheetData.advanceTimesheetType == "2" && (
                  <div className={styles["task-accordion"]}>
                    <div className="ch-field">
                      <Text color="#102c42" size="14px" weight="600">
                        Task {key + 1}{" "}
                      </Text>
                    </div>
                    <div
                      onClick={() => taskClick(key)}
                      className={` ${styles["arrow-icon"]}  ${
                        expandArray.includes(key) ? styles.show : ""
                      }`}
                    >
                      <img
                        src={
                          require("assets/images/up-arrow-angle.svg").default
                        }
                        alt="icon"
                      />{" "}
                    </div>
                  </div>
                )}
                {expandArray.includes(key) && (
                  <>
                    <Row>
                      <Col sm="4" xs="6">
                        <div className={"c-field " + styles[" c-field"]}>
                          <label>{t("staff.startTime")}</label>
                          <Text color="#102c42" size="14px" weight="600">
                            {advanceTimeSheetData.advanceTimesheetType == "1"
                              ? selectedDay.timesheetStartTime
                              : item.startTime
                              ? moment(item.startTime).format("hh:mm A")
                              : " - "}
                          </Text>
                        </div>
                      </Col>
                      <Col sm="4" xs="6">
                        <div className={"c-field " + styles["c-field"]}>
                          <label>{t("staff.finishTime")}</label>
                          <Text color="#102c42" size="14px" weight="600">
                            {advanceTimeSheetData.advanceTimesheetType == "1"
                              ? selectedDay.timesheetEndTime
                              : item.endTime
                              ? moment(item.endTime).format("hh:mm A")
                              : " - "}
                          </Text>
                        </div>
                      </Col>
                      <Col sm="4" xs="6">
                        <div className={"c-field " + styles["c-field"]}>
                          <label>{t("staff.totalHours")}</label>
                          <Text color="#102c42" size="14px" weight="600">
                            {advanceTimeSheetData.advanceTimesheetType == "1"
                              ? selectedDay.timesheetStartTime &&
                                selectedDay.timesheetEndTime
                                ? calculateHrs2(
                                    selectedDay.timesheetStartTime,
                                    selectedDay.timesheetEndTime
                                  )
                                : " - "
                              : item.startTime && item.endTime
                              ? calculateHrs(item.startTime, item.endTime)
                              : " - "}
                          </Text>
                        </div>
                      </Col>
                      <Col sm="12">
                        <div className={"c-field " + styles["c-field"]}>
                          <label>{t("staff.typeOfWork")}</label>
                          <Text color="#102c42" size="14px" weight="600">
                            {item.timesheetWorkTypeResponse &&
                            item.timesheetWorkTypeResponse.title
                              ? item.timesheetWorkTypeResponse.title
                              : " - "}
                          </Text>
                        </div>
                      </Col>
                      <Col sm="12">
                        <div className={"c-field " + styles["c-field"]}>
                          <label>{t("staff.taskAlreadyAssigned")}</label>
                          <Text color="#102c42" size="14px" weight="600">
                            {item.timesheetCustomTaskResponse &&
                            item.timesheetCustomTaskResponse.title
                              ? item.timesheetCustomTaskResponse.title
                              : " - "}
                          </Text>
                        </div>
                      </Col>
                      <Col sm="12">
                        <div className={"c-field " + styles["desc-field"]}>
                          <label>{t("staff.description")}</label>
                          <Text color="#535b5f" size="16px" weight="300">
                            {item.discription ? item.discription : " - "}
                          </Text>
                        </div>
                      </Col>
                    </Row>
                  </>
                )}
              </Card>
            ))}
        </>
      )}
    </div>
  );
}
export default withTranslation()(PreviousTimesheetDetails);

function TimesheetStatus({ selectedDay }) {
  let statusId = 1;
  let backgroundColorClass = styles["timesheet-red"];

  if (selectedDay.type === "timesheet" || selectedDay.timesheetStatus) {
    statusId = selectedDay.timesheetStatus;
    backgroundColorClass = styles["timesheet-filled"];
  }

  if (statusId === 5 || statusId === 3) {
    backgroundColorClass = styles["timesheet-paid"];
  } else if (statusId === 4) {
    backgroundColorClass = styles["timesheet-red"];
  }

  const timesheetStatus = getTimesheetStatusById(statusId);
  return (
    <div className={`${backgroundColorClass} ${styles["status-box"]}`}>
      {timesheetStatus.title}
    </div>
  );
}
