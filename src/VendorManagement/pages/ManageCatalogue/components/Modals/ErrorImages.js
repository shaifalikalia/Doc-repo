import React from "react";
import { withTranslation } from "react-i18next";
import "rc-time-picker/assets/index.css";
import { Modal } from "reactstrap";
import ModalBody from "reactstrap/lib/ModalBody";
import Text from "components/Text";
import "./../../ManageCatalogue.scss";
function ErrorImages({ t, closeModel, details }) {
  return (
    <>
      <Modal
        id="upload-error-modal"
        isOpen={true}
        toggle={closeModel}
        className={
          "modal-dialog-centered modal-width-660 modal-content-padding-small "
        }
        modalClassName="custom-modal"
      >
        <span className="close-btn" onClick={closeModel}>
          <img src={require("assets/images/cross.svg").default} alt="close" />
        </span>

        <ModalBody>
          <div className="modal-custom-title">
            <Text size="25px" marginBottom="40px" weight="500" color="#111B45">
              <span className="modal-title-25">
                {t("vendorManagement.uploadError")}
              </span>
            </Text>
          </div>

          <ul class="list-group">
            {details.map((item, index) => (
              <li class="list-group-item" key={index}>
                <img
                  src={require("assets/images/error.svg").default}
                  alt="icon"
                />{" "}
                {item?.fileName}{" "}
              </li>
            ))}
          </ul>
          <div className="text-center">
            <button
              className="button button-round button-border btn-mobile-link button-dark"
              onClick={closeModel}
              title={t("close")}
            >
              {t("close")}
            </button>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}

export default withTranslation()(ErrorImages);
