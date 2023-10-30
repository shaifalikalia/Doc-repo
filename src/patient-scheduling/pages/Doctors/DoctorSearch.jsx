import React from "react";
import styles from "./Home.module.scss";
import Text from "components/Text";
import { withTranslation } from "react-i18next";
import searchIcon from "./../../../assets/images/search-icon.svg";

function DoctorSearch({ t }) {
  return (
    <div className={` ${styles["doctor-search-box"]}`}>
      <ul>
        <li>
          <div className={styles["img-box"]}>
            <img
              src="https://media.istockphoto.com/photos/indian-doctor-picture-id179011088?s=170667a"
              alt="img"
            />
          </div>
          <div>
            <Text secondary size="14px" weight="600">
              {t("superAdmin.doctorTitleName")}
            </Text>
            <Text color="#6f7788" size="12px">
              {t("dentist")}
            </Text>
          </div>
        </li>
        <li>
          <div className={styles["img-box"]}>
            <img
              src="https://media.istockphoto.com/photos/indian-doctor-picture-id179011088?s=170667a"
              alt="img"
            />
          </div>
          <div>
            <Text secondary size="14px" weight="600">
              {t("superAdmin.doctorTitleName")}
            </Text>
            <Text color="#6f7788" size="12px">
              {t("dentist")}
            </Text>
          </div>
        </li>
      </ul>
      <div className={styles["search-all"]}>
        <img src={searchIcon} alt="ico" />
        <span className={styles["search-text"]}>
          <Text size="12px" secondary>
            Search all with ’Tom’
          </Text>
        </span>
      </div>
    </div>
  );
}

export default withTranslation()(DoctorSearch);
