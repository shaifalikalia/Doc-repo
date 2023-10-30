import React, { Fragment } from "react";
import { withTranslation } from "react-i18next";
import styles from "./../../ManageOrders.module.scss";
import "./../../Orders.scss";
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import NotShippedTabTable from "./NotShippedTabTable";
import AdditionalItemModal from "../Modals/AdditionalItemModal";
import ShippedTabTable from "./ShippedTabTable";
import DeliveredTabTable from "./DeliveredTabTable";
import CancelledTabTable from "./CancelledTabTable";
import AllItemsTabTable from "./AllItemsTabTable";
import NewShipmentTabTable from "./NewShipmentTabTable";
import useOrderDetailsByStatus from "../../Hooks/useOrderDetailsByStatus";
import Loader from "components/Loader";

const OrderDetailTabs = ({ t, fetchOrderDetail, exportOrder }) => {
  const { data, methods } = useOrderDetailsByStatus({ t, fetchOrderDetail });
  const {
    activeTab,
    isAdditionalItemModalOpen,
    tabs,
    details,
    loading,
    isTrackOrderModel,
  } = data;
  const { setActiveTab, setIsAdditionalItemModalOpen } = methods;

  return (
    <Fragment>
      {loading && <Loader />}
      <div
        className={
          "common-tabs tab-left order-detail-tab " + styles["order-detail-tab"]
        }
      >
        <div className="d-lg-flex align-items-center justify-content-between">
          <div>
            <Nav tabs className={"mt-0 " + styles["nav-tab"]}>
              <NavItem>
                <NavLink
                  className={activeTab === tabs.notShipped ? "active" : ""}
                  onClick={() => setActiveTab(tabs.notShipped)}
                >
                  {t("vendorManagement.notShipped")}
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={activeTab === tabs.shipped ? "active" : ""}
                  onClick={() => setActiveTab(tabs.shipped)}
                >
                  {t("shipped")}
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={activeTab === tabs.delivered ? "active" : ""}
                  onClick={() => setActiveTab(tabs.delivered)}
                >
                  {t("delivered")}
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={activeTab === tabs.cancelled ? "active" : ""}
                  onClick={() => setActiveTab(tabs.cancelled)}
                >
                  {t("cancelled")}
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={activeTab === tabs.allItems ? "active" : ""}
                  onClick={() => setActiveTab(tabs.allItems)}
                >
                  {t("vendorManagement.allItems")}
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={activeTab === tabs.newShipments ? "active" : ""}
                  onClick={() => setActiveTab(tabs.newShipments)}
                >
                  {t("vendorManagement.newShipments")}
                </NavLink>
              </NavItem>
            </Nav>
          </div>
          <div className="text-md-right">
            {/* <button className="button button-round button-shadow mb-4"
                        title={t('vendorManagement.createNewShipment')} >
                        {t('vendorManagement.createNewShipment')}
                    </button> */}
            {activeTab === tabs.shipped && (
              <button
                className="button w-sm-100 button-round button-shadow mb-4"
                onClick={() => {
                  setIsAdditionalItemModalOpen(true);
                }}
                title={t("vendorManagement.sendNewShipment")}
              >
                {t("vendorManagement.sendNewShipment")}
              </button>
            )}
          </div>
        </div>

        <TabContent activeTab={activeTab}>
          <TabPane tabId={tabs.notShipped}>
            <NotShippedTabTable
              data={details}
              isTrackOrderModel={isTrackOrderModel}
              loading={data.loading}
              openCancelItemsModal={methods.openCancelItemsModal}
              closeCancelItemsModal={methods.closeCancelItemsModal}
              isCancelItemsModalOpen={data.isCancelItemsModalOpen}
              handleSelectItems={methods.handleSelectItems}
              handleQuantity={methods.handleQuantity}
              openTrackModel={methods.openTrackModel}
              closeTrackModel={methods.closeTrackModel}
              markAsCancelled={methods.markAsCancelled}
              handleSelectAllItems={methods.handleSelectAllItems}
              markAsShipped={methods.markAsShipped}
              isAnyNotShippedItemSelected={methods.isAnyNotShippedItemSelected}
            />
          </TabPane>
          <TabPane tabId={tabs.shipped}>
            <ShippedTabTable data={details} exportOrder={exportOrder} />
          </TabPane>
          <TabPane tabId={tabs.delivered}>
            <DeliveredTabTable data={details} />
          </TabPane>
          <TabPane tabId={tabs.cancelled}>
            <CancelledTabTable data={details} />
          </TabPane>
          <TabPane tabId={tabs.allItems}>
            <AllItemsTabTable data={details} />
          </TabPane>
          <TabPane tabId={tabs.newShipments}>
            <NewShipmentTabTable data={details} exportOrder={exportOrder} />
          </TabPane>
        </TabContent>
      </div>

      {isAdditionalItemModalOpen && (
        <AdditionalItemModal
          isAdditionalItemModalOpen={isAdditionalItemModalOpen}
          setIsAdditionalItemModalOpen={setIsAdditionalItemModalOpen}
          details={data}
        />
      )}
    </Fragment>
  );
};

export default withTranslation()(OrderDetailTabs);
