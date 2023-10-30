import constants from "./../../constants";
import React from "react";
import { useLocation } from "react-router";
import Header from "./index";
import HomeHeader from "./../../components/Home-Header";
import PatientHeader from "./../../patient-scheduling/components/Header";
import { useSelector } from "react-redux";

const doctorOpenPages = [
  constants.routes.doctors,
  constants.routes.doctor,
  constants.routes.setLocation,
  constants.routes.requestAnAppointment,
  constants.routes.watingListRequest,
  constants.routes.questionnaireForm,
];

function HeaderFactory({ onLogin, onSignup, providerName }) {
  const location = useLocation();
  const profile = useSelector((state) => state.userProfile.profile);
  if (location.pathname.includes("/blogs/")) return null;
  if (
    doctorOpenPages.findIndex((it) => location.pathname.startsWith(it)) !==
      -1 &&
    profile === null
  ) {
    return <PatientHeader onLogin={onLogin} onSignup={onSignup} />;
  }
  if (location.pathname.includes("/landing-pages/")) return null;

  if (
    providerName &&
    profile?.role?.systemRole === constants.systemRoles.vendor
  ) {
    return null;
  }

  if (providerName) {
    return <Header ProviderName={providerName} />;
  }

  return <HomeHeader LoginClick={onLogin} SignupClick={onSignup} />;
}

export default HeaderFactory;
