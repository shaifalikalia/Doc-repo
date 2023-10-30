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
import FeatureNoteBlock from "components/FeatureNoteBlock";
import ServiceCard from "components/ServiceCard";
import HomeReadyStart from "components/Home-ready-start";
import { Col, Row } from "reactstrap";
import Slider from "react-slick";
import HomePlansNew from "components/Home-plans-new";

class Pharmacist extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.getConent({ id: 3 });
    this.props.getContactConent({ id: 5 });
    this.props.getCatTestimonial({ id: 3 });
    this.props.getCompanyInformation();
  }
  render() {
    const { testimonialList, t } = this.props;
    function scrollToPlan() {
      setTimeout(() => {
        var element = document.getElementById("plan-list");
        var headerOffset = 70;
        var elementPosition = element.getBoundingClientRect().top;
        var offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          behavior: "smooth",
          top: offsetPosition,
        });
      }, 500);
    }
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
          <div className="banner-new-section pharmacist-banner banner-block">
            <Slider {...bannerSettings}>
              <div className="slider-single slide-1">
                <img
                  className="d-none  img-cover d-md-block"
                  src={
                    require("assets/images/landing-pages/pharmacist-page-banner.jpg")
                      .default
                  }
                  alt="img"
                />
                <img
                  className="d-block  img-cover d-md-none"
                  src={
                    require("assets/images/landing-pages/pharmacist-mobile-banner.jpg")
                      .default
                  }
                  alt="img"
                />
              </div>
              <div className="slider-single slide-2">
                <img
                  className="d-none  img-cover d-md-block"
                  src={
                    require("assets/images/landing-pages/pharmacist-page-banner2.jpg")
                      .default
                  }
                  alt="img"
                />
                <img
                  className="d-block  img-cover d-md-none"
                  src={
                    require("assets/images/landing-pages/pharmacist-mobile-banner2.jpg")
                      .default
                  }
                  alt="img"
                />
              </div>
              <div className="slider-single slide-3">
                <img
                  className="d-none  img-cover d-md-block"
                  src={
                    require("assets/images/landing-pages/pharmacist-page-banner3.jpg")
                      .default
                  }
                  alt="img"
                />
                <img
                  className="d-block  img-cover d-md-none"
                  src={
                    require("assets/images/landing-pages/pharmacist-mobile-banner3.jpg")
                      .default
                  }
                  alt="img"
                />
              </div>
            </Slider>
            <div className="banner-caption">
              <div className="row no-gutters">
                <div className="col-md-7">
                  <div className="banner-label">
                    {t("userPages.forPharmacists")}
                  </div>
                  <img
                    className="logo-img"
                    src={
                      require("assets/images/landing-pages/miraxis-practice.svg")
                        .default
                    }
                    alt="img"
                  />
                  <h2>{t("userPages.yourPharmacySimplified")}</h2>
                  <ul className="list-icon-dot">
                    <li>{t("userPages.pharmacybannerList1")}</li>
                    <li>{t("userPages.dentistbannerList2")}</li>
                    <li>{t("userPages.dentistbannerList3")}</li>
                    <li>{t("userPages.dentistbannerList4")}</li>
                  </ul>
                  <h4 className="pt-2">{t("userPages.dentistbannerText")}</h4>
                  <button
                    className="button button-shadow  button-round button-width-large"
                    title={t("userPages.plan.cta1")}
                    onClick={this.props.SignupClick}
                  >
                    {t("userPages.plan.cta1")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="app-page">
          <FeatureNoteBlock
            Title={t("userPages.featuresForPharmacists")}
            Desc={t("userPages.featuresForDentistsDesc")}
          />
          <div className="feature-service-section">
            <div className="container">
              <div className="row-wrapper">
                <div className="service-row">
                  <div className="service-col">
                    <ServiceCard
                      Title={t("userPages.pharmacistFeatures.0.title")}
                      subTitle={t("userPages.pharmacistFeatures.0.subTitle")}
                      listText1={t("userPages.pharmacistFeatures.0.listText1")}
                      listText2={t("userPages.pharmacistFeatures.0.listText2")}
                      listText3={t("userPages.pharmacistFeatures.0.listText3")}
                      imgSrc={
                        require("assets/images/landing-pages/pharma-feature1.jpg")
                          .default
                      }
                    />
                  </div>
                  <div className="service-col">
                    <ServiceCard
                      Title={t("userPages.pharmacistFeatures.1.title")}
                      subTitle={t("userPages.pharmacistFeatures.1.subTitle")}
                      listText1={t("userPages.pharmacistFeatures.1.listText1")}
                      listText2={t("userPages.pharmacistFeatures.1.listText2")}
                      listText3={t("userPages.pharmacistFeatures.1.listText3")}
                      imgSrc={
                        require("assets/images/landing-pages/pharma-feature2.jpg")
                          .default
                      }
                    />
                  </div>
                </div>
                <div className="service-row">
                  <div className="service-col">
                    <ServiceCard
                      Title={t("userPages.pharmacistFeatures.2.title")}
                      subTitle={t("userPages.pharmacistFeatures.2.subTitle")}
                      listText1={t("userPages.pharmacistFeatures.2.listText1")}
                      listText2={t("userPages.pharmacistFeatures.2.listText2")}
                      listText3={t("userPages.pharmacistFeatures.2.listText3")}
                      imgSrc={
                        require("assets/images/landing-pages/pharma-feature4.jpg")
                          .default
                      }
                    />
                  </div>
                  <div className="service-col">
                    <ServiceCard
                      Title={t("userPages.pharmacistFeatures.3.title")}
                      subTitle={t("userPages.pharmacistFeatures.3.subTitle")}
                      listText1={t("userPages.pharmacistFeatures.3.listText1")}
                      listText2={t("userPages.pharmacistFeatures.3.listText2")}
                      listText3={t("userPages.pharmacistFeatures.3.listText3")}
                      imgSrc={
                        require("assets/images/landing-pages/pharma-feature5.jpg")
                          .default
                      }
                    />
                  </div>
                </div>
                <div className="service-row">
                  <div className="service-col title-width-390">
                    <ServiceCard
                      Title={t("userPages.pharmacistFeatures.4.title")}
                      asteriskText={true}
                      subTitle={t("userPages.pharmacistFeatures.4.subTitle")}
                      listText1={t("userPages.pharmacistFeatures.4.listText1")}
                      listText2={t("userPages.pharmacistFeatures.4.listText2")}
                      listText3={t("userPages.pharmacistFeatures.4.listText3")}
                      imgSrc={
                        require("assets/images/landing-pages/physician-feature6.jpg")
                          .default
                      }
                    />
                  </div>
                  <div className="service-col">
                    <ServiceCard
                      Title={t("userPages.pharmacistFeatures.5.title")}
                      subTitle={t("userPages.pharmacistFeatures.5.subTitle")}
                      listText1={t("userPages.pharmacistFeatures.5.listText1")}
                      listText2={t("userPages.pharmacistFeatures.5.listText2")}
                      listText3={t("userPages.pharmacistFeatures.5.listText3")}
                      imgSrc={
                        require("assets/images/landing-pages/pharma-feature6.jpg")
                          .default
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="hexagon-section">
            <div className="container">
              <Row className="align-items-center">
                <Col lg="7">
                  <div className="text-col">
                    <h2>
                      {" "}
                      {t("userPages.readyToTransformTheBusinessOfYourPharmacy")}
                    </h2>
                    <p>
                      <u className="cursor-pointer" onClick={scrollToPlan}>
                        {" "}
                        {t("userPages.dentistHexaDesc1")}
                      </u>{" "}
                      {t("userPages.pharmacyHexaDesc2")}
                    </p>
                  </div>
                </Col>
                <Col lg="5">
                  <div className="image-col">
                    <img
                      src={
                        require("assets/images/landing-pages/pharmacist-hexagon.svg")
                          .default
                      }
                      alt="icon"
                    />
                  </div>
                </Col>
              </Row>
            </div>
          </div>
          <HomePlansNew />
          <HomeReadyStart
            Title2={t("homePage.readyTitle2")}
            readyPharmacyDesc2={true}
            readyPersonnalDesc={false}
          />
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
})(_isLoading(withTranslation()(Pharmacist)));
