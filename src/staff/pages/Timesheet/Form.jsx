import React, { useState, useEffect } from "react";
import moment from "moment";
import TimePicker from "rc-time-picker";
import "rc-time-picker/assets/index.css";
import {
  Col,
  Form as ReactstrapForm,
  FormGroup,
  Label,
  Row,
  Button,
} from "reactstrap";
import styles from "./Timesheet.module.scss";
import { constructMomentFromTime } from "utils";
import {
  useAddTimesheetMutation,
  useUpdateTimesheetMutation,
  getTimesheetTaskList,
} from "repositories/timesheet-repository";
import toast from "react-hot-toast";
import Text from "components/Text";
import AdvancedOptions from "./components/AdvancedOptions";
import Loader from "components/Loader";
import ConfirmModal from "./components/ConfirmModal";
function Form({
  userId,
  officeId,
  viewOnly,
  selectedDate,
  selectedDay,
  IP,
  t,
}) {
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [breakDuration, setBreakDuration] = useState(null);
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
    if (errorMessage) {
      setErrorMessage("");
    }
    // eslint-disable-next-line
  }, [selectedDay, startTime, endTime, breakDuration]);

  const addTimesheetMutation = useAddTimesheetMutation();
  const updateTimesheetMutation = useUpdateTimesheetMutation();

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
    const {
      startDateTime,
      endDateTime,
      breakDurationInMinutes,
      timeSpentInMinutes,
    } = constructTimeAndDurations();
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
    const startDateTime =
      startTime !== null ? startTime.format("YYYY-MM-DDTHH:mm") : null;
    const endDateTime =
      endTime !== null ? endTime.format("YYYY-MM-DDTHH:mm") : null;
    const breakDurationInMinutes =
      breakDuration !== null
        ? breakDuration.hours() * 60 + breakDuration.minutes()
        : 0;
    let timeSpentInMinutes = 0;
    let totalTimeSpentInMinute = 0;
    if (startTime !== null && endTime !== null) {
      const duration = moment.duration(endTime.diff(startTime));
      timeSpentInMinutes =
        parseInt(duration.asMinutes()) - breakDurationInMinutes;
      totalTimeSpentInMinute = parseInt(duration.asMinutes());
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
    viewOnly ||
    startTime === null ||
    endTime === null ||
    addTimesheetMutation.isLoading ||
    updateTimesheetMutation.isLoading ||
    selectedDay.timesheetStatus == 5 ||
    checkAdvanceTimeSheet();

  const shouldSaveButtonDisable = () =>
    viewOnly ||
    (startTime === null && endTime === null) ||
    addTimesheetMutation.isLoading ||
    updateTimesheetMutation.isLoading ||
    selectedDay.timesheetStatus > 1;
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
  return (
    <div className="d-block mt-4">
      {loader && <Loader />}

      <ReactstrapForm className={styles["timesheet-form"]}>
        <Row className="gutters-10">
          <Col md="4">
            <FormGroup>
              <Label for="startTime">{t("staff.startTime")}</Label>
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
                  disabled={selectedDay.timesheetStatus === 5 || viewOnly}
                />
              </div>
            </FormGroup>
          </Col>

          <Col md="4">
            <FormGroup>
              <Label for="breakDuration">{t("staff.breakDuration")} </Label>
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
                  disabled={selectedDay.timesheetStatus === 5 || viewOnly}
                />
              </div>
            </FormGroup>
          </Col>

          <Col md="4">
            <FormGroup>
              <Label for="finishTime">{t("staff.finishTime")} </Label>
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
                  disabled={selectedDay.timesheetStatus === 5 || viewOnly}
                />
              </div>
            </FormGroup>
          </Col>
        </Row>
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
        />
        <FormGroup className="mt-4">
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
            <Button
              color="outline-secondary"
              className={`${styles.btn} ${styles["btn-outline-secondary"]}`}
              disabled={shouldSaveButtonDisable()}
              onClick={onSave}
            >
              {t("staff.saveTimesheet")}
            </Button>
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
    </div>
  );
}

export default Form;
