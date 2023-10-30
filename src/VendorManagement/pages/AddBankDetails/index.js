import Card from "components/Card";
import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import Page from "components/Page";
import "./AddBankDetails.scss";
import withStripe from "hoc/withStripe";
import CardSection from "pages/Subscription/components/cardSection";
import { useElements, useStripe, CardElement } from "@stripe/react-stripe-js";
import {
  useAddVendorCardDetails,
  useGetStripeClientSecret,
} from "repositories/vendor-repository";
import { handleError } from "utils";
import Loader from "components/Loader";
import useHandleApiError from "hooks/useHandleApiError";
import HeaderVendor from "VendorManagement/components/HeaderVendor";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import constants from "../../../constants";

const AddBankDetails = ({ t }) => {
  const profile = useSelector((e) => e.userProfile.profile);
  const stripe = useStripe();
  const elements = useElements();

  const [addingCardDetails, setAddingCardDetails] = useState(false);

  const {
    isLoading: loadingSecret,
    isFetching: fetchingSecret,
    data,
    error: secretError,
    refetch: refetchSecret,
  } = useGetStripeClientSecret();
  useHandleApiError(loadingSecret, fetchingSecret, secretError);
  const addCardDetailsMutation = useAddVendorCardDetails();

  const handleSubmit = async (e) => {
    setAddingCardDetails(true);
    e.preventDefault();
    try {
      if (!stripe || !elements || !data?.clientSecret) {
        throw new Error(t("vendorManagement.errors.stripeError"));
      }
      const cardElement = elements.getElement(CardElement);
      const { paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });
      if (paymentMethod) {
        const { error: intentError, setupIntent } =
          await stripe.confirmCardSetup(data.clientSecret, {
            payment_method: {
              card: elements.getElement(CardElement),
            },
          });
        if (intentError) {
          throw intentError;
        }
        const payload = {
          StripePaymentMethodId: setupIntent.payment_method,
          ExpiryMonth: paymentMethod.card.exp_month,
          ExpiryYear: paymentMethod.card.exp_year,
        };
        await addCardDetailsMutation.mutateAsync(payload);
        toast.success(t("vendorManagement.cardAddedSuc"));
        window.location.reload();
      }
    } catch (error) {
      handleError(error);
    }
    refetchSecret();
    setAddingCardDetails(false);
  };

  return (
    <>
      <HeaderVendor simple={true} />
      <Page
        className="vendor-bank-details"
        title={t("accountOwner.confirmSubscription")}
      >
        <div className="">{t("accountOwner.subscriptionTrailHeading")}</div>
        {(addingCardDetails || loadingSecret) && <Loader />}
        <Card className="bank-card">
          <div className="page-step">
            {profile?.profileSetupStep !== constants.vendor.step.completed &&
              t("vendorManagement.addBankDetails.pageStep")}
          </div>

          <div className="field-group">
            <div>
              <div className="card-details mb-2">
                {t("vendorManagement.addBankDetails.cardDetails")}
              </div>
              <CardSection />
            </div>
          </div>

          <div className="btn-field">
            <button
              className="button button-round button-shadow w-sm-100"
              title={t("vendorManagement.addBankDetails.saveCardDetails")}
              onClick={handleSubmit}
            >
              {t("vendorManagement.addBankDetails.saveCardDetails")}
            </button>
          </div>
        </Card>
      </Page>
    </>
  );
};

export default withTranslation()(withStripe(AddBankDetails));
