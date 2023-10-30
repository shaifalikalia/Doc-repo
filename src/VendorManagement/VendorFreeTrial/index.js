import React, { useState, useEffect, useMemo } from "react";
import { withTranslation } from "react-i18next";
import Card from "components/Card";
import { Col } from "reactstrap";
import Page from "components/Page";
import Loader from "components/Loader";
import useHandleApiError from "hooks/useHandleApiError";
import moment from "moment";
import CustomSelect from "components/CustomSelect";
import constants from "../../constants";
import EnterprisePaySubscriptionModal from "./components/EnterprisePaySubscriptionModal";
import HeaderVendor from "VendorManagement/components/HeaderVendor";
import styles from "./VendorFreeTrial.module.scss";
import "./VendorFreeTrial.scss";
import {
  useVendorSubscriptionPackages,
  buyVendorSubscription,
} from "repositories/subscription-repository";
import { convertIntoTwoDecimal, handleError } from "utils";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

const endOfTrial = moment().add(30, "days").format("dddd, MMMM Do YYYY");

const VendorFreeTrial = ({ t, history }) => {
  const { data, isLoading, isFetching, error } =
    useVendorSubscriptionPackages();
  useHandleApiError(isLoading, isFetching, error);
  const vendorSubscription = useMemo(() => data?.data || [], [data?.data]);
  const [
    isEnterprisePaySubscriptionModalOpen,
    setIsEnterprisePaySubscriptionModalOpen,
  ] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isLoader, setIsLoader] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (
      Array.isArray(vendorSubscription) &&
      vendorSubscription?.length &&
      !location.state
    ) {
      let trialSub = vendorSubscription.find(
        (item) => item.subscriptionPlan === constants.subscriptionType.trial
      );
      trialSub && setSelectedOption(trialSub);
    }
    if (
      Array.isArray(vendorSubscription) &&
      vendorSubscription?.length &&
      location.state
    ) {
      setSelectedOption(location.state || {});
    }
  }, [vendorSubscription]);

  const handleSelection = (value) => {
    if (
      value?.id === 0 &&
      value.subscriptionPlan === constants.subscriptionType.enterprise
    ) {
      setIsEnterprisePaySubscriptionModalOpen(true);
      return;
    }
    setSelectedOption(value);
  };

  const handleSubmit = async () => {
    try {
      if (!selectedOption?.id) return null;
      setIsLoader(true);
      await buyVendorSubscription({
        packageId: selectedOption.id,
        officeIds: null,
      });
      setIsLoader(false);
      dispatch({ type: "GET_PROFILE" });
      history.push(constants.routes.vendor.cardSetup);
    } catch (err) {
      handleError(err);
    }
    setIsLoader(false);
  };

  return (
    <>
      {(isLoading || isLoader) && <Loader />}
      <HeaderVendor simple={true} />
      <Page
        title={t("vendorManagement.confirmSubScription")}
        className={"vendor-free-trial " + styles["vendor-free-trial"]}
      >
        <Card
          className={styles["vendor-free-trial-card"]}
          padding="70px"
          marginBottom="10px"
          shadow="0 0 15px 0 rgba(0, 0, 0, 0.08)"
          cursor="default"
        >
          {!location.state && (
            <div className="page-step">{t("form.fields.pageStep3")}</div>
          )}
          <Col lg={6} className="px-0">
            <div className={styles["vendor-trial-container"]}>
              {selectedOption?.subscriptionPlan ===
                constants.subscriptionType.trial && (
                <>
                  <h2 className={styles["vendor-free-trial-heading"]}>
                    {t("vendorManagement.vendorFreeTrialHeading")}
                  </h2>
                  <p className={styles["sub-title"]}>
                    {t("vendorManagement.freeTrialInfo")}
                  </p>
                </>
              )}

              <div className="custom-dropdown-only">
                <CustomSelect
                  Title={t("accountOwner.chooseSubscription")}
                  options={vendorSubscription}
                  id={"Type"}
                  dropdownClasses={"custom-select-scroll"}
                  selectedOption={selectedOption}
                  selectOption={handleSelection}
                />
                <ShowDescription selectedOption={selectedOption} t={t} />
              </div>
            </div>
          </Col>

          <h2 className={styles["vendor-billing"]}>
            {t("vendorManagement.vendorBilling")}
          </h2>
          <BillingDetails selectedOption={selectedOption} t={t} />

          <button
            onClick={handleSubmit}
            className="button w-sm-100 button-round button-shadow mt-4"
            title={t("vendorManagement.paySubscription")}
          >
            {t("vendorManagement.paySubscription")}
          </button>
        </Card>
      </Page>
      <EnterprisePaySubscriptionModal
        isEnterprisePaySubscriptionModalOpen={
          isEnterprisePaySubscriptionModalOpen
        }
        setIsEnterprisePaySubscriptionModalOpen={
          setIsEnterprisePaySubscriptionModalOpen
        }
      />
    </>
  );
};

export default withTranslation()(VendorFreeTrial);

function BillingDetails(props) {
  if (!props.selectedOption?.subscriptionPlan) return null;
  return (
    <div>
      <div className="d-flex flex-row justify-content-between ">
        <div className="aod-dc-title">
          {props.t("vendorManagement.vendorCharges")}
        </div>
        <div className="aod-dc-value">
          {" "}
          {`CAD ${convertIntoTwoDecimal(
            props.selectedOption?.vendorChargeUnitPrice
          )} / mo`}
        </div>
      </div>
      <hr />
      <div className="d-flex flex-row justify-content-between ">
        <div className="aod-dc-title">
          {props.t("vendorManagement.salesRepCharges")}
        </div>
        <div className="aod-dc-value">
          {" "}
          {`CAD ${convertIntoTwoDecimal(
            props.selectedOption?.perSalesRepresentativeUnitPrice
          )} / sales rep / mo`}
        </div>
      </div>
      <hr />
    </div>
  );
}

function ShowDescription(props) {
  if (!props.selectedOption?.subscriptionPlan) return null;
  if (
    props.selectedOption?.subscriptionPlan === constants.subscriptionType.trial
  ) {
    return (
      <span className={"error-msg " + styles["vendor-free-trial-error"]}>
        {`${props.t("accountOwner.freeTrialEndsOn")} ${endOfTrial}`}
      </span>
    );
  }

  if (
    props.selectedOption?.subscriptionPlan ===
    constants.subscriptionType.professional
  )
    return (
      <div
        className={"yellow-alert-popup " + styles["vendor-free-trial-error"]}
      >
        {props.t("vendorManagement.professionalAlert")}
      </div>
    );
}
