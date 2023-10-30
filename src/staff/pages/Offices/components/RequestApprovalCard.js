import React from "react";
import { Col, Row } from "reactstrap";
import Card from "components/Card";
import Text from "components/Text";
import moment from "moment/moment";
import { convertTimeMinuteToHour } from "utils";
import { withTranslation } from "react-i18next";
import styles from "./../Offices.module.scss";
import constants from "../../../../constants";

const RequestApprovalcard = ({ t, list, handleAction }) => {
  const leaveStatus = constants.LeaveStatus;
  const timesheetListingStatus = constants.TimesheetListingStatus;

  const startTime = moment(list?.timesheet_StartTime, "h:mm A");
  const endTime = moment(list?.timesheet_EndTime, "h:mm A");
  let duration = moment.duration(moment(endTime).diff(moment(startTime)));

  // Subtract the break duration from the total duration
  const totalDurationWithoutBreak = duration.subtract(
    list?.timesheet_BreakTime,
    "minutes"
  );
  let totalHours = totalDurationWithoutBreak.asHours().toFixed(2);

  const appliedForDate = (startDate, endDate) => {
    let appliedDate = `${moment(startDate).format("MMM D")} - ${moment(
      endDate
    ).format("ll")}`;
    return appliedDate;
  };

  const handlePendingRequestAction = (
    actionType,
    actionTypeId,
    statusId,
    isApproved
  ) => {
    handleAction(actionType, actionTypeId, statusId, isApproved);
  };

  const handleLeaveStatus = (statusId) => (
    <>
      {statusId === leaveStatus[1].value && <span>{t("pending")}</span>}
      {statusId === leaveStatus[2].value && (
        <span>{t("staffTimesheet.approved")}</span>
      )}
      {statusId === leaveStatus[3].value && <span>{t("rejected")}</span>}
    </>
  );

  return (
    <Card
      className={styles["request-approval-card"]}
      radius="10px"
      padding="30px"
      marginBottom="10px"
      shadow="0 0 15px 0 rgba(0, 0, 0, 0.08)"
      cursor="default"
      background-color="#F9FCEE"
    >
      <div className="d-flex justify-content-between">
        <div className={styles["request-div"]}>
          <Text size="16px" marginBottom="15px" weight="600" color="#587E85">
            {list?.timesheetId > 0 && <span> {list?.timesheet_Name}</span>}
            {list?.leave_Id > 0 && <span> {list?.leave_Name}</span>}
            {list?.clockInOutTimeSheetEditRequestId > 0 && (
              <span> {list?.editRequest_Name}</span>
            )}
          </Text>
        </div>
        <div>
          {list?.timesheetId > 0 && (
            <span className={styles["approval-status"]}>
              {" "}
              {t("contracts.timesheet")}
            </span>
          )}
          {list?.leave_Id > 0 && (
            <span className={styles["approval-status"] + " " + styles["leave"]}>
              {" "}
              {t("staffTimesheet.leave")}
            </span>
          )}
          {list?.clockInOutTimeSheetEditRequestId > 0 && (
            <span className={styles["approval-status"]}>
              {" "}
              {t("staffTimesheet.editTimesheet")}
            </span>
          )}
        </div>
      </div>
      <div className={styles["content-box"]}>
        <Row>
          {/* For Pendig timesheets */}
          {list?.timesheetId > 0 && (
            <>
              <Col sm="4" xs="6">
                <Text
                  size="12px"
                  marginBottom="5px"
                  weight="400"
                  color="#6f7788"
                >
                  {t("staffTimesheet.date")}
                </Text>
                <Text
                  size="14px"
                  marginBottom="25px"
                  weight="600"
                  color="#102c42"
                >
                  {list.timesheet_Date
                    ? moment(list.timesheet_Date).format("ll")
                    : "--"}
                </Text>
              </Col>
              <Col sm="4" xs="6">
                <Text
                  size="12px"
                  marginBottom="5px"
                  weight="400"
                  color="#6f7788"
                >
                  {t("staffTimesheet.started")}
                </Text>
                <Text
                  size="14px"
                  marginBottom="25px"
                  weight="600"
                  color="#102c42"
                >
                  {list.timesheet_StartTime ? list.timesheet_StartTime : "--"}
                </Text>
              </Col>
              <Col sm="4" xs="6">
                <Text
                  size="12px"
                  marginBottom="5px"
                  weight="400"
                  color="#6f7788"
                >
                  {t("staffTimesheet.finished")}
                </Text>
                <Text
                  size="14px"
                  marginBottom="25px"
                  weight="600"
                  color="#102c42"
                >
                  {list.timesheet_EndTime ? list.timesheet_EndTime : "--"}
                </Text>
              </Col>
              <Col sm="4" xs="6">
                <Text
                  size="12px"
                  marginBottom="5px"
                  weight="400"
                  color="#6f7788"
                >
                  {t("staffTimesheet.break")}
                </Text>
                <Text
                  size="14px"
                  marginBottom="25px"
                  weight="600"
                  color="#102c42"
                >
                  {list.timesheet_BreakTime
                    ? `${convertTimeMinuteToHour(list.timesheet_BreakTime)} Hrs`
                    : "--"}
                </Text>
              </Col>
              <Col sm="4" xs="6">
                <Text
                  size="12px"
                  marginBottom="5px"
                  weight="400"
                  color="#6f7788"
                >
                  {t("staffTimesheet.total")}
                </Text>
                <Text
                  size="14px"
                  marginBottom="25px"
                  weight="600"
                  color="#102c42"
                >
                  {totalHours ? `${totalHours} Hrs` : "--"}
                </Text>
              </Col>
            </>
          )}
          {list?.leave_Id > 0 && (
            <>
              <Col sm="4" xs="6">
                <Text
                  size="12px"
                  marginBottom="5px"
                  weight="400"
                  color="#6f7788"
                >
                  {t("staffTimesheet.appliedFor")}
                </Text>
                <Text
                  size="14px"
                  marginBottom="25px"
                  weight="600"
                  color="#102c42"
                >
                  {appliedForDate(list.leave_FromDate, list.leave_ToDate)}
                </Text>
              </Col>
              <Col sm="4" xs="6">
                <Text
                  size="12px"
                  marginBottom="5px"
                  weight="400"
                  color="#6f7788"
                >
                  {t("staffTimesheet.duration")}
                </Text>
                <Text
                  size="14px"
                  marginBottom="25px"
                  weight="600"
                  color="#102c42"
                >
                  {list?.leave_Duration ? `${list.leave_Duration} Days` : "--"}
                </Text>
              </Col>
              <Col sm="4" xs="6">
                <Text
                  size="12px"
                  marginBottom="5px"
                  weight="400"
                  color="#6f7788"
                >
                  {t("staffTimesheet.typeOfLeave")}
                </Text>
                <Text
                  size="14px"
                  marginBottom="25px"
                  weight="600"
                  color="#102c42"
                >
                  {list.leave_Type}
                </Text>
              </Col>
              <Col sm="4" xs="6">
                <Text
                  size="12px"
                  marginBottom="5px"
                  weight="400"
                  color="#6f7788"
                >
                  {t("staffTimesheet.status")}
                </Text>
                <Text
                  size="14px"
                  marginBottom="25px"
                  weight="600"
                  color="#102c42"
                >
                  {list?.leave_Status
                    ? handleLeaveStatus(list?.leave_Status)
                    : "--"}
                </Text>
              </Col>
              <Col sm="12" xs="6">
                <Text
                  size="12px"
                  marginBottom="5px"
                  weight="400"
                  color="#6f7788"
                >
                  {t("staffLeaves.reasonForLeave")}
                </Text>
                <Text
                  size="14px"
                  marginBottom="25px"
                  weight="600"
                  color="#102c42"
                >
                  {list?.leave_Description ? list?.leave_Description : "--"}
                </Text>
              </Col>
            </>
          )}
          {list?.clockInOutTimeSheetEditRequestId > 0 && (
            <>
              <Col sm="4" xs="6">
                <Text
                  size="12px"
                  marginBottom="5px"
                  weight="400"
                  color="#6f7788"
                >
                  {t("staffTimesheet.date")}
                </Text>
                <Text
                  size="14px"
                  marginBottom="25px"
                  weight="600"
                  color="#102c42"
                >
                  {list.timesheetRequest_Date
                    ? moment(list.timesheetRequest_Date).format("ll")
                    : "--"}
                </Text>
              </Col>
              <Col sm="4" xs="6">
                <Text
                  size="12px"
                  marginBottom="5px"
                  weight="400"
                  color="#6f7788"
                >
                  {t("staffTimesheet.started")}
                </Text>
                <Text
                  size="14px"
                  marginBottom="25px"
                  weight="600"
                  color="#102c42"
                >
                  {list.timesheet_StartTime ? list.timesheet_StartTime : "--"}
                </Text>
              </Col>
              <Col sm="4" xs="6">
                <Text
                  size="12px"
                  marginBottom="5px"
                  weight="400"
                  color="#6f7788"
                >
                  {t("staffTimesheet.finished")}
                </Text>
                <Text
                  size="14px"
                  marginBottom="25px"
                  weight="600"
                  color="#102c42"
                >
                  {list.timesheet_EndTime ? list.timesheet_EndTime : "--"}
                </Text>
              </Col>
              <Col sm="4" xs="6">
                <Text
                  size="12px"
                  marginBottom="5px"
                  weight="400"
                  color="#6f7788"
                >
                  {t("staffTimesheet.break")}
                </Text>
                <Text
                  size="14px"
                  marginBottom="25px"
                  weight="600"
                  color="#102c42"
                >
                  {list.timesheet_BreakTime
                    ? `${convertTimeMinuteToHour(list.timesheet_BreakTime)} Hrs`
                    : "--"}
                </Text>
              </Col>
              <Col sm="4" xs="6">
                <Text
                  size="12px"
                  marginBottom="5px"
                  weight="400"
                  color="#6f7788"
                >
                  {t("staffTimesheet.total")}
                </Text>
                <Text
                  size="14px"
                  marginBottom="25px"
                  weight="600"
                  color="#102c42"
                >
                  {list.timesheet_EndTime &&
                  list.timesheet_StartTime &&
                  totalHours
                    ? `${totalHours} Hrs`
                    : "--"}
                </Text>
              </Col>
              <Col sm="12" xs="6">
                <Text
                  size="12px"
                  marginBottom="5px"
                  weight="400"
                  color="#6f7788"
                >
                  {t("staffTimesheet.reasonForEditTimesheet")}
                </Text>
                <Text
                  size="14px"
                  marginBottom="25px"
                  weight="600"
                  color="#102c42"
                >
                  {list?.reason ? list?.reason : "--"}
                </Text>
              </Col>
            </>
          )}
        </Row>
        <button
          className="button button-round button-shadow mr-md-4 w-sm-100 mb-3 mb-md-0"
          onClick={() => {
            if (list?.timesheetId > 0) {
              handlePendingRequestAction(
                "Timesheet",
                list.timesheetId,
                timesheetListingStatus[3].value
              ); //actionType, actionTypeId, statusId, isApproved
            }
            if (list?.leave_Id > 0) {
              handlePendingRequestAction("Leave", list.leave_Id, null, true); //actionType, actionTypeId, statusId, isApproved
            }
            if (list?.clockInOutTimeSheetEditRequestId > 0) {
              handlePendingRequestAction(
                "EditTimesheetRequest",
                list.clockInOutTimeSheetEditRequestId,
                null,
                true
              ); //actionType, actionTypeId, statusId, isApproved
            }
          }}
          title={t("accept")}
        >
          {t("accept")}
        </button>

        <button
          className={
            "button button-round button-border btn-mobile-link button-dark"
          }
          onClick={() => {
            if (list?.timesheetId > 0) {
              handlePendingRequestAction(
                "Timesheet",
                list.timesheetId,
                timesheetListingStatus[4].value
              );
            }
            if (list?.leave_Id > 0) {
              handlePendingRequestAction("Leave", list.leave_Id, null, false);
            }
            if (list?.clockInOutTimeSheetEditRequestId > 0) {
              handlePendingRequestAction(
                "EditTimesheetRequest",
                list.clockInOutTimeSheetEditRequestId,
                null,
                false
              );
            }
          }}
          title={t("decline")}
        >
          {t("decline")}
        </button>
      </div>
    </Card>
  );
};

export default withTranslation()(RequestApprovalcard);
