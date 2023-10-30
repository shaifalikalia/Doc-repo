import React, { useState, useEffect, useRef } from "react";
import moment from "moment";
import TimePicker from "rc-time-picker";
import "rc-time-picker/assets/index.css";
import { Form as ReactstrapForm, FormGroup, Button } from "reactstrap";
import styles from "./Timesheet.module.scss";
import { constructMomentFromTime } from "utils";
import {
  useAddTimesheetMutation,
  useUpdateTimesheetMutation,
  getTimesheetTaskList,
  useEditRequestMutation,
  getTimesheetBreak,
  startStopTimesheetBreak,
} from "repositories/timesheet-repository";
import toast from "react-hot-toast";
import Text from "components/Text";
import AdvancedOptions from "./components/AdvancedOptions";
import Loader from "components/Loader";
import ConfirmModal from "./components/ConfirmModal";
import clockIn from "./../../../assets/images/clock-in-icon.svg";
import clockOut from "./../../../assets/images/clock-out-icon.svg";
import breakStart from "./../../../assets/images/break-start-icon.svg";
import ConfirmSaveDraftModal from "./components/ConfirmSaveDraftModal";
import RequestModal from "./components/RequestModal";
import { useCheckTimesheetRequest } from "repositories/timesheet-repository";

function CockInClockOutForm({
  userId,
  officeId,
  viewOnly,
  selectedDate,
  selectedDay,
  IP,
  t,
}) {
  let sameDay = moment().isSame(selectedDate, "d");
  if (selectedDay.timesheetStatus && selectedDay.timesheetStatus > 1) {
    sameDay = false;
  }
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [breakDuration, setBreakDuration] = useState(null);
  const [totalBreakDuration, setTotalBreakDuration] = useState(0);
  const [startBreakTime, setStartBreakTime] = useState(false);
  const [OpenconfirmModal, setOpenConfirmModal] = useState(false);
  const [loader, setLoader] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [advanceTimeSheetData, setAdvanceTimeSheetData] = useState({
    IsTypeAdvance: false,
    AdvanceTimesheetType: 1,
    TimesheetTasks: [],
  });
  const [previousTSData, setPreviousTSData] = useState({});
  const [statusRadio, setStatusRadio] = useState(0); // 0: no show, 1: show yes, 2: show no.
  const [issaveDraftModalOpen, setIsSaveDraftModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const stateRef = useRef();
  const stateRef2 = useRef();
  stateRef.current = startTime;
  stateRef2.current = endTime;

  const { isLoading, data: timesheetData } = useCheckTimesheetRequest(
    moment(selectedDate).format("YYYY-MM-DD"),
    officeId
  );
  let approvalStatus = false;
  if (!isLoading && timesheetData) {
    approvalStatus = timesheetData.isRequestApproved;
  }
  useEffect(() => {
    setStatusRadio(0);
    setPreviousTSData({});
    setAdvanceTimeSheetData({
      IsTypeAdvance: false,
      AdvanceTimesheetType: 1,
      TimesheetTasks: [],
    });
    if (selectedDay.timesheetStatus) {
      setStartTime(
        selectedDay.timesheetStartTime
          ? moment(selectedDay.timesheetStartTime, [moment.ISO_8601, "hh:mm A"])
          : null
      );
      setEndTime(
        selectedDay.timesheetEndTime
          ? moment(selectedDay.timesheetEndTime, [moment.ISO_8601, "hh:mm A"])
          : null
      );
      setBreakDuration(
        selectedDay.timesheetBreakDuration
          ? constructMomentFromTime(
              selectedDay.timesheetBreakDuration / 60,
              selectedDay.timesheetBreakDuration % 60
            )
          : constructMomentFromTime(0, 0)
      );
      if (selectedDay.timesheetId && selectedDay.timesheetisAdvance) {
        setLoader(true);
        getAdvanceSetting(selectedDay, selectedDay.timesheetType);
      }
    } else {
      setStartTime(null);
      setEndTime(null);
      setBreakDuration(constructMomentFromTime(0, 0));
    }
  }, [selectedDay]);

  useEffect(() => {
    if (
      selectedDay.timesheetId &&
      selectedDay.timesheetisAdvance &&
      statusRadio
    ) {
      setLoader(true);
      getAdvanceSetting(selectedDay, statusRadio);
    }
    // eslint-disable-next-line
  }, [statusRadio]);

  useEffect(() => {
    if (selectedDay.timesheetId && sameDay) {
      setLoader(true);
      getBreakTime(selectedDay.timesheetId);
    }
    // eslint-disable-next-line
  }, [selectedDate]);

  useEffect(() => {
    if (errorMessage) {
      setErrorMessage("");
    }
    // eslint-disable-next-line
  }, [selectedDay, startTime, endTime, breakDuration]);

  const addTimesheetMutation = useAddTimesheetMutation();
  const updateTimesheetMutation = useUpdateTimesheetMutation();
  const editRequestMutation = useEditRequestMutation();

  const getAdvanceSetting = async (data, type) => {
    try {
      const resp = await getTimesheetTaskList(data.timesheetId, type);
      if (resp) {
        let prevData = resp.length
          ? resp.map((v, i) => {
              resp[i]["taskOrder"] = i + 1;
              return resp[i];
            })
          : resp;
        setPreviousTSData(prevData);
        setAdvanceTimeSheetData({
          IsTypeAdvance: data.timesheetisAdvance,
          AdvanceTimesheetType: type,
          TimesheetTasks: prevData,
        });
      }
      setLoader(false);
    } catch (e) {
      setLoader(false);
    }
  };

  const getBreakTime = async (timesheetId) => {
    try {
      const resp = await getTimesheetBreak(timesheetId);
      if (resp) {
        setStartBreakTime(resp.breakStatus === 1);
        setTotalBreakDuration(
          resp.totalBreakDurationInMinute ? resp.totalBreakDurationInMinute : 0
        );
      }
      setLoader(false);
    } catch (e) {
      setLoader(false);
    }
  };

  const onSubmit = async () => {
    const { breakDurationInMinutes, totalTimeSpentInMinute } =
      constructTimeAndDurations();

    if (endTime.diff(startTime) < 1) {
      setErrorMessage(t("staff.timesheetStartTimeShouldBeLessThanFinishTime"));
      return;
    }

    if (breakDurationInMinutes > totalTimeSpentInMinute) {
      setErrorMessage(t("staff.timesheetTimeShouldBeGreaterThanBreakTime"));
      return;
    }
    setOpenConfirmModal(true);
  };

  const onSave = async () => {
    if (shouldSaveButtonDisable()) return;
    const {
      startDateTime,
      endDateTime,
      breakDurationInMinutes,
      timeSpentInMinutes,
    } = constructTimeAndDurations();
    setIsSaveDraftModalOpen(false);

    if (selectedDay.timesheetId) {
      await updateTimesheet(
        selectedDay.timesheetId,
        1,
        startDateTime,
        endDateTime,
        timeSpentInMinutes,
        breakDurationInMinutes,
        t("staff.timesheetDraftUpdated")
      );
    } else {
      await addTimesheet(
        1,
        startDateTime,
        endDateTime,
        timeSpentInMinutes,
        breakDurationInMinutes,
        t("staff.timesheetDrafted")
      );
    }
  };

  const constructTimeAndDurations = () => {
    let startDateTime = null;
    let endDateTime = null;
    let breakDurationInMinutes =
      breakDuration !== null
        ? breakDuration.hours() * 60 + breakDuration.minutes()
        : 0;

    let timeSpentInMinutes = 0;
    let totalTimeSpentInMinute = 0;

    if (sameDay) {
      breakDurationInMinutes = totalBreakDuration;
      startDateTime =
        stateRef.current !== null
          ? moment(stateRef.current).format("YYYY-MM-DDTHH:mm")
          : null;
      endDateTime =
        stateRef2.current !== null
          ? moment(stateRef2.current).format("YYYY-MM-DDTHH:mm")
          : null;
      if (stateRef.current !== null && stateRef2.current !== null) {
        const duration = moment.duration(
          moment(stateRef2.current).diff(moment(stateRef.current))
        );
        timeSpentInMinutes =
          parseInt(duration.asMinutes()) - totalBreakDuration;
        totalTimeSpentInMinute = parseInt(duration.asMinutes()); // removed check to total work time spent to total time
      }
    } else {
      startDateTime =
        startTime !== null ? startTime.format("YYYY-MM-DDTHH:mm") : null;
      endDateTime =
        endTime !== null ? endTime.format("YYYY-MM-DDTHH:mm") : null;
      if (startTime !== null && endTime !== null) {
        const duration = moment.duration(endTime.diff(startTime));
        timeSpentInMinutes =
          parseInt(duration.asMinutes()) - breakDurationInMinutes;
        totalTimeSpentInMinute = parseInt(duration.asMinutes()); // removed check to total work time spent to total time
      }
    }

    return {
      startDateTime,
      endDateTime,
      breakDurationInMinutes,
      timeSpentInMinutes,
      totalTimeSpentInMinute,
    };
  };

  const addTimesheet = async (
    status,
    startDateTime,
    endDateTime,
    timeSpentInMinutes,
    breakDurationInMinutes,
    successMessage
  ) => {
    try {
      await addTimesheetMutation.mutateAsync({
        userId,
        officeId,
        statusId: status,
        date: moment(selectedDate).format("YYYY-MM-DDTHH:mm"),
        startDateTime,
        endDateTime,
        timeSpentInMinutes,
        breakDurationInMinutes,
        ip: IP,
        IsTypeAdvance: advanceTimeSheetData.IsTypeAdvance,
        AdvanceTimesheetType: advanceTimeSheetData.AdvanceTimesheetType,
        TimesheetTasks: advanceTimeSheetData.TimesheetTasks,
        currentDate: moment().format("YYYY-MM-DDTHH:mm"),
      });
      toast.success(successMessage);
    } catch (e) {
      toast.error(e.message);
    }
  };

  const updateTimesheet = async (
    timesheetId,
    status,
    startDateTime,
    endDateTime,
    timeSpentInMinutes,
    breakDurationInMinutes,
    successMessage
  ) => {
    try {
      await updateTimesheetMutation.mutateAsync({
        timesheetId,
        userId,
        officeId,
        statusId: status,
        date: moment(selectedDate).format("YYYY-MM-DDTHH:mm"),
        startDateTime,
        endDateTime,
        timeSpentInMinutes,
        breakDurationInMinutes,
        ip: IP,
        IsTypeAdvance: advanceTimeSheetData.IsTypeAdvance,
        AdvanceTimesheetType: advanceTimeSheetData.AdvanceTimesheetType,
        TimesheetTasks: advanceTimeSheetData.TimesheetTasks,
        currentDate: moment().format("YYYY-MM-DDTHH:mm"),
      });
      toast.success(successMessage);

      if (
        selectedDay.timesheetId &&
        selectedDay.timesheetisAdvance &&
        statusRadio
      ) {
        setLoader(true);
        getAdvanceSetting(selectedDay, statusRadio);
      }
    } catch (e) {
      toast.error(e.message);
    }
  };
  const checkAdvanceTimeSheet = () => {
    let isNotValid = false;
    if (
      advanceTimeSheetData.IsTypeAdvance &&
      advanceTimeSheetData.TimesheetTasks &&
      advanceTimeSheetData.TimesheetTasks.length &&
      advanceTimeSheetData.AdvanceTimesheetType === 2
    ) {
      isNotValid = advanceTimeSheetData.TimesheetTasks.some(
        (v) => !v.startTime || !v.endTime
      );
    }
    return isNotValid;
  };
  const shouldSubmitButtonDisable = () =>
    loader ||
    viewOnly ||
    startBreakTime ||
    startTime === null ||
    endTime === null ||
    addTimesheetMutation.isLoading ||
    updateTimesheetMutation.isLoading ||
    selectedDay.timesheetStatus == 5 ||
    checkAdvanceTimeSheet() ||
    (selectedDay.timesheetStatus > 1 && !approvalStatus) ||
    (!sameDay && !approvalStatus);

  const shouldSaveButtonDisable = () =>
    loader ||
    viewOnly ||
    stateRef.current === null ||
    addTimesheetMutation.isLoading ||
    updateTimesheetMutation.isLoading ||
    selectedDay.timesheetStatus > 1 ||
    (!sameDay && !approvalStatus);
  const confirmSubmit = () => {
    const {
      startDateTime,
      endDateTime,
      breakDurationInMinutes,
      timeSpentInMinutes,
    } = constructTimeAndDurations();
    if (selectedDay.timesheetId) {
      updateTimesheet(
        selectedDay.timesheetId,
        2,
        startDateTime,
        endDateTime,
        timeSpentInMinutes,
        breakDurationInMinutes,
        t("staff.timesheetUpdated")
      );
    } else {
      addTimesheet(
        2,
        startDateTime,
        endDateTime,
        timeSpentInMinutes,
        breakDurationInMinutes,
        t("staff.timesheetSubmitted")
      );
    }
    setOpenConfirmModal(false);
  };

  const checkInTime = () => {
    if (viewOnly || startTime || !sameDay || endTime) return;
    setStartTime(moment());
    setTimeout(() => {
      onSave();
    });
  };

  const startStopBreak = async () => {
    if (viewOnly || !selectedDay.timesheetId || !sameDay || endTime) return;
    setLoader(true);
    const timeZoneOffset = new Date().getTimezoneOffset();
    try {
      const resp = await startStopTimesheetBreak(
        selectedDay.timesheetId,
        !startBreakTime,
        timeZoneOffset
      );
      if (resp) {
        setStartBreakTime(!startBreakTime);
        setTotalBreakDuration(resp.totalBreakDurationInMinute);
      }
      setLoader(false);
    } catch (e) {
      setLoader(false);
    }
  };

  const checkOutTime = () => {
    const duration = moment
      .duration(moment().diff(moment(stateRef.current)))
      .asMinutes();

    if (parseInt(duration) < 2) {
      setErrorMessage(t("staff.timesheetStartTimeShouldBeLessThanFinishTime"));
      return;
    }
    // const timeSpentInMinutes = parseInt(duration) - totalBreakDuration;
    const timeSpentInMinutes = parseInt(duration); // removed check to total work time spent to total time
    if (totalBreakDuration > timeSpentInMinutes) {
      setErrorMessage(t("staff.timesheetTimeShouldBeGreaterThanBreakTime"));
      return;
    }
    if (viewOnly || startBreakTime || !startTime || !sameDay || endTime) return;
    setEndTime(moment());
    setTimeout(() => {
      onSave();
    });
  };

  const formatMinutesToHour = (value) => {
    const hours = Math.floor(value / 60);
    const minutes = value % 60;
    return hours + " hr " + minutes + " min";
  };

  const sendUpdateRequest = async (reason) => {
    setIsRequestModalOpen(false);
    try {
      await editRequestMutation.mutateAsync({
        timesheetRequestDate: moment(selectedDate).format("YYYY-MM-DD"),
        userId,
        officeId,
        reason,
      });
      toast.success(t("staff.timesheetRequestSent"));
    } catch (e) {
      toast.error(e.message);
    }
  };

  const cancelSave = () => {
    setIsSaveDraftModalOpen(false);
  };

  const shouldBreakButtonDisable = () =>
    viewOnly ||
    loader ||
    addTimesheetMutation.isLoading ||
    updateTimesheetMutation.isLoading ||
    ((!startTime || endTime) && sameDay) ||
    (!sameDay && !approvalStatus) ||
    (selectedDay.timesheetStatus > 1 && !approvalStatus);
  return (
    <div className="d-block mt-4">
      {loader && <Loader />}

      <ReactstrapForm className={styles["timesheet-form"]}>
        <ul className={styles["clock-list-timesheet"]}>
          <li>
            <div
              className={`${styles["btn-box"]} ${
                ((startTime || endTime) && sameDay) ||
                (!sameDay && !approvalStatus) ||
                viewOnly ||
                (selectedDay.timesheetStatus > 1 && !approvalStatus)
                  ? styles["disabled"]
                  : ""
              } `}
              onClick={() => checkInTime()}
            >
              <img src={clockIn} alt="clock-in" />
              {t("staff.clockIn")}
            </div>
            {sameDay ? (
              <div className={styles["text-box"]}>
                {" "}
                {startTime ? moment(startTime).format("hh:mm A") : "--"}{" "}
              </div>
            ) : (
              <div>
                <TimePicker
                  showSecond={false}
                  placeholder="--"
                  format="h:mm A"
                  value={startTime}
                  onChange={setStartTime}
                  use12Hours
                  popupClassName={styles["time-picker-popup"]}
                  className={styles["time-picker"]}
                  disabled={
                    selectedDay.timesheetStatus === 5 ||
                    viewOnly ||
                    !approvalStatus
                  }
                />
              </div>
            )}
          </li>
          <li>
            <div
              className={`${styles["btn-box"]} ${styles["btn-break"]}  ${
                shouldBreakButtonDisable() ? styles["disabled"] : ""
              }`}
              onClick={() => startStopBreak()}
            >
              <img src={breakStart} alt="break-start" />
              {startBreakTime
                ? t("staff.breakEnd")
                : endTime || !sameDay
                ? t("staff.breakDuration")
                : t("staff.breakStart")}
            </div>
            {sameDay ? (
              <div className={styles["text-box"]}>
                {totalBreakDuration
                  ? formatMinutesToHour(totalBreakDuration)
                  : "--"}{" "}
              </div>
            ) : (
              <div>
                <TimePicker
                  showSecond={false}
                  placeholder="--"
                  format="HH [hr] mm [min]"
                  value={breakDuration}
                  onChange={setBreakDuration}
                  disabledHours={() =>
                    new Array(16).fill(0).map((v, i) => i + 9)
                  }
                  hideDisabledOptions={true}
                  popupClassName={styles["time-picker-popup"]}
                  className={styles["time-picker"]}
                  disabled={
                    selectedDay.timesheetStatus === 5 ||
                    viewOnly ||
                    !approvalStatus
                  }
                />
              </div>
            )}
          </li>
          <li>
            <div
              className={`${styles["btn-box"]} ${styles["btn-clickout"]}  ${
                ((!startTime || startBreakTime || endTime) && sameDay) ||
                (!sameDay && !approvalStatus) ||
                (selectedDay.timesheetStatus > 1 && !approvalStatus)
                  ? styles["disabled"]
                  : ""
              }`}
              onClick={() => checkOutTime()}
            >
              <img src={clockOut} alt="clock-out" />
              {t("staff.clockOut")}
            </div>
            {sameDay ? (
              <div className={styles["text-box"]}>
                {" "}
                {endTime ? moment(endTime).format("hh:mm A") : "--"}{" "}
              </div>
            ) : (
              <div>
                <TimePicker
                  showSecond={false}
                  placeholder="--"
                  format="h:mm A"
                  value={endTime}
                  onChange={setEndTime}
                  use12Hours
                  popupClassName={styles["time-picker-popup"]}
                  className={styles["time-picker"]}
                  disabled={
                    selectedDay.timesheetStatus === 5 ||
                    viewOnly ||
                    !approvalStatus
                  }
                />
              </div>
            )}
          </li>
        </ul>

        {errorMessage && (
          <Text color="#ff002d" size="12px">
            {errorMessage}
          </Text>
        )}
        <AdvancedOptions
          selectedDay={selectedDay}
          officeId={officeId}
          setAdvanceTimeSheetData={setAdvanceTimeSheetData}
          previousTSData={previousTSData}
          statusRadio={statusRadio}
          setStatusRadio={setStatusRadio}
          startTime={startTime}
          endTime={endTime}
          disableOptions={
            (!sameDay && !approvalStatus) ||
            (selectedDay.timesheetStatus > 1 && !approvalStatus)
          }
        />

        <FormGroup className="mt-4">
          <Button
            color="outline-secondary"
            className={`mr-md-4 button ${styles.btn}`}
            disabled={
              approvalStatus !== null ||
              sameDay ||
              selectedDay.timesheetStatus === 5
            }
            onClick={() => {
              setIsRequestModalOpen(true);
            }}
          >
            {t("staff.requestUpdate")}
          </Button>
          <Button
            color="primary"
            className={`mr-md-4 button ${styles.btn}`}
            disabled={shouldSubmitButtonDisable()}
            onClick={onSubmit}
          >
            {[2, 3, 4].includes(selectedDay.timesheetStatus)
              ? t("staff.editTimesheet")
              : t("staff.submitTimesheet")}
          </Button>
          {selectedDay.timesheetStatus <= 1 && (
            <div
              className={`${styles["link-btn-box"]}  ${
                shouldSaveButtonDisable() ? styles["disabled"] : ""
              }`}
            >
              <span
                disabled={shouldSaveButtonDisable()}
                onClick={() =>
                  !shouldSaveButtonDisable() && setIsSaveDraftModalOpen(true)
                }
                className={"link-btn " + styles["link-btn-font"]}
              >
                {t("staff.saveDraft")}{" "}
              </span>
            </div>
          )}
        </FormGroup>
      </ReactstrapForm>
      {OpenconfirmModal && (
        <ConfirmModal
          timesheetStatus={selectedDay.timesheetStatus}
          isModalOpen={OpenconfirmModal}
          closeModal={() => setOpenConfirmModal(false)}
          confirmSubmit={() => confirmSubmit()}
        />
      )}
      {issaveDraftModalOpen && (
        <ConfirmSaveDraftModal
          isModalOpen={issaveDraftModalOpen}
          closeModal={() => setIsSaveDraftModalOpen(false)}
          confirmSave={() => onSave()}
          cancelSave={() => cancelSave()}
        />
      )}
      {isRequestModalOpen && (
        <RequestModal
          isModalOpen={isRequestModalOpen}
          closeModal={() => setIsRequestModalOpen(false)}
          confirmSend={sendUpdateRequest}
        />
      )}
    </div>
  );
}

export default CockInClockOutForm;
