import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import styles from "./../../ManageOrders.module.scss";
import { Nav, NavItem, NavLink } from "reactstrap";
import AllOrdersTab from "./AllOrdersTab";
import { getStorage } from "utils";
import constants from "../../../../../constants";

const OrderTabs = ({ t }) => {
  const cachedActiveTab = getStorage(
    constants.vendor.cache.manageOrderslisting
  );
  const [activeTab, setActiveTab] = useState(
    cachedActiveTab?.activeTab ? cachedActiveTab.activeTab : 0
  );

  const addClassName = (value) => {
    return activeTab === value ? "active" : "";
  };

  const tabName = constants.orderStatus;

  return (
    <div className="common-tabs tab-left">
      <Nav tabs className={styles["nav-tab"]}>
        <NavItem>
          <NavLink
            className={addClassName(tabName.all)}
            onClick={() => setActiveTab(tabName.all)}
          >
            {t("vendorManagement.allOrders")}
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={addClassName(tabName.Pending)}
            onClick={() => setActiveTab(tabName.Pending)}
          >
            {t("pending")}
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={addClassName(tabName.Accepted)}
            onClick={() => setActiveTab(tabName.Accepted)}
          >
            {t("accepted")}
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={addClassName(tabName.Shipped)}
            onClick={() => setActiveTab(tabName.Shipped)}
          >
            {t("shipped")}
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={addClassName(tabName.Delivered)}
            onClick={() => setActiveTab(tabName.Delivered)}
          >
            {t("delivered")}
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={addClassName(tabName.Cancelled)}
            onClick={() => setActiveTab(tabName.Cancelled)}
          >
            {t("cancelled")}
          </NavLink>
        </NavItem>

        <NavItem>
          <NavLink
            className={addClassName(tabName.UnPaid)}
            onClick={() => setActiveTab(tabName.UnPaid)}
          >
            {t("unPaidOrders")}
          </NavLink>
        </NavItem>
      </Nav>
      <AllOrdersTab status={activeTab} />
    </div>
  );
};

export default withTranslation()(OrderTabs);
