import React from "react";
import { withTranslation } from "react-i18next";

const Homeabout = (props) => {
  const { t } = props;
  return (
    <div className="app-about-section" id="about-us">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-7">
            <div className="content-block">
              <h2>{t("userPages.aboutMiraxis")}</h2>
              {props.pageContent && (
                <div
                  className="content-container ck-text"
                  dangerouslySetInnerHTML={{
                    __html: props.pageContent.content,
                  }}
                ></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withTranslation()(Homeabout);
