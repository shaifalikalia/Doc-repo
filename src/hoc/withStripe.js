import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(`${process.env.REACT_APP_STRIPE_KEY}`);

const withStripe = (Component) => {
  return (props) => {
    return (
      <Elements stripe={stripePromise}>
        <Component {...props} />
      </Elements>
    );
  };
};

export default withStripe;
