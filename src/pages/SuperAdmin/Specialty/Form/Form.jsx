import Input from "components/Input";
import Toast from "components/Toast/Alert";
import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { testRegexCheck } from "utils";

function Form({
  buttonTextKey,
  inputLabelKey,
  errorMessage,
  removeErrorMessage,
  isLoadingSpecialty,
  isSubmitting,
  specialty,
  onCancel,
  onSubmit,
  t,
}) {
  const [title, setTitle] = useState("");

  const isSubmittable = () => {
    return title.trim().length > 0;
  };

  useEffect(() => {
    if (specialty) {
      setTitle(specialty.title);
    }
  }, [specialty]);

  return (
    <div className="page-backdrop">
      {!isSubmitting && errorMessage && (
        <Toast
          errorToast
          message={errorMessage}
          handleClose={removeErrorMessage}
        />
      )}

      <div className="col-xl-7">
        <Input
          Title={t(inputLabelKey)}
          Type="text"
          HandleChange={(e) => {
            if (testRegexCheck(e.target.value)) {
              setTitle(e.target.value);
            }
          }}
          MaxLength={35}
          Disabled={isLoadingSpecialty}
          Value={title}
        />

        <div className="d-flex flex-row align-items-center mt-5">
          <button
            className={
              "button button-round button-shadow mr-3" +
              (isSubmitting ? " button-loading" : "")
            }
            disabled={!isSubmittable() || isSubmitting}
            onClick={() => onSubmit(title.trim())}
          >
            {t(buttonTextKey)}
            {isSubmitting && <div className="loader"></div>}
          </button>

          <button
            className="button button-round button-border button-dark"
            disabled={isSubmitting || isLoadingSpecialty}
            onClick={onCancel}
          >
            {t("cancel")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default withTranslation()(Form);
