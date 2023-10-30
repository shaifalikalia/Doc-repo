import axios from "axios";
import { put, takeLatest, fork, call, all } from "redux-saga/effects";
import { Config } from "../config";

const SUB_POINT_URL = Config.serviceUrls.subscriptionBaseUrl;
const USER_POINT_URL = Config.serviceUrls.userBaseUrl;
const OFFICE_POINT_URL = Config.serviceUrls.officeBaseUrl;

export function* getPackage(payload) {
  const data = payload;
  const {
    payload: {
      IsPaginated = null,
      PageSize = null,
      Type = null,
      PageNumber = null,
      searchTerm = null,
    },
  } = data;
  try {
    yield put({
      type: "PACKAGE_REQUESTED",
    });

    const response = yield call(() => {
      return axios
        .get(
          searchTerm
            ? `${SUB_POINT_URL}/Package/list?IsPaginated=${IsPaginated}&PageSize=${PageSize}&PageNumber=${PageNumber}&Type=${Type}&searchTerm=${searchTerm}`
            : `${SUB_POINT_URL}/Package/list?IsPaginated=${IsPaginated}&PageSize=${PageSize}&PageNumber=${PageNumber}&Type=${Type}`
        )
        .then((res) => {
          return res.data;
        });
    });

    yield put({
      type: "PACKAGE_SUCESS",
      payload: { data: [...response.data], pagination: response.pagination },
    });
  } catch (e) {
    yield put({
      type: "PACKAGE_FALIURE",
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

export function* AddEnterprisePackage(payload) {
  const data = payload;
  try {
    yield put({
      type: "ADD_ENTERPRISE_PACKAGE_REQUESTED",
    });

    const response = yield call(() => {
      return axios
        .post(`${SUB_POINT_URL}/Package`, data.payload)

        .then((res) => {
          return res.data;
        });
    });

    yield put({
      type: "ADD_ENTERPRISE_PACKAGE_SUCESS",
      payload: response.message,
    });
  } catch (e) {
    yield put({
      type: "ADD_ENTERPRISE_PACKAGE_FALIURE",
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

export function* getPackageSingleMultipule(payload) {
  const data = payload;
  const {
    payload: { type = null },
  } = data;
  try {
    yield put({
      type: "PACKAGE_DETAIL_REQUESTED",
    });

    const response = yield call(() => {
      return axios
        .get(`${SUB_POINT_URL}/Package/?type=${type}`)

        .then((res) => {
          return res.data;
        });
    });

    yield put({
      type: "PACKAGE_DETAIL_SUCESS",
      payload: response.data,
    });
  } catch (e) {
    yield put({
      type: "PACKAGE_DETAIL_FALIURE",
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

export function* getenterpriseOwners(payload) {
  const data = payload;
  const {
    payload: { PageSize = null, PackageId = null, PageNumber = null },
  } = data;
  try {
    yield put({
      type: "OWNER_LIST_REQUESTED",
    });

    const response = yield call(() => {
      return axios
        .get(
          `${SUB_POINT_URL}/Association/?pageSize=${PageSize}&pageNumber=${PageNumber}&packageId=${PackageId}`
        )

        .then((res) => {
          return res.data;
        });
    });

    yield put({
      type: "OWNER_LIST_SUCESS",
      payload: { data: [...response.data], pagination: response.pagination },
    });
  } catch (e) {
    yield put({
      type: "OWNER_LIST_FALIURE",
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

export function* AddownerUser(payload) {
  const data = payload;
  try {
    yield put({
      type: "ADD_OWNER_REQUESTED",
    });

    const response = yield call(() => {
      return axios
        .post(`${SUB_POINT_URL}/Association`, data.payload)
        .then((res) => {
          return res.data;
        });
    });

    if (response.statusCode === 200) {
      yield put({
        type: "ADD_OWNER_SUCESS",
        payload: response.message,
      });
    }

    if (response.statusCode === 400) {
      yield put({
        type: "ADD_OWNER_SUCESS_ERROR",
        payload: response.message,
      });
    }
  } catch (e) {
    yield put({
      type: "ADD_OWNER_FALIURE",
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

export function* getOwnerDetails(payload) {
  const data = payload;
  const {
    payload: { id = null },
  } = data;
  try {
    yield put({
      type: "OWNER_DETAIL_REQUESTED",
    });

    const response = yield call(() => {
      return axios
        .get(`${SUB_POINT_URL}/Association/${id}`)

        .then((res) => {
          return res.data;
        });
    });

    yield put({
      type: "OWNER_DETAIL_SUCESS",
      payload: response.data,
    });
  } catch (e) {
    yield put({
      type: "OWNER_DETAIL_FALIURE",
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

export function* UpdateOwnerUser(payload) {
  const data = payload;
  try {
    yield put({
      type: "UPDATE_OWNER_REQUESTED",
    });

    const response = yield call(() => {
      return axios
        .put(`${SUB_POINT_URL}/Association`, data.payload)
        .then((res) => {
          return res.data;
        });
    });

    if (response.statusCode === 200) {
      yield put({
        type: "UPDATE_OWNER_SUCESS",
        payload: response.message,
      });
    }

    if (response.statusCode === 400) {
      yield put({
        type: "UPDATE_OWNER_SUCESS_ERROR",
        payload: response.message,
      });
    }
  } catch (e) {
    yield put({
      type: "UPDATE_OWNER_FALIURE",
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

export function* getAllPlans() {
  try {
    yield put({
      type: "ALL_PLAN_REQUESTED",
    });

    const response = yield call(() => {
      return axios
        .get(`${SUB_POINT_URL}/Package/available`)

        .then((res) => {
          return res.data;
        });
    });

    yield put({
      type: "ALL_PLAN_SUCESS",
      payload: response.data,
    });
  } catch (e) {
    yield put({
      type: "ALL_PLAN_FALIURE",
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

export function* AddsubPackage(payload) {
  const data = payload;
  try {
    yield put({
      type: "ADD_SUB_PACKAGE_REQUESTED",
    });

    const response = yield call(() => {
      return axios
        .post(`${SUB_POINT_URL}/Package/subscribe`, data.payload)

        .then((res) => {
          return res.data;
        });
    });

    if (response.statusCode === 400) {
      yield put({
        type: "ADD_SUB_PACKAGE_SUCESS_FALIL",
        payload: response.message,
      });
    }

    yield put({
      type: "ADD_SUB_PACKAGE_SUCESS",
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
  } catch (e) {
    yield put({
      type: "ADD_SUB_PACKAGE_FALIURE",
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

export function* getcardSecret() {
  try {
    yield put({
      type: "GET_CARD_REQUESTED",
    });

    const response = yield call(() => {
      return axios.get(`${SUB_POINT_URL}/Card`).then((res) => {
        return res.data;
      });
    });

    yield put({
      type: "GET_CARD_SUCESS",
      payload: response.data,
    });
  } catch (e) {
    yield put({
      type: "GET_CARD_FALIURE",
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

export function* saveCardId(payload) {
  const data = payload;
  try {
    yield put({
      type: "CARD_ID_REQUESTED",
    });

    const response = yield call(() => {
      return axios
        .post(`${SUB_POINT_URL}/Card`, data.payload)

        .then((res) => {
          return res.data;
        });
    });

    if (response.statusCode === 200) {
      yield put({
        type: "CARD_ID_SUCESS",
        payload: response.message,
      });
      yield all([getAllCard()]);
    }

    if (response.statusCode === 400) {
      yield put({
        type: "CARD_ID_SUCESS_FALIURE",
        payload: response.message,
      });
    }
  } catch (e) {
    yield put({
      type: "CARD_ID_FALIURE",
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

export function* saveCardBilling(payload) {
  const data = payload;
  try {
    yield put({
      type: "SAVE_BILLING_REQUESTED",
    });

    const response = yield call(() => {
      return axios
        .post(
          `${SUB_POINT_URL}/Card/saveBillingPreferenceAndFirstCard`,
          data.payload
        )

        .then((res) => {
          return res.data;
        });
    });

    if (response.statusCode === 200) {
      yield put({
        type: "SAVE_BILLING_SUCESS",
        payload: response.message,
      });
    }

    if (response.statusCode === 400) {
      yield put({
        type: "SAVE_BILLING_FALIURE",
      });
    }

    const responseProfile = yield call(() => {
      return axios.get(`${USER_POINT_URL}/User/Profile`).then((res) => {
        return res.data;
      });
    });

    yield put({
      type: "PROFILE",
      payload: responseProfile.data,
    });
  } catch (e) {
    yield put({
      type: "SAVE_BILLING_FALIURE",
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

export function* UpdatePackage(payload) {
  const data = payload;
  try {
    yield put({
      type: "UPDATE_PACKAGE_REQUESTED",
    });

    const response = yield call(() => {
      return axios.put(`${SUB_POINT_URL}/Package`, data.payload).then((res) => {
        return res.data;
      });
    });

    yield put({
      type: "UPDATE_PACKAGE_SUCESS",
      payload: response.message,
    });
  } catch (e) {
    yield put({
      type: "UPDATE_PACKAGE_FALIURE",
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

export function* getMyPlan() {
  try {
    yield put({
      type: "MY_PLAN_REQUESTED",
    });

    const response = yield call(() => {
      return axios
        .get(`${SUB_POINT_URL}/Package/mySubscription`)

        .then((res) => {
          return res.data;
        });
    });

    if (response.statusCode === 400) {
      yield put({
        type: "MY_PLAN_SUCESS_FALIURE",
        payload: response.message,
      });
    }

    yield put({
      type: "MY_PLAN_SUCESS",
      payload: response.data,
    });
  } catch (e) {
    yield put({
      type: "MY_PLAN_FALIURE",
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

export function* cancelPlan(payload) {
  const data = payload;
  try {
    yield put({
      type: "CANCEL_MY_PLAN_REQUESTED",
    });

    const response = yield call(() => {
      return axios
        .post(`${SUB_POINT_URL}/Package/cancelSubscription`, data.payload)

        .then((res) => {
          return res.data;
        });
    });

    yield put({
      type: "CANCEL_MY_PLAN_SUCESS",
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
  } catch (e) {
    yield put({
      type: "CANCEL_MY_PLAN_FALIURE",
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

export function* setEnaleOffice(payload) {
  const data = payload;
  try {
    yield put({
      type: "SET_OFFICE_REQUESTED",
    });

    const response = yield call(() => {
      return axios
        .post(`${OFFICE_POINT_URL}/Office/enableOnly`, data.payload)

        .then((res) => {
          return res.data;
        });
    });

    if (response.statusCode === 400) {
      yield put({
        type: "SET_OFFICE_SUCESS_FALIL",
        payload: response.message,
      });
    }

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
      type: "SET_OFFICE_SUCESS",
      payload: response.message,
    });
  } catch (e) {
    yield put({
      type: "SET_OFFICE_FALIURE",
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

export function* getAllCard() {
  try {
    yield put({
      type: "GET_ALL_CARDS_REQUESTED",
    });

    const response = yield call(() => {
      return axios.get(`${SUB_POINT_URL}/Card/list`).then((res) => {
        return res.data;
      });
    });

    yield put({
      type: "GET_ALL_CARDS_SUCCESS",
      payload: response.data,
    });
  } catch (e) {
    yield put({
      type: "GET_ALL_CARDS_FALIURE",
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

export function* getAllCardByOffice(payload) {
  const data = payload;
  const {
    payload: { PageSize = null, PageNumber = null, searchTerm = null },
  } = data;
  try {
    yield put({
      type: "GET_ALL_CARDS_OFFICE_REQUESTED",
    });

    const response = yield call(() => {
      return axios
        .get(
          searchTerm
            ? `${SUB_POINT_URL}/Card/assignments?pageSize=${PageSize}&pageNumber=${PageNumber}&searchTerm=${searchTerm}`
            : `${SUB_POINT_URL}/Card/assignments?pageSize=${PageSize}&pageNumber=${PageNumber}`
        )

        .then((res) => {
          return res.data;
        });
    });

    yield put({
      type: "GET_ALL_CARDS_OFFICE_SUCESS",
      payload: { data: [...response.data], pagination: response.pagination },
    });
  } catch (e) {
    yield put({
      type: "GET_ALL_CARDS_OFFICE_FALIURE",
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

export function* updateCardOffice(payload) {
  const data = payload;
  try {
    yield put({
      type: "UPDATE_CARD_BY_OFFICE_REQUESTED",
    });

    const response = yield call(() => {
      return axios
        .post(`${SUB_POINT_URL}/Card/assign`, data.payload)
        .then((res) => {
          return res.data;
        });
    });

    yield put({
      type: "UPDATE_CARD_BY_OFFICE_SUCESS",
      payload: response.message,
    });
  } catch (e) {
    yield put({
      type: "UPDATE_CARD_BY_OFFICE_FALIURE",
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

export function* getSubscriptionStatus() {
  try {
    yield put({
      type: "GET_SUBSCRIPTON_STATUS_REQUESTED",
    });

    const response = yield call(() => {
      return axios.get(`${SUB_POINT_URL}/Invoice/status`).then((res) => {
        return res.data;
      });
    });

    yield put({
      type: "GET_SUBSCRIPTON_STATUS_SUCCESS",
      payload: response.data,
    });
  } catch (e) {
    yield put({
      type: "GET_SUBSCRIPTON_STATUS_FALIURE",
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

export function* clearSubscription(payload) {
  try {
    yield put({
      type: "CLEAR_SUBSCRIPTION_REQUESTED",
    });

    const response = yield call(() => {
      return axios
        .post(`${SUB_POINT_URL}/Package/revertStepChooseSubscription`)
        .then((res) => {
          return res.data;
        });
    });

    yield put({
      type: "CLEAR_SUBSCRIPTION_SUCESS",
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
  } catch (e) {
    yield put({
      type: "CLEAR_SUBSCRIPTION_FALIURE",
      payload:
        e.response.config.url === `${USER_POINT_URL}/User/Profile`
          ? "There seems some technical issue  while getting profile."
          : "There seems some technical issue  while revert subscription.",
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

export function* subcriptionTime() {
  try {
    yield put({
      type: "GET_SUBSCRIPTION_TIME_REQUESTED",
    });

    const response = yield call(() => {
      return axios
        .get(`${SUB_POINT_URL}/Package/subscribedSince`)

        .then((res) => {
          return res.data;
        });
    });

    yield put({
      type: "GET_SUBSCRIPTION_TIME_SUCESS",
      payload: response.data,
    });
  } catch (e) {
    yield put({
      type: "GET_SUBSCRIPTION_TIME_FALIURE",
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

function* watchsubcriptionTime() {
  yield takeLatest("GET_SUBSCRIPTION_TIME", subcriptionTime);
}

function* watchupdateCardOffice() {
  yield takeLatest("UPDATE_CARD_BY_OFFICE", updateCardOffice);
}

function* watchgetAllCardByOffice() {
  yield takeLatest("GET_ALL_CARDS_OFFICE", getAllCardByOffice);
}

function* watchGetPackage() {
  yield takeLatest("GET_SUB_PACKAGE", getPackage);
}

function* watchAddPackage() {
  yield takeLatest("ADD_ENTERPRISE_PACKAGE", AddEnterprisePackage);
}

function* watchGetSingleMultipule() {
  yield takeLatest("GET_SINGLE_MULIPULE_PACKAGE", getPackageSingleMultipule);
}

function* watchGetOwners() {
  yield takeLatest("GET_ENTERPRISE_OWNERS", getenterpriseOwners);
}

function* watchAddOwner() {
  yield takeLatest("ADD_ENTERPRISE_OWNER", AddownerUser);
}

function* watchGetOwnerDetail() {
  yield takeLatest("GET_OWNER_DETAIL", getOwnerDetails);
}

function* watchUpdateOwner() {
  yield takeLatest("UPDATE_OWNER", UpdateOwnerUser);
}

function* watchGetAllPlans() {
  yield takeLatest("GET_ALL_PLANS", getAllPlans);
}
function* watchAddsubPackage() {
  yield takeLatest("SUBSCRIBE_LATEST_PACKAGE", AddsubPackage);
}

function* watchgetcardSecret() {
  yield takeLatest("GET_CARD", getcardSecret);
}

function* watchsaveCardId() {
  yield takeLatest("SAVE_CARD", saveCardId);
}

function* watchsaveCardBilling() {
  yield takeLatest("SAVE_BILLING", saveCardBilling);
}

function* watchUpdatePackage() {
  yield takeLatest("UPDATE_PACKAGE", UpdatePackage);
}

function* watchgetMyPlan() {
  yield takeLatest("GET_MY_PLAN", getMyPlan);
}

function* watchcancelPlan() {
  yield takeLatest("CANCEL_MY_PLAN", cancelPlan);
}

function* watchsetEnaleOffice() {
  yield takeLatest("SET_ENABLE_OFFICE", setEnaleOffice);
}

function* watchgetAllCard() {
  yield takeLatest("GET_ALL_CARDS", getAllCard);
}

function* watchgetSubscriptionStatus() {
  yield takeLatest("GET_SUBSCRIPTON_STATUS", getSubscriptionStatus);
}

function* watchclearSubscription() {
  yield takeLatest("CLEAR_SUBSCRIPTION", clearSubscription);
}

export const SubSaga = [
  fork(watchGetPackage),
  fork(watchAddPackage),
  fork(watchGetSingleMultipule),
  fork(watchGetOwners),
  fork(watchAddOwner),
  fork(watchGetOwnerDetail),
  fork(watchUpdateOwner),
  fork(watchGetAllPlans),
  fork(watchAddsubPackage),
  fork(watchgetcardSecret),
  fork(watchsaveCardId),
  fork(watchsaveCardBilling),
  fork(watchUpdatePackage),
  fork(watchgetMyPlan),
  fork(watchcancelPlan),
  fork(watchsetEnaleOffice),
  fork(watchgetAllCard),
  fork(watchgetAllCardByOffice),
  fork(watchupdateCardOffice),
  fork(watchgetSubscriptionStatus),
  fork(watchclearSubscription),
  fork(watchsubcriptionTime),
];
