import React from "react";
import Slider from "react-slick";
import { withTranslation } from "react-i18next";

const PatientSlider = ({ t }) => {
  const settingsPractice = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
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
    <Slider {...settingsPractice}>
      <div className="product-card">
        <h4>{t("userPages.productPatientFeatures.0.title")}</h4>
        <ul className="list-icon-dot">
          <li>{t("userPages.productPatientFeatures.0.listText1")}</li>
          <li>{t("userPages.productPatientFeatures.0.listText2")}</li>
          <li>{t("userPages.productPatientFeatures.0.listText3")}</li>
          <li>{t("userPages.productPatientFeatures.0.listText4")}</li>
          <li>{t("userPages.productPatientFeatures.0.listText5")}</li>
        </ul>
      </div>
      <div className="product-card">
        <h4>{t("userPages.productPatientFeatures.1.title")}</h4>
        <ul className="list-icon-dot">
          <li>{t("userPages.productPatientFeatures.1.listText1")}</li>
          <li>{t("userPages.productPatientFeatures.1.listText2")}</li>
          <li>{t("userPages.productPatientFeatures.1.listText3")}</li>
        </ul>
      </div>
      <div className="product-card">
        <h4>{t("userPages.productPatientFeatures.2.title")}</h4>
        <ul className="list-icon-dot">
          <li>{t("userPages.productPatientFeatures.2.listText1")}</li>
          <li>{t("userPages.productPatientFeatures.2.listText2")}</li>
        </ul>
      </div>
      <div className="product-card">
        <h4>{t("userPages.productPatientFeatures.3.title")}</h4>
        <ul className="list-icon-dot">
          <li>{t("userPages.productPatientFeatures.3.listText1")}</li>
          <li>{t("userPages.productPatientFeatures.3.listText2")}</li>
          <li>{t("userPages.productPatientFeatures.3.listText3")}</li>
        </ul>
      </div>
      <div className="product-card">
        <h4>{t("userPages.productPatientFeatures.4.title")}</h4>
        <ul className="list-icon-dot">
          <li>{t("userPages.productPatientFeatures.4.listText1")}</li>
          <li>{t("userPages.productPatientFeatures.4.listText2")}</li>
        </ul>
      </div>
      <div className="product-card">
        <h4>{t("userPages.productPatientFeatures.5.title")}</h4>
        <ul className="list-icon-dot">
          <li>{t("userPages.productPatientFeatures.5.listText1")}</li>
          <li>{t("userPages.productPatientFeatures.5.listText2")}</li>
          <li>{t("userPages.productPatientFeatures.5.listText3")}</li>
        </ul>
      </div>
    </Slider>
  );
};

export default withTranslation()(PatientSlider);
