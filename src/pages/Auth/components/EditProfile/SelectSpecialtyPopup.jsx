import React, { useEffect } from "react";
import { Modal, ModalBody } from "reactstrap";
import { withTranslation } from "react-i18next";
import crossIcon from "./../../../../assets/images/cross.svg";
import circularAddIcon from "./../../../../assets/images/circular-add.svg";
import Input from "components/Input";
import Text from "components/Text";
import { useState } from "react";
import {
  useAddSpecialty,
  useSpecialtiesForSelection,
} from "repositories/specialty-repository";
import Toast from "components/Toast/Alert";

function SelectSpecialtyPopup({
  alreadySelectedSpecialties,
  onSave,
  onClose,
  t,
}) {
  const [showInput, setShowInput] = useState(false);
  const { isLoading, error, data } = useSpecialtiesForSelection(1, 10000);
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);

  useEffect(() => {
    if (Array.isArray(alreadySelectedSpecialties)) {
      setSelectedSpecialties((v) => [...alreadySelectedSpecialties, ...v]);
    }
  }, [alreadySelectedSpecialties]);

  let content = null;
  if (isLoading) {
    content = (
      <div className="center">
        <div className="loader"></div>
      </div>
    );
  }

  if (!isLoading && error) {
    content = <Toast errorToast Message={error.message} />;
  }

  if (!isLoading && !error) {
    content = data.items.map((it, _i) => (
      <li key={_i}>
        <div className="ch-checkbox">
          <label>
            <input
              type="checkbox"
              checked={
                selectedSpecialties.findIndex((ss) => ss.id === it.id) !== -1
              }
              onChange={() => {
                const i = selectedSpecialties.findIndex(
                  (ss) => ss.id === it.id
                );
                if (i === -1) {
                  setSelectedSpecialties((v) => [...v, it]);
                } else {
                  selectedSpecialties.splice(i, 1);
                  setSelectedSpecialties([...selectedSpecialties]);
                }
              }}
            />
            <span>{it.title}</span>
          </label>
        </div>
      </li>
    ));
  }

  return (
    <Modal
      isOpen={true}
      toggle={onClose}
      className="modal-dialog-centered profile-specialty-modal"
      modalClassName="custom-modal"
    >
      <span className="close-btn" onClick={onClose}>
        <img src={crossIcon} alt="close" />
      </span>
      <ModalBody>
        <Text size="25px" marginBottom="30px" weight="500" color="#111b45">
          <span className="modal-title-25">
            {" "}
            {t("accountOwner.selectSpecialtiesAndServices")}
          </span>{" "}
        </Text>

        {!showInput && (
          <div className="specialty-btn" onClick={() => setShowInput(true)}>
            <img
              src={circularAddIcon}
              className="mr-1"
              style={{ width: "15px", height: "15px" }}
              alt="addIcon"
            />
            {t("superAdmin.addSpecialtiesOrServices")}
          </div>
        )}

        {showInput && (
          <AddSpecialtyInput onCancel={() => setShowInput(false)} t={t} />
        )}

        <ul className="specialty-list">{content}</ul>

        <div className="btn-box d-md-flex">
          <button
            className="button button-round button-shadow mr-md-4 mb-3 w-sm-100"
            onClick={() => onSave(selectedSpecialties)}
          >
            {t("accountOwner.saveSpecialty")}
          </button>

          <button
            className="mb-md-3 button button-round button-border button-dark btn-mobile-link"
            onClick={onClose}
          >
            {t("cancel")}
          </button>
        </div>
      </ModalBody>
    </Modal>
  );
}

function AddSpecialtyInput({ onCancel, t }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const mutation = useAddSpecialty();

  const onAdd = async () => {
    try {
      await mutation.mutateAsync(name.trim());
      onCancel();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="d-flex flex-column">
      <Input
        Title={t("superAdmin.addSpecialtiesOrServices")}
        Classes="c-field-lg-none"
        Autofocus
        Type="text"
        MaxLength={36}
        Placeholder={t("form.placeholder1", { field: t("form.fields.name") })}
        Value={name}
        HandleChange={(e) => setName(e.target.value)}
        Error={error}
      />

      <div className="d-flex flex-row align-items-center mt-1">
        <button
          class="specialty-btn mr-2"
          disabled={name.trim().length === 0 || mutation.isLoading}
          onClick={onAdd}
        >
          {t("add")}
        </button>
        <button
          class="specialty-btn"
          disabled={mutation.isLoading}
          onClick={onCancel}
        >
          {t("cancel")}
        </button>
      </div>
    </div>
  );
}

export default withTranslation()(SelectSpecialtyPopup);
