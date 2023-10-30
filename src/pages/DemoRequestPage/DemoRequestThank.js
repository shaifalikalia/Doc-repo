import AboutMiraxis from "pages/ThankYouDownload/components/AboutMiraxis";
import Footer from "pages/ThankYouDownload/components/Footer";
import Header from "pages/ThankYouDownload/components/Header";
import React from "react";
import useToScrollatTop from "hooks/useToScrollatTop";
import { useHistory } from "react-router-dom";

const DemoRequestThank = () => {
  useToScrollatTop();
  const history = useHistory();

  const moveToBlog = () => {
    history.push("/about-us");
    moveToDiv("blogs-resources-section", 10);
  };

  const moveToDiv = (className, timer) => {
    setTimeout(() => {
      const errors = document.getElementsByClassName(className);
      if (errors && errors?.length) {
        errors[0].scrollIntoView();
      }
    }, timer);
  };

  return (
    <>
      <Header />
      <div className="guide-banner demo-thank-banner ">
        <div className="container">
          <div className="banner-image d-flex justify-content-center">
            <div className="thank-guide-form">
              <img
                src={
                  require("assets/images/landing-pages/round-check.svg").default
                }
                alt="img"
                className="img-fluid"
              />
              <h2 className="title">Thank you!</h2>
              <p className="description">
                Thank you for contacting us, we will be in touch shortly; in the
                meantime, you can find out more
                <u
                  className="pointer"
                  onClick={() => {
                    history.push("/about-us");
                  }}
                >
                  {" "}
                  about us
                </u>
                , explore our
                <u
                  className="pointer"
                  onClick={() => {
                    history.push("/products");
                  }}
                >
                  {" "}
                  products
                </u>
                , or visit our
                <u className="pointer" onClick={moveToBlog}>
                  {" "}
                  blogs.
                </u>{" "}
                Alternatively, you can
                <u
                  className="pointer"
                  onClick={() => {
                    history.push("/contact");
                  }}
                >
                  {" "}
                  contact us
                </u>
                .
              </p>
            </div>
          </div>
        </div>
      </div>

      <AboutMiraxis />
      <Footer />
    </>
  );
};

export default DemoRequestThank;
