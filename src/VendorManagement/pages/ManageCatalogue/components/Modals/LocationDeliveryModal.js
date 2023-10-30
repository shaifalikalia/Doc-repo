import React from "react";
import { withTranslation } from "react-i18next";
import { Col, Modal, Row } from "reactstrap";
import ModalBody from "reactstrap/lib/ModalBody";
import Text from "components/Text";
import Input from "components/Input";
import styles from "./AddNewItemModals.module.scss";

function LocationDeliveryModal({ t, hookData }) {
  const { state, methods } = hookData;
  const { deliveryDetails } = state.inputData;

  return (
    <>
      <Modal
        id="location-delivery-modal"
        isOpen={state.isLocationDeliveryModalOpen}
        toggle={methods.closeAndResetDeliveryModal}
        className={
          "modal-dialog-centered modal-width-660 modal-content-padding-small " +
          styles["location-delivery-modal-dialog"]
        }
        modalClassName="custom-modal"
      >
        <span
          className="close-btn"
          onClick={methods.closeAndResetDeliveryModal}
        >
          <img src={require("assets/images/cross.svg").default} alt="close" />
        </span>

        <ModalBody>
          <div className="modal-custom-title">
            <Text size="25px" marginBottom="25px" weight="500" color="#111b45">
              {t("vendorManagement.manageLocationDeliveryTime")}
            </Text>
          </div>
          <div className={styles["set-price-list"]}>
            {deliveryDetails.locations.map((location, index) => {
              const { id, name, selected, from, to, fromError, toError } =
                location;
              return (
                <Row className="align-items-center" key={id}>
                  <Col sm="6">
                    <div className="ch-checkbox">
                      <label className="cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() =>
                            methods.handleSelectDeliveryLocation(
                              !selected,
                              index
                            )
                          }
                        />
                        <span className={styles["label-text"]}> {name} </span>
                      </label>
                    </div>
                  </Col>
                  <Col sm="6">
                    <ul
                      className={`${styles["location-list"]} ${
                        !selected ? styles["disabled-list"] : ""
                      }`}
                    >
                      <li>
                        <Input
                          HandleChange={(e) => methods.handleFromDays(e, index)}
                          MaxLength={3}
                          Value={from || ""}
                          Error={fromError}
                          Title={t("vendorManagement.fromDays")}
                          Type="text"
                          Placeholder={"--"}
                        />
                      </li>
                      <li>
                        <Input
                          HandleChange={(e) => methods.handleToDays(e, index)}
                          MaxLength={3}
                          Value={to || ""}
                          Error={toError}
                          Title={t("vendorManagement.toDays")}
                          Type="text"
                          Placeholder={"--"}
                        />
                      </li>
                    </ul>
                  </Col>
                </Row>
              );
            })}
          </div>
          <button
            className="button button-round button-shadow mr-md-4 mb-3 w-sm-100"
            title={t("save")}
            onClick={methods.handleSaveDeliveryDetails}
          >
            {t("save")}
          </button>
          <button
            className="button button-round button-border button-dark mb-md-3 btn-mobile-link"
            onClick={methods.closeAndResetDeliveryModal}
            title={t("cancel")}
          >
            {t("cancel")}
          </button>
        </ModalBody>
      </Modal>
    </>
  );
}

export default withTranslation()(LocationDeliveryModal);
