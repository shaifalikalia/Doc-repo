import React from "react";
import { withTranslation } from "react-i18next";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";

const AboutBlog = ({ t }, props) => {
  const settings = {
    dots: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    initialSlide: 1,
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
    <div className="about-blog-section">
      <div className="container">
        <div className="title-col">
          <h2>{t("blog")}</h2>
        </div>

        <div className="blog-slider">
          <Slider {...settings}>
            <div className="blog-block">
              <div className="_txt">
                <div className="date-block">05-05-22</div>
                <p>Offices are changing faster than we ever imagined.</p>
                <div className="tag-box">
                  <span className="tag-single">Interview</span>
                </div>
              </div>
            </div>
            <div className="blog-block">
              <div className="_txt">
                <div className="date-block">05-05-22</div>
                <p>Offices are changing faster than we ever imagined.</p>
                <div className="tag-box">
                  <span className="tag-single">Interview</span>
                </div>
              </div>
            </div>
            <div className="blog-block">
              <div className="_txt">
                <div className="date-block">05-05-22</div>
                <p>Offices are changing faster than we ever imagined.</p>
                <div className="tag-box">
                  <span className="tag-single">Interview</span>
                </div>
              </div>
            </div>
            <div className="blog-block">
              <div className="_txt">
                <div className="date-block">05-05-22</div>
                <p>Offices are changing faster than we ever imagined.</p>
                <div className="tag-box">
                  <span className="tag-single">Interview</span>
                </div>
              </div>
            </div>
            <div className="blog-block">
              <div className="_txt">
                <div className="date-block">05-05-22</div>
                <p>Offices are changing faster than we ever imagined.</p>
                <div className="tag-box">
                  <span className="tag-single">Interview</span>
                </div>
              </div>
            </div>
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default withTranslation()(AboutBlog);
