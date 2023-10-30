import React, { useState, Fragment, useEffect } from "react";
import { withTranslation } from "react-i18next";
import Page from "components/Page";
import Card from "components/Card";
import Input from "components/Input";
import Loader from "components/Loader";
import { Col, Row } from "reactstrap";
import { handleError, handleSuccess, testRegexCheck } from "utils";
import {
  addEnterPrice,
  editEnterPriceVendor,
} from "repositories/subscription-repository";
import { useLocation } from "react-router-dom";
import constants from "../../../../../../constants";

function HandleActions(props) {
  return (
    <Fragment>
      <button
        className={
          " button button-round button-shadow mr-4 button-top-margin w-sm-100"
        }
        title={props.t("save")}
        onClick={props.handleSubmit}
      >
        {props.t("save")}
      </button>
      <button
        className={
          " button button-round button-dark button-border btn-mobile-link"
        }
        onClick={props.onBack}
        title={props.t("cancel")}
      >
        {props.t("cancel")}
      </button>
    </Fragment>
  );
}

const AddNewPlan = ({ t, history }) => {
  const onBack = () => history.push(`/enterprise-subscription`);
  const [error, setError] = useState({});
  const [isLoader, setIsLoader] = useState(false);
  const [formField, setFormField] = useState({
    vendorCharges: "",
    packageName: "",
    salesRepCharges: "",
  });

  const location = useLocation();
  const isEditForm =
    location.state &&
    location.pathname === constants.routes.superAdmin.editEnterPricePlan;

  useEffect(() => {
    if (isEditForm) {
      const { name, vendorChargeUnitPrice, perSalesRepresentativeUnitPrice } =
        location.state;
      setFormField({
        vendorCharges: vendorChargeUnitPrice,
        packageName: name,
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
      packageName: !formField.packageName?.trim()?.length
        ? t("form.errors.emptyField", {
            field: t("superAdminVendorSubscription.packageName"),
          })
        : null,
    };
    setError(errorMessage);
    return !Object.values(errorMessage).filter(Boolean)?.length;
  };

  const handlePackageName = (event) => {
    const { value } = event.target;
    if (!testRegexCheck(value)) return;
    setFormField((prev) => ({ ...prev, packageName: value }));
    setError((pre) => {
      pre.packageName = !value?.trim()?.length
        ? t("form.errors.emptyField", {
            field: t("superAdminVendorSubscription.packageName"),
          })
        : null;
      return pre;
    });
  };

  const handleSubmit = async () => {
    try {
      if (!isValid()) return;
      setIsLoader(true);
      let response = {};
      if (isEditForm) {
        let params = {
          packageId: location.state.id,
          name: formField.packageName?.trim(),
          VendorChargeUnitPrice: parseInt(formField.vendorCharges),
          PerSalesRepresentativeUnitPrice: parseInt(formField.salesRepCharges),
        };
        response = await editEnterPriceVendor(params);
      } else {
        let params = {
          packageName: formField.packageName?.trim(),
          officeUnitPrice: 0,
          permanentStaffUnitPrice: 0,
          temporaryStaffUnitPrice: 0,
          placementUnitPrice: 0,
          SetupFeeUnitPrice: 0,
          officeUnitPriceInUsd: 0,
          permanentStaffUnitPriceInUsd: 0,
          temporaryStaffUnitPriceInUsd: 0,
          placementUnitPriceInUsd: 0,
          SetupFeeUnitPriceInUsd: 0,
          IsForVendor: true,
          VendorChargeUnitPrice: parseInt(formField.vendorCharges),
          SalesRepresentativeUnitPrice: parseInt(formField.salesRepCharges),
        };
        response = await addEnterPrice(params);
      }
      response?.message && handleSuccess(response.message);
      history.goBack();
    } catch (err) {
      handleError(err);
    }
    setIsLoader(false);
  };

  return (
    <Page
      onBack={onBack}
      title={t("superAdminVendorSubscription.enterprisePlanSubscription")}
    >
      {isLoader && <Loader />}
      <Card
        className="add-wokstation-card"
        padding="70px"
        cursor="default"
        shadow="0 0 15px 0 rgba(0, 0, 0, 0.08)"
      >
        <Row>
          <Col lg="12">
            <Input
              Title={t("superAdminVendorSubscription.packageName")}
              Type="text"
              Name="packageName"
              Error={error.packageName}
              Value={formField.packageName}
              HandleChange={handlePackageName}
              Placeholder={
                t("Enter ") + t("superAdminVendorSubscription.packageName")
              }
              MaxLength={120}
            />
            <Input
              Title={t("superAdminVendorSubscription.vendorCharges")}
              Type="text"
              Name="vendorCharges"
              Value={formField.vendorCharges}
              Error={error.vendorCharges}
              HandleChange={handleChange}
              MaxLength={6}
            />

            <Input
              Title={t("superAdminVendorSubscription.salesRepCharges")}
              Type="text"
              Name="salesRepCharges"
              Value={formField.salesRepCharges}
              Error={error.salesRepCharges}
              HandleChange={handleChange}
              MaxLength={6}
            />

            <HandleActions handleSubmit={handleSubmit} t={t} onBack={onBack} />
          </Col>
        </Row>
      </Card>
    </Page>
  );
};

export default withTranslation()(AddNewPlan);
