import React, { useState } from "react";
import Card from "components/Card";
import { withTranslation } from "react-i18next";
import styles from "./../../Promotion.module.scss";
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import DescriptionTab from "./DescriptionTab";
import PromocodesTab from "./PromocodesTab";

const ProductDetailTabCard = ({ t, description, vendorPromoCode }) => {
  const [activeTab, setActiveTab] = useState("1");

  return (
    <Card
      className={styles["promotion-card"] + " " + styles["pt-10"]}
      radius="10px"
      marginBottom="10px"
      shadow="0 0 15px 0 rgba(0, 0, 0, 0.08)"
      cursor="default"
    >
      <div className="common-tabs tab-left common-tabs-scroll">
        <Nav tabs className={styles["promotion-detail-tab"]}>
          <NavItem>
            <NavLink
              className={activeTab === "1" ? "active" : ""}
              onClick={() => setActiveTab("1")}
            >
              {t("vendorManagement.description")}
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink
              className={activeTab === "2" ? "active" : ""}
              onClick={() => setActiveTab("2")}
            >
              {t("vendorManagement.promocodes")}
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={activeTab}>
          <TabPane tabId="1">
            <DescriptionTab description={description} />
          </TabPane>
          <TabPane tabId="2">
            <PromocodesTab vendorPromoCode={vendorPromoCode} />
          </TabPane>
        </TabContent>
      </div>
    </Card>
  );
};

export default withTranslation()(ProductDetailTabCard);
