import React, { Fragment } from "react";
import { withTranslation } from "react-i18next";
import MediaDocsCard from "./MediaDocsCard";
import useContactInfoState from "Messenger/hooks/useContactInfoState";
import UpdateGroupPopup from "../Modals/UpdateGroupPopup";
import { LoaderIcon } from "react-hot-toast";
import CustomModal from "components/CustomModal";
import ProgressiveImage from "./ProgressiveImage";

const ContactInfo = ({
  t,
  handleProfileBtnClose,
  channel,
  currentUser,
  setCurrentChannel,
  setFileMessage,
  setFileViewer,
  updateChannelList,
}) => {
  const stateData = useContactInfoState({
    channel,
    currentUser,
    setCurrentChannel,
    t,
    handleProfileBtnClose,
  });
  const { state, updateMethods, otherMethods } = stateData;
  const {
    isDeleteConversationPopupOpen,
    isMediaDocActive,
    isUpdateGroupPopupOpen,
    mediaMessages,
    isMediaLoading,
    actionInProgress,
  } = state;
  const { getChannelData, handleSeeAllBtn, handleMediaDocBackBtn, deleteChat } =
    otherMethods;
  const { setIsDeleteConversationPopupOpen, setIsUpdateGroupPopupOpen } =
    updateMethods;

  return (
    <>
      <div className="profile-contact-info">
        {!isMediaDocActive ? (
          <Fragment>
            <div className="close-btn" onClick={handleProfileBtnClose}>
              <img
                src={require("assets/images/close-icon.svg").default}
                alt="icon"
              />
            </div>
            <h4 className="contact-heading">{t("messenger.contactInfo")}</h4>
            <div className="profile-img-box">
              {channel?.myRole === "operator" &&
                getChannelData()?.memberCount > 2 && (
                  <div className="text-right mt-3">
                    <span
                      className="cursor-pointer"
                      onClick={() => setIsUpdateGroupPopupOpen(true)}
                    >
                      <img
                        src={
                          require("assets/images/edit-group-icon.svg").default
                        }
                        alt="icon"
                      />
                    </span>
                  </div>
                )}
              <div className="img-box mt-0">
                <img
                  className="img-cover"
                  src={
                    getChannelData().channelImage ||
                    require("assets/images/dummy.jpg").default
                  }
                  alt="icon"
                />
              </div>
              <div className="profile-name">{getChannelData().channelName}</div>
              {getChannelData()?.memberCount > 2 && (
                <div className="account-ownner-desc">
                  {t("messenger.createdBy")} {channel?.creator?.nickname}
                </div>
              )}
            </div>
            <div className="media-doc-box">
              <div className="media-doc-header">
                <div className="text-box"> {t("messenger.mediaDocs")}</div>
                {!isMediaLoading && !mediaMessages.length && (
                  <span className="no-media-text">
                    {t("messenger.noDataFound")}
                  </span>
                )}
                {mediaMessages.length > 0 && (
                  <span className="link-btn" onClick={handleSeeAllBtn}>
                    {t("messenger.seeAll")}
                  </span>
                )}
              </div>
              {mediaMessages.length > 0 && (
                <div className="media-gallery">
                  {!isMediaLoading ? (
                    mediaMessages?.map((eachMsg, idx) => {
                      const { thumbnails, customType, name, type } = eachMsg;
                      const isDoc = customType === "document";
                      let thumbnailUrl;
                      let docIcon;
                      if (!isDoc && thumbnails && thumbnails.length) {
                        thumbnailUrl = thumbnails[0].url;
                      }
                      if (isDoc) {
                        if (type?.includes("pdf")) {
                          docIcon =
                            require("assets/images/document-icon-pdf.svg").default;
                        } else if (
                          type?.includes("wordprocessingml") ||
                          type?.includes("msword")
                        ) {
                          docIcon =
                            require("assets/images/document-icon-word.svg").default;
                        } else if (
                          type?.includes("spreadsheetml") ||
                          type?.includes("msexcel")
                        ) {
                          docIcon =
                            require("assets/images/document-icon-excel.svg").default;
                        } else {
                          docIcon =
                            require("assets/images/document-icon.svg").default;
                        }
                      }
                      return (
                        <div
                          key={idx}
                          className={
                            (isDoc ? "doc-box" : "img-box") + " cursor-pointer"
                          }
                          title={name}
                          onClick={() => {
                            if (!isDoc) {
                              setFileMessage(eachMsg);
                              setFileViewer(true);
                            } else {
                              window?.open(eachMsg.url, "_blank");
                            }
                          }}
                        >
                          <ProgressiveImage
                            className={isDoc ? "" : "img-cover"}
                            src={
                              thumbnailUrl || (isDoc ? docIcon : eachMsg.url)
                            }
                            alt="icon"
                          />
                        </div>
                      );
                    })
                  ) : (
                    <span style={{ margin: "0 auto" }} className="text-box">
                      <LoaderIcon />
                    </span>
                  )}
                </div>
              )}

              {getChannelData().memberCount === 2 && (
                <div className="personnal-detail">
                  <div className="c-field">
                    <label> {t("form.fields.officeName")}</label>
                    <div> {getChannelData().officeName} </div>
                  </div>
                  <div className="c-field">
                    <label> {t("form.fields.emailAddress")}</label>
                    <div>
                      <a href={`mailto:${getChannelData().emailId}`}>
                        {getChannelData().emailId}
                      </a>
                    </div>
                  </div>
                  <div className="c-field">
                    <label> {t("form.fields.phoneNumber")}</label>
                    <div>
                      <a href={`tel:${getChannelData().contactNumber}`}>
                        {console.log(`tel:${getChannelData().contactNumber}`)}
                        {getChannelData().contactNumber}
                      </a>
                    </div>
                  </div>
                </div>
              )}
              {getChannelData()?.memberCount > 2 && (
                <div className="personnal-detail">
                  <div className="group-member-count">
                    {getChannelData()?.memberCount} {t("messenger.members")}
                    <span className="add-member cursor-pointer">
                      {/* <img src={require('assets/images/add-member.svg').default} alt="icon" /> */}
                    </span>
                  </div>
                  <ul className="group-member-list">
                    {getChannelData()?.customMembers?.map(
                      (eachMember, index) => {
                        return (
                          <li key={index}>
                            <div className="img-box">
                              <img
                                className="img-cover"
                                src={
                                  eachMember?.coverImage ||
                                  require("assets/images/staff-default-rounded.png")
                                    .default
                                }
                                alt="icon"
                              />
                            </div>
                            <div>
                              <div className="group-name">
                                {eachMember?.name}
                              </div>
                              <div className="group-desc">
                                {eachMember?.officeName}
                              </div>
                            </div>
                          </li>
                        );
                      }
                    )}
                  </ul>
                </div>
              )}
              {channel?.myRole === "operator" && (
                <div
                  className="delete-chat"
                  onClick={() => setIsDeleteConversationPopupOpen(true)}
                >
                  <span className="delete-icon">
                    <img
                      src={require("assets/images/delete-red.svg").default}
                      alt="icon"
                    />
                  </span>
                  {t("messenger.deleteChat")}
                </div>
              )}
            </div>
          </Fragment>
        ) : (
          <MediaDocsCard
            handleMediaDocBackBtn={handleMediaDocBackBtn}
            channel={channel}
            setFileMessage={setFileMessage}
            setFileViewer={setFileViewer}
          />
        )}
      </div>

      {isUpdateGroupPopupOpen && (
        <UpdateGroupPopup
          stateData={stateData}
          channel={channel}
          updateChannelList={updateChannelList}
          setCurrentChannel={setCurrentChannel}
        />
      )}

      {isDeleteConversationPopupOpen && (
        <CustomModal
          isOpen={isDeleteConversationPopupOpen}
          setIsOpen={setIsDeleteConversationPopupOpen}
          onConfirm={deleteChat}
          title={
            getChannelData()?.memberCount > 2
              ? t("messenger.deleteGroupChat")
              : t("messenger.deleteSingleChat")
          }
          subTitle1={
            getChannelData()?.memberCount > 2
              ? t("messenger.deleteGroupChatDesc")
              : t("messenger.deleteSingleChatDesc")
          }
          actionInProgress={actionInProgress}
          leftBtnText={t("delete")}
          rightBtnText={t("cancel")}
        />
      )}
    </>
  );
};

export default withTranslation()(ContactInfo);
