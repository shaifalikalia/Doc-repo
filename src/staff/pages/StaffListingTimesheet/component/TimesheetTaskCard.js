import React from "react";
import Card from "components/Card";
import Text from "components/Text";
import { withTranslation } from "react-i18next";
import styles from "./../StaffListingTimesheet.module.scss";
import moment from "moment/moment";
import constants from "../../../../constants";

const TimesheetTaskCard = ({ t, details, index }) => {
  const timesheetType = constants.TimesheetType;

  /* To calculate the total hours */
  let duration = moment.duration(
    moment(details?.endTime).diff(moment(details?.startTime))
  );
  let totalHours = duration.asHours().toFixed(2);

  return (
    <div key={details.id}>
      <Card
        className={styles["timesheet-task-card"]}
        padding="30px"
        radius="10px"
        marginBottom="10px"
        shadow="0 0 15px 0 rgba(0, 0, 0, 0.08)"
        cursor="default"
      >
        {details && details.advanceTimesheetType !== timesheetType.AllDay && (
          <div className={styles["task"]}>
            <Text size="16px" marginBottom="30px" weight="600" color="#111B45">
              {`Task ${index + 1}`}
            </Text>
          </div>
        )}
        <div className={styles["card-content-main"]}>
          {details && details.advanceTimesheetType !== timesheetType.AllDay && (
            <>
              <div
                className={
                  styles["card-content-small"] + " " + styles["card-content"]
                }
              >
                <div className={styles["label-head"]}>
                  <Text
                    size="12px"
                    marginBottom="10px"
                    weight="400"
                    color="#6f7788"
                  >
                    {t("staffTimesheet.startTime")}
                  </Text>
                </div>
                <Text size="14px" weight="600" color="#102c42">
                  {details &&
                    details.startTime &&
                    moment(details.startTime).format("LT")}
                </Text>
              </div>

              <div
                className={
                  styles["card-content-small"] + " " + styles["card-content"]
                }
              >
                <div className={styles["label-head"]}>
                  <Text
                    size="12px"
                    marginBottom="10px"
                    weight="400"
                    color="#6f7788"
                  >
                    {t("staffTimesheet.finishTime")}
                  </Text>
                </div>
                <Text size="14px" weight="600" color="#102c42">
                  {details &&
                    details.endTime &&
                    moment(details.endTime).format("LT")}
                </Text>
              </div>
              <div
                className={
                  styles["card-content-small"] + " " + styles["card-content"]
                }
              >
                <div className={styles["label-head"]}>
                  <Text
                    size="12px"
                    marginBottom="10px"
                    weight="400"
                    color="#6f7788"
                  >
                    {t("staffTimesheet.totalHours")}
                  </Text>
                </div>
                <Text size="14px" weight="600" color="#102c42">
                  {totalHours ? `${totalHours} Hrs` : "--"}
                </Text>
              </div>
            </>
          )}
          <div
            className={
              styles["card-content-large"] + " " + styles["card-content"]
            }
          >
            <div className={styles["label-head"]}>
              <Text
                size="12px"
                marginBottom="10px"
                weight="400"
                color="#6f7788"
              >
                {t("staffTimesheet.typeOfWork")}
              </Text>
            </div>
            <Text size="14px" weight="600" color="#102c42">
              {details && details.timesheetCustomTaskResponse?.title
                ? details.timesheetCustomTaskResponse?.title
                : "--"}
            </Text>
          </div>
          <div
            className={
              styles["card-content-large"] + " " + styles["card-content"]
            }
          >
            <div className={styles["label-head"]}>
              <Text
                size="12px"
                marginBottom="10px"
                weight="400"
                color="#6f7788"
              >
                {t("staffTimesheet.task")}
              </Text>
            </div>
            <Text size="14px" weight="600" color="#102c42">
              {details &&
                details.timesheetWorkTypeResponse?.title &&
                details.timesheetWorkTypeResponse?.title}
            </Text>
          </div>
        </div>
        <div className="w-100">
          <div className={styles["label-head"]}>
            <Text size="12px" marginBottom="10px" weight="400" color="#6f7788">
              {t("staffTimesheet.description")}
            </Text>
          </div>
          <Text size="14px" weight="600" color="#102c42">
            {details && details?.discription ? details.discription : "--"}
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default withTranslation()(TimesheetTaskCard);
