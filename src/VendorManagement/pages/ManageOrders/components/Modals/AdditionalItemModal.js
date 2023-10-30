import React, { useState, useEffect } from "react";
import { withTranslation } from "react-i18next";
import { Modal } from "reactstrap";
import ModalBody from "reactstrap/lib/ModalBody";
import Text from "components/Text";
import styles from "./../../ManageOrders.module.scss";
import {
  useToGetNewShipmentList,
  addNewShipment,
} from "repositories/vendor-repository";
import useHandleApiError from "hooks/useHandleApiError";
import { uniqBy, cloneDeep } from "lodash";
import InfiniteScroll from "react-infinite-scroll-component";
import { toast } from "react-hot-toast";
import Loader from "components/Loader";

function AdditionalItemModal({
  t,
  isAdditionalItemModalOpen,
  setIsAdditionalItemModalOpen,
  details,
}) {
  let pageSize = 4;
  const [pageNumber, setPageNumber] = useState(1);
  const [orderList, setOrderList] = useState([]);
  const [isLoader, setIsLoader] = useState(false);

  let errorMsg = t("form.errors.emptyField", { field: t("Details") });
  const [value, setValue] = useState("");
  const [errorInput, setErrorInput] = useState("");
  const { data, isLoading, isFetching, error } = useToGetNewShipmentList(
    pageSize,
    pageNumber,
    details.orderId
  );
  useHandleApiError(isLoading, isFetching, error);
  const topUpHasMore = data?.pagination?.totalItems > orderList?.length;
  const topUpLength = orderList?.length;
  const MinQuanity = 1;

  useEffect(() => {
    if (Array.isArray(data?.data) && data?.data?.length) {
      setOrderList((prev) =>
        uniqBy([...prev, ...updateArrayOfProducts(data?.data)], "id")
      );
    }
  }, [data?.data]);

  const updateArrayOfProducts = (array) => {
    return cloneDeep(array)?.map((item) => {
      item.isChecked = false;
      item.value = item.quantityShipped;
      item.isSelectAll = false;
      return item;
    });
  };

  const hasNextTopUp = () => {
    setPageNumber((prev) => prev + 1);
  };

  const handleCart = (type, item) => {
    const { id, quantityShipped } = item;
    let cacheValue = item.value;

    if (type === "ADD" && !(type === "ADD" && cacheValue < quantityShipped)) {
      toast.error(t("vendorManagement.maxOrderError"));
    }

    if (type === "MIN" && cacheValue <= MinQuanity) {
      toast.error(t("vendorManagement.minOrderError"));
    }

    if (type === "ADD" && cacheValue < quantityShipped) {
      setOrderList((prevProps) =>
        prevProps.map((detail) => {
          if (detail.id === id) {
            detail.value = detail.value + 1;
            if (detail.value !== quantityShipped) {
              detail.isSelectAll = false;
            }
            if (detail.value === quantityShipped) {
              detail.isSelectAll = true;
            }
          }
          return detail;
        })
      );
    }

    if (type === "MIN" && cacheValue > MinQuanity) {
      setOrderList((prevProps) =>
        prevProps.map((detail) => {
          if (detail.id === id) {
            detail.value = detail.value - 1;
            if (detail.value !== quantityShipped) {
              detail.isSelectAll = false;
            }
            if (detail.value === quantityShipped) {
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
      setOrderList((prevProps) =>
        prevProps.map((detail) => {
          if (detail.id === item.id) {
            detail.isChecked = event.target.checked;
            detail.isSelectAll = true;
          }
          return detail;
        })
      );

    !checked &&
      setOrderList((prevProps) =>
        prevProps.map((detail) => {
          if (detail.id === item.id) {
            detail.isChecked = event.target.checked;
            detail.isSelectAll = false;
            detail.value = detail.quantityShipped;
          }
          return detail;
        })
      );
  };

  const isSelectAll = (event, item, prevValue) => {
    prevValue &&
      setOrderList((prevProps) =>
        prevProps.map((detail) => {
          if (detail.id === item.id) {
            detail.isSelectAll = true;
            detail.value = detail.quantityShipped;
          }
          return detail;
        })
      );

    !prevValue &&
      setOrderList((prevProps) =>
        prevProps.map((detail) => {
          if (detail.id === item.id) {
            detail.isSelectAll = false;
            detail.value = detail.quantityShipped;
          }
          return detail;
        })
      );
  };

  const handleChange = (event) => {
    let inputValue = event.target.value;
    setValue(inputValue);
    if (!inputValue?.trim()?.length) {
      setErrorInput(errorMsg);
    } else {
      setErrorInput("");
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoader(true);
      if (
        value?.trim()?.length &&
        orderList.find((item) => item.isChecked === true)
      ) {
        let params = {
          VendorOrderId: details.orderId,
          TrackingDetail: value.trim(),
          VendorOrderProductDetails: orderList
            .filter((item) => item.isChecked)
            .map((item) => {
              return {
                Id: item.id,
                QuantityShipped: item.value,
              };
            }),
        };
        let res = await addNewShipment(params);
        toast.success(res.message);
        setIsAdditionalItemModalOpen(false);
      }
    } catch (err) {
      toast.error(err.message);
    }
    setIsLoader(true);
  };

  let btnDisabled =
    value?.trim()?.length && orderList.find((item) => item.isChecked === true);

  return (
    <>
      <Modal
        isOpen={isAdditionalItemModalOpen}
        toggle={() => setIsAdditionalItemModalOpen(false)}
        className={
          "modal-dialog-centered modal-width-660 additional-item-dialog " +
          styles["accept-item-modal-dialog"] +
          " " +
          styles["additional-item-modal-dialog"]
        }
        modalClassName="custom-modal"
      >
        <span
          className="close-btn"
          onClick={() => setIsAdditionalItemModalOpen(false)}
        >
          <img src={require("assets/images/cross.svg").default} alt="close" />
        </span>

        <ModalBody>
          {(isLoader || isLoading) && <Loader />}
          <Text size="25px" marginBottom="10px" weight="500" color="#111b45">
            {t("vendorManagement.selectAdditionalItemsToShip")}
          </Text>
          <InfiniteScroll
            dataLength={topUpLength}
            hasMore={topUpHasMore}
            next={hasNextTopUp}
            scrollableTarget={"accept-order-list"}
          >
            <ul
              className={
                styles["accept-order-list"] +
                " " +
                styles["accept-order-list-fixed-height"]
              }
              id="accept-order-list"
            >
              <li className={styles["head-li"]}>
                <div class={styles["checkbox-col"]}>
                  <div>{t("vendorManagement.itemName")}</div>
                  <div className={styles["qty-shipped"]}>
                    {t("vendorManagement.qtyShipped")}
                  </div>
                </div>
              </li>
              {!!orderList.length &&
                orderList.map((item, index) => (
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
                      <span> {item.quantityShipped} </span>
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
                            !item?.isChecked ||
                            item.totalQuantity === MinQuanity
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
          </InfiniteScroll>

          <div className="yellow-alert-box-font14 alert-box">
            {t("vendorManagement.alertShipping")}
          </div>

          <div className="add-title mt-2">
            <div className="c-field">
              <label>{t("vendorManagement.addDetails")}</label>

              <textarea
                className="c-form-control"
                Title={t("vendorManagement.addDetails")}
                value={value}
                onChange={handleChange}
                Placeholder={t("vendorManagement.detailPlaceholder")}
                maxLength={400}
              ></textarea>
            </div>
          </div>
          {errorInput && <span className="error-msg">{errorInput}</span>}

          <button
            className="button button-round button-shadow mr-md-4 w-sm-100"
            disabled={!btnDisabled}
            title={t("confirm")}
            onClick={handleSubmit}
          >
            {t("confirm")}
          </button>
          <button
            className="button button-round button-border button-dark btn-mobile-link"
            onClick={() => setIsAdditionalItemModalOpen(false)}
            title={t("cancel")}
          >
            {t("cancel")}
          </button>
        </ModalBody>
      </Modal>
    </>
  );
}

export default withTranslation()(AdditionalItemModal);
