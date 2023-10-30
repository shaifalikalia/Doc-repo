import React from "react";
import {
  FacebookShareButton,
  EmailShareButton,
  TwitterShareButton,
  LinkedinShareButton,
} from "react-share";

export const MediaLink = ({ title }) => {
  let location = window.location.href;
  let blogTitle = title ? title : "";
  return (
    <ul>
      <li>
        <FacebookShareButton url={location} title={blogTitle}>
          <img
            src={require("assets/images/landing-pages/facebook.svg").default}
            alt="img"
            class="img-fluid"
          />
        </FacebookShareButton>
      </li>
      <li>
        <TwitterShareButton url={location} title={blogTitle}>
          <img
            src={require("assets/images/landing-pages/twitter.svg").default}
            alt="img"
            class="img-fluid"
          />
        </TwitterShareButton>
      </li>
      <li>
        <LinkedinShareButton url={location} title={blogTitle}>
          <img
            src={require("assets/images/landing-pages/linkedln.svg").default}
            alt="img"
            class="img-fluid"
          />
        </LinkedinShareButton>
      </li>
      <li>
        <EmailShareButton url={location} title={blogTitle}>
          <img
            src={require("assets/images/landing-pages/mail.svg").default}
            alt="img"
            class="img-fluid"
          />
        </EmailShareButton>
      </li>
    </ul>
  );
};
