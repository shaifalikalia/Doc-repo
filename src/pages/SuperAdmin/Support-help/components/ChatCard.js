import React, { Fragment, useState } from "react";
import { withTranslation } from "react-i18next";
import styles from "./../SupportHelpdesk.module.scss";
import Text from "components/Text";
import { createMessage } from "repositories/support-helpdesk-repository";
import moment from "moment";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import constants from "../../../../constants";

const ChatCard = ({ t, ticketId, ticketData, setTicketData }) => {
  const [messageText, setMessageText] = useState("");
  const [btnDisabled, setBtnDisabled] = useState(false);

  const profile = useSelector((state) => state?.userProfile.profile);

  const submitMsgHandler = () => {
    setBtnDisabled(true);
    createMessage(ticketId, messageText)
      .then((e) => {
        setTicketData(e.data);
        setBtnDisabled(false);
        setMessageText("");
      })
      .catch((err) => {
        toast.error(err.message);
        setBtnDisabled(false);
      });
  };

  let chatComponent;
  if (ticketData) {
    chatComponent =
      ticketData?.messageForSupportAndHelpDesks?.length > 0 &&
      ticketData?.messageForSupportAndHelpDesks.map((eachMsg, index) => {
        let fullName = `${eachMsg?.createdBy?.firstName} ${eachMsg?.createdBy?.lastName} `;
        return (
          <div
            key={index}
            className={
              styles["chat-card"] +
              " " +
              styles[
                eachMsg.createdById === profile.id
                  ? "customer-chat"
                  : "helpdesk-chat"
              ]
            }
          >
            <Text size="10px" marginBottom="0px" weight="600" color="#587E85">
              {eachMsg.createdById === profile.id
                ? t("vendorManagement.you")
                : fullName}
            </Text>
            <Text size="12px" marginBottom="12px" weight="500" color="#2F3245">
              <span>{moment(eachMsg.createdAt).format("MMM D, YYYY")}</span>
              <span className={styles.circle}></span>
              <span>{moment(eachMsg.createdAt).format("h:mm A")}</span>
            </Text>
            <Text
              size="12px"
              marginBottom="12px"
              weight="500"
              color="#2F3245"
              className="whiteSpace"
            >
              {eachMsg?.message}
            </Text>
          </div>
        );
      });
  }

  const btnDisabledCheck = () => {
    if (messageText?.trim()?.length > 0 && btnDisabled) return true;
    if (!messageText?.trim()?.length > 0) return true;
    return false;
  };

  return (
    <Fragment>
      <div className={styles["chat-box-wrapper"]}>{chatComponent}</div>
      <div className={styles["write-message-wrapper"]}>
        <div className={styles["input-btn-box"]}>
          <textarea
            type="text"
            className="w-100"
            placeholder={t("vendorManagement.writeYourMessage")}
            value={messageText}
            maxLength={constants.messageLimit}
            onInput={(e) => {
              setMessageText(e.target.value);
            }}
          />
          <button
            className="btn-small-40 button button-round button-shadow"
            title={t("send")}
            disabled={btnDisabledCheck()}
            onClick={submitMsgHandler}
          >
            {t("send")}
          </button>
        </div>
      </div>
    </Fragment>
  );
};

export default withTranslation()(ChatCard);
