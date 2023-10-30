import React, { Fragment, useState } from "react";
import { Row, Col } from "reactstrap";
import Text from "components/Text";
import qs from "query-string";
import useQueryParam from "hooks/useQueryParam";
import styles from "./../DoctorDetail.module.scss";
import userDefaultImage from "./../../../../assets/images/staff-default.svg";
import BookAppointment from "./BookAppointment";
import Rating from "./Rating";
import { encodeId, getDoctorFullName } from "utils";
import { Link, useHistory } from "react-router-dom";
import constants from "./../../../../constants";
import AppointmentBooked from "./AppointmentBooked";

function FullDetail({
  detail,
  initialAppointmentDate,
  isLoadingSpecialties,
  specialties,
  signIn,
  t,
  to,
}) {
  const [isAppointmentBooked, setIsAppointmentBooked] = useState(false);
  const history = useHistory();
  const memberId = useQueryParam("memberId", null);

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

  const goToRequestAppointmentPage = () => {
    const searchParams = {
      doctorId: detail.id,
      officeId: detail.office.id,
    };

    if (memberId) {
      searchParams.memberId = memberId;
    }

    history.push({
      pathname: constants.routes.watingListRequest,
      search: qs.stringify(searchParams),
    });

    // history.push(`${constants.routes.watingListRequest}?doctorId=${detail.id}&officeId=${detail.office.id}`);
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
          <BookAppointment
            to={to}
            initialAppointmentDate={initialAppointmentDate}
            doctorId={detail.id}
            office={detail.office}
            onAppointmentBooked={() => setIsAppointmentBooked(true)}
            goToRequestAppointmentPage={goToRequestAppointmentPage}
            signIn={signIn}
          />
        )}

        {isAppointmentBooked && <AppointmentBooked />}
      </Col>
    </Row>
  );
}

export default FullDetail;
