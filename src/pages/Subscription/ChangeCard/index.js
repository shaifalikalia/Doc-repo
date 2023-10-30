import React, { Component } from "react";
import PaymentDetails from "pages/Subscription/PaymentDetails";
import { connect } from "react-redux";
import { getOfficesDetail, updateCardOffice } from "actions/index";
import Toast from "components/Toast";
import Loader from "components/Loader";
import { withTranslation } from "react-i18next";

class ChangeCard extends Component {
  state = {
    isToastView: false,
    cardId: "",
    officeId: this.props.match.params.id,
    isProps: true,
    oldCardId: "",
  };

  componentDidMount() {
    if (
      this.props.profile &&
      this.props.profile.userSubscription.packageType === "trial"
    ) {
      this.props.history.push("/");
    }
    if (this.props.match.params) {
      this.props.getOfficesDetail({ Id: parseInt(this.props.match.params.id) });
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (state.isProps) {
      return {
        cardId: props.officeDetail && props.officeDetail.cardId,
        oldCardId: props.officeDetail && props.officeDetail.cardId,
      };
    }
    return null;
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.isPaymentDetailError !== this.props.isPaymentDetailError ||
      prevProps.cardstatusMessage !== this.props.cardstatusMessage
    ) {
      window.scrollTo(0, 0);
      this.setState({ isToastView: true });
      setTimeout(() => {
        if (this.props.cardstatusMessage && this.props.cardSaved) {
          this.setState({ isToastView: false });
        }

        if (!this.props.isLoadError && this.props.cardAssign) {
          this.props.history.goBack();
        }

        if (
          this.props.cardSaved &&
          this.props.profile &&
          this.props.profile.billingPreferenceType &&
          this.props.profile.billingPreferenceType === 1
        ) {
          this.props.history.goBack();
        }
      }, 2000);
    }
  }
  toastHide = () => {
    this.setState({ isToastView: false });
  };

  handleCardSelect = (id) => {
    this.setState({ cardId: id, isProps: false });
  };

  handleUpdateCard = () => {
    const { cardId, officeId } = this.state;
    const payload = {
      cardId,
      officeId: parseInt(officeId),
    };
    this.props.updateCardOffice({ ...payload });
  };

  render() {
    const {
      PaymentstatusMessage,
      cardstatusMessage,
      isPaymentDetailError,
      isLoadError,
      updateCardLoader,
      t,
    } = this.props;
    const { isToastView } = this.state;

    return (
      <div className="change-card-block">
        {isToastView && PaymentstatusMessage && (
          <Toast
            message={PaymentstatusMessage}
            handleClose={this.toastHide}
            errorToast={isPaymentDetailError ? true : false}
          />
        )}

        {isToastView && cardstatusMessage && (
          <Toast
            message={cardstatusMessage}
            handleClose={this.toastHide}
            errorToast={isLoadError ? true : false}
          />
        )}

        {updateCardLoader ? <Loader /> : null}

        <div className="container">
          <button className="back-btn">
            {/* eslint-disable-next-line  */}
            <a className="_link" onClick={() => this.props.history.goBack()}>
              <span className="ico">
                <img
                  src={require("assets/images/arrow-back-icon.svg").default}
                  alt="arrow"
                />
              </span>
              {t("back")}
            </a>
          </button>
        </div>
        <div className="container container-smd">
          <h2 className="title">
            {t("accountOwner.editCardDetail", {
              officeName: this.props?.officeDetail?.name,
            })}
          </h2>
          <div className="change-card-block">
            <PaymentDetails
              CardId={this.props.officeDetail && this.props.officeDetail.cardId}
              CardSelect={this.handleCardSelect}
            />
            {this.props.profile &&
              this.props.profile.billingPreferenceType &&
              this.props.profile.billingPreferenceType === 2 && (
                <div className="btn-field">
                  <div className="row gutters-12 d-grid gap-3">
                    <div className="col-md-auto p-2">
                      <button
                        className="button button-round button-shadow "
                        disabled={
                          isToastView ||
                          this.state.cardId === this.state.oldCardId
                        }
                        title="Update card"
                        onClick={this.handleUpdateCard}
                      >
                        {t("accountOwner.updateCard")}
                      </button>
                    </div>
                    <div className="col-md-auto p-2">
                      <button
                        className="button button-round button-border button-dark "
                        title="Cancel"
                        onClick={() => this.props.history.goBack()}
                      >
                        {t("cancel")}
                      </button>
                    </div>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({
  userProfile: { profile },
  offices: { statusMessage, isLoading, officeDetail },
  sub: {
    PaymentstatusMessage,
    isPaymentDetailError,
    cardstatusMessage,
    isLoadError,
    cardSaved,
    updateCardLoader,
    cardAssign,
  },
  errors: { isError },
}) => ({
  statusMessage,
  isLoading,
  officeDetail,
  profile,
  isError,
  PaymentstatusMessage,
  isPaymentDetailError,
  cardstatusMessage,
  isLoadError,
  cardSaved,
  updateCardLoader,
  cardAssign,
});

export default connect(mapStateToProps, {
  getOfficesDetail,
  updateCardOffice,
})(withTranslation()(ChangeCard));
