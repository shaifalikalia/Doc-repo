import React from "react";
import { withTranslation } from "react-i18next";

const ServiceCard = (props) => {
  const { t } = props;
  return (
    <div className="service-card-bg">
      <div className="service-card">
        {props.Title && (
          <h3>
            {props.Title}
            {props.asteriskText && <span className="asterisk-icon">*</span>}
          </h3>
        )}

        <div className="service-img">
          <img src={props.imgSrc} className="img-fluid" alt="img" />
        </div>
        <h4 className="sub-title">{props.subTitle}</h4>
        <ul className="list-icon-dot">
          <li>{props.listText1}</li>
          <li>{props.listText2}</li>
          {props.listText3 && <li>{props.listText3}</li>}
          {props.listText4 && <li>{props.listText4}</li>}
          {props.listText5 && <li>{props.listText5}</li>}
        </ul>
        {props.asteriskText && (
          <div className="small-text">{t("userPages.comingSoonText")}</div>
        )}
      </div>
    </div>
  );
};

export default withTranslation()(ServiceCard);
