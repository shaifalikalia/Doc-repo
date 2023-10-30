import React from "react";
import { withTranslation } from "react-i18next";
import "rc-time-picker/assets/index.css";
import { Modal } from "reactstrap";
import ModalBody from "reactstrap/lib/ModalBody";
import Text from "components/Text";
import InfiniteScroll from "react-infinite-scroll-component";
import Loader from "components/Loader";
import styles from "./AddNewItemModals.module.scss";

function SetTaxPriceModal({ t, hookData }) {
  const { state, methods, otherData } = hookData;
  const { taxDetails } = state.inputData;

  return (
    <>
      <Modal
        isOpen={state.isSetTaxPriceModalOpen}
        toggle={methods.closeAndResetTaxModal}
        className={"modal-dialog-centered modal-width-660 "}
        modalClassName="custom-modal"
      >
        <span className="close-btn" onClick={methods.closeAndResetTaxModal}>
          <img src={require("assets/images/cross.svg").default} alt="close" />
        </span>
        <ModalBody>
          {otherData.loading && <Loader />}
          <Text size="25px" marginBottom="25px" weight="500" color="#111b45">
            {t("vendorManagement.setTaxPrice")}
          </Text>
          <InfiniteScroll
            dataLength={otherData.taxList.length}
            scrollableTarget="taxes-list"
            hasMore={otherData.hasMoreTaxes}
            next={methods.loadMoreTax}
          >
            <div
              id="taxes-list"
              className={"ch-radio  " + styles["set-price-list"]}
            >
              {otherData.taxList.map((tax) => {
                const { id, name, isSameForAllState, vendorTaxForStates } = tax;
                return (
                  <div key={id}>
                    <div className="d-flex justify-content-between">
                      <label className={"d-block " + styles["label-title"]}>
                        <input
                          type="radio"
                          name="setTaxPrice"
                          checked={id === taxDetails.selectedTax?.id}
                          onChange={() => methods.handleTaxSelect(tax)}
                        />
                        <span>{name}</span>
                      </label>

                      {isSameForAllState && (
                        <label className={styles["fw-normal"]}>
                          {" "}
                          {vendorTaxForStates?.[0]?.percentage}%
                        </label>
                      )}
                    </div>

                    {!isSameForAllState && (
                      <div className={styles["filter-list"]}>
                        {vendorTaxForStates?.map((stateTax) => {
                          const {
                            state: province,
                            stateId,
                            percentage,
                          } = stateTax;
                          return (
                            <div
                              key={stateId}
                              className={
                                "d-flex justify-content-between " +
                                styles["sub-label"]
                              }
                            >
                              <label className={"pb-1 " + styles["fw-normal"]}>
                                {province?.name}
                              </label>
                              <label className={"pb-1 " + styles["fw-normal"]}>
                                {percentage}%
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    <hr className="my-2" />
                  </div>
                );
              })}
              {taxDetails.error && (
                <strong className="error-msg">{taxDetails.error}</strong>
              )}
            </div>
          </InfiniteScroll>
          <button
            className="button button-round button-shadow mr-md-4 mb-3 w-sm-100"
            onClick={methods.handleSaveTax}
            title={t("save")}
          >
            {t("save")}
          </button>
          <button
            className="button button-round button-border button-dark mb-md-3 btn-mobile-link"
            onClick={methods.closeAndResetTaxModal}
            title={t("cancel")}
          >
            {t("cancel")}
          </button>
        </ModalBody>
      </Modal>
    </>
  );
}

export default withTranslation()(SetTaxPriceModal);
