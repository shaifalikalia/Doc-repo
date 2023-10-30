import React from "react";
import { withTranslation } from "react-i18next";
import "rc-time-picker/assets/index.css";
import { Modal } from "reactstrap";
import ModalBody from "reactstrap/lib/ModalBody";
import Text from "components/Text";
import styles from "./../components.module.scss";
import { getFullName } from "Messenger/pages/TeamConversation/utils";
import InfiniteScroll from "react-infinite-scroll-component";
import Loader from "components/Loader";
import Empty from "components/Empty";

function SelectCustomerModal(props) {
  const {
    t,
    isOpen,
    closeModal,
    handleSearchTerm,
    loading,
    selectedCustomers,
    customersList,
    hasMore,
    loadMore,
    isCustomerSelected,
    handleSelectCustomer,
    handleSaveCustomers,
    selectError,
  } = props;
  return (
    <>
      <Modal
        isOpen={isOpen}
        toggle={closeModal}
        className={
          "modal-dialog-centered modal-width-660 " +
          styles["select-customer-modal"]
        }
        modalClassName="custom-modal"
      >
        <span className="close-btn" onClick={closeModal}>
          <img src={require("assets/images/cross.svg").default} alt="close" />
        </span>
        <ModalBody>
          {loading && <Loader />}
          <Text size="25px" marginBottom="5px" weight="500" color="#111b45">
            {t("vendorManagement.selectCustomers")}
          </Text>
          <Text size="16px" marginBottom="25px" weight="300" color="#535B5F">
            {t("vendorManagement.pleaseSelectCustomersYouWantToSendPromoCodes")}
          </Text>
          <div className={"search-box " + styles["select-customer-search"]}>
            <input
              onChange={handleSearchTerm}
              type="text"
              placeholder={t("vendorManagement.promoCodesModule.searchByName")}
            />
            <span className="ico">
              <img
                src={require("assets/images/search-icon.svg").default}
                alt="icon"
              />
            </span>
          </div>
          <Text size="12px" marginBottom="5px" weight="400" color="#6F7788">
            {!!selectError && <span className="error-msg">{selectError}</span>}
            {!!selectedCustomers.length && (
              <>
                {selectedCustomers.length} {t("vendorManagement.selected")}
              </>
            )}
          </Text>
          {!!customersList?.length && (
            <ul
              className={styles["customer-list"]}
              id="promocode-customer-list"
            >
              <InfiniteScroll
                dataLength={customersList.length}
                hasMore={hasMore}
                next={loadMore}
                scrollableTarget="promocode-customer-list"
              >
                {customersList.map((cus) => {
                  const { customer, office, key } = cus;
                  const isSelected = isCustomerSelected(cus);
                  const name = getFullName(customer);
                  return (
                    <li key={key} className={styles["checkbox-wrapper"]}>
                      <div className="ch-checkbox">
                        <label>
                          <input
                            type="checkbox"
                            name="selectcustomer"
                            checked={isSelected}
                            onChange={(e) => handleSelectCustomer(e, cus)}
                          />
                          <span>
                            {name}
                            <Text size="12px" weight="400" color="#87928D">
                              {office.name}
                            </Text>
                          </span>
                        </label>
                      </div>
                    </li>
                  );
                })}
              </InfiniteScroll>
            </ul>
          )}
          {!customersList?.length && (
            <Empty
              Message={t("vendorManagement.promoCodesModule.noDataFound")}
            />
          )}
          <button
            className="button button-round button-shadow mr-md-4 mb-2 w-sm-100"
            onClick={handleSaveCustomers}
            title={t("save")}
          >
            {t("save")}
          </button>
          <button
            className="button button-round button-border button-dark mb-md-2 btn-mobile-link "
            onClick={closeModal}
            title={t("cancel")}
          >
            {t("cancel")}
          </button>
        </ModalBody>
      </Modal>
    </>
  );
}

export default withTranslation()(SelectCustomerModal);
