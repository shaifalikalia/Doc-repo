import React from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import AboutMiraxis from "../components/AboutMiraxis";
import HubspotContactForm from "../components/HubspotContactForm/HubspotContactForm";
import constants from "../../../constants";
import useToScrollatTop from "hooks/useToScrollatTop";

const EbookDownloadPage = ({ hubspotType }) => {
  useToScrollatTop();

  let hubspotForm = null;
  if (hubspotType === constants.hubspotFormPages.ebookDownloadPage) {
    hubspotForm = (
      <HubspotContactForm
        region={"na1"}
        portalId={"21329775"}
        formId={"22cf4c6e-9ca6-485d-a4f8-597134393362"}
        id={constants.hubspotFormPages.ebookDownloadPage}
      />
    );
  }

  if (hubspotType === constants.hubspotFormPages.fbHubspotPage) {
    hubspotForm = (
      <HubspotContactForm
        region={"na1"}
        portalId={"21329775"}
        formId={"3c19d80d-09ac-4383-a237-91e233079eb4"}
        id={constants.hubspotFormPages.ebookDownloadPage}
      />
    );
  }
  if (hubspotType === constants.hubspotFormPages.gglHubspotPage) {
    hubspotForm = (
      <HubspotContactForm
        region={"na1"}
        portalId={"21329775"}
        formId={"7fba2e8c-e50e-4dda-8fff-2555748f705b"}
        id={constants.hubspotFormPages.ebookDownloadPage}
      />
    );
  }
  if (hubspotType === constants.hubspotFormPages.smHubspotPage) {
    hubspotForm = (
      <HubspotContactForm
        region={"na1"}
        portalId={"21329775"}
        formId={"6fd97416-e168-4c22-ae4d-0d73a2810cb9"}
        id={constants.hubspotFormPages.ebookDownloadPage}
      />
    );
  }

  return (
    <>
      <Header />
      <div className="guide-banner ebook-banner download-page">
        <div className="container">
          <div className="banner-image justify-content-between">
            <div className="guide-banner-text">
              <h2 className="heading">
                12 Dental Practice Challenges and How to Overcome Them
              </h2>
              <p className="description">
                After actively interviewing our clients in the last six months,
                we see a series of trends when it comes to dental practice
                challenges and we’ve revealed them in our new eBook, along with
                how to overcome them.
              </p>
            </div>

            <div className="guide-download-form">
              <h2>Download Our Ebook</h2>
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
              What the state of the dental industry is
            </li>
            <li className="guide-note-description">
              12 most common dental practice challenges
            </li>
            <li className="guide-note-description">
              How to overcome these challenges
            </li>
          </ul>
        </div>
      </div>
      <AboutMiraxis />
      <Footer />
    </>
  );
};

export default EbookDownloadPage;
