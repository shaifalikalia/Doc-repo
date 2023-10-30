import axios from "axios";
import { put, takeLatest, fork, call, all } from "redux-saga/effects";
import { Config } from "../config";

const USER_POINT_URL = Config.serviceUrls.userBaseUrl;

export function* getDemoRequest(payload) {
  const data = payload;
  const {
    payload: {
      PageSize = null,
      PageNumber = null,
      isPending = null,
      searchTerm = null,
    },
  } = data;
  try {
    yield put({
      type: "GET_DEMO_REQUESTED",
    });

    const response = yield call(() => {
      return axios
        .get(
          searchTerm
            ? `${USER_POINT_URL}/DemoRequest/?pageNumber=${PageNumber}&pageSize=${PageSize}&isPending=${isPending}&searchTerm=${searchTerm}`
            : `${USER_POINT_URL}/DemoRequest/?pageNumber=${PageNumber}&pageSize=${PageSize}&isPending=${isPending}`
        )
        .then((res) => {
          return res.data;
        });
    });

    yield put({
      type: "GET_DEMO_SUCCESS",
      payload: { data: [...response.data], pagination: response.pagination },
    });
  } catch (e) {
    yield put({
      type: "GET_DEMO_FALIURE",
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

export function* markComplete(payload) {
  const data = payload;
  try {
    yield put({
      type: "ADD_MARK_REQUESTED",
    });

    const response = yield call(() => {
      return axios
        .post(`${USER_POINT_URL}/DemoRequest/markComplete`, {
          demoRequestId: data.payload.demoRequestId,
        })
        .then((res) => {
          return res.data;
        });
    });

    yield put({
      type: "ADD_MARK_SUCCESS",
      payload: response.message,
    });

    const Payload = {
      payload: {
        PageSize: 10,
        PageNumber: data.payload.pageNumber,
        isPending: data.payload.isPending,
      },
    };

    yield all([getDemoRequest(Payload)]);
  } catch (e) {
    yield put({
      type: "ADD_MARK_FAILURE",
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

function* watchgetDemoRequest() {
  yield takeLatest("GET_DEMO_REQUEST", getDemoRequest);
}

function* watchmarkComplete() {
  yield takeLatest("ADD_MARK_COMPLETE", markComplete);
}

export const RequestSaga = [fork(watchgetDemoRequest), fork(watchmarkComplete)];
