import React from "react";
import { withTranslation } from "react-i18next";
import "./Detail.scss";

const DetailCard = ({ isLoading, personnel, t }) => {
  let nameValue = (
    <div className="pd-dc-value-placeholder shimmer-animation"></div>
  );
  let emailValue = (
    <div className="pd-dc-value-placeholder shimmer-animation"></div>
  );

  if (!isLoading) {
    nameValue = (
      <div className="pd-dc-value">
        {personnel.firstName} {personnel.lastName}
      </div>
    );
    emailValue = <div className="pd-dc-value">{personnel.emailId}</div>;
  }

  return (
    <div className="card app-card">
      <div className="card-body app-card-body">
        <div className="d-flex flex-row justify-content-between">
          <div className="pd-dc-title">{t("superAdmin.personnelName")}</div>
          {nameValue}
        </div>

        <hr />

        <div className="d-flex flex-row justify-content-between">
          <div className="pd-dc-title">{t("form.fields.emailAddress")}</div>
          {emailValue}
        </div>
      </div>
    </div>
  );
};

export default withTranslation()(DetailCard);
