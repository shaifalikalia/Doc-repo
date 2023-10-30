import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import "rc-time-picker/assets/index.css";
import "./../StaffListingTimesheet.scss";
import styles from "./../StaffListingTimesheet.module.scss";
import crossIcon from "../../../../assets/images/cross.svg";
import Text from "components/Text";
import { Modal, ModalBody } from "reactstrap";

const RejectionModal = ({
  t,
  isRejectionModalOpen,
  setIsRejectionModalOpen,
  staffMemberName,
  onReject,
  forLeave,
}) => {
  const closeRejectionModal = () => setIsRejectionModalOpen(false);
  const [rejectionReason, setRejectionReason] = useState("");

  return (
    <Modal
      isOpen={isRejectionModalOpen}
      toggle={closeRejectionModal}
      className={
        "modal-dialog-centered  modal-width-660 rejection-modal " +
        styles["rejection-modal"]
      }
      modalClassName="custom-modal"
    >
      <span className="close-btn" onClick={closeRejectionModal}>
        <img src={crossIcon} alt="close" />
      </span>
      <ModalBody>
        <div
          className={
            "modal-custom-title title-location-center mw-100 " +
            styles["modal-custom-title"]
          }
        >
          <Text size="25px" marginBottom="43px" weight="500" color="#111b45">
            <span className="modal-title-25">
              {t("staffTimesheet.reasonForRejection")}
            </span>
          </Text>
        </div>
        {!forLeave && (
          <>
            <Text size="12px" weight="400" color=" #6F7788">
              {t("staffTimesheet.selectedEmployee")}
            </Text>
            <Text size="14px" marginBottom="25px" weight="600" color="#102C42">
              {staffMemberName}
            </Text>
          </>
        )}
        <div className="c-field">
          <label>{t("staffTimesheet.reason")}</label>
          <textarea
            className="c-form-control"
            placeholder={t("form.placeholder1", {
              field: t("staffTimesheet.reason"),
            })}
            name="title"
            maxLength="500"
            onChange={(e) => setRejectionReason(e.target.value)}
          ></textarea>
        </div>
        <div className={styles["button-container"]}>
          <button
            disabled={!rejectionReason?.trim()?.length}
            className="button button-round button-shadow mr-md-4 w-sm-100 mb-3 mb-md-0"
            title={t("reject")}
            onClick={() => onReject(rejectionReason)}
          >
            {t("reject")}
          </button>
          <button
            className={
              "button button-round button-border btn-mobile-link button-dark"
            }
            title={t("cancel")}
            onClick={closeRejectionModal}
          >
            {t("cancel")}
          </button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default withTranslation()(RejectionModal);
