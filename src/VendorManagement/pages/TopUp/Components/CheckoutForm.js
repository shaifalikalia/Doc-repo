import React, { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import "./../TopUp.scss";
import constants from "../../../../constants";
import { withTranslation } from "react-i18next";
import Loader from "components/Loader";

function CheckoutForm({ isAlreadySavedCard, handleChange, t }) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  let returnUrl = `${window.location.origin}${constants.routes.vendor.paymentSuccess}`;
  const paymentElementOptions = { layout: "tabs" };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: returnUrl,
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  return (
    <>
      {isLoading && <Loader />}
      <form id="payment-form" onSubmit={handleSubmit}>
        <PaymentElement
          id="payment-element"
          options={paymentElementOptions}
          className="payment-stripe-form"
        />
        <div className="footer d-block d-md-flex align-items-center justify-content-between">
          <div>
            <button
              disabled={isLoading || !stripe || !elements}
              id="submit"
              className="button button-round button-shadow mr-4"
            >
              <span id="button-text">
                {isLoading ? (
                  <div className="spinner" id="spinner"></div>
                ) : (
                  t("vendorManagement.pay")
                )}
              </span>
            </button>
          </div>
          {isAlreadySavedCard && (
            <div className="footer-contain">
              <span className=" add-new-card" onClick={handleChange}>
                {t("vendorManagement.useSavedCard")}
              </span>
            </div>
          )}
        </div>

        {/* Show any error or success messages */}
        {message && (
          <div id="payment-message" className="error-msg">
            {message}
          </div>
        )}
      </form>
    </>
  );
}
export default withTranslation()(CheckoutForm);
