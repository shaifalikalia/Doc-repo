import React, { useState } from "react";
import toast from "react-hot-toast";
import { useAddAppVersionMutation } from "repositories/app-version-repository";
import FormPage from "./FormPage";

export default function AddAppVersion({ onBack }) {
  let pageTitleKey = "superAdmin.addAppVersion";
  let buttonTextKey = "add";

  const [errorMessage, setErrorMessage] = useState("");
  const mutation = useAddAppVersionMutation();

  const onSubmit = async (dto) => {
    try {
      await mutation.mutateAsync(dto);
      onBack();
      toast.success("Added new App Version.");
    } catch (e) {
      setErrorMessage(e.message);
    }
  };

  return (
    <FormPage
      pageTitleKey={pageTitleKey}
      buttonTextKey={buttonTextKey}
      isSubmitting={mutation.isLoading}
      errorMessage={errorMessage}
      removeErrorMessage={() => setErrorMessage("")}
      onBack={onBack}
      onCancel={onBack}
      onSubmit={onSubmit}
    />
  );
}
