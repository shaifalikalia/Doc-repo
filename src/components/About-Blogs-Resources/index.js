import React from "react";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";

const AboutBlogsResources = ({ t }, props) => {
  const settings = {
    dots: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1300,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div
      className="about-blog-section blogs-resources-section"
      id="blogs-resources-section"
    >
      <div className="container">
        <div className="title-col">
          <h2>{t("blogsAndResources.blogsAndResources")}</h2>
        </div>
        <div className="blog-slider">
          <Slider {...settings}>
            <a href="/9-reasons-why-dentists-are-automating-their-practice.html">
              <div className="blog-block">
                <img
                  src={require("assets/images/landing-pages/blog1.jpg").default}
                  alt="img"
                />

                <p> {t("blogsAndResources.blog1")}</p>
              </div>
            </a>

            <a href="/top-9-ways-for-you-and-your-staff-to-avoid-burnout.html">
              <div className="blog-block">
                <img
                  src={require("assets/images/landing-pages/blog2.jpg").default}
                  alt="img"
                />

                <p>{t("blogsAndResources.blog2")}</p>
              </div>
            </a>
            <a href="/top-9-benefits-of-streamlining-and-automating-workflows-in-your-dental-practice.html">
              <div className="blog-block">
                <img
                  src={require("assets/images/landing-pages/blog3.jpg").default}
                  alt="img"
                />

                <p>{t("blogsAndResources.blog3")}</p>
              </div>
            </a>
            <a href="/communication-with-your-team-how-to-be-hands-offand-still-be-hands-on.html">
              <div className="blog-block">
                <img
                  src={require("assets/images/landing-pages/blog4.jpg").default}
                  alt="img"
                />

                <p>{t("blogsAndResources.blog4")}</p>
              </div>
            </a>
            <a href="/3-effective-ways-technology-can-help-you-efficiently-manage-staff-in-your-practice.html">
              <div className="blog-block">
                <img
                  src={require("assets/images/landing-pages/blog5.jpg").default}
                  alt="img"
                />

                <p>{t("blogsAndResources.blog5")}</p>
              </div>
            </a>
            <a href="/8-ways-leading-dental-practices-enhance-their-staff-experience.html">
              <div className="blog-block">
                <img
                  src={require("assets/images/landing-pages/blog6.jpg").default}
                  alt="img"
                />

                <p>{t("blogsAndResources.blog6")}</p>
              </div>
            </a>
            <a href="/6-ways-to-recruit-and-retain-practice-employees-in-2023.html">
              <div className="blog-block">
                <img
                  src={require("assets/images/landing-pages/blog7.jpg").default}
                  alt="img"
                />

                <p>{t("blogsAndResources.blog7")}</p>
              </div>
            </a>
            <Link to="/landing-pages/ebook-download-page">
              <div className="blog-block">
                <img
                  src={require("assets/images/landing-pages/ebook.jpg").default}
                  alt="img"
                />

                <p>{t("blogsAndResources.ebookDownload")}</p>
              </div>
            </Link>
            <Link to="/landing-pages/guide-download-page">
              <div className="blog-block">
                <img
                  src={require("assets/images/landing-pages/guide.jpg").default}
                  alt="img"
                />

                <p>{t("blogsAndResources.guideDownload")}</p>
              </div>
            </Link>
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default withTranslation()(AboutBlogsResources);
