import React, { useEffect, useState } from "react";
import Page from "components/Page";
import LayoutVendor from "VendorManagement/components/LayoutVendor";
import withStripe from "hoc/withStripe";
import { withTranslation } from "react-i18next";
import { useStripe } from "@stripe/react-stripe-js";
import styles from "./../TopUp/TopUp.module.scss";
import { Link } from "react-router-dom";

function PaymentSuccees({ t }) {
  const stripe = useStripe();
  const [message, setMessage] = useState(null);
  const [paymentType, setPaymentType] = useState();

  const paymentTypes = {
    success: 1,
    process: 2,
    error: 3,
  };

  useEffect(() => {
    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );
    if (!stripe || !clientSecret) return;

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case "succeeded":
          setPaymentType(paymentTypes.success);
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setPaymentType(paymentTypes.process);
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setPaymentType(paymentTypes.error);
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  return (
    <LayoutVendor>
      <Page>
        {paymentTypes.success === paymentType && (
          <div className={styles["top-up-purchased"]}>
            <img
              src={require("assets/images/top-up-successfully.svg").default}
              alt="icon"
            />
            <h3>{t("vendorManagement.topUpPurchasedSuccessfully")}</h3>
            <Link className="button button-round button-shadow" to="/promotion">
              {" "}
              {t("vendorManagement.goToPromotions")}
            </Link>
          </div>
        )}

        {paymentTypes.error === paymentType && (
          <div>
            <div className={styles["top-up-purchased"]}>
              <img
                src={require("assets/images/top-up-failed.svg").default}
                alt="icon"
              />
              <h3>{t("vendorManagement.topUpPurchasedFailed")}</h3>
              <p>{message}</p>
            </div>
          </div>
        )}
      </Page>
    </LayoutVendor>
  );
}
export default withTranslation()(withStripe(PaymentSuccees));
