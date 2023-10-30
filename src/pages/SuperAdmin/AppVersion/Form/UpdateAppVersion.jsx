import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  useAppVersion,
  useUpdateAppVersionMutation,
} from "repositories/app-version-repository";
import FormPage from "./FormPage";

export default function UpdateAppVersion({ appVersionId, onBack }) {
  let pageTitleKey = "superAdmin.editAppVersion";
  let buttonTextKey = "update";

  const [errorMessage, setErrorMessage] = useState("");
  const {
    isLoading,
    isFetching,
    error,
    data: apiRes,
  } = useAppVersion(appVersionId);
  const mutation = useUpdateAppVersionMutation();

  const onSubmit = async (dto) => {
    try {
      await mutation.mutateAsync({ appVersionId, ...dto });
      onBack();
      toast.success(`Updated App Version ${dto.versionNumber}.`);
    } catch (e) {
      setErrorMessage(e.message);
    }
  };

  let appVersion = null;
  if (!isLoading && !error && apiRes.statusCode === 200) {
    appVersion = apiRes.data;
  }

  return (
    <FormPage
      isSubmitting={mutation.isLoading}
      isLoadingAppVersion={isLoading || isFetching}
      appVersion={appVersion}
      errorMessage={errorMessage}
      removeErrorMessage={() => setErrorMessage("")}
      pageTitleKey={pageTitleKey}
      buttonTextKey={buttonTextKey}
      onBack={onBack}
      onCancel={onBack}
      onSubmit={onSubmit}
    />
  );
}
