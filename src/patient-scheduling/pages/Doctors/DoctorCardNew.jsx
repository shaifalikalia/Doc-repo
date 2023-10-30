import Text from "components/Text";
import React, { useState } from "react";
import styles from "./Home.module.scss";
import { withTranslation } from "react-i18next";
import { useGetMembersForBooking } from "repositories/family-member-repository";
import userDefaultImage from "./../../../assets/images/staff-default.svg";
import Rating from "patient-scheduling/components/Rating";
import { getDoctorFullName, getFullAddress } from "utils";
import DialerModal from "./DialerModal";
import BookAppointmentModal from "./BookAppointmentModal";
import { useSelector } from "react-redux";
import useHandleApiError from "hooks/useHandleApiError";

const nameCharLimit = 40;

function DoctorCard({ doctor, t, ...props }) {
  const { setActiveMarker, clickHandlers } = props;
  const profile = useSelector((state) => state.userProfile.profile);

  const { handleCall, handleBookAppointment, handleRequestAppointment } =
    clickHandlers;
  const [appointmentType, setAppointmentType] = useState("");
  const openBookAppointmentPopUp = (type) => {
    setIsBookAppointmentModalOpen(true);
    setAppointmentType(type);
  };

  const PAGE_SIZE = 2;
  const memberPageNumber = 1;
  const {
    data,
    error: isError,
    isLoading,
    isFetching,
  } = useGetMembersForBooking(memberPageNumber, PAGE_SIZE, {
    enabled: !!profile?.id,
  });

  useHandleApiError(isLoading, isFetching, isError);

  const [isBookAppointmentModalOpen, setIsBookAppointmentModalOpen] =
    useState(false);

  const [issaveDialerModalOpen, setIsSaveDialerModalOpen] = useState(false);

  const addDefaultSrc = (ev) => {
    ev.target.src = userDefaultImage;
    ev.target.onerror = null;
  };

  const handleDoctorClick = () => {
    setActiveMarker(doctor);
  };

  const getSlicedName = (name) => {
    return name.length > nameCharLimit
      ? name.slice(0, nameCharLimit).concat(" ...")
      : name;
  };

  const useFullData = {};
  if (doctor) {
    if (doctor.isGoogleDoctor) {
      useFullData.name = getSlicedName(doctor.name);
      useFullData.fullName = doctor.name;
      useFullData.address = doctor.address;
    } else {
      useFullData.name = getSlicedName(
        getDoctorFullName(doctor.firstName, doctor.lastName, doctor.honorific)
      );
      useFullData.fullName = getDoctorFullName(
        doctor.firstName,
        doctor.lastName,
        doctor.honorific
      );
      useFullData.address = getFullAddress(doctor.officeLocation, t);
    }
  }

  return (
    <>
      <div
        className={
          styles["doctor-card-container"] + " " + styles["doctor-card-new"]
        }
        onClick={handleDoctorClick}
      >
        <div className={styles["col-left"]}>
          <img
            src={doctor.profilePic || userDefaultImage}
            onError={addDefaultSrc}
            alt="profile"
          />
          <div className={styles["text-box"]}>
            <Text
              secondary
              width="95%"
              size="16px"
              weight="600"
              ellipsis
              title={useFullData.fullName}
            >
              {useFullData.name}
            </Text>

            {!doctor.isGoogleDoctor && (
              <Text size="10px" color="#87928d">
                {doctor.specialities}
              </Text>
            )}

            {(doctor.isGoogleDoctor || doctor.isSubscriptionPurchased) && (
              <div className={styles["rating-box"]}>
                <Rating rating={doctor.overallRating} />
              </div>
            )}
            {!doctor.isGoogleDoctor && (
              <Text secondaryDark1 weight="500" size="12px" color="#2A4642">
                {doctor.office.name}
              </Text>
            )}

            <Text className="addressField" size="12px" color="#6f7788">
              {useFullData.address}
            </Text>
          </div>
        </div>
        <div className={styles["col-right"]}>
          {!doctor.isGoogleDoctor && doctor.isSubscriptionPurchased ? (
            <button
              className="button button-round button-shadow mb-3"
              title={t("bookNow")}
              onClick={(e) => {
                e.stopPropagation();
                data?.data?.length > 1
                  ? openBookAppointmentPopUp("bookAppointment")
                  : handleBookAppointment(doctor, profile?.id);
              }}
            >
              {t("bookNow")}
            </button>
          ) : (
            <button
              className="button button-round button-shadow mb-3"
              title={t("patient.requestAppointment")}
              onClick={(e) => {
                e.stopPropagation();
                data?.data?.length > 1
                  ? openBookAppointmentPopUp("requestAppointment")
                  : handleRequestAppointment(doctor, profile?.id);
              }}
            >
              {t("patient.requestAppointment")}
            </button>
          )}
          <button
            className="button button-round button-dark button-border"
            onClick={(e) => {
              e.stopPropagation();
              handleCall(doctor);
            }}
            title={t("call")}
          >
            <img
              className={styles.icon}
              src={require("assets/images/phone-icon-green.svg").default}
              alt="icon"
            />
            <img
              className={styles.iconwhite}
              src={require("assets/images/phone-icon-white.svg").default}
              alt="icon"
            />

            {t("call")}
          </button>
        </div>
      </div>
      {issaveDialerModalOpen && (
        <DialerModal
          issaveDialerModalOpen={issaveDialerModalOpen}
          setIsSaveDialerModalOpen={setIsSaveDialerModalOpen}
        />
      )}
      {isBookAppointmentModalOpen && (
        <BookAppointmentModal
          isBookAppointmentModalOpen={isBookAppointmentModalOpen}
          setIsBookAppointmentModalOpen={setIsBookAppointmentModalOpen}
          loggedInUserId={profile?.id}
          handleMemberClick={(memberId) => {
            appointmentType === "bookAppointment"
              ? handleBookAppointment(doctor, memberId)
              : handleRequestAppointment(doctor, memberId);
          }}
        />
      )}
    </>
  );
}

export default withTranslation()(DoctorCard);
