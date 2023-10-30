import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import { Col, Modal, Row } from "reactstrap";
import ModalBody from "reactstrap/lib/ModalBody";
import Text from "components/Text";
import Input from "components/Input";
import styles from "./Header.module.scss";
import { cloneDeep } from "lodash";
import { validateEmail, testRegexCheck } from "utils";
import { listYourPracticeEmail } from "repositories/patient-repository";
import { toast } from "react-hot-toast";
import Loader from "components/Loader";

/* Form initial values */
let scheme = {
  firstName: "",
  lastName: "",
  emailAddress: "",
  isReceiveInfoByMail: false,
};

function ListYourPracticeModal({
  t,
  isListYourPracticeModalOpen,
  setIsListYourPracticeModalOpen,
  onSignup,
}) {
  /* Intializations & Declarations */
  const [formFields, setformFields] = useState(scheme);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  /* extract values from form object */
  const { firstName, lastName, emailAddress, isReceiveInfoByMail } = formFields;

  /* error messages */
  const errorMessage = {
    firstName: t("form.errors.emptyField", {
      field: t("form.fields.firstName"),
    }),
    lastName: t("form.errors.emptyField", { field: t("form.fields.lastName") }),
    emailAddress: t("form.errors.emptyField", {
      field: t("familyMembers.emailAddress"),
    }),
  };

  /**
   * @method: [isValid]
   * @description: use this method to check validations
   */
  const isValid = () => {
    const errorCopy = {};
    let isValidField = true;

    if (!firstName?.trim()?.length) {
      errorCopy.firstName = errorMessage.firstName;
      isValidField = false;
    }

    if (!lastName?.trim()?.length) {
      errorCopy.lastName = errorMessage.lastName;
      isValidField = false;
    }

    if (validateEmail(emailAddress)) {
      delete errorCopy.emailAddress;
    } else {
      errorCopy.emailAddress = t("form.errors.invalidValue", {
        field: t("form.fields.emailAddress"),
      });
      isValidField = false;
    }

    setErrors({ ...errorCopy });
    return isValidField;
  };

  /**
   * @method: [handleChange]
   * @param {object} event
   * @description: use this method to handle when the event is change
   */
  const handleChange = (event) => {
    if (!testRegexCheck(event.target.value)) return;

    const errorCopy = cloneDeep(errors);
    const { name, value } = event.target;

    if (!value.trim()?.length) {
      errorCopy[name] = errorMessage[name];
    }

    if (value?.trim()?.length) {
      delete errorCopy[name];
    }

    setformFields((prevProps) => ({ ...prevProps, [name]: value }));
    setErrors(errorCopy);
  };

  /**
   * @member: [handleEmailChange]
   * @description: use this method to handle when the email event is change
   * @param {object} event
   */
  const handleEmailChange = (event) => {
    const errorCopy = cloneDeep(errors);
    const { name, value } = event.target;

    if (!value.trim().length) {
      errorCopy.emailAddress = errorMessage.emailAddress;
    } else {
      if (validateEmail(value)) {
        delete errorCopy.emailAddress;
      } else {
        errorCopy.emailAddress = t("form.errors.invalidValue", {
          field: t("form.fields.emailAddress"),
        });
      }
    }

    setformFields((prevProps) => ({ ...prevProps, [name]: value }));
    setErrors(errorCopy);
  };

  /**
   * @member: [onSave]
   * @description: call when we click on save button
   */

  const onSave = async (moreInfo) => {
    try {
      if (!isValid() || !isReceiveInfoByMail) return;
      setIsLoading(true);
      let params = {
        FirstName: firstName,
        LastName: lastName,
        EmailId: emailAddress,
        IsDemoEmail: moreInfo,
      };
      await listYourPracticeEmail(params);
      setIsListYourPracticeModalOpen(false);
      if (!moreInfo) {
        onSignup();
      }
    } catch (error) {
      toast.error(error.message);
    }
    setIsLoading(false);
  };

  return (
    <>
      <Modal
        isOpen={isListYourPracticeModalOpen}
        toggle={() => setIsListYourPracticeModalOpen()}
        className={
          "modal-dialog-centered modal-width-660 " + styles["practice-modal"]
        }
        modalClassName="custom-modal"
      >
        <span
          className="close-btn"
          onClick={() => setIsListYourPracticeModalOpen()}
        >
          <img src={require("assets/images/cross.svg").default} alt="close" />
        </span>

        <ModalBody>
          {isLoading && <Loader />}
          <Text size="25px" marginBottom="10px" weight="500" color="#111b45">
            <span className="modal-title-25">
              {" "}
              {t("patient.listYourPractice")}
            </span>
          </Text>

          <div className={styles["modal-desc"]}>
            {t("patient.listYourPracticeModalDesc")}
          </div>
          <Row>
            <Col sm="6">
              <Input
                Title={t("form.fields.firstNameRequired")}
                Type="text"
                Placeholder={t("form.placeholder1", {
                  field: t("form.fields.firstName"),
                })}
                Name={"firstName"}
                Error={errors.firstName}
                Value={firstName}
                HandleChange={handleChange}
              />
            </Col>
            <Col sm="6">
              <Input
                Title={t("form.fields.lastNameRequired")}
                Type="text"
                Placeholder={t("form.placeholder1", {
                  field: t("form.fields.lastName"),
                })}
                Name={"lastName"}
                Error={errors.lastName}
                Value={lastName}
                HandleChange={handleChange}
              />
            </Col>
          </Row>

          <Input
            Title={t("faq.emailAddress")}
            Type="email"
            Placeholder={t("form.placeholder1", { field: t("emailAddress") })}
            Name={"emailAddress"}
            Error={errors.emailAddress}
            Value={emailAddress || ""}
            HandleChange={handleEmailChange}
          />
          <div className={`ch-checkbox mb-4 pb-md-3`}>
            <label>
              <input
                type="checkbox"
                checked={isReceiveInfoByMail}
                onChange={(e) => {
                  console.log(e.target.checked);
                  setformFields({
                    ...formFields,
                    isReceiveInfoByMail: e.target.checked,
                  });
                }}
              />
              <span>{t("faq.iAgreeToReceiveTheInformations")}</span>
            </label>
          </div>

          <div>
            <button
              className="button button-round button-shadow mb-md-4 mb-2 w-sm-100"
              title={t("patient.yesTakeMeToSignUpPage")}
              disabled={!isReceiveInfoByMail}
              onClick={() => onSave(false)}
            >
              {t("patient.yesTakeMeToSignUpPage")}
            </button>
          </div>

          <button
            className="button btn-mobile-link button-round button-border button-dark "
            disabled={!isReceiveInfoByMail}
            onClick={() => onSave(true)}
            title={t("patient.stillNeedMoreInformationAndDemo")}
          >
            {t("patient.stillNeedMoreInformationAndDemo")}
          </button>
        </ModalBody>
      </Modal>
    </>
  );
}

export default withTranslation()(ListYourPracticeModal);
