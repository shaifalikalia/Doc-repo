import axios from "axios";
import { put, takeLatest, fork, call, all } from "redux-saga/effects";
import { Config } from "../config";

const HOLIDAY_POINT_URL = Config.serviceUrls.holidayBaseUrl;

export function* getHolidayList(payload) {
  const data = payload;
  try {
    yield put({
      type: "GET_HOLIDAY_LIST_REQUESTED",
    });

    const response = yield call(() => {
      return axios
        .get(
          `${HOLIDAY_POINT_URL}/Holiday?year=${data.payload.year}&month=${data.payload.month}`
        )
        .then((res) => {
          return res.data;
        });
    });

    if (response.statusCode === 200) {
      yield put({
        type: "GET_HOLIDAY_LIST_SUCESS",
        payload: response.data,
      });
    }
  } catch (e) {
    yield put({
      type: "GET_HOLIDAY_LIST_FALIURE",
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

export function* addHoliday(payload) {
  const data = payload;
  try {
    yield put({
      type: "HOLIDAY_ADD_REQUESTED",
    });

    const response = yield call(() => {
      return axios
        .post(`${HOLIDAY_POINT_URL}/Holiday`, {
          title: data.payload.title,
          date: data.payload.date,
        })
        .then((res) => {
          return res.data;
        });
    });

    if (response.statusCode === 200) {
      yield put({
        type: "HOLIDAY_ADD_SUCESS",
        payload: response.message,
      });

      const Payload = {
        payload: {
          year: data.payload.year,
          month: data.payload.month,
        },
      };
      yield all([getHolidayList(Payload)]);
    }

    if (response.statusCode === 400) {
      yield put({
        type: "HOLIDAY_ADD_SUCESS_FALURE",
        payload: response.message,
      });
    }
  } catch (e) {
    yield put({
      type: "HOLIDAY_ADD_FALIURE",
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

export function* DeleteHoliday(payload) {
  const data = payload;
  try {
    yield put({
      type: "DELETE_HOLIDAY_REQUESTED",
    });

    const response = yield call(() => {
      return axios
        .delete(`${HOLIDAY_POINT_URL}/Holiday/${data.payload.id}`)
        .then((res) => {
          return res.data;
        });
    });

    if (response.statusCode === 200) {
      yield put({
        type: "DELETE_HOLIDAY_SUCESS",
        payload: response.message,
      });

      const Payload = {
        payload: {
          year: data.payload.year,
          month: data.payload.month,
        },
      };
      yield all([getHolidayList(Payload)]);
    }

    if (response.statusCode === 400 || response.statusCode === 404) {
      yield put({
        type: "DELETE_HOLIDAY_SUCESS_FALURE",
        payload: response.message,
      });
    }
  } catch (e) {
    yield put({
      type: "DELETE_HOLIDAY_FALIURE",
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

export function* updateHoliday(payload) {
  const data = payload;
  try {
    yield put({
      type: "HOLIDAY_UPDATE_REQUESTED",
    });

    const response = yield call(() => {
      return axios
        .put(`${HOLIDAY_POINT_URL}/Holiday`, {
          holidayId: data.payload.holidayId,
          title: data.payload.title,
          date: data.payload.date,
        })
        .then((res) => {
          return res.data;
        });
    });

    if (response.statusCode === 200) {
      yield put({
        type: "HOLIDAY_UPDATE_SUCESS",
        payload: response.message,
      });

      const Payload = {
        payload: {
          year: data.payload.year,
          month: data.payload.month,
        },
      };
      yield all([getHolidayList(Payload)]);
    }

    if (response.statusCode === 400) {
      yield put({
        type: "HOLIDAY_UPDATE_SUCESS_FALURE",
        payload: response.message,
      });
    }
  } catch (e) {
    yield put({
      type: "HOLIDAY_UPDATE_FALIURE",
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

function* watchaddHoliday() {
  yield takeLatest("ADD_HOLIDAY", addHoliday);
}

function* watchgetHolidayList() {
  yield takeLatest("GET_HOLIDAY_LIST", getHolidayList);
}

function* watchDeleteHoliday() {
  yield takeLatest("DELETE_HOLIDAY", DeleteHoliday);
}

function* watchupdateHoliday() {
  yield takeLatest("UPDATE_HOLIDAY", updateHoliday);
}

export const HolidaySaga = [
  fork(watchaddHoliday),
  fork(watchgetHolidayList),
  fork(watchDeleteHoliday),
  fork(watchupdateHoliday),
];
