import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import "rc-time-picker/assets/index.css";
import { Modal } from "reactstrap";
import ModalBody from "reactstrap/lib/ModalBody";
import Text from "components/Text";
import "./../commission.scss";
import Input from "components/Input";
import Loader from "components/Loader";

function EditCommissionsModal({
  t,
  editCommissionsModalOpen,
  setEditCommissionsModalOpen,
  updateCommission,
  isLoading,
}) {
  const [commission, setCommission] = useState(
    editCommissionsModalOpen?.adminCommission
  );
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { value } = event.target;
    let updateValue = parseDiscount(value, commission);
    setCommission(updateValue);
    if (updateValue) {
      setError("");
    }
  };

  const parseDiscount = (newValue, oldValue) => {
    if (!newValue) return "";
    //strip white spaces
    const percentWithoutSpaces = newValue.replace(/\s/g, "");
    // strip all chars ohter than digits and .
    const percentWithDigitsOnly = percentWithoutSpaces.replace(/[^\d.]/g, "");
    const isValidPercent = /(^\d{1,3}\.\d{0,2}$)|(^\d{0,3}$)/.test(
      percentWithDigitsOnly
    );
    if (isValidPercent && +percentWithDigitsOnly <= 100) {
      return percentWithDigitsOnly;
    }
    return oldValue;
  };

  const isValid = () => {
    if (commission || commission === 0) {
      updateCommission(commission);
    } else {
      setError(t("form.errors.emptyField", { field: t("commision") }));
    }
  };

  const closeModal = () => {
    setEditCommissionsModalOpen({ isOpen: false });
  };

  return (
    <>
      <Modal
        isOpen={editCommissionsModalOpen?.isOpen}
        toggle={closeModal}
        className={"modal-dialog-centered modal-width-660 category-modal"}
        modalClassName="custom-modal"
      >
        <span className="close-btn" onClick={closeModal}>
          <img src={require("assets/images/cross.svg").default} alt="close" />
        </span>
        <ModalBody>
          {isLoading && <Loader />}

          <Text size="25px" marginBottom="25px" weight="500" color="#111b45">
            {t("superAdminCommissions.editCommission")}
          </Text>
          <Text size="12px" weight="400" color="#6F7788">
            {" "}
            {t("superAdminCommissions.vendorsName")}
          </Text>
          <Text size="14px" marginBottom="30px" weight="600" color="#102C42">
            {editCommissionsModalOpen?.name}
          </Text>
          <Text size="12px" weight="400" color="#6F7788">
            {" "}
            {t("superAdminCommissions.emailAddress")}
          </Text>
          <Text size="14px" marginBottom="30px" weight="600" color="#102C42">
            {editCommissionsModalOpen?.emailId}
          </Text>

          <Input
            Title={t("superAdminCommissions.editCommissionInPercentage")}
            Type="text"
            Value={commission}
            HandleChange={handleChange}
            Error={error}
          />
          <div className="last-field">
            <button
              className="button button-round button-shadow mr-4"
              title={t("superAdminCommissions.save")}
              onClick={isValid}
            >
              {t("superAdminCommissions.save")}
            </button>
            <button
              className="button button-round button-border button-dark "
              onClick={closeModal}
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

export default withTranslation()(EditCommissionsModal);
