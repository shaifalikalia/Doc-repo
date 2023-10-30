import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import Footer from "../ThankYouDownload/components/Footer";
import AboutMiraxis from "../ThankYouDownload/components/AboutMiraxis";
import HomeTestimoninal from "components/Home-testimonials";
import "./DemoRequest.scss";
import { Col, Row } from "reactstrap/lib";
import Slider from "react-slick";
import Header from "pages/ThankYouDownload/components/Header";
import DemoRequestModal from "./DemoRequestModal";

function DemoRequestPage(props) {
  const [isDemoRequestModalOpen, setIsDemoRequestModalOpen] = useState(false);
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
  const settings1 = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
  };
  const settings2 = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
  };
  const listSettings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    fade: true,
    autoplaySpeed: 3500,
    cssEase: "linear",
  };

  let items = [
    {
      id: "1",
      name: "Lis M.",
      designation: "Office Manager",
      imageUrl: require("assets/images/landing-pages/demo2-dummy.png").default,
      content:
        "This app is a game changer ! It saves a lot of time doing payroll , the employees love that they can easily keep track of their hours. And find it easy to request time off with it as well.",
    },
    {
      id: "2",
      name: "Parm M.",
      designation: "Office Manager",
      imageUrl: require("assets/images/landing-pages/demo3-dummy.png").default,
      content:
        "Our office has been using this great app for over a month now. It is very easy to navigate and has very organized user interface; all the employees were able to download and use the app right away and without any glitches.",
    },
    {
      id: "3",
      name: "Dr. Sally Rassamanesh",
      designation: "Dentist",
      imageUrl: require("assets/images/landing-pages/demo1-dummy.png").default,
      content:
        "The app was able to free up my mind re. staff management, their timesheets and their placement when they are on leave. The main key value in this opp is having an integrated solution which takes care of a big chunk of my day to day workload and saves a lot of my time so I can focus on my patients.",
    },
  ];
  return (
    <>
      <div className="demo-request-page">
        <Header />

        <div className="landing-page-block">
          <div className="banner-new-section heathcare-banner banner-block ">
            <Slider {...bannerSettings}>
              <div className="slider-single">
                <img
                  className="d-none img-cover img-desktop  d-md-block"
                  src={
                    require("assets/images/landing-pages/demo-request-banner.jpg")
                      .default
                  }
                  alt="img"
                />
                <img
                  className="d-block img-cover   img-right d-md-none"
                  src={
                    require("assets/images/landing-pages/demo-banner-mobile.png")
                      .default
                  }
                  alt="img"
                />
              </div>
            </Slider>

            <div className="banner-caption">
              <div className="wrapper">
                <h2 className="heading">
                  It’s Time For a Better Solution for Managing Your Practice
                </h2>
                <div className="d-none d-md-block">
                  <ul className="list">
                    <li>
                      <div className="d-flex">
                        <div className="icon-box">
                          {" "}
                          <img
                            src={
                              require("assets/images/landing-pages/demo1.svg")
                                .default
                            }
                            alt="img"
                          />
                        </div>
                        <div className="d-flex align-items-center">
                          Are you frustrated trying to manage your staff, time
                          sheets, payroll and leaves?
                        </div>
                      </div>
                    </li>
                    <li className="d-flex">
                      <div className="icon-box">
                        {" "}
                        <img
                          src={
                            require("assets/images/landing-pages/demo2.svg")
                              .default
                          }
                          alt="img"
                        />
                      </div>
                      <div className="d-flex align-items-center">
                        Do you struggle to keep track of where your staff are
                        working, on what tasks and when?
                      </div>
                    </li>
                    <li className="d-flex">
                      <div className="icon-box">
                        {" "}
                        <img
                          src={
                            require("assets/images/landing-pages/demo3.svg")
                              .default
                          }
                          alt="img"
                        />
                      </div>
                      <div className="d-flex align-items-center">
                        {" "}
                        Tired of searching for forms and HR documents?
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="d-block d-md-none">
                  <Slider {...listSettings}>
                    <div className="d-block list-wrapper">
                      <div className="d-flex list">
                        <img
                          className="mr-3"
                          src={
                            require("assets/images/landing-pages/demo-icon3.svg")
                              .default
                          }
                          alt="img"
                        />
                        <div className="d-flex align-items-center">
                          Are you frustrated trying to manage your staff, time
                          sheets, payroll and leaves?
                        </div>
                      </div>
                    </div>
                    <div className="d-block list-wrapper">
                      <div className="d-flex list">
                        <img
                          className="mr-3"
                          src={
                            require("assets/images/landing-pages/demo-icon1.svg")
                              .default
                          }
                          alt="img"
                        />
                        <div className="d-flex align-items-center">
                          Do you struggle to keep track of where your staff are
                          working, on what tasks and when?
                        </div>
                      </div>
                    </div>
                    <div className="d-block list-wrapper">
                      <div className="d-flex list">
                        <img
                          className="mr-3"
                          src={
                            require("assets/images/landing-pages/demo-icon2.svg")
                              .default
                          }
                          alt="img"
                        />
                        <div className="d-flex align-items-center">
                          {" "}
                          Tired of searching for forms and HR documents?
                        </div>
                      </div>
                    </div>
                  </Slider>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="request-demo-section">
          <div className="container">
            <div className="request-demo-box">
              <div className="request-demo-content">
                Request a personalized demo to see in action how Miraxis
                Platform can streamline your practice management, staff
                management and HR processes to save money, boost productivity,
                and achieve true work-life balance.
              </div>

              <button
                onClick={() => {
                  setIsDemoRequestModalOpen(true);
                }}
                className="button button-round button-shadow"
                title="Request a Demo"
              >
                Request a Demo
              </button>
            </div>

            <Row>
              <Col md="6" lg="7" className="left-side">
                <div className="wrapper">
                  <h2>
                    Miraxis Platform gives you and your office management team a
                    full suite of tools to save time, reduce costs, and
                    alleviate stress.
                  </h2>
                  <Slider {...settings1}>
                    <div className="shadow-box">
                      <div className="d-flex inner-shadow">
                        Streamline staff management, timesheets, vacation &
                        payroll, assign & track tasks, schedule personnel shifts
                        & availability and collaborate & communicate easily in a
                        secured internal messaging system.
                      </div>
                    </div>
                    <div className="shadow-box">
                      <div className="d-flex inner-shadow">
                        Build your virtual HR Manager, conduct performance
                        reviews, onboard & offboards, automate online legal
                        forms and contracts.
                      </div>
                    </div>
                    <div className="shadow-box">
                      <div className="d-flex inner-shadow">
                        Optimize your office workforce, automate referral and
                        hiring workflows, post jobs and manage staff
                        availability across multiple practices.
                      </div>
                    </div>
                    <div className="shadow-box">
                      <div className="d-flex inner-shadow">
                        Deliver outstanding patient experience by simplifying
                        booking, rescheduling and recalling appointments.
                      </div>
                    </div>
                    <div className="shadow-box">
                      <div className="d-flex inner-shadow">
                        Ensure tight inventory control by tracking inventory in
                        real-time, easily managing billing and payment.
                      </div>
                    </div>
                  </Slider>
                </div>
              </Col>
              <Col md="6" lg="5" className="right-side">
                <Slider {...settings2}>
                  <div>
                    <img
                      className="phone d-none d-md-block phn-img"
                      src={
                        require("assets/images/landing-pages/phone.png").default
                      }
                      alt="arrow"
                    />
                    <img
                      className="phone d-block d-md-none"
                      src={
                        require("assets/images/landing-pages/phone-mobile-new.png")
                          .default
                      }
                      alt="arrow"
                    />
                  </div>
                  <div>
                    <img
                      className="laptop d-none d-md-block"
                      src={
                        require("assets/images/landing-pages/laptop.png")
                          .default
                      }
                      alt="arrow"
                    />
                    <img
                      className="laptop d-block d-md-none"
                      src={
                        require("assets/images/landing-pages/laptop-mobile-new.png")
                          .default
                      }
                      alt="arrow"
                    />
                  </div>
                </Slider>
                <button
                  onClick={() => {
                    setIsDemoRequestModalOpen(true);
                  }}
                  className="button button-round  text-center request-demo-btn"
                  title="Request a Demo"
                >
                  Request a Demo
                </button>
              </Col>
            </Row>
          </div>
        </div>
        <HomeTestimoninal
          data={items}
          title="Trusted by Fellow Doctors & Practitioners"
        />
        <AboutMiraxis />
        <Footer />
      </div>
      {isDemoRequestModalOpen && (
        <DemoRequestModal
          isDemoRequestModalOpen={isDemoRequestModalOpen}
          setIsDemoRequestModalOpen={setIsDemoRequestModalOpen}
        />
      )}
    </>
  );
}
export default withTranslation()(DemoRequestPage);
