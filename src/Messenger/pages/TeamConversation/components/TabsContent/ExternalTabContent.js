import ChannelUI from "@sendbird/uikit-react/Channel/components/ChannelUI";
import { ChannelProvider } from "@sendbird/uikit-react/Channel/context";
import { ChannelListProvider } from "@sendbird/uikit-react/ChannelList/context";
import React from "react";
import CustomChannelList from "../SendbirdCustomComponents/CustomChannelList";
import CustomChannelListHeader from "../SendbirdCustomComponents/CustomChannelListHeader";
import CustomChannelPreview from "../SendbirdCustomComponents/CustomChannelPreview";
import CustomConversationHeader from "../SendbirdCustomComponents/CustomConversationHeader";
import CustomMessageInput from "../SendbirdCustomComponents/CustomMessageInput";
import CustomMessageItem from "../SendbirdCustomComponents/CustomMessageItem";
import "./messenger.scss";
import { withTranslation } from "react-i18next";
import ContactInfo from "../SendbirdCustomComponents/ContactInfo";
import useExternalChatState from "Messenger/hooks/external/useExternalChatState";
import Loader from "components/Loader";
import ImageViewer from "../Modals/ImageViewer";

const ExternalTabContent = ({
  t,
  currentUser,
  selectedOwner,
  currentChannel,
  setCurrentChannel,
  externalTabActive,
}) => {
  const { state, otherData, updateMethods, otherMethods } =
    useExternalChatState({ currentUser, currentChannel, setCurrentChannel, t });
  const { profileContactInfo, channelListQuery, fileMessage, fileViewer } =
    state;
  const { isSdkLoading, isUserLoading, sdk, isSdkError } = otherData;
  const {
    setChannelListQuery,
    setFileMessage,
    setFileViewer,
    updateChannelList,
  } = updateMethods;
  const {
    handleProfileBtn,
    handleProfileBtnClose,
    handleChannelSelect,
    handleBackBtn,
    handleOnBeforeSendUserMessage,
    sendUserMessage,
    handleSort,
    sendFileMessage,
    handleOnBeforeSendFileMessage,
  } = otherMethods;

  return (
    <div className="miraxis-messenger">
      {(isSdkLoading || isUserLoading) && <Loader />}
      {/* Chat list */}

      <ChannelListProvider
        className={!currentChannel ? "" : "hide-channel-list"}
        queries={channelListQuery}
        onChannelSelect={handleChannelSelect}
        sortChannelList={handleSort}
        disableAutoSelect={true}
      >
        <CustomChannelList
          isSdkError={isSdkError}
          currentUser={currentUser}
          externalTabActive={externalTabActive}
          renderHeader={() => (
            <CustomChannelListHeader
              currentUser={currentUser}
              sdk={sdk}
              setCurrentChannel={setCurrentChannel}
              externalTabActive={externalTabActive}
              setChannelListQuery={setChannelListQuery}
              selectedOwner={selectedOwner}
              updateChannelList={updateChannelList}
            />
          )}
          renderChannelPreview={(props) => (
            <CustomChannelPreview
              {...props}
              currentUser={currentUser}
              currentChannelUrl={currentChannel?.url}
              setCurrentChannel={setCurrentChannel}
              externalTabActive={externalTabActive}
              handleProfileBtnClose={handleProfileBtnClose}
            />
          )}
        />
      </ChannelListProvider>

      <div
        className={`conversation-wrapper  
                    ${!currentChannel ? "" : "show-conversation"}
                    ${!profileContactInfo ? "" : "contact-info-active"}`}
      >
        {/* Main Chat */}
        <div className="back-arrow">
          <span className=" link-btn" onClick={handleBackBtn}>
            <img
              src={require("assets/images/arrow-back-icon.svg").default}
              alt="arrow"
            />{" "}
            {t("back")}
          </span>
        </div>
        <ChannelProvider
          channelUrl={currentChannel?.url}
          onBeforeSendFileMessage={handleOnBeforeSendFileMessage}
          onBeforeSendUserMessage={handleOnBeforeSendUserMessage}
        >
          <ChannelUI
            renderTypingIndicator={() => <></>}
            renderPlaceholderInvalid={() => (
              <div className="empty-chat-box">
                {t("messenger.pleaseSelectConversationToStart")}{" "}
              </div>
            )}
            renderPlaceholderLoader={() => <></>}
            renderPlaceholderEmpty={() => <></>}
            renderChannelHeader={() => (
              <CustomConversationHeader
                currentUser={currentUser}
                channel={currentChannel}
                handleProfileBtn={handleProfileBtn}
                externalTabActive={externalTabActive}
              />
            )}
            renderMessage={(props) => (
              <CustomMessageItem
                {...props}
                currentUser={currentUser}
                setFileMessage={setFileMessage}
                setFileViewer={setFileViewer}
                currentChannel={currentChannel}
                externalTabActive={externalTabActive}
              />
            )}
            renderMessageInput={() => (
              <CustomMessageInput
                t={t}
                sendUserMessage={sendUserMessage}
                sendFileMessage={sendFileMessage}
                currentChannel={currentChannel}
                sdk={sdk}
              />
            )}
          />
        </ChannelProvider>
      </div>
      {!!(currentChannel && profileContactInfo) && (
        <ContactInfo
          handleProfileBtnClose={handleProfileBtnClose}
          channel={currentChannel}
          currentUser={currentUser}
          setCurrentChannel={setCurrentChannel}
          setFileMessage={setFileMessage}
          setFileViewer={setFileViewer}
          updateChannelList={updateChannelList}
        />
      )}
      {fileViewer && fileMessage && (
        <ImageViewer
          imageUrl={fileMessage.url}
          isOpen={fileViewer}
          closeImageViewerModal={() => setFileViewer(false)}
        />
      )}
    </div>
  );
};

export default withTranslation()(ExternalTabContent);
