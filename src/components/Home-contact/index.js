import React from "react";
import ScheduleForm from "./components/schedule-form";
import ReachUs from "./components/reach-us";
import { withTranslation } from "react-i18next";

const HomeContact = (props) => {
  return (
    <div className="contact-section contact-section-home" id="contact">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <div className="schedule-block">
              <h2>{props.t("scheduleADemo")}</h2>
              <h4>{props.t("scheduleADemoText")}</h4>
              <ScheduleForm />
            </div>
          </div>
          <div className="col-md-6">
            <ReachUs companyInformation={props.companyInformation} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default withTranslation()(HomeContact);
