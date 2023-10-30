import React, { Component, createRef } from "react";
import { Link } from "react-router-dom";
import Helper from "utils/helper";
import { connect } from "react-redux";
import { changePassword } from "actions/index";

/*components*/

import _isLoading from "hoc/isLoading";
import Toast from "components/Toast";
import { withTranslation } from "react-i18next";

class ChangePassword extends Component {
  state = {
    newPassword: "",
    confirmPassword: "",
    errors: {},
    newPasswordShow: false,
    confrimPasswordShow: false,
    isToastView: false,
  };

  componentDidMount() {
    this.inputFieldPassword = createRef();
    this.inputFieldConfirmPassword = createRef();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.statusMessage !== this.props.statusMessage) {
      this.setState({ isToastView: true });
      setTimeout(() => {
        this.setState({ isToastView: false });
      }, 2500);
    }
  }

  InputChange = (event) => {
    const { name, value } = event.target;

    this.setState({ [name]: value });
  };

  handleShowpassword = (id) => {
    if (id === 1) {
      this.setState(
        (prev) => ({
          newPasswordShow: !prev.newPasswordShow,
        }),
        () => {
          if (this.state.newPasswordShow && this.inputFieldPassword.current) {
            this.inputFieldPassword.current.type = "text";
          }
          if (this.inputFieldPassword.current && !this.state.newPasswordShow) {
            this.inputFieldPassword.current.type = "password";
          }
        }
      );
    }

    if (id === 2) {
      this.setState(
        (prev) => ({
          confrimPasswordShow: !prev.confrimPasswordShow,
        }),
        () => {
          if (
            this.state.confrimPasswordShow &&
            this.inputFieldConfirmPassword.current
          ) {
            this.inputFieldConfirmPassword.current.type = "text";
          }
          if (
            this.inputFieldConfirmPassword.current &&
            !this.state.confrimPasswordShow
          ) {
            this.inputFieldConfirmPassword.current.type = "password";
          }
        }
      );
    }
  };

  isValid = () => {
    const { newPassword, confirmPassword } = this.state;

    const { t } = this.props;

    const errors = {};

    let isValid = true;

    if (!newPassword) {
      errors.newPassword = t("form.errors.emptyField", {
        field: t("form.fields.newPassword"),
      });
      isValid = false;
    }

    if (newPassword && !Helper.validatePassword(newPassword)) {
      errors.newPassword = t("form.errors.passwordCriteria");
      isValid = false;
    }

    if (!confirmPassword) {
      errors.confirmPassword = t("form.errors.passwordConfirm");
      isValid = false;
    }

    if (confirmPassword && !Helper.validatePassword(confirmPassword)) {
      errors.confirmPassword = t("form.errors.passwordCriteria");
      isValid = false;
    }

    if (
      Helper.validatePassword(newPassword) &&
      Helper.validatePassword(confirmPassword) &&
      !Helper.validateSamePassword(newPassword, confirmPassword)
    ) {
      errors.notMatch = t("form.errors.passwordMismatch");
      isValid = false;
    }

    this.setState({ errors });

    return isValid;
  };

  changePassword = () => {
    const isValid = this.isValid();
    const { newPassword } = this.state;

    if (isValid) {
      const payload = {
        newPassword,
      };
      this.props.changePassword({ ...payload });
      this.setState({ newPassword: "", confirmPassword: "" });
    }
  };

  render() {
    const { errors, newPasswordShow, confrimPasswordShow, isToastView } =
      this.state;
    const { statusMessage, isChangeError, t } = this.props;
    return (
      <div className="change-password-block">
        <div className="container container-smd">
          {isToastView && statusMessage && (
            <Toast
              message={statusMessage}
              handleClose={this.toastHide}
              errorToast={isChangeError ? true : false}
            />
          )}

          <h2 className="title">{t("accountOwner.changePassword")}</h2>

          <div className="form-wrapper">
            <div className="change-password-form">
              <div className="row no-gutters">
                <div className="col-lg-8">
                  {errors.notMatch && (
                    <div className="alert alert-danger">
                      <span>{errors.notMatch}</span>
                    </div>
                  )}

                  <div className="password-field">
                    <div
                      className={`c-field has-icon ${
                        errors.newPassword && "error-input"
                      }`}
                    >
                      <label>{t("form.fields.newPassword")}</label>
                      <div className="has-ico">
                        <input
                          className="c-form-control"
                          placeholder={t("form.placeholder1", {
                            field: t("form.fields.newPassword"),
                          })}
                          name="newPassword"
                          type="password"
                          onInput={this.InputChange}
                          ref={this.inputFieldPassword}
                          value={this.state.newPassword}
                        />
                        <span
                          className="eye-ico"
                          onClick={() => this.handleShowpassword(1)}
                        >
                          <img
                            src={
                              require(newPasswordShow
                                ? "assets/images/eye-on.svg"
                                : "assets/images/eye-off.svg").default
                            }
                            alt="img"
                          />
                        </span>
                      </div>

                      <span className="error-msg">{errors.newPassword}</span>
                    </div>
                  </div>
                  <div className="password-field">
                    <div
                      className={`c-field has-icon ${
                        errors.confirmPassword && "error-input"
                      }`}
                    >
                      <label>{t("form.fields.confirmPassword")}</label>
                      <div className="has-ico">
                        <input
                          className="c-form-control"
                          placeholder={t("form.placeholderConfirmPassword")}
                          name="confirmPassword"
                          type="password"
                          onInput={this.InputChange}
                          ref={this.inputFieldConfirmPassword}
                          value={this.state.confirmPassword}
                        />
                        <span
                          className="eye-ico"
                          onClick={() => this.handleShowpassword(2)}
                        >
                          <img
                            src={
                              require(confrimPasswordShow
                                ? "assets/images/eye-on.svg"
                                : "assets/images/eye-off.svg").default
                            }
                            alt="img"
                          />
                        </span>
                      </div>

                      <span className="error-msg">
                        {errors.confirmPassword}
                      </span>
                    </div>
                  </div>

                  <div className="btn-field">
                    <div className="row gutters-12">
                      <div className="col-md-auto">
                        <button
                          className="button button-round button-shadow button-min-130"
                          title={t("save")}
                          onClick={this.changePassword}
                        >
                          {t("save")}
                        </button>
                      </div>
                      <div className="col-md-auto">
                        <Link to="/">
                          <button
                            className="button button-round button-border button-dark"
                            title={t("cancel")}
                          >
                            {t("cancel")}
                          </button>
                        </Link>
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
  auth: { statusMessage, isLoading, isChangeError },
  errors: { isError },
}) => ({
  isLoading,
  isError,
  profile,
  statusMessage,
  isChangeError,
});

export default connect(mapStateToProps, { changePassword })(
  _isLoading(withTranslation()(ChangePassword))
);
