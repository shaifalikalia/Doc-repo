import React from "react";
import { Col, Row } from "reactstrap";
import Card from "components/Card";
import Text from "components/Text";
import { withTranslation } from "react-i18next";
import styles from "./../SupportHelpdesk.module.scss";
import { Link } from "react-router-dom";
import constants from "../../../../constants";
import moment from "moment";
import { encodeId } from "utils";

const HelpdeskCard = ({ t, ...props }) => {
  return (
    <Card
      className={styles["helpdesk-card"]}
      radius="10px"
      marginBottom="10px"
      shadow="0 0 15px 0 rgba(0, 0, 0, 0.08)"
      cursor="default"
    >
      <Link
        to={constants.routes.vendor.ticketDetail.replace(
          ":id",
          encodeId(props.id)
        )}
      >
        <div className={styles["card-status-box"]}>
          <div className="order-1 order-md-2">
            <span
              className={styles["status-box"] + " " + styles[props.statusClass]}
            >
              {props.ticketStatus}
            </span>
          </div>
          <div className={styles["timer-clock"] + " order-2 order-md-1"}>
            <img
              className="mr-2"
              src={require("assets/images/clock-icon.svg").default}
              alt=""
            />
            {t("vendorManagement.createdOn")}{" "}
            {moment(props?.creationDate).format("MMM D, YYYY [at] h:mm A")}
          </div>
        </div>

        <Text size="16px" marginBottom="10px" weight="600" color="#587E85">
          {props.ticketTitle}
        </Text>

        <div className={styles["content-box"]}>
          <Row>
            <Col sm="3" xs="6">
              <Text size="12px" marginBottom="5px" weight="400" color="#6f7788">
                {t("vendorManagement.ticketNo")}
              </Text>

              <Text
                size="14px"
                marginBottom="25px"
                weight="600"
                color="#102c42"
              >
                {props.ticketNo}
              </Text>
            </Col>
            <Col sm="3" xs="6">
              <Text size="12px" marginBottom="5px" weight="400" color="#6f7788">
                {t("vendorManagement.orderNo")}
              </Text>
              <div className="text-break">
                <Text
                  size="14px"
                  marginBottom="25px"
                  weight="600"
                  color="#102c42"
                >
                  {props.orderNo}
                </Text>
              </div>
            </Col>
          </Row>
        </div>
      </Link>
    </Card>
  );
};

export default withTranslation()(HelpdeskCard);
