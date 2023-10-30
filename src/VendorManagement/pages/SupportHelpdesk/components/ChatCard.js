import React, { Fragment } from "react";
import { withTranslation } from "react-i18next";
import styles from "./../SupportHelpdesk.module.scss";
import Text from "components/Text";
import { useSelector } from "react-redux";
import moment from "moment/moment";

const ChatCard = ({
  t,
  arrayOfMessage,
  handleChange,
  sendMessage,
  message,
  isDisabled,
}) => {
  const profileId = useSelector((state) => state.userProfile.profile.id);
  return (
    <Fragment>
      <div className={styles["chat-box-wrapper"]}>
        {!!arrayOfMessage?.length &&
          arrayOfMessage.map((item, index) => {
            let messageClass =
              profileId === item.createdById
                ? "customer-chat"
                : "helpdesk-chat";
            let isLastMessageClass =
              arrayOfMessage.length === index + 1 ? "lastMessage" : "";
            let fullName = t("HELPDESK");
            if (profileId === item.createdById) {
              fullName = t("You");
            }

            return (
              <div
                className={
                  styles["chat-card"] +
                  " " +
                  styles[messageClass] +
                  " " +
                  isLastMessageClass
                }
                key={item.id}
              >
                <Text
                  size="10px"
                  marginBottom="0px"
                  weight="600"
                  color="#587E85"
                >
                  {fullName}
                </Text>
                <Text
                  size="12px"
                  marginBottom="12px"
                  weight="500"
                  color="#2F3245"
                >
                  <span>{moment(item.createdAt).format("MMM D, YYYY")}</span>
                  <span className={styles.circle}></span>
                  <span>{moment(item.createdAt).format("h:mm A")}</span>
                </Text>
                <Text
                  size="12px"
                  marginBottom="12px"
                  weight="500"
                  color="#2F3245"
                >
                  {item?.message}{" "}
                </Text>
              </div>
            );
          })}
      </div>
      <div className={styles["write-message-wrapper"]}>
        <div className={styles["input-btn-box"]}>
          <textarea
            maxLength={400}
            placeholder={t("vendorManagement.writeYourMessage")}
            onChange={handleChange}
            value={message}
          ></textarea>

          <button
            className="btn-small-40 button button-round button-shadow"
            disabled={isDisabled}
            title={t("send")}
            onClick={sendMessage}
          >
            {t("send")}
          </button>
        </div>
      </div>
    </Fragment>
  );
};

export default withTranslation()(ChatCard);
