import React from "react";
import { withTranslation } from "react-i18next";
import Text from "components/Text";
import styles from "./Home.module.scss";
import Rating from "patient-scheduling/components/Rating";
import { getDoctorFullName, getFullAddress } from "utils";

const popupNameLimit = 20;

function MapPinPopup({
  t,
  handleInfoPopupClose,
  activeMarker: activeDoctor,
  clickHandlers,
}) {
  const { handleCall, handleBookAppointment, handleRequestAppointment } =
    clickHandlers;

  const getSlicedName = (name) => {
    return name?.length > popupNameLimit
      ? name.slice(0, popupNameLimit).concat(" ...")
      : name;
  };

  const useFullData = {};
  if (activeDoctor) {
    if (activeDoctor.isGoogleDoctor) {
      useFullData.name = getSlicedName(activeDoctor.name);
      useFullData.longName = activeDoctor.name;
      useFullData.address = activeDoctor.address;
    } else {
      useFullData.name = getSlicedName(
        getDoctorFullName(
          activeDoctor.firstName,
          activeDoctor.lastName,
          activeDoctor.honorific
        )
      );
      useFullData.longName = getDoctorFullName(
        activeDoctor.firstName,
        activeDoctor.lastName,
        activeDoctor.honorific
      );
      useFullData.address = getFullAddress(activeDoctor.officeLocation, t);
    }
  }

  const addDefaultSrc = (ev) => {
    ev.target.src = require("assets/images/staff-default.svg").default;
    ev.target.onerror = null;
  };

  return (
    <div className={styles["map-pin-popup"]}>
      <span className={styles["closr-icon"]} onClick={handleInfoPopupClose}>
        <img
          src={require("assets/images/cross.svg").default}
          alt="icon"
          onClick={handleInfoPopupClose}
        />
      </span>
      <div className={styles["map-wrapper"]}>
        <img
          src={
            activeDoctor.profilePic ||
            require("assets/images/staff-default.svg").default
          }
          onError={addDefaultSrc}
          alt="icon"
        />

        <div className={styles["text-box"]}>
          <Text
            className="cursor-pointer"
            secondary
            width="100%"
            size="16px"
            weight="600"
            ellipsis
            title={useFullData.longName}
          >
            {useFullData.name}
          </Text>

          {!activeDoctor.isGoogleDoctor && (
            <Text size="10px" color="#87928d">
              {activeDoctor.specialities}
            </Text>
          )}
          {(activeDoctor.isGoogleDoctor ||
            activeDoctor.isSubscriptionPurchased) && (
            <div className={styles["rating-box"]}>
              <Rating rating={activeDoctor.overallRating} />
            </div>
          )}
          {!activeDoctor.isGoogleDoctor && (
            <Text secondaryDark1 weight="500" size="12px" color="#2A4642">
              {activeDoctor.office.name}
            </Text>
          )}

          <Text className="addressField" size="12px" color="#6f7788">
            {useFullData.address}
          </Text>
        </div>
      </div>
      <div className={styles["btn-col"]}>
        {!activeDoctor.isGoogleDoctor &&
        activeDoctor.isSubscriptionPurchased ? (
          <button
            className="button button-round button-shadow mb-2"
            title={t("bookNow")}
            onClick={() => handleBookAppointment(activeDoctor)}
          >
            {t("bookNow")}
          </button>
        ) : (
          <button
            className="button button-round button-shadow mb-2"
            title={t("patient.requestAppointment")}
            onClick={() => handleRequestAppointment(activeDoctor)}
          >
            {t("patient.requestAppointment")}
          </button>
        )}
        <button
          className="button button-round button-dark button-border"
          title={t("call")}
          onClick={() => handleCall(activeDoctor)}
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
  );
}

export default withTranslation()(MapPinPopup);
