import React, { useEffect } from "react";
import { withTranslation } from "react-i18next";

const Page = ({
  isTitleLoading,
  titleKey,
  title,
  onBack,
  actionButton,
  className,
  t,
  children,
}) => {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  let backButton = null;
  if (onBack) {
    backButton = (
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
    );
  }

  return (
    <div className={`page ${className ? className : ""}`}>
      <div className="container">
        {backButton}

        <Title
          isLoading={isTitleLoading}
          titleKey={titleKey}
          text={title}
          actionButton={actionButton}
          t={t}
        />

        {children}
      </div>
    </div>
  );
};

function Title({ isLoading, titleKey, text, actionButton, t }) {
  let innerContent = null;
  if (isLoading) {
    innerContent = (
      <div className="page-title-placeholder shimmer-animation"></div>
    );
  } else {
    innerContent = titleKey ? t(titleKey) : text;
  }

  let title = null;
  if (actionButton) {
    title = (
      <div className="mt-3 mb-4 d-flex flex-row justify-content-between align-items-center">
        <h2 className="page-title">{innerContent}</h2>
        {actionButton}
      </div>
    );
  } else {
    title = <h2 className="page-title mt-3 mb-4">{innerContent}</h2>;
  }
  return title;
}

export default withTranslation()(Page);
