import React, { Component, Fragment } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CardSetupForm from "../components/cardElement";
import { connect } from "react-redux";
import Toast from "components/Toast";
import { clearSubscription } from "actions/index";
import { Trans, withTranslation } from "react-i18next";
import constants from "../../../constants";
import { Alert } from "reactstrap";
import styles from "./Card.module.scss";

const stripePromise = loadStripe(`${process.env.REACT_APP_STRIPE_KEY}`);

class CardDetails extends Component {
  state = {
    billingPreferenceType: "1",
    isToastView: false,
  };

  componentDidMount() {
    if (
      this.props.profile &&
      this.props.profile.isAccountOwnerSetup &&
      this.props.profile.profileSetupStep === "completed"
    ) {
      this.props.history.push("/Offices");
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.cardstatusMessage !== this.props.cardstatusMessage) {
      this.setState({ isToastView: true });
    }
  }

  InputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  toastHide = () => {
    this.setState({ isToastView: false });
  };

  handleClear = () => {
    this.props.clearSubscription();
  };

  headingDescription = () => {
    if (!this.props.profile && !this.props.profile.userSubscription)
      return false;
    let { packageType, subscriptionPlan } = this.props.profile.userSubscription;
    let { t } = this.props;
    if (
      (packageType === "multiple-office" || packageType === "enterprise") &&
      subscriptionPlan !== constants.subscriptionType.trial
    ) {
      return t("accountOwner.multipleOfficeHeading");
    } else if (subscriptionPlan === constants.subscriptionType.trial) {
      return t("accountOwner.subscriptionTrailHeading");
    } else {
      return t("accountOwner.subscriptionCommonHeading");
    }
  };

  render() {
    const { billingPreferenceType, isToastView } = this.state;
    const { t } = this.props;
    const isMultipleOffice =
      this.props?.profile?.userSubscription?.isMultipleOffice;
    const isEnterPrice =
      this.props?.profile?.userSubscription?.packageType === "enterprise";

    return (
      <div className={"card-detail-section " + styles["setup-card"]}>
        <div className="container container-smd">
          {/* {this.props.profile && !this.props.profile.billingPreferenceType &&
                <button className="back-btn">
                    <span className="ico pointer" onClick={this.handleClear}>
                        <img src={require('assets/images/arrow-back-icon.svg').default} alt="arrow" />  Back
                    </span>
                </button>
                } */}

          <div className="card-details-form">
            {isToastView && this.props.cardstatusMessage && (
              <Toast
                message={this.props.cardstatusMessage}
                handleClose={this.toastHide}
                errorToast={this.props.isLoadError}
              />
            )}
            <h2 className="title">
              {isMultipleOffice || isEnterPrice
                ? "Confirm Subscription"
                : "Card Details"}
            </h2>
            <h4>{this.headingDescription()}</h4>
            <div className="card-field-group">
              {(isMultipleOffice || isEnterPrice) && (
                <Fragment>
                  <div className="card-options">
                    <h4>{t("accountOwner.billingPreferenceTitle")}</h4>
                    <Alert
                      color="warning"
                      className={
                        "event-alert-box mt-0 mb-3 " + styles["card-alert"]
                      }
                    >
                      {t("accountOwner.durationAlert")}
                    </Alert>
                    <div className="ch-radio">
                      <label>
                        <input
                          type="radio"
                          name="billingPreferenceType"
                          checked={billingPreferenceType === "1" ? true : false}
                          value="1"
                          onChange={this.InputChange}
                        />
                        <span>
                          <Trans i18nKey="accountOwner.billingPreferenceType1Text">
                            One Credit Card for Every Offices{" "}
                            <strong>
                              (For One Credit Card, You Will Get One Invoice)
                            </strong>
                          </Trans>
                        </span>
                      </label>
                    </div>
                    <div className="ch-radio">
                      <label>
                        <input
                          type="radio"
                          name="billingPreferenceType"
                          checked={billingPreferenceType === "2" ? true : false}
                          value="2"
                          onChange={this.InputChange}
                        />
                        <span>
                          <Trans i18nKey="accountOwner.billingPreferenceType2Text">
                            Different Credit Card for Different Offices{" "}
                            <strong>
                              (For Multiple Credit Cards, You Will Get Multiple
                              Invoices)
                            </strong>
                          </Trans>
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="card-note">
                    <p>{t("accountOwner.cardInputText1")}</p>
                    {billingPreferenceType === "2" && (
                      <span>{t("accountOwner.cardInputText2")}</span>
                    )}
                  </div>
                </Fragment>
              )}

              <Elements stripe={stripePromise}>
                <CardSetupForm
                  history={this.props.history}
                  billingPreferenceType={this.state.billingPreferenceType}
                  isCardSetupOffice={false}
                />
              </Elements>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({
  userProfile: { profile },
  sub: { cardstatusMessage, isLoadError },
}) => ({
  profile,
  cardstatusMessage,
  isLoadError,
});

export default connect(mapStateToProps, { clearSubscription })(
  withTranslation()(CardDetails)
);
