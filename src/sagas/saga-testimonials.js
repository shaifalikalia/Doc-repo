import axios from "axios";
import { put, takeLatest, fork, call, all } from "redux-saga/effects";
import { Config } from "../config";

const UTILITY_POINT_URL = Config.serviceUrls.utilityBaseUrl;
const CMS_POINT_URL = Config.serviceUrls.cmsBaseUrl;

export function* getTestimonialList(payload) {
  const data = payload;
  const {
    payload: {
      PageSize = null,
      PageNumber = null,
      testimonialCategoryId = null,
    },
  } = data;
  try {
    yield put({
      type: "GET_TESTIMONIAL_LIST_REQUESTED",
    });

    const response = yield call(() => {
      return axios
        .get(
          `${UTILITY_POINT_URL}/Utility/Testimonial/?pageNumber=${PageNumber}&pageSize=${PageSize}&testimonialCategoryId=${testimonialCategoryId}`
        )
        .then((res) => {
          return res.data;
        });
    });

    yield put({
      type: "GET_TESTIMONIAL_LIST_SUCCESS",
      payload: { data: [...response.data], pagination: response.pagination },
    });
  } catch (e) {
    yield put({
      type: "GET_TESTIMONIAL_LIST_FALIURE",
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

export function* getTestimonialCat(payload) {
  try {
    yield put({
      type: "GET_TESTIMONIAL_CAT_REQUESTED",
    });
    const response = yield call(() => {
      return axios.get(`${CMS_POINT_URL}/Testimonial/category`).then((res) => {
        return res.data;
      });
    });
    yield put({
      type: "GET_TESTIMONIAL_CAT_SUCCESS",
      payload: response.data,
    });
  } catch (e) {
    yield put({
      type: "GET_TESTIMONIAL_CAT_FALIURE",
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

export function* setTestimonialStatus(payload) {
  const data = payload;
  try {
    yield put({
      type: "SET_TESTIMONIAL_STATUS_REQUESTED",
    });

    const response = yield call(() => {
      return axios
        .post(`${UTILITY_POINT_URL}/Utility/Testimonial/updateStatus`, {
          testimonialId: data.payload.testimonialId,
          status: data.payload.status,
        })
        .then((res) => {
          return res.data;
        });
    });

    yield put({
      type: "SET_TESTIMONIAL_STATUS_SUCCESS",
      payload: response.message,
    });

    const Payload = {
      payload: {
        PageSize: 10,
        PageNumber: data.payload.pageNumber,
        testimonialCategoryId: data.payload.testimonialCategoryId,
      },
    };

    yield all([getTestimonialList(Payload)]);
  } catch (e) {
    yield put({
      type: "SET_TESTIMONIAL_STATUS_FAILURE",
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

export function* addTestimonial(payload) {
  const data = payload;
  try {
    yield put({
      type: "ADD_TESTIMONIAL_REQUESTED",
    });
    const response = yield call(() => {
      return axios
        .post(`${UTILITY_POINT_URL}/Utility/Testimonial`, data.payload)
        .then((res) => {
          return res.data;
        });
    });
    yield put({
      type: "ADD_TESTIMONIAL_SUCCESS",
      payload: response.message,
    });
  } catch (e) {
    yield put({
      type: "ADD_TESTIMONIAL_FALIURE",
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

export function* editTestimonial(payload) {
  const data = payload;
  try {
    yield put({
      type: "ADD_TESTIMONIAL_REQUESTED",
    });
    const response = yield call(() => {
      return axios
        .put(`${UTILITY_POINT_URL}/Utility/Testimonial`, data.payload)
        .then((res) => {
          return res.data;
        });
    });
    yield put({
      type: "ADD_TESTIMONIAL_SUCCESS",
      payload: response.message,
    });
  } catch (e) {
    yield put({
      type: "ADD_TESTIMONIAL_FALIURE",
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

export function* updateTestimonialImage(payload) {
  const data = payload;
  try {
    yield put({
      type: "UPDATE_TESTIMONIAL_IMAGE_REQUESTED",
    });
    const response = yield call(() => {
      return axios
        .put(`${UTILITY_POINT_URL}/Utility/Image`, data.payload)
        .then((res) => {
          return res.data;
        });
    });

    yield put({
      type: "UPDATE_TESTIMONIAL_IMAGE_SUCCESS",
      payload: response.message,
    });
  } catch (e) {
    yield put({
      type: "UPDATE_TESTIMONIAL_IMAGE_FALIURE",
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

function* watchgetTestimonialList() {
  yield takeLatest("GET_TESTIMONIAL_LIST", getTestimonialList);
}
function* watchgetTestimonialCat() {
  yield takeLatest("GET_TESTIMONIAL_CAT", getTestimonialCat);
}
function* watchsetTestimonialStatus() {
  yield takeLatest("SET_TESTIMONIAL_STATUS", setTestimonialStatus);
}
function* watchaddTestimonial() {
  yield takeLatest("ADD_TESTIMONIAL", addTestimonial);
}

function* watcheditTestimonial() {
  yield takeLatest("EDIT_TESTIMONIAL", editTestimonial);
}

function* watchupdateTestimonialImage() {
  yield takeLatest("UPDATE_TESTIMONIAL_IMAGE", updateTestimonialImage);
}

export const TestimonialSaga = [
  fork(watchgetTestimonialList),
  fork(watchgetTestimonialCat),
  fork(watchsetTestimonialStatus),
  fork(watchaddTestimonial),
  fork(watcheditTestimonial),
  fork(watchupdateTestimonialImage),
];
