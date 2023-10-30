import { getCompanyInformation } from "actions";
/*components*/
import _isLoading from "hoc/isLoading";
import HomeContact from "components/Home-contact";
import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import Slider from "react-slick";
import { getConent } from "actions";
import constants from "../../constants";
import AboutBlogsResources from "components/About-Blogs-Resources";

class Dentist extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.getCompanyInformation();
    this.props.getConent({ id: constants.cmsPageKey.OurMission });
  }

  render() {
    const { t } = this.props;
    const settings = {
      dots: true,
      arrows: false,
      infinite: true,
      speed: 1000,
      slidesToShow: 1,
      slidesToScroll: 1,
      //  adaptiveHeight: true,
      autoplaySpeed: 7000,
      autoplay: true,
      draggable: true,
    };
    return (
      <div className="app-page">
        <div className="banner-new-section banner-block about-banner">
          <div className="container">
            <div className="banner-caption">
              <div className="banner-label">{t("aboutUs")}</div>
              <h2>{t("userPages.aboutUsTitle")}</h2>
              <Slider {...settings}>
                <div className="text-width">
                  <p>{t("userPages.aboutUsSliderDesc1")}</p>
                </div>
                <div className="text-width">
                  <p>{t("userPages.aboutUsSliderDesc2")}</p>
                </div>

                <div className="text-width">
                  <p>{t("userPages.aboutUsSliderDesc3")}</p>
                </div>
              </Slider>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="our-mission-sec">
            <h2>{t("userPages.ourMission")}</h2>
            {this.props?.pageContent ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: this.props?.pageContent?.content,
                }}
              ></div>
            ) : (
              <p>{t("userPages.ourMissionDesc")} </p>
            )}
          </div>
        </div>
        <div className="connecting-solution-section">
          <img
            className="d-none"
            src={
              require("assets/images/landing-pages/about-page-bg1.png").default
            }
            alt="connectimage"
          />

          <div className="container">
            <div className="connect-box">
              <h3>{t("userPages.connectingToSolutions")}</h3>
              <img
                className="connect-img"
                src={
                  require("assets/images/landing-pages/hexagon.svg")
                    .default
                }
                alt="img"
              />
            </div>
          </div>
        </div>
        <div className="about-help-section">
          <div className="container">
            <div className="help-content   ">
              <h3>{t("userPages.howWeHelp")}</h3>
              <p className="font-semibold">{t("userPages.howWeHelpDesc1")}</p>
              <p>{t("userPages.howWeHelpDesc2")}</p>
              <p>
                {t("userPages.howWeHelpDesc3")}{" "}
                <strong className="font-bold">
                  {t("userPages.howWeHelpDesc4")}
                </strong>
              </p>
            </div>
          </div>
        </div>
        <div className="diverse-program-section">
          <div className="container">
            <div className="text-box">
              <h3>{t("userPages.theTeam")}</h3>
              <p>
                <strong>{t("userPages.diverseAccomplishedPragmatic")}</strong>
                {t("userPages.aboutText1")}
              </p>
              <p> {t("userPages.aboutText2")}</p>
            </div>
            {/* <AboutTeam /> */}
          </div>
        </div>
        <HomeContact companyInformation={this.props.companyInformation} />

        <AboutBlogsResources />
      </div>
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

export default connect(mapStateToProps, { getCompanyInformation, getConent })(
  withTranslation()(_isLoading(Dentist))
);
