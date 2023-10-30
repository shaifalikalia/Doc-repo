import axios from "axios";
import { put, takeLatest, fork, call, all, delay } from "redux-saga/effects";
import { Config } from "../config";

const OFFICE_POINT_URL = Config.serviceUrls.officeBaseUrl;
const USER_POINT_URL = Config.serviceUrls.userBaseUrl;
const UTILITY_POINT_URL = Config.serviceUrls.utilityBaseUrl;

export function* getOffices(payload) {
  const data = payload;
  try {
    yield put({
      type: "OFFICEREQUESTED",
    });
    const response = yield call(() => {
      return axios
        .get(
          `${OFFICE_POINT_URL}/Office/Owner/${data.payload.Id}?pageNumber=${data.payload.pageNumber}&pageSize=${data.payload.pageSize}`
        )
        .then((res) => {
          return res.data;
        });
    });

    yield put({
      type: "OFFICESUCCESS",
      payload: response,
    });
  } catch (e) {
    yield put({
      type: "OFFICES_FALIURE",
      payload: "There seems some technical issue while getting office.",
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

export function* getOfficesDetail(payload) {
  const data = payload;
  try {
    yield put({
      type: "OFFICE_DETAIL_REQUESTED",
    });

    const response = yield call(() => {
      return axios
        .get(`${OFFICE_POINT_URL}/Office/${data.payload.Id}`)
        .then((res) => {
          return res.data;
        });
    });

    yield put({
      type: "OFFICE_DETAIL_SUCCESS",
      payload: response.data,
    });
  } catch (e) {
    yield put({
      type: "OFFICE_DETAIL_FALIURE",
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

export function* getOfficesScroll(payload) {
  const data = payload;
  try {
    yield put({
      type: "OFFICEREQUESTED_SCROLL_REQUESTED",
    });
    const response = yield call(() => {
      return axios
        .get(
          `${OFFICE_POINT_URL}/Office/Owner/${data.payload.Id}?pageNumber=${data.payload.pageNumber}&pageSize=${data.payload.pageSize}`
        )
        .then((res) => {
          return res.data;
        });
    });

    yield put({
      type: "OFFICEREQUESTED_SCROLL_SUCCESS",
      payload: response,
    });
  } catch (e) {
    yield put({
      type: "OFFICEREQUESTED_SCROLL_FALIURE",
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

export function* addOffice(action) {
  const data = action;
  try {
    yield put({
      type: "OFFICEADDREQUESTED",
    });
    const response = yield call(() => {
      return axios
        .post(`${OFFICE_POINT_URL}/Office`, data.payload)
        .then((res) => {
          return res.data;
        });
    });

    if (response.statusCode === 200) {
      yield put({
        type: "OFIICEADDSUCCESS",
        payload: response.message,
      });
      const responseProfile = yield call(() => {
        return axios.get(`${USER_POINT_URL}/User/Profile`).then((res) => {
          return res.data;
        });
      });

      yield put({
        type: "PROFILE",
        payload: responseProfile.data,
      });

      yield put({
        type: "PROFILE_UPDATED",
        payload: response.responseProfile,
      });
    }

    if (response.statusCode === 400) {
      yield put({
        type: "OFIICEADDSUCCESSERROR",
        payload: response.message,
      });
    }
  } catch (e) {
    yield put({
      type: "OFIICEADDERROR",
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

export function* editOffice(action) {
  const data = action;
  try {
    yield put({
      type: "OFFICEADDREQUESTED",
    });

    const response = yield call(() => {
      return axios
        .put(
          `${OFFICE_POINT_URL}/Office/${data.payload.officeId}`,
          data.payload
        )
        .then((res) => {
          return res.data;
        });
    });

    if (response.statusCode === 200) {
      yield put({
        type: "OFIICEADDSUCCESS",
        payload: response.message,
      });

      const responseProfile = yield call(() => {
        return axios.get(`${USER_POINT_URL}/User/Profile`).then((res) => {
          return res.data;
        });
      });

      yield put({
        type: "PROFILE",
        payload: responseProfile.data,
      });

      yield put({
        type: "PROFILE_UPDATED",
        payload: response.responseProfile,
      });
    }

    if (response.statusCode === 400) {
      yield put({
        type: "OFIICEADDSUCCESSERROR",
        payload: response.message,
      });
    }
  } catch (e) {
    yield put({
      type: "OFIICEADDERROR",
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

export function* UpdateImage(action) {
  const data = action;
  try {
    yield put({
      type: "UPDATE_IMAGE_REQUESTED",
    });

    const response = yield call(() => {
      return axios
        .put(`${UTILITY_POINT_URL}/Utility/Image`, data.payload)
        .then((res) => {
          return res.data;
        });
    });

    yield put({
      type: "UPDATE_IMAGE_SUCCESS",
      payload: response.message,
    });

    const responseProfile = yield call(() => {
      return axios.get(`${USER_POINT_URL}/User/Profile`).then((res) => {
        return res.data;
      });
    });

    yield put({
      type: "PROFILE",
      payload: responseProfile.data,
    });

    yield put({
      type: "PROFILE_UPDATED",
      payload: response.responseProfile,
    });
  } catch (e) {
    yield put({
      type: "UPDATE_IMAGE_ERROR",
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

export function* getOfficesProvience(payload) {
  const data = payload;
  try {
    yield put({
      type: "PROVIENCE_REQUESTED",
    });

    const response = yield call(() => {
      return axios
        .get(`${UTILITY_POINT_URL}/Utility/Province/${data.payload.id}`)
        .then((res) => {
          return res.data;
        });
    });

    yield put({
      type: "PROVIENCE_SUCESS",
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

export function* getOfficesCountry() {
  try {
    yield put({
      type: "COUNTRY_REQUESTED",
    });

    const response = yield call(() => {
      return axios.get(`${UTILITY_POINT_URL}/Utility/Country`).then((res) => {
        return res.data;
      });
    });

    yield put({
      type: "COUNTRY_SUCESS",
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

export function* getOfficesCity(payload) {
  const data = payload;
  try {
    yield put({
      type: "CITY_REQUESTED",
    });

    const response = yield call(() => {
      return axios
        .get(`${UTILITY_POINT_URL}/Utility/City/${data.payload.id}`)
        .then((res) => {
          return res.data;
        });
    });

    yield put({
      type: "CITY_SUCESS",
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

export function* setOfficeStatus(action) {
  const data = action;

  try {
    yield put({
      type: "SET_OFFICE_STATUS_REQUESTED",
    });

    const response = yield call(() => {
      return axios
        .post(`${OFFICE_POINT_URL}/Office/updateStatus`, {
          officeId: data.payload.officeId,
          status: data.payload.status,
          id: data.payload.id,
        })
        .then((res) => {
          return res.data;
        });
    });

    if (response.statusCode === 200) {
      yield put({
        type: "SET_OFFICE_STATUS_SUCCESS",
        payload: response.message,
      });

      const responseProfile = yield call(() => {
        return axios.get(`${USER_POINT_URL}/User/Profile`).then((res) => {
          return res.data;
        });
      });

      yield put({
        type: "PROFILE",
        payload: responseProfile.data,
      });

      yield put({
        type: "PROFILE_UPDATED",
        payload: response.responseProfile,
      });
      yield delay(1500);
      const Payload = {
        payload: {
          Id: data.payload.id,
          pageNumber: 1,
          pageSize: data.payload.currentPage,
        },
      };
      yield all([getOffices(Payload)]);
    }

    if (response.statusCode === 400) {
      yield put({
        type: "SET_OFFICE_STATUS_SUCCESS_ERROR",
        payload: response.message,
      });
    }
  } catch (e) {
    yield put({
      type: "SET_OFFICE_STATUS_ERROR",
      payload: data.payload.status
        ? "There seems some technical issue while activate the office."
        : "There seems some technical issue while De-activate the office.",
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

function* watchGetOffices() {
  yield takeLatest("GET_OFFICES", getOffices);
}

function* watchAddOffices() {
  yield takeLatest("ADD_OFFICES", addOffice);
}

function* watchEditOffices() {
  yield takeLatest("EDIT_OFFICES", editOffice);
}

function* watchUpdateImage() {
  yield takeLatest("UPDATE_IMAGE", UpdateImage);
}

function* watchGetProvience() {
  yield takeLatest("GET_OFFICES_PROVIENCE", getOfficesProvience);
}

function* watchGetCountry() {
  yield takeLatest("GET_OFFICES_COUNTRY", getOfficesCountry);
}

function* watchGetCity() {
  yield takeLatest("GET_OFFICES_CITY", getOfficesCity);
}

function* watchsetOfficeStatus() {
  yield takeLatest("SET_OFFICE_STATUS", setOfficeStatus);
}

function* watchgetOfficesScroll() {
  yield takeLatest("GET_OFFICES_SCROLL", getOfficesScroll);
}

function* watchgetOfficesDetail() {
  yield takeLatest("GET_OFFICES_Detail", getOfficesDetail);
}

export const OfficesSaga = [
  fork(watchGetOffices),
  fork(watchAddOffices),
  fork(watchGetProvience),
  fork(watchEditOffices),
  fork(watchGetCountry),
  fork(watchGetCity),
  fork(watchsetOfficeStatus),
  fork(watchgetOfficesScroll),
  fork(watchgetOfficesDetail),
  fork(watchUpdateImage),
];
