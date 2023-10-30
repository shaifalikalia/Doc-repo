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
import styles from "./Promotion.module.scss";
import ExpiredTab from "./components/PromoCodeTabs/ExpiredTab";
import LaunchedTab from "./components/PromoCodeTabs/LaunchedTab";
import LaunchedRemainingCard from "./components/LaunchedRemainingCard";
import constants from "../../../constants";
import { usePromotionList } from "./Hooks/usePromotionList";
import Loader from "components/Loader";
import useHandleApiError from "hooks/useHandleApiError";
import { useToGetTopUpBalance } from "repositories/admin-vendor-repository";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import ModuleDisabled from "components/ModuleDisabled";

const Promotion = ({ t }) => {
  const pageSize = 5;
  const history = useHistory();
  const profile = useSelector((e) => e.userProfile.profile);
  const isAccountTerminated = profile?.profileSetupStep === constants.subscriptionTerminated
  const disabledClass = isAccountTerminated ? 'disabled-element': ''


  const {
    activeTab,
    promotionList,
    isLoading,
    totalItems,
    pageNumber,
    handlePageNumber,
    updateTab,
    showDisableModel,
    setShowDisableModel,
  } = usePromotionList({ pageSize });

  const {
    data,
    isLoading: isLoadingPromtions,
    isFetching,
    error,
  } = useToGetTopUpBalance();
  useHandleApiError(isLoadingPromtions, isFetching, error);

  const handleRedirect = () => {
    if (isAccountTerminated) {
      setShowDisableModel(true);
      return false;
    }
    history.push(constants.routes.vendor.addPromotion);
  };

  const disabledBtn = () => {
    if(isAccountTerminated) return false
    if(data?.promotionRemaining) return false
    return true
  }

  return (
    <LayoutVendor>
      <Page>
        <ModuleDisabled
          isOpen={showDisableModel}
          closeModal={() => setShowDisableModel(false)}
          content={t("vendorManagement.promotionDisabled")}
        />

        {(isLoading || isLoadingPromtions) && <Loader />}
        <Row className="align-items-center mb-4">
          <Col md="5">
            <h2 className="page-title mb-md-0 mb-md-4 mb-3 margin-top-negative">
              {t("vendorManagement.promotion")}
            </h2>
          </Col>
          <Col md="7" className="text-md-right">
            <button
              disabled={disabledBtn()}
              onClick={handleRedirect}
              className={`button button-round button-shadow w-sm-100 ${disabledClass}`}
              title={t("vendorManagement.addNewPromotion")}
            >
              {t("vendorManagement.addNewPromotion")}
            </button>
          </Col>
        </Row>
        <LaunchedRemainingCard data={data} />
        <div className="common-tabs tab-left">
          <Nav tabs className={styles["promotion-tab"]}>
            <NavItem>
              <NavLink
                className={activeTab === "1" ? "active" : ""}
                onClick={() => updateTab("1")}
              >
                {t("vendorManagement.launched")}
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink
                className={activeTab === "2" ? "active" : ""}
                onClick={() => updateTab("2")}
              >
                {t("vendorManagement.expired")}
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={activeTab}>
            <TabPane tabId="1">
              <LaunchedTab
                pageSize={pageSize}
                totalItems={totalItems}
                pageNumber={pageNumber}
                handlePageNumber={handlePageNumber}
                promotionList={promotionList}
              />
            </TabPane>
            <TabPane tabId="2">
              <ExpiredTab
                pageSize={pageSize}
                totalItems={totalItems}
                pageNumber={pageNumber}
                handlePageNumber={handlePageNumber}
                promotionList={promotionList}
              />
            </TabPane>
          </TabContent>
        </div>
      </Page>
    </LayoutVendor>
  );
};

export default withTranslation()(Promotion);
