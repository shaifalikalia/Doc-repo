import React from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import AboutMiraxis from "../components/AboutMiraxis";
import HubspotContactForm from "../components/HubspotContactForm/HubspotContactForm";
import constants from "../../../constants";
import useToScrollatTop from "hooks/useToScrollatTop";

const GuideDownloadPage = ({ hubspotType }) => {
  useToScrollatTop();
  let hubspotForm = null;
  if (hubspotType === constants.hubspotFormPages.guideDownloadPage) {
    hubspotForm = (
      <HubspotContactForm
        region={"na1"}
        portalId={"21329775"}
        formId={"e9698132-c307-4bf9-b055-e2af0a989a36"}
        id={constants.hubspotFormPages.guideDownloadPage}
      />
    );
  }

  if (hubspotType === constants.hubspotFormPages.fbGuideHubspotPage) {
    hubspotForm = (
      <HubspotContactForm
        region={"na1"}
        portalId={"21329775"}
        formId={"3c19d80d-09ac-4383-a237-91e233079eb4"}
        id={constants.hubspotFormPages.guideDownloadPage}
      />
    );
  }
  if (hubspotType === constants.hubspotFormPages.gglGuideHubspotPage) {
    hubspotForm = (
      <HubspotContactForm
        region={"na1"}
        portalId={"21329775"}
        formId={"7fba2e8c-e50e-4dda-8fff-2555748f705b"}
        id={constants.hubspotFormPages.guideDownloadPage}
      />
    );
  }
  if (hubspotType === constants.hubspotFormPages.smGuideHubspotPage) {
    hubspotForm = (
      <HubspotContactForm
        region={"na1"}
        portalId={"21329775"}
        formId={"6fd97416-e168-4c22-ae4d-0d73a2810cb9"}
        id={constants.hubspotFormPages.guideDownloadPage}
      />
    );
  }

  return (
    <>
      <Header />
      <div className="guide-banner download-page">
        <div className="container">
          <div className="banner-image  justify-content-between">
            <div className="guide-banner-text">
              <h2 className="heading">
                The Ultimate Guide to Creating Order From Chaos in Your Dental
                Practice
              </h2>
              <p className="description">
                Does it feel chaotic running your dental practice, even on the
                best of days? You’re not alone. It’s time to create a sense of
                order amidst the chaos.
              </p>
            </div>
            <div className="guide-download-form">
              <h2>Download Our Guide</h2>
              {hubspotForm}
            </div>
          </div>
        </div>
      </div>
      <div className="guide-note-block">
        <div className="container">
          <h2 className="guide-note-heading">Here’s what’s inside:</h2>
          <ul>
            <li className="guide-note-description">
              Current state of the dentistry industry and how it’s positively
              transforming thanks to digital automation platforms.
            </li>
            <li className="guide-note-description">
              12 challenges every dentist/owner is facing in their practice
              today—because we think it’s important to know you’re not alone!
            </li>
            <li className="guide-note-description">
              How digital automation enables you to “Practice Smarter” and in
              turn empower your team, seamlessly communicate with your
              healthcare community, and simplify your day-to-day operations to
              optimize patient care and grow your practice.
            </li>
            <li className="guide-note-description">
              16 benefits and results automation brings for delivering a higher
              standard of care that a holistic, integrated model of healthcare
              management delivers.
            </li>
          </ul>
        </div>
      </div>
      <AboutMiraxis />
      <Footer />
    </>
  );
};

export default GuideDownloadPage;
