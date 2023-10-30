import CustomModal from "components/CustomModal";
import useCustomChannelPreview from "Messenger/hooks/useCustomChannelPreview";
import React from "react";
import { ThreeDotsVertical } from "react-bootstrap-icons";
import { withTranslation } from "react-i18next";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import UsersModal from "../Modals/UsersModal";

const CustomChannelPreview = ({ t, ...props }) => {
  const {
    channel: currentChannel,
    currentChannelUrl,
    setCurrentChannel,
    currentUser,
    externalTabActive,
    handleProfileBtnClose,
  } = props;

  const channelPreviewStateData = useCustomChannelPreview({
    setCurrentChannel,
    currentChannel,
    currentUser,
    currentChannelUrl,
    externalTabActive,
    handleProfileBtnClose,
  });
  const { state, updateMethods, otherMethods } = channelPreviewStateData;
  const {
    dropdownEllipsisOpen,
    isDeleteConversationPopupOpen,
    actionInProgress,
    membersModal,
  } = state;
  const { setIsDeleteConversationPopupOpen, setMembersModal } = updateMethods;
  const { toggleEllipsis, getChannelData, deleteChat, handleMembersClick } =
    otherMethods;

  const activeClass = () => {
    return getChannelData().isActive ? "active-channel" : "";
  };

  return (
    <div
      className={`channel-chat-single ${activeClass()}`}
      onClick={() => setCurrentChannel(currentChannel)}
    >
      <div className="img-content-box">
        <div className="preview-image">
          <img
            className="img-cover"
            src={getChannelData().channelImage}
            alt=""
          />
        </div>
        <div className="preview-member-info">
          <div className="member-name">{getChannelData().channelName}</div>
          {!!getChannelData().officeName && (
            <div className="member-office-name">
              {getChannelData().officeName}
            </div>
          )}
          <div className="member-last-message">
            <span>{getChannelData().messageText}</span>
          </div>
        </div>
      </div>
      <div className="channel-preview-right">
        {!!currentChannel.unreadMessageCount && (
          <div className="unread-messages-count">
            {currentChannel.unreadMessageCount}
          </div>
        )}
        <div className="date-action-box">
          <span className={`date-box`}>{getChannelData().timeToShow}</span>
          {!!externalTabActive && (
            <span className={`external-icon`}>
              <img
                src={require("assets/images/mir_externalchat.svg").default}
                alt="external-chat"
              />
            </span>
          )}
          {currentChannel?.myRole !== "operator" && (
            <div className="empty-ellipsis-icon"></div>
          )}
          {currentChannel?.myRole === "operator" && (
            <Dropdown
              isOpen={dropdownEllipsisOpen}
              toggle={toggleEllipsis}
              className="cursor-pointer"
            >
              <DropdownToggle caret={false} className="dropdown-btn" tag="div">
                <div className={`ellipsis-icon`}>
                  <ThreeDotsVertical />
                </div>
              </DropdownToggle>
              <DropdownMenu right>
                {currentChannel?.myRole === "operator" && (
                  <DropdownItem
                    tag="div"
                    onClick={() => setIsDeleteConversationPopupOpen(true)}
                  >
                    {t("messenger.deleteChat")}
                  </DropdownItem>
                )}
              </DropdownMenu>
            </Dropdown>
          )}
        </div>
        {currentChannel?.memberCount > 2 && (
          <div className="total-members link-btn" onClick={handleMembersClick}>
            {currentChannel?.memberCount} {t("messenger.members")}
          </div>
        )}
      </div>
      {isDeleteConversationPopupOpen && (
        <CustomModal
          isOpen={isDeleteConversationPopupOpen}
          setIsOpen={setIsDeleteConversationPopupOpen}
          onConfirm={deleteChat}
          title={
            currentChannel?.memberCount > 2
              ? t("messenger.deleteGroupChat")
              : t("messenger.deleteSingleChat")
          }
          subTitle1={
            currentChannel?.memberCount > 2
              ? t("messenger.deleteGroupChatDesc")
              : t("messenger.deleteSingleChatDesc")
          }
          actionInProgress={actionInProgress}
          leftBtnText={t("delete")}
          rightBtnText={t("cancel")}
        />
      )}
      {membersModal && (
        <UsersModal
          users={getChannelData().groupMembers}
          isOpen={membersModal}
          onClose={() => setMembersModal(false)}
        />
      )}
    </div>
  );
};

export default withTranslation()(CustomChannelPreview);
