import React from "react";
import { withTranslation } from "react-i18next";
import "rc-time-picker/assets/index.css";
import { Modal } from "reactstrap";
import ModalBody from "reactstrap/lib/ModalBody";
import Text from "components/Text";
import styles from "./../ManageSaleRep.module.scss";
import InfiniteScroll from "react-infinite-scroll-component";
import Loader from "components/Loader";
import Empty from "components/Empty";

function SelectOfficeModal({ t, hookData }) {
  const { state, methods, otherData } = hookData;
  const { officeList, selectedOfficeIds, assignError, officeSearchTerm } =
    state;
  const { hasMoreOffices, loading } = otherData;
  const {
    isOfficeSelected,
    handleOfficeSelect,
    handleSearchOffice,
    loadMoreOffices,
    assignOffices,
  } = methods;

  return (
    <>
      <Modal
        isOpen={state.officeModal}
        toggle={methods.closeOfficeModal}
        className={
          "modal-dialog-centered modal-width-660 " +
          styles["select-office-modal"]
        }
        modalClassName="custom-modal"
      >
        <span className="close-btn" onClick={methods.closeOfficeModal}>
          <img src={require("assets/images/cross.svg").default} alt="close" />
        </span>
        <ModalBody>
          {loading && <Loader />}
          <Text size="25px" marginBottom="40px" weight="500" color="#111b45">
            {t("vendorManagement.selectOffices")}
          </Text>

          <div className={"search-box " + styles["select-search"]}>
            <input
              value={officeSearchTerm}
              type="text"
              onChange={handleSearchOffice}
              placeholder={t("vendorManagement.searchByOfficeName")}
            />
            <span className="ico">
              <img
                src={require("assets/images/search-icon.svg").default}
                alt="icon"
              />
            </span>
          </div>
          {assignError && <span className="error-msg">{assignError}</span>}
          {!!selectedOfficeIds.length && (
            <Text size="12px" marginBottom="5px" weight="400" color="#6F7788">
              {selectedOfficeIds.length} {t("vendorManagement.selected")}
            </Text>
          )}
          {!!officeList.length && (
            <ul
              className={styles["customer-list"]}
              id="sales-rep-office-list-modal"
            >
              <InfiniteScroll
                dataLength={officeList.length}
                hasMore={hasMoreOffices}
                next={loadMoreOffices}
                scrollableTarget="sales-rep-office-list-modal"
              >
                {officeList.map((office) => {
                  const { name, id } = office;
                  const isSelected = isOfficeSelected(office);
                  return (
                    <li key={id}>
                      <div className="ch-checkbox">
                        <label>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() =>
                              handleOfficeSelect(isSelected, office)
                            }
                          />
                          <span>{name}</span>
                        </label>
                      </div>
                    </li>
                  );
                })}
              </InfiniteScroll>
            </ul>
          )}
          {!officeList.length && (
            <div className={styles["empty-office"]}>
              <Empty Message={t("vendorManagement.noOfficeFound2")} />
            </div>
          )}
          <button
            className="button button-round button-shadow mr-md-3 w-sm-100 md-2"
            title={t("save")}
            onClick={assignOffices}
          >
            {t("save")}
          </button>
          <button
            className="button button-round button-border mb-md-2 btn-mobile-link button-dark "
            onClick={methods.closeOfficeModal}
            title={t("cancel")}
          >
            {t("cancel")}
          </button>
        </ModalBody>
      </Modal>
    </>
  );
}

export default withTranslation()(SelectOfficeModal);
