import React, { Component } from "react";
import Helper from "utils/helper";
import { connect } from "react-redux";
import { addSchedule } from "actions";
import Loader from "components/Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { withTranslation } from "react-i18next";

class ScheduleForm extends Component {
  state = {
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    errors: {},
  };

  componentDidUpdate(prevProps) {
    if (prevProps.statusMessage !== this.props.statusMessage) {
      window.scrollTo(0, 0);

      if (!this.props.isLoadError) {
        this.setState({
          firstName: "",
          lastName: "",
          email: "",
          contactNumber: "",
        });
        toast.success(this.props.statusMessage, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        toast.error(this.props.statusMessage, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    }
  }

  InputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  isValid = () => {
    const { firstName, lastName, email, contactNumber } = this.state;
    const errors = {};
    let isValid = true;
    const { t } = this.props;

    if (!firstName?.trim()) {
      errors.firstName = t("form.errors.emptyField", {
        field: t("form.fields.firstName"),
      });
      isValid = false;
    }
    if (!lastName?.trim()) {
      errors.lastName = t("form.errors.emptyField", {
        field: t("form.fields.lastName"),
      });
      isValid = false;
    }
    if (!email) {
      errors.email = t("form.errors.emptyField", {
        field: t("form.fields.emailAddress"),
      });
      isValid = false;
    }
    if (email && !Helper.validateEmail(email)) {
      errors.email = t("form.errors.invalidValue", {
        field: t("form.fields.emailAddress"),
      });
      isValid = false;
    }
    if (!contactNumber) {
      errors.contactNumber = t("form.errors.emptyField", {
        field: t("form.fields.phoneNumber"),
      });
      isValid = false;
    }
    if (contactNumber && !Helper.validateNumber(contactNumber)) {
      errors.contactNumber = t("form.errors.invalidValue", {
        field: t("form.fields.phoneNumber"),
      });
      isValid = false;
    }
    this.setState({ errors });

    return isValid;
  };

  handleSchedule = () => {
    const isValid = this.isValid();
    const { firstName, lastName, email, contactNumber } = this.state;
    if (isValid) {
      const payload = {
        firstName,
        lastName,
        email,
        contactNumber,
      };
      this.props.addSchedule({ ...payload });
    }
  };

  render() {
    const { firstName, lastName, email, contactNumber, errors } = this.state;
    const { pageLoading, t } = this.props;
    return (
      <div className="schedule-form">
        {pageLoading && <Loader />}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

        <div className="row">
          <div className="col-md-6">
            <div className="c-field">
              <div className="has-ico">
                <span className="ico">
                  <img
                    src={require("assets/images/user-icon-contact.svg").default}
                    alt="img"
                  />
                </span>
                <label>{t("form.fields.firstName")}</label>
                <input
                  type="text"
                  className="c-form-control"
                  placeholder={t("form.fields.egJohn")}
                  name="firstName"
                  value={firstName}
                  onInput={this.InputChange}
                />
              </div>
              {errors && <span className="error-msg">{errors.firstName}</span>}
            </div>
          </div>
          <div className="col-md-6">
            <div className="c-field">
              <div className="has-ico">
                <span className="ico">
                  <img
                    src={require("assets/images/user-icon-contact.svg").default}
                    alt="img"
                  />
                </span>
                <label>{t("form.fields.lastName")}</label>
                <input
                  type="text"
                  className="c-form-control"
                  placeholder={t("form.fields.egSmith")}
                  name="lastName"
                  value={lastName}
                  onInput={this.InputChange}
                />
              </div>
              {errors && <span className="error-msg">{errors.lastName}</span>}
            </div>
          </div>
        </div>
        <div className="c-field">
          <div className="has-ico">
            <span className="ico">
              <img
                src={require("assets/images/email-icon.svg").default}
                alt="img"
              />
            </span>
            <label>{t("form.fields.emailAddress")}</label>
            <input
              type="text"
              className="c-form-control"
              placeholder={t("form.fields.egEmail")}
              name="email"
              value={email}
              onInput={this.InputChange}
            />
          </div>
          {errors && <span className="error-msg">{errors.email}</span>}
        </div>
        <div className="c-field">
          <div className="has-ico">
            <span className="ico">
              <img
                src={require("assets/images/phone-icon.svg").default}
                alt="img"
              />
            </span>
            <label>{t("form.fields.phoneNumber")}</label>
            <input
              type="text"
              className="c-form-control"
              placeholder={t("form.fields.egPhone")}
              name="contactNumber"
              value={contactNumber}
              onInput={this.InputChange}
            />
          </div>
          {errors && <span className="error-msg">{errors.contactNumber}</span>}
        </div>
        <div className="button-block">
          <button
            className="button button-shadow button-round button-width-large"
            title={t("form.ctas.bookDemo")}
            onClick={this.handleSchedule}
          >
            {t("form.ctas.bookDemo")}
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({
  userProfile: { profile },
  pageContent: { pageLoading, isLoadError, statusMessage },
  errors: { isError },
}) => ({
  pageLoading,
  isError,
  profile,
  isLoadError,
  statusMessage,
});
export default connect(mapStateToProps, { addSchedule })(
  withTranslation()(ScheduleForm)
);
