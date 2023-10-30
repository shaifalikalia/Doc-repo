import React from "react";
import { Modal, ModalBody } from "reactstrap";
import { withTranslation } from "react-i18next";
import Text from "components/Text";
import Input from "components/Input";
import constants from "../../../../../constants";
import Loader from "components/Loader";

const accept = constants.chat.acceptForGroupImage;

function CreateGroupPopup({ t, stateData }) {
  const { state, otherMethods } = stateData;
  const { groupImageUrl, groupName, errors, actionInProgress } = state;
  const {
    handleGroupImageChange,
    closeStepTwoModal,
    handleGroupName,
    handleStepTwo,
  } = otherMethods;

  return (
    <Modal
      isOpen={true}
      toggle={closeStepTwoModal}
      className="modal-dialog-centered modal-width-660 create-group-modal"
      modalClassName="custom-modal"
    >
      <span className="close-btn" onClick={closeStepTwoModal}>
        <img src={require("assets/images/cross.svg").default} alt="close" />
      </span>
      {actionInProgress && <Loader />}
      <ModalBody>
        <Text size="25px" marginBottom="0px" weight="500" color="#111b45">
          {t("messenger.createGroup")}
        </Text>
        <div className="profile-setup-block pb-4">
          <div className="profile-form ">
            <div className="file-upload-field">
              <div className="img">
                <img
                  src={
                    groupImageUrl
                      ? groupImageUrl
                      : require("assets/images/default-image.svg").default
                  }
                  alt="upload"
                />
              </div>
              <div className="ch-upload-button">
                <input
                  id="fileUpload"
                  type="file"
                  accept={accept}
                  onChange={handleGroupImageChange}
                />
                <span>
                  <img
                    src={require("assets/images/upload-image.svg").default}
                    alt="upload"
                  />
                </span>
              </div>
            </div>
            <span className="upload-help-text">
              {t("superAdmin.uploadAPicture")}
            </span>
          </div>
          {errors.groupImage && (
            <span className="error-msg">{errors.groupImage}</span>
          )}
        </div>
        <Input
          Title={t("messenger.groupName")}
          Type="text"
          Placeholder={t("form.placeholder1", {
            field: t("messenger.groupName"),
          })}
          Name={"groupName"}
          Value={groupName}
          HandleChange={handleGroupName}
          MaxLength={constants.chat.groupNameLimit}
          autoComplete="off"
          Error={errors.groupName}
        />
        <div className="d-md-flex">
          <button
            type="button"
            className={
              "button button-round button-shadow mr-md-3 w-sm-100 mb-3"
            }
            onClick={handleStepTwo}
          >
            {t("messenger.create")}
          </button>
          <button
            type="button"
            onClick={closeStepTwoModal}
            className="button button-round button-border btn-mobile-link mb-md-3 button-dark"
          >
            {t("cancel")}
          </button>
        </div>
      </ModalBody>
    </Modal>
  );
}

export default withTranslation()(CreateGroupPopup);
