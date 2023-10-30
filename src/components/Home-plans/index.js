import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { getpackageDetail } from "actions/index";
import EnterpriseContactModal from "pages/Subscription/EnterpriseContact";
import { withTranslation, Trans } from "react-i18next";

class Homeplans extends Component {
  state = {
    contactModal: false,
  };

  handleContactModal = () => {
    this.setState({ contactModal: true });
  };

  closeModal = () => {
    this.setState({ contactModal: false });
  };

  componentDidMount() {
    this.props.getpackageDetail();
  }
  render() {
    const { contactModal } = this.state;
    const { packageDetail, t, pharmacy } = this.props;

    let planDetail = null;

    if (packageDetail && packageDetail.length > 0) {
      planDetail = packageDetail.map((item) => {
        if (item.type !== "enterprise") {
          return (
            <div className="col-lg-6" key={item.id}>
              <div className="plan-block">
                <div className="plan-header">
                  <div className="d-flex flex-column align-items-center plan-content-layout">
                    <div>
                      {!item.isMultipleOffice ? (
                        <img
                          src={
                            require("assets/images/landing-pages/single-office.svg")
                              .default
                          }
                          alt="img"
                        />
                      ) : (
                        <img
                          src={
                            require("assets/images/landing-pages/office-multiple.svg")
                              .default
                          }
                          alt="img"
                        />
                      )}
                      <h3>
                        {pharmacy
                          ? item.isMultipleOffice
                            ? t("userPages.plan.multiplePharmacy")
                            : t("userPages.plan.singlePharmacy")
                          : item.name}
                      </h3>
                      <div className="price">
                        <h4>
                          <span>$</span>
                          {item.perOfficeCharge}
                          <sub>
                            /{t("userPages.plan.perMonth")}{" "}
                            {item.isMultipleOffice && (
                              <span className="per-office">
                                {" "}
                                {!pharmacy
                                  ? t("accountOwner.perOffice")
                                  : "per Pharmacy"}
                              </span>
                            )}
                          </sub>
                        </h4>
                      </div>
                      <div className="feature-list">
                        <ul>
                          <li>
                            <span className="price-bold">
                              + ${item.perPermanentStaffMemberCharge}
                            </span>{" "}
                            {t("userPages.plan.perActiveStaff")}/{" "}
                            {t("userPages.plan.perMonth")}
                          </li>
                          <li>
                            <span className="price-bold">
                              + ${item.perTemporaryStaffMemberCharge}
                            </span>{" "}
                            {t("userPages.plan.perActiveTempStaff")}/{" "}
                            {t("userPages.plan.perMonth")}
                          </li>
                          <li>
                            <span className="price-bold">
                              + ${item.perPlacementChange}
                            </span>{" "}
                            {t("userPages.plan.perStaffPlacement")}
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="button_block">
                      <button
                        className="button button-round button-border button-dark button-block"
                        title={t("userPages.plan.cta1")}
                        onClick={this.props.SignupClick}
                      >
                        {t("userPages.plan.cta1")}
                      </button>
                      <button
                        className="button button-round button-shadow button-block"
                        title={t("userPages.plan.cta1")}
                        onClick={this.props.SignupClick}
                      >
                        {t("userPages.plan.cta2")}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        }
        return "";
      });
    }
    return (
      <div className="plan-list-section" id="plan-list">
        <div className="container">
          <h2>{t("userPages.plan.title")}</h2>
          <div className="plan-list">
            <div className="row">
              {planDetail && planDetail.length > 0 && (
                <Fragment>
                  {planDetail}
                  <div className="col-lg-4 d-none">
                    <div className="plan-block">
                      <div className="plan-header">
                        <div className="d-flex flex-column align-items-center plan-content-layout">
                          <div>
                            <img
                              src={
                                require("assets/images/hospital-enterprise.svg")
                                  .default
                              }
                              alt="img"
                            />
                            <h3>{t("userPages.plan.enterprise")}</h3>
                            <div className="contact-block">
                              <h4>
                                <Trans i18nKey="userPages.plan.enterpriseText1">
                                  Contact Sales <br /> To Build a Custom Plan
                                </Trans>
                              </h4>
                              <p>
                                <Trans i18nKey="userPages.plan.enterpriseText2">
                                  Ideal for large enterprises with <br /> setups
                                  across countries, having a <br /> large set of
                                  employees.
                                </Trans>
                              </p>
                            </div>
                          </div>
                          <div className="button_block">
                            <button
                              className="button button-round button-border button-dark button-block"
                              title={t("userPages.plan.cta1")}
                              onClick={this.props.SignupClick}
                            >
                              {t("userPages.plan.cta1")}
                            </button>
                            <button
                              className="button button-round button-shadow button-block"
                              title={t("userPages.plan.cta3")}
                              onClick={this.handleContactModal}
                            >
                              {t("userPages.plan.cta3")}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Fragment>
              )}
            </div>
          </div>
        </div>
        <EnterpriseContactModal
          show={contactModal}
          closeModal={this.closeModal}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ pageContent: { packageDetail } }) => ({
  packageDetail,
});

export default connect(mapStateToProps, { getpackageDetail })(
  withTranslation()(Homeplans)
);
