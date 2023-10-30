import { Fragment, useState } from "react";
import { withTranslation } from "react-i18next";
import { useElements, useStripe, CardElement } from "@stripe/react-stripe-js";
import {
  useAddVendorCardDetails,
  useGetStripeClientSecret,
} from "repositories/vendor-repository";
import useHandleApiError from "hooks/useHandleApiError";
import { handleError } from "utils";
import Loader from "components/Loader";
import { toast } from "react-hot-toast";
import withStripe from "hoc/withStripe";
import CardSection from "pages/Subscription/components/cardSection";
import styles from "./../editProfile.module.scss";

const CardDetails = ({ listOfCards, t, goBack }) => {
  const [changeCard, setChangeCard] = useState(false);
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
        goBack();
      }
    } catch (error) {
      handleError(error);
    }
    refetchSecret();
    setAddingCardDetails(false);
  };

  return (
    <Fragment>
      {(addingCardDetails || loadingSecret) && <Loader />}
      {!!listOfCards?.length &&
        !changeCard &&
        listOfCards?.map((item) => (
          <div key={listOfCards.id}>
            <label>{t("accountOwner.creditCardDetails")}</label>
            <div className={"row no-gutters " + styles["card-details"]}>
              <div className="col-md-8">
                <div className="card_type">
                  <span className={"_img " + styles["card-img"]}>
                    {getCardImage(item.type)}
                  </span>
                  <span>
                    {item.last4Digit && `**** **** **** ${item.last4Digit}`}
                  </span>
                </div>
              </div>
              <div className="col-md-4">
                <span
                  className={"_link " + styles["change-card-details"]}
                  onClick={() => setChangeCard(true)}
                >
                  {t("accountOwner.changeCardDetails")}
                </span>
              </div>
            </div>
          </div>
        ))}

      {changeCard && (
        <div>
          <div className="field-group card-section col-md-8">
            <div className="card-details mb-2">
              {t("vendorManagement.addBankDetails.cardDetails")}
            </div>
            <CardSection />
          </div>

          <button
            className="button button-round button-shadow w-sm-100"
            title={t("vendorManagement.addBankDetails.saveBankDetails")}
            onClick={handleSubmit}
          >
            {t("vendorManagement.addBankDetails.saveBankDetails")}
          </button>
        </div>
      )}
    </Fragment>
  );
};
export default withTranslation()(withStripe(CardDetails));

function getCardImage(type) {
  let cardImage;

  switch (type) {
    case "mastercard":
      cardImage = (
        <img src={require("assets/images/master-card.svg").default} alt="img" />
      );
      break;
    case "visa":
      cardImage = (
        <img src={require("assets/images/visa-card.svg").default} alt="img" />
      );
      break;
    case "discover":
      cardImage = (
        <img
          src={require("assets/images/discover-card.svg").default}
          alt="img"
        />
      );
      break;
    case "amex":
      cardImage = (
        <img
          src={require("assets/images/american-express-card.svg").default}
          alt="img"
        />
      );
      break;
    default:
      cardImage = (
        <img src={require("assets/images/credit-card.svg").default} alt="img" />
      );
      break;
  }

  return cardImage;
}
