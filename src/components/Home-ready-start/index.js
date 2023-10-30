import React from "react";
import { withTranslation } from "react-i18next";
import { Row, Col } from "reactstrap";
import Slider from "react-slick";

const HomeReadyStart = (props) => {
  const { t } = props;
  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
  };
  function scrollToTargetAdjusted() {
    setTimeout(() => {
      var element = document.getElementById("contact");
      var headerOffset = 70;
      var elementPosition = element.getBoundingClientRect().top;
      var offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        behavior: "smooth",
        top: offsetPosition,
      });
    }, 500);
  }
  return (
    <div className="ready-start-section">
      <div className="container">
        <Row className="justify-content-center">
          <Col xl={9}>
            <h4>
              {props.Title2 && (
                <>
                  {" "}
                  {props.Title2} <br />
                </>
              )}
              {props.Title1 === false ? " " : t("homePage.readyTitle")}
            </h4>
            {props.readyPersonnalDesc === true ? (
              <p>
                <u className="cursor-pointer" onClick={scrollToTargetAdjusted}>
                  {t("homePage.readyPersonnalDesc1")}
                </u>{" "}
                {t("homePage.readyPersonnalDesc2")}{" "}
              </p>
            ) : props.readyPharmacyDesc2 === true ? (
              <p>
                <u className="cursor-pointer" onClick={scrollToTargetAdjusted}>
                  {t("homePage.readyDesc1")}
                </u>
                &nbsp;
                {t("homePage.readyPharmacyDesc2")}
              </p>
            ) : (
              <p>
                <u className="cursor-pointer" onClick={scrollToTargetAdjusted}>
                  {t("homePage.readyDesc1")}
                </u>{" "}
                {props.readySupplierDesc === true
                  ? t("homePage.readySupplierDesc")
                  : props.readyHealthcareDesc === true
                  ? t("homePage.readyHealthcareDesc")
                  : t("homePage.readyDesc2")}
              </p>
            )}
          </Col>
        </Row>
      </div>
      <div className="container-fluid">
        <Slider {...settings}>
          <div>
            <img
              src={
                require("assets/images/landing-pages/device-web.png").default
              }
              alt="arrow"
            />
          </div>
          <div>
            <img
              src={
                require("assets/images/landing-pages/device-mobile.png").default
              }
              alt="arrow"
            />
          </div>
        </Slider>
      </div>
    </div>
  );
};

export default withTranslation()(HomeReadyStart);
