import React from "react";
import { connect } from "react-redux";
import { officeFieldData } from "actions/index";
import { useHistory } from "react-router";
import { withTranslation } from "react-i18next";
const SetupOffice = (props) => {
  const history = useHistory();

  const handleAddOffice = () => {
    props.officeFieldData({});
    history.push("/AddOffice");
  };

  return (
    <div className="setup-office-card" onClick={handleAddOffice}>
      <div className="card-content">
        <span className="ico">
          <img
            src={require("assets/images/add-icon.svg").default}
            alt="add-icon"
          />
        </span>
        <h4>{props.t("accountOwner.setupOffice")}</h4>
      </div>
    </div>
  );
};

export default connect(null, { officeFieldData })(
  withTranslation()(SetupOffice)
);
