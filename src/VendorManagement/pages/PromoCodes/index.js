import Page from "components/Page";
import React from "react";
import LayoutVendor from "../../components/LayoutVendor";
import { withTranslation } from "react-i18next";
import {
  Col,
  Row,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import styles from "./PromoCodes.module.scss";
import ExpiredTab from "./components/PromoCodeTabs/ExpiredTab";
import LaunchedTab from "./components/PromoCodeTabs/LaunchedTab";
import usePromoCodesList from "./hooks/usePromoCodesList";
import Loader from "components/Loader";
import ModuleDisabled from "components/ModuleDisabled";

const PromoCodes = ({ t }) => {
  const hookData = usePromoCodesList({ t });
  const { data, methods } = hookData;

  return (
    <LayoutVendor>
      <Page>
        <ModuleDisabled
          isOpen={data.showDisableModel}
          content={t("vendorManagement.promoCodeDisabled")}
          closeModal={() => methods.setShowDisableModel(false)}
        />

        {data.loading && <Loader />}
        <Row className="align-items-center mb-md-4 mb-3">
          <Col md="5">
            <h2 className="page-title mb-md-0 mb-3 mt-0">
              {t("vendorManagement.promoCodes")}
            </h2>
          </Col>
          <Col md="7" className="text-md-right">
            <button
              onClick={methods.handleRedirect}
              
              className={`button w-sm-100 button-round button-shadow ${data.disabledClass}`}
              title={t("vendorManagement.addNewPromoCode")}
            >
              {t("vendorManagement.addNewPromoCode")}
            </button>
          </Col>
        </Row>
        <div className="common-tabs tab-left">
          <Nav tabs className={styles["promo-code-tab"]}>
            <NavItem>
              <NavLink
                className={
                  data.activeTab === data.tabs.launched ? "active" : ""
                }
                onClick={() => methods.setActiveTab(data.tabs.launched)}
              >
                {t("vendorManagement.launched")}
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink
                className={data.activeTab === data.tabs.expired ? "active" : ""}
                onClick={() => methods.setActiveTab(data.tabs.expired)}
              >
                {t("vendorManagement.expired")}
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={data.activeTab}>
            <TabPane tabId={data.tabs.launched}>
              <LaunchedTab hookData={hookData} disabledClass={data.disabledClass} />
            </TabPane>
            <TabPane tabId={data.tabs.expired}>
              <ExpiredTab hookData={hookData} />
            </TabPane>
          </TabContent>
        </div>
      </Page>
    </LayoutVendor>
  );
};

export default withTranslation()(PromoCodes);
