import axios from "axios";
import { put, takeLatest, fork, call } from "redux-saga/effects";
import { Config } from "../config";

const USER_POINT_URL = Config.serviceUrls.userBaseUrl;
const UTILITY_POINT_URL = Config.serviceUrls.utilityBaseUrl;

export function* getProfile(getFcmToken) {
  const bodyParameters = {
    fcmTokenForWeb: getFcmToken.payload,
  };
  try {
    yield put({
      type: "PROFILEREQUESTED",
    });
    const response = yield call(() => {
      return axios
        .get(`${USER_POINT_URL}/User/Profile`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("msal.idtoken"),
          },
          params: bodyParameters,
        })
        .then((res) => {
          return res.data;
        });
    });

    if (response.statusCode === 200) {
      yield put({
        type: "PROFILE",
        payload: response.data,
      });
    }
    if (response.statusCode === 401) {
      yield put({
        type: "PROFILE_SUCCESS_ERROR",
        payload: response.message,
      });
    }
    if (response.statusCode === 500) {
      yield put({
        type: "PROFILE_SUCCESS_NETWORK_ERROR",
        payload: response.message,
      });
    }
  } catch (e) {
    yield put({
      type: "PROFILE_SUCCESS_NETWORK_ERROR",
      payload:
        "There seems be an issue with your Profile. Please contact the Miraxis team.",
    });

    yield put({
      type: "ERROR",
      payload: e,
    });
    yield put({
      type: "REMOVE_ERROR",
    });
  }
}

export function* getSastoken() {
  try {
    const response = yield call(() => {
      return axios
        .get(`${UTILITY_POINT_URL}/Utility/Account/Token`)
        .then((res) => {
          return res.data;
        });
    });

    yield put({
      type: "TOKEN_SUCESS",
      payload: response.data,
    });
  } catch (e) {
    yield put({
      type: "ERROR",
      payload: e,
    });
    yield put({
      type: "REMOVE_ERROR",
    });
  }
}

function* watchGetProfile() {
  yield takeLatest("GET_PROFILE", getProfile);
}

function* watchGetToken() {
  yield takeLatest("GET_SAS_TOKEN", getSastoken);
}

export const ProfileSaga = [fork(watchGetProfile), fork(watchGetToken)];
