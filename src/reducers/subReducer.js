const initialState = {
  enterprisePlans: null,
  isLoading: false,
  statusMessage: null,
  planDetail: null,
  ownersList: null,
  ownerDetail: null,
  planList: null,
  cardSecert: null,
  cardstatusMessage: null,
  cardSaved: null,
  isLoadError: false,
  curPlanDetail: null,
  cancelstatusMessage: null,
  cardList: null,
  isPaymentDetailError: false,
  pageLoader: false,
  officecardList: null,
  updateCardLoader: false,
  cardAssign: false,
  subscriptionStatus: null,
  subTimeDetail: null,
};
const subReducer = (state, { type, payload }) => {
  if (state === undefined) {
    state = initialState;
  }
  let object;
  switch (type) {
    case "PACKAGE_REQUESTED":
      object = {
        ...state,
        isLoading: true,
        enterprisePlans: null,
        isLoadError: false,
      };
      break;
    case "PACKAGE_SUCESS":
      object = { ...state, isLoading: false, enterprisePlans: payload };
      break;
    case "PACKAGE_FALIURE":
    case "PACKAGE_DETAIL_FALIURE":
    case "OWNER_LIST_FALIURE":
    case "OWNER_DETAIL_FALIURE":
      object = { ...state, isLoading: false, isLoadError: true };
      break;
    case "ADD_ENTERPRISE_PACKAGE_REQUESTED":
    case "ADD_SUB_PACKAGE_REQUESTED":
    case "UPDATE_PACKAGE_REQUESTED":
    case "SET_OFFICE_REQUESTED":
      object = {
        ...state,
        isLoading: true,
        statusMessage: null,
        isLoadError: false,
      };
      break;
    case "ADD_ENTERPRISE_PACKAGE_SUCESS":
    case "ADD_OWNER_SUCESS":
    case "UPDATE_OWNER_SUCESS":
    case "ADD_SUB_PACKAGE_SUCESS":
    case "UPDATE_PACKAGE_SUCESS":
    case "SET_OFFICE_SUCESS":
      object = { ...state, isLoading: false, statusMessage: payload };
      break;

    case "ADD_SUB_PACKAGE_SUCESS_FALIL":
      object = {
        ...state,
        isLoading: false,
        statusMessage: payload,
        isLoadError: true,
      };
      break;

    case "ADD_OWNER_SUCESS_ERROR":
    case "UPDATE_OWNER_SUCESS_ERROR":
      object = {
        ...state,
        isLoading: false,
        statusMessage: payload,
        isLoadError: true,
      };
      break;

    case "ADD_ENTERPRISE_PACKAGE_FALIURE":
    case "ADD_OWNER_FALIURE":
    case "ADD_SUB_PACKAGE_FALIURE":
      object = {
        ...state,
        isLoading: false,
        statusMessage: "There seems some technical issue while adding plan.",
        isLoadError: true,
      };
      break;
    case "PACKAGE_DETAIL_REQUESTED":
      object = {
        ...state,
        isLoading: true,
        planDetail: null,
        isLoadError: false,
      };
      break;
    case "PACKAGE_DETAIL_SUCESS":
      object = { ...state, isLoading: false, planDetail: payload };
      break;
    case "OWNER_LIST_REQUESTED":
      object = {
        ...state,
        isLoading: true,
        ownersList: null,
        isLoadError: false,
      };
      break;
    case "OWNER_LIST_SUCESS":
      object = { ...state, isLoading: false, ownersList: payload };
      break;
    case "ADD_OWNER_REQUESTED":
    case "UPDATE_OWNER_REQUESTED":
      object = {
        ...state,
        isLoading: true,
        statusMessage: null,
        ownerDetail: null,
        isLoadError: false,
      };
      break;
    case "OWNER_DETAIL_REQUESTED":
      object = {
        ...state,
        isLoading: true,
        ownerDetail: null,
        isLoadError: false,
      };
      break;
    case "OWNER_DETAIL_SUCESS":
      object = { ...state, isLoading: false, ownerDetail: payload };
      break;
    case "UPDATE_OWNER_FALIURE":
      object = {
        ...state,
        isLoading: false,
        statusMessage: "There seems some technical issue while updating owner.",
        isLoadError: true,
      };
      break;
    case "ALL_PLAN_REQUESTED":
      object = {
        ...state,
        isLoading: true,
        planList: null,
        isLoadError: false,
        statusMessage: null,
      };
      break;
    case "ALL_PLAN_SUCESS":
      object = { ...state, isLoading: false, planList: payload };
      break;
    case "ALL_PLAN_FALIURE":
      object = {
        ...state,
        isLoading: false,
        isLoadError: true,
        statusMessage: "There seems some technical issue while getting plans.",
      };
      break;
    case "GET_CARD_REQUESTED":
      object = {
        ...state,
        isLoading: true,
        cardSecert: null,
        cardstatusMessage: null,
        isLoadError: false,
      };
      break;
    case "GET_CARD_SUCESS":
      object = { ...state, isLoading: false, cardSecert: payload };
      break;
    case "GET_CARD_FALIURE":
      object = {
        ...state,
        isLoading: false,
        cardstatusMessage:
          "There seems some technical issue while getting client secret.",
        isLoadError: true,
      };
      break;
    case "CARD_ID_REQUESTED":
      object = {
        ...state,
        isLoading: true,
        cardstatusMessage: null,
        cardSaved: null,
        isLoadError: false,
      };
      break;

    case "SAVE_BILLING_REQUESTED":
      object = {
        ...state,
        isLoading: true,
        cardstatusMessage: null,
        cardSaved: null,
        isLoadError: false,
      };
      break;
    case "CARD_ID_SUCESS":
      object = {
        ...state,
        isLoading: false,
        cardstatusMessage: payload,
        cardSaved: true,
      };
      break;

    case "CARD_ID_SUCESS_FALIURE":
      object = {
        ...state,
        isLoading: false,
        cardstatusMessage: payload,
        cardSaved: null,
        isLoadError: true,
      };
      break;

    case "SAVE_BILLING_SUCESS":
      object = {
        ...state,
        isLoading: false,
        cardstatusMessage: payload,
        cardSaved: true,
      };
      break;

    case "CARD_ID_FALIURE":
      object = {
        ...state,
        isLoading: false,
        cardstatusMessage:
          "There seems some technical issue while saving card id.",
        cardSaved: null,
        isLoadError: true,
      };
      break;

    case "SAVE_BILLING_FALIURE":
      object = {
        ...state,
        isLoading: false,
        cardstatusMessage:
          "There seems some technical issue while saving card id.",
        cardSaved: null,
        isLoadError: true,
      };
      break;
    case "UPDATE_PACKAGE_FALIURE":
      object = {
        ...state,
        isLoading: false,
        statusMessage: "There seems some technical issue while updating plan.",
        isLoadError: true,
      };
      break;
    case "MY_PLAN_REQUESTED":
      object = {
        ...state,
        isLoading: true,
        curPlanDetail: null,
        isLoadError: false,
      };
      break;
    case "MY_PLAN_SUCESS":
      object = { ...state, isLoading: false, curPlanDetail: payload };
      break;
    case "MY_PLAN_SUCESS_FALIURE":
    case "MY_PLAN_FALIURE":
      object = {
        ...state,
        isLoading: false,
        curPlanDetail: null,
        isLoadError: true,
      };
      break;
    case "CANCEL_MY_PLAN_REQUESTED":
      object = {
        ...state,
        isLoading: true,
        cancelstatusMessage: null,
        statusMessage: null,
        isLoadCancelError: false,
      };
      break;
    case "CANCEL_MY_PLAN_SUCESS":
      object = { ...state, isLoading: false, cancelstatusMessage: payload };
      break;
    case "CANCEL_MY_PLAN_FALIURE":
      object = {
        ...state,
        isLoading: false,
        cancelstatusMessage:
          "There seems some technical issue  while cancel the plan.",
        isLoadCancelError: true,
      };
      break;
    case "SET_OFFICE_SUCESS_FALIL":
      object = {
        ...state,
        isLoading: false,
        statusMessage: payload,
        isLoadError: true,
      };
      break;
    case "SET_OFFICE_FALIURE":
      object = {
        ...state,
        isLoading: false,
        statusMessage:
          "There seems some technical issue  while select the office.",
        isLoadError: true,
      };
      break;

    case "GET_ALL_CARDS_REQUESTED":
      object = {
        ...state,
        pageLoader: true,
        cardList: null,
        PaymentstatusMessage: null,
        isPaymentDetailError: false,
        cardAssign: false,
      };
      break;
    case "GET_ALL_CARDS_SUCCESS":
      object = { ...state, cardList: payload, pageLoader: false };
      break;
    case "GET_ALL_CARDS_FALIURE":
      object = {
        ...state,
        PaymentstatusMessage:
          "There seems some technical issue  while getting cards.",
        isPaymentDetailError: true,
        pageLoader: false,
      };
      break;

    case "GET_ALL_CARDS_OFFICE_REQUESTED":
      object = {
        ...state,
        isLoading: true,
        statusMessage: null,
        isLoadError: false,
        cardAssign: false,
      };
      break;

    case "GET_ALL_CARDS_OFFICE_SUCESS":
      object = { ...state, isLoading: false, officecardList: payload };
      break;

    case "GET_ALL_CARDS_OFFICE_FALIURE":
      object = {
        ...state,
        isLoading: false,
        isLoadError: true,
        statusMessage: "There seems some technical issue  while getting cards.",
      };
      break;

    case "UPDATE_CARD_BY_OFFICE_REQUESTED":
      object = {
        ...state,
        updateCardLoader: true,
        cardstatusMessage: null,
        isLoadError: false,
        cardAssign: false,
      };
      break;
    case "UPDATE_CARD_BY_OFFICE_SUCESS":
      object = {
        ...state,
        cardstatusMessage: payload,
        updateCardLoader: false,
        cardAssign: true,
      };
      break;
    case "UPDATE_CARD_BY_OFFICE_FALIURE":
      object = {
        ...state,
        cardstatusMessage:
          "There seems some technical issue  while updating cards.",
        isLoadError: true,
        updateCardLoader: false,
      };
      break;

    case "GET_SUBSCRIPTON_STATUS_REQUESTED":
      object = { ...state, subscriptionStatus: null, statusMessage: null };
      break;
    case "GET_SUBSCRIPTON_STATUS_SUCCESS":
      object = { ...state, subscriptionStatus: payload };
      break;
    case "GET_SUBSCRIPTON_STATUS_FALIURE":
      object = {
        ...state,
        statusMessage:
          "There seems some technical issue  while getting status.",
      };
      break;

    case "CLEAR_SUBSCRIPTION_REQUESTED":
      object = {
        ...state,
        cardstatusMessage: null,
        isLoading: true,
        isLoadError: false,
      };
      break;

    case "CLEAR_SUBSCRIPTION_SUCESS":
      object = { ...state, cardstatusMessage: payload, isLoading: false };
      break;

    case "CLEAR_SUBSCRIPTION_FALIURE":
      object = {
        ...state,
        cardstatusMessage: payload,
        isLoadError: true,
        isLoading: false,
      };
      break;

    case "GET_SUBSCRIPTION_TIME_REQUESTED":
      object = {
        ...state,
        statusMessage: null,
        isLoading: true,
        isLoadCancelError: false,
      };
      break;

    case "GET_SUBSCRIPTION_TIME_SUCESS":
      object = {
        ...state,
        subTimeDetail: payload,
        isLoading: false,
        isLoadCancelError: false,
      };
      break;

    case "GET_SUBSCRIPTION_TIME_FALIURE":
      object = {
        ...state,
        isLoading: false,
        statusMessage:
          "There seems some technical issue  while get subscription detail.",
        isLoadCancelError: true,
      };
      break;

    default:
      object = state;
  }
  return object;
};
export default subReducer;
