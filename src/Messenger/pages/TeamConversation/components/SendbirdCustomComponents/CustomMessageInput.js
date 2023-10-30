import React from "react";
import useCustomMessageInputState from "Messenger/hooks/useCustomMessageInputState";
import constants from "../../../../../constants";

const accept = constants.chat.acceptForMessageInput;

const CustomMessageInput = (props) => {
  const { sendUserMessage, sendFileMessage, currentChannel, t } = props;
  const { state, otherMethods, updateMethods } = useCustomMessageInputState({
    sendUserMessage,
    sendFileMessage,
    currentChannel,
    t,
  });
  const { text, error, textareaRef, height } = state;
  const { handleTextInput, handleSend, handleAttachment } = otherMethods;
  const { setError } = updateMethods;
  return (
    <>
      {!!error && (
        <div style={{ marginLeft: "10px" }}>
          <span style={{ color: "red", fontSize: "14px" }}>{error}</span>
        </div>
      )}
      <div className="footer-inner-wrapper">
        <div className="message-input">
          <textarea
            style={{
              height: `${height}px`,
              maxHeight: "140px",
              overflowY: height > 140 ? "scroll" : "hidden",
            }}
            ref={textareaRef}
            placeholder="Type something..."
            value={text}
            onChange={handleTextInput}
            maxLength={1000}
          />
        </div>
        <div className="message-input-box">
          <div className="attach-file">
            <label htmlFor="attachment" className="mb-0">
              <img
                src={require("assets/images/attach-file.svg").default}
                alt="file"
              />
            </label>
            <input
              type="file"
              name="attachment"
              id="attachment"
              style={{ display: "none" }}
              onChange={handleAttachment}
              accept={accept}
              multiple
              onClick={() => setError("")}
            />
          </div>
          <div className="send-message-icon" onClick={handleSend}>
            <img
              src={require("assets/images/send-message-white.svg").default}
              alt="file"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomMessageInput;
