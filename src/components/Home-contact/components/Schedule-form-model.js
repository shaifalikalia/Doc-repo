import React, { useState } from "react";
import Loader from "components/Loader";
import { ToastContainer, toast } from "react-toastify";
import { withTranslation } from "react-i18next";
import Helper from "utils/helper";
import { addDemoRequest } from "repositories/utility-repository";

function ScheduleFormModel({ t, afterReqFunCallBack }) {
  const [isLoading, setIsLoading] = useState(false);
  const [formFields, setformFields] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    errors: {},
  });

  const { firstName, lastName, email, contactNumber, errors } = formFields;
  const toastObj = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  };

  const handleChanged = (event) => {
    const { name, value } = event.target;
    setformFields((pre) => ({ ...pre, [name]: value }));
  };

  const isValid = () => {
    const errorsObj = {};
    let isValidForm = true;

    if (!firstName?.trim()) {
      errorsObj.firstName = t("form.errors.emptyField", {
        field: t("form.fields.firstName"),
      });
      isValidForm = false;
    }
    if (!lastName?.trim()) {
      errorsObj.lastName = t("form.errors.emptyField", {
        field: t("form.fields.lastName"),
      });
      isValidForm = false;
    }
    if (!email) {
      errorsObj.email = t("form.errors.emptyField", {
        field: t("form.fields.emailAddress"),
      });
      isValidForm = false;
    }
    if (email && !Helper.validateEmail(email)) {
      errorsObj.email = t("form.errors.invalidValue", {
        field: t("form.fields.emailAddress"),
      });
      isValidForm = false;
    }
    if (!contactNumber) {
      errorsObj.contactNumber = t("form.errors.emptyField", {
        field: t("form.fields.phoneNumber"),
      });
      isValidForm = false;
    }
    if (contactNumber && !Helper.validateNumber(contactNumber)) {
      errorsObj.contactNumber = t("form.errors.invalidValue", {
        field: t("form.fields.phoneNumber"),
      });
      isValidForm = false;
    }
    setformFields((pre) => ({ ...pre, errors: errorsObj }));
    return isValidForm;
  };

  const handleSchedule = async () => {
    try {
      setIsLoading(true);
      if (isValid()) {
        const payload = {
          firstName,
          lastName,
          email,
          contactNumber,
        };
        let res = await addDemoRequest(payload);
        setformFields({
          firstName: "",
          lastName: "",
          email: "",
          contactNumber: "",
          errors: {},
        });
        toast.success(res.message, toastObj);
        afterReqFunCallBack && afterReqFunCallBack();
      }
    } catch (error) {
      toast.error(error.message, toastObj);
    }
    setIsLoading(false);
  };

  return (
    <div>
      <div className="schedule-form">
        {isLoading && <Loader />}
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
                  onInput={handleChanged}
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
                  onInput={handleChanged}
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
              onInput={handleChanged}
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
              onInput={handleChanged}
            />
          </div>
          {errors && <span className="error-msg">{errors.contactNumber}</span>}
        </div>
        <div className="button-block">
          <button
            className="button button-shadow button-round button-width-large"
            title={t("form.ctas.bookDemo")}
            onClick={handleSchedule}
          >
            {t("form.ctas.bookDemo")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default withTranslation()(ScheduleFormModel);
