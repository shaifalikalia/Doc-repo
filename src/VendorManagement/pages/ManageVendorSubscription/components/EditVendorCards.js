import { withTranslation } from "react-i18next";
import Page from "components/Page";
import LayoutVendor from "VendorManagement/components/LayoutVendor";
import Loader from "components/Loader";
import styles from "./../../ManageVendorSubscription/VendorSubscription.module.scss";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import CardSection from "pages/Subscription/components/cardSection";
import { useElements, useStripe, CardElement } from "@stripe/react-stripe-js";
import useHandleApiError from "hooks/useHandleApiError";
import { useState } from "react";
import {
  useAddVendorCardDetails,
  useGetStripeClientSecret,
} from "repositories/vendor-repository";
import { decodeId, handleError, handleSuccess } from "utils";
import withStripe from "hoc/withStripe";

const EditVendorCard = ({ t, history }) => {
  const location = useLocation();
  let cardId = location?.state?.cardId;

  const onBack = () => history.goBack();
  if (!cardId) {
    onBack();
  }

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
          Id: decodeId(cardId),
        };
        await addCardDetailsMutation.mutateAsync(payload);
        handleSuccess(t("vendorManagement.cardAddedSuc"));
        onBack();
      }
    } catch (error) {
      handleError(error);
    }
    refetchSecret();
    setAddingCardDetails(false);
  };

  return (
    <LayoutVendor>
      {addingCardDetails && <Loader />}
      <Page
        onBack={onBack}
        className={"vendor-card-custom " + styles["manage-vendor-card"]}
        title={t("vendorManagement.creditCards")}
      >
        <div className="card app-card custom-table p-4 ">
          <div>
            <div className="field-group card-section col-md-8">
              <div className="card-details mb-2">
                {t("vendorManagement.addBankDetails.cardDetails")}
              </div>
              <CardSection />
            </div>
            <button
              className="button button-round button-shadow w-sm-100"
              title={t("saveCardDetails")}
              onClick={handleSubmit}
            >
              {t("saveCardDetails")}
            </button>

            <button
              className="button button-round  button-dark btn-mobile-link mb-md-3  button-border ml-2"
              title={t("cancel")}
              onClick={onBack}
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      </Page>
    </LayoutVendor>
  );
};
export default withTranslation()(withStripe(EditVendorCard));
