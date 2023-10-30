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

class Personnel extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.getConent({ id: 3 });
    this.props.getContactConent({ id: 5 });
    this.props.getCatTestimonial({ id: 4 });
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
          <div className="banner-new-section personnel-banner banner-block">
            <Slider {...bannerSettings}>
              <div className="slider-single">
                <img
                  className="d-none img-cover  d-md-block"
                  src={
                    require("assets/images/landing-pages/personnel-page-banner.jpg")
                      .default
                  }
                  alt="img"
                />
                <img
                  className="d-block img-cover  d-md-none"
                  src={
                    require("assets/images/landing-pages/personnel-mobile-banner.jpg")
                      .default
                  }
                  alt="img"
                />
              </div>
              <div className="slider-single">
                <img
                  className="d-none img-cover  d-md-block"
                  src={
                    require("assets/images/landing-pages/personnel-page-banner2.jpg")
                      .default
                  }
                  alt="img"
                />
                <img
                  className="d-block img-cover  d-md-none"
                  src={
                    require("assets/images/landing-pages/personnel-mobile-banner2.jpg")
                      .default
                  }
                  alt="img"
                />
              </div>
              <div className="slider-single">
                <img
                  className="d-none img-cover img-right d-md-block"
                  src={
                    require("assets/images/landing-pages/personnel-page-banner3.jpg")
                      .default
                  }
                  alt="img"
                />
                <img
                  className="d-block img-cover  d-md-none"
                  src={
                    require("assets/images/landing-pages/personnel-mobile-banner3.jpg")
                      .default
                  }
                  alt="img"
                />
              </div>
            </Slider>
            <div className="banner-caption">
              <div className="banner-label">{t("userPages.forPersonnel")}</div>
              <img
                className="logo-img"
                src={
                  require("assets/images/landing-pages/miraxis-practice.svg")
                    .default
                }
                alt="img"
              />
              <h4 className="personnel-heading">
                {t("userPages.personnelBannerText1")}
              </h4>

              <div className="banner-text-width">
                <ul className="list-icon-dot">
                  <li>{t("userPages.personnelbannerList1")}</li>
                  <li>{t("userPages.personnelbannerList2")}</li>
                  <li>{t("userPages.personnelbannerList3")}</li>
                  <li>{t("userPages.personnelbannerList4")}</li>
                </ul>
                <button
                  className="button button-shadow  button-round button-width-large"
                  onClick={this.props.SignupClick}
                  title={t("userPagespersonnelbannerBtn")}
                >
                  {t("userPages.personnelbannerBtn")}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="app-page">
          <FeatureNoteBlock
            Title={t("userPages.featuresForHealthcarePersonnel")}
            Desc={t("userPages.featuresForHealthcarePersonnelDesc")}
          />
          <div className="feature-service-section personnel-service-section">
            <div className="container">
              <div className="row-wrapper">
                <div className="service-row">
                  <div className="service-col">
                    <ServiceCard
                      Title={t("userPages.personnelFeatures.0.title")}
                      subTitle={t("userPages.personnelFeatures.0.subTitle")}
                      listText1={t("userPages.personnelFeatures.0.listText1")}
                      listText2={t("userPages.personnelFeatures.0.listText2")}
                      imgSrc={
                        require("assets/images/landing-pages/staff-management.jpg")
                          .default
                      }
                    />
                  </div>
                  <div className="service-col">
                    <ServiceCard
                      Title={t("userPages.personnelFeatures.1.title")}
                      subTitle={t("userPages.personnelFeatures.1.subTitle")}
                      listText1={t("userPages.personnelFeatures.1.listText1")}
                      listText2={t("userPages.personnelFeatures.1.listText2")}
                      listText3={t("userPages.personnelFeatures.1.listText3")}
                      imgSrc={
                        require("assets/images/landing-pages/feature-personnel-2.jpg")
                          .default
                      }
                    />
                  </div>
                </div>
                <div className="service-row">
                  <div className="service-col  title-width-390">
                    <ServiceCard
                      Title={t("userPages.personnelFeatures.2.title")}
                      subTitle={t("userPages.personnelFeatures.2.subTitle")}
                      listText1={t("userPages.personnelFeatures.2.listText1")}
                      listText2={t("userPages.personnelFeatures.2.listText2")}
                      listText3={t("userPages.personnelFeatures.2.listText3")}
                      imgSrc={
                        require("assets/images/landing-pages/feature-personnel-3.jpg")
                          .default
                      }
                    />
                  </div>
                  <div className="service-col">
                    <ServiceCard
                      Title={t("userPages.personnelFeatures.3.title")}
                      subTitle={t("userPages.personnelFeatures.3.subTitle")}
                      listText1={t("userPages.personnelFeatures.3.listText1")}
                      listText2={t("userPages.personnelFeatures.3.listText2")}
                      listText3={t("userPages.personnelFeatures.3.listText3")}
                      imgSrc={
                        require("assets/images/landing-pages/feature-personnel-4.jpg")
                          .default
                      }
                    />
                  </div>
                </div>
                <div className="service-row">
                  <div className="service-col">
                    <ServiceCard
                      Title={t("userPages.personnelFeatures.4.title")}
                      subTitle={t("userPages.personnelFeatures.4.subTitle")}
                      listText1={t("userPages.personnelFeatures.4.listText1")}
                      listText2={t("userPages.personnelFeatures.4.listText2")}
                      listText3={t("userPages.personnelFeatures.4.listText3")}
                      imgSrc={
                        require("assets/images/landing-pages/feature-personnel-5.jpg")
                          .default
                      }
                    />
                  </div>
                  <div className="service-col">
                    <ServiceCard
                      Title={t("userPages.personnelFeatures.5.title")}
                      subTitle={t("userPages.personnelFeatures.5.subTitle")}
                      listText1={t("userPages.personnelFeatures.5.listText1")}
                      listText2={t("userPages.personnelFeatures.5.listText2")}
                      listText3={t("userPages.personnelFeatures.5.listText3")}
                      imgSrc={
                        require("assets/images/landing-pages/feature-personnel-6.jpg")
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
                    <h2> {t("userPages.readyToTakeControl")}</h2>
                    <p>
                      {" "}
                      {t("userPages.readyToTakeControlDesc1")} <br />
                      <u
                        className="cursor-pointer"
                        onClick={this.props.SignupClick}
                      >
                        {t("userPages.readyToTakeControlDesc2")}
                      </u>
                    </p>
                  </div>
                </Col>
                <Col lg="5">
                  <div className="image-col">
                    <img
                      src={
                        require("assets/images/landing-pages/personnel-hexagon.svg")
                          .default
                      }
                      alt="icon"
                    />
                  </div>
                </Col>
              </Row>
            </div>
          </div>

          <div className="create-free-account personnel-account">
            <div className="container">
              <h2>{t("userPages.createFreeAccount")}</h2>
              <p>{t("userPages.createAFreeAccountDescPersonnel")}</p>
              <div className="account-card">
                <img
                  src={
                    require("assets/images/landing-pages/account-icon.svg")
                      .default
                  }
                  alt="img"
                />
                <h3>{t("userPages.signupForPersonnelAccount")}</h3>
                <h2 className="free-heading">{t("userPages.free")}</h2>
                <button
                  className="button  button-round"
                  onClick={this.props.SignupClick}
                  title={t("createAccount")}
                >
                  {t("userPages.createAccount")}
                </button>
              </div>
            </div>
          </div>
          <HomeReadyStart
            Title2={t("homePage.readyTitle2")}
            Title1={false}
            readyPersonnalDesc={true}
            readyPersonnalDesc1={t("homePage.readyPersonnalDesc1")}
            readyPersonnalDesc2={t("homePage.readyPersonnalDesc2")}
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
})(_isLoading(withTranslation()(Personnel)));
