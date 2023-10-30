import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import Page from "components/Page";
import styles from "./AddBroadcastMessage.module.scss";
import Card from "components/Card";
import Input from "components/Input";
import BroadcastMessagesUserListing from "../SelectUsers";
import { useSaveMessageMutation } from "repositories/broadcast-repository";
import toast from "react-hot-toast";
import constants from "../../../../constants";
import { testRegexCheck, testRegexCheckDescription } from "utils";

function AddBroadcastMessage({ history, t }) {
  const [messageName, setMessageName] = useState("");
  const [messageTitle, setMessageTitle] = useState("");
  const [messageDesc, setMessageDesc] = useState("");
  const [, setemptyField] = useState("");
  const [selectedManagers, setSelectedManagers] = useState([]);
  const [selectAllManagers, setSelectAllManagers] = useState(false);
  const [selectAllStaff, setSelectAllStaff] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState([]);
  const [showUser, setShowUser] = useState(false);
  const [errors, setErrors] = useState({});
  const saveMessageMutation = useSaveMessageMutation();
  const goBack = () => {
    history.push(constants.routes.superAdmin.broadCastMessages);
  };
  const isValidForm = () => {
    let isValid = true;

    if (!messageName) {
      errors.messageName = t("form.errors.emptyField", {
        field: t("superAdmin.messageName"),
      });
      isValid = false;
    } else if (messageName && messageName.length > 120) {
      errors.messageName = t("form.errors.maxLimit", { limit: "120" });
      isValid = false;
    } else {
      delete errors["messageName"];
    }

    if (!messageTitle) {
      errors.messageTitle = t("form.errors.emptyField", { field: t("title") });
      isValid = false;
    } else if (messageTitle && messageTitle.length > 120) {
      errors.messageTitle = t("form.errors.maxLimit", { limit: "120" });
      isValid = false;
    } else {
      delete errors["messageTitle"];
    }

    if (!messageDesc) {
      errors.messageDesc = t("form.errors.emptyField", {
        field: t("superAdmin.descriptionBroadcast"),
      });
      isValid = false;
    } else if (messageDesc && messageDesc.length > 1000) {
      errors.messageTitle = t("form.errors.maxLimit", { limit: "1000" });
      isValid = false;
    } else {
      delete errors["messageName"];
    }

    if (!selectedManagers.length && !selectAllManagers) {
      errors.users = t("form.errors.atleastOneUser");
      isValid = false;
    } else {
      delete errors["users"];
    }

    setErrors(errors);
    setemptyField(...messageName);
    return isValid;
  };

  const saveMessage = async () => {
    if (!isValidForm()) {
      return;
    }

    const data = {
      MessageName: messageName,
      MessageTitle: messageTitle,
      Description: messageDesc,
      SendToAllOwners: selectAllManagers,
      SendToAllStaff: selectAllStaff,
      UsersList: [],
    };
    if (!selectAllManagers || !selectAllStaff) {
      selectedManagers.forEach((v) => {
        data.UsersList.push({
          OwnerId: v,
          SendToOwner: true,
          SendToStaff: selectedStaff.includes(v),
        });
      });
    }
    try {
      const resp = await saveMessageMutation.mutateAsync(data);
      if (resp) {
        toast.success(t("superAdmin.messageCreatedSuccessfully"));
        goBack();
      }
    } catch (e) {
      toast.error(e.message);
    }
  };

  const handleChange = (data) => {
    if (data.length < 1000) {
      setMessageDesc(data);
    } else {
      setMessageDesc(data.substring(0, 1000));
    }
  };

  return (
    <Page onBack={goBack}>
      {!showUser && (
        <div className={styles["new-broadcast-messages"]}>
          <h2 class="page-title mt-2 mb-4">
            {t("superAdmin.newBroadcastMessages")}{" "}
          </h2>
          <Card radius="10px" className={styles["broadcast-card"]}>
            <div className={styles["input-wrapper"]}>
              <Input
                Title={t("superAdmin.messageName")}
                Type="text"
                Placeholder={t("form.placeholder1", {
                  field: t("superAdmin.messageName"),
                })}
                Name={"messageName"}
                HandleChange={(e) =>
                  testRegexCheck(e.currentTarget.value) &&
                  setMessageName(e.currentTarget.value)
                }
                Error={
                  !messageName && errors.messageName ? errors.messageName : ""
                }
                Value={messageName}
              />
              <Input
                Title={t("title")}
                Type="text"
                Placeholder={t("form.placeholder1", { field: t("title") })}
                Name={"messageTitle"}
                HandleChange={(e) =>
                  testRegexCheck(e.currentTarget.value) &&
                  setMessageTitle(e.currentTarget.value)
                }
                Error={
                  !messageTitle && errors.messageTitle
                    ? errors.messageTitle
                    : ""
                }
                Value={messageTitle}
              />
              <div className="c-field">
                <label>{t("superAdmin.descriptionBroadcast")}</label>
                <textarea
                  className="c-form-control"
                  name="messageDesc"
                  maxLength="1000"
                  onChange={(e) =>
                    testRegexCheckDescription(e.currentTarget.value) &&
                    handleChange(e.currentTarget.value)
                  }
                  value={messageDesc}
                ></textarea>
                {!messageDesc && errors.messageDesc && (
                  <span className="error-msg">{errors.messageDesc}</span>
                )}
              </div>
              <div className="c-field">
                <label>{t("superAdmin.selectUsers")}</label>
                <div className="c-form-control d-flex justify-content-between">
                  {selectAllManagers
                    ? t("superAdmin.multipleUsersSelected")
                    : selectedManagers.length < 2
                    ? selectedManagers.length +
                      " " +
                      t("superAdmin.userSelected")
                    : t("superAdmin.multipleUsersSelected")}
                  <div
                    className="link-btn"
                    onClick={() => {
                      setShowUser(true);
                    }}
                  >
                    {t("superAdmin.selectUsers")}
                  </div>
                </div>
                {!selectedManagers.length && errors.users && (
                  <span className="error-msg">{errors.users}</span>
                )}
              </div>
              <button
                className="button  button-round button-shadow mr-3"
                onClick={() => saveMessage()}
              >
                {t("save")}
              </button>
              <button
                className="button  button-round  button-border button-dark"
                onClick={() => goBack()}
              >
                {t("cancel")}
              </button>
            </div>
          </Card>
        </div>
      )}
      {showUser && (
        <BroadcastMessagesUserListing
          selectedManagers={selectedManagers}
          setSelectedManagers={setSelectedManagers}
          setShowUser={setShowUser}
          selectedStaff={selectedStaff}
          setSelectedStaff={setSelectedStaff}
          selectAllManagers={selectAllManagers}
          setSelectAllManagers={setSelectAllManagers}
          selectAllStaff={selectAllStaff}
          setSelectAllStaff={setSelectAllStaff}
        />
      )}
    </Page>
  );
}
export default withTranslation()(AddBroadcastMessage);
