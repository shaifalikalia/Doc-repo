import React from "react";
import { withTranslation } from "react-i18next";
import { convertIntoTwoDecimal } from "utils";

function DetailSubscriptionCard({ action, t, vendorCharge, saleRepCharge }) {
  return (
    <div className="card app-card manage-vendor-card">
      <div className="card-body app-card-body">
        <div className="d-flex flex-row justify-content-between">
          <div className="aod-dc-title">
            {t("superAdminVendorSubscription.vendorCharges")}
          </div>
          <div className="aod-dc-value">
            {" "}
            {`CAD ${convertIntoTwoDecimal(vendorCharge)}`}
          </div>
        </div>
        <hr />
        <div className="d-flex flex-row justify-content-between">
          <div className="aod-dc-title">
            {t("superAdminVendorSubscription.salesRepCharges")}
          </div>
          <div className="aod-dc-value">{`CAD ${convertIntoTwoDecimal(
            saleRepCharge
          )}/sales rep`}</div>
        </div>

        <hr />
        <div>{action}</div>
      </div>
    </div>
  );
}

export default withTranslation()(DetailSubscriptionCard);
