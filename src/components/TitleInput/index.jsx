import CustomDropdown from "components/Dropdown";
import React from "react";
import { withTranslation } from "react-i18next";
import constants from "./../../constants";

const options = constants.titles.map((it) => ({ id: it.id, name: it.text }));

function TitleInput({ value, error, onChange, t }) {
  return (
    <div className="c-field">
      <label>{t("title")}</label>
      <div className="custom-dropdown-only">
        <CustomDropdown
          options={options}
          selectedOption={value}
          selectOption={(id) => {
            if (onChange) {
              onChange(parseInt(id));
            }
          }}
        />
        {error && <span className="error-msg">{error}</span>}
      </div>
    </div>
  );
}

export default withTranslation()(TitleInput);
