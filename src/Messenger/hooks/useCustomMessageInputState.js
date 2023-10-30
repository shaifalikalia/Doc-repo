import { useChannelContext } from "@sendbird/uikit-react/Channel/context";
import { useEffect, useRef, useState } from "react";
import { handleError } from "utils";
import constants from "../../constants";

const allowedTypes = constants.chat.allowedTypesForMessage;
const fileSizeLimitInMbs = 25;
const fileSizeLimitInBytes = fileSizeLimitInMbs * 1024 * 1024;
const enterCode = "Enter";
const newLineKey = "\n";

const useCustomMessageInputState = (dependencies) => {
  const { currentChannel, sendUserMessage, sendFileMessage, t } = dependencies;
  const context = useChannelContext();
  const {
    onBeforeSendUserMessage,
    onBeforeSendFileMessage,
    messagesDispatcher,
    messageActionTypes,
  } = context;
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const textareaRef = useRef();
  const [height, setHeight] = useState(60);

  const handleTextInput = (e) => {
    let updateHeight = 60;
    if (e.target.scrollHeight > updateHeight && e?.target?.value) {
      updateHeight = e.target.scrollHeight;
    }

    setHeight(updateHeight);
    const value = e.target.value;
    error && setError("");
    setText(value);
  };

  const handleMessageSendError = () => {
    handleError(new Error(t("messenger.sdkErrorMessage")));
  };

  const handleSend = async () => {
    if (!text?.trim()) {
      setText("");
      return;
    }
    const userMessageParams = onBeforeSendUserMessage(text?.trim());
    try {
      const messageHandler = await sendUserMessage(
        currentChannel,
        userMessageParams
      );
      messageHandler.onSucceeded(() => {
        setText("");
      });
      messageHandler.onFailed((err, message) => {
        const { reqId } = message;
        messagesDispatcher({
          type: messageActionTypes.ON_MESSAGE_DELETED_BY_REQ_ID,
          payload: reqId,
        });
        handleMessageSendError();
      });
    } catch (sendbirdError) {
      handleError(sendbirdError);
    }
  };

  const handleAttachment = async (e) => {
    error && setError("");
    const files = Array.from(e.target.files);
    if (!files.length) return;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (allowedTypes.includes(file.type)) {
        if (file.size > fileSizeLimitInBytes) {
          setError(
            (err) =>
              `${err ? `${err}, ` : ""}${t("messenger.fileSizeError", {
                name: file.name,
                size: fileSizeLimitInMbs,
              })}`
          );
          continue;
        }
        const fileMessageParams = onBeforeSendFileMessage(file);
        try {
          const messageHandler = await sendFileMessage(
            currentChannel,
            fileMessageParams
          );
          messageHandler.onFailed((err, message) => {
            const { reqId } = message;
            messagesDispatcher({
              type: messageActionTypes.ON_MESSAGE_DELETED_BY_REQ_ID,
              payload: reqId,
            });
            handleMessageSendError();
          });
        } catch (sendbirdError) {
          handleError(sendbirdError);
        }
      } else {
        setError(
          (err) =>
            `${err ? `${err}, ` : ""}${t("messenger.fileTypeNotSupported", {
              name: file.name,
              type: file.type,
            })}`
        );
      }
    }
    e.target.value = null;
  };

  const handleKeyPress = (e) => {
    if (textareaRef?.current) {
      if (textareaRef.current === document.activeElement) {
        const { key, code, ctrlKey } = e;
        if (
          ctrlKey &&
          code === enterCode &&
          (key === newLineKey || key === enterCode)
        ) {
          handleSend();
        }
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keypress", handleKeyPress);
    return () => window.removeEventListener("keypress", handleKeyPress);
  });

  return {
    state: {
      text,
      error,
      textareaRef,
      height,
    },
    updateMethods: {
      setError,
      setText,
    },
    otherMethods: {
      handleTextInput,
      handleSend,
      handleAttachment,
    },
  };
};

export default useCustomMessageInputState;
