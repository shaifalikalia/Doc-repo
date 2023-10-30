const initialState = {
  isLoading: false,
  statusMessage: null,
  requestList: null,
  isLoadError: false,
  ismarkError: true,
};
const DemoReducer = (state, { type, payload }) => {
  if (state === undefined) {
    state = initialState;
  }
  let object;

  switch (type) {
    case "GET_DEMO_REQUESTED":
      object = { ...state, isLoading: true, isLoadError: false };
      break;
    case "GET_DEMO_SUCCESS":
      object = { ...state, requestList: payload, isLoading: false };
      break;
    case "GET_DEMO_FALIURE":
      object = { ...state, isLoading: false, isLoadError: true };
      break;
    case "ADD_MARK_REQUESTED":
      object = {
        ...state,
        isLoading: true,
        statusMessage: null,
        ismarkError: false,
      };
      break;
    case "ADD_MARK_SUCCESS":
      object = { ...state, statusMessage: payload, ismarkError: false };
      break;
    case "ADD_MARK_FAILURE":
      object = { ...state, isLoading: false, ismarkError: true };
      break;

    default:
      object = state;
  }
  return object;
};
export default DemoReducer;
