import React, { useContext } from "react";
import { withTranslation } from "react-i18next";
import SubstituteSelectorContext from "./SubstituteSelectorContext";
import "./SubstituteSelector.scss";
import Toast from "components/Toast";

const SubstituteSelectorLayout = ({
  errorMessage,
  onClearErrorMessage,
  internalErrorMessage,
  onClearInternalErrorMessage,
  children,
  t,
}) => {
  const { staff, text, onBack } = useContext(SubstituteSelectorContext);

  return (
    <div className="page">
      <div className="container">
        <button className="back-btn" onClick={onBack}>
          <div className="back-btn-text">
            <span className="ico">
              <img
                src={require("assets/images/arrow-back-icon.svg").default}
                alt="arrow"
              />
            </span>
            {t("back")}
          </div>
        </button>

        <h2 className="page-title mt-2">{text.title}</h2>

        {errorMessage && (
          <Toast
            message={errorMessage}
            errorToast={true}
            handleClose={onClearErrorMessage}
          />
        )}
        {internalErrorMessage && (
          <Toast
            message={internalErrorMessage}
            errorToast={true}
            handleClose={onClearInternalErrorMessage}
          />
        )}

        <div className="page-backdrop">
          <div className="ssl-profile">
            <img
              alt=""
              className="round-image ssl-profile-image"
              src={
                staff.profilePicURL
                  ? staff.profilePicURL
                  : require("assets/images/default-image.svg").default
              }
            />
            <h4 className="ssl-user-name">
              {staff.firstName} {staff.lastName}
            </h4>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default withTranslation()(SubstituteSelectorLayout);
