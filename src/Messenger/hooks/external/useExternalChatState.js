import {
  useSendbirdStateContext,
  sendbirdSelectors,
} from "@sendbird/uikit-react";
import { GroupChannelHandler } from "@sendbird/chat/groupChannel";
import { useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import constants from "../../../constants";
import { handleError } from "utils";

const allowedImageTypes = constants.chat.allowedTypesForGroupImage;
const allowedDocTypes = constants.chat.allowedTypesForDocs;
//const APP_UNAVAILABLE = 403100;

const useExternalChatState = (dependencies) => {
  const { t, currentUser, currentChannel, setCurrentChannel } = dependencies;
  const [fileMessage, setFileMessage] = useState(null);
  const [fileViewer, setFileViewer] = useState(false);

  //Sendbird Context Data
  const context = useSendbirdStateContext();
  const isSdkLoading = context?.stores?.sdkStore?.loading;
  const isUserLoading = context?.stores?.userStore?.loading;
  const sdkError = context?.stores?.sdkStore?.error;
  const [isSdkError, setIsSdkError] = useState(false);

  useEffect(() => {
    if (sdkError) {
      setIsSdkError(true);
      handleError(new Error(t("messenger.sdkErrorMessage")));
    }
  }, [sdkError]);

  const sdk = sendbirdSelectors.getSdk(context);
  const sendUserMessage = sendbirdSelectors.getSendUserMessage(context);
  const sendFileMessage = sendbirdSelectors.getSendFileMessage(context);

  const [profileContactInfo, setProfileContactInfo] = useState(false);
  const [channelListQuery, setChannelListQuery] = useState({
    channelListQuery: {
      limit: constants.chat.chatListLimit,
      hiddenChannelFilter: constants.chat.unArchived,
      includeEmpty: true,
      customTypesFilter: [constants.chat.external],
      order: constants.chat.latestLastMessage,
    },
  });

  const [refresh, _updateChannelList] = useState(1);
  const updateChannelList = () => _updateChannelList((prev) => prev + 1);
  const uuidRef = useRef("");

  const onMessageReceived = (groupChannel, message) => {
    if (groupChannel.url === currentChannel?.url) {
      setCurrentChannel(groupChannel);
      currentChannel.markAsRead();
      groupChannel.markAsRead();
    }

    updateChannelList();
  };

  const onChannelDeleted = (groupChannelUrl) => {
    if (groupChannelUrl === currentChannel?.url) {
      setCurrentChannel(null);
      setProfileContactInfo(false);
    }
  };

  //This useEffect is only used to see if the applicationId is operational.
  useEffect(() => {
    (async () => {
      try {
        if (sdk?.createApplicationUserListQuery) {
          const query = sdk.createApplicationUserListQuery({ limit: 1 });
          await query.next();
        }
      } catch (err) {
        setIsSdkError(true);
        handleError(new Error(t("messenger.sdkErrorMessage")));
      }
    })();
  }, [sdk]);

  useEffect(() => {
    try {
      if (sdk?.groupChannel?.addGroupChannelHandler) {
        uuidRef.current = uuidv4();
        const channelHandlerInstance = new GroupChannelHandler({
          onMessageReceived,
          onChannelDeleted,
        });
        sdk.groupChannel.addGroupChannelHandler(
          uuidRef.current,
          channelHandlerInstance
        );
      }
      return () => {
        if (uuidRef.current && sdk?.groupChannel?.removeGroupChannelHandler) {
          sdk?.groupChannel?.removeGroupChannelHandler(uuidRef.current);
        }
      };
    } catch (err) {
      setIsSdkError(true);
      handleError(new Error(t("messenger.sdkErrorMessage")));
    }
  }, [sdk, currentChannel]);

  //Methods
  const handleSort = useCallback((allChannels) => allChannels, [refresh]);

  const handleProfileBtn = () => {
    setProfileContactInfo(!profileContactInfo);
  };
  const handleProfileBtnClose = () => {
    setProfileContactInfo(false);
  };
  const handleChannelSelect = (channel) => {
    setCurrentChannel(channel);
  };
  const handleBackBtn = () => {
    setCurrentChannel(null);
  };

  const handleOnBeforeSendUserMessage = (text) => {
    const channelMembers = JSON.parse(currentChannel.data)?.members;
    const myUserData = channelMembers?.filter(
      (m) => m?.id?.toString() === currentUser?.id?.toString()
    )?.[0];
    const officeName = myUserData?.officeName;
    const officeId = myUserData?.officeId;
    const userMessageParams = {};
    const data = {
      officeName,
      officeId,
    };
    userMessageParams.data = JSON.stringify(data);
    userMessageParams.message = text;
    return userMessageParams;
  };

  const handleOnBeforeSendFileMessage = (file) => {
    const channelMembers = JSON.parse(currentChannel.data)?.members;
    const myUserData = channelMembers?.filter(
      (m) => m?.id?.toString() === currentUser?.id?.toString()
    )?.[0];
    const officeName = myUserData?.officeName;
    const officeId = myUserData?.officeId;
    const fileMessageParam = {};
    const { type } = file;
    fileMessageParam.file = file;
    const data = {
      officeName,
      officeId,
    };
    fileMessageParam.data = JSON.stringify(data);
    if (allowedImageTypes.includes(type)) {
      fileMessageParam.customType = "image";
      fileMessageParam.thumbnailSizes = [{ maxWidth: 200, maxHeight: 200 }];
    }
    if (allowedDocTypes.includes(type)) {
      fileMessageParam.customType = "document";
    }
    return fileMessageParam;
  };

  return {
    state: {
      currentChannel,
      profileContactInfo,
      channelListQuery,
      fileMessage,
      fileViewer,
    },
    otherData: {
      isSdkLoading,
      isUserLoading,
      isSdkError,
      sdk,
    },
    updateMethods: {
      setCurrentChannel,
      setProfileContactInfo,
      setChannelListQuery,
      setFileMessage,
      setFileViewer,
      updateChannelList,
    },
    otherMethods: {
      handleProfileBtn,
      handleProfileBtnClose,
      handleChannelSelect,
      handleBackBtn,
      handleOnBeforeSendUserMessage,
      sendUserMessage,
      handleSort,
      sendFileMessage,
      handleOnBeforeSendFileMessage,
    },
  };
};

export default useExternalChatState;
