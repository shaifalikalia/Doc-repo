import React from "react";
import LayoutVendor from "../../components/LayoutVendor";
import { withTranslation } from "react-i18next";
import Page from "components/Page";
import Card from "components/Card";
import { Col, Row } from "reactstrap";
import styles from "./TopUp.module.scss";
import Text from "components/Text";
import TopUpTabs from "./TopUpTabs";

import { useToGetTopUpBalance } from "repositories/admin-vendor-repository";
import useHandleApiError from "hooks/useHandleApiError";

const TopUp = ({ t }) => {
  const { data, isLoading, isFetching, error } = useToGetTopUpBalance();
  useHandleApiError(isLoading, isFetching, error);
  const { promotionRemaining, promotionLaunched } = data || {};

  return (
    <LayoutVendor>
      <Page title={t("vendorManagement.topUp")}>
        <Card
          className={styles["topup-card"]}
          radius="10px"
          marginBottom="10px"
          cursor="default"
          shadow="0 0 15px 0 rgba(0, 0, 0, 0.08)"
        >
          <Text size="20px" marginBottom="16px" weight="500" color=" #111B45">
            {t("vendorManagement.promotionsBalance")}
          </Text>
          <Row>
            <Col md={3}>
              <Text size="12px" marginBottom="5px" weight="400" color="#6f7788">
                {t("vendorManagement.promotionLaunched")}
              </Text>
              <Text
                size="14px"
                marginBottom="25px"
                weight="600"
                color="#102c42"
              >
                {promotionLaunched}
              </Text>
            </Col>
            <Col md={3}>
              <Text size="12px" marginBottom="5px" weight="400" color="#6f7788">
                {t("vendorManagement.promotionRemaining")}
              </Text>
              <Text
                size="14px"
                marginBottom="25px"
                weight="600"
                color="#102c42"
              >
                {promotionRemaining}
              </Text>
            </Col>
          </Row>
        </Card>
        <TopUpTabs />
      </Page>
    </LayoutVendor>
  );
};

export default withTranslation()(TopUp);
