import React from "react";
import { Link } from "react-router-dom";
import { withTranslation } from "react-i18next";

function StaffCard(props) {
  const {
    data: {
      profilePic,
      firstName,
      lastName,
      designation,
      timeSheet,
      type,
      isAdmin,
      staffRoleId,
      isActive,
      inviteId,
    },
    t,
  } = props;
  let typeData = null;

  if (type === 1) {
    typeData = (
      <div className="process">
        <img
          src={require("assets/images/process-icon.svg").default}
          alt="staff"
        />
        <span>
          <strong>{timeSheet || "-"}</strong> ({t("accountOwner.thisMonth")})
        </span>
      </div>
    );
  }

  if (type === 3) {
    typeData = (
      <div className="process-pending">
        <img
          src={require("assets/images/invitation-pending.svg").default}
          alt="staff"
        />
        <span>{t("accountOwner.invitationPending")}</span>
      </div>
    );
  }

  if (type === 4) {
    typeData = (
      <div className="process-decline">
        <img
          src={require("assets/images/invitation-declined.svg").default}
          alt="staff"
        />
        <span>{t("accountOwner.invitationDeclined")}</span>
      </div>
    );
  }

  if (!isActive && !inviteId) {
    typeData = (
      <div className="process-pending">
        <img
          src={require("assets/images/invitation-pending.svg").default}
          alt="staff"
        />
        <span>{t("accountOwner.deactivated")}</span>
      </div>
    );
  }

  return (
    <Link
      to={{
        pathname: "/staff-detail",
        state: {
          detail: props.data,
          OfficeId: props.OfficeId,
        },
      }}
    >
      <div
        className={`staff-card ${type === 3 ? "pending-card" : ""} ${
          type === 4 ? "decline-card" : ""
        } ${type === 2 ? "deactivated-card" : ""}`}
      >
        <div className="card-content">
          <div className="staff-img">
            <div className="_img">
              {profilePic ? (
                <img src={profilePic} alt="staff" />
              ) : (
                <img
                  src={require("assets/images/staff-default.svg").default}
                  alt="staff"
                />
              )}
            </div>
            <span className="ico">
              {staffRoleId === 2 ? (
                <img
                  src={require("assets/images/star.svg").default}
                  alt="staff"
                />
              ) : null}
              {staffRoleId === 1 ? (
                <img
                  src={require("assets/images/star-pending.svg").default}
                  alt="staff"
                />
              ) : null}
            </span>
          </div>
          <h4>
            {firstName} {lastName}
          </h4>
          <div className="profile">
            <img
              src={require("assets/images/staff-icon.svg").default}
              alt="staff"
            />
            <span>{designation}</span>
          </div>
          {typeData}
        </div>
        {isAdmin ? (
          <div className="admin-access-ico">
            <img
              src={require("assets/images/admin-access.svg").default}
              alt="icon"
            />
          </div>
        ) : null}
      </div>
    </Link>
  );
}

export default withTranslation()(StaffCard);
