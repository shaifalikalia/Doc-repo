import axios from "axios";
import { put, takeLatest, fork, call } from "redux-saga/effects";
import { Config } from "../config";

const USER_POINT_URL = Config.serviceUrls.userBaseUrl;
const UTILITY_POINT_URL = Config.serviceUrls.utilityBaseUrl;

export function* getstaffDesignation(payload) {
  const data = payload;
  try {
    yield put({
      type: "DESGINATIONREQUESTED",
    });

    const response = yield call(() => {
      return axios
        .get(
          `${UTILITY_POINT_URL}/Utility/Designations/?officeId=${data.payload}`
        )
        .then((res) => {
          return res.data;
        });
    });

    yield put({
      type: "DESGINATIONSUCESS",
      payload: response.data,
    });
  } catch (e) {
    yield put({
      type: "DESGINATIONFAILURE",
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

export function* addEditStaff(payload) {
  const data = payload;
  try {
    yield put({
      type: "ADDEDITREQUTESTED",
    });

    const response = yield call(() => {
      return axios.post(`${USER_POINT_URL}/Staff`, data.payload).then((res) => {
        return res.data;
      });
    });

    if (response.statusCode !== 200) {
      yield put({
        type: "ADDEDITFAILURE",
        payload: response.message,
      });
      return;
    }

    yield put({
      type: "ADDEDITSUCESS",
      payload: response.message,
    });
  } catch (e) {
    yield put({
      type: "ADDEDITFAILURE",
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

export function* editStaff(payload) {
  const data = payload;
  try {
    yield put({
      type: "ADDEDITREQUTESTED",
    });

    const response = yield call(() => {
      return axios
        .put(`${USER_POINT_URL}/Staff/${data.payload.staffId}`, data.payload)
        .then((res) => {
          return res.data;
        });
    });

    yield put({
      type: "ADDEDITSUCESS",
      payload: response.message,
    });
  } catch (e) {
    yield put({
      type: "ADDEDITFAILURE",
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

export function* getstaffMembers(payload) {
  const data = payload;
  try {
    yield put({
      type: "STAFFMEMBERREQUESTED",
    });

    const response = yield call(() => {
      return axios
        .get(
          `${USER_POINT_URL}/Staff?officeId=${data.payload.officeId}&type=${data.payload.type}&searchTerm=${data.payload.searchTerm}&pageNo=${data.payload.pageNo}&pageSize=${data.payload.pageSize}&sortBy=${data.payload.sortBy}&sortOrder=${data.payload.sortOrder}`
        )
        .then((res) => {
          return res.data;
        });
    });

    yield put({
      type: "STAFFMEMBERSUCESS",
      payload: response,
    });
  } catch (e) {
    yield put({
      type: "STAFFMEMBERFALIURE",
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

export function* getstaffMembersScroll(payload) {
  const data = payload;
  try {
    yield put({
      type: "STAFFMEMBER_SCROLL_REQUESTED",
    });

    const response = yield call(() => {
      return axios
        .get(
          `${USER_POINT_URL}/Staff?officeId=${data.payload.officeId}&type=${data.payload.type}&searchTerm=${data.payload.searchTerm}&pageNo=${data.payload.pageNo}&pageSize=${data.payload.pageSize}&sortBy=${data.payload.sortBy}&sortOrder=${data.payload.sortOrder}`
        )
        .then((res) => {
          return res.data;
        });
    });
    yield put({
      type: "STAFFMEMBER_SCROLL_SUCESS",
      payload: response,
    });
  } catch (e) {
    yield put({
      type: "STAFFMEMBER_SCROLL_FAILURE",
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

export function* addEditStaffInvite(payload) {
  const data = payload;
  try {
    yield put({
      type: "ADDEDITREQUTESTED",
    });

    const response = yield call(() => {
      return axios
        .put(
          `${USER_POINT_URL}/Staff/Invite/${data.payload.inviteId}`,
          data.payload
        )
        .then((res) => {
          return res.data;
        });
    });

    yield put({
      type: "ADDEDITSUCESS",
      payload: response.message,
    });
  } catch (e) {
    yield put({
      type: "ADDEDITFAILURE",
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

export function* DeleteMembers(payload) {
  const data = payload;

  try {
    yield put({
      type: "DELETE_MEMBER_REQUESTED",
    });

    const response = yield call(() => {
      return axios
        .delete(`${USER_POINT_URL}/Staff/Invite/${data.payload}`)
        .then((res) => {
          return res.data;
        });
    });

    yield put({
      type: "DELETE_MEMBER_SUCESS",
      payload: response.message,
    });
  } catch (e) {
    yield put({
      type: "DElETE_MEMBER_FALIURE",
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

export function* addstaffDesignation(payload) {
  const data = payload;

  try {
    yield put({
      type: "ADD_ROLE_REQUESTED",
    });

    const response = yield call(() => {
      return axios
        .post(`${UTILITY_POINT_URL}/Utility/Designations`, data.payload)
        .then((res) => {
          return res.data;
        });
    });

    yield put({
      type: "ADD_ROLE_SUCESS",
      payload: response.message,
    });

    yield put({
      type: "DESGINATIONREQUESTED",
    });

    const responseNew = yield call(() => {
      return axios
        .get(
          `${UTILITY_POINT_URL}/Utility/Designations/?officeId=${data.payload.officeId}`
        )
        .then((res) => {
          return res.data;
        });
    });

    yield put({
      type: "DESGINATIONSUCESS",
      payload: responseNew.data,
    });
  } catch (e) {
    yield put({
      type: "ADD_ROLE_FALIURE",
    });

    yield put({
      type: "DESGINATIONFAILURE",
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

export function* editstaffDesignation(payload) {
  const data = payload;

  try {
    yield put({
      type: "EDIT_ROLE_REQUESTED",
    });

    const response = yield call(() => {
      return axios
        .put(
          `${UTILITY_POINT_URL}/Utility/Designations/${data.payload.id}`,
          data.payload
        )
        .then((res) => {
          return res.data;
        });
    });

    yield put({
      type: "EDIT_ROLE_SUCESS",
      payload: response.message,
    });

    yield put({
      type: "DESGINATIONREQUESTED",
    });

    const responseNew = yield call(() => {
      return axios
        .get(
          `${UTILITY_POINT_URL}/Utility/Designations/?officeId=${data.payload.officeId}`
        )
        .then((res) => {
          return res.data;
        });
    });

    yield put({
      type: "DESGINATIONSUCESS",
      payload: responseNew.data,
    });
  } catch (e) {
    yield put({
      type: "EDIT_ROLE_FALIURE",
    });

    yield put({
      type: "DESGINATIONFAILURE",
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

export function* deletestaffDesignation(payload) {
  const data = payload;

  try {
    yield put({
      type: "DELETE_ROLE_REQUESTED",
    });

    const response = yield call(() => {
      return axios
        .delete(`${UTILITY_POINT_URL}/Utility/Designations/${data.payload.id}`)
        .then((res) => {
          return res.data;
        });
    });

    yield put({
      type: "DELETE_ROLE_SUCESS",
      payload: response.message,
    });

    yield put({
      type: "DESGINATIONREQUESTED",
    });

    const responseNew = yield call(() => {
      return axios
        .get(
          `${UTILITY_POINT_URL}/Utility/Designations/?officeId=${data.payload.officeId}`
        )
        .then((res) => {
          return res.data;
        });
    });

    yield put({
      type: "DESGINATIONSUCESS",
      payload: responseNew.data,
    });
  } catch (e) {
    yield put({
      type: "DELETE_ROLE_FALIURE",
    });

    yield put({
      type: "DESGINATIONFAILURE",
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

export function* markDefaultDesignation(payload) {
  const data = payload;

  try {
    yield put({
      type: "MARK_DEFAULT_REQUESTED",
    });

    const response = yield call(() => {
      return axios
        .put(
          `${UTILITY_POINT_URL}/Utility/Designations/MarkAsDefault/${data.payload.id}`
        )
        .then((res) => {
          return res.data;
        });
    });

    yield put({
      type: "MARK_DEFAULT_SUCESS",
      payload: response.message,
    });

    yield put({
      type: "DESGINATIONREQUESTED",
    });

    const responseNew = yield call(() => {
      return axios
        .get(
          `${UTILITY_POINT_URL}/Utility/Designations/?officeId=${data.payload.officeId}`
        )
        .then((res) => {
          return res.data;
        });
    });

    yield put({
      type: "DESGINATIONSUCESS",
      payload: responseNew.data,
    });
  } catch (e) {
    yield put({
      type: "MARK_DEFAULT_FALIURE",
    });

    yield put({
      type: "DESGINATIONFAILURE",
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

function* watchGetStaffDesgination() {
  yield takeLatest("GET_STAFF_DESIGNATION", getstaffDesignation);
}

function* watchaddEditStaff() {
  yield takeLatest("ADD_EDIT_STAFF", addEditStaff);
}

function* watchEditStaff() {
  yield takeLatest("EDIT_STAFF", editStaff);
}

function* watchaddEditStaffInvite() {
  yield takeLatest("ADD_EDIT_STAFF_INVITE", addEditStaffInvite);
}

function* watchGetStaffMember() {
  yield takeLatest("GET_STAFF_MEMBERS", getstaffMembers);
}

function* watchGetStaffMemberScroll() {
  yield takeLatest("GET_STAFF_MEMBERS_SCROLL", getstaffMembersScroll);
}

function* watchDeleteMembers() {
  yield takeLatest("DELETE_STAFF_MEMBERS", DeleteMembers);
}

function* watchAddRoleStaffMembers() {
  yield takeLatest("ADD_STAFF_DESIGNATION", addstaffDesignation);
}

function* watchEditRoleStaffMembers() {
  yield takeLatest("EDIT_STAFF_DESIGNATION", editstaffDesignation);
}

function* watchDeleteRoleStaffMembers() {
  yield takeLatest("DELETE_STAFF_DESIGNATION", deletestaffDesignation);
}

function* watchMarkDefault() {
  yield takeLatest("MARK_DEFAULT_DESGINATION", markDefaultDesignation);
}

export const StaffSaga = [
  fork(watchGetStaffDesgination),
  fork(watchaddEditStaff),
  fork(watchaddEditStaffInvite),
  fork(watchGetStaffMember),
  fork(watchGetStaffMemberScroll),
  fork(watchDeleteMembers),
  fork(watchAddRoleStaffMembers),
  fork(watchEditRoleStaffMembers),
  fork(watchDeleteRoleStaffMembers),
  fork(watchMarkDefault),
  fork(watchEditStaff),
];
