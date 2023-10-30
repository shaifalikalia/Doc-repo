import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import constants from "../../constants";

export default function FindDoctors({ signIn }) {
  const { role } = useSelector((e) => e.userProfile.profile) || {};

  useEffect(() => {
    if (!role && signIn) {
      signIn();
    }
  }, [role, signIn]);

  if (role?.systemRole === constants.systemRoles.patient) {
    return <Redirect exact to={constants.routes.doctors} />;
  }

  return <Redirect exact to="/" />;
}
