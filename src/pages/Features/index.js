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
import Slider from "react-slick";
import FeaturesServiceCard from "./FeaturesServiceCard";
import OutsideClickHandler from "react-outside-click-handler";

class Features extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedListItem: {
        text: this.props.t("featuresLanding.services.0.rowHeading"),
        secId: "features-staff-management",
      },
      showDropdown: false,
    };
  }
  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.getConent({ id: 3 });
    this.props.getContactConent({ id: 5 });
    this.props.getCatTestimonial({ id: 8 });
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
    const settings = {
      dots: true,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 1,
      arrows: false,
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
            slidesToScroll: 1,
          },
        },
      ],
    };

    const toggleDropdown = () => {
      this.setState({
        showDropdown: !this.state.showDropdown,
      });
    };

    const selectDropdownItem = (item) => {
      this.setState({
        selectedListItem: item,
        showDropdown: false,
      });
      if (item.secId) {
        const element = document.getElementById(item.secId);
        if (element) {
          const headerOffset = 70;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            behavior: "smooth",
            top: offsetPosition,
          });
        }
      }
    };
    const dropdownData = [
      {
        text: t("featuresLanding.services.0.rowHeading"),
        secId: "staff-management",
      },
      {
        text: t("featuresLanding.services.1.rowHeading"),
        secId: "job-personnel",
      },
      {
        text: t("featuresLanding.services.2.rowHeading"),
        secId: "virtual-hr-manager",
      },
      {
        text: t("featuresLanding.services.3.rowHeading"),
        secId: "online-patient-services",
      },
      {
        text: t("featuresLanding.services.4.rowHeading"),
        secId: "personnel-scheduler",
      },
      {
        text: t("featuresLanding.services.5.rowHeading"),
        secId: "leave-timeoff-tracking",
      },
      {
        text: t("featuresLanding.services.6.rowHeading"),
        secId: "timesheet-management",
      },
      {
        text: t("featuresLanding.services.7.rowHeading"),
        secId: "online-legal-forms",
      },
      {
        text: t("featuresLanding.services.8.rowHeading"),
        secId: "peer-review-and-patient-referral",
      },
      {
        text: t("featuresLanding.services.9.rowHeading"),
        secId: "tele-health",
      },
      {
        text: t("featuresLanding.services.10.rowHeading"),
        secId: "business-dashboards",
      },
      {
        text: t("featuresLanding.services.11.rowHeading"),
        secId: "inventory-supply-management",
      },
      {
        text: t("featuresLanding.services.12.rowHeading"),
        secId: "order-delivery-management",
      },
    ];

    return (
      <Fragment>
        <div className="landing-page-block">
          <div className="banner-new-section features-banner banner-block">
            <Slider {...bannerSettings}>
              <div className="slider-single">
                <img
                  className="d-none img-cover d-md-block"
                  src={
                    require("assets/images/landing-pages/features-web-banner.jpg")
                      .default
                  }
                  alt="img"
                />
                <img
                  className="d-block img-cover img-right d-md-none"
                  src={
                    require("assets/images/landing-pages/features-mobile-banner.jpg")
                      .default
                  }
                  alt="img"
                />
              </div>
            </Slider>
            <div className="banner-caption">
              <div className="text-width">
                <div className="banner-label">{t("AppsFeatures")}</div>
                <h2 className="font-46">
                  {t("featuresLanding.featuresBannerHeading")}
                </h2>
                <p>{t("featuresLanding.featuresBannerDesc")}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="app-page">
          <div className="overview-green-bg-section features-green-sec">
            <div className="container">
              <div className="overview-slider">
                <Slider {...settings}>
                  <div className="card-block">
                    <h4 className="heading-title">
                      {t("featuresSlider.sliderText1")}
                    </h4>
                    <img
                      className="img-1"
                      src={
                        require("assets/images/landing-pages/features-slider-img1.png")
                          .default
                      }
                      alt="img"
                    />
                  </div>
                  <div className="card-block">
                    <h4 className="heading-title">
                      {t("featuresSlider.sliderText2")}
                    </h4>
                    <img
                      className="img-2"
                      src={
                        require("assets/images/landing-pages/features-slider-img2.png")
                          .default
                      }
                      alt="img"
                    />
                  </div>
                  <div className="card-block">
                    <h4 className="heading-title">
                      {t("featuresSlider.sliderText3")}
                    </h4>
                    <img
                      className="img-3"
                      src={
                        require("assets/images/landing-pages/features-slider-img3.png")
                          .default
                      }
                      alt="img"
                    />
                  </div>
                </Slider>
              </div>
            </div>
          </div>
          <FeaturesServiceCard
            secId="staff-management"
            SignupClick={this.props.SignupClick}
            rowHeading={t("featuresLanding.services.0.rowHeading")}
            rowTagline={t("featuresLanding.services.0.rowTagline")}
            rowDesc={t("featuresLanding.services.0.rowDesc")}
            rowImage={
              require("assets/images/landing-pages/features-service1.png")
                .default
            }
            mobileImage={
              require("assets/images/landing-pages/features-mobile-service1.png")
                .default
            }
            ctaText={t("featuresLanding.services.0.ctaText")}
            sliderCard1Title={t("featuresLanding.services.0.slider.0.title")}
            sliderCard1Text1={t("featuresLanding.services.0.slider.0.text1")}
            sliderCard1Text2={t("featuresLanding.services.0.slider.0.text2")}
            sliderCard1Text3={t("featuresLanding.services.0.slider.0.text3")}
            sliderCard1Text4={t("featuresLanding.services.0.slider.0.text4")}
            sliderCard2Title={t("featuresLanding.services.0.slider.1.title")}
            sliderCard2Text1={t("featuresLanding.services.0.slider.1.text1")}
            sliderCard2Text2={t("featuresLanding.services.0.slider.1.text2")}
            sliderCard2Text3={t("featuresLanding.services.0.slider.1.text3")}
            sliderCard3Title={t("featuresLanding.services.0.slider.2.title")}
            sliderCard3Text1={t("featuresLanding.services.0.slider.2.text1")}
            sliderCard3Text2={t("featuresLanding.services.0.slider.2.text2")}
            sliderCard3Text3={t("featuresLanding.services.0.slider.2.text3")}
          />
          <FeaturesServiceCard
            secId="job-personnel"
            SignupClick={this.props.SignupClick}
            rowReverse={true}
            rowHeading={t("featuresLanding.services.1.rowHeading")}
            rowTagline={t("featuresLanding.services.1.rowTagline")}
            rowDesc={t("featuresLanding.services.1.rowDesc")}
            rowImage={
              require("assets/images/landing-pages/features-service2.png")
                .default
            }
            mobileImage={
              require("assets/images/landing-pages/features-mobile-service2.png")
                .default
            }
            ctaText={t("featuresLanding.services.1.ctaText")}
            sliderCard1Title={t("featuresLanding.services.1.slider.0.title")}
            sliderCard1Text1={t("featuresLanding.services.1.slider.0.text1")}
            sliderCard1Text2={t("featuresLanding.services.1.slider.0.text2")}
            sliderCard1Text3={t("featuresLanding.services.1.slider.0.text3")}
            sliderCard2Title={t("featuresLanding.services.1.slider.1.title")}
            sliderCard2Text1={t("featuresLanding.services.1.slider.1.text1")}
            sliderCard2Text2={t("featuresLanding.services.1.slider.1.text2")}
            sliderCard3Title={t("featuresLanding.services.1.slider.2.title")}
            sliderCard3Text1={t("featuresLanding.services.1.slider.2.text1")}
            sliderCard3Text2={t("featuresLanding.services.1.slider.2.text2")}
          />
          <FeaturesServiceCard
            secId="virtual-hr-manager"
            SignupClick={this.props.SignupClick}
            rowHeading={t("featuresLanding.services.2.rowHeading")}
            rowTagline={t("featuresLanding.services.2.rowTagline")}
            rowDesc={t("featuresLanding.services.2.rowDesc")}
            rowImage={
              require("assets/images/landing-pages/features-service3.png")
                .default
            }
            mobileImage={
              require("assets/images/landing-pages/features-mobile-service3.png")
                .default
            }
            ctaText={t("featuresLanding.services.2.ctaText")}
            sliderCard1Title={t("featuresLanding.services.2.slider.0.title")}
            sliderCard1Text1={t("featuresLanding.services.2.slider.0.text1")}
            sliderCard1Text2={t("featuresLanding.services.2.slider.0.text2")}
            sliderCard1Text3={t("featuresLanding.services.2.slider.0.text3")}
            sliderCard2Title={t("featuresLanding.services.2.slider.1.title")}
            sliderCard2Text1={t("featuresLanding.services.2.slider.1.text1")}
            sliderCard2Text2={t("featuresLanding.services.2.slider.1.text2")}
            sliderCard2Text3={t("featuresLanding.services.2.slider.1.text3")}
            sliderCard3Title={t("featuresLanding.services.2.slider.2.title")}
            sliderCard3Text1={t("featuresLanding.services.2.slider.2.text1")}
            sliderCard3Text2={t("featuresLanding.services.2.slider.2.text2")}
            sliderCard3Text3={t("featuresLanding.services.2.slider.2.text3")}
          />
          <FeaturesServiceCard
            secId="online-patient-services"
            SignupClick={this.props.SignupClick}
            sliderInnerList={true}
            rowReverse={true}
            rowHeading={t("featuresLanding.services.3.rowHeading")}
            rowTagline={t("featuresLanding.services.3.rowTagline")}
            rowDesc={t("featuresLanding.services.3.rowDesc")}
            rowImage={
              require("assets/images/landing-pages/features-service4.png")
                .default
            }
            mobileImage={
              require("assets/images/landing-pages/features-mobile-service4.png")
                .default
            }
            ctaText={t("featuresLanding.services.3.ctaText")}
            sliderCard1Title={t("featuresLanding.services.3.slider.0.title")}
            sliderCard1Text1={t("featuresLanding.services.3.slider.0.text1")}
            sliderCard1Text2={t("featuresLanding.services.3.slider.0.text2")}
            sliderCard1Text3={t("featuresLanding.services.3.slider.0.text3")}
            sliderCard2Title={t("featuresLanding.services.3.slider.1.title")}
            sliderCard2Text1={t("featuresLanding.services.3.slider.1.text1")}
            sliderCard2Text2={t("featuresLanding.services.3.slider.1.text2")}
            textList1={t("featuresLanding.services.3.slider.1.textList1")}
            textList2={t("featuresLanding.services.3.slider.1.textList2")}
            textList3={t("featuresLanding.services.3.slider.1.textList3")}
            textList4={t("featuresLanding.services.3.slider.1.textList4")}
            textList5={t("featuresLanding.services.3.slider.1.textList5")}
            textList6={t("featuresLanding.services.3.slider.1.textList6")}
            textList7={t("featuresLanding.services.3.slider.1.textList7")}
            sliderCard3Title={t("featuresLanding.services.3.slider.2.title")}
            sliderCard3Text1={t("featuresLanding.services.3.slider.2.text1")}
            sliderCard3Text2={t("featuresLanding.services.3.slider.2.text2")}
          />
          <FeaturesServiceCard
            secId="personnel-scheduler"
            SignupClick={this.props.SignupClick}
            rowHeading={t("featuresLanding.services.4.rowHeading")}
            rowTagline={t("featuresLanding.services.4.rowTagline")}
            rowDesc={t("featuresLanding.services.4.rowDesc")}
            rowImage={
              require("assets/images/landing-pages/features-service5.png")
                .default
            }
            mobileImage={
              require("assets/images/landing-pages/features-mobile-service5.png")
                .default
            }
            ctaText={t("featuresLanding.services.4.ctaText")}
            sliderCard1Title={t("featuresLanding.services.4.slider.0.title")}
            sliderCard1Text1={t("featuresLanding.services.4.slider.0.text1")}
            sliderCard1Text2={t("featuresLanding.services.4.slider.0.text2")}
            sliderCard2Title={t("featuresLanding.services.4.slider.1.title")}
            sliderCard2Text1={t("featuresLanding.services.4.slider.1.text1")}
            sliderCard2Text2={t("featuresLanding.services.4.slider.1.text2")}
            sliderCard3Title={t("featuresLanding.services.4.slider.2.title")}
            sliderCard3Text1={t("featuresLanding.services.4.slider.2.text1")}
            sliderCard3Text2={t("featuresLanding.services.4.slider.2.text2")}
            sliderCard3Text3={t("featuresLanding.services.4.slider.2.text3")}
          />
          <FeaturesServiceCard
            secId="leave-timeoff-tracking"
            SignupClick={this.props.SignupClick}
            rowReverse={true}
            rowHeading={t("featuresLanding.services.5.rowHeading")}
            rowTagline={t("featuresLanding.services.5.rowTagline")}
            rowDesc={t("featuresLanding.services.5.rowDesc")}
            rowImage={
              require("assets/images/landing-pages/features-service6.png")
                .default
            }
            mobileImage={
              require("assets/images/landing-pages/features-mobile-service6.png")
                .default
            }
            ctaText={t("featuresLanding.services.5.ctaText")}
            sliderCard1Title={t("featuresLanding.services.5.slider.0.title")}
            sliderCard1Text1={t("featuresLanding.services.5.slider.0.text1")}
            sliderCard1Text2={t("featuresLanding.services.5.slider.0.text2")}
            sliderCard2Title={t("featuresLanding.services.5.slider.1.title")}
            sliderCard2Text1={t("featuresLanding.services.5.slider.1.text1")}
            sliderCard2Text2={t("featuresLanding.services.5.slider.1.text2")}
            sliderCard2Text3={t("featuresLanding.services.5.slider.1.text3")}
            sliderCard2Text4={t("featuresLanding.services.5.slider.1.text4")}
            sliderCard3Title={t("featuresLanding.services.5.slider.2.title")}
            sliderCard3Text1={t("featuresLanding.services.5.slider.2.text1")}
            sliderCard3Text2={t("featuresLanding.services.5.slider.2.text2")}
            sliderCard3Text3={t("featuresLanding.services.5.slider.2.text3")}
          />
          <FeaturesServiceCard
            secId="timesheet-management"
            SignupClick={this.props.SignupClick}
            rowHeading={t("featuresLanding.services.6.rowHeading")}
            rowTagline={t("featuresLanding.services.6.rowTagline")}
            rowDesc={t("featuresLanding.services.6.rowDesc")}
            rowImage={
              require("assets/images/landing-pages/features-service7.png")
                .default
            }
            mobileImage={
              require("assets/images/landing-pages/features-mobile-service7.png")
                .default
            }
            ctaText={t("featuresLanding.services.6.ctaText")}
            sliderCard1Title={t("featuresLanding.services.6.slider.0.title")}
            sliderCard1Text1={t("featuresLanding.services.6.slider.0.text1")}
            sliderCard1Text2={t("featuresLanding.services.6.slider.0.text2")}
            sliderCard2Title={t("featuresLanding.services.6.slider.1.title")}
            sliderCard2Text1={t("featuresLanding.services.6.slider.1.text1")}
            sliderCard2Text2={t("featuresLanding.services.6.slider.1.text2")}
            sliderCard2Text3={t("featuresLanding.services.6.slider.1.text3")}
            sliderCard3Title={t("featuresLanding.services.6.slider.2.title")}
            sliderCard3Text1={t("featuresLanding.services.6.slider.2.text1")}
            sliderCard3Text2={t("featuresLanding.services.6.slider.2.text2")}
            sliderCard3Text3={t("featuresLanding.services.6.slider.2.text3")}
          />

          <FeaturesServiceCard
            secId="online-legal-forms"
            SignupClick={this.props.SignupClick}
            rowReverse={true}
            rowHeading={t("featuresLanding.services.7.rowHeading")}
            rowTagline={t("featuresLanding.services.7.rowTagline")}
            rowDesc={t("featuresLanding.services.7.rowDesc")}
            rowImage={
              require("assets/images/landing-pages/features-service8.png")
                .default
            }
            mobileImage={
              require("assets/images/landing-pages/features-mobile-service8.png")
                .default
            }
            ctaText={t("featuresLanding.services.7.ctaText")}
            sliderCard1Title={t("featuresLanding.services.7.slider.0.title")}
            sliderCard1Text1={t("featuresLanding.services.7.slider.0.text1")}
            sliderCard1Text2={t("featuresLanding.services.7.slider.0.text2")}
            sliderCard1Text3={t("featuresLanding.services.7.slider.0.text3")}
            sliderCard2Title={t("featuresLanding.services.7.slider.1.title")}
            sliderCard2Text1={t("featuresLanding.services.7.slider.1.text1")}
            sliderCard2Text2={t("featuresLanding.services.7.slider.1.text2")}
            sliderCard2Text3={t("featuresLanding.services.7.slider.1.text3")}
            sliderCard3Title={t("featuresLanding.services.7.slider.2.title")}
            sliderCard3Text1={t("featuresLanding.services.7.slider.2.text1")}
            sliderCard3Text2={t("featuresLanding.services.7.slider.2.text2")}
            sliderCard3Text3={t("featuresLanding.services.7.slider.2.text3")}
          />

          <FeaturesServiceCard
            secId="peer-review-and-patient-referral"
            trialBtn={true}
            SignupClick={this.props.SignupClick}
            rowHeading={t("featuresLanding.services.8.rowHeading")}
            rowTagline={t("featuresLanding.services.8.rowTagline")}
            rowDesc={t("featuresLanding.services.8.rowDesc")}
            rowImage={
              require("assets/images/landing-pages/peer-review-and-patient.png")
                .default
            }
            mobileImage={
              require("assets/images/landing-pages/peer-review-mobile-referral.png")
                .default
            }
            ctaText={t("featuresLanding.services.8.ctaText")}
            sliderCard1Title={t("featuresLanding.services.8.slider.0.title")}
            sliderCard1Text1={t("featuresLanding.services.8.slider.0.text1")}
            sliderCard1Text2={t("featuresLanding.services.8.slider.0.text2")}
            sliderCard2Title={t("featuresLanding.services.8.slider.1.title")}
            sliderCard2Text1={t("featuresLanding.services.8.slider.1.text1")}
            sliderCard2Text2={t("featuresLanding.services.8.slider.1.text2")}
            sliderCard2Text3={t("featuresLanding.services.8.slider.1.text3")}
         
          />

          <FeaturesServiceCard
            secId="tele-health"
            trialBtn={false}
            SignupClick={this.props.SignupClick}
            rowReverse={true}
            rowHeading={t("featuresLanding.services.9.rowHeading")}
            rowTagline={t("featuresLanding.services.9.rowTagline")}
            rowDesc={t("featuresLanding.services.9.rowDesc")}
            rowImage={
              require("assets/images/landing-pages/telehealth-image.png")
                .default
            }
            mobileImage={
              require("assets/images/landing-pages/telehealth-mobile-image.png")
                .default
            }
            ctaText={t("featuresLanding.services.9.ctaText")}
            sliderCard1Title={t("featuresLanding.services.9.slider.0.title")}
            sliderCard1Text1={t("featuresLanding.services.9.slider.0.text1")}
            sliderCard1Text2={t("featuresLanding.services.9.slider.0.text2")}
            sliderCard1Text3={t("featuresLanding.services.9.slider.0.text3")}
            sliderCard1Text4={t("featuresLanding.services.9.slider.0.text3")}
            sliderCard2Title={t("featuresLanding.services.9.slider.1.title")}
            sliderCard2Text1={t("featuresLanding.services.9.slider.1.text1")}
            sliderCard2Text2={t("featuresLanding.services.9.slider.1.text2")}
            sliderCard2Text3={t("featuresLanding.services.9.slider.1.text3")}
            sliderCard2Text4={t("featuresLanding.services.9.slider.1.text3")}
        
          />

          <FeaturesServiceCard
            secId="business-dashboards"
            trialBtn={false}
            SignupClick={this.props.SignupClick}
            rowHeading={t("featuresLanding.services.10.rowHeading")}
            rowTagline={t("featuresLanding.services.10.rowTagline")}
            rowDesc={t("featuresLanding.services.10.rowDesc")}
            rowImage={
              require("assets/images/landing-pages/business-dashboard.png")
                .default
            }
            mobileImage={
              require("assets/images/landing-pages/business-mobile-dashboard.png")
                .default
            }
            ctaText={t("featuresLanding.services.10.ctaText")}
            sliderCard1Title={t("featuresLanding.services.10.slider.0.title")}
            sliderCard1Text1={t("featuresLanding.services.10.slider.0.text1")}
            sliderCard1Text2={t("featuresLanding.services.10.slider.0.text2")}
            sliderCard1Text3={t("featuresLanding.services.10.slider.1.text3")}
            sliderCard2Title={t("featuresLanding.services.10.slider.1.title")}
            sliderCard2Text1={t("featuresLanding.services.10.slider.1.text1")}
            sliderCard2Text2={t("featuresLanding.services.10.slider.1.text2")}
            sliderCard2Text3={t("featuresLanding.services.10.slider.1.text3")}
           
          />

          <FeaturesServiceCard
            secId="inventory-supply-management"
            trialBtn={false}
            SignupClick={this.props.SignupClick}
            rowReverse={true}
            rowHeading={t("featuresLanding.services.11.rowHeading")}

            rowTagline={t("featuresLanding.services.11.rowTagline")}
            rowDesc={t("featuresLanding.services.11.rowDesc")}
            rowImage={
              require("assets/images/landing-pages/inventry-supply-management.png")
                .default
            }
            mobileImage={
              require("assets/images/landing-pages/features-mobile-service12.png")
                .default
            }
            ctaText={t("featuresLanding.services.11.ctaText")}
            sliderCard1Title={t("featuresLanding.services.11.slider.0.title")}
            sliderCard1Text1={t("featuresLanding.services.11.slider.0.text1")}
            sliderCard1Text2={t("featuresLanding.services.11.slider.0.text2")}
            sliderCard1Text3={t("featuresLanding.services.11.slider.0.text3")}
            sliderCard2Title={t("featuresLanding.services.11.slider.1.title")}
            sliderCard2Text1={t("featuresLanding.services.11.slider.1.text1")}
            sliderCard2Text2={t("featuresLanding.services.11.slider.1.text2")}
            sliderCard2Text3={t("featuresLanding.services.11.slider.1.text3")}
            sliderCard3Title={t("featuresLanding.services.11.slider.2.title")}
            sliderCard3Text1={t("featuresLanding.services.11.slider.2.text1")}
            sliderCard3Text2={t("featuresLanding.services.11.slider.2.text2")}
            sliderCard3Text3={t("featuresLanding.services.11.slider.2.text3")}
            notesText={false}
          />
          <FeaturesServiceCard
            secId="order-delivery-management"
            trialBtn={false}
            SignupClick={this.props.SignupClick}
            rowHeading={t("featuresLanding.services.12.rowHeading")}
            rowTagline={t("featuresLanding.services.12.rowTagline")}
            rowDesc={t("featuresLanding.services.12.rowDesc")}
            rowImage={
              require("assets/images/landing-pages/features-service13.png")
                .default
            }
            mobileImage={
              require("assets/images/landing-pages/features-mobile-service13.png")
                .default
            }
            ctaText={t("featuresLanding.services.12.ctaText")}
            sliderCard1Title={t("featuresLanding.services.12.slider.0.title")}
            sliderCard1Text1={t("featuresLanding.services.12.slider.0.text1")}
            sliderCard1Text2={t("featuresLanding.services.12.slider.0.text2")}
            sliderCard2Title={t("featuresLanding.services.12.slider.1.title")}
            sliderCard2Text1={t("featuresLanding.services.12.slider.1.text1")}
            sliderCard2Text2={t("featuresLanding.services.12.slider.1.text2")}
            sliderCard2Text3={t("featuresLanding.services.12.slider.1.text3")}
            sliderCard3Title={t("featuresLanding.services.12.slider.2.title")}
            sliderCard3Text1={t("featuresLanding.services.12.slider.2.text1")}
            sliderCard3Text2={t("featuresLanding.services.12.slider.2.text2")}
            sliderCard3Text3={t("featuresLanding.services.12.slider.2.text3")}
            sliderCard3Text4={t("featuresLanding.services.12.slider.2.text4")}
          />

          <div className="hexagon-section">
            <div className="container">
              <Row className="align-items-center">
                <Col lg="7">
                  <div className="text-col">
                    <h2> {t("userPages.readyToTransformYourBusiness")}</h2>
                    <p> {t("featuresLanding.hexagonDesc1")}</p>

                    <p>
                      {" "}
                      <u
                        className="cursor-pointer"
                        onClick={this.props.SignupClick}
                      >
                        {t("userPages.dentistHexaDesc1")}
                      </u>{" "}
                      {t("featuresLanding.hexagonDesc2")}
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
        <section className="features-fixed-sec">
          <div className="container">
            <div className="content-box">
              <div className="select-content">
                {t("featuresLanding.fixedMenuText")}
              </div>
              <div className="dropdown-wrapper">
                <OutsideClickHandler
                  onOutsideClick={() => {
                    this.setState({
                      showDropdown: false,
                    });
                  }}
                >
                  <div className="dropdown-content" onClick={toggleDropdown}>
                    {this.state.selectedListItem.text}
                    <img
                      src={require("assets/images/down-arrow.svg").default}
                      alt="img"
                    />
                  </div>
                  {this.state.showDropdown && (
                    <ul className="dropdown-list">
                      {dropdownData.map((item) => {
                        const { text, secId } = item;
                        const isActive =
                          secId === this.state.selectedListItem.secId;
                        return (
                          <li
                            key={secId}
                            onClick={() => selectDropdownItem(item)}
                            className={`${isActive ? "active" : ""}`}
                          >
                            {text}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </OutsideClickHandler>
              </div>
            </div>
          </div>
        </section>
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
})(_isLoading(withTranslation()(Features)));
