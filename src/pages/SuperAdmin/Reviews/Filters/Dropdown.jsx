import React from "react";
import { withTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router";
import Select from "react-select";
import qs from "query-string";
import constants from "./../../../../constants";
import useStatus from "../../useStatus";

function Dropdown({ t }) {
  const history = useHistory();
  const location = useLocation();
  const status = useStatus();

  const options = [
    {
      value: 0,
      label: t("superAdmin.allReviewsAndRatings"),
    },
    {
      value: 1,
      label: t("active"),
    },
    {
      value: 2,
      label: t("inactive"),
    },
  ];

  const onChange = (v) => {
    let query = qs.parse(location.search);

    if (!query) {
      query = {};
    }

    if (v.value === 0) {
      delete query.status;
    } else {
      query.status = v.value;
    }

    query.pageNumber = 1;

    history.push({
      pathname: constants.routes.superAdmin.reviews,
      search: qs.stringify(query),
    });
  };

  const selectValue = () => {
    if (status === null) {
      return options[0];
    } else if (status === true) {
      return options[1];
    } else {
      return options[2];
    }
  };

  return (
    <div className="member-filter review-rating-filter">
      <Select
        options={options}
        onChange={onChange}
        value={selectValue()}
        isSearchable={false}
        className={["react-select-container pl-2"]}
        classNamePrefix="react-select"
      />
    </div>
  );
}

export default withTranslation()(Dropdown);
