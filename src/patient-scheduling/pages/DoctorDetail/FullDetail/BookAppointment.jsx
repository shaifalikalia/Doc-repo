import React, { useEffect, useRef, useState } from "react";
import { withTranslation } from "react-i18next";
import Text from "components/Text";
import styles from "./../DoctorDetail.module.scss";
import Calendar from "react-calendar";
import "./AppointmentCalendar.scss";
import useQueryParam from "hooks/useQueryParam";
import {
  useBookAppointmentMutation,
  useGetIsQuestionnaireEnabled,
  useSlots,
} from "repositories/appointment-repository";
import { formatDate, handleError } from "utils";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import constants from "./../../../../constants";
import toast from "react-hot-toast";
import moment from "moment-timezone";
import scheduleIcon from "../../../../assets/images/schedule-icon.svg";
import QuestionnaireCard from "./QuestionnaireCard";
import Loader from "components/Loader";
import BookAppointmentModal from "../../Doctors/BookAppointmentModal";
import {
  useGetMembersForBooking,
  getSingleMemberDetails,
} from "repositories/family-member-repository";
import useHandleApiError from "hooks/useHandleApiError";

function BookAppointmemt({
  initialAppointmentDate,
  doctorId,
  office,
  onAppointmentBooked,
  signIn,
  t,
  goToRequestAppointmentPage,
  to,
}) {
  const profile = useSelector((s) => s.userProfile.profile);
  const [appointmentDate, setAppointmentDate] = useState(
    initialAppointmentDate !== null
      ? new Date(initialAppointmentDate)
      : new Date()
  );
  const [slots, setSlots] = useState([]);
  const [appointmentDescription, setAppointmentDescription] = useState("");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [initiateSignIn, setInitiateSignIn] = useState(false);
  const [singleMemberDetail, setSingleMemberDetail] = useState({});
  const ref = useRef(null);
  const history = useHistory();

  const { isLoading: isLoadingSlots, data: rawSlots } = useSlots(
    doctorId,
    office.id,
    appointmentDate,
    appointmentDate !== null
  );

  const [isBookAppointmentModalOpen, setIsBookAppointmentModalOpen] =
    useState(false);

  let memberId = useQueryParam("memberId", null);
  memberId = memberId ? parseInt(memberId) : null;
  const mutation = useBookAppointmentMutation();

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

  useEffect(() => {
    if (
      !isLoadingSlots &&
      rawSlots &&
      rawSlots.filter((it) => it.slotStatus === 1 && it.isAvailable).length > 0
    ) {
      const s = rawSlots
        .filter((it) => it.slotStatus === 1 && it.isAvailable)
        .map((it, i) => ({
          overallOrder: i + 1,
          duration: it.durationInMinutes,
          time: it.startTime,
          datetime: it.startDateTime,
          isSelected: false,
        }));

      s[0].order = 1;
      for (let i = 1; i < s.length; i++) {
        if (
          areConsecutiveSlots(
            new Date(s[i - 1].datetime.substr(0, s[i - 1].datetime.length - 1)),
            new Date(s[i].datetime.substr(0, s[i].datetime.length - 1)),
            s[i].duration
          )
        ) {
          s[i].order = s[i - 1].order + 1;
        } else {
          s[i].order = 1;
        }
      }

      setSlots(s);
    }
  }, [isLoadingSlots, rawSlots]);

  useEffect(() => {
    const appointmentData = localStorage.getItem(
      constants.lsKeys.bookAppointmentData
    );
    if (slots.length > 0 && appointmentData && profile !== null) {
      const { selectedSlots, appointmentDescription: aD } =
        JSON.parse(appointmentData);

      for (let i = 0; i < selectedSlots.length; i++) {
        let index = slots.findIndex((it) => it.time === selectedSlots[i].time);
        if (index !== -1) {
          slots[index].isSelected = true;
        }
      }

      setAppointmentDescription(aD);
      setSlots([...slots]);

      localStorage.removeItem(constants.lsKeys.bookAppointmentData);
    }
    // eslint-disable-next-line
  }, [slots]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref && ref.current && !ref.current.contains(event.target)) {
        setIsCalendarOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  useEffect(() => {
    if (initiateSignIn) {
      signIn();
    }
    //eslint-disable-next-line
  }, [initiateSignIn]);

  useEffect(() => {
    //This useEffect is used to remove the session storage keys only when they move to next location from current.
    const unregister = history.block((location) => {
      if (location.pathname !== constants.routes.questionnaireForm) {
        sessionStorage.removeItem(
          constants.localStorageKeys.questionnaireResponse
        );
        sessionStorage.removeItem(
          constants.localStorageKeys.selectedAppointmentDate
        );
      }
      return true;
    });
    return unregister;
  }, []);

  /**
   * get single member details
   */
  useEffect(() => {
    if (memberId && memberId !== profile.id) {
      getMemberDetails();
    }
  }, []);

  let appointmentDateElement = (
    <Text secondary size="14px" weight="600" color="#102c42">
      {formatDate(appointmentDate || moment())}
    </Text>
  );
  if (appointmentDate !== null) {
    appointmentDateElement = (
      <Text secondary size="14px" weight="600" color="#102c42">
        {formatDate(appointmentDate)}
      </Text>
    );
  }

  let slotsAvailableText = null;
  if (slots.length > 0) {
    slotsAvailableText = `(${t("patient.slotsAvailable", {
      count: slots.length,
    })})`;
  }

  const onBookAppointment = async () => {
    if (profile !== null) {
      //   await bookAppointment();
      handleBookAppointment();
    } else {
      localStorage.setItem(
        constants.lsKeys.bookAppointmentData,
        JSON.stringify({
          doctorId,
          officeId: office.id,
          selectedSlots: slots.filter((it) => it.isSelected),
          appointmentDescription,
          date: moment().format("YYYY-MM-DD"),
          appointmentDate: moment(appointmentDate).format("YYYY-MM-DD"),
        })
      );
      setInitiateSignIn(true);
    }
  };

  const onDateSelect = (date) => {
    setIsCalendarOpen(false);
    if (moment(date).isSame(moment(appointmentDate))) {
      return;
    }
    setAppointmentDate(date);
    sessionStorage.setItem(
      constants.localStorageKeys.selectedAppointmentDate,
      moment(date).format("YYYY-MM-DD")
    );
    setSlots([]);
    setAppointmentDescription("");
  };

  const tileClassName = ({ view, date }) => {
    if (view === "month") {
      let classes = styles["calendar-day"];
      classes += ` ${styles["calendar-day-active"]}`;
      return classes;
    }
  };

  const enableIsQuestionnarieEnabledApi = !!(
    office &&
    office.id &&
    appointmentDate
  );
  const {
    isLoading: loadingIsQuestionnaireEnabled,
    isFetching,
    data,
    error,
  } = useGetIsQuestionnaireEnabled(office?.id, appointmentDate, {
    enabled: enableIsQuestionnarieEnabledApi,
  });
  useEffect(() => {
    if (
      !loadingIsQuestionnaireEnabled &&
      !isFetching &&
      error &&
      error.message
    ) {
      handleError(error);
    }
  }, [error]);
  const isQuestionnaireEnable = !!(data && data.isQuestionnaireEnable);
  const questionnaireResponse = sessionStorage.getItem(
    constants.localStorageKeys.questionnaireResponse
  );

  const isQuestionnaireFilled =
    isQuestionnaireEnable && !!questionnaireResponse;

  const {
    timeRequiredForAppointment,
    officeId,
    doctorId: docId,
  } = isQuestionnaireFilled ? JSON.parse(questionnaireResponse) : {};

  const isQuestionnaireFilledForThisOfficeAndDoctor =
    isQuestionnaireFilled && officeId === office?.id && docId === doctorId;

  const shouldDisableBookAppointment =
    isQuestionnaireEnable && !isQuestionnaireFilledForThisOfficeAndDoctor;

  const handleBookAppointment = () => {
    if (memberId) {
      bookAppointment(memberId);
    } else {
      memberData?.data?.length > 1
        ? setIsBookAppointmentModalOpen(true)
        : bookAppointment();
    }
  };

  const bookAppointment = async (familyMemberId) => {
    const firstSelectedSlot = slots.filter((it) => it.isSelected)[0];
    let reminderDatetime = moment.tz(
      firstSelectedSlot.datetime.substr(
        0,
        firstSelectedSlot.datetime.length - 1
      ),
      office.timezoneId
    );
    reminderDatetime = reminderDatetime.utc().toDate();

    const dto = {
      doctorId,
      officeId: office.id,
      patientId: profile.id,
      date: moment(appointmentDate).format("YYYY-MM-DD"),
      reminderDate: reminderDatetime,
      description: appointmentDescription,
      slots: slots.filter((it) => it.isSelected).map((it) => it.time),
    };

    if (familyMemberId !== profile.id) {
      dto.patientFamilyMemberId = parseInt(familyMemberId);
    }

    if (isQuestionnaireFilledForThisOfficeAndDoctor) {
      dto.TimeRequired = timeRequiredForAppointment;
    }

    try {
      await mutation.mutateAsync(dto);
      sessionStorage.removeItem(
        constants.localStorageKeys.questionnaireResponse
      );
      sessionStorage.removeItem(
        constants.localStorageKeys.selectedAppointmentDate
      );
      onAppointmentBooked();
    } catch (e) {
      toast.error(e.message);
    }
  };

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
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <>
      {loadingIsQuestionnaireEnabled && <Loader />}
      {isQuestionnaireEnable && (
        <QuestionnaireCard
          officeId={office.id}
          doctorId={doctorId}
          memberId={memberId}
          isQuestionnaireFilled={isQuestionnaireFilledForThisOfficeAndDoctor}
          timeRequiredForAppointment={timeRequiredForAppointment}
        />
      )}
      {memberId && profile && memberId !== profile.id && (
        <>
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
        </>
      )}
      <div
        className={`${styles["book-appointment-card"]} ${
          shouldDisableBookAppointment ? styles["disable-btns"] : ""
        }`}
      >
        <Text secondary size="16px" weight="600" marginBottom="10px">
          {t("patient.bookAppointment")}
        </Text>
        <div className={styles["border-row"]}>
          <Text size="10px" weight="400" color="#87928d">
            {t("patient.showingSlots")}
          </Text>
          <Text
            secondary
            size="14px"
            weight="500"
            marginBottom="5px"
            color="#102c42"
          >
            {office.name}
          </Text>
        </div>

        <div className={styles["border-row"]}>
          <div className="d-flex appointment-calendar-wrapper justify-content-between">
            {appointmentDateElement}
            <div>
              <div
                className={styles["anchor-link"]}
                onClick={() => setIsCalendarOpen((s) => !s)}
              >
                {t("patient.changeDate")}
              </div>

              {isCalendarOpen && (
                <div ref={ref}>
                  <Calendar
                    className="appointment-calendar"
                    calendarType="US"
                    minDetail="year"
                    showNeighboringMonth={false}
                    formatShortWeekday={(_, date) =>
                      moment(date).format("ddd").substr(0, 1)
                    }
                    minDate={new Date()}
                    value={appointmentDate}
                    tileClassName={tileClassName}
                    tileContent={
                      <div className="disabled-tooltip tooltip">
                        {t("patient.slotNotAvailable")}
                      </div>
                    }
                    onChange={onDateSelect}
                  />
                </div>
              )}
            </div>
          </div>
          <Text size="10px" weight="400" marginBottom="5px" color="#87928d">
            {slotsAvailableText}
          </Text>
        </div>

        <Text size="10px" weight="400" color="#87928d">
          {t("patient.timezone")}
        </Text>
        <Text
          secondary
          size="14px"
          weight="500"
          marginBottom="10px"
          color="#102c42"
        >
          {office.timezoneCode}
        </Text>

        {!isLoadingSlots && slots.length === 0 && (
          <>
            <div className={styles["border-row"] + " " + "mt-3"}>
              <Text size="12px" weight="400" color="#6f7788" marginBottom="0px">
                {t("patient.couldNotFindTheDesiredTimeslots")}
              </Text>
              <span
                className="link-btn d-inline-block mb-4"
                onClick={goToRequestAppointmentPage}
              >
                {t("patient.requestAppointment")}
              </span>
            </div>
            <div className="d-flex flex-column align-items-center">
              <img
                src={scheduleIcon}
                width={100}
                height={105}
                style={{ marginTop: 30, marginBottom: 20 }}
                alt=""
              />
              <Text width="295px" align="center" size="12px" color="#6f7788">
                {t("patient.noAvailableDateMessage")}
              </Text>
            </div>
          </>
        )}

        {isLoadingSlots && (
          <div className="center" style={{ minHeight: 350 }}>
            <div className="loader"></div>
          </div>
        )}

        {slots.length > 0 && (
          <SlotsSection
            slots={slots}
            updateSlots={setSlots}
            appointmentDescription={appointmentDescription}
            setAppointmentDescription={setAppointmentDescription}
            profile={profile}
            onBookAppointment={onBookAppointment}
            isBookingAppointment={mutation.isLoading || initiateSignIn}
            t={t}
            goToRequestAppointmentPage={goToRequestAppointmentPage}
            to={to}
            isQuestionnaireEnabled={isQuestionnaireEnable}
            appointmentDuration={timeRequiredForAppointment}
            shouldDisableBookAppointment={shouldDisableBookAppointment}
          />
        )}
      </div>
      <BookAppointmentModal
        isBookAppointmentModalOpen={isBookAppointmentModalOpen}
        setIsBookAppointmentModalOpen={setIsBookAppointmentModalOpen}
        loggedInUserId={profile?.id}
        handleMemberClick={(id) => {
          bookAppointment(id);
        }}
      />
    </>
  );
}

function SlotsSection({
  slots,
  updateSlots,
  appointmentDescription,
  setAppointmentDescription,
  profile,
  onBookAppointment,
  isBookingAppointment,
  t,
  goToRequestAppointmentPage,
  to,
  isQuestionnaireEnabled,
  appointmentDuration,
  shouldDisableBookAppointment,
}) {
  const [consectiveSlotsError, setConsectiveSlotsError] = useState(false);
  const [durationError, setDurationError] = useState(false);
  let consectiveSlotsErrorTimer = null;
  let durationErrorTimer = null;

  const showErrorAndReturn = () => {
    if (shouldDisableBookAppointment) {
      handleError(new Error(t("patient.questionnaireFillError")));
      return true;
    }
    return false;
  };
  const onSlotClick = (clickedSlot) => {
    const i = slots.findIndex((it) => it.time === clickedSlot.time);
    if (i === -1) {
      return;
    }

    if (slots[i].isSelected) {
      unselectSlot(i);
    } else {
      selectSlot(i);
    }
  };

  const selectSlot = (index) => {
    const allSelectedSlots = slots.filter((it) => it.isSelected);

    let sum = 0;
    allSelectedSlots.forEach((it) => (sum += it.duration));
    if (sum >= 60) {
      setDurationError(true);
      if (durationErrorTimer !== null) {
        clearTimeout(durationErrorTimer);
      }
      durationErrorTimer = setTimeout(() => setDurationError(false), 2000);
      return;
    }

    if (allSelectedSlots.length === 0) {
      slots[index].isSelected = true;
      updateSlots([...slots]);
      return;
    }

    const clicked = slots[index];
    const selectionStart = allSelectedSlots[0];
    const selectionEnd = allSelectedSlots[allSelectedSlots.length - 1];

    if (
      (clicked.overallOrder === selectionStart.overallOrder - 1 &&
        clicked.order === selectionStart.order - 1) ||
      (clicked.overallOrder === selectionEnd.overallOrder + 1 &&
        clicked.order === selectionEnd.order + 1)
    ) {
      slots[index].isSelected = true;
      updateSlots([...slots]);
    } else {
      setConsectiveSlotsError(true);
      if (consectiveSlotsErrorTimer !== null) {
        clearTimeout(consectiveSlotsErrorTimer);
      }
      consectiveSlotsErrorTimer = setTimeout(
        () => setConsectiveSlotsError(false),
        2000
      );
    }
  };

  const unselectSlot = (index) => {
    const clicked = slots[index];
    const allSelectedSlots = slots.filter((it) => it.isSelected);

    if (
      clicked.overallOrder === allSelectedSlots[0].overallOrder ||
      clicked.overallOrder ===
        allSelectedSlots[allSelectedSlots.length - 1].overallOrder
    ) {
      slots[index].isSelected = false;
      updateSlots([...slots]);
    }
  };

  const slotElementList = slots.map((it, i) => {
    return (
      <li
        key={i}
        onClick={() =>
          isQuestionnaireEnabled ? onSlotClick2(it) : onSlotClick(it)
        }
        className={it.isSelected ? styles.active : ""}
      >
        {it.time}
      </li>
    );
  });

  const onSlotClick2 = (clickedSlot) => {
    if (showErrorAndReturn()) return;
    const tempSlots = slots.map((item) => ({ ...item, isSelected: false }));
    const idx = tempSlots.findIndex((it) => it.time === clickedSlot.time);
    if (idx === -1) {
      return;
    }
    for (let i = idx; i < tempSlots.length; i++) {
      const shouldStop = selectSlot2(i, tempSlots);
      if (shouldStop) {
        break;
      }
    }

    const allSelectedSlots = tempSlots.filter((it) => it.isSelected);
    let sum = 0;
    allSelectedSlots.forEach((it) => (sum += it.duration));
    if (sum < appointmentDuration || sum > appointmentDuration) {
      setConsectiveSlotsError(true);
      if (consectiveSlotsErrorTimer !== null) {
        clearTimeout(consectiveSlotsErrorTimer);
      }
      consectiveSlotsErrorTimer = setTimeout(
        () => setConsectiveSlotsError(false),
        2000
      );
      updateSlots(slots.map((item) => ({ ...item, isSelected: false })));
      return;
    }
    updateSlots([...tempSlots]);
  };

  function selectSlot2(index, tempSlots) {
    const STOP = true;
    const allSelectedSlots = tempSlots.filter((it) => it.isSelected);
    let sum = 0;
    allSelectedSlots.forEach((it) => (sum += it.duration));
    if (sum + tempSlots[index].duration > appointmentDuration) {
      return STOP;
    }

    if (allSelectedSlots.length === 0) {
      tempSlots[index].isSelected = true;
      return !STOP;
    }

    const clicked = tempSlots[index];
    const selectionStart = allSelectedSlots[0];
    const selectionEnd = allSelectedSlots[allSelectedSlots.length - 1];

    if (
      (clicked.overallOrder === selectionStart.overallOrder - 1 &&
        clicked.order === selectionStart.order - 1) ||
      (clicked.overallOrder === selectionEnd.overallOrder + 1 &&
        clicked.order === selectionEnd.order + 1)
    ) {
      tempSlots[index].isSelected = true;
    } else {
      setConsectiveSlotsError(true);
      if (consectiveSlotsErrorTimer !== null) {
        clearTimeout(consectiveSlotsErrorTimer);
      }
      consectiveSlotsErrorTimer = setTimeout(
        () => setConsectiveSlotsError(false),
        2000
      );
    }
  }

  return (
    <>
      <Text size="12px" weight="400" color="#6f7788" marginBottom="13px">
        {t("patient.selectSlots")}
      </Text>

      <ul className={styles.timelist}>{slotElementList}</ul>

      {consectiveSlotsError && (
        <Text size="12px" color="red" marginTop="2px">
          {t(
            isQuestionnaireEnabled
              ? "patient.consectiveSlotsError2"
              : "patient.consectiveSlotsError"
          )}
        </Text>
      )}
      {durationError && (
        <Text size="12px" color="red" marginTop="2px">
          {t("patient.durationError")}
        </Text>
      )}
      <div className={styles["border-row"] + " " + "mt-3"}>
        <Text size="12px" weight="400" color="#6f7788" marginBottom="0px">
          {t("patient.couldNotFindTheDesiredTimeslots")}
        </Text>
        <span
          className="link-btn d-inline-block mb-4"
          onClick={goToRequestAppointmentPage}
        >
          {t("patient.requestAppointment")}
        </span>
      </div>
      {/* eslint-disable-next-line */}
      <div className={styles["border-row"] + " " + "mt-3"}>
        <Text size="13px" weight="400" color="#79869a">
          {t("patient.descriptionTherapyNeeded")}
        </Text>

        <textarea
          value={appointmentDescription}
          onChange={(e) => setAppointmentDescription(e.target.value)}
          className={styles.textarea}
          rows="5"
          maxLength="400"
        />
      </div>

      <button
        className={
          "button button-round button-shadow w-100 mb-4 mt-3 bookAppointmentBtn justify-content-center" +
          (isBookingAppointment ? " button-loading" : "")
        }
        disabled={
          slots.findIndex((it) => it.isSelected) === -1 ||
          appointmentDescription.trim().length === 0 ||
          (profile &&
            profile.role &&
            profile.role.systemRole !== constants.systemRoles.patient) ||
          isBookingAppointment
        }
        onClick={onBookAppointment}
      >
        {t("patient.bookAppointmentBtn")}
        {isBookingAppointment && <div className="loader"></div>}
      </button>

      <Link to={to}>
        <div className={"text-center " + styles["anchor-link"]}>
          {t("cancel")}
        </div>
      </Link>
      <Text
        size="11px"
        weight="400"
        color="#6f7788"
        marginBottom="0px"
        marginTop="30px"
      >
        <strong>Note:</strong>&nbsp;If you are not registered as a Patient, to
        ‘Request Booking Appointment’ you must Sign Up and Login first. Once the
        appointment is booked on web, you can download the
        <a
          href={constants.DOWNLOADLINK.appStore}
          className="link-btn"
          rel="noreferrer"
          target="_blank"
        >
          {" "}
          Patient iOS App{" "}
        </a>
        or{" "}
        <a
          href={constants.DOWNLOADLINK.playStore}
          className="link-btn"
          rel="noreferrer"
          target="_blank"
        >
          {" "}
          Patient Android App{" "}
        </a>
        to view the details of the requested appointments.
      </Text>
    </>
  );
}

function areConsecutiveSlots(timeA, timeB, slotDuration) {
  const a = moment(timeA);
  const b = moment(timeB);
  return Math.abs(a.diff(b, "minutes")) === slotDuration;
}

export default withTranslation()(BookAppointmemt);
