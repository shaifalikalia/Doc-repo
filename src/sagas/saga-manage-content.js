import axios from "axios";
import { put, takeLatest, fork, call } from "redux-saga/effects";
import { Config } from "../config";

const UTILITY_POINT_URL = Config.serviceUrls.utilityBaseUrl;

const CMS_POINT_URL = Config.serviceUrls.cmsBaseUrl;

export function* getpagecontent(payload) {
  const data = payload;
  try {
    yield put({
      type: "PAGE_CONTENT_REQUESTED",
    });

    const response = yield call(() => {
      return axios
        .get(`${CMS_POINT_URL}/Cms/${data.payload.id}`)
        .then((res) => {
          return res.data;
        });
    });

    yield put({
      type: "PAGE_CONTENT_SUCESS",
      payload: response.data,
    });
  } catch (e) {
    yield put({
      type: "PAGE_CONTENT_FALIURE",
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

export function* getConent(payload) {
  const data = payload;
  try {
    yield put({
      type: "SINGLE_PAGE_CONTENT_REQUESTED",
    });

    const response = yield call(() => {
      return axios
        .get(`${CMS_POINT_URL}/CMS/${data.payload.id}`)
        .then((res) => {
          return res.data;
        });
    });

    yield put({
      type: "SINGLE_PAGE_CONTENT_SUCESS",
      payload: response.data,
    });
  } catch (e) {
    yield put({
      type: "SINGLE_PAGE_CONTENT_FALIURE",
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

export function* getContactConent(payload) {
  const data = payload;
  try {
    yield put({
      type: "CONTACT_PAGE_CONTENT_REQUESTED",
    });

    const response = yield call(() => {
      return axios
        .get(`${CMS_POINT_URL}/CMS/${data.payload.id}`)
        .then((res) => {
          return res.data;
        });
    });

    yield put({
      type: "CONTACT_PAGE_CONTENT_SUCESS",
      payload: response.data,
    });
  } catch (e) {
    yield put({
      type: "CONTACT_PAGE_CONTENT_FALIURE",
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

export function* getCompanyInformation() {
  try {
    yield put({ type: "COMPANY_INFORMATION_CONTENT_REQUESTED" });

    const response = yield call(() => {
      return axios
        .get(`${CMS_POINT_URL}/Cms/companyInformation`)
        .then((r) => r.data);
    });

    yield put({
      type: "COMPANY_INFORMATION_CONTENT_SUCCESS",
      payload: response.data,
    });
  } catch (e) {
    yield put({ type: "COMPANY_INFORMATION_CONTENT_FAILURE" });
    yield put({ type: "ERROR", payload: e });
    yield put({ type: "REMOVE_ERROR" });
  }
}

export function* updatepagecontent(payload) {
  const data = payload;
  try {
    yield put({
      type: "UPDATE_CONTENT_REQUESTED",
    });

    const response = yield call(() => {
      return axios
        .put(
          `${UTILITY_POINT_URL}/Utility/CMS/${data.payload.id}`,
          data.payload
        )
        .then((res) => {
          return res.data;
        });
    });

    yield put({
      type: "UPDATE_CONTENT_SUCESS",
      payload: response.message,
    });
  } catch (e) {
    yield put({
      type: "UPDATE_CONTENT_FALIURE",
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

export function* addSchedule(payload) {
  const data = payload;
  try {
    yield put({
      type: "ADD_SCHEDULE_REQUESTED",
    });

    const response = yield call(() => {
      return axios
        .post(`${CMS_POINT_URL}/DemoRequest`, data.payload)
        .then((res) => {
          return res.data;
        });
    });

    yield put({
      type: "ADD_SCHEDULE_SUCESS",
      payload: response.message,
    });
  } catch (e) {
    yield put({
      type: "ADD_SCHEDULE_FALIURE",
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

export function* getpackageDetail(payload) {
  try {
    yield put({
      type: "GET_PACKAGE_DETAIL_REQUESTED",
    });

    const response = yield call(() => {
      return axios.get(`${CMS_POINT_URL}/Package`).then((res) => {
        return res.data;
      });
    });

    yield put({
      type: "GET_PACKAGE_DETAIL_SUCESS",
      payload: response.data,
    });
  } catch (e) {
    yield put({
      type: "GET_PACKAGE_DETAIL_FALIURE",
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

export function* getCatTestimonial(payload) {
  const data = payload;
  try {
    yield put({
      type: "GET_CAT_TESTIMONIAL_REQUESTED",
    });

    const response = yield call(() => {
      return axios
        .get(
          `${CMS_POINT_URL}/Testimonial?testimonialCategoryId=${data.payload.id}`
        )
        .then((res) => {
          return res.data;
        });
    });

    yield put({
      type: "GET_CAT_TESTIMONIAL_SUCESS",
      payload: response.data,
    });
  } catch (e) {
    yield put({
      type: "GET_CAT_TESTIMONIAL_FALIURE",
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

function* watchGetPageContent() {
  yield takeLatest("GET_PAGE_CONTENT", getpagecontent);
}
function* watchUpdatePageContent() {
  yield takeLatest("UPDATE_PAGE_CONTENT", updatepagecontent);
}
function* watchgetConent() {
  yield takeLatest("GET_CONTENT", getConent);
}

function* watchgetContactConent() {
  yield takeLatest("GET_CONTACT_CONTENT", getContactConent);
}

function* watchGetCompanyInformation() {
  yield takeLatest("GET_COMPANY_INFORMATION", getCompanyInformation);
}

function* watchaddSchedule() {
  yield takeLatest("ADD_SCHEDULE", addSchedule);
}

function* watchgetpackageDetail() {
  yield takeLatest("GET_PACKAGE_DETAIL", getpackageDetail);
}

function* watchgetCatTestimonial() {
  yield takeLatest("GET_CAT_TESTIMONIAL", getCatTestimonial);
}

export const PageContentSaga = [
  fork(watchGetPageContent),
  fork(watchUpdatePageContent),
  fork(watchgetConent),
  fork(watchgetContactConent),
  fork(watchGetCompanyInformation),
  fork(watchaddSchedule),
  fork(watchgetpackageDetail),
  fork(watchgetCatTestimonial),
];
