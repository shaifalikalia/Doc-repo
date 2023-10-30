import React, { useState } from "react";
import Card from "components/Card";
import styles from "./SearchDoctorBySpecialty.module.scss";
import searchIcon from "./../../../assets/images/search-icon.svg";
import { useSpecialtiesByName } from "repositories/specialty-repository";
import Text from "components/Text";
import { Link } from "react-router-dom";
import constants from "./../../../constants";
import qs from "query-string";
import { encodeId } from "utils";

export default function Search({ t }) {
  const [searchTerm, setSearchTerm] = useState("");
  const { isLoading, data } = useSpecialtiesByName(
    searchTerm.trim(),
    1,
    10,
    searchTerm.trim().length > 2
  );

  return (
    <Card className={`${styles["search-input-card"]}`}>
      <div className={styles["input-card-layout"]}>
        <img src={searchIcon} alt="search-icon" />
        <input
          className={styles["search-input"]}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t("patient.searchBySpecialty")}
        />
      </div>
      {!isLoading && data && data.items.length > 0 && (
        <Dropdown specialties={data.items} />
      )}
    </Card>
  );
}

function Dropdown({ specialties }) {
  const specialtiesElementList = specialties.map((it) => (
    <li key={it.id}>
      <Link
        to={{
          pathname: constants.routes.doctors,
          search: qs.stringify({
            specialtyId: encodeId(it.id),
            specialtyName: it.title,
          }),
        }}
      >
        <Text secondary size="14px" weight="600">
          {it.title}
        </Text>
      </Link>
    </li>
  ));

  return (
    <div className={styles["doctor-search-box"]}>
      <ul className={styles["services-list"]}>{specialtiesElementList}</ul>
    </div>
  );
}
