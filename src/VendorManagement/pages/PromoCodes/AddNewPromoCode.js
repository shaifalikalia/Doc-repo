import Page from "components/Page";
import React, { Fragment } from "react";
import LayoutVendor from "../../components/LayoutVendor";
import { withTranslation } from "react-i18next";
import Card from "components/Card";
import styles from "./PromoCodes.module.scss";
import { Col, Form, Row } from "reactstrap";
import Text from "components/Text";
import Input from "components/Input";
import SelectCustomerModal from "VendorManagement/components/Modals/SelectCustomerModal";
import DatePicker from "react-datepicker";
import useAddPromoCode from "./hooks/useAddPromoCode";
import Loader from "components/Loader";

const AddNewPromoCode = ({ t }) => {
  const hookData = useAddPromoCode({ t });
  const { data, methods } = hookData;

  return (
    <Fragment>
      <LayoutVendor>
        <Page
          onBack={methods.onBack}
          title={t("vendorManagement.addNewPromoCode")}
        >
          {data.loading && <Loader />}
          <Card
            className={styles["promo-code-card"]}
            radius="10px"
            marginBottom="10px"
            shadow="0 0 15px 0 rgba(0, 0, 0, 0.08)"
            cursor="default"
          >
            <Form>
              <Row>
                <Col lg={6}>
                  <div className={styles["promocode-generate-row"]}>
                    <Input
                      Title={t("vendorManagement.promoCode")}
                      Type="text"
                      Name={"promoCode"}
                      Value={data.promoCode}
                      MaxLength="12"
                      HandleChange={methods.handlePromocode}
                      Placeholder={t("form.placeholder1", {
                        field: t("vendorManagement.promoCode"),
                      })}
                      Error={data.errors.promoCode}
                    />
                    <span
                      className={"link-btn " + styles["generate-btn"]}
                      onClick={methods.handleGenerateCode}
                    >
                      {t("vendorManagement.generate")}
                    </span>
                  </div>
                  <Input
                    Title={t("vendorManagement.discountAllowedInPercentage")}
                    Type="number"
                    Name={"discountAllowed"}
                    Value={data.discount}
                    HandleChange={methods.handleDiscount}
                    HandleKeyDown={methods.handleDiscountKeyDown}
                    MaxLength="6"
                    Placeholder={t("form.placeholder1", {
                      field: t("vendorManagement.discountAllowed"),
                    })}
                    Error={data.errors.discount}
                  />

                  <div className="c-field">
                    <label>{t("vendorManagement.expiryDate")}</label>
                    <div className="d-flex inputdate date-width-100">
                      <DatePicker
                        selected={data.expiryDate}
                        minDate={data.minDate}
                        dateFormat="dd/MM/yyyy"
                        className="c-form-control"
                        onSelect={methods.onDateSelect}
                      />
                    </div>
                  </div>

                  <Text
                    size="13px"
                    marginBottom="5px"
                    weight="400"
                    color="#79869A"
                  >
                    {t("vendorManagement.sendPromoCodeTo")}
                  </Text>
                  <div className="ch-radio">
                    <label className="mr-5">
                      <input
                        type="radio"
                        name="sendPromoCodeTo"
                        checked={data.isSendToAll}
                        onChange={() => methods.radioHandler(true)}
                      />
                      <span> {t("vendorManagement.sendToAllCustomers")} </span>
                    </label>
                  </div>
                  <div className={styles["select-customer-radio"]}>
                    <div className="ch-radio">
                      <label>
                        <input
                          type="radio"
                          name="sendPromoCodeTo"
                          checked={!data.isSendToAll}
                          onChange={() => methods.radioHandler(false)}
                        />
                        <span>
                          {t("vendorManagement.sendtoSelectedCustomers")}
                        </span>
                      </label>
                    </div>
                    {!data.isSendToAll && (
                      <>
                        <Text
                          className={styles["count-box"]}
                          size="12px"
                          marginBottom="10px"
                          weight="400"
                          color="#6F7788"
                        >
                          {data.selectedCustomers.length}{" "}
                          {t("vendorManagement.selected")}
                          {!!data.errors.selectedCustomers && (
                            <span className="error-msg">
                              {data.errors.selectedCustomers}
                            </span>
                          )}
                        </Text>
                        <span
                          className={"link-btn " + styles["link-btn"]}
                          onClick={methods.openCustomerModal}
                        >
                          {t("vendorManagement.selectCustomers")}
                        </span>
                      </>
                    )}
                  </div>
                </Col>
              </Row>
              <div className={"d-md-flex my-4 " + styles["btn-box"]}>
                <button
                  className="button button-round button-shadow mr-md-4 w-sm-100 mb-3"
                  onClick={methods.handleAddPromocode}
                  title={t("save")}
                >
                  {t("save")}
                </button>
                <button
                  className="button button-round  button-dark mb-md-3 btn-mobile-link  button-border"
                  onClick={methods.onBack}
                  title={t("cancel")}
                >
                  {t("cancel")}
                </button>
              </div>
            </Form>
          </Card>
        </Page>
      </LayoutVendor>
      {data.isCustomerModalOpen && (
        <SelectCustomerModal
          isOpen={data.isCustomerModalOpen}
          closeModal={methods.closeCustomerModal}
          handleSearchTerm={methods.handleSearchTerm}
          loading={data.loading}
          selectedCustomers={data.selectedCustomers}
          customersList={data.customersList}
          hasMore={data.hasMore}
          loadMore={methods.loadMore}
          isCustomerSelected={methods.isCustomerSelected}
          handleSelectCustomer={methods.handleSelectCustomer}
          handleSaveCustomers={methods.handleSaveCustomers}
          selectError={data.errors.selectedCustomers}
        />
      )}
    </Fragment>
  );
};

export default withTranslation()(AddNewPromoCode);
