import React, { Component } from "react";
import { connect } from "react-redux";
import { getMyPlan, getAllPlans } from "actions/index";

/*components*/
import _isLoading from "hoc/isLoading";
import Empty from "components/Empty";
import EnterpriseContactModal from "../EnterpriseContact";
import { withTranslation, Trans } from "react-i18next";

class SubscriptionPlans extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contactModal: false,
    };
  }

  componentDidMount() {
    if (this.props.location.state && !this.props.location.state.enterprise) {
      this.props.getMyPlan();
      this.props.getAllPlans();
    } else {
      this.props.history.push("/");
    }
  }

  handleContactModal = () => {
    this.setState({ contactModal: true });
  };

  closeModal = () => {
    this.setState({ contactModal: false });
  };

  handleChangePlan = (type) => {
    this.props.history.push("/add-subscription", {
      changePlan: true,
      planType: type,
    });
  };

  render() {
    const { contactModal } = this.state;
    const { planList, isLoadError, curPlanDetail, t } = this.props;

    let usePlanList = null;

    if (planList && planList.length > 0) {
      usePlanList = planList.map((item) => {
        if (item.type !== "enterprise") {
          return (
            <div className="col-md-4" key={item.id}>
              <div
                className={`plan-block  ${
                  curPlanDetail && curPlanDetail.type === item.type
                    ? "active-plan"
                    : ""
                }`}
              >
                <div className="plan-header">
                  <img
                    src={require("assets/images/hospital-single.svg").default}
                    alt="img"
                  />
                  <h3>{item.name}</h3>
                  <div className="price">
                    <h4>
                      <span>$</span>
                      {item.perOfficeCharge}
                      <sub>
                        /{t("accountOwner.mo")}
                        {item.isMultipleOffice === true && (
                          <span className="per-office">
                            {" "}
                            {t("accountOwner.perOffice")}
                          </span>
                        )}
                      </sub>
                    </h4>
                  </div>
                  <div className="feature-list">
                    <ul>
                      <li>
                        <span>
                          <img
                            src={
                              require("assets/images/check-mark-button.svg")
                                .default
                            }
                            alt="img"
                          />
                        </span>
                        + ${item.perPermanentStaffMemberCharge}{" "}
                        {t("accountOwner.perActiveUserStaff")} /{" "}
                        {t("accountOwner.mo")}
                      </li>

                      <li>
                        <span>
                          <img
                            src={
                              require("assets/images/check-mark-button.svg")
                                .default
                            }
                            alt="img"
                          />
                        </span>
                        + ${item.perTemporaryStaffMemberCharge}{" "}
                        {t("accountOwner.perActiveTempUserStaff")} /{" "}
                        {t("accountOwner.mo")}
                      </li>

                      <li>
                        <span>
                          <img
                            src={
                              require("assets/images/check-mark-button.svg")
                                .default
                            }
                            alt="img"
                          />
                        </span>
                        + ${item.perPlacementChange}{" "}
                        {t("accountOwner.perStaffPlacement")}
                      </li>
                    </ul>
                  </div>
                  <div className="button-block">
                    {curPlanDetail && curPlanDetail.type === item.type ? (
                      <button
                        className="button button-round button-border button-dark button-block"
                        title={t("accountOwner.yourCurrentPlan")}
                      >
                        <span className="ico">
                          <i className="ico  icon-tick"></i>
                        </span>
                        {t("accountOwner.yourCurrentPlan")}
                      </button>
                    ) : (
                      <button
                        className="button button-round button-shadow button-block"
                        title={t("accountOwner.purchasePlan")}
                        onClick={() => this.handleChangePlan(item)}
                      >
                        {t("accountOwner.purchasePlan")}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        }

        if (item.type === "enterprise" && item.id === 0) {
          return (
            <div className="col-md-4" key={item.id}>
              <div className="plan-block enterprise-office-plan">
                <div className="plan-header">
                  <img
                    src={
                      require("assets/images/hospital-enterprise.svg").default
                    }
                    alt="img"
                  />
                  <h3>{t("accountOwner.enterprise")}</h3>
                  <div className="contact-block">
                    <h4>
                      <Trans i18nKey="accountOwner.enterprisePlanTitle">
                        Contact Sales <br /> To Build a Custom Plan
                      </Trans>
                    </h4>
                    <p>{t("accountOwner.enterprisePlanDescription")}</p>
                  </div>
                  <div className="button-block">
                    <button
                      className="button button-round button-shadow button-block"
                      title={t("contactUs")}
                      onClick={this.handleContactModal}
                    >
                      {t("contactUs")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        if (item.type === "enterprise" && item.id !== 0) {
          return (
            <div className="col-md-4" key={item.id}>
              <div className="plan-block enterprise-office-plan">
                <div className="plan-header">
                  <img
                    src={
                      require("assets/images/hospital-enterprise.svg").default
                    }
                    alt="img"
                  />
                  <h3>{t("accountOwner.enterprise")}</h3>
                  <div className="price">
                    <h4>
                      <span>$</span>
                      {item.perOfficeCharge}
                      <sub>
                        /{t("accountOwner.mo")}
                        {item.isMultipleOffice === true && (
                          <span className="per-office">
                            {" "}
                            {t("accountOwner.perOffice")}
                          </span>
                        )}
                      </sub>
                    </h4>
                  </div>
                  <div className="feature-list">
                    <ul>
                      <li>
                        <span>
                          <img
                            src={
                              require("assets/images/check-mark-button.svg")
                                .default
                            }
                            alt="img"
                          />
                        </span>
                        + ${item.officeCount} {t("accountOwner.noOfOffices")}{" "}
                      </li>

                      <li></li>
                      <li>
                        <span>
                          <img
                            src={
                              require("assets/images/check-mark-button.svg")
                                .default
                            }
                            alt="img"
                          />
                        </span>
                        + ${item.perPermanentStaffMemberCharge}{" "}
                        {t("accountOwner.perActiveUserStaff")} /{" "}
                        {t("accountOwner.mo")}
                      </li>
                      <li>
                        <span>
                          <img
                            src={
                              require("assets/images/check-mark-button.svg")
                                .default
                            }
                            alt="img"
                          />
                        </span>
                        + ${item.perTemporaryStaffMemberCharge}{" "}
                        {t("accountOwner.perActiveTempUserStaff")} /{" "}
                        {t("accountOwner.mo")}
                      </li>
                      <li>
                        <span>
                          <img
                            src={
                              require("assets/images/check-mark-button.svg")
                                .default
                            }
                            alt="img"
                          />
                        </span>
                        + ${item.perPlacementChange}{" "}
                        {t("accountOwner.perStaffPlacement")}
                      </li>
                    </ul>
                  </div>

                  <div className="button-block">
                    <button
                      className="button button-round button-shadow button-block"
                      title={t("accountOwner.purchasePlan")}
                      onClick={() => this.handleChangePlan(item)}
                    >
                      {t("accountOwner.purchasePlan")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        return null;
      });
    } else {
      usePlanList = (
        <div className="col-md-4">
          <div className="plan-block enterprise-office-plan">
            <div className="plan-header">
              <img
                src={require("assets/images/hospital-enterprise.svg").default}
                alt="img"
              />
              <h3>{t("accountOwner.enterprise")}</h3>
              <div className="contact-block">
                <h4>
                  <Trans i18nKey="accountOwner.enterprisePlanTitle">
                    Contact Sales <br /> To Build a Custom Plan
                  </Trans>
                </h4>
                <p>{t("accountOwner.enterprisePlanDescription")}</p>
              </div>
              <div className="button-block">
                <button
                  className="button button-round button-shadow button-block"
                  title={t("contactUs")}
                  onClick={this.handleContactModal}
                >
                  {t("contactUs")}
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="mange-sub-section">
        <div className="plan-section-container">
          <div className="container">
            <button className="back-btn">
              <span
                className="back-btn-text"
                onClick={() => this.props.history.goBack()}
              >
                <span className="ico">
                  <img
                    src={require("assets/images/arrow-back-icon.svg").default}
                    alt="arrow"
                  />
                </span>{" "}
                <u> {t("back")} </u>
              </span>
            </button>
          </div>
          <div className="container container-smd">
            <h2 className="title">{t("accountOwner.chooseSubscription")}</h2>
          </div>
          <div className="container">
            <div className="plans-block-pannel">
              {usePlanList && (
                <div className="row gutters-5">{usePlanList}</div>
              )}
            </div>

            {isLoadError && !planList ? (
              <Empty Message="No  plan added yet" />
            ) : null}
          </div>
          <EnterpriseContactModal
            show={contactModal}
            closeModal={this.closeModal}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({
  userProfile: { profile },
  sub: { statusMessage, isLoading, isLoadError, curPlanDetail, planList },
  errors: { isError },
}) => ({
  statusMessage,
  isLoading,
  isError,
  profile,
  isLoadError,
  curPlanDetail,
  planList,
});

export default connect(mapStateToProps, { getMyPlan, getAllPlans })(
  _isLoading(withTranslation()(SubscriptionPlans))
);
