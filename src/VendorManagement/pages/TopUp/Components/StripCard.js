import React, { useState, useMemo, useEffect } from "react";
import { withTranslation } from "react-i18next";
import { Modal } from "reactstrap";
import ModalBody from "reactstrap/lib/ModalBody";
import crossIcon from "../../../../assets/images/cross.svg";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import {
  useToGetPaymentIndent,
  useToBuyTopUp,
} from "repositories/admin-vendor-repository";
import useHandleApiError from "hooks/useHandleApiError";
import Loader from "components/Loader";
import { uniqBy } from "lodash";
import { useTogetSavedCards } from "repositories/utility-repository";
import styles from "../TopUp.module.scss";
import { toast } from "react-hot-toast";
import constants from "../../../../constants";
import Text from "components/Text";

const appearance = { theme: "stripe" };
const stripePromise = loadStripe(`${process.env.REACT_APP_STRIPE_KEY}`);

function StripCard({ t, amount, closeModel, selectedTop }) {
  const [addNewCard, setaddNewCard] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showLoaderData, setShowLoaderData] = useState(false);

  // FETCH API
  const {
    data,
    isLoading,
    isFetching,
    error: indentError,
  } = useToGetPaymentIndent(amount);
  let paymentIntentId = data?.data?.paymentIntentId;
  let option = { enabled: paymentIntentId ? true : false };
  const {
    isLoading: TopUpLoading,
    error: anError,
    isFetching: isFetchingTopUp,
  } = useToBuyTopUp(selectedTop, paymentIntentId, option);
  const {
    data: carddata,
    isLoading: cardisLoading,
    IsFetching: cardIsFetching,
    Error: cardError,
  } = useTogetSavedCards();

  useEffect(() => {
    if (!carddata?.length) {
      setaddNewCard(false);
    } else {
      setaddNewCard(true);
    }
  }, [carddata]);

  const handleClose = () => {
    if (btnDisabled) return;
    closeModel();
  };

  // API ERROR HANDLES
  useHandleApiError(cardisLoading, cardIsFetching, cardError);
  useHandleApiError(isLoading, isFetching, indentError);
  useHandleApiError(TopUpLoading, isFetchingTopUp, anError);

  // Variables
  let showLoader = isLoading || TopUpLoading || cardisLoading || showLoaderData;
  const paymentIntentClientSecret =
    data?.data?.paymentIntentClientSecret || null;
  let returnUrl = `${window.location.origin}${constants.routes.vendor.paymentSuccess}`;
  let isAlreadySavedCard = carddata?.length ? true : false;

  let cardList = useMemo(() => {
    if (carddata?.length) return [...carddata];
    return [];
  }, [carddata]);

  const options = {
    clientSecret: paymentIntentClientSecret,
    appearance,
  };

  const payViaSavedCards = async () => {
    if (!selectedCard) return;
    setBtnDisabled(true);
    setShowLoaderData(true);
    let stripe = await stripePromise;
    const { error, paymentIntent } = await stripe.confirmCardPayment(
      paymentIntentClientSecret,
      {
        payment_method: selectedCard,
      }
    );
    setBtnDisabled(false);
    if (error && !paymentIntent) {
      toast.error(error.message);
      setErrorMessage(error.message);
    } else {
      window.open(
        `${returnUrl}?payment_intent_client_secret=${paymentIntentClientSecret}`,
        "_self"
      );
    }
    setShowLoaderData(false);
  };

  const handleChange = () => {
    setaddNewCard((prev) => !prev);
  };

  return (
    <Modal
      isOpen={true}
      toggle={handleClose}
      className={"modal-dialog-centered "}
      modalClassName="custom-modal modal-width-660 stripe-card-modal"
    >
      <span className="close-btn" onClick={handleClose}>
        {" "}
        <img src={crossIcon} alt="close" />{" "}
      </span>
      <ModalBody className="text-left ">
        <div className="modal-custom-title">
          {addNewCard && (
            <Text size="25px" marginBottom="27px" weight="500" color="#111B45">
              <span className="modal-title-25">
                {t("vendorManagement.selectYourCard")}
              </span>
            </Text>
          )}
        </div>
        {showLoader && <Loader />}

        {addNewCard && (
          <div>
            <span className="error-msg">{errorMessage}</span>
            <div className={styles["card_ui"]}>
              {!!cardList?.length &&
                cardList.map((item) => (
                  <div
                    key={item.id}
                    className="mt-3"
                    onClick={() => setSelectedCard(item.id)}
                  >
                    <div className={"row no-gutters justify-content-between "}>
                      <div>
                        <input
                          type="radio"
                          name="selectedCards"
                          checked={item.id === selectedCard}
                        />

                        <span className="card_type ml-4">
                          <span>
                            {item?.last4Digit &&
                              `**** **** **** ${item?.last4Digit}`}
                          </span>
                        </span>
                      </div>
                      <div>
                        <span className={"_img mr-4"}>
                          {getCardImage(item?.type)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            <div className="footer d-block d-md-flex align-items-center justify-content-between">
              <div>
                <button
                  onClick={payViaSavedCards}
                  disabled={btnDisabled}
                  className="button button-round button-shadow mr-4 mb-3 mb-md-0"
                  title={t("vendorManagement.pay")}
                >
                  {t("vendorManagement.pay")}
                </button>
                <button
                  className="button button-round button-dark button-border"
                  title={t("cancel")}
                  onClick={handleClose}
                >
                  {t("cancel")}
                </button>
              </div>
              <div className="footer-contain">
                <span onClick={handleChange} className=" add-new-card">
                  {" "}
                  {t("vendorManagement.addNewCard")}
                </span>
              </div>
            </div>
          </div>
        )}

        {!addNewCard && (
          <div>
            {anError && <p className="error-msg">{anError.message}</p>}
            {paymentIntentClientSecret && !anError && (
              <Elements options={options} stripe={stripePromise}>
                <CheckoutForm
                  stripeDetails={data?.data || {}}
                  stripePromise={stripePromise}
                  isAlreadySavedCard={isAlreadySavedCard}
                  handleChange={handleChange}
                />
              </Elements>
            )}
          </div>
        )}
      </ModalBody>
    </Modal>
  );
}

export default withTranslation()(StripCard);

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
