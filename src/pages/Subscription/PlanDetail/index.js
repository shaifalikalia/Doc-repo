import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getPackageSingleMultipule } from "actions/index";

/*components*/
import _isLoading from "hoc/isLoading";
import Empty from "components/Empty";
import { withTranslation } from "react-i18next";

class PlanDetail extends Component {
  componentDidMount() {
    if (this.props.location.state) {
      this.props.getPackageSingleMultipule({
        type: this.props.location.state.singleOffice
          ? "single-office"
          : "multiple-office",
      });
    }
    if (!this.props.location.state) {
      this.props.history.push("/");
    }
  }

  render() {
    const { planDetail, isLoadError, t } = this.props;
    return (
      <div className="plan-detail">
        <div className="container">
          <button className="back-btn">
            <Link to="/subscription-management">
              <span className="ico">
                <img
                  src={require("assets/images/arrow-back-icon.svg").default}
                  alt="arrow"
                />
              </span>
              {t("back")}
            </Link>
          </button>
        </div>
        <div className="container container-smd">
          <h2 className="title">
            {this.props.location.state && this.props.location.state.singleOffice
              ? t("superAdmin.singleOfficeSubscription")
              : t("superAdmin.multipleOfficeSubscription")}
          </h2>
          {planDetail && (
            <div className="plan-detail-box">
              <ul>
                <li>
                  <label>{t("superAdmin.officeCharges")}</label>
                  <span>
                    {t("superAdmin.cad")} {planDetail.perOfficeCharge}/
                    {t("superAdmin.perMonth")}
                  </span>
                </li>
                <li>
                  <label>{t("superAdmin.temporaryStaffCharges")}</label>
                  <span>
                    {t("superAdmin.cad")}{" "}
                    {planDetail.perTemporaryStaffMemberCharge}/
                    {t("superAdmin.perMonth")}
                  </span>
                </li>
                <li>
                  <label>{t("superAdmin.permanentStaffCharges")}</label>
                  <span>
                    {t("superAdmin.cad")}{" "}
                    {planDetail.perPermanentStaffMemberCharge}/
                    {t("superAdmin.perMonth")}
                  </span>
                </li>
                <li>
                  <label>{t("superAdmin.placementCharges")}</label>
                  <span>
                    {t("superAdmin.cad")} {planDetail.perPlacementChange}
                  </span>
                </li>
              </ul>

              <div className="button-block">
                <Link
                  to={{
                    pathname: `/edit-plan/${
                      this.props.planDetail && this.props.planDetail.id
                    }`,
                    state: this.props.planDetail,
                  }}
                >
                  <button
                    className="button button-round button-border button-dark"
                    title={t("superAdmin.editSubscription")}
                  >
                    {t("superAdmin.editSubscription")}
                  </button>
                </Link>
              </div>
            </div>
          )}

          {isLoadError ||
          (planDetail && Object.keys(planDetail).length === 0) ? (
            <Empty Message={t("superAdmin.emptyPlanMessage")} />
          ) : null}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({
  userProfile: { profile },
  sub: { isLoading, planDetail, isLoadError },
  errors: { isError },
}) => ({
  isLoading,
  isError,
  profile,
  planDetail,
  isLoadError,
});

export default connect(mapStateToProps, { getPackageSingleMultipule })(
  _isLoading(withTranslation()(PlanDetail))
);
