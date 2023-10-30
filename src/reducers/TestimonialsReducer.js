const initialState = {
  isLoading: false,
  statusMessage: null,
  TestimonialList: null,
  isLoadError: false,
  catList: null,
  imageAdded: false,
};
const TestimonialsReducer = (state, { type, payload }) => {
  if (state === undefined) {
    state = initialState;
  }
  let object;

  switch (type) {
    case "GET_TESTIMONIAL_LIST_REQUESTED":
      object = { ...state, isLoading: true, isLoadError: false };
      break;
    case "GET_TESTIMONIAL_LIST_SUCCESS":
      object = { ...state, TestimonialList: payload, isLoading: false };
      break;
    case "GET_TESTIMONIAL_LIST_FALIURE":
      object = { ...state, isLoading: false, isLoadError: true };
      break;
    case "GET_TESTIMONIAL_CAT_SUCCESS":
      object = { ...state, catList: payload };
      break;

    case "SET_TESTIMONIAL_STATUS_REQUESTED":
      object = {
        ...state,
        isLoading: true,
        statusMessage: null,
        isStatusError: false,
      };
      break;
    case "SET_TESTIMONIAL_STATUS_SUCCESS":
      object = { ...state, statusMessage: payload, isLoading: false };
      break;
    case "SET_TESTIMONIAL_STATUS_FAILURE":
      object = {
        ...state,
        isLoading: false,
        isStatusError: true,
        statusMessage: "There seems some technical issue.",
      };
      break;

    case "ADD_TESTIMONIAL_REQUESTED":
      object = {
        ...state,
        isLoading: true,
        statusMessage: null,
        isLoadError: false,
        imageAdded: false,
      };
      break;
    case "ADD_TESTIMONIAL_SUCCESS":
      object = { ...state, statusMessage: payload, isLoading: false };
      break;
    case "ADD_TESTIMONIAL_FALIURE":
      object = {
        ...state,
        isLoading: false,
        statusMessage:
          "There seems some technical issue while adding testimonial.",
        isLoadError: true,
      };
      break;

    case "UPDATE_TESTIMONIAL_IMAGE_REQUESTED":
      object = {
        ...state,
        isLoading: true,
        statusMessage: null,
        isLoadError: false,
        imageAdded: false,
      };
      break;
    case "UPDATE_TESTIMONIAL_IMAGE_SUCCESS":
      object = {
        ...state,
        statusMessage: payload,
        isLoading: false,
        imageAdded: true,
      };
      break;
    case "UPDATE_TESTIMONIAL_IMAGE_FALIURE":
      object = {
        ...state,
        isLoading: false,
        statusMessage:
          "There seems some technical issue while adding testimonial.",
        isLoadError: true,
        imageAdded: false,
      };
      break;

    default:
      object = state;
  }
  return object;
};
export default TestimonialsReducer;
