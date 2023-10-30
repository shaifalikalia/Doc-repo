import React from "react";
import { withTranslation } from "react-i18next";
import "rc-time-picker/assets/index.css";
import Text from "components/Text";
import { Modal, ModalBody } from "reactstrap";
import "./../../../FamilyMembers/familyMembers.scss";
import crossIcon from "../../../../../assets/images/cross.svg";

const FamilyModal = ({
  t,
  isFamilyModalOpen,
  setIsFamilyModalOpen,
  title,
  subTitle1,
  subTitle2,
  leftBtnText,
  rightBtnText,
  onConfirm,
}) => {
  const closeFamilyModal = () => setIsFamilyModalOpen(false);

  return (
    <Modal
      isOpen={isFamilyModalOpen}
      toggle={closeFamilyModal}
      className="modal-dialog-centered delete-family-modal"
      modalClassName="custom-modal"
    >
      <span className="close-btn" onClick={closeFamilyModal}>
        <img src={crossIcon} alt="close" />
      </span>
      <ModalBody>
        <Text size="25px" marginBottom="4px" weight="500" color="#111b45">
          <span className="modal-title-25">{title}</span>
        </Text>
        <Text size="16px" weight="300" color=" #535b5f">
          {subTitle1}
        </Text>
        {subTitle2 && (
          <Text size="16px" marginBottom="40px" weight="300" color=" #535b5f">
            {subTitle2}
          </Text>
        )}

        <div className="d-md-flex btn-box">
          <button
            className="button button-round button-shadow  w-sm-100 mr-md-2"
            title={leftBtnText}
            onClick={onConfirm}
          >
            {leftBtnText}
          </button>
          <button
            className="button button-round button-border btn-mobile-link button-dark "
            title={rightBtnText}
            onClick={closeFamilyModal}
          >
            {rightBtnText}
          </button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default withTranslation()(FamilyModal);
