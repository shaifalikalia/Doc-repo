import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import Page from "components/Page";
import { Link } from "react-router-dom";
import LayoutVendor from "VendorManagement/components/LayoutVendor";
import TerminateSubscriptionModal from "./components/TerminateSubscriptionModal";
import {
  useGetVendorSubDetails,
  terminateVendorSub,
} from "repositories/subscription-repository";
import { useSelector } from "react-redux";
import { convertIntoTwoDecimal, handleError, handleSuccess } from "utils";
import Loader from "components/Loader";
import useHandleApiError from "hooks/useHandleApiError";
import constants, { getsubcriptionPlanTitle } from "../../../constants";
import moment from "moment";
import styles from "./../ManageVendorSubscription/VendorSubscription.module.scss";
import FamilyModal from "patient-scheduling/pages/FamilyMembers/components/AddedMembers/FamilyModal";

const ManageVendorSubscription = ({ t }) => {
  const [
    isTerminateSubscriptionModalOpen,
    setIsTerminateSubscriptionModalOpen,
  ] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);

  const profile = useSelector((e) => e.userProfile.profile);
  const { data, isLoading, isFetching, error } = useGetVendorSubDetails(
    profile.id,
    {
      enabled: !!profile.id,
    }
  );
  useHandleApiError(isLoading, isFetching, error);
  const subDetails = data?.data || {};

  const isAccountDeactivate =
    profile.profileSetupStep === constants.subscriptionTerminated &&
    subDetails.isActive === false;

  const terminateSub = async () => {
    try {
      if (!subDetails?.subscribedOn) return;
      // vendor subscription can be terminated only after 1 year the day of purchasing

      if (
        subDetails.subscriptionPlan === constants.subscriptionType.trial ||
        (subDetails.subscriptionPlan !== constants.subscriptionType.trial &&
          moment() >= moment(subDetails?.subscribedOn).add(1, "year"))
      ) {
        setIsLoader(true);
        let response = await terminateVendorSub();
        handleSuccess(response?.message);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        throw new Error(
          t("vendorSubEnd", {
            field: moment(subDetails?.subscribedOn)
              .add(1, "year")
              .format("DD-MM-YYYY"),
          })
        );
      }
    } catch (err) {
      handleError(err, { duration: 5000 });
    }
    setIsLoader(false);
  };

  const redirectToStripe = () => {
    window.open(process.env.REACT_APP_STRIPE_LOGIN_URL, "_blank");
  };

  const showLoader = isLoading || isLoader;
  return (
    <>
      <LayoutVendor>
        {showLoader && <Loader />}
        <Page
          className={
            "vendor-subscription-custom " + styles["vendor-subscription"]
          }
          title={t("superAdminVendorManagement.mySubscription")}
        >
          <div className="card app-card custom-table">
            <div className="card-body app-card-body">
              <div className="d-flex flex-row justify-content-between">
                <div className="aod-dc-head aod-dc-head-custom">
                  {t("vendorManagement.currentSubscription")}
                </div>
                <div className="aod-dc-value">
                  {isAccountDeactivate ? (
                    <span className="text-danger">
                      {t("accountTerminated")}
                    </span>
                  ) : (
                    getsubcriptionPlanTitle(subDetails?.subscriptionPlan)
                  )}
                </div>
              </div>

              <div className="d-flex flex-row justify-content-between">
                <div className="aod-dc-title">
                  {t("vendorManagement.vendorCharges")}
                </div>
                <div className="aod-dc-value">
                  {isAccountDeactivate
                    ? "--"
                    : `CAD  ${convertIntoTwoDecimal(
                        subDetails.vendorCharge
                      )}  / mo`}
                </div>
              </div>
              <hr className="vendor-subscription-custom-hr" />
              <div className="d-flex flex-row justify-content-between">
                <div className="aod-dc-title">
                  {t("vendorManagement.salesRepCharges")}
                </div>
                <div className="aod-dc-value">
                  {isAccountDeactivate
                    ? "--"
                    : `CAD ${convertIntoTwoDecimal(
                        subDetails.perSalesRepCharge
                      )} / sales rep / mo`}
                </div>
              </div>
              <hr />
              <div
                className={
                  " d-block d-md-flex flex-row " +
                  styles["vendor-subscription-btn"]
                }
              >
                <Link to="/change-subscription">
                  <button className="button button-round button-shadow button-width-large mr-md-4  mb-30">
                    {t("vendorManagement.changeSubscription")}
                  </button>
                </Link>
                <Link to={constants.routes.vendor.manageVendorCards}>
                  <button className="button button-round button-shadow button-width-large mr-md-4  mb-30 ">
                    {t("vendorManagement.manageCards")}
                  </button>
                </Link>
                {!isAccountDeactivate && (
                  <button
                    className="button button-round button-dark button-border mr-md-4"
                    onClick={() => {
                      setIsTerminateSubscriptionModalOpen(true);
                    }}
                  >
                    {t("vendorManagement.terminateSubscription")}
                  </button>
                )}
                <button
                  className="button button-round button-dark button-border"
                  onClick={() => setConfirmModal(true)}
                >
                  {t("vendorManagement.ManageBankDetails")}
                </button>
              </div>
            </div>
          </div>
        </Page>
        {isTerminateSubscriptionModalOpen && (
          <TerminateSubscriptionModal
            isTerminateSubscriptionModalOpen={isTerminateSubscriptionModalOpen}
            setIsTerminateSubscriptionModalOpen={
              setIsTerminateSubscriptionModalOpen
            }
            terminateSub={terminateSub}
            showLoader={showLoader}
          />
        )}
        {confirmModal && (
          <FamilyModal
            isFamilyModalOpen={confirmModal}
            setIsFamilyModalOpen={setConfirmModal}
            title={t("vendorManagement.ManageBankDetails")}
            subTitle2={t("vendorManagement.ManageBankDetailContent")}
            leftBtnText={t("vendorManagement.GotoStripe")}
            rightBtnText={t("cancel")}
            onConfirm={redirectToStripe}
          />
        )}
      </LayoutVendor>
    </>
  );
};

export default withTranslation()(ManageVendorSubscription);
