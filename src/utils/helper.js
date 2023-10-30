import decodeJWT from "jwt-decode";
import { MsalAuthProvider } from "react-aad-msal";
import { config, parameters, options } from "services/authProvider";

class Helper {
  static isLoggedIn = () => {
    return localStorage.getItem("msal.idtoken") ? true : false;
  };

  static getToken = async () => {
    const authProvider = new MsalAuthProvider(config, parameters, options);
    const token = await authProvider.getIdToken();
    return token.idToken.rawIdToken;
  };

  static validateNumber = (number) => {
    //eslint-disable-next-line
    if (
      /^\+?[\(\.)\d-]+$/.test(number) &&
      number.length >= 9 &&
      number.length <= 15
    ) {
      return true;
    }
    return false;
  };

  static validateEmail = (email) => {
    //eslint-disable-next-line
    if (
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      return true;
    }

    return false;
  };

  static validatePostcode = (code) => {
    if (
      /^\s*[a-ceghj-npr-tvxy]\d[a-ceghj-npr-tv-z](\s)?\d[a-ceghj-npr-tv-z]\d\s*$/i.test(
        code
      )
    ) {
      return true;
    }

    return false;
  };

  static validateUSAPostcode = (code) => {
    if (/^\d{5}(?:-\d{4})?$/.test(code)) {
      return true;
    }

    return false;
  };

  static validatePassword = (passwordValue) => {
    if (
      /^((?=.*[a-z])(?=.*[A-Z])(?=.*\d)|(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])|(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9])|(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]))([A-Za-z\d@#$%^&£*\-_+=[\]{}|\\:',?/`~"();!]|\.(?!@)){8,16}$/.test(
        passwordValue
      )
    ) {
      return true;
    }

    return false;
  };

  static validateSamePassword = (newPassword, confrimPassword) => {
    if (newPassword === confrimPassword) {
      return true;
    }

    return false;
  };

  static validateNumeric = (number) => {
    if (/^\d{1,10}(\.\d{1,4})?$/.test(number)) {
      return true;
    }
    return false;
  };

  static getUserInfo() {
    const token = localStorage.getItem("msal.idtoken");
    if (token) {
      const decoded = decodeJWT(token);
      return {
        profile: {
          oid: decoded.oid,
        },
      };
    }
    return true;
  }
}

export default Helper;
