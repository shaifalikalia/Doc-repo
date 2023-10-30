import constants from "./../../../../constants";
import React from "react";
import { useParams } from "react-router";
import AddAppVersion from "./AddAppVersion";
import UpdateAppVersion from "./UpdateAppVersion";
import { decodeId } from "utils";

function AppVersionForm({ history }) {
  let { appVersionId } = useParams();
  appVersionId = decodeId(appVersionId);

  const onBack = () => history.push(constants.routes.appVersionList);
  if (!appVersionId) {
    return <AddAppVersion onBack={onBack} />;
  } else if (!isNaN(appVersionId)) {
    return <UpdateAppVersion appVersionId={appVersionId} onBack={onBack} />;
  } else {
    onBack();
    return null;
  }
}

export default AppVersionForm;
