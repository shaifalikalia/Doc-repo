import { getCompanyInformation } from "actions";
import _isLoading from "hoc/isLoading";
import HomeContact from "components/Home-contact";
import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import classnames from "classnames";
import "react-accessible-accordion/dist/fancy-example.css";
import { Link } from "react-router-dom";
import { isMobileTab } from "utils";
import HomePlansNew from "components/Home-plans-new";
class Pricing extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.getCompanyInformation();
  }
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: "11",
    };
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
      isMobileTab() && this.scrollToPlan(tab);
    }
  }

  scrollToPlan(id) {
    setTimeout(() => {
      var element = document.getElementById(id);
      var headerOffset = 70;
      var elementPosition = element.getBoundingClientRect().top;
      var offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        behavior: "smooth",
        top: offsetPosition,
      });
    }, 500);
  }

  render() {
    const { t } = this.props;
    return (
      <div className="app-page">
        <div className="banner-block pricing-banner faq-banner">
          <div className="container">
            <div className="banner-caption">
              <h2>{t("pricing.pricing")}</h2>
              <Nav tabs className="pricing-tabs faq-tabs">
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: this.state.activeTab === "11",
                    })}
                    onClick={() => {
                      this.toggle("11");
                    }}
                  >
                    {t("pricing.healthcareProfessionals")}
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: this.state.activeTab === "12",
                    })}
                    onClick={() => {
                      this.toggle("12");
                    }}
                  >
                    {t("pricing.healthcareEnterprise")}
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: this.state.activeTab === "13",
                    })}
                    onClick={() => {
                      this.toggle("13");
                    }}
                  >
                    {t("pricing.personnel")}
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: this.state.activeTab === "14",
                    })}
                    onClick={() => {
                      this.toggle("14");
                    }}
                  >
                    {t("pricing.patients")}
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: this.state.activeTab === "15",
                    })}
                    onClick={() => {
                      this.toggle("15");
                    }}
                  >
                    {t("pricing.suppliers")}
                  </NavLink>
                </NavItem>
              </Nav>
            </div>
          </div>
        </div>
        <div className="pricing-main-wrapper" id="pricing-tabs">
          <div className="container text-center">
            <TabContent activeTab={this.state.activeTab}>
              <TabPane tabId="11">
                <div className="pricing-description" id="11">
                  <p>{t("pricing.professionalgDesc")}</p>
                </div>
                <div className="features-pricing">
                  <HomePlansNew SignupClick={this.props.SignupClick} hideTitle={true} /> 
                </div>
              </TabPane>
              <TabPane tabId="12">
                <div className="pricing-description" id="12">
                  <p>{t("pricing.plan.0.pricingDesc")}</p>
                </div>
                <div className="features-pricing contact-sales-pricing">
                  <div className="plan-list-section">
                    <div className="plan-list">
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

                              <h3>{t("pricing.plan.0.title")}</h3>
                              <div className="price">
                                <h4>{t("pricing.plan.0.price")}</h4>
                              </div>
                              <div className="feature-list">
                                <ul>
                                  <li className="mb-0">
                                    {t("pricing.plan.0.description")}
                                  </li>
                                </ul>
                              </div>
                            </div>
                            <div className="button_block">
                              <Link
                                to="/contact"
                                className="button button-round button-shadow button-block"
                                title={t("pricing.plan.0.purchase")}
                              >
                                {t("pricing.plan.0.purchase")}
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabPane>
              <TabPane tabId="13">
                <div className="pricing-description" id="13">
                  <p>{t("pricing.plan.1.pricingDesc")}</p>
                </div>
                <div className="features-pricing">
                  <div className="plan-list-section">
                    <div className="plan-list">
                      <div className="plan-block">
                        <div className="plan-header">
                          <div className="d-flex flex-column align-items-center plan-content-layout">
                            <div>
                              <img
                                src={
                                  require("assets/images/landing-pages/personnel-pricing.svg")
                                    .default
                                }
                                alt="img"
                              />
                              <h3>{t("pricing.plan.1.title")}</h3>
                              <div className="price">
                                <h4>{t("pricing.plan.1.price")}</h4>{" "}
                              </div>
                              <div className="feature-list">
                                <ul>
                                  <li className="text-left">
                                    <span className="price-bold">
                                      {" "}
                                      <img
                                        className="mr-2"
                                        src={
                                          require("assets/images/landing-pages/pricing-check.svg")
                                            .default
                                        }
                                        alt="icon"
                                      />
                                    </span>
                                    {t("pricing.plan.1.description1")}
                                  </li>
                                  <li className="text-left">
                                    <span className="price-bold">
                                      <img
                                        className="mr-2"
                                        src={
                                          require("assets/images/landing-pages/pricing-check.svg")
                                            .default
                                        }
                                        alt="icon"
                                      />
                                    </span>
                                    {t("pricing.plan.1.description2")}
                                  </li>
                                  <li className="text-left">
                                    <span className="price-bold">
                                      <img
                                        className="mr-2"
                                        src={
                                          require("assets/images/landing-pages/pricing-check.svg")
                                            .default
                                        }
                                        alt="icon"
                                      />
                                    </span>
                                    {t("pricing.plan.1.description3")}
                                  </li>
                                  <li className="text-left">
                                    <span className="price-bold">
                                      <img
                                        className="mr-2"
                                        src={
                                          require("assets/images/landing-pages/pricing-check.svg")
                                            .default
                                        }
                                        alt="icon"
                                      />
                                    </span>
                                    {t("pricing.plan.1.description4")}
                                  </li>
                                </ul>
                              </div>
                            </div>
                            <div className="button_block">
                              <button
                                onClick={this.props.SignupClick}
                                className="button button-round button-shadow button-block"
                                title={t("pricing.plan.1.purchase")}
                              >
                                {t("pricing.plan.1.purchase")}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabPane>
              <TabPane tabId="14">
                <div className="pricing-description" id="14">
                  <p>{t("pricing.plan.2.pricingDesc")}</p>
                </div>
                <div className="features-pricing">
                  <div className="plan-list-section">
                    <div className="plan-list">
                      <div className="plan-block">
                        <div className="plan-header">
                          <div className="d-flex flex-column align-items-center plan-content-layout">
                            <div>
                              <img
                                src={
                                  require("assets/images/landing-pages/patients-pricing.svg")
                                    .default
                                }
                                alt="img"
                              />

                              <h3>{t("pricing.plan.2.title")}</h3>
                              <div className="price">
                                <h4>{t("pricing.plan.2.price")}</h4>
                              </div>
                              <div className="feature-list">
                                <ul>
                                  <li className="text-left">
                                    <span className="price-bold">
                                      {" "}
                                      <img
                                        className="mr-2"
                                        src={
                                          require("assets/images/landing-pages/pricing-check.svg")
                                            .default
                                        }
                                        alt="icon"
                                      />
                                    </span>
                                    {t("pricing.plan.2.description1")}
                                  </li>
                                  <li className="text-left">
                                    <span className="price-bold">
                                      <img
                                        className="mr-2"
                                        src={
                                          require("assets/images/landing-pages/pricing-check.svg")
                                            .default
                                        }
                                        alt="icon"
                                      />
                                    </span>
                                    {t("pricing.plan.2.description2")}
                                  </li>
                                  <li className="text-left">
                                    <span className="price-bold">
                                      <img
                                        className="mr-2"
                                        src={
                                          require("assets/images/landing-pages/pricing-check.svg")
                                            .default
                                        }
                                        alt="icon"
                                      />
                                    </span>
                                    {t("pricing.plan.2.description3")}
                                  </li>
                                </ul>
                              </div>
                            </div>
                            <div className="button_block">
                              <button
                                onClick={this.props.SignupClick}
                                className="button button-round button-shadow button-block"
                                title={t("pricing.plan.2.purchase")}
                              >
                                {t("pricing.plan.2.purchase")}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabPane>
              <TabPane tabId="15">
                <div className="pricing-description" id="15">
                  <p>{t("pricing.plan.3.pricingDesc")}</p>
                </div>
                <div className="features-pricing contact-sales-pricing">
                  <div className="plan-list-section">
                    <div className="plan-list">
                      <div className="plan-block">
                        <div className="plan-header">
                          <div className="d-flex flex-column align-items-center plan-content-layout">
                            <div>
                              <img
                                src={
                                  require("assets/images/landing-pages/contact-sales-pricing.svg")
                                    .default
                                }
                                alt="img"
                              />

                              <h3>{t("pricing.plan.3.title")}</h3>
                              <div className="price">
                                <h4>{t("pricing.plan.3.price")}</h4>
                              </div>
                              <div className="feature-list">
                                <ul>
                                  <li className="mb-0">
                                    {t("pricing.plan.3.description")}
                                  </li>
                                </ul>
                              </div>
                            </div>
                            <div className="button_block">
                              <Link
                                to="/contact"
                                className="button button-round button-shadow button-block"
                                title={t("pricing.plan.3.purchase")}
                              >
                                {t("pricing.plan.3.purchase")}
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabPane>
            </TabContent>
          </div>
        </div>
        <HomeContact companyInformation={this.props.companyInformation} />
      </div>
    );
  }
}
const mapStateToProps = ({
  userProfile: { profile },
  pageContent: {
    isLoading,
    pageContent,
    contactContent,
    testimonialList,
    companyInformation,
  },
  errors: { isError },
}) => ({
  isLoading,
  isError,
  profile,
  pageContent,
  contactContent,
  testimonialList,
  companyInformation,
});

export default connect(mapStateToProps, { getCompanyInformation })(
  withTranslation()(_isLoading(Pricing))
);
