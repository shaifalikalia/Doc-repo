import React from "react";
import { Row, Col } from "reactstrap";
import Text from "components/Text";
import styles from "./DoctorDetail.module.scss";
import userDefaultImage from "./../../../assets/images/staff-default.svg";
import { getDoctorFullName } from "utils";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import constants from "../../../constants.js";

export default function Detail({
  detail,
  isLoadingSpecialties,
  specialties,
  t,
}) {
  let specialtiesContent = null;
  if (!isLoadingSpecialties && specialties.length > 0) {
    specialtiesContent = specialties.map((it) => (
      <>
        {it.title} <br />
      </>
    ));
  } else if (!isLoadingSpecialties && specialties.length === 0) {
    specialtiesContent = "Not Added.";
  }

  const getFullAddress = (location) => {
    let fullAddress = "";
    const address = location.address || "";
    const city = location.city || "";
    const state = location.state || "";
    const country = location.country || "";
    if (address && (city || state || country)) {
      fullAddress =
        address +
        (city ? ", " + city : city) +
        (city || state ? ", " + state : state) +
        (city || state || country ? ", " + country : country);
    }
    return fullAddress ? fullAddress : t("notAdded");
  };

  const addDefaultSrc = (ev) => {
    ev.target.src = userDefaultImage;
    ev.target.onerror = null;
  };

  const handleCall = () => {
    if (detail?.office?.contactNumber) {
      window.open(`tel:${detail.office.contactNumber}`, "_self");
    } else {
      toast.error(t("patient.noPhoneError"));
    }
  };
  return (
    <Row className="no-gutters">
      <Col lg="6">
        {/* Doctor detail */}
        <div className={styles["doctor-detail-card"]}>
          <div className={styles["intro-box"]}>
            <img
              src={detail.profilePic || userDefaultImage}
              onError={addDefaultSrc}
              alt="profile"
            />
            <div>
              <Text secondary size="18px" weight="600" ellipsis>
                {getDoctorFullName(
                  detail.firstName,
                  detail.lastName,
                  detail.honorific
                )}
              </Text>
              <Text size="14px" weight="300" ellipsis>
                {detail.designation.name}
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
              {detail.office.name}
              <br />
              {getFullAddress(detail.officeLocation)}
            </Text>
          </div>
          {/* Office Address */}

          {/* Specialties */}
          <div className="mb-4">
            <Text size="12px" color="#6f7788">
              {t("superAdmin.specialtiesOrServices")}
            </Text>
            <Text size="14px" weight="600" color="#102c42">
              {specialtiesContent}
            </Text>
          </div>
          {/* Specialties */}
          <div>
            <Link
              to={{
                pathname: constants.routes.requestAnAppointment,
                search: `?doctorId=${detail.id}&officeId=${detail.office.id}`,
              }}
            >
              <button
                className="button button-round button-shadow mb-3 mr-3"
                title={t("patient.requestAppointment")}
              >
                {t("patient.requestAppointment")}
              </button>
            </Link>
            <button
              className="button button-round button-dark button-border d-inline-flex align-items-center"
              title={t("call")}
              onClick={handleCall}
            >
              <img
                className="mr-2"
                src={require("assets/images/call-icon.svg").default}
                alt="icon"
              />
              {t("call")}
            </button>
          </div>
        </div>
      </Col>
      <Col lg="6">
        <div className={styles["appointment-booked"]}>
          <Text secondary size="16px" weight="600" marginBottom="16px">
            {t("patient.contactDetails")}
          </Text>

          <Text color="#6f7788" size="12px" weight="400" marginBottom="5px">
            {t("patient.phoneNo")}
          </Text>

          <Text size="14px" weight="600" color="#102c42">
            {detail.office.contactNumber || t("notAdded")}
          </Text>
        </div>
      </Col>
    </Row>
  );
}
