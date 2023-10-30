import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import { Modal } from "reactstrap";
import ModalBody from "reactstrap/lib/ModalBody";
import Text from "components/Text";
import crossIcon from "../../../../../assets/images/cross.svg";
import "./../../ManageOrders.scss";

function TraceOrderModel({ t, closeModel, markAsShipped }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  let errorMsg = t("form.errors.emptyField", { field: t("Details") });

  const handleChange = (event) => {
    let inputValue = event.target.value;
    setValue(inputValue);
    if (!inputValue?.trim()?.length) {
      setError(errorMsg);
    } else {
      setError("");
    }
  };

  const handleSubmit = () => {
    if (value?.trim()?.length) {
      markAsShipped(value);
    } else {
      setError(errorMsg);
    }
  };

  return (
    <>
      <Modal
        isOpen={true}
        toggle={closeModel}
        className="modal-dialog-centered modal-width-660 add-shipment-detail"
        modalClassName="custom-modal"
      >
        <span className="close-btn" onClick={closeModel}>
          <img src={crossIcon} alt="close" />
        </span>

        <ModalBody className="text-left">
          <div className="modal-custom-title">
            <Text size="25px" weight="500" color="#111B45">
              <span className="modal-title-25">
                {t("vendorManagement.addShipmentDetails")}
              </span>
            </Text>
          </div>
          <div className="yellow-alert-box-font14 alert-box">
            {t("vendorManagement.alertShipping")}
          </div>

          <div className="add-title">
            <div className="c-field">
              <label>{t("vendorManagement.addDetails")}</label>
              <textarea
                className="c-form-control"
                Title={t("vendorManagement.addDetails")}
                value={value}
                onChange={handleChange}
                Placeholder={t("vendorManagement.detailPlaceholder")}
                maxLength={400}
              ></textarea>{" "}
            </div>
          </div>
          {error && <span className="error-msg">{error}</span>}

          <button
            className="button button-round button-shadow mr-md-4 w-sm-100"
            onClick={handleSubmit}
          >
            {t("vendorManagement.markedAsShipped")}
          </button>
          <button
            className="button button-round button-border button-dark btn-mobile-link"
            onClick={closeModel}
            title={t("cancel")}
          >
            {t("cancel")}
          </button>
        </ModalBody>
      </Modal>
    </>
  );
}

export default withTranslation()(TraceOrderModel);
