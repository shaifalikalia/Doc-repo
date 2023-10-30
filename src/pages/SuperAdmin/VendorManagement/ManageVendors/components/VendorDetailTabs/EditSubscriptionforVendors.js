import React, { useState, useEffect } from "react";
import { withTranslation } from "react-i18next";
import Page from "components/Page";
import { Col, Row } from "reactstrap";
import Card from "components/Card";
import Input from "components/Input";
import { useLocation } from "react-router-dom";
import { handleError, handleSuccess } from "utils";
import Loader from "components/Loader";
import { updateVendorSubscription } from "repositories/subscription-repository";

let priceInputMaxLenght = 6;

const EditSubscriptionforVendors = ({ t, history }) => {
  const onBack = () => {
    history.goBack();
  };
  const location = useLocation();
  const packageDetails = location.state;

  const [error, setError] = useState({});
  const [isLoader, setIsLoader] = useState(false);

  const [formField, setFormField] = useState({
    vendorCharges: "",
    salesRepCharges: "",
  });

  useEffect(() => {
    if (packageDetails) {
      const { vendorCharge, perSalesRepCharge } = packageDetails || {};
      setFormField({
        vendorCharges: vendorCharge,
        salesRepCharges: perSalesRepCharge,
      });
    }
  }, [location.state]);

  const isValueExist = (value) => {
    if (value || value === 0) return null;
    return t("fieldNotEmpty");
  };

  const contvertIntoDec = (newValue, oldValue) => {
    if (!newValue) return "";
    let acceptNumberWithDecimal = new RegExp(/^\d*\.?\d*$/);
    if (acceptNumberWithDecimal.test(newValue)) return newValue;
    return oldValue;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    let price = contvertIntoDec(value, formField[name]);

    if (price || price === 0) {
      setError((pre) => {
        delete pre[name];
        return pre;
      });
    } else {
      setError((pre) => {
        pre[name] = t("fieldNotEmpty");
        return pre;
      });
    }
    setFormField((prev) => ({ ...prev, [name]: price }));
  };

  const isValid = () => {
    let errorMessage = {
      vendorCharges: isValueExist(formField.vendorCharges),
      salesRepCharges: isValueExist(formField.salesRepCharges),
    };
    setError(errorMessage);
    return !Object.values(errorMessage).filter(Boolean)?.length;
  };

  const handleSubmit = async () => {
    try {
      if (!isValid() || !packageDetails?.vendorId) return;
      setIsLoader(true);
      let response = await updateVendorSubscription({
        VendorId: packageDetails.vendorId,
        VendorCharge: parseInt(formField.vendorCharges),
        PerSalesRepresentative: parseInt(formField.salesRepCharges),
      });
      response.message && handleSuccess(response.message);
      onBack();
    } catch (err) {
      handleError(err);
    }
    setIsLoader(false);
  };

  return (
    <Page
      onBack={onBack}
      title={t("superAdminVendorSubscription.editSubscription")}
    >
      <Card
        className="add-wokstation-card"
        padding="70px"
        cursor="default"
        shadow="0 0 15px 0 rgba(0, 0, 0, 0.08)"
      >
        <Row>
          {isLoader && <Loader />}
          <Col lg="12">
            <Input
              Title={t("superAdminVendorSubscription.vendorCharges")}
              Type="text"
              Name="vendorCharges"
              Value={formField.vendorCharges}
              Error={error.vendorCharges}
              HandleChange={handleChange}
              MaxLength={priceInputMaxLenght}
            />

            <Input
              Title={t("superAdminVendorSubscription.salesRepCharges")}
              Type="text"
              Name="salesRepCharges"
              Value={formField.salesRepCharges}
              Error={error.salesRepCharges}
              HandleChange={handleChange}
              MaxLength={priceInputMaxLenght}
            />
            <button
              className={
                " button button-round button-shadow mr-4 button-top-margin w-sm-100"
              }
              title={t("save")}
              onClick={handleSubmit}
            >
              {t("save")}
            </button>

            <button
              className={
                " button button-round button-dark button-border btn-mobile-link"
              }
              title={t("cancel")}
              onClick={onBack}
            >
              {t("cancel")}
            </button>
          </Col>
        </Row>
      </Card>
    </Page>
  );
};

export default withTranslation()(EditSubscriptionforVendors);
