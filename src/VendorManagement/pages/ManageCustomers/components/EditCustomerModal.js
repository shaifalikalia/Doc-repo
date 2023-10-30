import React from "react";
import { withTranslation } from "react-i18next";
import "rc-time-picker/assets/index.css";
import { Modal } from "reactstrap";
import ModalBody from "reactstrap/lib/ModalBody";
import Text from "components/Text";
import styles from "./../ManageCustomers.module.scss";
import ToggleSwitch from "components/ToggleSwitch";
import Input from "components/Input";
import { handleKeyDownForNumberInput } from "utils";
import Loader from "components/Loader";

function EditCustomerModal({ t, hookData }) {
  const { data, methods } = hookData;
  const {
    isEditCustomerModalOpen,
    editModalState,
    updatingCustomerDetails,
    disableEditModalSaveButton,
    formattedOfficeDetails,
  } = data;
  const {
    closeEditCustomerModal,
    handleVipAccess,
    handleBillMeLaterAccess,
    handleCreditAmount,
    handleSaveModalState,
  } = methods;
  return (
    <>
      <Modal
        isOpen={isEditCustomerModalOpen}
        toggle={closeEditCustomerModal}
        className={
          "modal-dialog-centered modal-width-660 " +
          styles["edit-customer-modal"]
        }
        modalClassName="custom-modal"
      >
        <span className="close-btn" onClick={closeEditCustomerModal}>
          <img src={require("assets/images/cross.svg").default} alt="close" />
        </span>
        <ModalBody>
          {updatingCustomerDetails && <Loader />}
          <div className="modal-custom-title">
            <Text size="25px" marginBottom="25px" weight="500" color="#111b45">
              {t("vendorManagement.editCustomerDetails")}
            </Text>
          </div>
          <ul className={styles["edit-list"]}>
            <li>
              <Text size="15px" marginBottom="0px" weight="400" color="#5B6B82">
                {t("vendorManagement.vIPCustomerAccess")}
              </Text>
              <div class={styles["switch-box"]}>
                <Text
                  size="13px"
                  marginBottom="0px"
                  weight="400"
                  className="mr-2"
                  color="#79869A"
                >
                  {editModalState.hasVipAccess ? "Yes" : "No"}
                </Text>
                <ToggleSwitch
                  label="vip-access-toggle"
                  value={editModalState.hasVipAccess || false}
                  onChange={() => handleVipAccess(!editModalState.hasVipAccess)}
                />
              </div>
            </li>
            <li>
              <Text size="15px" marginBottom="0px" weight="400" color="#5B6B82">
                {t("vendorManagement.billMeLaterAccess")}
              </Text>
              <div class={styles["switch-box"]}>
                <Text
                  size="13px"
                  marginBottom="0px"
                  weight="400"
                  className="mr-2"
                  color="#79869A"
                >
                  {editModalState.hasBillMeLaterAccess ? "Yes" : "No"}
                </Text>
                <ToggleSwitch
                  label="bill-me-later-toggle"
                  value={editModalState.hasBillMeLaterAccess || false}
                  onChange={() =>
                    handleBillMeLaterAccess(
                      !editModalState.hasBillMeLaterAccess
                    )
                  }
                />
              </div>
            </li>
          </ul>

          <Input
            Error={editModalState.error}
            Classes={editModalState.hasBillMeLaterAccess ? "" : "disable-btns"}
            ReadOnly={!editModalState.hasBillMeLaterAccess}
            Value={editModalState.creditAmount}
            HandleChange={handleCreditAmount}
            HandleKeyDown={handleKeyDownForNumberInput}
            Title={t("vendorManagement.billMeLaterCreditLimit")}
            Type="number"
            Name={"billMeLaterCreditLimit"}
            Placeholder={t("form.placeholder1", {
              field: t("vendorManagement.billMeLaterCreditLimit"),
            })}
          />
          {formattedOfficeDetails?.isBillMeLater && (
            <div className="yellow-alert-box">
              {t("vendorManagement.remainingCreditLimit")}
              <b> {formattedOfficeDetails?.remainingLimit}</b>
            </div>
          )}
          <div className="pt-md-3">
            <button
              disabled={disableEditModalSaveButton}
              onClick={handleSaveModalState}
              className="button button-round button-shadow mr-md-4 w-sm-100"
              title={t("vendorManagement.saveChanges")}
            >
              {t("vendorManagement.saveChanges")}
            </button>
            <button
              className="button button-round button-border button-dark btn-mobile-link"
              onClick={closeEditCustomerModal}
              title={t("cancel")}
            >
              {t("cancel")}
            </button>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}

export default withTranslation()(EditCustomerModal);
