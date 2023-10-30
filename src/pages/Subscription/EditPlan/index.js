import React, { Component } from "react";
import { connect } from "react-redux";
import { UpdatePackage } from "actions/index";

/*components*/
import Input from "components/Input";
import _isLoading from "hoc/isLoading";
import Helper from "utils/helper";
import Toast from "components/Toast";
import { withTranslation } from "react-i18next";

class EditPlans extends Component {
  state = {
    OfficeUnitPrice: null,
    PermanentStaffUnitPrice: null,
    TemporaryStaffUnitPrice: null,
    PlacementUnitPrice: null,
    errors: {},
    isToastView: false,
    isProps: true,
  };

  componentDidMount() {
    if (!this.props.location.state) {
      this.props.history.push("/");
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (
      props.location.state &&
      Object.keys(props.location.state).length > 0 &&
      state.isProps
    ) {
      return {
        OfficeUnitPrice: props.location.state.perOfficeCharge,
        PermanentStaffUnitPrice:
          props.location.state.perPermanentStaffMemberCharge,
        TemporaryStaffUnitPrice:
          props.location.state.perTemporaryStaffMemberCharge,
        PlacementUnitPrice: props.location.state.perPlacementChange,
      };
    }
    return null;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.statusMessage !== this.props.statusMessage) {
      window.scrollTo(0, 0);
      this.setState({ isToastView: true });
      setTimeout(() => {
        if (!this.props.isLoadError) {
          this.props.history.push("/subscription-management");
        }
      }, 2500);
    }
  }

  isValid = () => {
    const {
      OfficeUnitPrice,
      PermanentStaffUnitPrice,
      TemporaryStaffUnitPrice,
      PlacementUnitPrice,
    } = this.state;
    const errors = {};

    let isValid = true;

    const { t } = this.props;

    if (!OfficeUnitPrice) {
      errors.OfficeUnitPrice = t("form.errors.emptyField", {
        field: t("form.fields.officeCharges"),
      });
      isValid = false;
    }

    if (OfficeUnitPrice && !Helper.validateNumeric(OfficeUnitPrice)) {
      errors.OfficeUnitPrice = t("form.errors.numericValue");
      isValid = false;
    }

    if (!PermanentStaffUnitPrice) {
      errors.PermanentStaffUnitPrice = t("form.errors.emptyField", {
        field: t("form.fields.permanentStaffCharges"),
      });
      isValid = false;
    }

    if (
      PermanentStaffUnitPrice &&
      !Helper.validateNumeric(PermanentStaffUnitPrice)
    ) {
      errors.PermanentStaffUnitPrice = t("form.errors.numericValue");
      isValid = false;
    }

    if (!TemporaryStaffUnitPrice) {
      errors.TemporaryStaffUnitPrice = t("form.errors.emptyField", {
        field: t("form.fields.temporaryStaffCharges"),
      });
      isValid = false;
    }

    if (
      TemporaryStaffUnitPrice &&
      !Helper.validateNumeric(TemporaryStaffUnitPrice)
    ) {
      errors.TemporaryStaffUnitPrice = t("form.errors.numericValue");
      isValid = false;
    }

    if (!PlacementUnitPrice) {
      errors.PlacementUnitPrice = t("form.errors.emptyField", {
        field: t("form.fields.placementCharges"),
      });
      isValid = false;
    }

    if (PlacementUnitPrice && !Helper.validateNumeric(PlacementUnitPrice)) {
      errors.PlacementUnitPrice = t("form.errors.numericValue");
      isValid = false;
    }

    this.setState({ errors });

    return isValid;
  };

  InputChange = (event) => {
    this.setState({ isProps: false });
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleEditplan = () => {
    const isValid = this.isValid();

    if (isValid) {
      const {
        OfficeUnitPrice,
        PermanentStaffUnitPrice,
        TemporaryStaffUnitPrice,
        PlacementUnitPrice,
      } = this.state;
      const payload = {
        packageId: this.props.location.state.id,
        name: null,
        perOfficeCharge: parseFloat(OfficeUnitPrice),
        perPermanentMemberCharge: parseFloat(PermanentStaffUnitPrice),
        perTemporaryMemberCharge: parseFloat(TemporaryStaffUnitPrice),
        perPlacementCharge: parseFloat(PlacementUnitPrice),
        officeCount: null,
      };
      this.props.UpdatePackage({ ...payload });
    }
  };

  toastHide = () => {
    this.setState({ isToastView: false });
  };

  render() {
    const {
      OfficeUnitPrice,
      PermanentStaffUnitPrice,
      TemporaryStaffUnitPrice,
      PlacementUnitPrice,
      errors,
      isToastView,
    } = this.state;
    const { statusMessage, isLoadError, t } = this.props;
    return (
      <div className="edit-pan-block">
        {isToastView && statusMessage && (
          <Toast
            message={statusMessage}
            handleClose={this.toastHide}
            errorToast={isLoadError}
          />
        )}
        <div className="container">
          <button className="back-btn">
            <span
              className="ib_v pointer"
              onClick={() => this.props.history.goBack()}
            >
              <span className="ico">
                <img
                  src={require("assets/images/arrow-back-icon.svg").default}
                  alt="arrow"
                />
              </span>
              <span className="link-btn">{t("back")}</span>
            </span>
          </button>
        </div>
        <div className="container container-smd">
          <h2 className="title">
            {this.props.location.state &&
            this.props.location.state.type === "single-office"
              ? t("superAdmin.singleOfficeSubscription")
              : t("superAdmin.multipleOfficeSubscription")}
          </h2>
          <div className="form-wrapper">
            <div className="edit-plan-form">
              <div className="row">
                <div className="col-xl-7">
                  <Input
                    Title={t("form.fields.officeCharges")}
                    Type="text"
                    Placeholder={t("form.placeholder1", {
                      field: t("form.fields.officeCharges"),
                    })}
                    Name={"OfficeUnitPrice"}
                    HandleChange={this.InputChange}
                    Error={errors.OfficeUnitPrice}
                    Value={OfficeUnitPrice}
                  />

                  <Input
                    Title={t("form.fields.temporaryStaffCharges")}
                    Type="text"
                    Placeholder={t("form.placeholder1", {
                      field: t("form.fields.temporaryStaffCharges"),
                    })}
                    Name={"TemporaryStaffUnitPrice"}
                    HandleChange={this.InputChange}
                    Error={errors.TemporaryStaffUnitPrice}
                    Value={TemporaryStaffUnitPrice}
                  />

                  <Input
                    Title={t("form.fields.permanentStaffCharges")}
                    Type="text"
                    Placeholder={t("form.placeholder1", {
                      field: t("form.fields.permanentStaffCharges"),
                    })}
                    Name={"PermanentStaffUnitPrice"}
                    HandleChange={this.InputChange}
                    Error={errors.PermanentStaffUnitPrice}
                    Value={PermanentStaffUnitPrice}
                  />

                  <Input
                    Title={t("form.fields.placementCharges")}
                    Type="text"
                    Placeholder={t("form.placeholder1", {
                      field: t("form.fields.placementCharges"),
                    })}
                    Name={"PlacementUnitPrice"}
                    HandleChange={this.InputChange}
                    Error={errors.PlacementUnitPrice}
                    Value={PlacementUnitPrice}
                  />

                  <div className="btn-field">
                    <div className="row gutters-12">
                      <div className="col-md-auto">
                        <button
                          className="button button-round button-shadow button-width-large"
                          title={t("save")}
                          onClick={this.handleEditplan}
                        >
                          {t("save")}
                        </button>
                      </div>
                      <div className="col-md-auto">
                        <button
                          className="button button-round button-border button-dark"
                          onClick={() => this.props.history.goBack()}
                          title={t("cancel")}
                        >
                          {t("cancel")}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({
  userProfile: { profile },
  sub: { isLoading, statusMessage, isLoadError },
  errors: { isError },
}) => ({
  isLoading,
  isError,
  profile,
  statusMessage,
  isLoadError,
});

export default connect(mapStateToProps, { UpdatePackage })(
  _isLoading(withTranslation()(EditPlans))
);
