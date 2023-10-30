import React, { Fragment, useMemo } from "react";
import Text from "components/Text";
import styles from "./../../ManageCatalogue.module.scss";
import { withTranslation } from "react-i18next";

const LocationDeliveryTab = ({ t, product, handleEditClick }) => {
  const tableBody = useMemo(() => {
    const { catalogueDeliveryTimeForState = [] } = product;
    return catalogueDeliveryTimeForState.map((location) => {
      const { stateId, state, fromDays, toDays } = location;
      return (
        <tr key={stateId}>
          <td>{state?.name}</td>
          <td>{t("vendorManagement.deliveryDays", { fromDays, toDays })}</td>
        </tr>
      );
    });
  }, [product]);

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
          {t("vendorManagement.locationDeliveryTime")}
        </Text>
        <div
          onClick={(e) => handleEditClick(e, "location")}
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
              <th>{t("vendorManagement.location")}</th>
              <th>{t("vendorManagement.deliveryTime")}</th>
            </tr>
          </thead>
          <tbody>{tableBody}</tbody>
        </table>
      </div>
    </Fragment>
  );
};

export default withTranslation()(LocationDeliveryTab);
