import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import Page from "components/Page";
import styles from "./../../ManageVendorSubscription/VendorSubscription.module.scss";
import LayoutVendor from "VendorManagement/components/LayoutVendor";
import ContactUsModal from "./ContactUsModal";
import { useVendorSubscriptionPackages } from "repositories/subscription-repository";
import useHandleApiError from "hooks/useHandleApiError";
import Loader from "components/Loader";
import { convertIntoTwoDecimal } from "utils";
import constants from "../../../../constants";

const ChangeSubscription = ({ t, history }) => {
  const [isContactUsModalOpen, setIsContactUsModalOpen] = useState(false);
  const onBack = () => history.push(`/manage-subscription`);
  const { data, isLoading, isFetching, error } =
    useVendorSubscriptionPackages();
  useHandleApiError(isLoading, isFetching, error);
  let arrayOfPackages = data?.data || [];

  const handlePurchase = (item) => {
    history.push({
      pathname: constants.routes.vendor.vendorPurchaseSubscription,
      state: item,
    });
  };

  return (
    <LayoutVendor>
      {isLoading && <Loader />}
      <Page onBack={onBack} title={t("vendorManagement.chooseSubscription")}>
        <div className={styles["change-subsciption"]}>
          <div className={styles["plan-type-list"]}>
            <div className="row">
              {arrayOfPackages?.length > 0 &&
                arrayOfPackages.map((item) => {
                  if (item.id === 0) {
                    return (
                      <EnterPriseView
                        key={item.id}
                        setIsContactUsModalOpen={setIsContactUsModalOpen}
                        t={t}
                      />
                    );
                  }
                  return (
                    <ProfessionalView
                      key={item.id}
                      item={item}
                      t={t}
                      handlePurchase={handlePurchase}
                    />
                  );
                })}
            </div>
          </div>
        </div>
      </Page>
      {isContactUsModalOpen && (
        <ContactUsModal
          isContactUsModalOpen={isContactUsModalOpen}
          setIsContactUsModalOpen={setIsContactUsModalOpen}
        />
      )}
    </LayoutVendor>
  );
};

export default withTranslation()(ChangeSubscription);

function ProfessionalView(props) {
  return (
    <div className="col-md-6 col-xl-4">
      <div className={styles["data-box"]}>
        <img
          src={require("assets/images/edit-vendor-professional.svg").default}
          alt="img"
        />
        <h3>{props.item?.name}</h3>
        <div className={styles["dollar-amount-month"]}>
          <span className={styles["dollar-sign"]}>$</span>
          <span className={styles["professional-subscription-amount"]}>
            {convertIntoTwoDecimal(props.item.vendorChargeUnitPrice)}
          </span>
          <span
            className={styles["professional-subscription-amount-per-month"]}
          >
            /mo
          </span>
        </div>

        <div className={styles["sales-rep"]}>
          <span>
            <img
              src={require("assets/images/check-mark-button.svg").default}
              alt="img"
            />
          </span>
          <div>{`$ ${convertIntoTwoDecimal(
            props.item.perSalesRepresentativeUnitPrice
          )}  per Sales Rep/ mo`}</div>
        </div>

        <button
          onClick={() => props.handlePurchase(props.item)}
          className="button button-round button-shadow w-100"
          title={props.t("vendorManagement.purchasePlan")}
        >
          {props.t("vendorManagement.purchasePlan")}
        </button>
      </div>
    </div>
  );
}

function EnterPriseView(props) {
  return (
    <div className="col-md-6 col-xl-4">
      <div className={styles["data-box"]}>
        <img src={require("assets/images/enterprise.svg").default} alt="img" />
        <h3>{props.t("vendorManagement.enterpriseSubscription")}</h3>
        <h2>
          <div>{props.t("vendorManagement.contactSales")}</div>{" "}
          <div>{props.t("vendorManagement.customPlan")}</div>
        </h2>
        <p>{props.t("vendorManagement.largeVendorrSupplying")}</p>
        <button
          onClick={() => {
            props.setIsContactUsModalOpen(true);
          }}
          className="button button-round button-shadow w-100"
          title={props.t("vendorManagement.contactUs")}
        >
          {props.t("vendorManagement.contactUs")}
        </button>
      </div>
    </div>
  );
}
