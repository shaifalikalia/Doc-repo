import React, { useState } from "react";
import Card from "components/Card";
import { withTranslation } from "react-i18next";
import styles from "./../TopUp.module.scss";
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import TopUpPromotionsTab from "./TopUpPromotionsTab";
import TopUpHistoryTab from "./TopUpHistoryTab";

const TopUpTabs = ({ t }) => {
  const [activeTab, setActiveTab] = useState("1");
  const changeTab = (tabName) => {
    setActiveTab(tabName);
    window.scrollTo(0, 0);
  };

  return (
    <Card
      className={styles["topup-card"] + " " + styles["pt-10"]}
      radius="10px"
      marginBottom="10px"
      cursor="default"
      shadow="0 0 15px 0 rgba(0, 0, 0, 0.08)"
    >
      <div className="common-tabs tab-left common-tabs-scroll">
        <Nav tabs className={styles["nav-tab"]}>
          <NavItem>
            <NavLink
              className={activeTab === "1" ? "active" : ""}
              onClick={() => changeTab("1")}
            >
              {t("vendorManagement.topUpPromotionsInTop")}
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink
              className={activeTab === "2" ? "active" : ""}
              onClick={() => changeTab("2")}
            >
              {t("vendorManagement.topUpHistoryInTop")}
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={activeTab}>
          <TabPane tabId="1">
            {activeTab === "1" && <TopUpPromotionsTab />}
          </TabPane>
          <TabPane tabId="2">
            {activeTab === "2" && <TopUpHistoryTab />}
          </TabPane>
        </TabContent>
      </div>
    </Card>
  );
};

export default withTranslation()(TopUpTabs);
