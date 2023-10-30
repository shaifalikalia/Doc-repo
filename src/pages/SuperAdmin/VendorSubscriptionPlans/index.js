import React from "react";
import { Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import Page from "components/Page";
import styles from "./../VendorSubscriptionPlans/VendorsubscriptionPlans.module.scss";
import constants from "../../../constants";

let { vendorSubscriptionView } = constants.routes.superAdmin;
let { trial, professional } = constants.subscriptionType;

const VendorSubscriptionPlans = ({ t, history }) => {
  const goBack = () => {
    history.push("/");
  };
  return (
    <Page
      title={t("superAdmin.subscriptionManagementForVendors")}
      onBack={goBack}
    >
      <div className={styles["vendor-subscription-plans"]}>
        <div className={styles["plan-type-list"]}>
          <div className="row">
            <div className="col-md-4">
              <Link
                to={{
                  pathname: vendorSubscriptionView.replace(
                    ":subscriptionType",
                    trial
                  ),
                }}
              >
                <div className={styles["data-box"]}>
                  <img
                    src={require("assets/images/trial.svg").default}
                    alt="img"
                  />
                  <h3>{t("superAdmin.trialSubscription")}</h3>
                </div>
              </Link>
            </div>
            <div className="col-md-4">
              <Link
                to={{
                  pathname: vendorSubscriptionView.replace(
                    ":subscriptionType",
                    professional
                  ),
                }}
              >
                <div className={styles["data-box"]}>
                  <img
                    src={
                      require("assets/images/edit-vendor-professional.svg")
                        .default
                    }
                    alt="img"
                  />
                  <h3>{t("superAdmin.professionalSubscription")}</h3>
                </div>
              </Link>
            </div>
            <div className="col-md-4">
              <Link to="/enterprise-subscription">
                <div className={styles["data-box"]}>
                  <img
                    src={require("assets/images/enterprise.svg").default}
                    alt="img"
                  />
                  <h3>{t("superAdmin.enterpriseSubscription")}</h3>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
};
export default withTranslation()(VendorSubscriptionPlans);
