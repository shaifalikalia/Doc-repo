import React, { useState, Fragment, useEffect } from "react";
import {
  handleError,
  handleSuccess,
  validateEmail,
  testRegexCheck,
} from "utils";
import { withTranslation } from "react-i18next";
import Page from "components/Page";
import { Col, Row } from "reactstrap";
import Loader from "components/Loader";
import Card from "components/Card";
import Input from "components/Input";
import {
  assignEnterPrise,
  editAssignEnterPrise,
} from "repositories/subscription-repository";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";

function HandleAction(props) {
  return (
    <Fragment>
      <button
        className={
          " button button-round button-shadow mr-4 button-top-margin w-sm-100"
        }
        title={props.t("save")}
        onClick={props.handleSave}
      >
        {props.t("save")}
      </button>

      <button
        className={
          " button button-round button-dark button-border btn-mobile-link"
        }
        title={props.t("cancel")}
        onClick={props.onBack}
      >
        {props.t("cancel")}
      </button>
    </Fragment>
  );
}

const AddNewVendor = ({ t, history }) => {
  const onBack = () => history.goBack();
  const [isLoader, setIsLoader] = useState(false);
  const [error, setError] = useState({});
  const location = useLocation();
  const isEditForm = location?.state?.packageId ? true : false;
  if (!location.state) {
    onBack();
  }

  const [formFields, setFormFields] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    if (location.state?.packageId) {
      setFormFields({
        name: location.state?.userName,
        email: location.state?.userEmail,
      });
    }
  }, [location]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    const errorMsg = {};

    if (name === "name") {
      if (!value?.trim()?.length) {
        errorMsg.name = t("form.errors.emptyField", { field: t("name") });
      } else {
        errorMsg.name = null;
      }
    }

    if (name === "email") {
      if (!value?.trim()?.length) {
        errorMsg.email = t("form.errors.emptyField", { field: t("email") });
      } else if (name === "email" && !validateEmail(value)) {
        errorMsg.email = t("form.errors.invalidValue", {
          field: t("form.fields.emailAddress"),
        });
      } else {
        errorMsg.email = null;
      }
    }

    setError((prev) => ({ ...prev, ...errorMsg }));
    setFormFields((pre) => ({ ...pre, [name]: value }));
  };

  const isValid = () => {
    let formValid = true;
    const errorMsg = {};

    if (!formFields.name?.trim()?.length) {
      errorMsg.name = t("form.errors.emptyField", { field: t("name") });
      formValid = false;
    } else {
      delete errorMsg.name;
    }

    if (!formFields.email?.trim()?.length) {
      errorMsg.email = t("form.errors.emptyField", { field: t("email") });
      formValid = false;
    } else if (!validateEmail(formFields.email)) {
      errorMsg.email = t("form.errors.invalidValue", {
        field: t("form.fields.emailAddress"),
      });
      formValid = false;
    } else {
      errorMsg.email = null;
    }

    setError(errorMsg);
    return formValid;
  };

  const handleSave = async () => {
    try {
      if (!isValid()) return;
      setIsLoader(true);
      let response = {};
      if (!isEditForm) {
        response = await assignEnterPrise({
          packageId: location?.state?.id,
          userName: formFields.name.trim(),
          IsForVendor: true,
          userEmail: formFields.email.trim(),
        });
      } else {
        response = await editAssignEnterPrise({
          associationId: location?.state?.id,
          userName: formFields.name.trim(),
          IsForVendor: true,
          userEmail: formFields.email.trim(),
        });
      }
      handleSuccess(response.message);
      onBack();
    } catch (err) {
      handleError(err, { duration: 7000 });
    }
    setIsLoader(false);
  };

  return (
    <Page
      onBack={onBack}
      title={
        isEditForm
          ? t("superAdminVendorSubscription.editNewVendor")
          : t("superAdminVendorSubscription.addNewVendor")
      }
    >
      {isLoader && <Loader />}
      <Card
        className="add-wokstation-card"
        padding="70px"
        cursor="default"
        shadow="0 0 15px 0 rgba(0, 0, 0, 0.08)"
      >
        <Row>
          <Col lg="12">
            <Input
              Title={t("superAdminVendorSubscription.vendorName")}
              Placeholder={
                t("Enter ") + t("superAdminVendorSubscription.vendorName")
              }
              Type="text"
              Name="name"
              HandleChange={(e) =>
                testRegexCheck(e.target.value) && handleChange(e)
              }
              Value={formFields.name}
              Error={error.name}
              MaxLength={120}
            />

            <Input
              Title={t("superAdminVendorSubscription.vendorEmailAddress")}
              Placeholder={
                t("Enter ") +
                t("superAdminVendorSubscription.vendorEmailAddress")
              }
              Type="text"
              Name="email"
              HandleChange={handleChange}
              Value={formFields.email}
              Error={error.email}
              MaxLength={225}
            />
            <HandleAction
              onBack={onBack}
              handleSave={handleSave}
              t={t}
            ></HandleAction>
          </Col>
        </Row>
      </Card>
    </Page>
  );
};

export default withTranslation()(AddNewVendor);
