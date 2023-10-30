import Page from "components/Page";
import React from "react";
import { useParams } from "react-router-dom";
import { withTranslation } from "react-i18next";
import DetailSubscriptionCard from "../../DetailSubscriptionCard";
import constants, { getsubcriptionPlanTitle } from "../../../../../constants";
import { useToGetListOfSubscription } from "repositories/subscription-repository";
import useHandleApiError from "hooks/useHandleApiError";
import Loader from "components/Loader";

const subscriptionPlanAccess = [
  constants.subscriptionType.trial,
  constants.subscriptionType.professional,
];
let isVendor = true;

function ActionHandle(props) {
  return (
    <div className="d-flex flex-row">
      <span onClick={props.moveToEditPage}>
        <button className="button button-round button-width-large mt-4">
          {props.t("superAdminVendorSubscription.editSubscription")}
        </button>
      </span>
    </div>
  );
}

function BasicSubscription({ t, history }) {
  const { subscriptionType } = useParams();
  const goBack = () => {
    history.push("/vendor-subscription-plans");
  };

  if (
    !subscriptionType ||
    !subscriptionPlanAccess.includes(+subscriptionType)
  ) {
    goBack();
  }

  // useToGetListOfSubscription
  const { data, isLoading, isFetching, error } = useToGetListOfSubscription(
    subscriptionType,
    isVendor
  );
  useHandleApiError(isLoading, isFetching, error);
  let packageDetails = {};

  if (Array.isArray(data) && data?.length) {
    packageDetails = data[0];
  }

  const moveToEditPage = () => {
    history.push({
      pathname: constants.routes.superAdmin.editVendorSubscription.replace(
        ":subscriptionType",
        subscriptionType
      ),
      state: packageDetails,
    });
  };

  return (
    <Page
      title={t(
        "superAdminVendorSubscription.professionalSubscriptionForVendors",
        { field: getsubcriptionPlanTitle(subscriptionType) }
      )}
      onBack={goBack}
    >
      {isLoading && <Loader />}
      <DetailSubscriptionCard
        vendorCharge={packageDetails?.vendorChargeUnitPrice}
        saleRepCharge={packageDetails?.perSalesRepresentativeUnitPrice}
        action={
          <ActionHandle t={t} moveToEditPage={moveToEditPage}></ActionHandle>
        }
      />
    </Page>
  );
}

export default withTranslation()(BasicSubscription);
