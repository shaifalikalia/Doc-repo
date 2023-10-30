import React, { useState } from "react";
import Text from "components/Text";
import { getTimesheetStatusById } from "./../../../constants";
import Form from "./Form";
import ClockInClockOutForm from "./CockInClockOutForm";
import styles from "./Timesheet.module.scss";
import { formatDate } from "utils";
import { AnimatePresence, motion } from "framer-motion";
import { Modal } from "reactstrap";
import ModalBody from "reactstrap/lib/ModalBody";
import crossIcon from "./../../../assets/images/cross.svg";
import alertIcon from "./../../../assets/images/ico-alert.svg";
import { useLocation } from "react-router";

export default function DetailView({
  userId,
  officeId,
  viewOnly,
  viewOnlyReason,
  selectedDate,
  selectedDay,
  IP,
  t,
  officeDetail,
}) {
  const location = useLocation();
  let isClockInOutOn = false;
  if (location.state && location.state.officeData) {
    isClockInOutOn = location.state.officeData.isClockInOutOn;
  }
  if (officeDetail && officeDetail.isClockInOutOn) {
    isClockInOutOn = officeDetail.isClockInOutOn;
  }
  const [isRejectionReasonModalOpen, setIsRejectionReasonModalOpen] =
    useState(false);

  const shouldRenderForm = () =>
    selectedDay !== null &&
    selectedDay.type !== "holiday" &&
    !selectedDay.isFutureDate;
  const shouldRenderTimesheetStatus = () =>
    shouldRenderForm() &&
    (selectedDay.isWorking ||
      (!selectedDay.isWorking && selectedDay.timesheetId));
  const shouldRenderNonWorkingDayText = () =>
    shouldRenderForm() && !selectedDay.isWorking && !selectedDay.timesheetId;
  const shouldRenderReasonLabel = () =>
    shouldRenderForm() && selectedDay.timesheetStatus === 4;
  const shouldRenderHolidayView = () =>
    selectedDay !== null && selectedDay.type === "holiday";
  const shouldRenderFutureDateView = () =>
    selectedDay !== null &&
    selectedDay.type !== "holiday" &&
    selectedDay.isFutureDate;
  const shouldRenderRejectionReasonModal = () =>
    selectedDay !== null && selectedDay.timesheetRejectionReason;

  return (
    <div className={styles["timesheet-box"]}>
      <div className={styles["date-status-box"]}>
        <div className={styles["date-box"]}>
          {formatDate(selectedDate, "MMMM D, YYYY")}
        </div>

        <AnimatePresence>
          {shouldRenderTimesheetStatus() && (
            <motion.div
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              exit={{ opacity: 0 }}
            >
              <TimesheetStatus selectedDay={selectedDay} />
            </motion.div>
          )}
        </AnimatePresence>

        {shouldRenderNonWorkingDayText() && (
          <Text
            size="12px"
            color="#79869a"
            className={styles["subtext-position"]}
          >
            {t("staff.thisIsANonWorkingDayForYou")}
          </Text>
        )}

        {shouldRenderReasonLabel() && (
          <Text
            size="12px"
            className={`${styles["subtext-position"]} ${styles["reason-label"]}`}
            onClick={() => setIsRejectionReasonModalOpen(true)}
          >
            {t("staff.seeReason")}
          </Text>
        )}
      </div>
      {shouldRenderForm() && viewOnlyReason && (
        <div className="d-flex align-items-start">
          <img
            src={alertIcon}
            className={"mr-1 " + styles["alert-icon"]}
            alt=""
          />
          <Text size="12px" color="#ff4550">
            {viewOnlyReason}
          </Text>
        </div>
      )}

      {shouldRenderForm() && (
        <motion.div animate={{ opacity: 1 }} initial={{ opacity: 0 }}>
          {!isClockInOutOn ? (
            <Form
              userId={userId}
              officeId={officeId}
              selectedDate={selectedDate}
              selectedDay={selectedDay}
              viewOnly={viewOnly}
              IP={IP}
              t={t}
            />
          ) : (
            <ClockInClockOutForm
              userId={userId}
              officeId={officeId}
              selectedDate={selectedDate}
              selectedDay={selectedDay}
              viewOnly={viewOnly}
              IP={IP}
              t={t}
            />
          )}
        </motion.div>
      )}

      {shouldRenderHolidayView() && (
        <motion.div animate={{ opacity: 1 }} initial={{ opacity: 0 }}>
          <div className={styles["applicable-box"]}>
            <h4>{selectedDay.holidayTitle}</h4>
            <p>{t("staff.timesheetHoliday")}</p>
          </div>
        </motion.div>
      )}

      {shouldRenderFutureDateView() && (
        <motion.div animate={{ opacity: 1 }} initial={{ opacity: 0 }}>
          <div className={styles["applicable-box"]}>
            <h4>{t("staff.timesheetNotApplicable")}</h4>
            <p>{t("staff.timesheetFutureDate")}</p>
          </div>
        </motion.div>
      )}

      {shouldRenderRejectionReasonModal() && (
        <Modal
          isOpen={isRejectionReasonModalOpen}
          toggle={() => setIsRejectionReasonModalOpen(false)}
          className="modal-dialog-centered"
          modalClassName="custom-modal"
        >
          <span
            className="close-btn"
            onClick={() => setIsRejectionReasonModalOpen(false)}
          >
            <img src={crossIcon} alt="close" />
          </span>
          <ModalBody>
            <Text size="14px" weight="700">
              {t("staff.reasonForRejection")}
            </Text>
            <Text>{selectedDay.timesheetRejectionReason}</Text>
          </ModalBody>
        </Modal>
      )}
    </div>
  );
}

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
