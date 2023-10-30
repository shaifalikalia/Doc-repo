import React from "react";
import { useSelector } from "react-redux";
import constants from "../../constants";

const MessageDot = () => {
  const {
    role,
    profileSetupStep,
    subscription,
    sendbirdMessageCount,
    isAdmin,
    isMessenger,
  } = useSelector((state) => state?.userProfile?.profile) || {};
  if (!sendbirdMessageCount) return null;

  const redDot = (
    <span className="notification-red-dot">
      <img alt="red-dot" src={require("assets/images/red-dot.svg").default} />
    </span>
  );

  if (role.systemRole === constants.systemRoles.accountOwner) {
    if (
      profileSetupStep === "completed" &&
      subscription?.packageType !== constants.packageTypes.free
    ) {
      return redDot;
    }
  } else if (role.systemRole === constants.systemRoles.staff) {
    if (isAdmin || !!isMessenger) {
      return redDot;
    }
  }

  return null;
};

export default MessageDot;
