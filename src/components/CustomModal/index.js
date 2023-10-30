import React from "react";
import { withTranslation } from "react-i18next";
import { Modal } from "reactstrap";
import ModalBody from "reactstrap/lib/ModalBody";
import crossIcon from "../../assets/images/cross.svg";
import Text from "components/Text";
import styles from "./CustomModal.module.scss";
import Loader from "components/Loader";

/**
 *
 * @param {{
 *isOpen: Boolean,
 *setIsOpen: Function,
 *onConfirm: Function,
 *onBeforeClose: Function | f => f,
 *title: String,
 *subTitle1: String,
 *subTitle2: String | '',
 *leftBtnText: String | '',
 *rightBtnText: String | '',
 *calender: Boolean | false,
 *actionInProgress: Boolean | false
 *}} props
 * @returns
 */
function CompleteAppointmentModal(props) {
  const {
    isOpen,
    setIsOpen,
    onConfirm,
    onBeforeClose = (f) => f,
    title,
    subTitle1,
    subTitle2 = "",
    leftBtnText = "",
    rightBtnText = "",
    calender = false,
    actionInProgress = false,
  } = props;
  const closeModal = () => {
    onBeforeClose();
    setIsOpen(false);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        toggle={closeModal}
        className={"modal-dialog-centered " + styles["custom-modal-dialog"]}
        modalClassName="custom-modal"
      >
        {actionInProgress && <Loader />}
        <span className="close-btn" onClick={closeModal}>
          <img src={crossIcon} alt="close" />
        </span>

        <ModalBody
          className={calender ? styles["calender-modal"] : "text-center"}
        >
          <Text size="25px" marginBottom="10px" weight="500" color="#111b45">
            {title}
          </Text>
          {!calender ? (
            <Text
              size="16px"
              weight="300"
              color="#535b5f"
              marginBottom={!subTitle2 ? "40px" : ""}
            >
              {subTitle1}
            </Text>
          ) : (
            subTitle1
          )}
          {!!subTitle2 && (
            <Text size="16px" marginBottom="40px" weight="300" color="#535b5f">
              {subTitle2}
            </Text>
          )}
          {!!leftBtnText && (
            <button
              className="button button-round button-shadow mr-md-4 mb-3 w-sm-100"
              onClick={onConfirm}
              title={leftBtnText}
            >
              {leftBtnText}
            </button>
          )}
          {!!rightBtnText && (
            <button
              className="button button-round button-border button-dark btn-mobile-link"
              onClick={closeModal}
              title={rightBtnText}
            >
              {rightBtnText}
            </button>
          )}
        </ModalBody>
      </Modal>
    </>
  );
}

export default withTranslation()(CompleteAppointmentModal);
