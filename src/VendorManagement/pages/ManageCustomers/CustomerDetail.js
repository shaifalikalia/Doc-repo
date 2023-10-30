import React from "react";
import LayoutVendor from "../../components/LayoutVendor";
import { withTranslation } from "react-i18next";
import Page from "components/Page";
import styles from "./ManageCustomers.module.scss";
import { Col, Row } from "reactstrap";
import Card from "components/Card";
import Text from "components/Text";
import OrderTable from "./components/OrderTable";
import EditCustomerModal from "./components/EditCustomerModal";
import OrderHistoryCard from "./components/OrderHistoryCard";
import useCustomerDetail from "./hooks/useCustomerDetail";
import useOrderHistoryFilter from "./hooks/useOrderHistoryFilter";
import useCustomerOrderList from "./hooks/useCustomerOrderList";
import Loader from "components/Loader";

const CustomerDetail = ({ t }) => {
  const hookData = useCustomerDetail({ t });
  const { data, methods } = hookData;
  const {
    isEditCustomerModalOpen,
    loading: customerDetailsLoading,
    formattedOfficeDetails: officeDetails,
  } = data;
  const { openEditCustomerModal, onBack, refetchOfficeDetails } = methods;

  const filterHookData = useOrderHistoryFilter({ t });
  const orderListHookData = useCustomerOrderList({
    t,
    filters: filterHookData.data,
    refetchOfficeDetails,
  });
  const { loading: orderListLoading } = orderListHookData.data;

  return (
    <LayoutVendor>
      <Page onBack={onBack} title={t("vendorManagement.customerDetails")}>
        {(orderListLoading || customerDetailsLoading) && <Loader />}
        <div className={styles["customer-detail-card"]}>
          <Card
            className={styles["vendor-card"]}
            radius="10px"
            marginBottom="10px"
            shadow="0 0 15px 0 rgba(0, 0, 0, 0.08)"
            cursor="default"
          >
            <Row className="flex-row-reverse">
              <Col md="6">
                <div
                  className={"text-right cursor-pointer " + styles["edit-btn"]}
                >
                  <span onClick={openEditCustomerModal} title={t("edit")}>
                    {" "}
                    <img
                      src={require("assets/images/edit-icon.svg").default}
                      alt="icon"
                    />
                  </span>
                </div>
              </Col>
              <Col md="6">
                <Row>
                  <Col sm="6" xs="10">
                    <Text
                      size="12px"
                      marginBottom="5px"
                      weight="400"
                      color="#6f7788"
                    >
                      {t("vendorManagement.officeName")}
                    </Text>
                    <Text
                      size="14px"
                      marginBottom="25px"
                      weight="600"
                      color="#102c42"
                    >
                      {officeDetails.officeName}
                    </Text>
                  </Col>
                  <Col sm="6">
                    <Text
                      size="12px"
                      marginBottom="5px"
                      weight="400"
                      color="#6f7788"
                    >
                      {t("vendorManagement.vIPCustomerAccess")}
                    </Text>
                    <Text
                      size="14px"
                      marginBottom="25px"
                      weight="600"
                      color="#102c42"
                    >
                      {officeDetails.vipAccess}
                    </Text>
                  </Col>
                  <Col sm="6">
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
                      {officeDetails.ownerName}
                    </Text>
                  </Col>
                  <Col sm="6">
                    <Text
                      size="12px"
                      marginBottom="5px"
                      weight="400"
                      color="#6f7788"
                    >
                      {t("vendorManagement.billMeLaterAccessCreditLimit")}
                    </Text>
                    <Text
                      size="14px"
                      marginBottom="25px"
                      weight="600"
                      color="#102c42"
                    >
                      {officeDetails.billMeLaterDetail}
                    </Text>
                    {officeDetails.isBillMeLater && (
                      <div className="yellow-alert-box">
                        <div>
                          {t("vendorManagement.totalCreditLimit")}
                          <b> {officeDetails?.totalLimit}</b>
                        </div>
                        <div>
                          {t("vendorManagement.remainingCreditLimit")}
                          <b> {officeDetails?.remainingLimit}</b>
                        </div>
                      </div>
                    )}
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>
          <div className={styles["export-btn-group"]}>
            <button
              className="button button-round button-border button-dark mb-3"
              disabled={!orderListHookData.data.isOrderSelected}
              onClick={orderListHookData.methods.generatePdf}
              title={t("vendorManagement.exportInvoices")}
            >
              {t("vendorManagement.exportInvoices")}
            </button>
            <button
              className="button button-round button-border button-dark mb-3 ml-md-3"
              title={t("vendorManagement.generateInvoices")}
              disabled={!orderListHookData.data.isOrderSelected}
              onClick={orderListHookData.methods.generateInvoice}
            >
              {t("vendorManagement.generateInvoices")}
            </button>
            <button
              className="button button-round button-border button-dark mb-3 ml-md-3"
              title={t("vendorManagement.exportOrders")}
              disabled={!orderListHookData.data.isOrderSelected}
              onClick={orderListHookData.methods.generatePdf}
            >
              {t("vendorManagement.exportOrders")}
            </button>
          </div>
          <OrderHistoryCard filterHookData={filterHookData} />
          <OrderTable
            orderListHookData={orderListHookData}
            isLoading={orderListLoading}
          />
        </div>
      </Page>
      {isEditCustomerModalOpen && <EditCustomerModal hookData={hookData} />}
    </LayoutVendor>
  );
};

export default withTranslation()(CustomerDetail);
