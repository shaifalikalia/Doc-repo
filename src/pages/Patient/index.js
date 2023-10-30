import React, { Component, Fragment } from "react";
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
import { Col, Row } from "reactstrap";
import { Link } from "react-router-dom";
import constants from "../../constants";
import Slider from "react-slick";

class Patient extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.getConent({ id: 3 });
    this.props.getContactConent({ id: 5 });
    this.props.getCatTestimonial({ id: 1 });
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
          <div className="banner-new-section patient-banner banner-block">
            <Slider {...bannerSettings}>
              <div className="slider-single slide-1">
                <img
                  className="d-none  img-cover d-md-block"
                  src={
                    require("assets/images/landing-pages/patient-banner-desktop.jpg")
                      .default
                  }
                  alt="img"
                />
                <img
                  className="d-block  img-cover d-md-none"
                  src={
                    require("assets/images/landing-pages/patient-banner-mobile.jpg")
                      .default
                  }
                  alt="img"
                />
              </div>
              <div className="slider-single slide-2">
                <img
                  className="d-none  img-cover d-md-block"
                  src={
                    require("assets/images/landing-pages/patient-banner-desktop2.jpg")
                      .default
                  }
                  alt="img"
                />
                <img
                  className="d-block   img-cover d-md-none"
                  src={
                    require("assets/images/landing-pages/patient-banner-mobile2.jpg")
                      .default
                  }
                  alt="img"
                />
              </div>
              <div className="slider-single">
                <img
                  className="d-none  img-cover d-md-block"
                  src={
                    require("assets/images/landing-pages/patient-banner-desktop3.jpg")
                      .default
                  }
                  alt="img"
                />
                <img
                  className="d-block   img-cover d-md-none"
                  src={
                    require("assets/images/landing-pages/patient-banner-mobile3.jpg")
                      .default
                  }
                  alt="img"
                />
              </div>
            </Slider>
            <div className="banner-caption">
              <div className="patient-banner-text">
                <div className="banner-label">{t("userPages.forPatients")}</div>
                <img
                  className="logo-img"
                  src={
                    require("assets/images/landing-pages/miraxis-patient.svg")
                      .default
                  }
                  alt="img"
                />
                <h2>{t("userPages.aHealthierApproachToYourCare")}</h2>
                <ul className="list-icon-dot">
                  <li>{t("userPages.patientbannerList1")}</li>
                  <li>{t("userPages.patientbannerList2")}</li>
                  <li>{t("userPages.patientbannerList3")}</li>
                  <li>{t("userPages.patientbannerList4")}</li>
                </ul>
                <h4 className="pt-2">{t("userPages.itsAllFree")}</h4>
                <div className="patient-btn-box d-md-flex">
                  <button
                    onClick={() =>
                      window?.open(constants.DOWNLOADLINK.appStore, "_blank")
                    }
                    className="button button-shadow   button-round button-width-large mr-3 mb-2"
                    title={t("userPages.downloadYourFreeAppHere")}
                  >
                    {t("userPages.downloadYourFreeAppHere")}
                  </button>
                  <span>
                    {" "}
                    <Link
                      to="/doctors"
                      className="button button-round button-dark button-border search-btn mb-md-2"
                    >
                      {" "}
                      <span className="search-ico mr-2 pr-1">
                        <img
                          src={
                            require("assets/images/search-green.svg").default
                          }
                          alt="icon"
                          className="green-icon"
                        />
                        <img
                          src={
                            require("assets/images/search-icon-white.svg")
                              .default
                          }
                          alt="icon"
                          className="white-icon"
                        />
                      </span>
                      {t("userPages.findDoctorsInYourArea")}
                    </Link>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="app-page">
          <FeatureNoteBlock
            Title={t("userPages.puttingPatientsFirst")}
            Desc={t(
              "userPages.miraxisPatientHelpsYouNavigateYourHealthcareJourneyWithEase"
            )}
          />
          <div className="feature-service-section patient-feature">
            <div className="container">
              <div className="row-wrapper">
                <div className="service-row">
                  <div className="service-col">
                    <ServiceCard
                      Title={t("userPages.patientFeatures.0.title")}
                      subTitle={t("userPages.patientFeatures.0.subTitle")}
                      listText1={t("userPages.patientFeatures.0.listText1")}
                      listText2={t("userPages.patientFeatures.0.listText2")}
                      listText3={t("userPages.patientFeatures.0.listText3")}
                      imgSrc={
                        require("assets/images/landing-pages/patient-feature1.jpg")
                          .default
                      }
                    />
                  </div>
                  <div className="service-col">
                    <ServiceCard
                      Title={t("userPages.patientFeatures.1.title")}
                      subTitle={t("userPages.patientFeatures.1.subTitle")}
                      listText1={t("userPages.patientFeatures.1.listText1")}
                      listText2={t("userPages.patientFeatures.1.listText2")}
                      listText3={t("userPages.patientFeatures.1.listText3")}
                      imgSrc={
                        require("assets/images/landing-pages/patient-feature2.jpg")
                          .default
                      }
                    />
                  </div>
                </div>
                <div className="service-row">
                  <div className="service-col">
                    <ServiceCard
                      Title={t("userPages.patientFeatures.2.title")}
                      subTitle={t("userPages.patientFeatures.2.subTitle")}
                      listText1={t("userPages.patientFeatures.2.listText1")}
                      listText2={t("userPages.patientFeatures.2.listText2")}
                      listText3={t("userPages.patientFeatures.2.listText3")}
                      imgSrc={
                        require("assets/images/landing-pages/patient-feature3.jpg")
                          .default
                      }
                    />
                  </div>
                  <div className="service-col">
                    <ServiceCard
                      Title={t("userPages.patientFeatures.3.title")}
                      subTitle={t("userPages.patientFeatures.3.subTitle")}
                      listText1={t("userPages.patientFeatures.3.listText1")}
                      listText2={t("userPages.patientFeatures.3.listText2")}
                      listText3={t("userPages.patientFeatures.3.listText3")}
                      imgSrc={
                        require("assets/images/landing-pages/patient-feature4.jpg")
                          .default
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="create-free-account">
            <div className="container">
              <Row>
                <Col xl="6" lg="7">
                  <h2>{t("userPages.getStartedForFree")}</h2>
                  <p>{t("userPages.getStartedForFreeDesc")}</p>
                  <button
                    className="button  button-round button-width-large"
                    onClick={this.props.SignupClick}
                    title={t("signup1")}
                  >
                    {t("signup1")}
                  </button>
                  <div className="mobile-img d-md-none d-block">
                    <img
                      className="logo-img"
                      src={
                        require("assets/images/landing-pages/free-account-mobile.png")
                          .default
                      }
                      alt="img"
                    />
                  </div>
                </Col>
              </Row>
            </div>
          </div>
          <HomeContact companyInformation={this.props.companyInformation} />
          {testimonialList && testimonialList.length > 0 && (
            <HomeTestimoninal
              title={t("userPages.testimonialPatientTitle")}
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
})(withTranslation()(_isLoading(Patient)));
