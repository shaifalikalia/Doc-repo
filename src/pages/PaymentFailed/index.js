import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import constants from "../../constants";
import { setStorage } from "utils";
import moment from "moment";
import Loader from "components/Loader";

export default function PaymentFailed({ signIn }) {
  const { role } = useSelector((e) => e.userProfile.profile) || {};

  useEffect(() => {
    if (!role && signIn) {
      setStorage(constants.localStorageKeys.paymentMethod, {
        date: moment().format("YYYY-MM-DD"),
      });
      signIn();
    }
  }, [role, signIn]);

  if (role?.systemRole === constants.systemRoles.accountOwner) {
    return <Redirect exact to={constants.routes.accountOwner.manageCards} />;
  }

  if (role?.systemRole === constants.systemRoles.vendor) {
    return (
      <Redirect
        exact
        to={`${constants.routes.vendor.editProfile}?isCardView=true`}
      />
    );
  }

  return (
    <>
      {" "}
      <Loader />{" "}
    </>
  );
}
