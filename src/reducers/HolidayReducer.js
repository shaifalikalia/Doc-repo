const initialState = {
  isLoading: false,
  statusMessage: null,
  holidayList: null,
  isLoadError: false,
  holiayRemoveMessage: null,
  isRemove: false,
};

const HolidayReducer = (state, { type, payload }) => {
  if (state === undefined) {
    state = initialState;
  }
  let object;
  switch (type) {
    case "HOLIDAY_ADD_REQUESTED":
    case "HOLIDAY_UPDATE_REQUESTED":
      object = {
        ...state,
        isLoading: true,
        statusMessage: null,
        holiayRemoveMessage: null,
        isLoadError: false,
      };
      break;
    case "HOLIDAY_ADD_SUCESS":
    case "HOLIDAY_UPDATE_SUCESS":
      object = { ...state, isLoading: false, statusMessage: payload };
      break;
    case "HOLIDAY_ADD_SUCESS_FALURE":
    case "HOLIDAY_UPDATE_SUCESS_FALURE":
      object = {
        ...state,
        isLoading: false,
        statusMessage: payload,
        isLoadError: true,
      };
      break;
    case "HOLIDAY_ADD_FALIURE":
    case "HOLIDAY_UPDATE_FALIURE":
      object = {
        ...state,
        isLoading: false,
        isLoadError: true,
        statusMessage:
          "There seems some technical issue  while adding holiday.",
      };
      break;
    case "GET_HOLIDAY_LIST_REQUESTED":
      object = {
        ...state,
        isLoading: true,
        holidayList: null,
        isLoadError: false,
      };
      break;
    case "GET_HOLIDAY_LIST_SUCESS":
      object = { ...state, isLoading: false, holidayList: payload };
      break;
    case "GET_HOLIDAY_LIST_FALIURE":
      object = {
        ...state,
        isLoading: false,
        isLoadError: true,
        statusMessage:
          "There seems some technical issue  while fetching holiday list.",
      };
      break;
    case "DELETE_HOLIDAY_REQUESTED":
      object = {
        ...state,
        isLoading: true,
        statusMessage: null,
        holiayRemoveMessage: null,
        isRemove: false,
      };
      break;
    case "DELETE_HOLIDAY_SUCESS":
      object = { ...state, isLoading: false, holiayRemoveMessage: payload };
      break;
    case "DELETE_HOLIDAY_SUCESS_FALURE":
      object = {
        ...state,
        isLoading: false,
        isRemove: true,
        holiayRemoveMessage: payload,
      };
      break;
    case "DELETE_HOLIDAY_FALIURE":
      object = {
        ...state,
        isLoading: false,
        isRemove: true,
        holiayRemoveMessage:
          "There seems some technical issue  while fetching holiday list.",
      };
      break;
    default:
      object = state;
  }
  return object;
};
export default HolidayReducer;
