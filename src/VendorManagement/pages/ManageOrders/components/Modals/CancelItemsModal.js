import React from "react";
import { withTranslation } from "react-i18next";
import { Modal } from "reactstrap";
import ModalBody from "reactstrap/lib/ModalBody";
import Text from "components/Text";
import styles from "./../../ManageOrders.module.scss";
import Loader from "components/Loader";

function CancelItemsModal({
  t,
  isCancelItemsModalOpen,
  closeCancelItemsModal,
  itemsToCancel,
  markAsCancelled,
  loading,
}) {
  return (
    <>
      <Modal
        isOpen={isCancelItemsModalOpen}
        toggle={closeCancelItemsModal}
        className={
          "modal-dialog-centered modal-width-660 " +
          styles["cancel-item-modal-dialog"]
        }
        modalClassName="custom-modal"
      >
        {loading && <Loader />}
        <span className="close-btn" onClick={closeCancelItemsModal}>
          <img src={require("assets/images/cross.svg").default} alt="close" />
        </span>

        <ModalBody>
          <div className="modal-custom-title">
            <Text size="25px" marginBottom="10px" weight="500" color="#111b45">
              {t("vendorManagement.cancelTheseItems")}
            </Text>
          </div>
          <Text size="16px" marginBottom="25px" weight="300" color="#535B5F">
            {t("vendorManagement.cancelTheseItemsDesc")}
          </Text>
          <table>
            <thead>
              <tr>
                <th>{t("vendorManagement.itemName")}</th>
                <th>{t("vendorManagement.quantityToCancel")}</th>
              </tr>
            </thead>
            <tbody>
              {itemsToCancel.map((item, idx) => {
                const { productName, selectedQuantity } = item;
                return (
                  <tr key={idx}>
                    <td>{productName}</td>
                    <td>{selectedQuantity}x</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <Text size="16px" marginBottom="35px" weight="300" color="#535B5F">
            {t("vendorManagement.cancelTheseItemsDesc2")}
          </Text>
          <button
            onClick={markAsCancelled}
            className="button button-round button-shadow mr-md-4 w-sm-100"
            title={t("vendorManagement.cancelItems")}
          >
            {t("vendorManagement.cancelItems")}
          </button>
          <button
            className={
              "button button-round button-border button-dark btn-mobile-link " +
              styles["go-back"]
            }
            onClick={closeCancelItemsModal}
            title={t("accountOwner.goBack")}
          >
            {t("accountOwner.goBack")}
          </button>
        </ModalBody>
      </Modal>
    </>
  );
}

export default withTranslation()(CancelItemsModal);
