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

class Supplier extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.getConent({ id: 3 });
    this.props.getContactConent({ id: 5 });
    this.props.getCatTestimonial({ id: 5 });
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
          <div className="banner-new-section vendor-banner banner-block">
            <Slider {...bannerSettings}>
              <div className="slider-single">
                <img
                  className="d-none img-cover d-md-block"
                  src={
                    require("assets/images/landing-pages/vendor-page-banner.jpg")
                      .default
                  }
                  alt="img"
                />
                <img
                  className="d-block img-cover d-md-none"
                  src={
                    require("assets/images/landing-pages/vendor-mobile-banner.jpg")
                      .default
                  }
                  alt="img"
                />
              </div>
            </Slider>
            <div className="banner-caption">
              <div className="banner-label">{t("forSuppliers")}</div>
              <img
                className="logo-img"
                src={
                  require("assets/images/landing-pages/miraxis-supply.svg")
                    .default
                }
                alt="img"
              />
              <h4>{t("userPages.vendorBannerText1")}</h4>
              <div className="width-600">
                <ul className="list-icon-dot">
                  <li>{t("userPages.vendorbannerList1")}</li>
                  <li>{t("userPages.vendorbannerList2")}</li>
                  <li>{t("userPages.vendorbannerList3")}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="app-page">
          <FeatureNoteBlock
            Desc={t("userPages.featuresForVendorDesc")}
            Title={t("userPages.featuresForVendorTitle")}
          />
          <div className="feature-service-section vendor-feature">
            <div className="container">
              <div className="row-wrapper">
                <div className="service-row">
                  <div className="service-col">
                    <ServiceCard
                      Title={t("userPages.vendorFeatures.0.title")}
                      listText1={t("userPages.vendorFeatures.0.listText1")}
                      listText2={t("userPages.vendorFeatures.0.listText2")}
                      listText3={t("userPages.vendorFeatures.0.listText3")}
                      imgSrc={
                        require("assets/images/landing-pages/feature-vendor-1.jpg")
                          .default
                      }
                    />
                  </div>
                  <div className="service-col">
                    <ServiceCard
                      Title={t("userPages.vendorFeatures.1.title")}
                      listText1={t("userPages.vendorFeatures.1.listText1")}
                      listText2={t("userPages.vendorFeatures.1.listText2")}
                      listText3={t("userPages.vendorFeatures.1.listText3")}
                      imgSrc={
                        require("assets/images/landing-pages/feature-vendor-2.jpg")
                          .default
                      }
                    />
                  </div>
                </div>
                <div className="service-row">
                  <div className="service-col">
                    <ServiceCard
                      Title={t("userPages.vendorFeatures.2.title")}
                      listText1={t("userPages.vendorFeatures.2.listText1")}
                      listText2={t("userPages.vendorFeatures.2.listText2")}
                      listText3={t("userPages.vendorFeatures.2.listText3")}
                      imgSrc={
                        require("assets/images/landing-pages/feature-vendor-3.jpg")
                          .default
                      }
                    />
                  </div>
                  <div className="service-col">
                    <ServiceCard
                      Title={t("userPages.vendorFeatures.3.title")}
                      listText1={t("userPages.vendorFeatures.3.listText1")}
                      listText2={t("userPages.vendorFeatures.3.listText2")}
                      listText3={t("userPages.vendorFeatures.3.listText2")}
                      imgSrc={
                        require("assets/images/landing-pages/feature-vendor-4.jpg")
                          .default
                      }
                    />
                  </div>
                </div>
                <div className="service-row">
                  <div className="service-col title-width-390">
                    <ServiceCard
                      Title={t("userPages.vendorFeatures.4.title")}
                      listText1={t("userPages.vendorFeatures.4.listText1")}
                      listText2={t("userPages.vendorFeatures.4.listText2")}
                      listText3={t("userPages.vendorFeatures.4.listText3")}
                      imgSrc={
                        require("assets/images/landing-pages/feature-vendor-5.jpg")
                          .default
                      }
                    />
                  </div>
                  <div className="service-col">
                    <ServiceCard
                      Title={t("userPages.vendorFeatures.5.title")}
                      listText1={t("userPages.vendorFeatures.5.listText1")}
                      listText2={t("userPages.vendorFeatures.5.listText2")}
                      listText3={t("userPages.vendorFeatures.5.listText3")}
                      imgSrc={
                        require("assets/images/landing-pages/feature-vendor-6.jpg")
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
                      {t("userPages.readyToTransformVendorDesc1")}{" "}
                      {t("userPages.readyToTransformVendorDesc2")}
                    </p>
                  </div>
                </Col>
                <Col lg="5">
                  <div className="image-col">
                    <img
                      src={
                        require("assets/images/landing-pages/vendor-hexagon.svg")
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
            readySupplierDesc={true}
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
})(_isLoading(withTranslation()(Supplier)));
