import React from "react";
import { withTranslation } from "react-i18next";
import "rc-time-picker/assets/index.css";
import { Modal } from "reactstrap";
import ModalBody from "reactstrap/lib/ModalBody";
import "./DialerModel.scss";

const DialerModal = ({
  t,
  setIsSaveDialerModalOpen,
  issaveDialerModalOpen,
}) => {
  return (
    <Modal
      isOpen={issaveDialerModalOpen}
      toggle={() => setIsSaveDialerModalOpen(false)}
      className={["dialer-modal-dialog"]}
      modalClassName="custom-modal"
    >
      <ModalBody>
        <h5>Open Dialer?</h5>
        <p>https://miraxis.com wants to open this application</p>
        <div className="ch-checkbox c-field all-event-checkbox">
          <label>
            <input type="checkbox" />
            <span>
              Always allow miraxis.com to open links of this type in the
              associated app
            </span>
          </label>
        </div>
        <div className="btn-box">
          <button onClick={() => setIsSaveDialerModalOpen(false)}>
            {t("cancel")}
          </button>
          <button>Open Dialer</button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default withTranslation()(DialerModal);
