import Input from "components/Input";
import Page from "components/Page";
import constants from "./../../../../constants";
import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import Select from "./../../../../components/Select";
import Toast from "components/Toast";

const deviceTypes = constants.deviceTypes.map((it) => ({
  id: it.id,
  name: it.title,
}));
const appTypes = constants.appTypes.map((it) => ({
  id: it.id,
  name: it.title,
}));

function FormPage({
  pageTitleKey,
  buttonTextKey,
  appVersion,
  isLoadingAppVersion,
  isSubmitting,
  errorMessage,
  removeErrorMessage,
  onBack,
  onCancel,
  onSubmit,
  t,
}) {
  return (
    <Page titleKey={pageTitleKey} onBack={onBack}>
      <div className="page-backdrop">
        <div className="row">
          <div className="col-xl-7">
            {!isSubmitting && errorMessage && (
              <Toast
                errorToast
                message={errorMessage}
                handleClose={removeErrorMessage}
              />
            )}
            <Form
              appVersion={appVersion}
              isLoadingAppVersion={isLoadingAppVersion}
              isSubmitting={isSubmitting}
              onCancel={onCancel}
              onSubmit={onSubmit}
              buttonTextKey={buttonTextKey}
              t={t}
            />
          </div>
        </div>
      </div>
    </Page>
  );
}

function Form({
  appVersion,
  isLoadingAppVersion,
  isSubmitting,
  onCancel,
  onSubmit,
  buttonTextKey,
  t,
}) {
  const [versionNumber, setVersionNumber] = useState("");
  const [appDescription, setAppDescription] = useState("");
  const [deviceType, setDeviceType] = useState(deviceTypes[0].id);
  const [appType, setAppType] = useState(appTypes[0].id);
  const [appURL, setAppURL] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [isMandatory, setIsMandatory] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (appVersion) {
      setVersionNumber(`${appVersion.version}`);
      setAppDescription(
        `${appVersion.appDescription ? appVersion.appDescription : ""}`
      );
      setDeviceType(appVersion.deviceType);
      setAppType(appVersion.appType);
      setAppURL(appVersion.appUrl);
      setIsActive(appVersion.isActive);
      setIsMandatory(appVersion.isMandatory);
    }
  }, [appVersion]);

  const validate = () => {
    let _errors = {};

    if (!/^\d{1,3}\.?\d{0,2}$/.test(versionNumber)) {
      _errors.versionNumber = t("form.errors.versionNumberFormat");
    }

    if (!isNaN(versionNumber) && parseFloat(versionNumber) <= 0) {
      _errors.versionNumber = t("form.errors.versionNumberFormat");
    }

    if (versionNumber.trim().length === 0) {
      _errors.versionNumber = t("form.errors.emptyField", {
        field: t("form.fields.versionNumber"),
      });
    }

    if (!constants.regex.validURL.test(appURL)) {
      _errors.appURL = t("form.errors.invalidURL");
    }

    if (appURL.trim().length === 0) {
      _errors.appURL = t("form.errors.emptyField", {
        field: t("form.fields.appURL"),
      });
    }

    setErrors(_errors);
    return Object.keys(_errors).length === 0 ? true : false;
  };

  const isSubmittable = () => {
    return (
      versionNumber.trim().length > 0 &&
      appURL.trim().length > 0 &&
      !isLoadingAppVersion
    );
  };

  return (
    <>
      <Input
        Title={t("form.fields.versionNumber")}
        Type="text"
        Placeholder={t("form.placeholder1", {
          field: t("form.fields.versionNumber"),
        })}
        HandleChange={(e) => setVersionNumber(e.target.value)}
        MaxLength={6}
        Disabled={isLoadingAppVersion}
        Value={versionNumber}
        Error={errors.versionNumber}
      />

      <Select
        Title={t("form.fields.deviceType")}
        Options={deviceTypes}
        Disabled={isLoadingAppVersion}
        HandleChange={(e) => setDeviceType(parseInt(e.target.value))}
        selectedOption={deviceType}
      />

      <Select
        Title={t("form.fields.appType")}
        Options={appTypes}
        Disabled={isLoadingAppVersion}
        HandleChange={(e) => setAppType(parseInt(e.target.value))}
        selectedOption={appType}
      />

      <Input
        Title={t("form.fields.appURL")}
        Type="text"
        Placeholder={t("form.placeholder1", { field: t("form.fields.appURL") })}
        HandleChange={(e) => setAppURL(e.target.value)}
        MaxLength={250}
        Disabled={isLoadingAppVersion}
        Value={appURL}
        Error={errors.appURL}
      />

      <div className="c-field">
        <label>{t("form.fields.appDescriptione")}</label>
        <textarea
          className="c-form-control"
          placeholder={t("form.placeholder1", {
            field: t("form.fields.appDescriptione"),
          })}
          name="title"
          maxLength={250}
          disabled={isLoadingAppVersion}
          value={appDescription}
          onChange={(e) => {
            setAppDescription(e.currentTarget.value);
          }}
        ></textarea>
      </div>

      <div className="ch-checkbox">
        <label>
          <input
            type="checkbox"
            onChange={() => setIsActive((_isActive) => !_isActive)}
            checked={isActive}
            disabled={isLoadingAppVersion}
          />
          <span>{t("isActive")}</span>
        </label>
      </div>

      <div className="ch-checkbox mt-2">
        <label>
          <input
            type="checkbox"
            onChange={() => setIsMandatory((_isMandatory) => !_isMandatory)}
            checked={isMandatory}
            isLoadingAppVersion={isLoadingAppVersion}
          />
          <span>{t("isMandatory")}</span>
        </label>
      </div>

      <div className="d-flex flex-row align-items-center mt-5">
        <button
          className={
            "button button-round button-shadow mr-3" +
            (isSubmitting ? " button-loading" : "")
          }
          disabled={!isSubmittable() || isSubmitting}
          onClick={() => {
            if (!validate()) return;
            onSubmit({
              versionNumber: parseFloat(versionNumber),
              appDescription,
              deviceType,
              appType,
              appURL: appURL.trim(),
              isActive,
              isMandatory,
            });
          }}
        >
          {t(buttonTextKey)}
          {isSubmitting && <div className="loader"></div>}
        </button>

        <button
          className="button button-round button-border button-dark"
          disabled={isSubmitting || isLoadingAppVersion}
          onClick={onCancel}
        >
          {t("cancel")}
        </button>
      </div>
    </>
  );
}

export default withTranslation()(FormPage);
