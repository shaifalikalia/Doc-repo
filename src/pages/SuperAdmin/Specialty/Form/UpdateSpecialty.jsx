import Page from "components/Page";
import React, { useState } from "react";
import toast from "react-hot-toast";
import Form from "./Form";
import {
  useSpecialty,
  useUpdateSpecialtyMutation,
} from "./../../../../repositories/specialty-repository";
import { withTranslation } from "react-i18next";

function UpdateSpecialty({ specialtyId, onBack, t }) {
  const [error, setError] = useState("");
  const mutation = useUpdateSpecialtyMutation();
  const {
    isLoading,
    isFetching,
    error: loadingError,
    data: specialty,
  } = useSpecialty(specialtyId);

  if (loadingError) {
    toast.error(`Could not load Specialty: ${loadingError.message}`);
    onBack();
    return null;
  }

  const onSubmit = async (title) => {
    try {
      await mutation.mutateAsync({ specialtyId, title });
      onBack();
      toast.success(t("superAdmin.specialtyUpdatedMessage"));
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <Page titleKey="superAdmin.editSpecialtyOrService" onBack={onBack}>
      <Form
        buttonTextKey="save"
        inputLabelKey="superAdmin.editSpecialtiesOrServices"
        isLoadingSpecialty={isLoading || isFetching}
        specialty={specialty}
        errorMessage={error}
        removeErrorMessage={() => setError("")}
        isSubmitting={mutation.isLoading}
        onCancel={onBack}
        onSubmit={onSubmit}
      />
    </Page>
  );
}

export default withTranslation()(UpdateSpecialty);
