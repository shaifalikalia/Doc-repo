const initialState = {
  isLoading: false,
  statusMessage: null,
  isChangeError: false,
  ownerList: null,
  pageLoader: false,
  isLoadError: false,
  isStatusError: false,
  userStatusMessage: null,
  personelList: null,
  ownerPackageList: null,
};
const AuthReducer = (state, { type, payload }) => {
  if (state === undefined) {
    state = initialState;
  }
  let object;
  switch (type) {
    case "CHANGE_PASSWORD_REQUESTED":
      object = { ...state, statusMessage: null, isLoading: true };
      break;
    case "CHANGE_PASSWORD_SUCESS":
      object = {
        ...state,
        statusMessage: payload,
        isLoading: false,
        isChangeError: false,
      };
      break;
    case "CHANGE_PASSWORD_FALIURE":
      object = {
        ...state,
        statusMessage: "There seems some technical issue while adding office.",
        isLoading: false,
        isChangeError: true,
      };
      break;
    case "GET_OWNER_LIST_REQUESTED":
    case "GET_PERSONNEL_MEMBER_REQUESTED":
      object = {
        ...state,
        isLoading: true,
        statusMessage: null,
        isLoadError: false,
      };
      break;
    case "GET_OWNER_LIST_SUCESS":
      object = { ...state, isLoading: false, ownerList: payload };
      break;
    case "GET_OWNER_LIST_FALIURE":
      object = {
        ...state,
        isLoading: false,
        isLoadError: true,
        statusMessage:
          "There seems some technical issue while getting owners list.",
      };
      break;
    case "SET_OWNER_STATUS_REQUESTED":
    case "SET_CANCEL_PLAN_REQUESTED":
      object = {
        ...state,
        isLoading: true,
        userStatusMessage: null,
        isStatusError: false,
      };
      break;
    case "SET_OWNER_STATUS_SUCESS":
    case "SET_CANCEL_PLAN_SUCESS":
      object = { ...state, isLoading: false, userStatusMessage: payload };
      break;
    case "SET_OWNER_STATUS_FALIURE":
    case "SET_CANCEL_PLAN_FALIURE":
      object = {
        ...state,
        isLoading: false,
        userStatusMessage:
          "There seems some technical issue while changeing the status.",
        isStatusError: true,
      };
      break;
    case "GET_PERSONNEL_MEMBER_SUCESS":
      object = { ...state, isLoading: false, personelList: payload };
      break;
    case "GET_PERSONNEL_MEMBER_FALIURE":
      object = {
        ...state,
        isLoading: false,
        isLoadError: true,
        statusMessage:
          "There seems some technical issue while getting personnel list.",
      };
      break;

    case "GET_OWNER_PLAN_TYPE_REQUESTED":
      object = { ...state, ownerPackageList: null };
      break;
    case "GET_OWNER_PLAN_TYPE_SUCESS":
      object = { ...state, ownerPackageList: payload };
      break;
    case "GET_OWNER_PLAN_TYPE_FALIURE":
      object = {
        ...state,
        statusMessage:
          "There seems some technical issue while getting packages.",
      };
      break;
    default:
      object = state;
  }
  return object;
};
export default AuthReducer;
