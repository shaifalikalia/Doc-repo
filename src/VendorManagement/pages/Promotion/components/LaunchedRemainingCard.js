import React, { Fragment } from "react";
import { Row } from "reactstrap";
import Card from "components/Card";
import Text from "components/Text";
import { withTranslation } from "react-i18next";
import styles from "./../Promotion.module.scss";
import { Link } from "react-router-dom";

const LaunchedRemainingCard = ({ t, data }) => {
  const { promotionRemaining, promotionLaunched } = data || {};

  return (
    <Fragment>
      <Card
        className={styles["launched-remaining-card"]}
        radius="10px"
        marginBottom="12px"
        shadow="0 0 15px 0 rgba(0, 0, 0, 0.08)"
        cursor="default"
      >
        <Row className={styles["card-main"]}>
          <div className={"col-md-3 col-6 " + styles["card-padding"]}>
            <Text size="12px" marginBottom="5px" weight="400" color="#CAD3C0">
              {t("vendorManagement.promotionLaunched")}
            </Text>
            <Text size="20px" marginBottom="0px" weight="500" color="#FFFFFF">
              {promotionLaunched}
            </Text>
          </div>
          <div className={"col-md-3 col-6 " + styles["card-padding"]}>
            <Text size="12px" marginBottom="5px" weight="400" color="#CAD3C0">
              {t("vendorManagement.promotionRemaining")}
            </Text>
            <Text size="20px" marginBottom="0px" weight="500" color="#FFFFFF">
              {promotionRemaining}
            </Text>
          </div>

          <div
            className={
              "col-md-auto col-12 " +
              styles["seperation-border-left"] +
              " " +
              styles["card-padding"]
            }
          >
            <div
              className={styles["seperation-border"] + " d-block d-md-none"}
            ></div>

            <div className={styles["card-spacing-left"]}>
              <Text size="16px" marginBottom="5px" weight="500" color="#FFFFFF">
                {t("vendorManagement.wantToLaunchMorePromotions")}
              </Text>

              <Text size="12px" marginBottom="0px" weight="300" color="#FFFFFF">
                {t("vendorManagement.goToTopUpToBuyYourPromotions")}
              </Text>
            </div>
          </div>
          <div
            className={
              "col-md-auto col-12 px-0 px-md-3 " + styles["card-padding"]
            }
          >
            <Link
              to="/topup"
              className={
                "btn-height-40 button button-round button-border w-sm-100 " +
                styles["button-link"]
              }
            >
              {t("vendorManagement.goToTopUp")}
            </Link>
          </div>
        </Row>
      </Card>
    </Fragment>
  );
};

export default withTranslation()(LaunchedRemainingCard);
