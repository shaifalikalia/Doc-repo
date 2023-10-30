import React from "react";
import Slider from "react-slick";
import { withTranslation } from "react-i18next";

const PracticeSlider = ({ t }) => {
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
        <h4>{t("userPages.productPracticeFeatures.0.title")}</h4>
        <ul className="list-icon-dot">
          <li>{t("userPages.productPracticeFeatures.0.listText1")}</li>
          <li>{t("userPages.productPracticeFeatures.0.listText2")}</li>
          <li>{t("userPages.productPracticeFeatures.0.listText3")}</li>
        </ul>
      </div>
      <div className="product-card">
        <h4>{t("userPages.productPracticeFeatures.1.title")}</h4>
        <ul className="list-icon-dot">
          <li>{t("userPages.productPracticeFeatures.1.listText1")}</li>
          <li>{t("userPages.productPracticeFeatures.1.listText2")}</li>
          <li>{t("userPages.productPracticeFeatures.1.listText3")}</li>
        </ul>
      </div>
      <div className="product-card">
        <h4>{t("userPages.productPracticeFeatures.2.title")}</h4>
        <ul className="list-icon-dot">
          <li>{t("userPages.productPracticeFeatures.2.listText1")}</li>
          <li>{t("userPages.productPracticeFeatures.2.listText2")}</li>
          <li>{t("userPages.productPracticeFeatures.2.listText3")}</li>
        </ul>
      </div>
      <div className="product-card">
        <h4>{t("userPages.productPracticeFeatures.3.title")}</h4>
        <ul className="list-icon-dot">
          <li>{t("userPages.productPracticeFeatures.3.listText1")}</li>
          <li>{t("userPages.productPracticeFeatures.3.listText2")}</li>
          <li>{t("userPages.productPracticeFeatures.3.listText3")}</li>
        </ul>
      </div>
      <div className="product-card">
        <h4>{t("userPages.productPracticeFeatures.4.title")}</h4>
        <ul className="list-icon-dot">
          <li>{t("userPages.productPracticeFeatures.4.listText1")}</li>
          <li>{t("userPages.productPracticeFeatures.4.listText2")}</li>
          <li>{t("userPages.productPracticeFeatures.4.listText3")}</li>
        </ul>
        <div className="small-text">{t("userPages.comingSoonText")}</div>
      </div>
      <div className="product-card">
        <h4>{t("userPages.productPracticeFeatures.5.title")}</h4>
        <ul className="list-icon-dot">
          <li>{t("userPages.productPracticeFeatures.5.listText1")}</li>
          <li>{t("userPages.productPracticeFeatures.5.listText2")}</li>
          <li>{t("userPages.productPracticeFeatures.5.listText3")}</li>
        </ul>
      </div>
    </Slider>
  );
};

export default withTranslation()(PracticeSlider);
