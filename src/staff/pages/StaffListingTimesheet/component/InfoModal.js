import React from "react";
import { withTranslation } from "react-i18next";
import Modal from "reactstrap/lib/Modal";
import ModalBody from "reactstrap/lib/ModalBody";
import Text from "components/Text";

const InfoModal = ({ t, isInfoModalOpen, setIsInfoModalOpen }) => {
  const closeInfoModal = () => setIsInfoModalOpen(false);

  return (
    <Modal
      isOpen={isInfoModalOpen}
      className="modal-dialog-centered  delete-modal info-modal"
      modalClassName="custom-modal"
      toggle={() => setIsInfoModalOpen(false)}
    >
      <span className="close-btn" onClick={() => setIsInfoModalOpen(false)}>
        <img src={require("assets/images/cross.svg").default} alt="close" />
      </span>
      <ModalBody>
        <div className="change-modal-content">
          <div className="modal-custom-title">
            <Text size="25px" marginBottom="10px" weight="500" color="#111b45">
              <span className="modal-title-25">
                {t("staffTimesheet.timesheets")}
              </span>
            </Text>
          </div>
          <Text size="16px" marginBottom="16px" weight="300" color=" #535b5f">
            {t("staffTimesheet.invalidSelectionMsg")}
          </Text>
          <Text size="16px" marginBottom="16px" weight="300" color=" #535b5f">
            {t("staffTimesheet.pleaseNote")}
          </Text>
          <Text size="16px" marginBottom="16px" weight="300" color=" #535b5f">
            {t("staffTimesheet.Note1")}
          </Text>
          <Text size="16px" marginBottom="16px" weight="300" color=" #535b5f">
            {t("staffTimesheet.Note2")}
          </Text>
          <Text size="16px" weight="300" color=" #535b5f">
            {t("staffTimesheet.Note3")}
          </Text>
          <div className="btn-box text-center">
            <button
              className={"button button-round button-border button-dark"}
              title={t("ok")}
              onClick={closeInfoModal}
            >
              {t("ok")}
            </button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default withTranslation()(InfoModal);
