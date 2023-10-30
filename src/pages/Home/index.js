import React, { Component } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { connect } from "react-redux";
import { getConent, getContactConent, getCompanyInformation } from "actions";
/*components*/
import _isLoading from "hoc/isLoading";
import HomeContact from "components/Home-contact";
import HomeProduct from "components/Home-product";
import { withTranslation } from "react-i18next";
import HomeReadyStart from "components/Home-ready-start";
import { Col, Row } from "reactstrap";
import constants from "../../constants";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeClassName: "",
    };
  }
  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.getConent({ id: constants.cmsPageKey.AboutUs });
    this.props.getContactConent({ id: constants.cmsPageKey.ContactUs });
    this.props.getCompanyInformation();
  }

  render() {
    const { t } = this.props;
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 6,
      slidesToScroll: 1,
      arrows: false,
      pauseOnFocus: false,
      pauseOnHover: false,
      responsive: [
        {
          breakpoint: 991,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
          },
        },
      ],
    };
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
            autoplaySpeed: 7000,
          },
        },
      ],
    };
    const handleCardChange = (path) => {
      this.setState({ activeClassName: path });
      setTimeout(() => {
        this.props.history.push(path);
      }, 500);
    };
    const handleCardChange2 = (path) => {
      this.setState({ activeClassName: path });
      setTimeout(() => {
        this.props.history.push(path);
      }, 500);
    };
    const handleCardChange3 = (path) => {
      this.setState({ activeClassName: path });
      setTimeout(() => {
        this.props.history.push(path);
      }, 500);
    };
    const handleCardChange4 = (path) => {
      this.setState({ activeClassName: path });
      setTimeout(() => {
        this.props.history.push(path);
      }, 500);
    };
    return (
      <div className="landing-page-block">
        <section className="banner-new-section home-banner">
          <Slider {...bannerSettings}>
            <div className="slider-single slide-1">
              <img
                className="img-cover d-md-block d-none"
                src={
                  require("assets/images/landing-pages/home-banner.jpg").default
                }
                alt="img"
              />
              <img
                className="img-cover d-md-none d-bock"
                src={
                  require("assets/images/landing-pages/home-banner-mobile.jpg")
                    .default
                }
                alt="img"
              />
              <div className="banner-caption d-lg-none d-flex">
                <div className="banner-text">
                  <h1>{t("homePage.bannerText2")}</h1>
                  <ul className="home-banner-list">
                    <li>
                      <div className="icon-box">
                        <img
                          src={
                            require("assets/images/landing-pages/simplify-icon.svg")
                              .default
                          }
                          alt="icon"
                        />
                      </div>
                      <div className="title-col">
                        <div className="title-text">
                          {t("homePage.simplifyTitle")}
                        </div>
                        <img
                          src={
                            require("assets/images/landing-pages/curve-icon.svg")
                              .default
                          }
                          alt="icon"
                        />
                      </div>
                      <div className="text-col">
                        {t("homePage.simplifyText")}{" "}
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="slider-single slide-2">
              <img
                className="img-cover d-xl-block d-none img-right"
                src={
                  require("assets/images/landing-pages/home-banner2.jpg")
                    .default
                }
                alt="img"
              />
              <img
                className="img-cover ipad-img"
                src={
                  require("assets/images/landing-pages/home-ipad-banner.jpg")
                    .default
                }
                alt="img"
              />
              <img
                className="img-cover d-md-none d-bock"
                src={
                  require("assets/images/landing-pages/home-banner-mobile2.jpg")
                    .default
                }
                alt="img"
              />
              <div className="banner-caption d-lg-none d-flex">
                <div className="banner-text">
                  <h1>{t("homePage.bannerText2")}</h1>
                  <ul className="home-banner-list">
                    <li>
                      <div className="icon-box">
                        <img
                          src={
                            require("assets/images/landing-pages/increase-icon.svg")
                              .default
                          }
                          alt="icon"
                        />
                      </div>
                      <div className="title-col">
                        <div className="title-text">
                          {t("homePage.increaseTitle")}
                        </div>
                        <img
                          src={
                            require("assets/images/landing-pages/curve-icon.svg")
                              .default
                          }
                          alt="icon"
                        />
                      </div>
                      <div className="text-col">
                        {t("homePage.increaseText")}{" "}
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="slider-single slide-3">
              <img
                className="img-cover d-md-block d-none img-top"
                src={
                  require("assets/images/landing-pages/home-banner3.jpg")
                    .default
                }
                alt="img"
              />
              <img
                className="img-cover d-md-none d-bock"
                src={
                  require("assets/images/landing-pages/home-banner-mobile3.jpg")
                    .default
                }
                alt="img"
              />
              <div className="banner-caption d-lg-none d-flex">
                <div className="banner-text">
                  <h1>{t("homePage.bannerText2")}</h1>
                  <ul className="home-banner-list">
                    <li>
                      <div className="icon-box">
                        <img
                          src={
                            require("assets/images/landing-pages/reduce-icon.svg")
                              .default
                          }
                          alt="icon"
                        />
                      </div>
                      <div className="title-col">
                        <div className="title-text">
                          {t("homePage.reduceTitle")}
                        </div>
                        <img
                          src={
                            require("assets/images/landing-pages/curve-icon.svg")
                              .default
                          }
                          alt="icon"
                        />
                      </div>
                      <div className="text-col">
                        {t("homePage.reduceText")}{" "}
                      </div>
                      <ul className="list-icon-dot">
                        <li>{t("homePage.reduceList1")} </li>
                        <li>{t("homePage.reduceList2")} </li>
                        <li>{t("homePage.reduceList3")} </li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </Slider>
          <div className="banner-caption d-lg-flex d-none">
            <div className="banner-text">
              <h1>{t("homePage.bannerText2")}</h1>
              <ul className="home-banner-list">
                <li>
                  <div className="icon-box">
                    <img
                      src={
                        require("assets/images/landing-pages/simplify-icon.svg")
                          .default
                      }
                      alt="icon"
                    />
                  </div>
                  <div className="title-col">
                    <div className="title-text">
                      {t("homePage.simplifyTitle")}
                    </div>
                    <img
                      src={
                        require("assets/images/landing-pages/curve-icon.svg")
                          .default
                      }
                      alt="icon"
                    />
                  </div>
                  <div className="text-col">{t("homePage.simplifyText")} </div>
                </li>
                <li>
                  <div className="icon-box">
                    <img
                      src={
                        require("assets/images/landing-pages/increase-icon.svg")
                          .default
                      }
                      alt="icon"
                    />
                  </div>
                  <div className="title-col">
                    <div className="title-text">
                      {t("homePage.increaseTitle")}
                    </div>
                    <img
                      src={
                        require("assets/images/landing-pages/curve-icon.svg")
                          .default
                      }
                      alt="icon"
                    />
                  </div>
                  <div className="text-col">{t("homePage.increaseText")} </div>
                </li>
                <li>
                  <div className="icon-box">
                    <img
                      src={
                        require("assets/images/landing-pages/reduce-icon.svg")
                          .default
                      }
                      alt="icon"
                    />
                  </div>
                  <div className="title-col">
                    <div className="title-text">
                      {t("homePage.reduceTitle")}
                    </div>
                    <img
                      src={
                        require("assets/images/landing-pages/curve-icon.svg")
                          .default
                      }
                      alt="icon"
                    />
                  </div>
                  <div className="text-col">{t("homePage.reduceText")} </div>
                  <ul className="list-icon-dot">
                    <li>{t("homePage.reduceList1")} </li>
                    <li>{t("homePage.reduceList2")} </li>
                    <li>{t("homePage.reduceList3")} </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </section>
        <section className="about-us-section" id="about-us">
          <div className="profession-section">
            <Slider {...settings}>
              <div className={"data-block "}>
                <button
                  onClick={() => handleCardChange("/dentist")}
                  className={
                    this.state.activeClassName === "/dentist"
                      ? "active-link"
                      : ""
                  }
                >
                  <div className="_header">
                    <div className="img-box">
                      <img
                        className="desktop-img"
                        src={
                          require("assets/images/landing-pages/dentist-caption.svg")
                            .default
                        }
                        alt="img"
                      />
                      <img
                        className="mobile-img"
                        src={
                          require("assets/images/landing-pages/dentist-caption-white.svg")
                            .default
                        }
                        alt="img"
                      />
                    </div>
                    <h4>{t("dentist")}</h4>
                  </div>
                </button>
                <div className="hidden-block">
                  <Link to="/dentist">
                    <h4>{t("dentist")}</h4>
                    <p>{t("homePage.dentistCaptionText")}</p>
                  </Link>
                </div>
              </div>
              <div className={"data-block "}>
                <button
                  onClick={() => handleCardChange("/physician")}
                  className={
                    this.state.activeClassName === "/physician"
                      ? "active-link"
                      : ""
                  }
                >
                  <div className="_header">
                    <div className="img-box">
                      <img
                        className="desktop-img"
                        src={
                          require("assets/images/landing-pages/physician-caption.svg")
                            .default
                        }
                        alt="img"
                      />
                      <img
                        className="mobile-img"
                        src={
                          require("assets/images/landing-pages/physician-caption-white.svg")
                            .default
                        }
                        alt="img"
                      />
                    </div>
                    <h4>{t("physician")}</h4>
                  </div>
                </button>
                <div className="hidden-block">
                  <Link to="/physician">
                    <h4>{t("physician")}</h4>
                    <p>{t("homePage.physicianCaptionText")}</p>
                  </Link>
                </div>
              </div>
              <div className="data-block">
                <button
                  onClick={() => handleCardChange("/pharmacist")}
                  className={
                    this.state.activeClassName === "/pharmacist"
                      ? "active-link"
                      : ""
                  }
                >
                  <div className="_header">
                    <div className="img-box">
                      <img
                        className="desktop-img"
                        src={
                          require("assets/images/landing-pages/pharmacist-caption.svg")
                            .default
                        }
                        alt="img"
                      />
                      <img
                        className="mobile-img"
                        src={
                          require("assets/images/landing-pages/pharmacist-caption-white.svg")
                            .default
                        }
                        alt="img"
                      />
                    </div>
                    <h4>{t("pharmacist")}</h4>
                  </div>
                </button>
                <div className="hidden-block">
                  <Link to="/pharmacist">
                    <h4>{t("pharmacist")}</h4>
                    <p>{t("homePage.pharmacistCaptionText")}</p>
                  </Link>
                </div>
              </div>
              <div className="data-block">
                <button
                  onClick={() => handleCardChange2("/personnel")}
                  className={
                    this.state.activeClassName === "/personnel"
                      ? "active-link"
                      : ""
                  }
                >
                  <div className="_header">
                    <div className="img-box">
                      <img
                        className="desktop-img"
                        src={
                          require("assets/images/landing-pages/personnel-caption.svg")
                            .default
                        }
                        alt="img"
                      />
                      <img
                        className="mobile-img"
                        src={
                          require("assets/images/landing-pages/personnel-caption-white.svg")
                            .default
                        }
                        alt="img"
                      />
                    </div>
                    <h4>{t("personnel")}</h4>
                  </div>
                </button>
                <div className="hidden-block">
                  <Link to="/personnel">
                    <h4>{t("personnel")}</h4>
                    <p>{t("homePage.personnelCaptionText")}</p>
                  </Link>
                </div>
              </div>
              <div className="data-block patient-block">
                <button
                  onClick={() => handleCardChange3("/patient")}
                  className={
                    this.state.activeClassName === "/patient"
                      ? "active-link"
                      : ""
                  }
                >
                  <div className="_header">
                    <div className="img-box">
                      <img
                        className="desktop-img"
                        src={
                          require("assets/images/landing-pages/patient-caption.svg")
                            .default
                        }
                        alt="img"
                      />
                      <img
                        className="mobile-img"
                        src={
                          require("assets/images/landing-pages/patient-caption-white.svg")
                            .default
                        }
                        alt="img"
                      />
                    </div>
                    <h4>{t("homePagePatient")}</h4>
                  </div>
                </button>
                <div className="hidden-block">
                  <Link to="/patient">
                    <h4>{t("homePagePatient")}</h4>
                    <p>{t("homePage.patientsCaptionText")}</p>
                  </Link>
                </div>
              </div>
              <div className="data-block vendor-block">
                <button
                  onClick={() => handleCardChange4("/supplier")}
                  className={
                    this.state.activeClassName === "/supplier"
                      ? "active-link"
                      : ""
                  }
                >
                  <div className="_header">
                    <div className="img-box">
                      <img
                        className="desktop-img"
                        src={
                          require("assets/images/landing-pages/vendor-caption.svg")
                            .default
                        }
                        alt="img"
                      />
                      <img
                        className="mobile-img"
                        src={
                          require("assets/images/landing-pages/vendor-caption-white.svg")
                            .default
                        }
                        alt="img"
                      />
                    </div>
                    <h4>{t("supplier")}</h4>
                  </div>
                </button>
                <div className="hidden-block">
                  <Link to="/supplier">
                    <h4>{t("supplier")}</h4>
                    <p>{t("homePage.vendorCaptionText")}</p>
                  </Link>
                </div>
              </div>
            </Slider>
          </div>
          <div className="container">
            <div className="row">
              <div className="col-xl-9 col-lg-12">
                <div className="content-block">
                  <h2>{t("homePage.everythingYouNeedAllInOnePlace")}</h2>
                  <div className="content-container">
                    <strong>{t("homePage.aboutUsText1")}</strong>{" "}
                    {t("homePage.aboutUsText2")}&nbsp;
                    <span className="font-medium">
                      {t("homePage.aboutUsText3")}
                    </span>{" "}
                    {t("homePage.aboutUsText4")}{" "}
                    <span className="font-medium">
                      {t("homePage.aboutUsText5")}
                    </span>{" "}
                    {t("homePage.aboutUsText6")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <HomeProduct />
        <div className="hexagon-section">
          <div className="container">
            <Row className="align-items-center">
              <Col lg="7">
                <div className="text-col">
                  <h2> {t("homePage.homeHexagonTitle")}</h2>
                  <p>
                    {" "}
                    {t("homePage.homeHexagonDesc1")}
                    <Link to="/dentist">{t("homePage.dentists")}</Link>,{" "}
                    <Link to="/physician">{t("homePage.physicians")}</Link>,{" "}
                    <Link to="/pharmacist">{t("homePage.pharmacists")}</Link>,{" "}
                    <Link to="/personnel">
                      {t("homePage.healthcarePersonnel")}
                    </Link>
                    , <Link to="/supplier">{t("homePage.suppliers")}</Link>
                    &nbsp;
                    {t("homePage.homeHexagonDesc2")}{" "}
                    <Link to="/patient">{t("homePage.patients")}</Link>.
                  </p>
                </div>
              </Col>
              <Col lg="5">
                <div className="image-col">
                  <img
                    src={
                      require("assets/images/landing-pages/hexagon.svg").default
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
      </div>
    );
  }
}
const mapStateToProps = ({
  userProfile: { profile },
  pageContent: { isLoading, pageContent, contactContent, companyInformation },
  errors: { isError },
}) => ({
  isLoading,
  isError,
  profile,
  pageContent,
  contactContent,
  companyInformation,
});
export default connect(mapStateToProps, {
  getConent,
  getContactConent,
  getCompanyInformation,
})(_isLoading(withTranslation()(Home)));
