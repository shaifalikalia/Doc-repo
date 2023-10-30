import Page from "components/Page";
import React from "react";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import DetailSubscriptionCard from "../../DetailSubscriptionCard";

function TrialSubscription({ t, history }) {
  const goBack = () => {
    history.push("/vendor-subscription-plans");
  };

  return (
    <Page
      title={t("superAdminVendorSubscription.trialSubscriptionForVendors")}
      onBack={goBack}
    >
      <DetailSubscriptionCard
        action={
          <div className="d-flex flex-row">
            <Link>
              <button className="button button-round button-width-large mt-4">
                {t("superAdminVendorSubscription.editSubscription")}
              </button>
            </Link>
          </div>
        }
      />
    </Page>
  );
}

export default withTranslation()(TrialSubscription);
