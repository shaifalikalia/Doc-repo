import React from "react";
import { withTranslation } from "react-i18next";
import { Card } from "reactstrap";
import Page from "components/Page";
import Text from "components/Text";
import TimesheetTaskCard from "./TimesheetTaskCard";
import useQueryParam from "hooks/useQueryParam";
import useHandleApiError from "hooks/useHandleApiError";
import { useOfficeDetail } from "repositories/office-repository";
import { useAdvancedTimesheetDetails } from "repositories/timesheet-repository";
import { convertTimeMinuteToHour, decodeId, encodeId } from "utils";
import moment from "moment/moment";
import Loader from "components/Loader";
import constants from "../../../../constants";
import styles from "./../StaffListingTimesheet.module.scss";
import "./../StaffListingTimesheet.scss";

const TimesheetDateDetail = ({ t, history }) => {
  const advanceTimesheetType = useQueryParam("timesheetId", null);
  const timesheetId = useQueryParam("advanceTimesheetType", null);
  let officeId = useQueryParam("officeId", null);
  let userId = useQueryParam("userId", null);

  officeId = decodeId(officeId);
  userId = decodeId(userId);
  const timesheetType = constants.TimesheetType;
  const timesheetListingStatus = constants.TimesheetListingStatus;

  const onBack = () => {
    history.push(
      constants.routes.staff.timesheetDetail
        .replace(":officeId", encodeId(officeId))
        .replace(":userId", encodeId(userId))
    );
  };

  const { data: officeDetail } = useOfficeDetail(officeId);
  const {
    data: timesheetAdvanceDetails,
    error: isError,
    isLoading,
    isFetching,
  } = useAdvancedTimesheetDetails(advanceTimesheetType, timesheetId);

  useHandleApiError(isLoading, isFetching, isError);

  const renderHeader = () => (
    <>
      {officeDetail && officeDetail.name && (
        <h2 className="page-title mt-3 date-page-title">{officeDetail.name}</h2>
      )}
      {timesheetAdvanceDetails && timesheetAdvanceDetails?.staffName && (
        <h5 className={styles["sub-head"] + " " + styles["date-head"]}>
          {t("staffTimesheet.timesheetsDetailFor") +
            timesheetAdvanceDetails.staffName}
        </h5>
      )}
    </>
  );

  const handleTimesheetType = () => (
    <>
      {timesheetAdvanceDetails &&
        timesheetAdvanceDetails.advanceTimesheetType === timesheetType.AllDay &&
        timesheetAdvanceDetails.isTypeAdvance && (
          <span>{t("staff.allDay")}</span>
        )}
      {timesheetAdvanceDetails &&
        timesheetAdvanceDetails.advanceTimesheetType === timesheetType.Hourly &&
        timesheetAdvanceDetails.isTypeAdvance && (
          <span>{t("staff.hourly")}</span>
        )}
      {timesheetAdvanceDetails && !timesheetAdvanceDetails.isTypeAdvance && (
        <span>{t("accountOwner.basic")}</span>
      )}
    </>
  );

  const handleTimesheetAdvanceDetailsStatus = () => (
    <>
      {timesheetAdvanceDetails &&
        timesheetAdvanceDetails.statusId ===
          timesheetListingStatus[1]?.value && (
          <span>{t("staffTimesheet.pendingForApproval")}</span>
        )}
      {timesheetAdvanceDetails &&
        timesheetAdvanceDetails.statusId ===
          timesheetListingStatus[2]?.value && (
          <span>{t("staffTimesheet.approved")}</span>
        )}
      {timesheetAdvanceDetails &&
        timesheetAdvanceDetails.statusId ===
          timesheetListingStatus[3]?.value && <span>{t("rejected")}</span>}
      {timesheetAdvanceDetails &&
        timesheetAdvanceDetails.statusId ===
          timesheetListingStatus[4]?.value && (
          <span>{t("staffTimesheet.paid")}</span>
        )}
    </>
  );

  const renderConsolidatedData = () => (
    <Card
      className={styles["timesheet-detail-card"]}
      shadow="0 0 15px 0 rgba(0, 0, 0, 0.08)"
      cursor="default"
    >
      <div
        className={
          styles["left-side-card"] + " " + styles["left-side-date-card"]
        }
      >
        <Text size="12px" marginBottom="10px" weight="400" color="#CAD3C0">
          {t("staffTimesheet.date")}
        </Text>
        <div className={styles["total-hours"]}>
          <Text size="20px" marginBottom="0px" weight="500" color="#FFFFFF">
            {timesheetAdvanceDetails &&
              timesheetAdvanceDetails.timeSheetDate &&
              moment(timesheetAdvanceDetails.timeSheetDate).format("LL")}
          </Text>
        </div>
      </div>
      <div
        className={
          styles["right-side-card"] + " " + styles["right-side-date-card"]
        }
      >
        <div>
          <Text size="12px" marginBottom="10px" weight="400" color="#CAD3C0">
            {t("staffTimesheet.startTime")}
          </Text>
          <Text size="16px" marginBottom="0px" weight="600" color="#FFFFFF">
            {timesheetAdvanceDetails && timesheetAdvanceDetails.startTime
              ? moment(timesheetAdvanceDetails.startTime).format("LT")
              : "--"}
          </Text>
        </div>
        <div>
          <Text size="12px" marginBottom="10px" weight="400" color="#CAD3C0">
            {t("staffTimesheet.breakDuration")}
          </Text>
          <Text size="16px" marginBottom="0px" weight="600" color="#FFFFFF">
            {timesheetAdvanceDetails &&
            timesheetAdvanceDetails.breakDurationInMins
              ? `${convertTimeMinuteToHour(
                  timesheetAdvanceDetails.breakDurationInMins
                )} Hrs`
              : "--"}
          </Text>
        </div>
        <div>
          <Text size="12px" marginBottom="10px" weight="400" color="#CAD3C0">
            {t("staffTimesheet.finishTime")}
          </Text>
          <Text size="16px" marginBottom="0px" weight="600" color="#FFFFFF">
            {timesheetAdvanceDetails && timesheetAdvanceDetails.endTime
              ? moment(timesheetAdvanceDetails.endTime).format("LT")
              : "--"}
          </Text>
        </div>
        <div>
          <Text size="12px" marginBottom="10px" weight="400" color="#CAD3C0">
            {t("staffTimesheet.hourlyRate")}
          </Text>
          <Text size="16px" marginBottom="0px" weight="600" color="#FFFFFF">
            {timesheetAdvanceDetails && timesheetAdvanceDetails.hourlyRate
              ? `CAD ${timesheetAdvanceDetails.hourlyRate}`
              : "--"}
          </Text>
        </div>
        <div>
          <Text size="12px" marginBottom="10px" weight="400" color="#CAD3C0">
            {t("staffTimesheet.totalHours")}
          </Text>
          <Text size="16px" marginBottom="0px" weight="600" color="#FFFFFF">
            {timesheetAdvanceDetails?.totalHoursInMins
              ? `${convertTimeMinuteToHour(
                  timesheetAdvanceDetails?.totalHoursInMins
                )} Hrs`
              : "--"}
          </Text>
        </div>
        <div>
          <Text size="12px" marginBottom="10px" weight="400" color="#CAD3C0">
            {t("staffTimesheet.totalAmount")}
          </Text>
          <Text size="16px" marginBottom="0px" weight="600" color="#FFFFFF">
            {timesheetAdvanceDetails?.totalAmountForPayment
              ? `CAD ${timesheetAdvanceDetails?.totalAmountForPayment.toFixed(
                  2
                )}`
              : "--"}
          </Text>
        </div>
        <div>
          <Text size="12px" marginBottom="10px" weight="400" color="#CAD3C0">
            {t("staffTimesheet.timesheetType")}
          </Text>
          <Text size="16px" marginBottom="0px" weight="600" color="#FFFFFF">
            {handleTimesheetType()}
          </Text>
        </div>
        <div>
          <Text size="12px" marginBottom="10px" weight="400" color="#CAD3C0">
            {t("staffTimesheet.status")}
          </Text>
          <Text size="16px" marginBottom="0px" weight="600" color="#FFFFFF">
            {handleTimesheetAdvanceDetailsStatus()}
          </Text>
        </div>
      </div>
      <div className="clearfix"></div>
    </Card>
  );

  const handleAdvanceDetailListing = () => (
    <>
      {timesheetAdvanceDetails &&
        timesheetAdvanceDetails.isTypeAdvance &&
        timesheetAdvanceDetails?.timesheetTasks?.length > 0 &&
        timesheetAdvanceDetails?.timesheetTasks.map((detail, index) => (
          <TimesheetTaskCard details={detail} index={index} />
        ))}
    </>
  );

  return (
    <>
      <Page
        className={"staff-listing-timesheet " + styles["timesheet-page"]}
        onBack={onBack}
      >
        {isLoading && <Loader />}
        {renderHeader()}
        {renderConsolidatedData()}
        {handleAdvanceDetailListing()}
      </Page>
    </>
  );
};

export default withTranslation()(TimesheetDateDetail);
