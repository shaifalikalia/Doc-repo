import React from "react";
import { matchPath, useLocation, NavLink } from "react-router-dom";
import styles from "./components.module.scss";
import { withTranslation } from "react-i18next";
import { Nav, NavItem } from "reactstrap";
import constants from "../../constants";

const VendorSidebar = ({ t }) => {
  const location = useLocation();

  const isManageOrder = () => {
    const manageOrderPaths = [
      constants.routes.vendor.orderDetail,
      constants.routes.vendor.manageOrders,
    ];
    if (matchPath(location.pathname, manageOrderPaths)) return true;
    return false;
  };

  const isCatalogueActive = () => {
    const cataloguePaths = [
      constants.routes.vendor.addNewItem,
      constants.routes.vendor.catalogueDetail,
      constants.routes.vendor.manageCatalogue,
    ];
    if (matchPath(location.pathname, cataloguePaths)) return true;
    return false;
  };

  const isManageCustomer = () => {
    const manageCustomerPaths = [
      constants.routes.vendor.customerDetail,
      constants.routes.vendor.manageCustomers,
    ];
    if (matchPath(location.pathname, manageCustomerPaths)) return true;
    return false;
  };

  const isPromotion = () => {
    const managePromotionPaths = [
      constants.routes.vendor.promotionDetail,
      constants.routes.vendor.promotion,
      constants.routes.vendor.addPromotion,
    ];
    if (matchPath(location.pathname, managePromotionPaths)) return true;
    return false;
  };

  const isPromocodes = () => {
    const managePromocodesPaths = [
      constants.routes.vendor.addPromoCode,
      constants.routes.vendor.promoCodes,
    ];
    if (matchPath(location.pathname, managePromocodesPaths)) return true;
    return false;
  };

  const isSupportHelpDesk = () => {
    const manageSupportHelpDeskPaths = [
      constants.routes.vendor.addNewTicket,
      constants.routes.vendor.supportHelpdesk,
      constants.routes.vendor.ticketDetail,
    ];
    if (matchPath(location.pathname, manageSupportHelpDeskPaths)) return true;
    return false;
  };

  const isSalesRep = () => {
    const manageSalesRepPaths = [
      constants.routes.vendor.manageSalesRep,
      constants.routes.vendor.salesRepDetail,
      constants.routes.vendor.inviteSalesRep,
      constants.routes.vendor.editSalesRep,
    ];
    if (matchPath(location.pathname, manageSalesRepPaths)) return true;
    return false;
  };

  return (
    <div className={styles["vendor-sidebar"]}>
      <Nav className={styles["vendor-menu-list"]}>
        <NavItem>
          {" "}
          <NavLink
            to={constants.routes.vendor.dashboard}
            exact
            activeClassName={styles["active"]}
          >
            {t("vendorManagement.dashboard")}
          </NavLink>{" "}
        </NavItem>
        <NavItem>
          {" "}
          <NavLink
            to={constants.routes.vendor.manageOrders}
            exact
            isActive={isManageOrder}
            activeClassName={styles["active"]}
          >
            {t("vendorManagement.manageOrders")}
          </NavLink>{" "}
        </NavItem>
        <NavItem>
          {" "}
          <NavLink
            to={constants.routes.vendor.manageCatalogue}
            exact
            isActive={isCatalogueActive}
            activeClassName={styles["active"]}
          >
            {t("vendorManagement.manageCatalogue")}
          </NavLink>{" "}
        </NavItem>
        <NavItem>
          {" "}
          <NavLink
            to={constants.routes.vendor.manageCustomers}
            exact
            isActive={isManageCustomer}
            activeClassName={styles["active"]}
          >
            {t("vendorManagement.manageCustomers")}
          </NavLink>{" "}
        </NavItem>
        <NavItem>
          {" "}
          <NavLink
            to={constants.routes.vendor.promotion}
            exact
            isActive={isPromotion}
            activeClassName={styles["active"]}
          >
            {t("vendorManagement.promotion")}
          </NavLink>{" "}
        </NavItem>
        <NavItem>
          {" "}
          <NavLink
            to={constants.routes.vendor.promoCodes}
            exact
            isActive={isPromocodes}
            activeClassName={styles["active"]}
          >
            {t("vendorManagement.promoCodes")}
          </NavLink>{" "}
        </NavItem>
        <NavItem>
          {" "}
          <NavLink
            to={constants.routes.vendor.topup}
            exact
            activeClassName={styles["active"]}
          >
            {t("vendorManagement.topUp")}
          </NavLink>{" "}
        </NavItem>
        <NavItem>
          {" "}
          <NavLink
            to={constants.routes.vendor.supportHelpdesk}
            exact
            isActive={isSupportHelpDesk}
            activeClassName={styles["active"]}
          >
            {t("vendorManagement.supportHelpdesk")}
          </NavLink>{" "}
        </NavItem>
        <NavItem>
          {" "}
          <NavLink
            to={constants.routes.vendor.manageSalesRep}
            exact
            isActive={isSalesRep}
            activeClassName={styles["active"]}
          >
            {t("vendorManagement.salesRepresentative")}
          </NavLink>{" "}
        </NavItem>
        <NavItem>
          {" "}
          <NavLink
            to={constants.routes.vendor.manageInvoices}
            exact
            activeClassName={styles["active"]}
          >
            {t("vendorManagement.manageInvoices")}
          </NavLink>{" "}
        </NavItem>
      </Nav>
    </div>
  );
};

export default withTranslation()(VendorSidebar);
