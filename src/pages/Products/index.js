import React, { Component, Fragment } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { connect } from "react-redux";
import {
  getConent,
  getContactConent,
  getCatTestimonial,
  getCompanyInformation,
} from "actions";
/*components*/
import _isLoading from "hoc/isLoading";
import HomeContact from "components/Home-contact";
import HomeTestimoninal from "components/Home-testimonials";
import { withTranslation } from "react-i18next";
import HomeReadyStart from "components/Home-ready-start";
import { Col, Row } from "reactstrap";
import PracticeSlider from "./ProductSlider/PracticeSlider";
import PatientSlider from "./ProductSlider/PatientSlider";
import SupplySlider from "./ProductSlider/SupplySlider";
import Slider from "react-slick";

class Products extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.getConent({ id: 3 });
    this.props.getContactConent({ id: 5 });
    this.props.getCatTestimonial({ id: 7 });
    this.props.getCompanyInformation();
  }
  render() {
    const { testimonialList, t } = this.props;
    const bannerSettings = {
      dots: false,
      infinite: true,
      speed: 600,
      slidesToShow: 2,
      slidesToScroll: 1,
      arrows: false,
      autoplay: true,
      fade: true,
      autoplaySpeed: 3500,
      cssEase: "linear",
      responsive: [
        {
          breakpoint: 1025,
          settings: {
            dots: true,
          },
        },
      ],
    };
    return (
      <Fragment>
        <div className="landing-page-block">
          <div className="banner-new-section product-banner banner-block">
            <Slider {...bannerSettings}>
              <div className="slider-single slide-1">
                <img
                  className="d-none  img-cover d-md-block"
                  src={
                    require("assets/images/landing-pages/product-banner.jpg")
                      .default
                  }
                  alt="img"
                />
                <img
                  className="d-block  img-cover d-md-none"
                  src={
                    require("assets/images/landing-pages/product-banner-mobile.jpg")
                      .default
                  }
                  alt="img"
                />
              </div>
            </Slider>

            <div className="banner-caption">
              <div className="width-500">
                <div className="banner-label">{t("homePage.ourProducts")}</div>
                <h2 className="font-46">{t("userPages.productBannerTitle")}</h2>
              </div>
            </div>
          </div>
        </div>
        <div className="app-page">
          <section className="product-slider-section">
            <div className="product-row ">
              <div className="container">
                <div className="top-text">
                  <img
                    className="logo-img"
                    src={
                      require("assets/images/landing-pages/miraxis-practice.svg")
                        .default
                    }
                    alt="img"
                  />
                  <p>{t("userPages.productPracticeText")}</p>
                </div>
              </div>
              <div className="product-slider-bg practice-slider">
                <div className="slider-wrapper">
                  <div className="container">
                    <PracticeSlider />
                  </div>
                </div>
              </div>
            </div>
            <div className="product-row">
              <div className="container ">
                <div className="top-text patient-text">
                  <img
                    className="logo-img"
                    src={
                      require("assets/images/landing-pages/miraxis-patient.svg")
                        .default
                    }
                    alt="img"
                  />
                  <p>{t("userPages.productPatientText")}</p>
                </div>
              </div>
              <div className="product-slider-bg patient-slider">
                <div className="slider-wrapper">
                  <div className="container">
                    <PatientSlider />
                  </div>
                </div>
              </div>
            </div>
            <div className="product-row">
              <div className="container">
                <div className="top-text">
                  <img
                    className="logo-img"
                    src={
                      require("assets/images/landing-pages/miraxis-supply.svg")
                        .default
                    }
                    alt="img"
                  />
                  <p>{t("userPages.producSupplyText")}</p>
                </div>
              </div>
              <div className="product-slider-bg supplier-slider">
                <div className="slider-wrapper">
                  <div className="container">
                    <SupplySlider />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="hexagon-section">
            <div className="container">
              <Row className="align-items-center">
                <Col lg="7">
                  <div className="text-col">
                    <h2> {t("userPages.readyToTransformYourBusiness")}</h2>
                    <p> {t("userPages.productHexaDesc1")}</p>
                    <p>
                      {t("userPages.dentistHexaDesc1")}{" "}
                      {t("userPages.productHexaDesc2")}
                    </p>
                  </div>
                </Col>
                <Col lg="5">
                  <div className="image-col">
                    <img
                      src={
                        require("assets/images/landing-pages/hexagon.svg")
                          .default
                      }
                      alt="icon"
                    />
                  </div>
                </Col>
              </Row>
            </div>
          </div>
          <HomeReadyStart />
          <HomeContact companyInformation={this.props.companyInformation} />
          {testimonialList && testimonialList.length > 0 && (
            <HomeTestimoninal
              title={t("userPages.testimonialTitle")}
              data={testimonialList}
            />
          )}
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = ({
  userProfile: { profile },
  pageContent: {
    isLoading,
    pageContent,
    contactContent,
    testimonialList,
    companyInformation,
  },
  errors: { isError },
}) => ({
  isLoading,
  isError,
  profile,
  pageContent,
  contactContent,
  testimonialList,
  companyInformation,
});

export default connect(mapStateToProps, {
  getConent,
  getContactConent,
  getCatTestimonial,
  getCompanyInformation,
})(_isLoading(withTranslation()(Products)));
