import React, { useState } from "react";
import Card from "components/Card";
import { withTranslation } from "react-i18next";
import styles from "./../../ManageCatalogue.module.scss";
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import UnitPriceTab from "./UnitPriceTab";
import DiscountsTab from "./DiscountsTab";
import LocationDeliveryTab from "./LocationDeliveryTab";

const ProductDetailTabCard = ({ t, ...props }) => {
  const [activeTab, setActiveTab] = useState("1");

  return (
    <Card
      className={
        styles["catalogue-card"] + " " + styles["catalogue-detail-card"]
      }
      radius="10px"
      marginBottom="10px"
      shadow="0 0 15px 0 rgba(0, 0, 0, 0.08)"
      cursor="default"
    >
      <div className="common-tabs tab-left">
        <Nav tabs className={styles["product-detail-tab"]}>
          <NavItem>
            <NavLink
              className={activeTab === "1" ? "active" : ""}
              onClick={() => setActiveTab("1")}
            >
              {t("vendorManagement.unitPrice")}
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink
              className={activeTab === "2" ? "active" : ""}
              onClick={() => setActiveTab("2")}
            >
              {t("vendorManagement.discounts")}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={activeTab === "3" ? "active" : ""}
              onClick={() => setActiveTab("3")}
            >
              {t("vendorManagement.locationDeliveryTime")}
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={activeTab}>
          <TabPane tabId="1">
            <UnitPriceTab {...props} />
          </TabPane>
          <TabPane tabId="2">
            <DiscountsTab {...props} />
          </TabPane>
          <TabPane tabId="3">
            <LocationDeliveryTab {...props} />
          </TabPane>
        </TabContent>
      </div>
    </Card>
  );
};

export default withTranslation()(ProductDetailTabCard);
