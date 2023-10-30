import Page from "components/Page";
import constants from "./../../../../constants";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useHistory } from "react-router";
import { useAddSpecialty } from "repositories/specialty-repository";
import Form from "./Form";
import { withTranslation } from "react-i18next";

function AddSpecialty({ onBack, t }) {
  const [error, setError] = useState("");
  const mutation = useAddSpecialty();
  const history = useHistory();

  const onSubmit = async (title) => {
    try {
      await mutation.mutateAsync(title);
      history.push(constants.routes.specialtyList);
      toast.success(t("superAdmin.specialtyAddedMessage"));
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <Page titleKey="superAdmin.addNewSpecialtyOrService" onBack={onBack}>
      <Form
        buttonTextKey="add"
        inputLabelKey="superAdmin.addSpecialtiesOrServices"
        errorMessage={error}
        removeErrorMessage={() => setError("")}
        isSubmitting={mutation.isLoading}
        onCancel={onBack}
        onSubmit={onSubmit}
      />
    </Page>
  );
}

export default withTranslation()(AddSpecialty);
