import React from "react";
import { withTranslation } from "react-i18next";
import Card from "components/Card";
import { Col, Form, Row } from "reactstrap";
import styles from "./../ManageCustomers.module.scss";
import Text from "components/Text";
import DatePicker from "react-datepicker";
import CustomSelect from "components/CustomSelect";

const OrderHistoryCard = ({ t, filterHookData }) => {
  const { data, methods } = filterHookData;
  const {
    orderStatusOptions,
    paymentMethodsOptions,
    paymentStatusOptions,
    customersList,
    selectedOrderStatus,
    selectedPaymentMethod,
    selectedPaymentStatus,
    selectedCustomer,
    hasMore,
    fromDate,
    toDate,
  } = data;
  const {
    setOrderStatus,
    setPaymentMethod,
    setPaymentStatus,
    setCustomer,
    loadMore,
    setFromDate,
    setToDate,
    selectOption,
  } = methods;

  const dateCheck = () => {
    if (toDate < new Date()) return toDate;
    return new Date();
  };
  return (
    <Card
      className={styles["vendor-card"]}
      radius="10px"
      marginBottom="10px"
      shadow="0 0 15px 0 rgba(0, 0, 0, 0.08)"
      cursor="default"
    >
      <Text size="20px" marginBottom="20px" weight="500" color="#111B45">
        {t("vendorManagement.orderHistory")}
      </Text>
      <Form className="vendor-order-history-form">
        <Row>
          <Col md={4} sm={6}>
            <CustomSelect
              Title={t("vendorManagement.paymentMethod")}
              id={"paymentMethod"}
              options={paymentMethodsOptions}
              selectedOption={selectedPaymentMethod}
              selectOption={(op) => selectOption(() => setPaymentMethod(op))}
            />
          </Col>
          <Col md={4} sm={6}>
            <CustomSelect
              Title={t("vendorManagement.paymentStatus")}
              id={"paymentStatus"}
              options={paymentStatusOptions}
              selectedOption={selectedPaymentStatus}
              selectOption={(op) => selectOption(() => setPaymentStatus(op))}
            />
          </Col>
          <Col md={4} sm={6}>
            <CustomSelect
              Title={t("vendorManagement.orderStatus")}
              id={"orderStatus"}
              options={orderStatusOptions}
              selectedOption={selectedOrderStatus}
              selectOption={(op) => selectOption(() => setOrderStatus(op))}
            />
          </Col>
          <Col md={4} sm={6}>
            <CustomSelect
              Title={t("vendorManagement.customerName")}
              id={"customerName"}
              options={customersList}
              selectedOption={selectedCustomer}
              selectOption={(op) => selectOption(() => setCustomer(op))}
              pagination={true}
              hasMoreData={hasMore}
              loadMoreData={loadMore}
            />
          </Col>
          <Col md={4} sm={6}>
            <div className="c-field">
              <label>{t("vendorManagement.dateRangeFrom")}</label>
              <div className="d-flex inputdate">
                <DatePicker
                  selected={fromDate}
                  onSelect={(date) => selectOption(() => setFromDate(date))}
                  dateFormat="dd/MM/yyyy"
                  className="c-form-control"
                  maxDate={dateCheck()}
                />
              </div>
            </div>
          </Col>
          <Col md={4} sm={6}>
            <div className="c-field">
              <label>{t("vendorManagement.to")}</label>
              <div className="d-flex inputdate">
                <DatePicker
                  selected={toDate}
                  onSelect={(date) => selectOption(() => setToDate(date))}
                  dateFormat="dd/MM/yyyy"
                  className="c-form-control"
                  minDate={fromDate}
                />
              </div>
            </div>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default withTranslation()(OrderHistoryCard);
