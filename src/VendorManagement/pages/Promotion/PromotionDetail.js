import React, { Fragment, useState } from "react";
import LayoutVendor from "../../components/LayoutVendor";
import { withTranslation } from "react-i18next";
import Page from "components/Page";
import PromotionDetailTab from "./components/PromotionDetailTab";
import Card from "components/Card";
import Text from "components/Text";
import { Col, Row } from "reactstrap";
import styles from "./Promotion.module.scss";
import ViewCustomerModal from "./components/ViewCustomerModal";
import { decodeId } from "utils";
import { useGetPromotionDetail } from "repositories/vendor-repository";
import useHandleApiError from "hooks/useHandleApiError";
import moment from "moment";
import { useHistory, useParams } from "react-router-dom";
import Loader from "components/Loader";

const PromotionDetail = ({ t }) => {
  const [isViewCustomerModalOpen, setViewCustomerModalOpen] = useState(false);
  const { promotionId } = useParams();
  const history = useHistory();
  const { data, error, isLoading, isFetching } = useGetPromotionDetail(
    decodeId(promotionId)
  );
  useHandleApiError(isLoading, isFetching, error);
  const details = data?.data || {};
  const statusClassName = details?.isExpired ? "expired" : "launched";

  return (
    <Fragment>
      <LayoutVendor>
        <Page
          onBack={() => {
            history.goBack();
          }}
          title={t("vendorManagement.promotionDetail")}
        >
          {isLoading && <Loader />}
          <Card
            className={styles["promotion-card"]}
            radius="10px"
            marginBottom="10px"
            shadow="0 0 15px 0 rgba(0, 0, 0, 0.08)"
            cursor="default"
          >
            <div className={styles["card-status-box"]}>
              <Text size="16px" marginBottom="5px" weight="600" color="#587E85">
                {details?.heading}
              </Text>

              <div
                className={styles["status-box"] + " " + styles[statusClassName]}
              >
                {details?.isExpired
                  ? t("vendorManagement.expired")
                  : t("vendorManagement.launched")}
              </div>
            </div>
            <Row className="mt-3">
              <Col md="12">
                <Text
                  size="12px"
                  marginBottom="5px"
                  weight="400"
                  color="#6f7788"
                >
                  {t("vendorManagement.promoCodeAssigned")}
                </Text>
                <Text
                  size="14px"
                  marginBottom="25px"
                  weight="600"
                  color="#102c42"
                >
                  {details?.vendorPromoCode?.id ? t("Yes") : t("No")}
                </Text>
              </Col>
              <Col md="3">
                <Text
                  size="12px"
                  marginBottom="5px"
                  weight="400"
                  color="#6f7788"
                >
                  {t("vendorManagement.promotionStartDate")}
                </Text>
                <Text
                  size="14px"
                  marginBottom="25px"
                  weight="600"
                  color="#102c42"
                >
                  {moment(details?.launchDate).format("MMM DD, YYYY")}
                </Text>
              </Col>
              <Col md="3">
                <Text
                  size="12px"
                  marginBottom="5px"
                  weight="400"
                  color="#6f7788"
                >
                  {t("vendorManagement.promotionExpiryDate")}
                </Text>
                <Text
                  size="14px"
                  marginBottom="25px"
                  weight="600"
                  color="#102c42"
                >
                  {moment(details?.expireDate).format("MMM DD, YYYY")}
                </Text>
              </Col>
              <Col md="12">
                <Text
                  size="12px"
                  marginBottom="5px"
                  weight="400"
                  color="#6f7788"
                >
                  {t("vendorManagement.promotionStatus")}
                </Text>
                <Text
                  size="14px"
                  marginBottom="25px"
                  weight="600"
                  color="#102c42"
                >
                  {t("vendorManagement.launched")}
                </Text>
              </Col>
              <Col md="12">
                <Text
                  size="12px"
                  marginBottom="5px"
                  weight="400"
                  color="#6f7788"
                >
                  {t("vendorManagement.promotionSentTo")}
                </Text>
                <Text
                  size="14px"
                  marginBottom="5px"
                  weight="600"
                  color="#102c42"
                >
                  {t("vendorManagement.selectedCustomers")}
                </Text>
                <div
                  className="link-btn mb-4"
                  onClick={() => {
                    setViewCustomerModalOpen(true);
                  }}
                >
                  {" "}
                  {t("vendorManagement.viewListOfCustomers")}
                </div>
              </Col>
            </Row>
          </Card>
          <PromotionDetailTab
            description={details?.description}
            vendorPromoCode={details?.vendorPromoCode}
          />
        </Page>
      </LayoutVendor>
      {isViewCustomerModalOpen && (
        <ViewCustomerModal
          listOfCustomers={details?.customerForVendorPromotions || []}
          isViewCustomerModalOpen={isViewCustomerModalOpen}
          setViewCustomerModalOpen={setViewCustomerModalOpen}
        />
      )}
    </Fragment>
  );
};

export default withTranslation()(PromotionDetail);
