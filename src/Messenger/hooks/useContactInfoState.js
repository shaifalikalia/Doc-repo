import { useState, useEffect } from "react";
import { handleError } from "utils";

const MESSAGES_LIMIT = 4;

const useContactInfoState = (dependencies) => {
  const { channel, currentUser, setCurrentChannel, handleProfileBtnClose } =
    dependencies;
  const [isDeleteConversationPopupOpen, setIsDeleteConversationPopupOpen] =
    useState(false);
  const [isMediaDocActive, setMediaDocActive] = useState(false);
  const [isUpdateGroupPopupOpen, setIsUpdateGroupPopupOpen] = useState(false);
  const [mediaMessages, setMediaMessages] = useState([]);
  const [isMediaLoading, setIsMediaLoading] = useState(false);
  const [actionInProgress, setActionInProgress] = useState(false);

  const handleSeeAllBtn = () => {
    setMediaDocActive(true);
  };
  const handleMediaDocBackBtn = () => {
    setMediaDocActive(false);
  };

  const deleteChat = async () => {
    setActionInProgress(true);
    try {
      await channel.delete();
      setCurrentChannel(null);
      handleProfileBtnClose();
    } catch (error) {
      handleError(error);
    }
    setActionInProgress(false);
    setIsDeleteConversationPopupOpen(false);
  };

  useEffect(() => {
    if (channel && channel.url) {
      const mediaListQueryParam = {
        customTypesFilter: ["image", "document"],
        limit: MESSAGES_LIMIT,
        reverse: true,
      };
      const query = channel.createPreviousMessageListQuery(mediaListQueryParam);
      if (query) {
        (async () => {
          try {
            setIsMediaLoading(true);
            let msgs = await query?.load();
            setMediaMessages(msgs);
          } catch (error) {
            handleError(error);
          }
          setIsMediaLoading(false);
        })();
      }
    }
  }, [channel]);

  const getChannelData = () => {
    const {
      name: groupName,
      coverUrl,
      memberCount,
      members,
      data,
    } = channel || {};
    let channelName = groupName;
    let officeName = "";
    let profilePic =
      coverUrl || require("assets/images/staff-default-rounded.png").default;
    let emailId = "";
    let customMembers = "";
    let createdBy = channel?.creator?.nickname;
    let contactNumber = "";
    if (data && memberCount === 2) {
      customMembers = JSON.parse(data)?.members || [];
      const otherCustomUser = customMembers?.filter(
        (mem) => mem.id.toString() !== currentUser?.id?.toString()
      )?.[0];
      const otherSendbirdMember = members?.filter(
        (mem) => mem.userId !== currentUser?.id?.toString()
      )?.[0];
      emailId = otherCustomUser?.emailId;
      officeName = otherCustomUser?.officeName;
      channelName = otherSendbirdMember?.nickname;
      profilePic =
        otherSendbirdMember?.plainProfileUrl ||
        require("assets/images/staff-default-rounded.png").default;
      contactNumber = otherCustomUser?.contactNumber;
    } else if (data && memberCount > 2) {
      customMembers = JSON.parse(data)?.members || [];
      customMembers.forEach((eachval) => {
        for (let x of channel?.members) {
          if (x.userId == eachval.id) {
            eachval.coverImage = x.plainProfileUrl;
          }
        }
      });
    }
    return {
      emailId,
      officeName,
      channelName,
      channelImage: profilePic,
      customMembers,
      createdBy,
      memberCount,
      contactNumber,
    };
  };

  return {
    state: {
      isDeleteConversationPopupOpen,
      isMediaDocActive,
      isUpdateGroupPopupOpen,
      mediaMessages,
      isMediaLoading,
      actionInProgress,
    },
    updateMethods: {
      setIsDeleteConversationPopupOpen,
      setMediaDocActive,
      setIsUpdateGroupPopupOpen,
      setIsMediaLoading,
    },
    otherMethods: {
      getChannelData,
      handleSeeAllBtn,
      handleMediaDocBackBtn,
      deleteChat,
    },
  };
};

export default useContactInfoState;
