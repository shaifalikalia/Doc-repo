import { getCompanyInformation } from "actions";
import _isLoading from "hoc/isLoading";
import HomeContact from "components/Home-contact";
import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import HomeReadyStart from "components/Home-ready-start";
import { Col, Row } from "reactstrap";

class Overview extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.getCompanyInformation();
  }
  render() {
    const { t } = this.props;
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
    return (
      <div className="app-page">
        <div className="platform-overview-banner">
          <div className="container">
            <div className="row">
              <div className="col-xl-7 col-md-8">
                <div className="banner-caption">
                  <h2>
                    {t("platformOverview.bannerHeading1")} <br />
                    {t("platformOverview.bannerHeading2")} <br />{" "}
                    {t("platformOverview.bannerHeading3")}
                  </h2>
                  <p>{t("platformOverview.bannerDesc")}</p>
                </div>
              </div>
              <div className="col-xl-6 col-md-6">
                <div className="banner-right-col d-none">
                  <div className="images-grid">
                    <div className="img-single img-1">
                      <img
                        src={
                          require("assets/images/landing-pages/overview-banner-img1.png")
                            .default
                        }
                        alt="img"
                      />
                    </div>
                    <div className="img-single img-2">
                      <img
                        src={
                          require("assets/images/landing-pages/overview-banner-img2.png")
                            .default
                        }
                        alt="img"
                      />
                    </div>
                    <div className="img-single img-3">
                      <img
                        src={
                          require("assets/images/landing-pages/overview-banner-img3.png")
                            .default
                        }
                        alt="img"
                      />
                    </div>
                    <div className="img-single img-4">
                      <img
                        src={
                          require("assets/images/landing-pages/overview-banner-img4.png")
                            .default
                        }
                        alt="img"
                      />
                    </div>
                    <div className="img-single img-5">
                      <img
                        src={
                          require("assets/images/landing-pages/overview-banner-img5.png")
                            .default
                        }
                        alt="img"
                      />
                    </div>
                    <div className="img-single img-6">
                      <img
                        src={
                          require("assets/images/landing-pages/overview-banner-img6.png")
                            .default
                        }
                        alt="img"
                      />
                    </div>
                    <div className="img-single img-7">
                      <img
                        src={
                          require("assets/images/landing-pages/banner-overview-img.svg")
                            .default
                        }
                        alt="img"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="overview-green-bg-section">
          <div className="container">
            <div className="overview-slider">
              <Slider {...settings}>
                <div className="card-block">
                  <h4 className="heading-title">
                    {t("platformOverview.sliderText1")}
                  </h4>
                  <img
                    src={
                      require("assets/images/landing-pages/overview-slider-img1.jpg")
                        .default
                    }
                    alt="img"
                  />
                </div>
                <div className="card-block">
                  <h4 className="heading-title">
                    {t("platformOverview.sliderText2")}
                  </h4>
                  <img
                    src={
                      require("assets/images/landing-pages/overview-slider-img2.jpg")
                        .default
                    }
                    alt="img"
                  />
                </div>
                <div className="card-block">
                  <h4 className="heading-title">
                    {t("platformOverview.sliderText3")}
                  </h4>
                  <img
                    src={
                      require("assets/images/landing-pages/overview-slider-img3.jpg")
                        .default
                    }
                    alt="img"
                  />
                </div>
              </Slider>
            </div>
          </div>
        </div>
        <div className="hexagon-section platform-hexagon">
          <div className="container">
            <Row className="align-items-center">
              <Col lg="7">
                <div className="text-col">
                  <h2> {t("homePage.homeHexagonTitle")}</h2>
                  <p>
                    {" "}
                    {t("userPages.dentistHexaDesc1")}{" "}
                    {t("userPages.dentistHexaDesc2")}
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
        <HomeReadyStart Title2={t("homePage.readyTitle2")} />
        <HomeContact companyInformation={this.props.companyInformation} />
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

export default connect(mapStateToProps, { getCompanyInformation })(
  withTranslation()(_isLoading(Overview))
);
