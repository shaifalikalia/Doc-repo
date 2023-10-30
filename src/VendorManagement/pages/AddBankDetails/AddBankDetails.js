import Card from "components/Card";
import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import Page from "components/Page";
import "./AddBankDetails.scss";
import Loader from "components/Loader";
import HeaderVendor from "VendorManagement/components/HeaderVendor";
import { toast } from "react-hot-toast";
import { getAddDetailsLink } from "repositories/subscription-repository";

const AddBankDetails = ({ t }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      let res = await getAddDetailsLink({
        RefreshUrl: window.location.origin,
        ReturnUrl: window.location.origin,
      });
      res.data && window.open(res.data, "_self");
    } catch (error) {
      toast.error(error?.message);
    }
    setIsLoading(false);
  };

  return (
    <>
      <HeaderVendor simple={true} />
      <Page
        className="vendor-bank-details"
        title={t("vendorManagement.addBankDetails.pageTitle")}
      >
        {isLoading && <Loader />}
        <Card className="bank-card">
          <div className="page-step">
            {t("vendorManagement.addBankDetails.pageStepLast")}
          </div>

          <div className="field-group">
            <div className="card-sub-title">
              {t("vendorManagement.addBankDetails.BankDetails")}
            </div>
            <div className="card-desc">
              {t("vendorManagement.addBankDetails.BankDetailsDesc")}
            </div>
          </div>

          <div className="btn-field">
            <button
              className="button button-round button-shadow w-sm-100"
              title={t("vendorManagement.addBankDetails.addBank")}
              onClick={handleSubmit}
            >
              {t("vendorManagement.addBankDetails.addBank")}
            </button>
          </div>
        </Card>
      </Page>
    </>
  );
};

export default withTranslation()(AddBankDetails);
