import Page from "components/Page";
import React, { Fragment, useState, useEffect, useRef } from "react";
import { withTranslation } from "react-i18next";
import styles from "./RequestAnAppointment.module.scss";
import DatePicker from "react-datepicker";
import Text from "components/Text";
import Input from "components/Input";
import { useLocation, Link, useHistory } from "react-router-dom";
import {
  encodeId,
  getDoctorFullName,
  getFullAddress,
  parseNumber,
  validateEmail,
  validateNumber,
  testRegexCheck,
} from "utils";
import userDefaultImage from "../../../assets/images/staff-default.svg";
import constants from "../../../constants.js";
import useQueryParam from "hooks/useQueryParam";
import { useSelector } from "react-redux";
import { useDoctorDetail } from "repositories/doctor-repository";
import { useUserSpecialties } from "repositories/specialty-repository";
import qs from "query-string";
import produce from "immer";
import { cloneDeep } from "lodash";
import Loader from "components/Loader";
import toast from "react-hot-toast";
import moment from "moment";
import { useRequestDoctorAppointment } from "../../../repositories/appointment-repository.js";
import CustomModal from "components/CustomModal";
import useReadOnlyDateTextInput from "hooks/useReadOnlyDateTextInput";
import {
  useGetMembersForBooking,
  getSingleMemberDetails,
} from "repositories/family-member-repository";
import useHandleApiError from "hooks/useHandleApiError";
import BookAppointmentModal from "../Doctors/BookAppointmentModal";

function RequestAnAppointment({ t, signIn }) {
  const location = useLocation();
  const history = useHistory();
  const doctorId = useQueryParam("doctorId", null);
  const officeId = useQueryParam("officeId", null);
  let memberId = useQueryParam("memberId", null);
  memberId = memberId ? parseInt(memberId) : null;
  const profile = useSelector((s) => s.userProfile.profile);
  const datePickerRef = useReadOnlyDateTextInput();

  const {
    isLoading,
    isFetching: isFetchingDoctor,
    data: doctorApiDetails,
    error,
  } = useDoctorDetail(doctorId, officeId, {
    enabled: !!(doctorId && officeId),
  });
  const {
    isLoading: isLoadingSpecialties,
    isFetching: isFetchingSpecialities,
    data: specialties,
    error: specialtiesError,
  } = useUserSpecialties(doctorId, { enabled: !!doctorId });
  const requestAppointmentMutation = useRequestDoctorAppointment();
  const { isLoading: requestingMutation } = requestAppointmentMutation;

  const [isBookAppointmentModalOpen, setIsBookAppointmentModalOpen] =
    useState(false);
  const [memberIdInLogoutCase, setMemberIdInLogoutCase] = useState("");

  const [singleMemberDetail, setSingleMemberDetail] = useState({});
  const PAGE_SIZE = 2;
  const memberPageNumber = 1;
  const {
    data: memberData,
    error: isError,
    isLoading: isLoadingMember,
    isFetching: isMemberFetching,
  } = useGetMembersForBooking(memberPageNumber, PAGE_SIZE, {
    enabled: !!profile?.id,
  });

  useHandleApiError(isLoadingMember, isMemberFetching, isError);

  const handleBookAppointment = () => {
    if (memberId) {
      handleSubmitRequest();
    } else {
      memberData?.data?.length > 1
        ? setIsBookAppointmentModalOpen(true)
        : handleSubmitRequest();
    }
  };

  //Api Error Handiling
  useEffect(() => {
    if (!isLoading && !isFetchingDoctor && error && error.message) {
      toast.error(error?.message);
    }
    if (
      !isLoadingSpecialties &&
      !isFetchingSpecialities &&
      specialtiesError &&
      specialtiesError.message
    ) {
      toast.error(specialtiesError?.message);
    }
    //eslint-disable-next-line
  }, [error, specialtiesError]);

  /////////////////////

  const usefullInfo = {};

  if (doctorId && officeId) {
    usefullInfo.isGoogleDoctor = false;
    if (doctorApiDetails) {
      usefullInfo.name = getDoctorFullName(
        doctorApiDetails?.firstName,
        doctorApiDetails?.lastName,
        doctorApiDetails?.honorific
      );
      usefullInfo.profilePic = doctorApiDetails?.profilePic;
      usefullInfo.designation = doctorApiDetails?.designation?.name;
      usefullInfo.officeName = doctorApiDetails?.office?.name;
      usefullInfo.address = getFullAddress(doctorApiDetails?.officeLocation, t);
      usefullInfo.totalOffices = doctorApiDetails?.totalOffices;
      usefullInfo.specialtiesContent = [];
      if (!isLoadingSpecialties && specialties && specialties.length > 0) {
        usefullInfo.specialtiesContent = specialties.map((it, index) => (
          <Fragment key={index}>
            {it.title} <br />
          </Fragment>
        ));
      } else if (
        !isLoadingSpecialties &&
        specialties &&
        specialties.length === 0
      ) {
        usefullInfo.specialtiesContent = "Not Added.";
      }
    }
  } else if (location?.state?.doctor) {
    const { doctor } = location.state;
    usefullInfo.isGoogleDoctor = doctor.isGoogleDoctor;
    usefullInfo.name = doctor.name;
    usefullInfo.address = doctor.address;
    usefullInfo.placeId = doctor.placeId;
    usefullInfo.phoneNumber = doctor.phoneNumber;
    usefullInfo.utcOffset = doctor.utcOffset;
    usefullInfo.website = doctor.website;
    usefullInfo.businessHours = doctor.businessHours;
    usefullInfo.location = doctor.location;
  }

  const addDefaultSrc = (ev) => {
    ev.target.src = userDefaultImage;
    ev.target.onerror = null;
  };

  const doctorDetailsContent = (
    <div className={styles["doctor-detail-card"]}>
      <div className={styles["intro-box"]}>
        <img
          src={usefullInfo.profilePic || userDefaultImage}
          onError={addDefaultSrc}
          alt="profile"
        />
        <div>
          <Text secondary size="18px" weight="600" ellipsis>
            {usefullInfo.name}
          </Text>
          <Text size="14px" weight="300" ellipsis>
            {usefullInfo.designation}
          </Text>
        </div>
      </div>
      {/* Doctor detail */}

      {/* Office Address */}
      <div className="mb-4">
        <Text size="12px" color="#6f7788">
          {t("form.fields.officeAddress")}
        </Text>
        <Text size="14px" weight="600" color="#102c42" overflow="hidden">
          {usefullInfo.officeName}
          <br />
          {usefullInfo.address}
        </Text>
        <div className="mb-4">
          <Link
            to={{
              pathname: constants.routes.doctorOffices.replace(
                ":doctorId",
                encodeId(doctorId)
              ),
              state: {
                ...(location?.state ? location.state : {}),
                backTo: constants.routes.requestAnAppointment,
                officeId: officeId,
                doctorName: usefullInfo.name,
              },
            }}
            className={"link-btn " + styles["anchor-link"]}
          >
            {t("patient.viewOffice", { count: usefullInfo.totalOffices })}
          </Link>
        </div>
      </div>
      {/* Office Address */}

      {/* Specialties */}
      <div className="mb-4">
        <Text size="12px" color="#6f7788">
          {t("superAdmin.specialtiesOrServices")}
        </Text>
        <Text size="14px" weight="600" color="#102c42">
          {usefullInfo.specialtiesContent}
        </Text>
      </div>
      {/* Specialties */}
    </div>
  );

  const cachedState = sessionStorage.getItem(
    constants.localStorageKeys.requestAppointmentData
  );
  const initialStates = {
    appointmentDate: new Date(),
    appointmentTime: constants.appointmentTimeTypes.Morning,
    reason: "",
    patientEmail: "",
    patientName: "",
    patientPhone: "",
    termsAccepted: false,
  };
  if (cachedState) {
    const requestAppointmentData = JSON.parse(cachedState);
    initialStates.appointmentDate = new Date(
      requestAppointmentData.appointmentDate
    );
    initialStates.appointmentTime = requestAppointmentData.appointmentTime;
    initialStates.reason = requestAppointmentData.reason;
    initialStates.patientEmail = requestAppointmentData.patientEmail;
    initialStates.patientName = requestAppointmentData.patientName;
    initialStates.patientPhone = requestAppointmentData.patientPhone;
    initialStates.termsAccepted = true;
  }
  const [checkboxArrow, setCheckboxArrow] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState(
    initialStates.appointmentDate
  );
  const [appointmentTime, setAppointmentTime] = useState(
    initialStates.appointmentTime
  );
  const [reason, setReason] = useState(initialStates.reason);
  const [patientName, setPatientName] = useState(initialStates.patientName);
  const [patientEmail, setPatientEmail] = useState(initialStates.patientEmail);
  const [patientPhone, setPatientPhone] = useState(initialStates.patientPhone);
  const [termsAccepted, setTermsAccepted] = useState(
    initialStates.termsAccepted
  );
  const [errors, setErrors] = useState({});
  const [confirmModal, setConfirmModal] = useState(false);

  const handleTerms = (e) => {
    setTermsAccepted(e.target.checked);
    setErrors(
      produce((state) => {
        if (e.target.checked) {
          delete state.terms;
        } else {
          state.terms = t("patient.acceptTerms");
        }
      })
    );
  };

  const handlePatientPhone = (e) => {
    const value = parseNumber(e.target.value);
    setPatientPhone(value);
    setErrors(
      produce((state) => {
        if (!value.trim().length) {
          state.phone = t("form.errors.emptyField", {
            field: t("form.fields.phoneNumber"),
          });
        } else {
          if (validateNumber(value)) {
            delete state.phone;
          } else {
            state.phone = t("form.errors.invalidValue", {
              field: t("form.fields.phoneNumber"),
            });
          }
        }
      })
    );
  };

  const handlePatientEmail = (e) => {
    const value = e.target.value;
    setPatientEmail(value);
    setErrors(
      produce((state) => {
        if (!value.trim().length) {
          state.email = t("form.errors.emptyField", {
            field: t("form.fields.emailAddress"),
          });
        } else {
          if (validateEmail(value)) {
            delete state.email;
          } else {
            state.email = t("form.errors.invalidValue", {
              field: t("form.fields.emailAddress"),
            });
          }
        }
      })
    );
  };

  const handlePatientName = (e) => {
    const value = e.target.value;
    if (!testRegexCheck(value)) return;
    setPatientName(value);
    setErrors(
      produce((state) => {
        if (!value.trim().length) {
          state.name = t("form.errors.emptyField", {
            field: t("form.fields.name"),
          });
        } else {
          delete state.name;
        }
      })
    );
  };

  const handleReason = (e) => {
    const value = e.target.value;
    if (!testRegexCheck(value)) return;
    setReason(value);
    setErrors(
      produce((state) => {
        if (!value.trim().length) {
          state.reason = t("form.errors.emptyField", {
            field: t("form.fields.reason"),
          });
        } else {
          delete state.reason;
        }
      })
    );
  };

  const handleTimeSelect = (e) => {
    setAppointmentTime(+e.target.value);
  };

  const handleArrowBtn = (e) => {
    e.stopPropagation();
    setCheckboxArrow(!checkboxArrow);
  };

  const handleBack = () => {
    const searchObj = {};
    if (location?.state?.pageNumber) {
      searchObj.pageNumber = location.state.pageNumber;
    }
    if (location?.state?.search) {
      searchObj.search = location.state.search;
    }
    if (location?.state?.specialtyId && location?.state?.specialtyName) {
      searchObj.specialtyId = location?.state?.specialtyId;
      searchObj.specialtyName = location?.state?.specialtyName;
    }
    history.push({
      pathname: constants.routes.doctors,
      search: qs.stringify(searchObj),
      state: location.state,
    });
  };
  const isFormValid = () => {
    const errs = cloneDeep(errors);
    //for appointemnt date
    if (!appointmentDate) {
      errs.appointmentDate = t("form.errors.emptySelection", {
        field: t("form.fields.date"),
      });
    } else {
      delete errs.appointmentDate;
    }
    //for apointment reason
    if (!reason.trim().length) {
      errs.reason = t("form.errors.emptyField", {
        field: t("form.fields.reason"),
      });
    } else {
      delete errs.reason;
    }
    // for name
    if (!patientName.trim().length) {
      errs.name = t("form.errors.emptyField", { field: t("form.fields.name") });
    } else {
      delete errs.name;
    }
    //for email
    if (!patientEmail.trim().length) {
      errs.email = t("form.errors.emptyField", {
        field: t("form.fields.emailAddress"),
      });
    } else {
      if (validateEmail(patientEmail)) {
        delete errs.email;
      } else {
        errs.email = t("form.errors.invalidValue", {
          field: t("form.fields.emailAddress"),
        });
      }
    }
    //for phone
    if (!patientPhone.trim().length) {
      errs.phone = t("form.errors.emptyField", {
        field: t("form.fields.phoneNumber"),
      });
    } else {
      if (validateNumber(patientPhone)) {
        delete errs.phone;
      } else {
        errs.phone = t("form.errors.invalidValue", {
          field: t("form.fields.phoneNumber"),
        });
      }
    }
    //for terms
    if (termsAccepted) {
      delete errs.terms;
    } else {
      errs.terms = t("patient.acceptTerms");
    }

    setErrors(errs);

    return !Object.values(errs).some((er) => !!er);
  };

  const confirmSubmitRequest = async () => {
    setConfirmModal(false);
    const payload = {
      //comman data to be send irrespective of which doctor.
      PatientName: patientName,
      PatientEmailId: patientEmail,
      PatientContactNumber: patientPhone,
      AppointmentDate: moment(appointmentDate).format("YYYY-MM-DD"),
      AppointmentTime: +appointmentTime,
      ReasonForVisit: reason,
    };
    if (!usefullInfo.isGoogleDoctor) {
      payload.DoctorId = +doctorId;
      payload.OfficeId = +officeId;
      payload.PlaceId = null;
    } else {
      payload.DoctorId = null;
      payload.PlaceId = usefullInfo.placeId;
      payload.BusinessDetail = {
        ContactNumber: usefullInfo.phoneNumber || "",
        Latitude: usefullInfo.location.lat,
        Longitude: usefullInfo.location.lng,
        Address: usefullInfo.address,
        BusinessName: usefullInfo.name,
        PlaceId: usefullInfo.placeId,
        WebsiteUrl: usefullInfo.website || "",
        UtcOffset: usefullInfo.utcOffset,
        BusinessHours: usefullInfo.businessHours || [],
      };
    }

    if (memberIdInLogoutCase && memberIdInLogoutCase !== profile.id)
      payload.patientFamilyMemberId = parseInt(memberIdInLogoutCase);

    if (memberId && memberId !== profile.id)
      payload.patientFamilyMemberId = parseInt(memberId);

    try {
      await requestAppointmentMutation.mutateAsync(payload);
      toast.success(t("patient.requestSuccessMessage"));
      handleBack();
    } catch (err) {
      toast.error(err?.message);
    }
  };

  const handleSubmitRequest = () => {
    if (isFormValid()) {
      if (!!profile) {
        setConfirmModal(true);
      } else {
        const requestAppointmentData = {
          appointmentDate,
          appointmentTime,
          reason,
          patientEmail,
          patientName,
          patientPhone,
          termsAccepted,
          isGoogleDoctor: usefullInfo.isGoogleDoctor,
          doctorId,
          officeId,
          googleDoctor: usefullInfo.isGoogleDoctor
            ? location?.state?.doctor
            : null,
        };
        sessionStorage.setItem(
          constants.localStorageKeys.requestAppointmentData,
          JSON.stringify(requestAppointmentData)
        );
        localStorage.removeItem(constants.lsKeys.bookAppointmentData);
        signIn?.();
      }
    }
  };

  useEffect(() => {
    if (profile) {
      setPatientPhone(profile.contactNumber);
      setPatientEmail(profile.emailId);
      setPatientName(`${profile.firstName} ${profile.lastName}`);
    }
  }, [profile]);

  useEffect(() => {
    //After initial render remove session storage data;
    sessionStorage.removeItem(
      constants.localStorageKeys.requestAppointmentData
    );
  }, []);

  const checkboxRef = useRef(null);

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
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <Page onBack={handleBack} title={t("patient.requestAnAppointment")}>
      {(isLoading || isLoadingSpecialties || requestingMutation) && <Loader />}
      <div className={"mb-5 form-wrapper "}>
        <div className={styles["request-form"]}>
          {!usefullInfo.isGoogleDoctor ? (
            doctorDetailsContent
          ) : (
            <ul className={styles["white-col-list"]}>
              <li>
                <Text
                  size="12px"
                  marginBottom="5px"
                  weight="400"
                  color="#6f7788"
                >
                  {t("patient.provider")}
                </Text>
                <Text size="14px" marginBottom="0" weight="600" color="#102c42">
                  {usefullInfo.name}
                </Text>
              </li>
              <li>
                <Text
                  size="12px"
                  marginBottom="5px"
                  weight="400"
                  color="#6f7788"
                >
                  {t("form.fields.address")}
                </Text>

                <Text size="14px" marginBottom="0" weight="600" color="#102C42">
                  {usefullInfo.address}
                </Text>
              </li>
            </ul>
          )}
          <div className={styles["mt-60"]}>
            {memberId && profile && memberId !== profile.id && (
              <>
                <div className="yellow-alert-box-font14">
                  <div>
                    {t("familyMembers.appointmentBookingMessageForMember")}
                  </div>
                </div>
                <div className="d-flex justify-content-between">
                  <div>
                    <div className={styles["family-member-label"]}>
                      {t("familyMembers.patientName")}
                    </div>
                    <div className={styles["family-member-value"]}>{`${
                      singleMemberDetail?.firstName || ""
                    } ${singleMemberDetail?.lastName || ""}`}</div>
                  </div>
                  {singleMemberDetail?.email && (
                    <div>
                      <div className={styles["family-member-label"]}>
                        {t("familyMembers.patientEmailAddress")}
                      </div>
                      <div
                        className={styles["family-member-value"]}
                      >{`${singleMemberDetail?.email}`}</div>
                    </div>
                  )}
                </div>
              </>
            )}
            <Text size="16px" marginBottom="25px" weight="600" color="#587E85">
              {t("patient.appointmentInformation")}
            </Text>
            <div className="c-field">
              <label>{t("patient.selectYourPreferredAppointmentDate")}</label>
              <div className="d-flex inputdate">
                <DatePicker
                  dateFormat="dd-MM-yyyy"
                  className="c-form-control"
                  minDate={new Date()}
                  selected={appointmentDate}
                  onSelect={setAppointmentDate}
                  ref={datePickerRef}
                />
                {errors.appointmentDate && (
                  <span className="error-msg">{errors.appointmentDate}</span>
                )}
              </div>
            </div>
            <div className="c-field">
              <label className="mb-md-3">
                {t("patient.selectTimeOptional")}
              </label>
              <div className="ch-radio">
                <label className="mr-4">
                  <input
                    type="radio"
                    name="selectTime"
                    value={constants.appointmentTimeTypes.Morning}
                    checked={
                      appointmentTime === constants.appointmentTimeTypes.Morning
                    }
                    onChange={handleTimeSelect}
                  />
                  <span> {t("patient.morning")} </span>
                </label>
                <label className="mr-4">
                  <input
                    type="radio"
                    name="selectTime"
                    value={constants.appointmentTimeTypes.Afternoon}
                    checked={
                      appointmentTime ===
                      constants.appointmentTimeTypes.Afternoon
                    }
                    onChange={handleTimeSelect}
                  />
                  <span> {t("patient.afternoon")} </span>
                </label>{" "}
                <label className="mr-4">
                  <input
                    type="radio"
                    name="selectTime"
                    value={constants.appointmentTimeTypes.Evening}
                    checked={
                      appointmentTime === constants.appointmentTimeTypes.Evening
                    }
                    onChange={handleTimeSelect}
                  />
                  <span> {t("patient.evening")} </span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="selectTime"
                    value={constants.appointmentTimeTypes.Anytime}
                    checked={
                      appointmentTime === constants.appointmentTimeTypes.Anytime
                    }
                    onChange={handleTimeSelect}
                  />
                  <span> {t("patient.anytime")} </span>
                </label>
              </div>
            </div>
            <div className="c-field">
              <label>{t("patient.ReasonForYourVisit")}</label>
              <textarea
                className="c-form-control"
                placeholder="Enter Reason"
                name="title"
                maxLength="600"
                onChange={handleReason}
                value={reason}
              />
              {errors.reason && (
                <span className="error-msg">{errors.reason}</span>
              )}
            </div>
          </div>
          <div className={styles["mt-60"]}>
            <Text size="16px" marginBottom="25px" weight="600" color="#587E85">
              {t("patient.yourContactInformation")}
            </Text>
            <Input
              MaxLength={120}
              Title={t("form.fields.name") + "*"}
              Type="text"
              Value={patientName}
              HandleChange={handlePatientName}
              Placeholder={t("form.placeholder1", {
                field: t("form.fields.name"),
              })}
              Error={errors.name}
            />
            <Input
              MaxLength={320}
              Title={t("form.fields.emailAddress") + "*"}
              Type="email"
              Value={patientEmail}
              HandleChange={handlePatientEmail}
              Placeholder={t("form.placeholder1", {
                field: t("form.fields.emailAddress"),
              })}
              Error={errors.email}
            />
            <Input
              MaxLength={16}
              Title={t("form.fields.phoneNumber") + "*"}
              Type="text"
              Value={patientPhone}
              HandleChange={handlePatientPhone}
              Placeholder={t("form.placeholder1", {
                field: t("form.fields.phoneNumber"),
              })}
              Error={errors.phone}
            />
            <div
              className={"ch-checkbox c-field d-md-flex " + styles["checkbox"]}
            >
              <input
                ref={checkboxRef}
                type="checkbox"
                checked={termsAccepted}
                onClick={handleTerms}
              />
              <span
                onClick={() =>
                  checkboxRef.current && checkboxRef.current.click()
                }
              >
                {t("patient.termsAndConditionsBeforeText")}{" "}
                <strong className="link-btn" onClick={handleArrowBtn}>
                  {t("patient.termsAndConditions")}
                </strong>{" "}
                {checkboxArrow && (
                  <img
                    src={require("assets/images/up-arrow.svg").default}
                    alt="icon"
                  />
                )}
                {!checkboxArrow && (
                  <img
                    src={require("assets/images/caret-587E85.svg").default}
                    alt="icon"
                  />
                )}
              </span>
            </div>
            {checkboxArrow && (
              <Text size="12px" color="#79869A" paddingLeft="30px">
                {t("patient.requestAppointmentTerms")}
              </Text>
            )}
            {errors.terms && (
              <span className={"error-msg " + styles["terms-error"]}>
                {errors.terms}
              </span>
            )}
          </div>
          <div className={styles["mt-60"]}>
            <button
              className="button button-round button-shadow  mr-sm-3 mb-3 w-sm-100"
              title={t("submit")}
              onClick={handleBookAppointment}
            >
              {t("submit")}
            </button>
            <button
              className="button button-round button-dark button-border mb-md-3 btn-mobile-link"
              title={t("cancel")}
              onClick={handleBack}
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      </div>
      <CustomModal
        isOpen={confirmModal}
        setIsOpen={setConfirmModal}
        title={t("patient.requestAppointmentModal.title")}
        subTitle1={
          usefullInfo.isGoogleDoctor
            ? ""
            : t("patient.requestAppointmentModal.subTitle1")
        }
        subTitle2={t("patient.requestAppointmentModal.subTitle2")}
        leftBtnText={t("submit")}
        rightBtnText={t("cancel")}
        onConfirm={confirmSubmitRequest}
      />
      <BookAppointmentModal
        isBookAppointmentModalOpen={isBookAppointmentModalOpen}
        setIsBookAppointmentModalOpen={setIsBookAppointmentModalOpen}
        loggedInUserId={profile?.id}
        handleMemberClick={(id) => {
          setMemberIdInLogoutCase(id);
          setConfirmModal(true);
        }}
      />
    </Page>
  );
}

export default withTranslation()(RequestAnAppointment);
