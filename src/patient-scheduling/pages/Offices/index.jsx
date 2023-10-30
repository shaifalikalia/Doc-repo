import React from "react";
import styles from "./Offices.module.scss";
import { withTranslation } from "react-i18next";
import Page from "components/Page";
import OfficeGrid from "./OfficeGrid";
import { decodeId } from "utils";
import qs from "query-string";
import constants from "./../../../constants";

function Offices({ match, location, history, t }) {
  let doctorId = null;
  try {
    doctorId = decodeId(match.params.doctorId);
  } catch (e) {
    history.push(constants.routes.doctors);
    return null;
  }

  if (
    isNaN(doctorId) ||
    !location.state ||
    !location.state.officeId ||
    !location.state.doctorName
  ) {
    history.push(constants.routes.doctors);
    return null;
  }

  const { officeId, doctorName } = location.state;

  const goBack = () => {
    history.push({
      pathname: location?.state?.backTo
        ? location?.state?.backTo
        : constants.routes.doctor,
      search: qs.stringify({ doctorId, officeId }),
    });
  };

  return (
    <Page
      className={styles["doctor-office-page"]}
      title={t("patient.officesPageTitle", { doctorName })}
      onBack={goBack}
    >
      <OfficeGrid doctorId={doctorId} />
    </Page>
  );
}

export default withTranslation()(Offices);
