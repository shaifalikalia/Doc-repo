import React, { Fragment } from "react";
import { Col, Row } from "reactstrap";
import Card from "components/Card";
import Text from "components/Text";
import { withTranslation } from "react-i18next";
import styles from "./../Promotion.module.scss";
import { Link } from "react-router-dom";
import constants from "../../../../constants";
import { encodeId } from "utils";

const TabCommonCard = ({ t, ...props }) => {
  return (
    <Fragment>
      <Card
        className={styles["promotion-card"]}
        radius="10px"
        marginBottom="10px"
        shadow="0 0 15px 0 rgba(0, 0, 0, 0.08)"
        cursor="default"
      >
        <Link
          to={constants.routes.vendor.promotionDetail.replace(
            ":promotionId",
            encodeId(props.id)
          )}
        >
          <div className={styles["card-status-box"]}>
            <Text size="16px" marginBottom="5px" weight="600" color="#587E85">
              {props.Title}
            </Text>
            <div
              className={styles["status-box"] + " " + styles[props.statusClass]}
            >
              {props.Status}
            </div>
          </div>
          <Row>
            <Col md="3">
              <Text size="12px" marginBottom="5px" weight="400" color="#6f7788">
                {t("vendorManagement.promoCodeAssigned")}
              </Text>
              <Text
                size="14px"
                marginBottom="25px"
                weight="600"
                color="#102c42"
              >
                {props.promoCodeAssigned}
              </Text>
            </Col>
            <Col md="3">
              <Text size="12px" marginBottom="5px" weight="400" color="#6f7788">
                {t("vendorManagement.promotionStartDate")}
              </Text>
              <Text
                size="14px"
                marginBottom="25px"
                weight="600"
                color="#102c42"
              >
                {props.startDate}
              </Text>
            </Col>
            <Col md="3">
              <Text size="12px" marginBottom="5px" weight="400" color="#6f7788">
                {t("vendorManagement.promotionExpiryDate")}
              </Text>
              <Text
                size="14px"
                marginBottom="25px"
                weight="600"
                color="#102c42"
              >
                {props.expiryDate}
              </Text>
            </Col>
          </Row>
        </Link>
      </Card>
    </Fragment>
  );
};

export default withTranslation()(TabCommonCard);
