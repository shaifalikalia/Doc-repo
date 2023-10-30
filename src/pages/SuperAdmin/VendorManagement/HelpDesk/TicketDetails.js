import React from "react";
import { withTranslation } from "react-i18next";
import Page from "components/Page";
import styles from "./SupportHelpdesk.module.scss";
import { Col, Row } from "reactstrap";
import Card from "components/Card";
import Text from "components/Text";
import ChatCard from "./components/ChatCard";

const TicketDetails = ({ t, history }) => {
  return (
    <Page
      onBack={() => {
        history.push(`/help-Desk`);
      }}
      title={t("vendorManagement.ticketDetails")}
    >
      <Card
        className={styles["helpdesk-card"]}
        radius="10px"
        marginBottom="10px"
        shadow="0 0 15px 0 rgba(0, 0, 0, 0.08)"
        cursor="default"
      >
        <div className={styles["card-status-box"]}>
          <div className={styles["timer-clock"]}>
            <img
              className="mr-2"
              src={require("assets/images/clock-icon.svg").default}
              alt=""
            />
            {t("vendorManagement.createdOn")} May 5, 2021 at 10:12 AM
          </div>
          <span className={styles["status-box"]}>
            {t("vendorManagement.generated")}
          </span>
        </div>

        <Text size="16px" marginBottom="10px" weight="600" color="#587E85">
          Refund
        </Text>
        <Row>
          <Col sm="3">
            <Text size="12px" marginBottom="5px" weight="400" color="#6f7788">
              {t("superAdminSupportHelpDesk.name")}
            </Text>
            <Text size="14px" marginBottom="25px" weight="600" color="#102c42">
              Cristian Chester
            </Text>
          </Col>
          <Col sm="3">
            <Text size="12px" marginBottom="5px" weight="400" color="#6f7788">
              {t("vendorManagement.ticketNo")}
            </Text>
            <Text size="14px" marginBottom="25px" weight="600" color="#102c42">
              34567889
            </Text>
          </Col>
          <Col sm="3">
            <Text size="12px" marginBottom="5px" weight="400" color="#6f7788">
              {t("vendorManagement.orderNo")}
            </Text>
            <Text size="14px" marginBottom="25px" weight="600" color="#102c42">
              #23456
            </Text>
          </Col>
        </Row>
        <div className="c-field-label mb-2">
          <label>{t("vendorManagement.description")}</label>
          <Text size="16px" marginBottom="30px" weight="300" color="#535B5F">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
            quae ab illo inventore veritatis et quasi architecto beatae vitae
            dicta sunt explicabo.
          </Text>
          <button
            className="btn-small-40 button button-round button-shadow mb-4"
            title={t("Mark as Resolved")}
          >
            {t("Mark as Resolved")}
          </button>
          <hr className="seperator"></hr>
        </div>
        <ChatCard />
      </Card>
    </Page>
  );
};

export default withTranslation()(TicketDetails);
