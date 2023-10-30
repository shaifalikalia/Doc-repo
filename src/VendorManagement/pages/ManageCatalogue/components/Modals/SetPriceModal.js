import React from "react";
import { withTranslation } from "react-i18next";
import "rc-time-picker/assets/index.css";
import { Col, Modal, Row } from "reactstrap";
import ModalBody from "reactstrap/lib/ModalBody";
import Text from "components/Text";
import Input from "components/Input";
import styles from "./AddNewItemModals.module.scss";

function SetPriceModal({ t, hookData }) {
  const { state, methods } = hookData;
  const { priceDetails } = state.inputData;

  return (
    <>
      <Modal
        id="location-prices-modal"
        isOpen={state.isSetPriceModalOpen}
        toggle={methods.closeAndResetPriceModal}
        className={
          "modal-dialog-centered modal-width-660 modal-content-padding-small "
        }
        modalClassName="custom-modal"
      >
        <span className="close-btn" onClick={methods.closeAndResetPriceModal}>
          <img src={require("assets/images/cross.svg").default} alt="close" />
        </span>

        <ModalBody>
          <div className="modal-custom-title">
            <Text size="25px" marginBottom="25px" weight="500" color="#111b45">
              {t("vendorManagement.setPrice")}
            </Text>
          </div>
          {priceDetails.samePriceForAll && (
            <Input
              MaxLength={7}
              Title={t("vendorManagement.unitPrice")}
              Type="text"
              Name={"unitPrice"}
              Placeholder={t("form.placeholder1", {
                field: t("vendorManagement.unitPrice"),
              })}
              Value={priceDetails.unitPrice || ""}
              Error={priceDetails.error}
              HandleChange={methods.handleUnitPrice}
            />
          )}
          <div className="ch-radio mb-4 -mt-2">
            <label className="mr-5">
              <input
                type="radio"
                name="setPrice"
                checked={priceDetails.samePriceForAll}
                onChange={() => methods.handleSamePriceForAll(true)}
              />
              <span> {t("vendorManagement.samePriceForAll")} </span>
            </label>

            <label>
              <input
                type="radio"
                name="setPrice"
                checked={!priceDetails.samePriceForAll}
                onChange={() => methods.handleSamePriceForAll(false)}
              />
              <span>
                {t("vendorManagement.setDifferentPriceForEachLocation")}
              </span>
            </label>
          </div>
          {!priceDetails.samePriceForAll && (
            <div className={styles["set-price-list"]}>
              {priceDetails.locationPrices.map((location, index) => {
                const { id, name, error, unitPrice } = location;
                return (
                  <Row className="align-items-center" key={id}>
                    <Col sm="5">
                      <div className={styles["title"]}>
                        <Text
                          size="14px"
                          marginBottom="25px"
                          weight="600"
                          color="#102C42"
                        >
                          {name}
                        </Text>
                      </div>
                    </Col>
                    <Col sm="7">
                      <Input
                        MaxLength={7}
                        HandleChange={(e) =>
                          methods.handleUnitPriceForLocation(e, index)
                        }
                        Error={error}
                        Title={t("vendorManagement.setPrice")}
                        Type="text"
                        Value={unitPrice || ""}
                        Placeholder={t("form.placeholder1", {
                          field: t("vendorManagement.unitPrice"),
                        })}
                      />
                    </Col>
                  </Row>
                );
              })}
            </div>
          )}
          <button
            className="button button-round button-shadow mr-md-4 mb-3 w-sm-100"
            title={t("save")}
            onClick={methods.handleSavePrices}
          >
            {t("save")}
          </button>
          <button
            className="button button-round button-border button-dark mb-md-3 btn-mobile-link"
            onClick={methods.closeAndResetPriceModal}
            title={t("cancel")}
          >
            {t("cancel")}
          </button>
        </ModalBody>
      </Modal>
    </>
  );
}

export default withTranslation()(SetPriceModal);
