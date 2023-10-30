import React from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import AboutMiraxis from "../components/AboutMiraxis";

const GuideThankPage = () => {
  return (
    <>
      <Header />
      <div className="guide-banner">
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
              <h2 className="title">Congratulations!</h2>
              <p className="description">
                You’ve taken the first step in creating order from chaos in your
                dental practice. 
              </p>
              <p className="description">Check your inbox for the guide. </p>
              <p className="description mb-0">
                Don’t see it? Be sure to check your junk mail folder and add us
                to your whitelist!
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

export default GuideThankPage;
