import React, { Fragment, useState } from "react";
import { withTranslation } from "react-i18next";
import "./Detail.scss";
import constants, { getsubcriptionPlanTitle } from "../../../../../constants";
import moment from "moment";
import { Calendar } from "react-calendar";
import {
  extendTrialVendorDate,
  useGetVendorSubDetails,
} from "repositories/subscription-repository";
import { handleSuccess, handleError, isValueEmpty } from "utils";
import Loader from "components/Loader";
import useHandleApiError from "hooks/useHandleApiError";

function DetailCard({ action, t, vendorCacheDetail }) {
  const fullName = `${vendorCacheDetail?.firstName} ${vendorCacheDetail?.lastName}`;
  const [openCalendar, setOpenCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isLoader, setIsLoader] = useState(false);
  const { data, isLoading, isFetching, error, refetch } =
    useGetVendorSubDetails(vendorCacheDetail?.id, {
      enabled: !!vendorCacheDetail?.id,
    });
  let vendorDetails = data?.data || {};
  useHandleApiError(isLoading, isFetching, error);

  const extendTrialPeriod = async () => {
    try {
      if (!vendorCacheDetail?.id) return;
      setIsLoader(true);
      let res = await extendTrialVendorDate({
        VendorId: vendorCacheDetail.id,
        NewEndDate: moment(selectedDate).format("YYYY-MM-DD"),
      });
      handleSuccess(res.message);
      refetch();
      setOpenCalendar(false);
    } catch (err) {
      handleError(err);
    }
    setIsLoader(false);
  };

  return (
    <div className="card app-card manage-vendor-card">
      <div className="card-body app-card-body">
        <Row
          title={t("superAdminVendorManagement.vendorName")}
          value={fullName}
        />
        <Row
          title={t("superAdminVendorManagement.emailAddress")}
          value={vendorCacheDetail?.emailId}
        />
        <Row
          title={t("superAdminVendorManagement.contactNo")}
          value={vendorCacheDetail?.contactNumber}
        />

        <Row
          title={t("superAdminVendorManagement.currentActivePlan")}
          value={getsubcriptionPlanTitle(vendorDetails?.subscriptionPlan)}
        />

        {vendorDetails?.subscriptionPlan ===
          constants.subscriptionType.trial && (
          <Fragment>
            <CalanderView
              t={t}
              subscribedTill={moment(vendorDetails?.subscribedTill)}
              openCalendar={openCalendar}
              setOpenCalendar={setOpenCalendar}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              isLoading={isLoading || isLoader}
              extendTrialPeriod={extendTrialPeriod}
            />
            <hr />
          </Fragment>
        )}

        <div className="mt-4">{action}</div>
      </div>
    </div>
  );
}

export default withTranslation()(DetailCard);

function Row({ title, value }) {
  return (
    <Fragment>
      <div className="d-flex flex-row justify-content-between">
        <div className="aod-dc-title">{title}</div>
        <div class="aod-dc-value"> {isValueEmpty(value)}</div>
      </div>
      <hr />
    </Fragment>
  );
}

function CalanderView(props) {
  return (
    <div className="d-flex flex-row justify-content-between">
      <div className="aod-dc-title">
        {props.t("superAdminVendorSubscription.endDateOfTrial")}
      </div>
      <div class="aod-dc-value">
        {moment(props.subscribedTill).format("MMM DD, YYYY")}
        <div className="trial-date">
          <div className="input-date"></div>
          <div>
            <button
              className="extend-trial"
              onClick={() => {
                props.setOpenCalendar((prev) => !prev);
              }}
            >
              {props.t("superAdmin.extendTrialDate")}
            </button>
          </div>
          {props.openCalendar && (
            <div className="react-custom-calendar">
              {props.isLoading && <Loader />}
              <Calendar
                minDate={moment(props.subscribedTill).add("days", 1).toDate()}
                dateFormat="dd-MM-yyyy"
                onChange={props.setSelectedDate}
                className="c-form-control scheduler-calendar"
                selected={props.selectedDate}
              />
              <div>
                <button
                  className="button button-round button-shadow mr-4 mb-3"
                  title={props.t("accountOwner.blockSlot")}
                  disabled={!props.selectedDate}
                  onClick={props.extendTrialPeriod}
                >
                  {props.t("superAdmin.update")}
                </button>
                <button
                  className="button button-round button-dark button-border extend-update"
                  title={props.t("cancel")}
                  onClick={() => props.setOpenCalendar(false)}
                >
                  {props.t("cancel")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
