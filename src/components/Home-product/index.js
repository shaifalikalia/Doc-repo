import React, { useState } from "react";
//import { Link } from 'react-router-dom';
import { withTranslation } from "react-i18next";
import Slider from "react-slick";
import { Col, Row } from "reactstrap";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";

const HomeProduct = ({ t }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [practiceTabActive, setPracticeTabActive] = useState(true);
  const [patientTabActive, setPatientTabActive] = useState(false);
  const [supplyTabActive, setSupplyTabActive] = useState(false);
  const onPracticeHover = () => {
    setPracticeTabActive(true);
    setPatientTabActive(false);
    setSupplyTabActive(false);
  };

  const onPatientHover = () => {
    setPracticeTabActive(false);
    setPatientTabActive(true);
    setSupplyTabActive(false);
  };
  const onSupplyHover = () => {
    setPracticeTabActive(false);
    setPatientTabActive(false);
    setSupplyTabActive(true);
  };
  function SampleNextArrow(props) {
    const { className, onClick } = props;
    return (
      <div className={className} onClick={onClick}>
        <img
          className="arrow-img"
          src={
            require("assets/images/landing-pages/slider-arrow-next.svg").default
          }
          alt="img"
        />
      </div>
    );
  }

  function SamplePrevArrow(props) {
    const { className, onClick } = props;
    return (
      <div className={className} onClick={onClick}>
        <img
          className="arrow-img"
          src={
            require("assets/images/landing-pages/slider-arrow-next.svg").default
          }
          alt="img"
        />
      </div>
    );
  }
  const settings = {
    dots: false,
    infinite: true,
    arrows: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    beforeChange: (current, next) => setActiveSlide(next),
  };
  return (
    <div className="product-section">
      <div className="container">
        <div className="desktop-section d-lg-block d-none">
          <Row>
            <Col lg="5">
              <h3>{t("homePage.ourProducts")}</h3>
              <div className="counter-box">
                <span className="current-count">
                  {practiceTabActive && "01"}
                  {patientTabActive && "02"}
                  {supplyTabActive && "03"}
                </span>
                <span className="total-count"> - 03</span>
              </div>
              <div className="thumbnail-col">
                <div
                  onMouseEnter={onPracticeHover}
                  className={`img-logo-box  ${
                    practiceTabActive ? "logo-active" : ""
                  }`}
                >
                  <img
                    className="logo-img"
                    src={
                      require("assets/images/landing-pages/miraxis-practice.svg")
                        .default
                    }
                    alt="img"
                  />
                  <img
                    className="arrow-img"
                    src={
                      require("assets/images/landing-pages/slider-arrow-next.svg")
                        .default
                    }
                    alt="img"
                  />
                </div>

                <div
                  onMouseEnter={onPatientHover}
                  className={`img-logo-box  ${
                    patientTabActive ? "logo-active" : ""
                  }`}
                >
                  <img
                    className="logo-img"
                    src={
                      require("assets/images/landing-pages/miraxis-patient.svg")
                        .default
                    }
                    alt="img"
                  />
                  <img
                    className="arrow-img"
                    src={
                      require("assets/images/landing-pages/slider-arrow-next.svg")
                        .default
                    }
                    alt="img"
                  />
                </div>

                <div
                  onMouseEnter={onSupplyHover}
                  className={`img-logo-box  ${
                    supplyTabActive ? "logo-active" : ""
                  }`}
                >
                  <img
                    className="logo-img supply-img"
                    src={
                      require("assets/images/landing-pages/miraxis-supply.svg")
                        .default
                    }
                    alt="img"
                  />
                  <img
                    className="arrow-img"
                    src={
                      require("assets/images/landing-pages/slider-arrow-next.svg")
                        .default
                    }
                    alt="img"
                  />
                </div>
              </div>
            </Col>
            <Col lg="7">
              {practiceTabActive && (
                <div className="content-box">
                  <div className="content-img-logo">
                    <img
                      src={
                        require("assets/images/landing-pages/product-practice-logo.svg")
                          .default
                      }
                      alt="logo"
                    />
                  </div>
                  <div className="content-heading">
                    {t("homePage.ourProductsTitle1")}
                  </div>
                  <p>{t("homePage.ourProductsDesc1")}</p>
                </div>
              )}
              {patientTabActive && (
                <div className="content-box">
                  <div className="content-img-logo">
                    <img
                      src={
                        require("assets/images/landing-pages/product-patient-logo.svg")
                          .default
                      }
                      alt="logo"
                    />
                  </div>
                  <div className="content-heading">
                    {t("homePage.ourProductsTitle2")}
                  </div>
                  <p>{t("homePage.ourProductsDesc2")}</p>
                </div>
              )}
              {supplyTabActive && (
                <div className="content-box">
                  <div className="content-img-logo">
                    <img
                      src={
                        require("assets/images/landing-pages/product-vendor-logo.svg")
                          .default
                      }
                      alt="logo"
                    />
                  </div>
                  <div className="content-heading">
                    {t("homePage.ourProductsTitle3")}
                  </div>
                  <p>{t("homePage.ourProductsDesc3")}</p>
                </div>
              )}
            </Col>
          </Row>
        </div>
        <div className="mobile-section d-lg-none d-block">
          <h3>{t("homePage.ourProducts")}</h3>
          <Accordion
            allowZeroExpanded
            allowMultipleExpanded
            className="product-accordion"
          >
            <AccordionItem uuid="0">
              <AccordionItemHeading>
                <AccordionItemButton>
                  <img
                    className="logo-img"
                    src={
                      require("assets/images/landing-pages/miraxis-practice.svg")
                        .default
                    }
                    alt="img"
                  />
                </AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel>
                <div className="content-box">
                  <div className="content-img-logo">
                    <img
                      src={
                        require("assets/images/landing-pages/product-practice-logo.svg")
                          .default
                      }
                      alt="logo"
                    />
                  </div>
                  <div className="content-heading">
                    {t("homePage.ourProductsTitle1")}
                  </div>
                  <p>{t("homePage.ourProductsDesc1")}</p>
                </div>
              </AccordionItemPanel>
            </AccordionItem>
            <AccordionItem uuid="1">
              <AccordionItemHeading>
                <AccordionItemButton>
                  <img
                    className="logo-img"
                    src={
                      require("assets/images/landing-pages/miraxis-patient.svg")
                        .default
                    }
                    alt="img"
                  />
                </AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel>
                <div className="content-box">
                  <div className="content-img-logo">
                    <img
                      src={
                        require("assets/images/landing-pages/product-patient-logo.svg")
                          .default
                      }
                      alt="logo"
                    />
                  </div>
                  <div className="content-heading">
                    {t("homePage.ourProductsTitle2")}
                  </div>
                  <p>{t("homePage.ourProductsDesc2")}</p>
                </div>
              </AccordionItemPanel>
            </AccordionItem>
            <AccordionItem uuid="2">
              <AccordionItemHeading>
                <AccordionItemButton>
                  <img
                    className="logo-img"
                    src={
                      require("assets/images/landing-pages/miraxis-supply.svg")
                        .default
                    }
                    alt="img"
                  />
                </AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel>
                <div className="content-box">
                  <div className="content-img-logo">
                    <img
                      src={
                        require("assets/images/landing-pages/product-vendor-logo.svg")
                          .default
                      }
                      alt="logo"
                    />
                  </div>
                  <div className="content-heading">
                    {t("homePage.ourProductsTitle3")}
                  </div>
                  <p>{t("homePage.ourProductsDesc3")}</p>
                </div>
              </AccordionItemPanel>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="mobile-section d-none">
          <h3>{t("homePage.ourProducts")}</h3>
          <div className="counter-box">
            <span className="current-count">0{activeSlide + 1}</span>
            <span className="total-count"> - 03</span>
          </div>
          <Slider {...settings}>
            <div className="slide-col">
              <img
                className="logo-img"
                src={
                  require("assets/images/landing-pages/miraxis-practice.svg")
                    .default
                }
                alt="img"
              />

              <div className="content-box">
                <div className="content-img-logo">
                  <img
                    src={
                      require("assets/images/landing-pages/product-practice-logo.svg")
                        .default
                    }
                    alt="logo"
                  />
                </div>
                <div className="content-heading">
                  {t("homePage.ourProductsTitle1")}
                </div>
                <p>{t("homePage.ourProductsDesc1")}</p>
              </div>
            </div>
            <div className="slide-col">
              <img
                className="logo-img"
                src={
                  require("assets/images/landing-pages/miraxis-patient.svg")
                    .default
                }
                alt="img"
              />
              <div className="content-box">
                <div className="content-img-logo">
                  <img
                    src={
                      require("assets/images/landing-pages/product-patient-logo.svg")
                        .default
                    }
                    alt="logo"
                  />
                </div>
                <div className="content-heading">
                  {t("homePage.ourProductsTitle2")}
                </div>
                <p>{t("homePage.ourProductsDesc2")}</p>
              </div>
            </div>
            <div className="slide-col">
              <img
                className="logo-img"
                src={
                  require("assets/images/landing-pages/miraxis-supply.svg")
                    .default
                }
                alt="img"
              />
              <div className="content-box">
                <div className="content-img-logo">
                  <img
                    src={
                      require("assets/images/landing-pages/product-vendor-logo.svg")
                        .default
                    }
                    alt="logo"
                  />
                </div>
                <div className="content-heading">
                  {t("homePage.ourProductsTitle3")}
                </div>
                <p>{t("homePage.ourProductsDesc3")}</p>
              </div>
            </div>
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default withTranslation()(HomeProduct);
