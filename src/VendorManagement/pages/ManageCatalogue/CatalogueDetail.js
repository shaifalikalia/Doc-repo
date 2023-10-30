import React from "react";
import LayoutVendor from "../../components/LayoutVendor";
import ManageCatalogueCard from "./components/ManageCatalogueCard";
import { withTranslation } from "react-i18next";
import Page from "components/Page";
import ProductDetailTab from "./components/ProductDetailTab";
import useProductDetail from "./hooks/useProductDetail";
import Loader from "components/Loader";
import constants from "../../../constants";

const CatalogueDetail = ({ t }) => {
  const { otherData, methods } = useProductDetail();

  return (
    <LayoutVendor>
      <Page
        onBack={methods.onBack}
        title={t("vendorManagement.productDetails")}
      >
        {otherData.loading && <Loader />}
        <ManageCatalogueCard
          product={otherData.productDetail}
          from={constants.vendor.productDetails}
          refetch={methods.refetch}
        />
        <ProductDetailTab
          product={otherData.productDetail}
          handleEditClick={methods.handleEditClick}
        />
      </Page>
    </LayoutVendor>
  );
};

export default withTranslation()(CatalogueDetail);
