import React, { useState, useEffect } from "react";
import { withTranslation } from "react-i18next";
import "rc-time-picker/assets/index.css";
import { Modal } from "reactstrap";
import ModalBody from "reactstrap/lib/ModalBody";
import crossIcon from "../../../../assets/images/cross.svg";
import InfiniteScroll from "react-infinite-scroll-component";
import Text from "components/Text";
import styles from "../SupportHelpdesk.module.scss";
import Empty from "components/Empty";

function SelectOrder({
  t,
  closeModelClickOnSaveBtn,
  selectOrder,
  setFormsValues,
  orderList,
  hasMore,
  goToNextPage,
  closeModel,
  isOpen,
  searchText,
  handleSearch,
  showNoRecord,
}) {
  const [selectedOrder, setSelectedOrder] = useState("");
  const [selectVendorId, setSelectVendorId] = useState("");

  useEffect(() => {
    setSelectedOrder(selectOrder);
  }, [selectOrder, isOpen]);

  const onSave = () => {
    setFormsValues((prev) => ({
      ...prev,
      selectOrder: selectedOrder,
      selectVendorId: selectVendorId,
    }));

    closeModel();
  };

  const handleChecked = (val) => {
    setSelectedOrder(val.orderNo);
    setSelectVendorId(val.id);
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={closeModel}
      className={"modal-dialog-centered " + styles["add-employee-modal-dialog"]}
      modalClassName="custom-modal"
    >
      <span className="close-btn" onClick={closeModel}>
        <img src={crossIcon} alt="close" />
      </span>
      <ModalBody>
        <Text size="25px" marginBottom="10px" weight="500" color="#111b45">
          <span className="modal-title-25">
            {" "}
            {t("vendorManagement.assingOrderNumber")}
          </span>
        </Text>
        <div className={"search-box " + styles["search-box"]}>
          <input
            type="text"
            placeholder={t("vendorManagement.searchbyorderNumber")}
            value={searchText}
            onChange={handleSearch}
          />
          <span className="ico">
            <img
              src={require("assets/images/search-icon.svg").default}
              alt="icon"
            />
          </span>
        </div>

        <InfiniteScroll
          dataLength={orderList?.length}
          hasMore={hasMore}
          scrollableTarget={"radio_list"}
          next={goToNextPage}
        >
          <ul
            className={"modal-employee-list " + styles["employee-list"]}
            id={"radio_list"}
          >
            {!!orderList?.length &&
              orderList.map((val, key) => (
                <li key={key} id="radio_list">
                  <div className="ch-radio ">
                    <label>
                      <input
                        type="radio"
                        name="orderNumber"
                        checked={selectedOrder === val.orderNo ? true : false}
                        onChange={(e) => {
                          handleChecked(val);
                        }}
                      />
                      <span className="assign-order-number">{val.orderNo}</span>
                    </label>
                  </div>
                </li>
              ))}
          </ul>
          {showNoRecord && <Empty Message={t("noRecordFound")} />}
        </InfiniteScroll>

        <button
          className="button button-round button-shadow mr-sm-3 mb-3 w-sm-100"
          title={t("save")}
          onClick={onSave}
        >
          {t("save")}
        </button>
        <button
          className="button button-round button-border btn-mobile-link button-dark mb-md-3"
          onClick={closeModel}
          title={t("cancel")}
        >
          {t("cancel")}
        </button>
      </ModalBody>
    </Modal>
  );
}

export default withTranslation()(SelectOrder);
