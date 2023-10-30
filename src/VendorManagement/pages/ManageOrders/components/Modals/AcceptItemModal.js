import React from "react";
import { withTranslation } from "react-i18next";
import { Modal } from "reactstrap";
import ModalBody from "reactstrap/lib/ModalBody";
import Text from "components/Text";
import styles from "./../../ManageOrders.module.scss";
import { toast } from "react-hot-toast";
import constants from "../../../../../constants";
import Loader from "components/Loader";

function AcceptItemModal({
  t,
  isAcceptItemModalOpen,
  setIsAcceptItemModalOpen,
  productListing,
  updateProductListing,
  onSubmit,
  isLoading,
}) {
  const MinQuanity = 1;

  const handleCart = (type, item) => {
    const { id, totalQuantity, value } = item;
    if (type === "ADD" && !(type === "ADD" && value < totalQuantity)) {
      toast.error(t("vendorManagement.maxOrderError"));
    }

    if (type === "MIN" && value <= MinQuanity) {
      toast.error(t("vendorManagement.minOrderError"));
    }

    if (type === "ADD" && value < totalQuantity) {
      updateProductListing((prevProps) =>
        prevProps.map((detail) => {
          if (detail.id === id) {
            detail.value = detail.value + 1;
            if (detail.value !== totalQuantity) {
              detail.isSelectAll = false;
            }
            if (detail.value === totalQuantity) {
              detail.isSelectAll = true;
            }
          }
          return detail;
        })
      );
    }

    if (type === "MIN" && value > MinQuanity) {
      updateProductListing((prevProps) =>
        prevProps.map((detail) => {
          if (detail.id === id) {
            detail.value = detail.value - 1;
            if (detail.value !== totalQuantity) {
              detail.isSelectAll = false;
            }
            if (detail.value === totalQuantity) {
              detail.isSelectAll = true;
            }
          }
          return detail;
        })
      );
    }
  };

  const handleChecked = (event, item) => {
    let checked = event.target.checked;
    checked &&
      updateProductListing((prevProps) =>
        prevProps.map((detail) => {
          if (detail.id === item.id) {
            detail.isChecked = event.target.checked;
            detail.isSelectAll = true;
          }
          return detail;
        })
      );

    !checked &&
      updateProductListing((prevProps) =>
        prevProps.map((detail) => {
          if (detail.id === item.id) {
            detail.isChecked = event.target.checked;
            detail.isSelectAll = false;
            detail.value = detail.totalQuantity;
          }
          return detail;
        })
      );
  };

  const isSelectAll = (event, item, value) => {
    value &&
      updateProductListing((prevProps) =>
        prevProps.map((detail) => {
          if (detail.id === item.id) {
            detail.isSelectAll = true;
            detail.value = detail.totalQuantity;
          }
          return detail;
        })
      );

    !value &&
      updateProductListing((prevProps) =>
        prevProps.map((detail) => {
          if (detail.id === item.id) {
            detail.isSelectAll = false;
            detail.value = detail.totalQuantity;
          }
          return detail;
        })
      );
  };

  const submit = () => {
    let modifiedArray = productListing?.map((item) => {
      return {
        Id: item?.id,
        QuantityAccepted: item.isChecked ? item?.value : 0,
        isChecked: item?.isChecked,
      };
    });

    let atLeastOneAccepted = modifiedArray?.find(
      (item) => item?.isChecked === true && item?.QuantityAccepted > 0
    );
    if (!atLeastOneAccepted) {
      toast.error(t("vendorManagement.errors.selectOneItems"));
    } else {
      onSubmit(constants.orderDetails.AcceptPartially, modifiedArray);
    }
  };

  return (
    <>
      <Modal
        isOpen={isAcceptItemModalOpen}
        toggle={() => setIsAcceptItemModalOpen(false)}
        className={
          "modal-dialog-centered modal-width-660 " +
          styles["accept-item-modal-dialog"]
        }
        modalClassName="custom-modal"
      >
        <span
          className="close-btn"
          onClick={() => setIsAcceptItemModalOpen(false)}
        >
          <img src={require("assets/images/cross.svg").default} alt="close" />
        </span>

        <ModalBody>
          {isLoading && <Loader />}
          <Text size="25px" marginBottom="10px" weight="500" color="#111b45">
            {t("vendorManagement.selectItemsYouWantToAccept")}
          </Text>
          <Text size="16px" marginBottom="15px" weight="400" color="#535B5F">
            {t("vendorManagement.selectItemsYouWantToAcceptDesc")}
          </Text>
          <Text size="11px" marginBottom="25px" weight="400" color="#87928D">
            <strong>Note: </strong>{" "}
            {t("vendorManagement.selectItemsYouWantToAccepNote")}
          </Text>
          <ul className={styles["accept-order-list"]}>
            {productListing?.length > 0 &&
              productListing.map((item, index) => (
                <li key={index}>
                  <div class={styles["checkbox-col"]}>
                    <div className="ch-checkbox">
                      <label>
                        <input
                          type="checkbox"
                          onChange={(e) => handleChecked(e, item)}
                        />
                        <span className={styles["label-text"]}>
                          {item?.vendorCatalogue?.productName}{" "}
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className={"ch-radio " + styles["ch-radio"]}>
                    <label>
                      <input
                        type="radio"
                        disabled={!item?.isChecked}
                        name={`selectQty${index}`}
                        checked={item?.isChecked && item?.isSelectAll}
                        onChange={(e) => isSelectAll(e, item, true)}
                      />
                      <span> {t("vendorManagement.selectAll")} </span>
                    </label>
                    <label>
                      <input
                        type="radio"
                        name={`selectQty${index}`}
                        disabled={
                          !item?.isChecked || item.totalQuantity === MinQuanity
                        }
                        checked={!item?.isSelectAll && item?.isChecked}
                        onChange={(e) => isSelectAll(e, item, false)}
                      />
                      <span> {t("vendorManagement.selectQty")}</span>
                    </label>
                  </div>
                  <div className={styles["input-number"]}>
                    <button
                      className={styles["img-box"]}
                      onClick={() => handleCart("MIN", item)}
                      disabled={!item?.isChecked}
                    >
                      {" "}
                      -{" "}
                    </button>
                    <span>{item?.value}</span>
                    <button
                      className={styles["img-box"]}
                      onClick={() => handleCart("ADD", item)}
                      disabled={!item?.isChecked}
                    >
                      +{" "}
                    </button>
                  </div>
                </li>
              ))}
          </ul>
          <button
            className="button button-round button-shadow mr-md-4 w-sm-100"
            title={t("accept")}
            onClick={submit}
          >
            {t("accept")}
          </button>
          <button
            className="button button-round button-border button-dark btn-mobile-link"
            onClick={() => setIsAcceptItemModalOpen(false)}
            title={t("cancel")}
          >
            {t("cancel")}
          </button>
        </ModalBody>
      </Modal>
    </>
  );
}

export default withTranslation()(AcceptItemModal);
