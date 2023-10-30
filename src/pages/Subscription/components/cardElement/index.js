import React, { useState, useEffect, useRef } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

import CardSection from "../cardSection";
import { connect } from "react-redux";
import { getcardSecret, saveCardId, saveCardBilling } from "actions/index";

/*components*/
import _isLoading from "hoc/isLoading";
import Loader from "components/Loader";
import { withTranslation } from "react-i18next";

const CardSetupForm = (props) => {
  const stripe = useStripe();
  const elements = useElements();
  const [, setToastView] = useState(false);
  const [isLoader, setLoader] = useState(false);
  const [errorMessage, setError] = useState(null);

  const [expiryMonth, setexpiryMonth] = useState(null);
  const [expiryYear, setexpiryYear] = useState(null);

  const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    }, [value]);
    return ref.current;
  };

  const prevMessage = usePrevious(props.cardstatusMessage);
  const prevClient = usePrevious(props.cardSecert);

  // eslint-disable-next-line
  useEffect(() => {
    if (prevMessage !== props.cardstatusMessage) {
      setToastView(true);
    }
    if (prevClient !== props.cardSecert) {
      handleSaveCard(props.cardSecert);
    }
    if (props.cardSaved && !props.isCardSetupOffice) {
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }
    const cardElement = elements.getElement(CardElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      console.log("[error]", error);
      setError(error.message);
    } else {
      setexpiryMonth(paymentMethod.card.exp_month);
      setexpiryYear(paymentMethod.card.exp_year);
      props.getcardSecret();
    }
  };

  const handleSaveCard = async (id) => {
    if (!stripe || !elements) {
      return;
    }
    setLoader(true);
    if (id) {
      const cardElement = elements.getElement(CardElement);
      const result = await stripe.confirmCardSetup(id.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        setLoader(false);
        console.log("[error]", result.error);
        setError(result.error.message);
      } else {
        setLoader(false);
        if (props.isCardSetupOffice) {
          const payload = {
            stripePaymentMethodId: result.setupIntent.payment_method,
            expiryMonth,
            expiryYear,
          };

          if (props.editId) {
            payload.id = props.editId;
          }

          props.saveCardId({ ...payload });
        } else {
          const payload = {
            stripePaymentMethodId: result.setupIntent.payment_method,
            billingPreferenceType:
              props.profile &&
              props.profile.userSubscription &&
              (props.profile.userSubscription.packageType ===
                "multiple-office" ||
                props.profile.userSubscription.packageType === "enterprise")
                ? parseInt(props.billingPreferenceType)
                : null,
            expiryMonth,
            expiryYear,
          };
          props.saveCardBilling({ ...payload });
        }

        cardElement.clear();

        if (props.closeAddCard) {
          props.closeAddCard();
        }
      }
    }
  };

  const t = props.t;
  return (
    <div className="card-details-contaier">
      {isLoader && <Loader />}
      <div className="row">
        <div className="col-md-8">
          <form onSubmit={handleSubmit}>
            <h3>{t("accountOwner.cardDetails")}</h3>
            <CardSection />
            {errorMessage && <span className="error-msg">{errorMessage}</span>}
            <div className="button-grid gap-4 mt-2 ">
              {props.editId ? (
                <>
                  <button className="button button-round button-shadow mr-2">
                    {t("accountOwner.updateCard")}
                  </button>
                  <button
                    class="button button-round button-border button-dark cancel-btn mt-sm-3 mt-xs-3"
                    title="Cancel"
                    onClick={props.closeAddCard}
                  >
                    {t("cancel")}
                  </button>
                </>
              ) : (
                <button
                  className="button button-round button-shadow"
                  disabled={!stripe}
                >
                  {t("accountOwner.saveCard")}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({
  userProfile: { profile },
  sub: { cardstatusMessage, isLoading, cardSecert, cardSaved, isLoadError },
  errors: { isError },
}) => ({
  cardstatusMessage,
  isLoading,
  isError,
  profile,
  cardSecert,
  cardSaved,
  isLoadError,
});

export default connect(mapStateToProps, {
  getcardSecret,
  saveCardId,
  saveCardBilling,
})(_isLoading(withTranslation()(CardSetupForm)));
