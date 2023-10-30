import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { AddownerUser, getOwnerDetails, UpdateOwnerUser } from "actions/index";
/*components*/
import Input from "components/Input";
import _isLoading from "hoc/isLoading";
import Helper from "utils/helper";
import Toast from "components/Toast";
import { withTranslation } from "react-i18next";

class AddOwner extends Component {
  state = {
    userName: null,
    userEmail: null,
    errors: {},
    isToastView: false,
    isProps: true,
  };

  componentDidMount() {
    if (this.props.location.state && this.props.location.state.editOwner) {
      const payload = {
        id: parseInt(this.props.match.params.id),
      };
      this.props.getOwnerDetails({ ...payload });
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (
      props.location.state &&
      props.location.state.editOwner &&
      props.ownerDetail &&
      state.isProps
    ) {
      return {
        userName: props.ownerDetail.userName,
        userEmail: props.ownerDetail.userEmail,
      };
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.statusMessage !== this.props.statusMessage) {
      window.scrollTo(0, 0);
      this.setState({ isToastView: true });
      setTimeout(() => {
        if (
          !this.props.isLoadError &&
          this.props.statusMessage !==
            "Association for this email already exists"
        ) {
          this.props.history.goBack();
        }
      }, 2500);
    }
  }

  isValid = () => {
    const { userName, userEmail } = this.state;
    const errors = {};
    let isValid = true;

    const { t } = this.props;

    if (!userName) {
      errors.userName = t("form.errors.emptyField", {
        field: t("form.fields.name"),
      });
      isValid = false;
    }

    if (!userEmail) {
      errors.userEmail = t("form.errors.emptyField", {
        field: t("form.fields.emailAddress"),
      });
      isValid = false;
    }

    if (userEmail && !Helper.validateEmail(userEmail)) {
      errors.userEmail = t("form.errors.invalidValue", {
        field: t("form.fields.emailAddress"),
      });
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

  handleAdduser = () => {
    const isValid = this.isValid();
    if (isValid) {
      const { userName, userEmail } = this.state;

      if (this.props.location.state && this.props.location.state.editOwner) {
        const payload = {
          associationId: parseInt(this.props.match.params.id),
          userName,
          userEmail,
        };
        this.props.UpdateOwnerUser({ ...payload });
      } else {
        const payload = {
          packageId: parseInt(this.props.match.params.id),
          userName,
          userEmail,
        };
        this.props.AddownerUser({ ...payload });
      }
    }
  };

  toastHide = () => {
    this.setState({ isToastView: false });
  };

  render() {
    const { userName, userEmail, errors, isToastView } = this.state;

    const { statusMessage, isLoadError, t } = this.props;

    return (
      <div className="add-enterprise">
        {isToastView && statusMessage && (
          <Toast
            message={statusMessage}
            handleClose={this.toastHide}
            errorToast={
              isLoadError ||
              statusMessage === "Association for this email already exists"
                ? true
                : false
            }
          />
        )}

        <div className="container">
          <button className="back-btn">
            <Link onClick={() => this.props.history.goBack()}>
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
            {this.props.location.state && this.props.location.state.editOwner
              ? t("superAdmin.editUser")
              : t("superAdmin.enterNewData")}
          </h2>
          <div className="form-wrapper">
            <div className="add-enterprise-form">
              <div className="row">
                <div className="col-xl-7">
                  <Input
                    Title={t("form.fields.name")}
                    Type="text"
                    Placeholder={t("form.placeholder1", {
                      field: t("form.fields.name"),
                    })}
                    Name={"userName"}
                    HandleChange={this.InputChange}
                    Error={errors.userName}
                    Value={userName}
                  />

                  <Input
                    Title={t("form.fields.emailAddress")}
                    Type="text"
                    Placeholder={t("form.placeholder1", {
                      field: t("form.fields.emailAddress"),
                    })}
                    Name={"userEmail"}
                    HandleChange={this.InputChange}
                    Error={errors.userEmail}
                    Value={userEmail}
                  />

                  <div className="btn-field">
                    <div className="row gutters-12">
                      <div className="col-md-auto">
                        <button
                          className="button button-round button-shadow button-width-large"
                          title={t("save")}
                          onClick={this.handleAdduser}
                        >
                          {t("save")}
                        </button>
                      </div>
                      <div className="col-md-auto">
                        <button
                          className="button button-round button-border button-dark"
                          title={t("cancel")}
                          onClick={() => this.props.history.goBack()}
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
  sub: { statusMessage, isLoading, ownerDetail, isLoadError },
  errors: { isError },
}) => ({
  statusMessage,
  isLoading,
  isError,
  profile,
  ownerDetail,
  isLoadError,
});

export default connect(mapStateToProps, {
  AddownerUser,
  getOwnerDetails,
  UpdateOwnerUser,
})(_isLoading(withTranslation()(AddOwner)));
