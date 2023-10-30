import React, { Fragment } from "react";
import Text from "components/Text";
import styles from "./../../ManageCatalogue.module.scss";
import { withTranslation } from "react-i18next";

const DiscountsTab = ({ t, product, handleEditClick }) => {
  const { normalCustomerDiscount, vipCustomerDiscount } = product;

  return (
    <Fragment>
      <div className="d-flex justify-content-between mb-3">
        <Text
          size="20px"
          marginBottom="0px"
          weight="500"
          className="mr-2"
          color=" #111B45"
        >
          {t("vendorManagement.customersDiscount")}
        </Text>
        <div
          onClick={(e) => handleEditClick(e, "discount")}
          className="pointer"
        >
          {" "}
          <img
            title={t("edit")}
            src={require("assets/images/edit-icon.svg").default}
            alt="edit"
          />
        </div>
      </div>
      <div className={styles["tab-table-list"]}>
        <table class="table custom-table">
          <thead>
            <tr>
              <th>{t("vendorManagement.customersCategory")}</th>
              <th>{t("vendorManagement.discountAllowed")}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{t("vendorManagement.vipCustomers")}</td>
              <td>{vipCustomerDiscount}%</td>
            </tr>
            <tr>
              <td>{t("vendorManagement.normalCustomers")}</td>
              <td>{normalCustomerDiscount}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Fragment>
  );
};

export default withTranslation()(DiscountsTab);
