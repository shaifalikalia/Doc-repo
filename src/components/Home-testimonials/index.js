import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const HomeTestimoninal = (props) => {
  const settings = {
    dots: false,
    infinite: props.data.length > 3 ? true : false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,

    initialSlide: 1,
    responsive: [
      {
        breakpoint: 1300,
        settings: {
          slidesToShow: 2,
          infinite: true,
        },
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 1,
          adaptiveHeight: true,
          draggable: true,
          infinite: true,
        },
      },
    ],
  };

  let testimonialData = null;

  if (props.data) {
    testimonialData = props.data.map((item) => {
      return (
        <div className={`testimonial-block   `} key={item.id}>
          <div className="media">
            <img
              src={
                item.imageUrl
                  ? item.imageUrl
                  : require("assets/images/default-image.svg").default
              }
              alt="img"
            />
            <div className="media-body">
              <h4>{item.name}</h4>
              <p>{item.designation}</p>
            </div>
          </div>
          <div className="_txt">
            <p>{item.content}</p>
          </div>
        </div>
      );
    });
  }

  return (
    <div className="testimonials-section">
      <div className="title-col">
        <div className="container">
          <h2>{props.title}</h2>
        </div>
      </div>
      <div
        className={`testomonial-slider  ${
          props.data.length < 3 && "no-slider"
        } ${props?.data.length === 3 ? "no-slider-3" : ""}`}
      >
        {props.data && <Slider {...settings}>{testimonialData}</Slider>}
      </div>
    </div>
  );
};

export default HomeTestimoninal;
