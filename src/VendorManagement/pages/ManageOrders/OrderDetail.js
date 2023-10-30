import React, { useState } from "react";
import LayoutVendor from "../../components/LayoutVendor";
import { withTranslation } from "react-i18next";
import Page from "components/Page";
import styles from "./ManageOrders.module.scss";
import { Col, Row } from "reactstrap";
import Card from "components/Card";
import Text from "components/Text";
import AcceptOrderCard from "./components/AcceptOrderCard";
import { useHistory, useParams } from "react-router-dom";
import { useManageOrderDetails } from "./Hooks/useManageOrderDetails";
import moment from "moment";
import Loader from "components/Loader";
import { Tooltip } from "reactstrap/lib";
import PendingOrderDetail from "./components/OrderTabs/PendingOrderDetail";
import AcceptDeclineModel from "./components/Modals/AcceptDeclineModel";
import OrderDetailTabs from "./components/OrderDetailTabs";

const OrderDetail = ({ t }) => {
  const history = useHistory();
  const [tooltipReminderOpen, setTooltipReminderOpen] = useState(false);
  const { orderId } = useParams();

  const orderDetails = useManageOrderDetails({ orderId, history, t });
  const {
    isLoading,
    hideExportBtn,
    vendorOrderProductDetails,
    totalAmount,
    showModel,
    modelView,
    productListing,
    isPendingOrder,
    openModel,
    closeModel,
    onSubmit,
    updateProductListing,
    fetchOrderDetail,
    details,
    exportOrder,
  } = orderDetails;
  const {
    name,
    invoiceNo,
    accountOwnerName,
    officeName,
    officeAddress,
    date,
    orderNumber,
    status,
    paymentMethod,
    paymentStatus,
    billMeLaterModeOfPayment,
    isToolTipVisible,
  } = orderDetails?.basicDetails || {};

  return (
    <LayoutVendor>
      {isLoading && <Loader />}
      <Page
        onBack={() => {
          history.goBack();
        }}
      >
        <Row className={"align-items-center " + styles["-mt-30"]}>
          <Col md="7">
            <h2 className="page-title mt-3 mb-md-0 mb-4">
              {t("superAdminVendorManagement.orderNo")} {orderNumber}
            </h2>
          </Col>
          <Col md="5" className="text-md-right">
            {hideExportBtn && (
              <button
                className="button button-round button-shadow w-sm-100 mb-md-0 mb-3"
                title={t("vendorManagement.exportOrderShipment")}
                onClick={() => exportOrder()}
              >
                {t("vendorManagement.exportOrderShipment")}
              </button>
            )}
          </Col>
        </Row>
        <div className={styles["order-detail-card"]}>
          <Card
            className={styles["vendor-card"]}
            radius="10px"
            marginBottom="10px"
            shadow="0 0 15px 0 rgba(0, 0, 0, 0.08)"
            cursor="default"
          >
            <Row className="flex-row-reverse">
              <Col md="6" sm="6">
                {isPendingOrder && (
                  <AcceptOrderCard
                    openModel={openModel}
                    productListing={productListing}
                    updateProductListing={updateProductListing}
                    onSubmit={onSubmit}
                    isLoading={isLoading}
                  />
                )}
              </Col>
              <Col md="6" sm="6">
                <Row>
                  <Col md="6">
                    <Text
                      size="12px"
                      marginBottom="5px"
                      weight="400"
                      color="#6f7788"
                    >
                      {t("name")}
                    </Text>
                    <Text
                      size="14px"
                      marginBottom="25px"
                      weight="600"
                      color="#102c42"
                    >
                      {name}
                    </Text>
                  </Col>

                  {!isPendingOrder && (
                    <Col md="6">
                      <Text
                        size="12px"
                        marginBottom="5px"
                        weight="400"
                        color="#6f7788"
                      >
                        {t("vendorManagement.InvoiceNo")}
                      </Text>
                      <Text
                        size="14px"
                        marginBottom="25px"
                        weight="600"
                        color="#102c42"
                      >
                        {invoiceNo}
                      </Text>
                    </Col>
                  )}

                  <Col md="12">
                    <Text
                      size="12px"
                      marginBottom="5px"
                      weight="400"
                      color="#6f7788"
                    >
                      {t("superAdmin.accountOwnerName")}
                    </Text>
                    <Text
                      size="14px"
                      marginBottom="25px"
                      weight="600"
                      color="#102c42"
                    >
                      {accountOwnerName}
                    </Text>
                  </Col>
                  <Col md="12">
                    <Text
                      size="12px"
                      marginBottom="5px"
                      weight="400"
                      color="#6f7788"
                    >
                      {t("superAdmin.officeName")}
                    </Text>
                    <Text
                      size="14px"
                      marginBottom="25px"
                      weight="600"
                      color="#102c42"
                    >
                      {officeName}
                    </Text>
                  </Col>
                  <Col md="6">
                    <Text
                      size="12px"
                      marginBottom="5px"
                      weight="400"
                      color="#6f7788"
                    >
                      {t("form.fields.officeAddress")}
                    </Text>
                    <Text
                      size="14px"
                      marginBottom="25px"
                      weight="600"
                      color="#102c42"
                    >
                      {officeAddress}
                    </Text>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col sm="6" md="3">
                <Text
                  size="12px"
                  marginBottom="5px"
                  weight="400"
                  color="#6f7788"
                >
                  {t("vendorManagement.date")}
                </Text>
                <Text
                  size="14px"
                  marginBottom="25px"
                  weight="600"
                  color="#102c42"
                >
                  {moment(date).format("MMM DD, YYYY")}
                </Text>
              </Col>
              <Col sm="6" md="3">
                <Text
                  size="12px"
                  marginBottom="5px"
                  weight="400"
                  color="#6f7788"
                >
                  {t("status")}
                </Text>
                <Text
                  size="14px"
                  marginBottom="25px"
                  weight="600"
                  color="#102c42"
                >
                  {status}
                </Text>
              </Col>
              <Col sm="6" md="3">
                <Text
                  size="12px"
                  marginBottom="5px"
                  weight="400"
                  color="#6f7788"
                >
                  {t("vendorManagement.paymentMethod")}
                </Text>
                <Text
                  size="14px"
                  marginBottom="25px"
                  weight="600"
                  color="#102c42"
                >
                  {paymentMethod}
                </Text>
              </Col>
              <Col sm="6" md="3">
                <Text
                  size="12px"
                  marginBottom="5px"
                  weight="400"
                  color="#6f7788"
                >
                  {t("vendorManagement.paymentStatus")}
                </Text>
                <div className="d-flex">
                  <Text
                    size="14px"
                    marginBottom="25px"
                    weight="600"
                    color="#102c42"
                  >
                    {paymentStatus}
                  </Text>

                  {isToolTipVisible && (
                    <img
                      onClick={() => {
                        setTooltipReminderOpen(true);
                      }}
                      className="ml-2 mb-4"
                      id="TooltipRemider"
                      src={
                        require("assets/images/info_black-tooltip.svg").default
                      }
                      alt="icon"
                    />
                  )}
                </div>

                {isToolTipVisible && (
                  <Tooltip
                    className="new-item-card-catalogue-tooltip"
                    isOpen={tooltipReminderOpen}
                    placement="top"
                    target="TooltipRemider"
                    toggle={() => {
                      setTooltipReminderOpen(!tooltipReminderOpen);
                    }}
                  >
                    {billMeLaterModeOfPayment}
                  </Tooltip>
                )}
              </Col>
            </Row>
          </Card>
        </div>
        {!isPendingOrder && (
          <OrderDetailTabs
            fetchOrderDetail={fetchOrderDetail}
            exportOrder={exportOrder}
          />
        )}
        {isPendingOrder && (
          <PendingOrderDetail
            details={details}
            vendorOrderProductDetails={vendorOrderProductDetails}
            totalAmount={totalAmount}
          />
        )}
        {showModel && (
          <AcceptDeclineModel
            modelView={modelView}
            closeModel={closeModel}
            onSubmit={onSubmit}
          />
        )}
      </Page>
    </LayoutVendor>
  );
};

export default withTranslation()(OrderDetail);
