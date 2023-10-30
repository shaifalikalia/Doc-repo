import React, { useContext, useState } from "react";
import { withTranslation } from "react-i18next";
import SubstituteSelectorContext from "./SubstituteSelectorContext";
import "./SubstituteSelector.scss";

const OfficeSelectionStep = ({
  updateStep,
  isLoadingSubstitutes,
  removeFromSingleOffice,
  t,
}) => {
  const { text, onCancel } = useContext(SubstituteSelectorContext);
  const [selection, setSelection] = useState(removeFromSingleOffice ? 1 : 2);

  return (
    <div>
      <p className="sss-description">
        {text.officeSelectionStep.description()}
      </p>

      <div className="sss-radio-group">
        <div className="ch-radio">
          <label>
            <input
              type="radio"
              name="officeSelection"
              value={1}
              checked={selection === 1}
              onChange={(e) => setSelection(parseInt(e.target.value))}
            />
            <span>{text.officeSelectionStep.option1}</span>
          </label>
        </div>
        <div className="ch-radio">
          <label>
            <input
              type="radio"
              name="officeSelection"
              value={2}
              checked={selection === 2}
              onChange={(e) => setSelection(parseInt(e.target.value))}
            />
            <span>{text.officeSelectionStep.option2}</span>
          </label>
        </div>
      </div>

      <div className="sss-btn-group">
        <button
          className={
            "button button-round button-shadow" +
            (isLoadingSubstitutes ? " button-loading" : "")
          }
          onClick={() => updateStep(selection === 1 ? true : false)}
          disabled={isLoadingSubstitutes}
        >
          {t("next")}
          {isLoadingSubstitutes && <div className="loader"></div>}
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

export default withTranslation()(OfficeSelectionStep);
