import React, { useState, useEffect } from "react";
import Row from "reactstrap/lib/Row";
import Col from "reactstrap/lib/Col";
import DatePicker from "react-datepicker";
import TimePicker from "rc-time-picker";
import { withTranslation } from "react-i18next";
import "./AppointmentBook.scss";
import toast from "react-hot-toast";
import styles from "../DoctorDetail.module.scss";
import Text from "components/Text";
import useRequestAppointmentState from "./useRequestAppointmentState";
import Loader from "components/Loader";
import ConfirmModal from "./components/ConfirmModal";
import useReadOnlyDateTextInput from "hooks/useReadOnlyDateTextInput";
import useQueryParam from "hooks/useQueryParam";
import {
  useGetMembersForBooking,
  getSingleMemberDetails,
} from "repositories/family-member-repository";
import useHandleApiError from "hooks/useHandleApiError";
import BookAppointmentModal from "../../Doctors/BookAppointmentModal";

function RequestAppointment({
  t,
  profile,
  doctorId,
  officeId,
  signIn,
  onBack,
  setIsAppointmentBooked,
}) {
  const {
    state,
    handleRadioChange,
    handleStartDateChange,
    handleEndDateChange,
    disabledHours,
    disabledMinutes,
    handleStartTimeChange,
    handleEndTimeChange,
    handleDayClick,
    handleDayStartTimeChange,
    disabledDayHours,
    disabledDayMinutes,
    handleDayEndTimeChange,
    handleCommentTextChange,
    toggleConfirmModal,
    handleSubmit,
    handleConfirm,
    requestingMutation,
  } = useRequestAppointmentState({
    t,
    doctorId,
    officeId,
    profile,
    signIn,
    setIsAppointmentBooked,
  });

  const startDatePickerRef = useReadOnlyDateTextInput();
  const endDatePickerRef = useReadOnlyDateTextInput();
  let memberId = useQueryParam("memberId", null);
  memberId = memberId ? parseInt(memberId) : null;
  const [isBookAppointmentModalOpen, setIsBookAppointmentModalOpen] =
    useState(false);
  const [singleMemberDetail, setSingleMemberDetail] = useState({});

  const PAGE_SIZE = 2;
  const memberPageNumber = 1;
  const {
    data: memberData,
    error: isError,
    isLoading,
    isFetching: isMemberFetching,
  } = useGetMembersForBooking(memberPageNumber, PAGE_SIZE, {
    enabled: !!profile?.id,
  });

  useHandleApiError(isLoading, isMemberFetching, isError);

  const handleBookAppointment = () => {
    if (memberId) {
      handleSubmit(memberId);
    } else {
      memberData?.data?.length > 1
        ? setIsBookAppointmentModalOpen(true)
        : handleSubmit();
    }
  };

  /**
   * get single member details
   */
  useEffect(() => {
    if (memberId && memberId !== profile.id) {
      getMemberDetails();
    }
  }, []);

  /**
   * @member: [getMemberDetails]
   * @description: use this method to get the single member details
   * @param {object} event
   */
  const getMemberDetails = async () => {
    try {
      let response = await getSingleMemberDetails(memberId);
      const memberDetail = response?.data;
      setSingleMemberDetail(memberDetail);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      {memberId && profile && memberId !== profile.id && (
        <div className="custom-outer-div">
          <div className="yellow-alert-box-font14">
            <div>{t("familyMembers.appointmentBookingMessageForMember")}</div>
          </div>
          <div className="d-flex justify-content-between">
            <div>
              <div className="family-member-label">
                {t("familyMembers.patientName")}
              </div>
              <div className="family-member-value">{`${
                singleMemberDetail?.firstName || ""
              } ${singleMemberDetail?.lastName || ""}`}</div>
            </div>

            {singleMemberDetail?.email && (
              <div>
                <div className="family-member-label">
                  {t("familyMembers.patientEmailAddress")}
                </div>
                <div className="family-member-value">{`${
                  singleMemberDetail?.email || ""
                }`}</div>
              </div>
            )}
          </div>
        </div>
      )}
      <div className={styles["book-appointment-card"]}>
        {(state.isLoading || requestingMutation) && <Loader />}

        <Text secondary size="16px" weight="600" marginBottom="10px">
          {t("patient.requestBookAppointment")}
        </Text>
        <Row>
          <Col sm="6">
            <div className="c-field">
              <label>{t("superAdmin.startDate")}</label>
              <div className="d-flex inputdate">
                <DatePicker
                  dateFormat="dd-MM-yyyy"
                  className="c-form-control"
                  selected={state.startDate}
                  minDate={new Date()}
                  onChange={handleStartDateChange}
                  ref={startDatePickerRef}
                />
                {!!state.errors.startDate && (
                  <span className="error-msg">{state.errors.startDate}</span>
                )}
              </div>
            </div>
          </Col>
          <Col sm="6">
            <div className="c-field">
              <label>{t("superAdmin.endDate")}</label>
              <div className="d-flex inputdate">
                <DatePicker
                  dateFormat="dd-MM-yyyy"
                  className="c-form-control"
                  minDate={state.startDate}
                  selected={state.endDate}
                  onChange={handleEndDateChange}
                  ref={endDatePickerRef}
                />
                {!!state.errors.endDate && (
                  <span className="error-msg">{state.errors.endDate}</span>
                )}
              </div>
            </div>
          </Col>
        </Row>
        <div className="c-field">
          <div className="ch-radio">
            <label className="mb-3 d-block">
              <input
                type="radio"
                name="timeDateRadio"
                checked={state.sameTimeForAllDays}
                onChange={() => handleRadioChange(true)}
              />
              <span> {t("patient.sameTimeForAllDates")} </span>
            </label>

            <label>
              <input
                type="radio"
                name="timeDateRadio"
                checked={!state.sameTimeForAllDays}
                onChange={() => handleRadioChange(false)}
              />
              <span> {t("patient.differentTimeForWeekdays")} </span>
            </label>
          </div>
        </div>
        {state.sameTimeForAllDays ? (
          <>
            <Row className="request-appointment-time">
              <Col sm="6">
                <div className="c-field">
                  <label>{t("staff.startTime")}</label>
                  <TimePicker
                    showSecond={false}
                    placeholder="--"
                    format="h:mm A"
                    use12Hours
                    minuteStep={15}
                    value={state.startTime}
                    onChange={handleStartTimeChange}
                    className={"busy-slot-time-picker"}
                  />
                  {!!state.errors.startTime && (
                    <span className="error-msg">{state.errors.startTime}</span>
                  )}
                </div>
              </Col>
              <Col sm="6">
                <div className="c-field">
                  <label>{t("staff.endTime")}</label>
                  <TimePicker
                    showSecond={false}
                    placeholder="--"
                    format="h:mm A"
                    use12Hours
                    minuteStep={15}
                    value={state.endTime}
                    onChange={handleEndTimeChange}
                    disabledHours={disabledHours}
                    disabledMinutes={disabledMinutes}
                    className={"busy-slot-time-picker"}
                  />
                  {state.errors.endTime && (
                    <span className="error-msg">{state.errors.endTime}</span>
                  )}
                </div>
              </Col>
            </Row>
          </>
        ) : (
          <>
            <ul className={styles["different-timelist-alldays"]}>
              {state.days.map((item, index) => {
                const {
                  daySymbol,
                  startDateTime,
                  endDateTime,
                  isSelected,
                  startTimeError,
                  endTimeError,
                } = item;
                return (
                  <li key={index}>
                    <div
                      className={
                        styles["day-box"] +
                        " " +
                        styles["cursor-pointer"] +
                        " " +
                        `${isSelected ? "" : styles["weekend"]}`
                      }
                      onClick={() => handleDayClick(index)}
                    >
                      {daySymbol}
                    </div>
                    <div
                      className={
                        "request-appointment-time " + styles["time-select-box"]
                      }
                    >
                      <div className="c-field ">
                        <TimePicker
                          showSecond={false}
                          placeholder="--"
                          format="h:mm A"
                          use12Hours
                          className={"busy-slot-time-picker"}
                          minuteStep={15}
                          value={startDateTime}
                          onChange={(time) =>
                            handleDayStartTimeChange(time, index)
                          }
                          disabled={!isSelected}
                        />
                        {!!startTimeError && (
                          <span className="error-msg">{startTimeError}</span>
                        )}
                      </div>
                      <div className="c-field">
                        <TimePicker
                          showSecond={false}
                          placeholder="--"
                          format="h:mm A"
                          use12Hours
                          disabled={!isSelected}
                          value={endDateTime}
                          onChange={(time) =>
                            handleDayEndTimeChange(time, index)
                          }
                          disabledHours={() => disabledDayHours(index)}
                          disabledMinutes={(hour) =>
                            disabledDayMinutes(index, hour)
                          }
                          className={"busy-slot-time-picker"}
                          minuteStep={15}
                        />
                        {!!endTimeError && (
                          <span className="error-msg">{endTimeError}</span>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            {state.errors.days && (
              <span className="error-msg">{state.errors.days}</span>
            )}
          </>
        )}
        <div className={styles["border-row"] + " mt-3"}>
          <Text size="13px" weight="400" color="#79869a">
            {t("superAdmin.comment")}
          </Text>

          <textarea
            value={state.comment}
            onChange={handleCommentTextChange}
            className={styles.textarea}
            rows="4"
            maxLength="400"
          />
        </div>
        {!!state.errors.comment && (
          <span className="error-msg">{state.errors.comment}</span>
        )}
        <button
          className={"button button-round button-shadow w-100 mb-4 mt-3"}
          onClick={handleBookAppointment}
        >
          {t("submit")}
        </button>
        <div className={"text-center "}>
          <span onClick={onBack} className="link-btn no-underline">
            {t("cancel")}{" "}
          </span>
        </div>

        <ConfirmModal
          onSubmit={handleConfirm}
          toggleConfirmModal={toggleConfirmModal}
          isOpen={state.confirmModal}
        />
        <BookAppointmentModal
          isBookAppointmentModalOpen={isBookAppointmentModalOpen}
          setIsBookAppointmentModalOpen={setIsBookAppointmentModalOpen}
          loggedInUserId={profile?.id}
          handleMemberClick={(id) => {
            toggleConfirmModal(id);
          }}
        />
      </div>
    </>
  );
}

export default withTranslation()(RequestAppointment);
