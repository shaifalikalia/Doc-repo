import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";

/*components*/
import { getAllCard } from "actions/index";
import isLoading from "hoc/isLoading";
import { Fragment } from "react";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CardSetupForm from "pages/Subscription/components/cardElement";
import { withTranslation } from "react-i18next";
import EditCreditCard from "./EditCreditCard";

const stripePromise = loadStripe(`${process.env.REACT_APP_STRIPE_KEY}`);
class PaymentDetails extends Component {
  state = {
    addnewCardModal: false,
    cardType: null,
    selectedItem: this.props.CardId ? this.props.CardId : null,
    isProps: true,
    cardTypeNew: false,
    showResults: false,
  };

  componentDidMount() {
    this.props.getAllCard();
  }

  static getDerivedStateFromProps(props, state) {
    if (props.location.pathname !== "/AddOffice" && state.isProps) {
      return {
        selectedItem: props.CardId,
      };
    }
    return null;
  }

  handlecardSelect = (id) => {
    this.setState({ selectedItem: id, isProps: false });
    if (this.props.CardSelect) {
      this.props.CardSelect(id);
    }
  };

  handleAddCard = () => {
    this.setState({ addnewCardModal: true, isProps: false, cardTypeNew: true });
  };

  closeAddCard = () => {
    this.setState({ addnewCardModal: false, cardTypeNew: false });
  };

  handleEdit = (id) => {
    this.setState({ showResults: id });
  };

  render() {
    const { cardList, t } = this.props;
    let cardData = null;

    if (cardList && cardList.length > 0) {
      cardData = (
        <Fragment>
          {cardList.map((item) => {
            if (item.last4Digit) {
              return (
                <>
                  {this.state.showResults === item.id ? (
                    <EditCreditCard
                      isEdit={item.isEdit}
                      cardId={item.id}
                      handleEdit={(status) => {
                        this.handleEdit(status);
                      }}
                    />
                  ) : (
                    <li key={item.id} id="EditableCard">
                      <div className="ch-radio">
                        <label
                          onClick={() => this.handlecardSelect(item.id)}
                          className={
                            this.state.selectedItem === item.id
                              ? "active-card"
                              : ""
                          }
                        >
                          <input
                            type="radio"
                            name="cardType"
                            checked={item.id === this.state.selectedItem}
                          />
                          <span className="d-flex align-items-center">
                            <div className="card-image card-image-new">
                              {item.type === "mastercard" ? (
                                <img
                                  src={
                                    require("assets/images/master-card.svg")
                                      .default
                                  }
                                  alt="img"
                                />
                              ) : item.type === "visa" ? (
                                <img
                                  src={
                                    require("assets/images/visa-card.svg")
                                      .default
                                  }
                                  alt="img"
                                />
                              ) : item.type === "discover" ? (
                                <img
                                  src={
                                    require("assets/images/discover-card.svg")
                                      .default
                                  }
                                  alt="img"
                                />
                              ) : item.type === "amex" ? (
                                <img
                                  src={
                                    require("assets/images/american-express-card.svg")
                                      .default
                                  }
                                  alt="img"
                                />
                              ) : (
                                <img
                                  src={
                                    require("assets/images/credit-card.svg")
                                      .default
                                  }
                                  alt="img"
                                />
                              )}
                            </div>

                            {item.last4Digit &&
                              `**** **** **** ${item.last4Digit}`}
                          </span>
                        </label>
                      </div>
                      <span
                        className="payment-edit-button"
                        onClick={() => {
                          this.handleEdit(item.id);
                        }}
                      >
                        Edit
                      </span>
                    </li>
                  )}
                </>
              );
            } else return null;
          })}
        </Fragment>
      );
    }

    return (
      <div className="card-list-container ">
        {this.props.profile &&
        this.props.profile.billingPreferenceType &&
        this.props.profile.billingPreferenceType === 2 ? (
          <div className="card-data-list">
            <h3>{t("accountOwner.selectCard")}</h3>
            <div className="card-list">
              <ul>{cardData}</ul>
            </div>
            {this.props.Errors && (
              <span className="error-msg">{this.props.Errors.cardId}</span>
            )}
            {cardData && (
              <div className="sperator">
                <span>{t("accountOwner.ortoo")}</span>
              </div>
            )}
            <ul>
              <li>
                <div className="ch-radio pratik">
                  {" "}
                  <label>
                    <input
                      type="radio"
                      name="cardTypeNew"
                      checked={this.state.cardTypeNew}
                      onClick={this.handleAddCard}
                    />
                    <span>{t("accountOwner.addNewCard")}</span>
                  </label>
                </div>
              </li>
            </ul>
            {this.state.addnewCardModal && (
              <div className="card-details-form pratik">
                <div className="card-field-group">
                  <Elements stripe={stripePromise}>
                    <CardSetupForm
                      history={this.props.history}
                      billingPreferenceType={null}
                      isCardSetupOffice={true}
                      closeAddCard={this.closeAddCard}
                    />
                  </Elements>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="card-details-form">
            <div className="card-field-group">
              <Elements stripe={stripePromise}>
                <CardSetupForm
                  history={this.props.history}
                  billingPreferenceType={null}
                  isCardSetupOffice={true}
                />
              </Elements>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = ({
  userProfile: { profile },
  sub: { cardList, pageLoader, cardstatusMessage, cardSaved },
}) => ({
  profile,
  cardList,
  pageLoader,
  cardstatusMessage,
  cardSaved,
});

export default connect(mapStateToProps, { getAllCard })(
  withRouter(isLoading(withTranslation()(PaymentDetails)))
);
