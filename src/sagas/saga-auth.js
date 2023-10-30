import axios from "axios";
import { put, takeLatest, fork, call, all } from "redux-saga/effects";
import { Config } from "../config";

const USER_POINT_URL = Config.serviceUrls.userBaseUrl;
const SUB_POINT_URL = Config.serviceUrls.subscriptionBaseUrl;

export function* changePassword(payload) {
  const data = payload;

  try {
    yield put({
      type: "CHANGE_PASSWORD_REQUESTED",
    });

    const response = yield call(() => {
      return axios
        .put(`${USER_POINT_URL}/User/ChangePassword`, data.payload)
        .then((res) => {
          return res.data;
        });
    });

    yield put({
      type: "CHANGE_PASSWORD_SUCESS",
      payload: response.message,
    });
  } catch (e) {
    yield put({
      type: "CHANGE_PASSWORD_FALIURE",
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

export function* getaccountowner(payload) {
  const data = payload;
  const {
    payload: {
      PageSize = null,
      PageNumber = null,
      searchTerm = null,
      roleId = null,
      packageId = null,
      status = null,
    },
  } = data;
  try {
    yield put({
      type: "GET_OWNER_LIST_REQUESTED",
    });

    const response = yield call(() => {
      return axios
        .get(
          `${USER_POINT_URL}/AccountOwner/?pageNumber=${PageNumber}&pageSize=${PageSize}${
            searchTerm ? `&searchTerm=${searchTerm}` : ""
          }${roleId ? `&roleId=${roleId}` : ""}${
            packageId ? `&packageId=${packageId}` : ""
          }${status === "active" ? `&status=true` : ""}${
            status === "inactive" ? `&status=false` : ""
          }`
        )
        .then((res) => {
          return res.data;
        });
    });

    yield put({
      type: "GET_OWNER_LIST_SUCESS",
      payload: { data: [...response.data], pagination: response.pagination },
    });
  } catch (e) {
    yield put({
      type: "GET_OWNER_LIST_FALIURE",
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

export function* setOwnerStatus(payload) {
  const data = payload;

  try {
    yield put({
      type: "SET_OWNER_STATUS_REQUESTED",
    });

    const response = yield call(() => {
      return axios
        .post(`${USER_POINT_URL}/User/updateStatus`, {
          userId: data.payload.userId,
          status: data.payload.status,
        })
        .then((res) => {
          return res.data;
        });
    });

    yield put({
      type: "SET_OWNER_STATUS_SUCESS",
      payload: response.message,
    });

    if (data.payload.isPersonnel) {
      const Payload = {
        payload: {
          PageSize: 10,
          PageNumber: data.payload.pageNumber,
        },
      };

      yield all([getpersonnel(Payload)]);
    } else {
      const Payload = {
        payload: {
          PageSize: 10,
          PageNumber: data.payload.pageNumber,
        },
      };

      yield all([getaccountowner(Payload)]);
    }
  } catch (e) {
    yield put({
      type: "SET_OWNER_STATUS_FALIURE",
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

export function* setcancelPlan(payload) {
  const data = payload;

  try {
    yield put({
      type: "SET_CANCEL_PLAN_REQUESTED",
    });
    const response = yield call(() => {
      return axios
        .post(`${SUB_POINT_URL}/Package/terminateSubscription`, {
          userId: data.payload.userId,
        })
        .then((res) => {
          return res.data;
        });
    });

    yield put({
      type: "SET_CANCEL_PLAN_SUCESS",
      payload: response.message,
    });

    const Payload = {
      payload: {
        PageSize: 10,
        PageNumber: data.payload.pageNumber,
      },
    };

    yield all([getaccountowner(Payload)]);
  } catch (e) {
    yield put({
      type: "SET_CANCEL_PLAN_FALIURE",
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

export function* getpersonnel(payload) {
  const data = payload;
  const {
    payload: {
      PageSize = null,
      PageNumber = null,
      searchTerm = null,
      status = null,
    },
  } = data;
  try {
    yield put({
      type: "GET_PERSONNEL_MEMBER_REQUESTED",
    });

    const response = yield call(() => {
      return axios
        .get(`${USER_POINT_URL}/Staff/allStaff`, {
          params: {
            pageNumber: PageNumber,
            pageSize: PageSize,
            searchTerm,
            status,
          },
        })
        .then((res) => {
          return res.data;
        });
    });

    yield put({
      type: "GET_PERSONNEL_MEMBER_SUCESS",
      payload: { data: [...response.data], pagination: response.pagination },
    });
  } catch (e) {
    yield put({
      type: "GET_PERSONNEL_MEMBER_FALIURE",
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

export function* getOwnersPlans(payload) {
  try {
    yield put({
      type: "GET_OWNER_PLAN_TYPE_REQUESTED",
    });

    const response = yield call(() => {
      return axios.get(`${SUB_POINT_URL}/Package/listAll`).then((res) => {
        return res.data;
      });
    });

    yield put({
      type: "GET_OWNER_PLAN_TYPE_SUCESS",
      payload: response.data,
    });
  } catch (e) {
    yield put({
      type: "GET_OWNER_PLAN_TYPE_FALIURE",
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

function* watchChangePassword() {
  yield takeLatest("CHANGE_PASSWORD", changePassword);
}

function* watchgetaccountowner() {
  yield takeLatest("GET_ACCOUNT_OWNER", getaccountowner);
}

function* watchsetOwnerStatus() {
  yield takeLatest("SET_OWNER_STATUS", setOwnerStatus);
}
function* watchsetcancelPlan() {
  yield takeLatest("SET_CANCEL_PLAN", setcancelPlan);
}

function* watchgetpersonnel() {
  yield takeLatest("GET_PERSONNEL_MEMBER", getpersonnel);
}

function* watchgetOwnersPlans() {
  yield takeLatest("GET_OWNER_PLAN_TYPE", getOwnersPlans);
}

export const AuthSaga = [
  fork(watchChangePassword),
  fork(watchgetaccountowner),
  fork(watchsetOwnerStatus),
  fork(watchsetcancelPlan),
  fork(watchgetpersonnel),
  fork(watchgetOwnersPlans),
];
