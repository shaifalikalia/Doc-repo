import React from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import AboutMiraxis from "../components/AboutMiraxis";

const EbookThankPage = () => {
  return (
    <>
      <Header />
      <div className="guide-banner ebook-banner ">
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
                Your 12 Dental Practice Challenges and How to Overcome Them
                eBook is on its way to your email inbox.
              </p>
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

export default EbookThankPage;
