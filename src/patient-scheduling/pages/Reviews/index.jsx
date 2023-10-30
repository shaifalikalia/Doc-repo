import React from "react";
import { withTranslation } from "react-i18next";
import qs from "query-string";
import Page from "components/Page";
import DoctorInfo from "./DoctorInfo";
import ReviewList from "./ReviewList";
import styles from "./Reviews.module.scss";
import constants from "./../../../constants";
import { decodeId } from "utils";

function Reviews({ history, location, t }) {
  let { doctorId, officeId } = qs.parse(location.search);

  try {
    doctorId = decodeId(doctorId);
    officeId = decodeId(officeId);
  } catch (e) {
    history.push(constants.routes.doctors);
    return null;
  }

  const goBack = () => {
    history.push({
      pathname: constants.routes.doctor,
      search: qs.stringify({ doctorId, officeId }),
    });
  };

  return (
    <Page
      className={styles.page}
      titleKey="patient.ratingsReviewsTitle"
      onBack={goBack}
    >
      <div className={styles.card}>
        <div className={styles.container}>
          <DoctorInfo doctorId={doctorId} officeId={officeId} t={t} />
          <div className="mt-4">
            <ReviewList doctorId={doctorId} officeId={officeId} t={t} />
          </div>
        </div>
      </div>
    </Page>
  );
}

export default withTranslation()(Reviews);
