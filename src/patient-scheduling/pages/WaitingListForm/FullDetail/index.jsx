import React, { Fragment, useState } from "react";
import { Row, Col } from "reactstrap";
import Text from "components/Text";
import styles from "../DoctorDetail.module.scss";
import userDefaultImage from "./../../../../assets/images/staff-default.svg";
import Rating from "./Rating";
import { encodeId, getDoctorFullName } from "utils";
import { Link } from "react-router-dom";
import constants from "../../../../constants";
import AppointmentBooked from "./AppointmentBooked";
import RequestAppointment from "./RequestAppointment";

function FullDetail({
  detail,
  isLoadingSpecialties,
  specialties,
  signIn,
  t,
  profile,
  onBack,
}) {
  const [isAppointmentBooked, setIsAppointmentBooked] = useState(false);

  let specialtiesContent = null;
  if (!isLoadingSpecialties && specialties.length > 0) {
    specialtiesContent = specialties.map((it, index) => (
      <Fragment key={index}>
        {it.title} <br />
      </Fragment>
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
            <Text
              size="14px"
              weight="600"
              color="#102c42"
              className="addressField"
            >
              {detail.office.name}
              <br />
              {getFullAddress(detail.officeLocation)}
            </Text>
            <div className="mb-4">
              <Link
                to={{
                  pathname: constants.routes.doctorOffices.replace(
                    ":doctorId",
                    encodeId(detail.id)
                  ),
                  state: {
                    officeId: detail.office.id,
                    doctorName: getDoctorFullName(
                      detail.firstName,
                      detail.lastName,
                      detail.honorific
                    ),
                  },
                }}
                className={styles["anchor-link"]}
              >
                {t("patient.viewOffice", { count: detail.totalOffices })}
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
              {specialtiesContent}
            </Text>
          </div>
          {/* Specialties */}

          <Rating
            doctorId={detail.id}
            officeId={detail.office.id}
            averageRating={detail.overallRating}
          />
        </div>
      </Col>
      <Col lg="6">
        {!isAppointmentBooked && (
          <RequestAppointment
            doctorId={detail.id}
            officeId={detail.office.id}
            signIn={signIn}
            profile={profile}
            onBack={onBack}
            setIsAppointmentBooked={setIsAppointmentBooked}
          />
        )}

        {isAppointmentBooked && <AppointmentBooked />}
      </Col>
    </Row>
  );
}

export default FullDetail;
