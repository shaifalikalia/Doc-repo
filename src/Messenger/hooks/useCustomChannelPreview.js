import moment from "moment";
import { useState } from "react";
import { handleError } from "utils";

const useCustomChannelPreview = (dependencies) => {
  const [isDeleteConversationPopupOpen, setIsDeleteConversationPopupOpen] =
    useState(false);
  const [membersModal, setMembersModal] = useState(false);

  const {
    setCurrentChannel,
    currentChannel,
    currentUser,
    currentChannelUrl: activeChannelUrl,
    externalTabActive,
    handleProfileBtnClose,
  } = dependencies;

  const [actionInProgress, setActionInProgress] = useState(false);
  const [dropdownEllipsisOpen, setDropdownEllipsisOpen] = useState(false);
  const toggleEllipsis = (e) => {
    e.stopPropagation();
    setDropdownEllipsisOpen((prevState) => !prevState);
  };

  const handleArchiveChannel = async () => {
    if (!currentChannel) return;
    try {
      if (currentChannel.isHidden) {
        await currentChannel.unhide();
      } else {
        await currentChannel.hide(false, false);
      }
      setCurrentChannel(null);
    } catch (error) {
      handleError(error);
    }
  };

  const deleteChat = async () => {
    setActionInProgress(true);
    try {
      await currentChannel.markAsRead();
      await currentChannel.delete();
      setCurrentChannel(null);
    } catch (error) {
      handleError(error);
    }
    setActionInProgress(false);
    setIsDeleteConversationPopupOpen(false);
    handleProfileBtnClose();
  };

  const getChannelData = () => {
    if (currentChannel) {
      const { lastMessage, createdAt: channelCreatedAt } = currentChannel;
      const isActive = activeChannelUrl === currentChannel.url;
      const lastMessageTimeFromNow = moment().diff(
        moment(lastMessage?.createdAt || channelCreatedAt)
      );
      const duration = moment.duration(lastMessageTimeFromNow).get("days");
      const timeToShow =
        duration > 1
          ? moment(lastMessage?.createdAt).format("MMM D")
          : moment(lastMessage?.createdAt).format("h:mm A");

      const { memberCount, members, data, name, coverUrl } = currentChannel;
      let officeName = "";
      let channelName = name;
      let profilePic =
        coverUrl || require("assets/images/staff-default-rounded.png").default;
      let messageText = lastMessage?.message || lastMessage?.name;

      if (data && memberCount === 2) {
        const customMembers = JSON.parse(data)?.members || [];
        const otherCustomUser = customMembers?.filter(
          (mem) => mem.id.toString() !== currentUser.id.toString()
        )?.[0];
        const otherSendbirdMember = members?.filter(
          (mem) => mem.userId.toString() !== currentUser.id.toString()
        )?.[0];
        if (otherCustomUser?.officeName) {
          officeName = externalTabActive
            ? `${otherSendbirdMember?.nickname} - ${otherCustomUser?.officeName}`
            : otherCustomUser?.officeName;
        } else {
          officeName = externalTabActive
            ? otherSendbirdMember?.nickname
            : otherCustomUser?.officeName;
        }
        channelName = externalTabActive
          ? channelName
          : otherSendbirdMember?.nickname;
        profilePic =
          otherSendbirdMember?.plainProfileUrl ||
          require("assets/images/staff-default-rounded.png").default;
      }
      let groupMembers = [];
      if (data && memberCount > 2) {
        groupMembers = JSON.parse(data)?.members || [];
        groupMembers.forEach((mem) => {
          for (let x of currentChannel?.members) {
            if (x.userId == mem.id) {
              mem.profilePic = x.plainProfileUrl;
            }
          }
        });
      }
      return {
        officeName,
        channelName,
        channelImage: profilePic,
        messageText,
        isActive,
        timeToShow,
        groupMembers,
      };
    }
    return {};
  };

  const handleMembersClick = (e) => {
    e.stopPropagation();
    setMembersModal(!membersModal);
  };

  return {
    state: {
      dropdownEllipsisOpen,
      isDeleteConversationPopupOpen,
      actionInProgress,
      membersModal,
    },
    updateMethods: {
      setIsDeleteConversationPopupOpen,
      setMembersModal,
    },
    otherMethods: {
      handleArchiveChannel,
      toggleEllipsis,
      getChannelData,
      deleteChat,
      handleMembersClick,
    },
  };
};

export default useCustomChannelPreview;
