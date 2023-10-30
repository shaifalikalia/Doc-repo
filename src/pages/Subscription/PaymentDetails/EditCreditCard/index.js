import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import CardSetupForm from "pages/Subscription/components/cardElement";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(`${process.env.REACT_APP_STRIPE_KEY}`);

const EditCreditCard = ({ handleEdit, cardId }) => {
  return (
    <>
      <li id="NonEditableCard">
        <div className="card payment-new-card">
          <div className="p-2">
            <div className={"card-details-form  mt-0 mb-0"}>
              <div className="card-field-group mt-0 mb-0">
                <Elements stripe={stripePromise}>
                  <CardSetupForm
                    billingPreferenceType={null}
                    isCardSetupOffice={true}
                    closeAddCard={() => handleEdit(false)}
                    editId={cardId}
                  />
                </Elements>
              </div>
            </div>
          </div>
        </div>
      </li>
    </>
  );
};

export default EditCreditCard;
