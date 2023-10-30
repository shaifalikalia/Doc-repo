import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import { useUser } from "repositories/user-repository";
import moment from "moment";
import "./Detail.scss";
import { Calendar } from "react-calendar";
import { extendTrialDate } from "repositories/subscription-repository";
import { handleError, handleSuccess } from "utils";
import Loader from "components/Loader";

function DetailCard({ accountOwnerId, fromPersonnel, action, t }) {
  const [openCalendar, setOpenCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isLoader, setIsLoader] = useState(false);

  let { isLoading, data: apiRes, error, refetch } = useUser(accountOwnerId);

  const extendTrialPeriod = async () => {
    try {
      setIsLoader(true);
      let res = await extendTrialDate({
        OwnerId: accountOwnerId,
        NewEndDate: selectedDate,
      });
      refetch();
      handleSuccess(res.message);
      setOpenCalendar(false);
    } catch (err) {
      handleError(err);
    }
    setIsLoader(false);
  };

  if (error || (!isLoading && apiRes.statusCode !== 200)) {
    return (
      <div className="card app-card">
        <div className="card app-card-body">
          {`Could not load: ${error ? error.message : apiRes.message}`}
        </div>
      </div>
    );
  }

  let nameValue = (
    <div className="aod-dc-value-placeholder shimmer-animation"></div>
  );
  let emailAddressValue = (
    <div className="aod-dc-value-placeholder shimmer-animation"></div>
  );
  let roleValue = (
    <div className="aod-dc-value-placeholder shimmer-animation"></div>
  );
  let contactNumberValue = (
    <div className="aod-dc-value-placeholder shimmer-animation"></div>
  );
  let currentActivePlanValue = (
    <div className="aod-dc-value-placeholder shimmer-animation"></div>
  );
  let statusValue = (
    <div className="aod-dc-value-placeholder shimmer-animation"></div>
  );
  let tialValidTill = (
    <div className="aod-dc-value-placeholder shimmer-animation"></div>
  );
  let packageType = "";
  let subscribedTillDate = null;

  if (!isLoading && apiRes.statusCode === 200) {
    const accountOwner = apiRes.data;
    subscribedTillDate = apiRes?.data?.subscription?.subscribedTill;
    nameValue = (
      <div className="aod-dc-value">
        {accountOwner.firstName} {accountOwner.lastName}
      </div>
    );
    emailAddressValue = (
      <div className="aod-dc-value">{accountOwner.emailId}</div>
    );
    roleValue = <div className="aod-dc-value">{accountOwner.role.title}</div>;
    contactNumberValue = (
      <div className="aod-dc-value">{accountOwner.contactNumber || "--"}</div>
    );
    statusValue = (
      <div className="aod-dc-value">
        {accountOwner.isActive ? "Active" : "InActive"}
      </div>
    );
    currentActivePlanValue = (
      <div className="aod-dc-value">
        {accountOwner?.subscription && accountOwner?.subscription.isActive
          ? accountOwner.subscription.packageName
          : "--"}
      </div>
    );
    tialValidTill = (
      <div className="aod-dc-value">
        {accountOwner.subscription && accountOwner?.subscription?.subscribedTill
          ? moment(accountOwner.subscription.subscribedTill).format(
              "MMM DD, YYYY"
            )
          : "--"}
      </div>
    );
    packageType = accountOwner?.subscription?.packageType;
  }

  return (
    <>
      <div className="card app-card unset-word-rap">
        <div className="card-body app-card-body ">
          <div className="d-flex flex-row justify-content-between">
            <div className="aod-dc-title">
              {t("superAdmin.accountOwnerName")}
            </div>
            {nameValue}
          </div>

          <hr />

          <div className="d-flex flex-row justify-content-between">
            <div className="aod-dc-title">{t("form.fields.emailAddress")}</div>
            {emailAddressValue}
          </div>

          <hr />

          {fromPersonnel && (
            <>
              <div className="d-flex flex-row justify-content-between">
                <div className="aod-dc-title">{t("superAdmin.role")}</div>
                {roleValue}
              </div>

              <hr />
            </>
          )}

          <div className="d-flex flex-row justify-content-between">
            <div className="aod-dc-title">{t("superAdmin.contactNo")}</div>
            {contactNumberValue}
          </div>

          <hr />

          <div className="d-flex flex-row justify-content-between">
            <div className="aod-dc-title">
              {t("superAdmin.currentActivePlan")}
            </div>
            {currentActivePlanValue}
          </div>

          <hr />

          {fromPersonnel && (
            <>
              <div className="d-flex flex-row justify-content-between">
                <div className="aod-dc-title">{t("superAdmin.status")}</div>
                {statusValue}
              </div>

              <hr />
            </>
          )}
          {packageType === "trial" && (
            <>
              <div className="d-flex flex-row justify-content-between">
                <div className="aod-dc-title">
                  {t("superAdmin.endDateOfTrialAccount")}
                </div>

                <div className="trial-date">
                  <div className="input-date"> {tialValidTill}</div>
                  <div>
                    {" "}
                    <button
                      className="extend-trial"
                      onClick={() => {
                        setOpenCalendar((prev) => !prev);
                      }}
                    >
                      {t("superAdmin.extendTrialDate")}
                    </button>
                  </div>
                  {openCalendar && (
                    <div className="react-custom-calendar">
                      {(isLoading || isLoader) && <Loader />}
                      <Calendar
                        minDate={moment(subscribedTillDate)
                          .add("days", 1)
                          .toDate()}
                        dateFormat="dd-MM-yyyy"
                        onChange={setSelectedDate}
                        className="c-form-control scheduler-calendar"
                        selected={selectedDate}
                      ></Calendar>

                      <div>
                        <button
                          className="button button-round button-shadow mr-4 mb-3"
                          title={t("accountOwner.blockSlot")}
                          onClick={extendTrialPeriod}
                          disabled={!selectedDate}
                        >
                          {t("superAdmin.update")}
                        </button>
                        <button
                          className="button button-round button-dark button-border extend-update"
                          title={t("cancel")}
                          onClick={() => setOpenCalendar(false)}
                        >
                          {t("cancel")}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <hr className="trial-extend-last-field" />
            </>
          )}

          <div className="mt-4">{action}</div>
        </div>
      </div>
    </>
  );
}

export default withTranslation()(DetailCard);
