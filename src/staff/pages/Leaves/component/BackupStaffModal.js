import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import "rc-time-picker/assets/index.css";
import "./../Leaves.scss";
import styles from "./../Leaves.module.scss";
import crossIcon from "../../../../assets/images/cross.svg";
import Text from "components/Text";
import { Modal, ModalBody } from "reactstrap";
import Input from "components/Input";
import produce from "immer";
import { cloneDeep } from "lodash";
import { testRegexCheck, parseNumber } from "utils";

const initialState = {
  backupName: "",
  backupContactNumber: "",
};

const BackupStaffModal = ({
  t,
  isBackupStaffModalOpen,
  setIsBackupStaffModalOpen,
  handleAdd,
}) => {
  const closeBackupStaffModal = () => setIsBackupStaffModalOpen(false);
  const [backupName, setBackupName] = useState(initialState.backupName);
  const [backupContactNumber, setBackupContactNumber] = useState(
    initialState.backupContactNumber
  );
  const [errors, setErrors] = useState({});

  const handleBackupContactNumber = (e) => {
    const value = parseNumber(e.target.value);
    setBackupContactNumber(value);
    setErrors(
      produce((state) => {
        if (!value.trim().length) {
          state.phone = t("form.errors.emptyField", {
            field: t("form.fields.phoneNumber"),
          });
        } else {
          if (parseNumber(value)) {
            delete state.phone;
          } else {
            state.phone = t("form.errors.invalidValue", {
              field: t("form.fields.phoneNumber"),
            });
          }
        }
      })
    );
  };

  const handlebackupName = (e) => {
    const value = e.target.value;
    if (!testRegexCheck(value)) return;
    setBackupName(value);
    setErrors(
      produce((state) => {
        if (!value.trim().length) {
          state.name = t("form.errors.emptyField", {
            field: t("form.fields.name"),
          });
        } else {
          delete state.name;
        }
      })
    );
  };

  const isFormValid = () => {
    const errs = cloneDeep(errors);

    // for name
    if (!backupName.trim().length) {
      errs.name = t("form.errors.emptyField", { field: t("form.fields.name") });
    } else {
      delete errs.name;
    }

    //for phone
    if (!backupContactNumber.trim().length) {
      errs.phone = t("form.errors.emptyField", {
        field: t("form.fields.phoneNumber"),
      });
    } else {
      if (parseNumber(backupContactNumber)) {
        delete errs.phone;
      } else {
        errs.phone = t("form.errors.invalidValue", {
          field: t("form.fields.phoneNumber"),
        });
      }
    }

    setErrors(errs);

    return !Object.values(errs).some((er) => !!er);
  };

  return (
    <Modal
      isOpen={isBackupStaffModalOpen}
      toggle={closeBackupStaffModal}
      className={
        "modal-dialog-centered  modal-width-660 backup-modal " +
        styles["rejection-modal"]
      }
      modalClassName="custom-modal"
    >
      <span className="close-btn" onClick={closeBackupStaffModal}>
        <img src={crossIcon} alt="close" />
      </span>
      <ModalBody>
        <div className={"modal-custom-title"}>
          <Text size="25px" marginBottom="30px" weight="500" color="#111b45">
            <span className="modal-title-25">
              {t("staffLeaves.addBackupStaffManuallyHeading")}
            </span>
          </Text>
        </div>
        <Input
          MaxLength={120}
          Title={t("staffLeaves.name") + "*"}
          Type="text"
          Value={backupName}
          HandleChange={handlebackupName}
          Placeholder={t("form.placeholder1", {
            field: t("staffLeaves.name"),
          })}
          Error={errors.name}
        />
        <Input
          MaxLength={24}
          Title={t("staffLeaves.contactNo") + "*"}
          Type="text"
          Value={backupContactNumber}
          HandleChange={handleBackupContactNumber}
          Placeholder={t("form.placeholder1", {
            field: t("staffLeaves.contactNo"),
          })}
          Error={errors.phone}
        />
        <div className={styles["button-container"]}>
          <button
            className="button button-round button-shadow mr-md-4 w-sm-100 mt-md-10 add-top"
            onClick={() => {
              if (!isFormValid()) return;
              handleAdd(backupName, backupContactNumber);
            }}
            title={t("add")}
          >
            {t("add")}
          </button>

          <button
            className={
              "button button-round button-border btn-mobile-link button-dark"
            }
            title={t("cancel")}
            onClick={closeBackupStaffModal}
          >
            {t("cancel")}
          </button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default withTranslation()(BackupStaffModal);
