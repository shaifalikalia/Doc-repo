import React, { useState, useEffect } from "react";
import { withTranslation } from "react-i18next";
import styles from "./../../ManageVendors.module.scss";
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import OrderHistory from "./orderHistory";
import Page from "components/Page";
import DetailCard from "../../Detail/DetailCard";
import SalesRep from "./salesRep";
import constants from "../../../../../../constants";
import { decodeId, getStorage, setStorage, removeStorage } from "utils";
import { useLocation, useParams, Link } from "react-router-dom";

const VendorDetailsTabs = ({ t, history }) => {
  const value = getStorage(constants.vendor.cache.orderDetailsTabs);
  const [activeTab, setActiveTab] = useState(
    value || constants.vendorDetailsTab.orderHistory
  );
  const vendorId = decodeId(useParams()?.vendorId);
  const vendorCacheDetail = useLocation()?.state;
  const isGetDetail =
    vendorCacheDetail?.user?.profileSetupStep ===
    constants.vendor.step.addProfileDetails
      ? false
      : true;
  const onBack = () => history.push(constants.routes.superAdmin.manageVendors);

  const updateTab = (text) => {
    setActiveTab(text);
    setStorage(constants.vendor.cache.orderDetailsTabs, text);
  };

  useEffect(() => {
    return () => {
      const {
        orderDetailsTabs,
        salesRepVendorInAdmin,
        orderHistoryVendorInAdmin,
      } = constants.vendor.cache;
      removeStorage([
        orderDetailsTabs,
        salesRepVendorInAdmin,
        orderHistoryVendorInAdmin,
      ]);
    };
  }, []);

  return (
    <Page onBack={onBack} titleKey="superAdminVendorManagement.vendorsDetails">
      <DetailCard
        vendorCacheDetail={vendorCacheDetail?.user}
        action={
          <div className="d-flex flex-row">
            <Link
              to={{
                pathname: constants.routes.superAdmin.VendorProfile,
                state: {
                  vendorCacheDetail: { ...vendorCacheDetail?.user },
                  vendorId,
                  isGetDetail,
                },
              }}
            >
              <button className="button button-round button-width-large mr-4">
                {t("superAdminVendorManagement.viewVendorDetails")}
              </button>
            </Link>
            <Link
              to={{
                pathname: "/vendor-subscription-details",
                state: { vendorCacheDetail, vendorId },
              }}
            >
              <button className="button button-round button-width-large mr-4">
                {t("superAdminVendorManagement.viewSubscriptionDetail")}
              </button>
            </Link>
            <Link
              to={{
                pathname: "/vendor-transaction-history",
                state: { vendorId },
              }}
            >
              <button className="button button-round button-dark button-border btn-mobile-link">
                {t("superAdminVendorManagement.viewTransactionHistory")}
              </button>
            </Link>
          </div>
        }
      />

      <div className="common-tabs tab-left">
        <Nav tabs className={styles["nav-tab"]}>
          <NavItem>
            <NavLink
              className={activeTab === "1" ? "active" : ""}
              onClick={() => updateTab(constants.vendorDetailsTab.orderHistory)}
            >
              {t("superAdminVendorManagement.orderHistory")}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={activeTab === "2" ? "active" : ""}
              onClick={() => updateTab(constants.vendorDetailsTab.salesRep)}
            >
              {t("superAdminVendorManagement.salesRep")}
            </NavLink>
          </NavItem>
        </Nav>
      </div>

      <div className="mt-4">
        <TabContent activeTab={activeTab}>
          <TabPane tabId="1">
            <OrderHistory isGetDetail={isGetDetail} vendorId={vendorId} />
          </TabPane>
          <TabPane tabId="2">
            <SalesRep
              isGetDetail={isGetDetail}
              vendorId={vendorId}
              isSalesTab={activeTab === constants.vendorDetailsTab.salesRep}
            />
          </TabPane>
        </TabContent>
      </div>
    </Page>
  );
};

export default withTranslation()(VendorDetailsTabs);
