import React, { useState } from "react";
import { Modal, ModalBody } from "reactstrap";
import { withTranslation } from "react-i18next";
import crossIcon from "./../../../../assets/images/cross.svg";
import Text from "components/Text";
import "./TermsForContractModal.scss";
function TermsForContractModal({
  isModalOpen,
  closeModal,
  confirm,
  termsData,
  t,
}) {
  const [errorTerms, seterrorTerms] = useState(null);
  const termsboxRef = React.useRef(null);

  const checkTerms = () => {
    if (!termsboxRef.current.checked) {
      seterrorTerms(`${t("form.errors.acceptTerms")}`);
    } else {
      seterrorTerms(null);
      confirm();
      closeModal();
    }
  };
  return (
    <Modal
      isOpen={isModalOpen}
      toggle={closeModal}
      className="modal-dialog-centered confirm-contract-modal"
      modalClassName="custom-modal"
    >
      <span className="close-btn" onClick={closeModal}>
        <img src={crossIcon} alt="close" />
      </span>
      <ModalBody>
        <Text size="25px" marginBottom="10px" weight="500" color="#111b45">
          <span className="modal-title-25">{t("contracts.signContract")}</span>
        </Text>
        <Text size="16px" marginBottom="25px" weight="300" color="#535b5f">
          {termsData && termsData.content
            ? termsData.content
            : t("contracts.termsOfUseForSignContractDesc")}
        </Text>
        <div className={`ch-checkbox`}>
          <label>
            <input ref={termsboxRef} type="checkbox" />
            <span>{t("contracts.IAgreeTermsSignContract")}</span>
          </label>
        </div>
        {errorTerms && <span className="error-msg">{errorTerms}</span>}
        <div className="d-md-flex mt-4">
          <button
            className="button button-round button-shadow mr-md-4 mb-3 w-sm-100"
            title={t("submit")}
            onClick={checkTerms}
          >
            {t("submit")}
          </button>
          <button
            className="mb-md-3 button button-round button-border button-dark btn-mobile-link"
            title={t("cancel")}
            onClick={closeModal}
          >
            {t("cancel")}
          </button>
        </div>
      </ModalBody>
    </Modal>
  );
}

export default withTranslation()(TermsForContractModal);
