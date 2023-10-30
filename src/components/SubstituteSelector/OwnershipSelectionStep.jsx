import React, { useContext, useState } from "react";
import { Trans, withTranslation } from "react-i18next";
import "./SubstituteSelector.scss";
import SubstituteSelectorContext from "./SubstituteSelectorContext";

const OwnershipSelectionStep = ({
  removeFromSingleOffice,
  substitutes,
  onConfirm,
  t,
}) => {
  const { onCancel, isActionExecuting } = useContext(SubstituteSelectorContext);
  const [selectedSubstituteId, setSelectedSubstituteId] = useState(0);
  const [selectedOwnership, setSelectedOwnership] = useState(1);

  return (
    <div>
      <p className="sss-description">
        <Trans i18nKey="accountOwner.ownershipSelectionDescription">
          This person is an ‘<strong>Account Admin</strong>’ for this office.
          There are work items such as Tasks created by this person that should
          be transferred to another Admin in your account.
        </Trans>
      </p>

      <div className="sss-radio-group">
        <div className="ch-radio">
          <label>
            <input
              type="radio"
              name="ownershipSelection"
              value={1}
              checked={selectedOwnership === 1}
              onChange={(e) => setSelectedOwnership(parseInt(e.target.value))}
            />
            <span>{t("accountOwner.ownershipSelectionOption1")}</span>
          </label>
        </div>
        <div className="ch-radio">
          <label>
            <input
              type="radio"
              name="ownershipSelection"
              value={2}
              checked={selectedOwnership === 2}
              onChange={(e) => setSelectedOwnership(parseInt(e.target.value))}
            />
            <span>
              {t("accountOwner.ownershipSelectionOption2", {
                count: removeFromSingleOffice ? 1 : 2,
              })}
            </span>
          </label>
        </div>
      </div>

      {selectedOwnership === 2 &&
        renderSubstitutes(
          substitutes,
          selectedSubstituteId,
          setSelectedSubstituteId,
          t
        )}

      <div className="sss-btn-group">
        <button
          disabled={
            (selectedOwnership === 2 && selectedSubstituteId === 0) ||
            isActionExecuting
          }
          className={
            "button button-round button-shadow" +
            (isActionExecuting ? " button-loading" : "")
          }
          onClick={() =>
            onConfirm(selectedSubstituteId === 0 ? null : selectedSubstituteId)
          }
        >
          {t("confirm")}
          {isActionExecuting && <div className="loader"></div>}
        </button>
        <button
          onClick={onCancel}
          className="button button-round button-border button-dark"
        >
          {t("cancel")}
        </button>
      </div>
    </div>
  );
};

const renderSubstitutes = (
  substitutes,
  selectedSubstituteId,
  setSelectedSubstituteId,
  t
) => {
  if (substitutes.length === 0) {
    return (
      <p className="oss-info-text">
        <strong>Info:</strong> You need to have another Admin for this office to
        select this option.
      </p>
    );
  }

  var substituteOptions = substitutes.map((substitute) => (
    <div className="ch-radio">
      <label>
        <input
          type="radio"
          name="substituteSelection"
          value={substitute.id}
          checked={parseInt(selectedSubstituteId) === substitute.id}
          onChange={(e) => setSelectedSubstituteId(parseInt(e.target.value))}
        />
        <span>{`${substitute.firstName} ${substitute.lastName}`}</span>
      </label>
    </div>
  ));

  return (
    <>
      <hr />
      <div>
        <p style={{ fontSize: "13px" }}>Select Account Admin</p>
        {substituteOptions}
      </div>
    </>
  );
};

export default withTranslation()(OwnershipSelectionStep);
