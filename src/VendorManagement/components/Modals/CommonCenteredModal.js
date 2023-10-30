import React from "react";
import { withTranslation } from "react-i18next";
import "rc-time-picker/assets/index.css";
import { Col, Modal, Row } from "reactstrap";
import ModalBody from "reactstrap/lib/ModalBody";
import Text from "components/Text";
import Loader from "components/Loader";
import Input from "components/Input";

function CommonCenteredModal({ t, ...props }) {
  const {
    isOpen,
    handleClose,
    handleConfirm,
    loading,
    inputField = false,
  } = props;
  const { inputValue, handleInputValue, inputError, MaxLength } = props;
  return (
    <>
      <Modal
        isOpen={isOpen}
        toggle={handleClose}
        className={
          "modal-dialog-centered modal-width-660 vendor-delete-office-modal"
        }
        modalClassName="custom-modal"
      >
        <span className="close-btn" onClick={handleClose}>
          <img src={require("assets/images/cross.svg").default} alt="close" />
        </span>
        <ModalBody className={"text-center px-md-4"}>
          <Row>
            {loading && <Loader />}

            <Col md={inputField ? { size: 12 } : { size: 10, offset: 1 }}>
              <Text
                size="25px"
                marginBottom="10px"
                weight="500"
                color="#111b45"
              >
                {props.Title}
              </Text>
              <Text
                size="16px"
                marginBottom="35px"
                weight="300"
                color="#535B5F"
              >
                {props.Desc}
              </Text>

              {inputField && (
                <div className="text-left mt-5">
                  <Input
                    MaxLength={MaxLength}
                    Value={inputValue}
                    HandleChange={handleInputValue}
                    Error={inputError}
                    Title={t("vendorManagement.mentionPaymentMode")}
                    Type="text"
                    Placeholder={t("vendorManagement.modeOfPaymentPlaceholder")}
                  />
                </div>
              )}

              <button
                className="button button-round button-shadow mr-md-3 w-sm-100 md-2"
                title={props.btnText}
                onClick={handleConfirm}
              >
                {props.btnText}
              </button>
              <button
                className="button button-round button-border mb-md-2 button-dark btn-mobile-link"
                onClick={handleClose}
                title={t("cancel")}
              >
                {t("cancel")}
              </button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </>
  );
}

export default withTranslation()(CommonCenteredModal);
