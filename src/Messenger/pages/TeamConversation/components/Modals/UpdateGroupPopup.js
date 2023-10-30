import React, { useState, useEffect } from "react";
import { Modal, ModalBody } from "reactstrap";
import { withTranslation } from "react-i18next";
import Text from "components/Text";
import Input from "components/Input";
import { handleError } from "utils";
import constants from "../../../../../constants";
import { inBytes } from "../../utils";
import Loader from "components/Loader";

const accept = constants.chat.acceptForGroupImage;
const allowedTypes = constants.chat.allowedTypesForGroupImage;

function UpdateGroupPopup({
  t,
  stateData,
  channel,
  updateChannelList,
  setCurrentChannel,
}) {
  const { updateMethods } = stateData;
  const { setIsUpdateGroupPopupOpen } = updateMethods;

  const [groupImageUrl, setGroupImageUrl] = useState("");
  const [groupName, setGroupName] = useState("");
  const [groupImage, setGroupImage] = useState(null);
  const [errors, setErrors] = useState({ groupImage: "", groupName: "" });
  const [actionInProgress, setActionInProgress] = useState(false);

  const closeGroupUpdateModal = () => {
    setIsUpdateGroupPopupOpen(false);
    setGroupImageUrl("");
    setGroupName("");
    setGroupImage(null);
    setErrors({});
  };

  const handleGroupName = (e) => {
    const value = e.target.value;
    setGroupName(value);
  };

  const handleGroupChatUpdation = async () => {
    setActionInProgress(true);
    try {
      let updatedChannel;
      if (!groupImage && !groupImageUrl) {
        updatedChannel = await channel.updateChannel({
          coverImage: null,
          coverUrl: "",
          name: groupName,
        });
      } else {
        updatedChannel = await channel.updateChannel({
          coverImage: groupImage,
          name: groupName,
        });
      }
      setCurrentChannel(updatedChannel);
      updateChannelList();
      setIsUpdateGroupPopupOpen(false);
    } catch (error) {
      handleError(error);
    }
    setActionInProgress(false);
  };

  const handleGroupImageChange = (e) => {
    const file = e.target.files?.[0];
    if (allowedTypes.includes(file?.type)) {
      if (file?.size < inBytes(constants.chat.chatGroupImageSizeInMbs)) {
        if (file) {
          setGroupImage(file);
          const url = URL.createObjectURL(file);
          setGroupImageUrl(url);
        }
      } else {
        setErrors({
          groupImage: t("messenger.groupImageSizeError", {
            size: constants.chat.chatGroupImageSizeInMbs,
          }),
        });
      }
    } else {
      setErrors({
        groupImage: t("messenger.groupImageTypeError"),
      });
    }
  };

  const handleUpdateGroupInfo = () => {
    if (groupName && groupName.trim().length > 0) {
      handleGroupChatUpdation();
    } else {
      setErrors({
        groupName: t("messenger.groupNameExistanceError"),
      });
    }
  };

  const onRemovePicture = () => {
    setGroupImage(null);
    setGroupImageUrl("");
  };

  useEffect(() => {
    setGroupName(channel?.name);
    setGroupImageUrl(channel?.coverUrl);
  }, []);

  return (
    <Modal
      isOpen={true}
      toggle={closeGroupUpdateModal}
      className="modal-dialog-centered modal-width-660 create-group-modal"
      modalClassName="custom-modal"
    >
      {actionInProgress && <Loader />}
      <span className="close-btn" onClick={closeGroupUpdateModal}>
        <img src={require("assets/images/cross.svg").default} alt="close" />
      </span>
      <ModalBody>
        <Text size="25px" marginBottom="0px" weight="500" color="#111b45">
          {t("messenger.editGroup")}
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
            {!!groupImageUrl && (
              <span className="remove-pic" onClick={onRemovePicture}>
                {" "}
                {t("messenger.removePicture")}
              </span>
            )}
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
          MaxLength={constants.chat.groupNameLimit}
          Value={groupName}
          HandleChange={handleGroupName}
          autoComplete="off"
          Error={errors.groupName}
        />
        <div className="d-md-flex">
          <button
            type="button"
            className={
              "button button-round button-shadow  mr-md-3 w-sm-100 mb-3"
            }
            onClick={handleUpdateGroupInfo}
          >
            {t("messenger.update")}
          </button>
          <button
            type="button"
            onClick={closeGroupUpdateModal}
            className="button button-round button-border btn-mobile-link mb-md-3 button-dark"
          >
            {t("cancel")}
          </button>
        </div>
      </ModalBody>
    </Modal>
  );
}

export default withTranslation()(UpdateGroupPopup);
