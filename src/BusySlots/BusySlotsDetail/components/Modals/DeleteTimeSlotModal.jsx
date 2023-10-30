import React from "react";
import { withTranslation } from "react-i18next";
import "rc-time-picker/assets/index.css";
import { Modal } from "reactstrap";
import ModalBody from "reactstrap/lib/ModalBody";
import crossIcon from "../../../../assets/images/cross.svg";
import Text from "components/Text";
import styles from "../../BusyTineslotsDetail.module.scss";

function DeleteTimeSlotModal({
  t,
  isDeleteTimeSlotModalOpen,
  setIsDeleteTimeSlotModalOpen,
  deleteSlot,
}) {
  return (
    <>
      <Modal
        isOpen={isDeleteTimeSlotModalOpen}
        toggle={() => setIsDeleteTimeSlotModalOpen(false)}
        className={
          "modal-dialog-centered " + styles["delete-timeslot-modal-dialog"]
        }
        modalClassName="custom-modal"
      >
        <span
          className="close-btn"
          onClick={() => setIsDeleteTimeSlotModalOpen(false)}
        >
          <img src={crossIcon} alt="close" />
        </span>

        <ModalBody className="text-center">
          <Text size="25px" marginBottom="10px" weight="500" color="#111b45">
            <span className="modal-title-25">
              {" "}
              {t("accountOwner.deleteBusyTimeslot")}
            </span>{" "}
          </Text>
          <Text size="16px" marginBottom="40px" weight="300" color="#535b5f">
            {t("accountOwner.areYouSureYouWantToDeleteBusyTimeslot")}
          </Text>

          <button
            className="button button-round button-shadow mr-md-4 mb-3 w-sm-100"
            title={t("YesDelete")}
            onClick={() => deleteSlot()}
          >
            {t("YesDelete")}
          </button>
          <button
            className="button button-round button-border button-dark btn-mobile-link"
            onClick={() => setIsDeleteTimeSlotModalOpen(false)}
            title={t("cancel")}
          >
            {t("cancel")}
          </button>
        </ModalBody>
      </Modal>
    </>
  );
}

export default withTranslation()(DeleteTimeSlotModal);
