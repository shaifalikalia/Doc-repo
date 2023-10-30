import Page from "components/Page";
import React, { Fragment, useState, useEffect } from "react";
import moment from "moment/moment";
import { withTranslation } from "react-i18next";
import Card from "components/Card";
import styles from "./../Leaves.module.scss";
import { Col, Form, Row } from "reactstrap";
import Input from "components/Input";
import DatePicker from "react-datepicker";
import { useParams } from "react-router-dom";
import { useOfficeDetail } from "repositories/office-repository";
import {
  useLeaveCategoryCounts,
  applyLeave,
} from "repositories/leave-repository";
import { useTimesheet } from "repositories/timesheet-repository";
import useHandleApiError from "hooks/useHandleApiError";
import Loader from "components/Loader";
import BackupStaffModal from "./BackupStaffModal";
import TemporaryStaffModal from "./TemporaryStaffModal";
import { encodeId } from "utils";
import { cloneDeep } from "lodash";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import constants from "../../../../constants";

const initialState = {
  date: {
    from: new Date(),
    to: new Date(),
  },
  duration: 0,
  leaveType: 3,
  reason: "",
  backupUserId: null,
  backupName: null,
  backupContactNumber: null,
};

const ApplyLeaves = ({ t, history, match }) => {
  const profile = useSelector((state) => state?.userProfile?.profile);
  const { officeId } = useParams();
  const { data: officeDetail } = useOfficeDetail(officeId);

  const [errors, setErrors] = useState({});
  const [isBackupStaffModalOpen, setIsBackupStaffModalOpen] = useState(false);
  const [isTemporaryStaffModalOpen, setIsTemporaryStaffModalOpen] =
    useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [isAddBackupStaff, setIsAddBackupStaff] = useState(false);
  const [backupStaffRadio, setBackupStaffRadio] = useState(1);
  const [leaveTypeRadio, setLeaveTypeRadio] = useState(3);
  const [leaveTypeData, setLeaveTypeData] = useState({
    casual: {
      leaves: 0,
      remaining: 0,
      availed: 0,
    },
    medical: {
      leaves: 0,
      remaining: 0,
      availed: 0,
    },
    vacation: {
      leaves: 0,
      remaining: 0,
      availed: 0,
    },
  });

  const [formData, setFormData] = useState(initialState);

  let {
    date,
    duration,
    leaveType,
    reason,
    backupUserId,
    backupName,
    backupContactNumber,
  } = formData;
  const startDate = moment(date.from).format("YYYY-MM-DD");
  const endDate = moment(date.to).format("YYYY-MM-DD");

  const {
    data,
    error: isError,
    isLoading,
    isFetching,
  } = useLeaveCategoryCounts(officeId, profile?.id);
  const { data: timesheetData } = useTimesheet(
    profile.id,
    officeId,
    startDate,
    endDate
  );

  const leaveTypeList = data?.data;

  useHandleApiError(isLoading, isFetching, isError);

  // Get the current date
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Calculate the maximum date
  const maxDate = new Date(currentYear + 1, currentMonth, 1);

  const onBack = () => {
    history.push(
      constants.routes.staff.timesheet.replace(
        ":officeId",
        encodeId(match.params.officeId)
      )
    );
  };

  useEffect(() => {
    if (timesheetData?.working_days) {
      enumerateDaysBetweenDates(
        startDate,
        endDate,
        timesheetData?.working_days
      );
    }
  }, [timesheetData]);

  useEffect(() => {
    if (leaveTypeList) {
      const casualLeaveData = leaveTypeList.find((leave) => leave.typeId === 1);
      const medicalLeaveData = leaveTypeList.find(
        (leave) => leave.typeId === 2
      );
      const vacationLeaveData = leaveTypeList.find(
        (leave) => leave.typeId === 3
      );

      if (casualLeaveData) {
        casualLeaveData.remaining =
          casualLeaveData.leaves - casualLeaveData.availed;
        if (casualLeaveData.remaining < 0) casualLeaveData.remaining = 0;
      }

      if (medicalLeaveData) {
        medicalLeaveData.remaining =
          medicalLeaveData.leaves - medicalLeaveData.availed;
        if (medicalLeaveData.remaining < 0) medicalLeaveData.remaining = 0;
      }

      if (vacationLeaveData) {
        vacationLeaveData.remaining =
          vacationLeaveData.leaves - vacationLeaveData.availed;
        if (vacationLeaveData.remaining < 0) vacationLeaveData.remaining = 0;
      }

      setLeaveTypeData({
        casual: casualLeaveData,
        medical: medicalLeaveData,
        vacation: vacationLeaveData,
      });
    }
  }, [leaveTypeList]);

  const leaveRadioHandler = (isLeaveTypeValue) => {
    setLeaveTypeRadio(isLeaveTypeValue);
    setFormData({ ...formData, leaveType: isLeaveTypeValue });
  };

  const radioHandler = (backupStaffRadioValue) => {
    setBackupStaffRadio(backupStaffRadioValue);
  };

  const changeDate = (obj) => {
    if (obj.from && obj.from.getTime() > date.to.getTime()) {
      obj.to = obj.from;
    }

    setFormData((prev) => ({ ...prev, date: { ...prev.date, ...obj } }));
  };

  const enumerateDaysBetweenDates = function (
    fromDate,
    toDate,
    availableWeekDay
  ) {
    let dates = [];
    let currDate = new Date(fromDate);
    let lastDate = new Date(toDate);
    let diffrenceOfDays =
      Math.round(
        (lastDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1;

    for (let index = 0; index < diffrenceOfDays; index++) {
      currDate = moment(fromDate).add(index, "days");
      let weekDay = currDate.isoWeekday();

      if (weekDay === 8) weekDay = 1;

      if (availableWeekDay.includes(weekDay))
        dates.push(currDate.clone().toDate());
    }

    setFormData({ ...formData, duration: dates.length });
    handleDuration(dates.length);
  };

  const isValid = () => {
    const errorCopy = {};
    let isValidField = true;

    if (!reason?.trim()?.length) {
      errorCopy.reason = t("staffLeaves.reasonMsg");
      isValidField = false;
    }

    if (duration === 0) {
      errorCopy.duration = t("staffLeaves.duarationValidationMsg");
      toast.error(t("staffLeaves.duarationValidationMsg"));
      isValidField = false;
    }

    if (isAddBackupStaff && (!backupName || !backupContactNumber)) {
      toast.error(t("staffLeaves.backUpMemberAddMsg"));
      isValidField = false;
    }

    setErrors({ ...errorCopy });
    return isValidField;
  };

  const handleReason = (event) => {
    const errorCopy = cloneDeep(errors);
    const { name, value } = event.target;

    if (!value.trim()?.length) {
      errorCopy[name] = t("staffLeaves.reasonMsg");
    }

    if (value?.trim()?.length) {
      delete errorCopy[name];
    }

    setFormData((prevProps) => ({ ...prevProps, [name]: value }));
    setErrors(errorCopy);
  };

  const handleDuration = (durationValue) => {
    const errorCopy = cloneDeep(errors);

    if (durationValue === 0) {
      errorCopy.duration = t("staffLeaves.duarationValidationMsg");
    }

    if (durationValue > 0) {
      delete errorCopy.duration;
    }

    setFormData((prevProps) => ({ ...prevProps, duration: durationValue }));
    setErrors(errorCopy);
  };

  const applyLeaveForm = async (e) => {
    e.preventDefault();
    if (!isValid()) return;
    setShowLoader(true);

    try {
      const params = {
        officeId: +officeId,
        fromDate: startDate,
        toDate: endDate,
        duration: duration,
        leaveType: leaveType,
        reason: reason,
        backupUserId: backupUserId,
        backupName: backupUserId ? null : backupName,
        backupContactNumber: backupUserId ? null : backupContactNumber,
      };

      let res = await applyLeave(params);
      toast.success(res.message);
      if (res.status) onBack();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setShowLoader(false);
    }
  };

  return (
    <Fragment>
      <Page
        className={styles["apply-leaves-page"] + " " + "apply-leaves-page"}
        onBack={onBack}
      >
        {showLoader && <Loader />}
        {officeDetail && officeDetail.name && (
          <h2 className="page-title heading">{officeDetail.name}</h2>
        )}
        <div className={styles["sub-head"]}>{t("staffLeaves.applyLeave")}</div>
        <Card
          className={styles["apply-leaves-card"]}
          padding="70px"
          radius="10px"
          marginBottom="10px"
          shadow="0 0 15px 0 rgba(0, 0, 0, 0.08)"
          cursor="default"
        >
          <Form>
            <Row>
              <Col md="5">
                <div className="c-field">
                  <label>{t("staff.dateFrom")}</label>
                  <div className="d-flex inputdate">
                    <DatePicker
                      dateFormat="dd-MM-yyyy"
                      className="c-form-control"
                      selected={date.from}
                      onSelect={(value) => changeDate({ from: value })}
                      minDate={new Date()}
                    />
                  </div>
                </div>
                <div className="c-field">
                  <label>{t("staff.dateTo")}</label>
                  <div className="d-flex inputdate">
                    <DatePicker
                      popperPlacement="bottom-end"
                      dateFormat="dd-MM-yyyy"
                      className="c-form-control"
                      selected={date.to}
                      onSelect={(value) => changeDate({ to: value })}
                      minDate={date.from}
                      maxDate={maxDate}
                    />
                  </div>
                </div>
                <div className="input-disabled">
                  <Input
                    ReadOnly={true}
                    Disabled="disabled"
                    Title={t("staffLeaves.noOfWorkingDaysForLeave")}
                    Type="text"
                    Name={"promotionHeading"}
                    Value={`${duration} Days`}
                    HandleChange={handleDuration}
                    Placeholder={t("form.placeholder1", {
                      field: t("staffLeaves.noOfWorkingDaysForLeave"),
                    })}
                  />
                </div>
                {errors?.duration && (
                  <span className="error-msg custom-error-top">
                    {errors.duration}
                  </span>
                )}
                <div className="c-field">
                  <label>{t("staffLeaves.leaveType")}</label>
                  <div className="ch-radio">
                    <label
                      className="mr-5"
                      onClick={(e) => leaveRadioHandler(3)}
                    >
                      <input
                        type="radio"
                        name="vacation"
                        checked={leaveTypeRadio === 3}
                        onChange={() => {}}
                      />
                      <span> {t("staffLeaves.vacation")} </span>
                    </label>
                  </div>
                  <div className={"row " + styles["status-box"]}>
                    <div className="col-md-4 col-6 mb-2 mb-md-0">
                      <label>{t("staffLeaves.total")}</label>
                      <div
                        className={styles["status"]}
                      >{`${leaveTypeData?.vacation?.leaves} Days`}</div>
                    </div>
                    <div className="col-md-4 col-6">
                      <label>{t("staffLeaves.remaining")}</label>
                      <div className={styles["status"]}>
                        {" "}
                        {`${leaveTypeData?.vacation?.remaining} Days`}
                      </div>
                    </div>
                    <div className="col-md-4 col-12">
                      <label>{t("staffLeaves.taken")}</label>
                      <div
                        className={styles["status"]}
                      >{`${leaveTypeData?.vacation?.availed} Days`}</div>
                    </div>
                  </div>
                </div>
                <div className="c-field">
                  <div className="ch-radio">
                    <label
                      className="mr-5"
                      onClick={(e) => leaveRadioHandler(1)}
                    >
                      <input
                        type="radio"
                        name="casual"
                        checked={leaveTypeRadio === 1}
                        onChange={() => {}}
                      />
                      <span> {t("staffLeaves.casual")} </span>
                    </label>
                  </div>
                  <div className={"row " + styles["status-box"]}>
                    <div className="col-md-4 col-6 mb-2 mb-md-0">
                      <label>{t("staffLeaves.total")}</label>
                      <div
                        className={styles["status"]}
                      >{`${leaveTypeData?.casual?.leaves} Days`}</div>
                    </div>
                    <div className="col-md-4 col-6">
                      <label>{t("staffLeaves.remaining")}</label>
                      <div className={styles["status"]}>
                        {" "}
                        {`${leaveTypeData?.casual?.remaining} Days`}
                      </div>
                    </div>
                    <div className="col-md-4 col-12">
                      <label>{t("staffLeaves.taken")}</label>
                      <div
                        className={styles["status"]}
                      >{`${leaveTypeData?.casual?.availed} Days`}</div>
                    </div>
                  </div>
                </div>
                <div className="c-field">
                  <div className="ch-radio">
                    <label
                      className="mr-5"
                      onClick={(e) => leaveRadioHandler(2)}
                    >
                      <input
                        type="radio"
                        name="medical"
                        checked={leaveTypeRadio === 2}
                        onChange={() => {}}
                      />
                      <span> {t("staffLeaves.medical")} </span>
                    </label>
                  </div>
                  <div className={"row " + styles["status-box"]}>
                    <div className="col-md-4 col-6 mb-2 mb-md-0">
                      <label>{t("staffLeaves.total")}</label>
                      <div
                        className={styles["status"]}
                      >{`${leaveTypeData?.medical?.leaves} Days`}</div>
                    </div>
                    <div className="col-md-4 col-6">
                      <label>{t("staffLeaves.remaining")}</label>
                      <div
                        className={styles["status"]}
                      >{`${leaveTypeData?.medical?.remaining} Days`}</div>
                    </div>
                    <div className="col-md-4 col-12">
                      <label>{t("staffLeaves.taken")}</label>
                      <div
                        className={styles["status"]}
                      >{`${leaveTypeData?.medical?.availed} Days`}</div>
                    </div>
                  </div>
                </div>
                <div className="c-field">
                  <label>{t("staffLeaves.reasonForLeave")}</label>
                  <textarea
                    placeholder={t("form.placeholder1", {
                      field: t("staffLeaves.reasonForLeave"),
                    })}
                    className={
                      "c-form-control " + styles["custom-textarea-control"]
                    }
                    name="reason"
                    value={reason}
                    onChange={handleReason}
                    maxLength="500"
                  ></textarea>
                  {errors?.reason && (
                    <span className="error-msg">{errors.reason}</span>
                  )}
                </div>
                <div className="ch-checkbox">
                  <label className="pb-2 mb-0 pt-0">
                    <input
                      type="checkbox"
                      name="promocodes"
                      onChange={(e) => {
                        setIsAddBackupStaff(!isAddBackupStaff);
                        if (!isAddBackupStaff) {
                          setFormData({
                            ...formData,
                            backupName: null,
                            backupContactNumber: null,
                          });
                        }
                      }}
                    />
                    <span> {t("staffLeaves.addBackupStaff")} </span>
                  </label>
                </div>
                <div className={"d-flex " + "" + styles["alert-box"]}>
                  <div className="mr-1">
                    <img
                      src={
                        require("assets/images/alert-circle-black.svg").default
                      }
                      alt="icon"
                    />
                  </div>
                  <div>{t("staffLeaves.selectBackupText")}</div>
                </div>
                {isAddBackupStaff && (
                  <>
                    <div className="d-md-flex justify-content-between">
                      <div className="ch-radio">
                        <label
                          className="mr-5"
                          onClick={(e) => radioHandler(1)}
                        >
                          <input
                            type="radio"
                            name="backup"
                            checked={backupStaffRadio === 1}
                            onChange={() => {}}
                          />
                          <span> {t("staffLeaves.internalTempList")} </span>
                        </label>
                      </div>
                      {backupStaffRadio === 1 && (
                        <span
                          className="link-btn py-2 pb-3 pb-md-0"
                          onClick={() => {
                            setIsTemporaryStaffModalOpen(true);
                          }}
                        >
                          {backupName || backupContactNumber
                            ? t("staffLeaves.change")
                            : t("staffLeaves.selectStaff")}
                        </span>
                      )}
                    </div>
                    <div className="d-md-flex justify-content-between">
                      <div className="ch-radio">
                        <label
                          className="pb-3 pt-3"
                          onClick={(e) => radioHandler(2)}
                        >
                          <input
                            type="radio"
                            name="backupmanual"
                            checked={backupStaffRadio === 2}
                            onChange={() => {}}
                          />
                          <span>{t("staffLeaves.addBackupStaffManually")}</span>
                        </label>
                      </div>
                      {backupStaffRadio === 2 && (
                        <span
                          className="link-btn py-2"
                          onClick={() => {
                            setIsBackupStaffModalOpen(true);
                          }}
                        >
                          {backupName || backupContactNumber
                            ? t("staffLeaves.change")
                            : t("staffLeaves.selectStaff")}
                        </span>
                      )}
                      <div className="d-none">
                        <span className="link-btn py-2">
                          {" "}
                          {t("staffLeaves.change")}
                        </span>
                      </div>
                    </div>
                    <div
                      className={
                        "row mb-2 mb-md-3 mt-3 mt-md-0 " + styles["status-box"]
                      }
                    >
                      <div className="col-md-6">
                        <label>{t("staffLeaves.name")}</label>
                        <div className={styles["status"]}>
                          {backupName ? backupName : "--"}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label>{t("staffLeaves.contactNo")}</label>
                        <div className={styles["status"]}>
                          {backupContactNumber ? backupContactNumber : "--"}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </Col>
            </Row>
            <div className="d-md-flex mt-4">
              <button
                className="button button-round button-shadow mr-4 w-sm-100 mb-3 mb-md-0"
                title={t("staffLeaves.applyLeave")}
                onClick={applyLeaveForm}
              >
                {t("staffLeaves.applyLeave")}
              </button>
              <button
                className="button button-round  button-dark  button-border btn-mobile-link"
                onClick={onBack}
                title={t("cancel")}
              >
                {t("cancel")}
              </button>
            </div>
          </Form>
        </Card>
      </Page>
      {isBackupStaffModalOpen && (
        <BackupStaffModal
          isBackupStaffModalOpen={isBackupStaffModalOpen}
          setIsBackupStaffModalOpen={setIsBackupStaffModalOpen}
          handleAdd={(name, contactNo) => {
            setFormData({
              ...formData,
              backupName: name,
              backupContactNumber: contactNo,
            });
            setIsBackupStaffModalOpen(false);
          }}
        />
      )}
      {isTemporaryStaffModalOpen && (
        <TemporaryStaffModal
          isTemporaryStaffModalOpen={isTemporaryStaffModalOpen}
          setIsTemporaryStaffModalOpen={setIsTemporaryStaffModalOpen}
          officeId={+officeId}
          leaveId={null}
          toDate={moment(date?.to).format("YYYY-MM-DD")}
          fromDate={moment(date?.from).format("YYYY-MM-DD")}
          handleAdd={(selectedData) => {
            setFormData({
              ...formData,
              backupUserId: selectedData.userId,
              backupName: `${selectedData.firstName} ${selectedData.lastName}`,
              backupContactNumber: selectedData.contactNumber,
            });
            setIsTemporaryStaffModalOpen(false);
          }}
        />
      )}
    </Fragment>
  );
};

export default withTranslation()(ApplyLeaves);
