import moment from "moment";
import React, { useState } from "react";
import { Spinner } from "reactstrap";
import {
  Download,
  PlayBtn,
  Check2,
  Check2All,
  Dot,
} from "react-bootstrap-icons";
import ProgressiveImage from "./ProgressiveImage";
//import { useChannelContext } from '@sendbird/uikit-react/Channel/context';

const CustomMessageItem = (props) => {
  const {
    message,
    currentUser,
    deleteMessage,
    updateUserMessage,
    setFileMessage,
    setFileViewer,
    currentChannel,
    externalTabActive,
  } = props;
  const [selectedMessage] = useState(false);
  const [setShowVerticalDots] = useState(false);
  const [showMessageOptions, setShowMessageOptions] = useState(false);
  const [showEditInput, setShowEditInput] = useState(false);
  const [updatedMessage, setUpdatedMessage] = useState("");
  const [playVideo, setPlayVideo] = useState(false);

  const {
    createdAt,
    updatedAt,
    customType,
    messageType,
    message: messageText,
    messageId,
    name,
    url,
    sender,
    data,
    sendingStatus,
    thumbnails,
  } = message;
  let thumbnailUrl;
  if (thumbnails && thumbnails.length) {
    thumbnailUrl = thumbnails[0].url;
  }

  let officeName = "";
  let additionalData;
  if (data) {
    try {
      additionalData = JSON.parse(data);
      officeName = additionalData.officeName;
    } catch (error) {
      console.log("Error while parsing json data", error);
    }
  }

  const handleMouseOver = () => {
    setShowVerticalDots(true);
  };

  const handleMouseLeave = () => {
    !showMessageOptions && setShowVerticalDots(false);
    setPlayVideo(false);
  };

  const handleDeleteMessage = async () => {
    setShowMessageOptions(false);
    try {
      await deleteMessage(currentChannel, message);
      console.log("Message Deleted");
    } catch (error) {
      console.log("Error while deleteing a message", error);
    }
  };

  const handleTextOnChange = (e) => {
    const value = e.target.value;
    setUpdatedMessage(value);
  };

  const handleEditClick = () => {
    setUpdatedMessage(messageText);
    setShowEditInput(true);
    setShowMessageOptions(false);
  };

  const handleEditCancel = () => {
    setShowEditInput(false);
  };

  const handleEditMessageSave = async () => {
    try {
      const userMessageParams = {};
      userMessageParams.message = updatedMessage;
      let msgData = {};
      if (additionalData) {
        msgData = {
          ...additionalData,
        };
      }
      msgData.isEdited = true;
      userMessageParams.data = JSON.stringify(msgData);
      await updateUserMessage(currentChannel, messageId, userMessageParams);
      console.log("Message updated");
    } catch (error) {
      console.log("Error while updating a message", error);
    }
  };

  const handleImageClick = () => {
    setFileMessage(message);
    setFileViewer(true);
  };

  const { userId } = sender;
  const isOwnMessage = userId === currentUser?.id?.toString();
  const isTextMessage = messageType === "user";
  const isEdited = updatedAt > 0;
  const sending = sendingStatus === "pending";
  const sent = sendingStatus === "succeeded";
  let unreadMemberCount;
  if (isOwnMessage) {
    unreadMemberCount = currentChannel.getUnreadMemberCount(message);
  }

  let content = null;
  let editContent = null;

  if (messageType === "user") {
    content = (
      <div className="text-box">
        {messageText}
        {!isEdited ? null : <span className="edited-flag">{" (edited)"}</span>}
      </div>
    );
    editContent = (
      <>
        <div className="textarea-container">
          <textarea
            onChange={handleTextOnChange}
            name=""
            id=""
            cols="30"
            rows="5"
            placeholder="Edit message"
            value={updatedMessage}
          ></textarea>
        </div>
        <div className="edit-actions-container">
          <span
            onClick={handleEditCancel}
            className="edit-action-btn cancel-edit-btn"
          >
            Cancel
          </span>
          <span onClick={handleEditMessageSave} className="edit-action-btn">
            Save
          </span>
        </div>
      </>
    );
  }
  if (customType === "image") {
    content = (
      <>
        <div className="image-box cursor-pointer" onClick={handleImageClick}>
          <ProgressiveImage src={thumbnailUrl || url} alt={name} />
        </div>
        <div>{name}</div>
      </>
    );
  }
  if (customType === "document") {
    content = (
      <>
        <span className="document-name">
          <a href={url}>
            <Download /> {name}
          </a>
        </span>
      </>
    );
  }
  if (customType === "video") {
    content = (
      <>
        <div className="video-container">
          {thumbnailUrl && !playVideo && (
            <div onClick={() => setPlayVideo(true)}>
              <img src={thumbnailUrl} alt={name} />
              <PlayBtn className="video-play-btn" />
            </div>
          )}
          {(!thumbnailUrl || playVideo) && <video src={url} controls />}
        </div>
        <span>{name}</span>
      </>
    );
  }

  return (
    <div
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
      id={messageId}
      className={`${isOwnMessage ? "own-message-box" : "other-message-box"}`}
    >
      {sending && (
        <div className="loader-container">
          <Spinner animation="border" className="loader-spinner" />
        </div>
      )}
      <div
        className={`message-area ${
          isOwnMessage ? "outgoing-msg" : "incoming-msg"
        } ${selectedMessage ? "highlighted-message" : ""}`}
      >
        {!sending && isOwnMessage && (
          <div className={`message-action-options`}>
            {showMessageOptions && (
              <div className="message-options">
                <ul>
                  <li onClick={handleDeleteMessage}>Delete</li>
                  {isTextMessage && <li onClick={handleEditClick}>Edit</li>}
                  {!isTextMessage && (
                    <li>
                      <a href={url}>Download</a>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        )}
        <div className="message-date">
          {moment(createdAt).format("MMM D, YYYY  ")}
          <Dot />
          {moment(createdAt).format("hh:mm A ")}
        </div>
        <div></div>
        {showEditInput ? editContent : content}
        {isOwnMessage && sent && (
          <div className="seen-msg-icon">
            {unreadMemberCount === 0 ? (
              <Check2All className="double-tick" />
            ) : (
              <Check2 className="single-tick" />
            )}
          </div>
        )}
        {(externalTabActive || currentChannel?.memberCount > 2) && (
          <div className="name-office-box">
            <span className="name-box">
              {isOwnMessage ? "You" : sender.nickname}
            </span>
            {!!officeName && !isOwnMessage && (
              <span className="office-box">{officeName}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomMessageItem;
