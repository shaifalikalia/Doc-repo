import React from "react";
import { ThreeDotsVertical } from "react-bootstrap-icons";
import { withTranslation } from "react-i18next";
import useConversationHeaderState from "../../../../hooks/useConversationHeaderState";

const CustomConversationHeader = (props) => {
  const { t, channel, currentUser, handleProfileBtn, externalTabActive } =
    props;

  const { otherMethods } = useConversationHeaderState({
    channel,
    currentUser,
    externalTabActive,
    t,
  });
  const { getChannelData } = otherMethods;

  return (
    <div className="sendbird-conversation-header">
      <div className="img-content-box">
        <div className="user-image">
          <img
            className="img-cover"
            src={getChannelData().channelImage}
            alt={getChannelData().channelName}
          />
        </div>
        <div className="user-name">
          {getChannelData().channelName}
          {!!getChannelData().subTitle && (
            <div style={{ color: "grey", fontSize: "13px" }}>
              {getChannelData().subTitle}
            </div>
          )}
        </div>
      </div>
      <div className="action-icon" onClick={handleProfileBtn}>
        {" "}
        <ThreeDotsVertical />
      </div>
    </div>
  );
};

export default withTranslation()(CustomConversationHeader);
