import React from "react";
import { withTranslation } from "react-i18next";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";

const AboutNewsRoom = ({ t }, props) => {
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
    <div className="about-blog-section news-room-section">
      <div className="container">
        <div className="title-col">
          <h2>{t("navbar.newsRoom")}</h2>
        </div>
        <div className="blog-slider">
          <Slider {...settings}>
            <div className="blog-block">
              <img
                src={
                  require("assets/images/landing-pages/news-room-img.jpg")
                    .default
                }
                alt="img"
              />
              <div className="date-block">05-05-22</div>
              <p>Offices are changing faster than we ever imagined.</p>
            </div>
            <div className="blog-block">
              <img
                src={
                  require("assets/images/landing-pages/news-room-img2.jpg")
                    .default
                }
                alt="img"
              />
              <div className="date-block">05-05-22</div>
              <p>Offices are changing faster than we ever imagined.</p>
            </div>
            <div className="blog-block">
              <img
                src={
                  require("assets/images/landing-pages/news-room-img3.jpg")
                    .default
                }
                alt="img"
              />
              <div className="date-block">05-05-22</div>
              <p>Offices are changing faster than we ever imagined.</p>
            </div>
            <div className="blog-block">
              <img
                src={
                  require("assets/images/landing-pages/news-room-img4.jpg")
                    .default
                }
                alt="img"
              />
              <div className="date-block">05-05-22</div>
              <p>Offices are changing faster than we ever imagined.</p>
            </div>
            <div className="blog-block">
              <img
                src={
                  require("assets/images/landing-pages/news-room-img2.jpg")
                    .default
                }
                alt="img"
              />
              <div className="date-block">05-05-22</div>
              <p>Offices are changing faster than we ever imagined.</p>
            </div>
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default withTranslation()(AboutNewsRoom);
