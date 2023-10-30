import HomeFooter from "./../Home-Footer";
import React from "react";
import { useLocation } from "react-router";
import constants from "./../../constants";
import Footer from "./index";

function FooterFactory({ role }) {
  const location = useLocation();

  if (location.pathname.includes("/blogs/")) return null;
  if (location.pathname.includes("/landing-pages/")) return null;

  if (role?.systemRole === constants.systemRoles.vendor) {
    return null;
  }

  if (role) {
    return <Footer />;
  }

  return <HomeFooter />;
}

export default FooterFactory;
