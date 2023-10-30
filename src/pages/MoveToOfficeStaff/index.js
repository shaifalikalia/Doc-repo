import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import constants from "../../constants";

export default function MoveToOfficeStaff({ signIn }) {
  const { role } = useSelector((e) => e.userProfile.profile) || {};

  useEffect(() => {
    if (!role && signIn) {
      signIn();
    }
  }, [role, signIn]);

  if (role?.systemRole === constants.systemRoles.staff) {
    return <Redirect exact to={constants.routes.staff.offices} />;
  }

  return <Redirect exact to="/" />;
}
