import React, { Fragment } from "react";
import { withTranslation } from "react-i18next";
import styles from "./../SupportHelpdesk.module.scss";
import Text from "components/Text";

const ChatCard = ({ t }) => {
  return (
    <Fragment>
      <div className={styles["chat-box-wrapper"]}>
        <div className={styles["chat-card"] + " " + styles["customer-chat"]}>
          <Text size="10px" marginBottom="0px" weight="600" color="#587E85">
            {t("vendorManagement.you")}
          </Text>
          <Text size="12px" marginBottom="12px" weight="500" color="#2F3245">
            <span className="mr-3">Mar 28, 2021</span>
            <span>2:30 PM</span>
          </Text>
          <Text size="12px" marginBottom="12px" weight="500" color="#2F3245">
            Lorem ipsum dolor sit amet, consect elit, sed do eiusmod incididunt
            ut labore.
          </Text>
        </div>
        <div className={styles["chat-card"] + " " + styles["helpdesk-chat"]}>
          <Text size="10px" marginBottom="0px" weight="600" color="#587E85">
            {t("vendorManagement.helpdesk")}
          </Text>
          <Text size="12px" marginBottom="12px" weight="500" color="#2F3245">
            <span className="mr-3">Mar 28, 2021</span>
            <span>2:30 PM</span>
          </Text>
          <Text size="12px" marginBottom="12px" weight="500" color="#2F3245">
            Et harum quidem rerum facilis est et expedita distinctio. Nam libero
            tempore, cum soluta nobis est eligendi optio cumque nihil impedit
            quo minus id quod maxime placeat facere possimus.{" "}
          </Text>
        </div>

        <div className={styles["chat-card"] + " " + styles["customer-chat"]}>
          <Text size="10px" marginBottom="0px" weight="600" color="#587E85">
            {t("vendorManagement.you")}
          </Text>
          <Text size="12px" marginBottom="12px" weight="500" color="#2F3245">
            <span className="mr-3">Mar 28, 2021</span>
            <span>2:30 PM</span>
          </Text>
          <Text size="12px" marginBottom="12px" weight="500" color="#2F3245">
            Lorem ipsum dolor sit amet, consect elit, sed do eiusmod incididunt
            ut labore.
          </Text>
        </div>
      </div>
      <div className={styles["write-message-wrapper"]}>
        <div className={styles["input-btn-box"]}>
          <input
            type="text"
            placeholder={t("vendorManagement.writeYourMessage")}
          />
          <button
            className="btn-small-40 button button-round button-shadow"
            title={t("send")}
          >
            {t("send")}
          </button>
        </div>
      </div>
    </Fragment>
  );
};

export default withTranslation()(ChatCard);
