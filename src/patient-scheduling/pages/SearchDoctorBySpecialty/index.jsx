import React from "react";
import styles from "./SearchDoctorBySpecialty.module.scss";
import { withTranslation } from "react-i18next";
import Page from "components/Page";
import CommonSpecialties from "./CommonSpecialties";
import Search from "./Search";

function SearchDoctorBySpecialty({ t }) {
  return (
    <Page className={styles.page} titleKey="patient.findDoctorSpecialty">
      <div>
        <Search t={t} />
        <CommonSpecialties t={t} />
      </div>
    </Page>
  );
}

export default withTranslation()(SearchDoctorBySpecialty);
