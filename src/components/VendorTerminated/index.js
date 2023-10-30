import React from "react";
import { withTranslation } from "react-i18next";
import { Modal, ModalBody } from "reactstrap";
import Text from "components/Text";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

const VendorTerminated = ({ isOpen, content, closeModal, t }) => {
  return (
    <Modal
      isOpen={isOpen}
      toggle={closeModal}
      className="modal-dialog-centered modal-md status-modal  modal-width-660 text-center"
      modalClassName="custom-modal"
    >
      <span className="close-btn" onClick={closeModal}>
        <img src={require("assets/images/cross.svg").default} alt="close" />
      </span>
      <ModalBody>
        <Text size="25px" weight="500" color="#111b45">
          <span className="modal-title-25 text-nowrap">
            {t("accountTerminated")}
          </span>
        </Text>

        <Text size="16px" weight="300" color=" #535b5f" className="pawan">
          {t("vendorManagement.vendorAccountDisabled")}
          <u>
            <Link
              to={"/manage-subscription"}
              className="link-btn-with-out-font"
            >
              {t("navbar.manageSubscription")}
            </Link>
          </u>
        </Text>
      </ModalBody>
    </Modal>
  );
};

export default withTranslation()(VendorTerminated);
