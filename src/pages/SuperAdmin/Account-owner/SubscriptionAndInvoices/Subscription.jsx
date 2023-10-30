import React from "react";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useSubscriptionDetail } from "repositories/subscription-repository";
import { convertIntoTwoDecimal, encodeId } from "utils";
import constants, {
  getcurreny,
  getsubcriptionPlanTitle,
} from "../../../../constants";
import "./SubscriptionAndInvoices.scss";
import Loader from "components/Loader";

function Subscription({ accountOwnerId, t }) {
  const {
    isLoading,
    data: apiRes,
    error,
  } = useSubscriptionDetail(accountOwnerId);

  if (error || (!isLoading && apiRes.statusCode !== 200)) {
    return (
      <div className="card app-card">
        <div className="card-body app-card-body">
          <div className="sai-sd-card-title">{t("currentSubscription")}</div>
          {error ? error.message : apiRes.message}
        </div>
      </div>
    );
  }

  // console.log('apiRes.data', apiRes?.data?.subscriptionPlan)
  let subscriptionPlan = apiRes?.data?.subscriptionPlan;

  if (!isLoading && !apiRes.data.isActive) {
    return (
      <div className="card app-card">
        <div className="card-body app-card-body">
          <div className="sai-sd-card-title">{t("currentSubscription")}</div>
          {t("superAdmin.noActiveSubscription")}
        </div>
      </div>
    );
  }

  let officeCharge = <div className="sai-sd-value">CAD 0</div>;
  let setUpFees = <div className="sai-sd-value">CAD 0</div>;
  let permanentStaffChargeValue = (
    <div className="text-placeholder-150 shimmer-animation"></div>
  );
  let temporaryStaffChargeValue = (
    <div className="text-placeholder-150 shimmer-animation"></div>
  );
  let placementChargeValue = (
    <div className="text-placeholder-150 shimmer-animation"></div>
  );
  if (!isLoading) {
    const subscription = apiRes.data;
    let countryCurreny = getcurreny(subscription?.currency);

    let setupFee = `${countryCurreny} ${convertIntoTwoDecimal(
      subscription?.setupFee
    )}`;
    let officeCharges = `${countryCurreny} ${convertIntoTwoDecimal(
      subscription?.perOfficeCharge
    )}${t("perMonthperOffice")}`;
    let permanentStaff = `${countryCurreny} ${convertIntoTwoDecimal(
      subscription?.perPermanentStaffCharge
    )}${t("perMonthperStaff")}`;
    let tempraryStaff = `${countryCurreny} ${convertIntoTwoDecimal(
      subscription?.perTemporaryStaffCharge
    )}${t("perMonthperStaff")}`;
    let perStaff = `${countryCurreny} ${convertIntoTwoDecimal(
      subscription?.perPlacementCharge
    )}${t("perStaff")}`;

    setUpFees = <div className="sai-sd-value">{setupFee}</div>;
    officeCharge = <div className="sai-sd-value">{officeCharges}</div>;
    permanentStaffChargeValue = (
      <div className="sai-sd-value">{permanentStaff}</div>
    );
    temporaryStaffChargeValue = (
      <div className="sai-sd-value">{tempraryStaff}</div>
    );
    placementChargeValue = <div className="sai-sd-value">{perStaff}</div>;
  }

  return (
    <div className="card app-card">
      {isLoading && <Loader />}
      <div className="card-body app-card-body">
        <div className="d-flex flex-row justify-content-between">
          <div className="sai-sd-card-title ">{t("currentSubscription")}</div>

          {subscriptionPlan === constants.subscriptionType.trial ||
          subscriptionPlan === constants.subscriptionType.free ? (
            <div className="sai-sd-card-value ">
              {getsubcriptionPlanTitle(subscriptionPlan)}
            </div>
          ) : (
            <div className="sai-sd-card-value ">
              <span> {getsubcriptionPlanTitle(subscriptionPlan)}</span>
              <span className="sai-seperator"></span>
              <span>
                <Link
                  to={{
                    pathname: `/edit-subscription/${encodeId(accountOwnerId)}`,
                    state: {
                      APIdata: apiRes?.data,
                    },
                  }}
                >
                  <img
                    src={require("assets/images/edit-icon.svg").default}
                    alt="icon"
                  />
                </Link>
              </span>
            </div>
          )}
        </div>

        <div className="d-flex flex-row justify-content-between">
          <div className="sai-sd-title">{t("superAdmin.setUpFees")}</div>
          {setUpFees}
        </div>

        <hr />
        <div className="d-flex flex-row justify-content-between">
          <div className="sai-sd-title">{t("superAdmin.officeCharges")}</div>
          {officeCharge}
        </div>

        <hr />

        <div className="d-flex flex-row justify-content-between">
          <div className="sai-sd-title">
            {t("perActivePermanentStaffMember")}
          </div>
          {permanentStaffChargeValue}
        </div>

        <hr />

        <div className="d-flex flex-row justify-content-between">
          <div className="sai-sd-title">
            {t("perActiveTemporaryStaffMember")}
          </div>
          {temporaryStaffChargeValue}
        </div>

        <hr />

        <div className="d-flex flex-row justify-content-between">
          <div className="sai-sd-title">{t("perEachPlacement")}</div>
          {placementChargeValue}
        </div>
      </div>
    </div>
  );
}

export default withTranslation()(Subscription);
