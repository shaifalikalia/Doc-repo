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

class HealthcareEnterprise extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.getConent({ id: 3 });
    this.props.getContactConent({ id: 5 });
    this.props.getCatTestimonial({ id: 6 });
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
          <div className="banner-new-section heathcare-banner banner-block">
            <Slider {...bannerSettings}>
              <div className="slider-single">
                <img
                  className="d-none img-cover img-desktop  d-md-block"
                  src={
                    require("assets/images/landing-pages/healthcare-page-banner.jpg")
                      .default
                  }
                  alt="img"
                />
                <img
                  className="d-block img-cover   img-right d-md-none"
                  src={
                    require("assets/images/landing-pages/healthcare-mobile-banner.jpg")
                      .default
                  }
                  alt="img"
                />
              </div>
            </Slider>
            <div className="banner-caption">
              <div className="banner-label">
                {t("userPages.forHealthcareEnterprise")}
              </div>
              <h2 className="font-46">
                {t("userPages.healthcareBannerHeading1")} <br />{" "}
                {t("userPages.healthcareBannerHeading2")} <br />{" "}
                {t("userPages.healthcareBannerHeading3")}
              </h2>
              <div className="width-500">
                <p>{t("userPages.healthcareBannerDesc")}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="app-page">
          <section className="everything-you-need-section">
            <div className="container">
              <div className="col-xl-9 p-0">
                <h3>{t("userPages.everythingYouNeedAllInOnePlace")}</h3>
                <p>
                  <strong>
                    {t("userPages.everythingYouNeedAllInOnePlaceDesc1")}
                  </strong>{" "}
                  {t("userPages.everythingYouNeedAllInOnePlaceDesc2")}
                </p>
              </div>
              <div className="everything-row-wrapper flex-row-reverse  d-none">
                <div className="img-col">
                  <p>
                    {" "}
                    <img
                      src={
                        require("assets/images/landing-pages/healthcare-img1.png")
                          .default
                      }
                      alt="icon"
                      className="green-icon"
                    />
                  </p>{" "}
                </div>
                <div className="text-col">
                  <p>{t("userPages.everythingText1")}</p>
                </div>
              </div>
              <div className="everything-row-wrapper  d-none">
                <div className="img-col">
                  <p>
                    {" "}
                    <img
                      src={
                        require("assets/images/landing-pages/healthcare-img2.png")
                          .default
                      }
                      alt="icon"
                      className="green-icon"
                    />
                  </p>{" "}
                </div>
                <div className="text-col">
                  <p>{t("userPages.everythingText2")}</p>
                </div>
              </div>
            </div>
          </section>

          <FeatureNoteBlock
            Title={t("userPages.featuresForHealthcareEnterprises")}
            Desc={t("userPages.featuresForHealthcareEnterprisesDesc")}
          />
          <div className="feature-service-section enterprise-feature">
            <div className="container">
              <div className="row-wrapper">
                <div className="service-row ">
                  <div className="service-col left-card">
                    <ServiceCard
                      Title={t("userPages.healthcareFeatures.0.title")}
                      listText1={t("userPages.healthcareFeatures.0.listText1")}
                      listText2={t("userPages.healthcareFeatures.0.listText2")}
                      listText3={t("userPages.healthcareFeatures.0.listText3")}
                      listText4={t("userPages.healthcareFeatures.0.listText4")}
                      listText5={t("userPages.healthcareFeatures.0.listText5")}
                      imgSrc={
                        require("assets/images/landing-pages/feature-healthcare-1.jpg")
                          .default
                      }
                    />
                    <ServiceCard
                      Title={t("userPages.healthcareFeatures.2.title")}
                      listText1={t("userPages.healthcareFeatures.2.listText1")}
                      listText2={t("userPages.healthcareFeatures.2.listText2")}
                      listText3={t("userPages.healthcareFeatures.2.listText3")}
                      imgSrc={
                        require("assets/images/landing-pages/feature-healthcare-3.jpg")
                          .default
                      }
                    />
                    <ServiceCard
                      Title={t("userPages.healthcareFeatures.4.title")}
                      listText1={t("userPages.healthcareFeatures.4.listText1")}
                      listText2={t("userPages.healthcareFeatures.4.listText2")}
                      listText3={t("userPages.healthcareFeatures.4.listText3")}
                      imgSrc={
                        require("assets/images/landing-pages/feature-healthcare-5.jpg")
                          .default
                      }
                    />
                  </div>
                  <div className="service-col">
                    <ServiceCard
                      Title={t("userPages.healthcareFeatures.1.title")}
                      listText1={t("userPages.healthcareFeatures.1.listText1")}
                      listText2={t("userPages.healthcareFeatures.1.listText2")}
                      listText3={t("userPages.healthcareFeatures.1.listText3")}
                      imgSrc={
                        require("assets/images/landing-pages/feature-healthcare-2.jpg")
                          .default
                      }
                    />
                    <ServiceCard
                      Title={t("userPages.healthcareFeatures.3.title")}
                      listText1={t("userPages.healthcareFeatures.3.listText1")}
                      listText2={t("userPages.healthcareFeatures.3.listText2")}
                      listText3={t("userPages.healthcareFeatures.3.listText3")}
                      imgSrc={
                        require("assets/images/landing-pages/feature-healthcare-4.jpg")
                          .default
                      }
                    />
                    <ServiceCard
                      Title={t("userPages.healthcareFeatures.5.title")}
                      asteriskText={true}
                      listText1={t("userPages.healthcareFeatures.5.listText1")}
                      listText2={t("userPages.healthcareFeatures.5.listText2")}
                      listText3={t("userPages.healthcareFeatures.5.listText3")}
                      imgSrc={
                        require("assets/images/landing-pages/feature-healthcare-6.jpg")
                          .default
                      }
                    />
                    <ServiceCard
                      Title={t("userPages.healthcareFeatures.6.title")}
                      listText1={t("userPages.healthcareFeatures.6.listText1")}
                      listText2={t("userPages.healthcareFeatures.6.listText2")}
                      listText3={t("userPages.healthcareFeatures.6.listText3")}
                      imgSrc={
                        require("assets/images/landing-pages/feature-healthcare-7.jpg")
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
                    <h2> {t("userPages.readyToTransformYourBusiness")}</h2>
                    <p>
                      {t("userPages.healthcareHexagonDesc1")}{" "}
                      {t("userPages.healthcareHexagonDesc2")}
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
          <HomeReadyStart
            Title2={t("homePage.readyTitle2")}
            readyHealthcareDesc={true}
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
})(_isLoading(withTranslation()(HealthcareEnterprise)));
