import React from "react";
import DetailCard from "./DetailCard";
import Page from "components/Page";
import { withTranslation } from "react-i18next";
import Offices from "./Offices";
import { Link } from "react-router-dom";
import { decodeId, encodeId } from "utils";

function AccountOwnerDetail({ history, match, t }) {
  const accountOwnerId = decodeId(match.params.accountOwnerId);

  if (history.location.state !== undefined) {
    const {  personnelName } = history.location.state;
    const onBack = () => history.goBack();

    return (
      <Page titleKey="superAdmin.accountOwnerDetail" onBack={onBack}>
        <DetailCard
          accountOwnerId={accountOwnerId}
          fromPersonnel={true}
          personnelName={personnelName}
          action={
            <button
              onClick={onBack}
              className="button button-round button-shadow button-width-large"
            >
              {t("superAdmin.viewPersonnelOfficeListOf")} {personnelName}
            </button>
          }
        />
      </Page>
    );
  } else {
    return (
      <Page
        titleKey="superAdmin.accountOwnerDetail"
        onBack={() => history.push("/manage-owner")}
      >
        <DetailCard
          accountOwnerId={accountOwnerId}
          action={
            <div className="d-flex flex-row">
              <Link
                to={`/account-owner/${encodeId(
                  accountOwnerId
                )}/subscription-and-invoices`}
              >
                <button className="button button-round button-shadow button-width-large mr-4">
                  {t("superAdmin.viewSubscriptionDetails")}
                </button>
              </Link>
              <Link
                to={`/account-owner/${encodeId(
                  accountOwnerId
                )}/transaction-history`}
              >
                <button className="button button-round button-border button-dark">
                  {t("superAdmin.viewTransactionHistory")}
                </button>
              </Link>
            </div>
          }
        />

        <div className="mt-5">
          <Offices accountOwnerId={accountOwnerId} />
        </div>
      </Page>
    );
  }
}

export default withTranslation()(AccountOwnerDetail);
