import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import constants from "../constants";

const chatBotDisabledForPages = [
  
  "/staff/help",
  "/owner/help",

  "/staff/faq",
  "/owner/faq",
  
  '/privacy-policy',
  '/terms-conditions',

  '/patient/faq',
  '/patient/help',

  '/privacy-policy-for-patient',
  '/terms-conditions-for-patient',

  '/about-us',
];

const useHubspot = () => {
  const profile = useSelector((data) => data.userProfile.profile);
  const location = useLocation();

  useEffect(() => {
    
    if (
      (process.env.REACT_APP_CURRENT_ENV === "production" ||
        process.env.REACT_APP_CURRENT_ENV === "staging") &&
       !chatBotDisabledForPages.includes(location.pathname)
    ) {
      
      var _hsq = (window._hsq = window._hsq || []);
      _hsq.push(["setPath", "/"]);
      _hsq.push(["trackPageView"]);
      const script = document.createElement("script");
      script.src = "//js-na1.hs-scripts.com/21329775.js";
      script.id = "hs-script-loader";
      script.defer = true;
      script.async = true;

      document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    if (
      (!profile || profile?.role?.systemRole !== constants.systemRoles.superAdmin) &&
      (process.env.REACT_APP_CURRENT_ENV === "production" ||
      process.env.REACT_APP_CURRENT_ENV === "staging") &&
      !chatBotDisabledForPages.includes(location.pathname)

    ) {
      let _hsq = (window._hsq = window._hsq || []);
      const currentPath = `${location.pathname}${location.search}`;
      _hsq.push(["setPath", currentPath]);
      _hsq.push(["trackPageView"]);
    }
  }, [profile, location]);
};

export default useHubspot;
