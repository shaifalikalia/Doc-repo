import React, { Fragment, useState, useEffect } from "react";
import VendorSidebar from "./VendorSidebar";
import styles from "./components.module.scss";
import HeaderVendor from "./HeaderVendor";
import AdminAccept from "./Modals/AdminAccept";
import { useSelector } from "react-redux";

const LayoutVendor = ({ children }) => {
  const [isVendorSidebarOpen, setIsVendorSidebarOpen] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const profile = useSelector((e) => e.userProfile.profile);
  const toggleVendorMenu = () => {
    setIsVendorSidebarOpen(!isVendorSidebarOpen);
  };

  useEffect(() => {
    if (profile) {
      setIsOpen(profile?.isApproved === false ? true : false);
    }
  }, [profile]);

  return (
    <Fragment>
      <HeaderVendor toggleVendorMenu={toggleVendorMenu} />
      <AdminAccept isOpen={isOpen} handleClose={() => setIsOpen(false)} />
      <div
        className={`vendor-layout ${styles["vendor-layout-wrapper"]}  ${
          isVendorSidebarOpen ? styles["active-sidebar"] : ""
        }`}
      >
        <VendorSidebar />
        <div className={styles["vm-page-content"]}>{children}</div>
      </div>
    </Fragment>
  );
};

export default LayoutVendor;
