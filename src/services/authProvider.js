import { LoginType } from "react-aad-msal";

export const config = {
  auth: {
    authority: process.env.REACT_APP_AZURE_AD_AUTHORITY,
    clientId: process.env.REACT_APP_AZURE_APP_CLIENT_ID,
    postLogoutRedirectUri: window.location.origin,
    redirectUri: window.location.origin,
    validateAuthority: false,
    navigateToLoginRequestUrl: false,
    navigateFrameWait: 0,
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
};

export const parameters = {
  scopes: [process.env.REACT_APP_AZURE_APP_SCOPES],
};

export const options = {
  loginType: LoginType.Redirect,
};
