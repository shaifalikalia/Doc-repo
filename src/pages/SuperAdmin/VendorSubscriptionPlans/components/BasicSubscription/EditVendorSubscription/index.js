import React, { useState, useEffect } from "react";
import { withTranslation } from "react-i18next";
import Page from "components/Page";
import { Col, Row } from "reactstrap";
import Card from "components/Card";
import Input from "components/Input";
import { useParams, useLocation } from "react-router-dom";
import { handleError, handleSuccess } from "utils";
import Loader from "components/Loader";
import constants, {
  getsubcriptionPlanTitle,
} from "../../../../../../constants";
import { editEnterPriceVendor } from "repositories/subscription-repository";

const subscriptionPlanAccess = [
  constants.subscriptionType.trial,
  constants.subscriptionType.professional,
];

let priceInputMaxLenght = 6;
const EditVendorSubscription = ({ t, history }) => {
  const location = useLocation();
  const onBack = () => {
    history.goBack();
  };
  const { subscriptionType } = useParams();
  const packageDetails = location.state;

  if (
    !subscriptionType ||
    !subscriptionPlanAccess.includes(+subscriptionType) ||
    !packageDetails
  ) {
    onBack();
  }

  const [error, setError] = useState({});
  const [isLoader, setIsLoader] = useState(false);

  const [formField, setFormField] = useState({
    vendorCharges: "",
    salesRepCharges: "",
  });

  useEffect(() => {
    if (packageDetails) {
      const { vendorChargeUnitPrice, perSalesRepresentativeUnitPrice } =
        packageDetails || {};
      setFormField({
        vendorCharges: vendorChargeUnitPrice,
        salesRepCharges: perSalesRepresentativeUnitPrice,
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
      if (!isValid()) return;
      setIsLoader(true);
      let response = await editEnterPriceVendor({
        packageId: packageDetails.id,
        VendorChargeUnitPrice: parseInt(formField.vendorCharges),
        PerSalesRepresentativeUnitPrice: parseInt(formField.salesRepCharges),
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
      title={t(
        "superAdminVendorSubscription.professionalSubscriptionForVendors",
        { field: getsubcriptionPlanTitle(subscriptionType) }
      )}
    >
      <Card
        className="add-wokstation-card"
        padding="70px"
        cursor="default"
        shadow="0 0 15px 0 rgba(0, 0, 0, 0.08)"
      >
        {isLoader && <Loader />}
        <Row>
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

export default withTranslation()(EditVendorSubscription);
