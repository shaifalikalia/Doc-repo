import React from "react";
import Slider from "react-slick";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const FeaturesServiceCard = ({ t, ...props }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: props?.sliderCard3Title ? 3 : 2,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 1300,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          draggable: true,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <div className={`features-services-sec`} id={props.secId}>
      <div className="container">
        <div className={`row-wrapper   ${props.rowReverse && "row-reverse"}`}>
          <div className="text-col">
            <h3>
              {props.rowHeading}
              {props.asteriskText && <span className="asterisk-icon">*</span>}
            </h3>
            <div className="tagline-text">{props.rowTagline}</div>
            <p>{props.rowDesc}</p>
            {props.rowDesc1 ? <p className="font-22">{props.rowDesc1}</p> : ""}
          </div>

          <div className="img-col">
            <img className="d-md-block d-none" src={props.rowImage} alt="img" />
            <img
              className="d-md-none d-block"
              src={props.mobileImage}
              alt="img"
            />
          </div>
        </div>
      </div>

      <div className="slider-row">
        <div className="container">
          <Slider {...settings}>
            <div className="slider-card">
              <h4>{props.sliderCard1Title}</h4>
              <ul className="list-icon-dot">
                {props.sliderCard1Text1 && <li>{props.sliderCard1Text1}</li>}
                {props.sliderCard1Text2 && <li>{props.sliderCard1Text2}</li>}
                {props.sliderCard1Text3 && <li>{props.sliderCard1Text3}</li>}
                {props.sliderCard1Text4 && <li>{props.sliderCard1Text4}</li>}
                {props.sliderCard1Text5 && <li>{props.sliderCard1Text5}</li>}
              </ul>
            </div>
            <div className="slider-card">
              <h4>{props.sliderCard2Title}</h4>
              <ul className="list-icon-dot">
                {props.sliderCard2Text1 && <li>{props.sliderCard2Text1}</li>}
                {props.sliderCard2Text2 && <li>{props.sliderCard2Text2}</li>}
                {props.sliderCard2Text3 && <li>{props.sliderCard2Text3}</li>}
                {props.sliderCard2Text4 && <li>{props.sliderCard2Text4}</li>}
                {props.sliderCard2Text5 && <li>{props.sliderCard2Text5}</li>}
              </ul>
              {props.sliderInnerList && (
                <ul className="list-icon-dot small-list">
                  {props.textList1 && <li>{props.textList1}</li>}
                  {props.textList2 && <li>{props.textList2}</li>}
                  {props.textList3 && <li>{props.textList3}</li>}
                  {props.textList4 && <li>{props.textList4}</li>}
                  {props.textList6 && <li>{props.textList6}</li>}
                  {props.textList7 && <li>{props.textList7}</li>}
                </ul>
              )}
            </div>
          
                {
                  props.sliderCard3Title &&
                  <div className="slider-card">
                  <h4>{props.sliderCard3Title}</h4>
                  <ul className="list-icon-dot">
                    {props.sliderCard3Text1 && <li>{props.sliderCard3Text1}</li>}
                    {props.sliderCard3Text2 && <li>{props.sliderCard3Text2}</li>}
                    {props.sliderCard3Text3 && <li>{props.sliderCard3Text3}</li>}
                    {props.sliderCard3Text4 && <li>{props.sliderCard3Text4}</li>}
                    {props.sliderCard3Text5 && <li>{props.sliderCard3Text5}</li>}
                  </ul>        
                </div>
                }
            
        
          </Slider>
        </div>
      </div>
      <div className="green-bg-area">
        <div className="container">
          <div className="content-wrapper">
            <p>{props.ctaText} </p>
            {props.trialBtn === false ? (
              ""
            ) : (
              <button
                className="button button-round"
                onClick={props.SignupClick}
                title={t("userPages.dentistHexaDesc1")}
              >
                {t("userPages.dentistHexaDesc1")}
              </button>
            )}
          </div>
          <div className="cta-wrapper">
            <h4> {t("featuresLanding.serviceCtaTitle")}</h4>
            <p>
              <Link to="/contact">
                <u>{t("featuresLanding.serviceCtaDesc1")}</u>
              </Link>{" "}
              {t("featuresLanding.serviceCtaDesc2")}
            </p>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default withTranslation()(FeaturesServiceCard);
