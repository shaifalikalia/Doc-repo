import React, { Fragment, useState } from "react";
import { Col, Row } from "reactstrap";
import styles from "./../ManageOrders.module.scss";
import { withTranslation } from "react-i18next";
import AcceptItemModal from "./Modals/AcceptItemModal";

const AcceptOrderCard = ({
  t,
  openModel,
  productListing,
  updateProductListing,
  onSubmit,
  isLoading,
}) => {
  const [isAcceptItemModalOpen, setIsAcceptItemModalOpen] = useState(false);

  return (
    <Fragment>
      <div className={styles["accept-order-card"]}>
        <div className={styles["accept-heading"]}>
          {t("vendorManagement.doYouWantToAcceptThisOrder")}
        </div>
        <Row>
          <Col sm="6">
            <button
              className="button w-100 button-round button-shadow mb-3"
              title={t("vendorManagement.acceptAll")}
              onClick={() => openModel({ isAccept: true })}
            >
              {t("vendorManagement.acceptAll")}
            </button>
          </Col>
          <Col sm="6">
            <button
              onClick={() => {
                setIsAcceptItemModalOpen(true);
              }}
              className="button w-100 button-round  button-dark mb-3 button-border"
              title={t("vendorManagement.acceptPartially")}
            >
              {t("vendorManagement.acceptPartially")}
            </button>
          </Col>
        </Row>
        <div>
          <span
            className="link-btn"
            onClick={() => {
              openModel({ isDecline: true });
            }}
          >
            {" "}
            {t("vendorManagement.declineAll")}
          </span>
        </div>
      </div>
      {isAcceptItemModalOpen && (
        <AcceptItemModal
          isAcceptItemModalOpen={isAcceptItemModalOpen}
          setIsAcceptItemModalOpen={setIsAcceptItemModalOpen}
          productListing={productListing}
          updateProductListing={updateProductListing}
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
      )}
    </Fragment>
  );
};
export default withTranslation()(AcceptOrderCard);
