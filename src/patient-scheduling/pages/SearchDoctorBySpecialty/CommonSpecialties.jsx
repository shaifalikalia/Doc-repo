import React from "react";
import { Row, Col } from "reactstrap";
import styles from "./SearchDoctorBySpecialty.module.scss";
import Card from "components/Card";
import Text from "components/Text";
import { useCommonSpecialties } from "repositories/specialty-repository";
import Toast from "components/Toast/Alert";
import { Link } from "react-router-dom";
import constants from "./../../../constants";
import qs from "query-string";
import { encodeId } from "utils";

export default function CommonSpecialties({ t }) {
  const { isLoading, data, error } = useCommonSpecialties(1, 1000, null);

  let content = null;
  if (isLoading) {
    content = (
      <div className="center" style={{ minHeight: 200 }}>
        <div className="loader"></div>
      </div>
    );
  }

  if (!isLoading && error) {
    content = <Toast errorToast message={error.message} />;
  }

  if (!isLoading && data) {
    const specialties = data.items;
    let firstSeparator = parseInt(specialties.length / 3);
    firstSeparator =
      specialties.length % 3 === 0 ? firstSeparator : firstSeparator + 1;
    let secondSeparator = firstSeparator + parseInt(specialties.length / 3);
    secondSeparator =
      specialties.length % 3 === 2 ? secondSeparator + 1 : secondSeparator;

    content = (
      <Row>
        <Col lg="4">
          <ul className={styles["speciality-list"]}>
            {specialties.slice(0, firstSeparator).map((it) => (
              <li key={it.id}>
                <SpecialtyLink specialty={it} />
              </li>
            ))}
          </ul>
        </Col>
        <Col lg="4">
          <ul className={styles["speciality-list"]}>
            {specialties.slice(firstSeparator, secondSeparator).map((it) => (
              <li key={it.id}>
                <SpecialtyLink specialty={it} />
              </li>
            ))}
          </ul>
        </Col>
        <Col lg="4">
          <ul
            className={`${styles["speciality-list"]} ${styles["speciality-list-last"]}`}
          >
            {specialties
              .slice(secondSeparator, specialties.length)
              .map((it) => (
                <li key={it.id}>
                  <SpecialtyLink specialty={it} />
                </li>
              ))}
          </ul>
        </Col>
      </Row>
    );
  }

  return (
    <Card className={styles["speciality-card"]}>
      <Text>{t("patient.selectSpecialty")}</Text>
      {content}
    </Card>
  );
}

function SpecialtyLink({ specialty }) {
  return (
    <Link
      to={{
        pathname: constants.routes.doctors,
        search: qs.stringify({
          specialtyId: encodeId(specialty.id),
          specialtyName: specialty.title,
        }),
      }}
    >
      {specialty.title}
    </Link>
  );
}
