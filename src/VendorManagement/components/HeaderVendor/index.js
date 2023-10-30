import React from "react";
import { Link } from "react-router-dom";
import styles from "./HeaderVendor.module.scss";
import VendorDropdown from "./VendorDropdown";

const HeaderVendor = ({ toggleVendorMenu, simple }) => {
  return (
    <header className={styles["header-vendor"]}>
      <div className="container-fluid">
        <div className="row no-gutters align-items-center">
          <div className="col-md-7 col-9">
            {!simple && (
              <span
                className={styles["vendor-menu-icon"]}
                onClick={toggleVendorMenu}
              >
                <img
                  src={require("assets/images/hamberger-menu.svg").default}
                  alt="icon"
                />
              </span>
            )}
            <Link to="/">
              <img
                alt=""
                className={styles.logo + " " + "logo"}
                src={require("assets/images/home-logo.svg").default}
              />
            </Link>
          </div>
          <div className="col-md-5 col-3 text-right header-right">
            <VendorDropdown simple={simple} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderVendor;
