import React from "react";
import LayoutVendor from "../../components/LayoutVendor";
import { withTranslation } from "react-i18next";
import Page from "components/Page";
import OrderTabs from "./components/OrderTabs";

const ManageOrders = ({ t }) => {
  return (
    <LayoutVendor>
      <Page title={t("vendorManagement.manageOrders")}>
        <OrderTabs />
      </Page>
    </LayoutVendor>
  );
};

export default withTranslation()(ManageOrders);
