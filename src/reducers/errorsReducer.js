const initialState = {
  error: {},
  isError: false,
  hasError: false,
  isLoader: "",
};
const errorsReducer = (state, { type, payload }) => {
  if (state === undefined) {
    state = initialState;
  }
  switch (type) {
    case "ERROR":
      return {
        error: { ...payload.data, isLoader: false },
        isError: true,
        hasError: true,
      };
    case "REMOVE_ERROR":
      return {
        error: {},
        hasError: false,
        isError: true,
      };
    default:
      return state;
  }
};

export default errorsReducer;
