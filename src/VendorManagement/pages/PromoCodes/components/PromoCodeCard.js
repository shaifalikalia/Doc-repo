import React, { Fragment } from "react";
import { Col, Row } from "reactstrap";
import Card from "components/Card";
import Text from "components/Text";
import { withTranslation } from "react-i18next";
import styles from "./../PromoCodes.module.scss";

const PromoCodeCard = ({ t, ...props }) => {
  const { promoCodeId, handleCustomerBtn = () => {}  , disabledClass } = props;

  return (
    <Fragment>
      <Card
        className={styles["promo-code-card"]}
        radius="10px"
        marginBottom="10px"
        shadow="0 0 15px 0 rgba(0, 0, 0, 0.08)"
        cursor="default"
      >
        <div className={styles["card-status-box"]}>
          <Text size="16px" marginBottom="5px" weight="600" color="#587E85">
            {props.promoCodeTitle}
          </Text>
          <div
            className={styles["status-box"] + " " + styles[props.statusClass]}
          >
            {props.codeStatus}
          </div>
        </div>
        <Row>
          <Col md="3" xs="6">
            <Text size="12px" marginBottom="5px" weight="400" color="#6f7788">
              {t("vendorManagement.discountAllowed")}
            </Text>
            <Text size="14px" marginBottom="25px" weight="600" color="#102c42">
              {props.discountAllowed}
            </Text>
          </Col>
          <Col md="3" xs="6">
            <Text size="12px" marginBottom="5px" weight="400" color="#6f7788">
              {props.expiryText}
            </Text>
            <Text size="14px" marginBottom="25px" weight="600" color="#102c42">
              {props.expiryDate}
            </Text>
          </Col>
        </Row>
        {props.customerBtnActive && (
          <button
            onClick={() => handleCustomerBtn(promoCodeId)}
            type="button"
            className={
              `btn-small-40 button button-round button-shadow mb-4 w-sm-100  ${disabledClass} ` +
              styles["promocode-button"]
            }
            title={t("vendorManagement.sendToCustomers")}
          >
            {t("vendorManagement.sendToCustomers")}
          </button>
        )}
      </Card>
    </Fragment>
  );
};

export default withTranslation()(PromoCodeCard);
