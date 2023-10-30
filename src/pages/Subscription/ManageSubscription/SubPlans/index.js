import React, { Component } from "react";
import EnterpriseContactModal from "../../EnterpriseContact";

class SubPlans extends Component {
  state = {
    contactModal: false,
  };

  handleContactModal = () => {
    this.setState({ contactModal: true });
  };

  closeModal = () => {
    this.setState({ contactModal: false });
  };

  render() {
    const { contactModal } = this.state;
    return (
      <div className="plan-section-container">
        <div className="container">
          <div className="plans-block-pannel">
            <div className="row gutters-5">
              <div className="col-md">
                <div className="plan-block single-office-plan">
                  <div className="plan-header">
                    <img
                      src={require("assets/images/hospital-single.svg").default}
                      alt="img"
                    />
                    <h3>Single Office</h3>
                    <div className="price">
                      <h4>
                        <span>$</span>29.99
                        <sub>/mo</sub>
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
                          + $5.99 per Active Staff User/ mo
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
                          + $29.99 per Staff placement
                        </li>
                      </ul>
                    </div>
                    <div className="button-block">
                      <button
                        className="button button-round button-shadow button-block"
                        title="Purchase Plan"
                      >
                        Purchase Plan
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md">
                <div className="plan-block multi-office-plan">
                  <div className="plan-header">
                    <img
                      src={
                        require("assets/images/hospital-multipule.svg").default
                      }
                      alt="img"
                    />
                    <h3>Multiple Offices</h3>
                    <div className="price">
                      <h4>
                        <span>$</span>25.99
                        <sub>
                          /mo
                          <span>per office</span>
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
                          + $5.99 per Active Staff User / mo
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
                          + $29.99 per Staff placement
                        </li>
                      </ul>
                    </div>
                    <div className="button-block">
                      <button
                        className="button button-round button-border button-dark button-block"
                        title="Your Current Plan"
                      >
                        <span className="ico">
                          <i className="ico  icon-tick"></i>
                        </span>
                        Your Current Plan
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md">
                <div className="plan-block enterprise-office-plan">
                  <div className="plan-header">
                    <img
                      src={
                        require("assets/images/hospital-enterprise.svg").default
                      }
                      alt="img"
                    />
                    <h3>Enterprise</h3>

                    <div className="contact-block">
                      <h4>
                        Contact Sales <br /> To Build a Custom Plan
                      </h4>
                      <p>
                        Ideal for large enterprises with setups across
                        countries, having a large set of employees.
                      </p>
                    </div>

                    <div className="button-block">
                      <button
                        className="button button-round button-shadow button-block"
                        title="Contact Us"
                        onClick={this.handleContactModal}
                      >
                        Contact Us
                      </button>
                    </div>
                  </div>
                </div>
              </div>
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

export default SubPlans;
