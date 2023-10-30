import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import styles from "./Management.module.scss";
import constants from "../../../constants";

class SubscriptionMangement extends Component {
  render() {
    const { t } = this.props;
    return (
      <div
        className={"subsciption-management " + styles["subsciption-management"]}
      >
        <div
          className={
            "container container-smd " +
            styles["subscription-management-container"]
          }
        >
          <button className="back-btn">
            <Link to="/manage-owner">
              <span className="ico">
                <img
                  src={require("assets/images/arrow-back-icon.svg").default}
                  alt="arrow"
                />
              </span>
              {t("back")}
            </Link>
          </button>
          <h2 className="title">
            {t("superAdmin.subscriptionManagementForAccountOwners")}
          </h2>

          <div className="plan-type-list">
            <div className="row">
              <div className="col-md-4 d-none">
                <Link
                  to={{
                    pathname: "/single-office",
                    state: { singleOffice: true },
                  }}
                >
                  <div className="data-box">
                    <img
                      src={require("assets/images/hospital-single.svg").default}
                      alt="img"
                    />
                    <h3>{t("superAdmin.singleOfficeSubscription")}</h3>
                  </div>
                </Link>
              </div>
              <div className="col-md-4 d-none">
                <Link
                  to={{
                    pathname: "/multiple-office",
                    state: { multiple: true },
                  }}
                >
                  <div className="data-box">
                    <img
                      src={
                        require("assets/images/hospital-multipule.svg").default
                      }
                      alt="img"
                    />
                    <h3>{t("superAdmin.multipleOfficeSubscription")}</h3>
                  </div>
                </Link>
              </div>

              <div className="col-md-4">
                <Link
                  to={{
                    pathname:
                      constants.routes.superAdmin.accountBasicSubscription.replace(
                        ":subscriptionType",
                        constants.subscriptionType.basic
                      ),
                  }}
                >
                  <div className={"data-box " + styles["data-box"]}>
                    <img
                      src={require("assets/images/hospital-single.svg").default}
                      alt="img"
                    />
                    <h3>{t("superAdmin.basicSubscription")}</h3>
                  </div>
                </Link>
              </div>
              <div className="col-md-4">
                <Link
                  to={{
                    pathname:
                      constants.routes.superAdmin.accountBasicSubscription.replace(
                        ":subscriptionType",
                        constants.subscriptionType.advanced
                      ),
                  }}
                >
                  <div className={"data-box " + styles["data-box"]}>
                    <img
                      src={
                        require("assets/images/hospital-multipule.svg").default
                      }
                      alt="img"
                    />
                    <h3>{t("superAdmin.advanceSubscription")}</h3>
                  </div>
                </Link>
              </div>
              <div className="col-md-4">
                <Link
                  to={{
                    pathname:
                      constants.routes.superAdmin.accountBasicSubscription.replace(
                        ":subscriptionType",
                        constants.subscriptionType.professional
                      ),
                  }}
                >
                  <div className={"data-box " + styles["data-box"]}>
                    <img
                      src={
                        require("assets/images/hospital-enterprise.svg").default
                      }
                      alt="img"
                    />
                    <h3>{t("superAdmin.professionalSubscription")}</h3>
                  </div>
                </Link>
              </div>
              <div className="col-md-4">
                <Link to="/enterprise-plans">
                  <div className={"data-box " + styles["data-box"]}>
                    <img
                      src={require("assets/images/enterprise.svg").default}
                      alt="img"
                    />
                    <h3>{t("superAdmin.enterpriseSubscription")}</h3>
                  </div>
                </Link>
              </div>
            </div>
          </div>
          <Link to="/manage-features">
            <button className={styles["feature-btn"]}>
              {t("superAdmin.goToManageFeatures")}
            </button>
          </Link>
        </div>
      </div>
    );
  }
}

export default withTranslation()(SubscriptionMangement);
