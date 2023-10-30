const initialState = {
  dataContent: null,
  isLoading: false,
  pageContent: null,
  contactContent: null,
  companyInformation: null,
  statusMessage: null,
  isLoadError: false,
  pageLoading: false,
  packageDetail: null,
  testimonialList: null,
};

const ManageContentReducer = (state, { type, payload }) => {
  if (state === undefined) {
    state = initialState;
  }
  let object;
  switch (type) {
    case "PAGE_CONTENT_REQUESTED":
      object = { ...state, isLoading: true, dataContent: "" };
      break;
    case "PAGE_CONTENT_SUCESS":
      object = { ...state, dataContent: payload, isLoading: false };
      break;
    case "PAGE_CONTENT_FALIURE":
    case "SINGLE_PAGE_CONTENT_FALIURE":
      object = { ...state, isLoading: false };
      break;
    case "SINGLE_PAGE_CONTENT_REQUESTED":
      object = { ...state, isLoading: true, pageContent: "" };
      break;
    case "SINGLE_PAGE_CONTENT_SUCESS":
      object = { ...state, pageContent: payload, isLoading: false };
      break;
    case "CONTACT_PAGE_CONTENT_REQUESTED":
      object = { ...state, contactContent: "" };
      break;
    case "CONTACT_PAGE_CONTENT_SUCESS":
      object = { ...state, contactContent: payload };
      break;
    case "CONTACT_PAGE_CONTENT_FALIURE":
      object = { ...state };
      break;

    //COMPANY_INFORMATION
    case "COMPANY_INFORMATION_CONTENT_REQUESTED":
      object = { ...state, companyInformation: null };
      break;
    case "COMPANY_INFORMATION_CONTENT_SUCCESS":
      object = { ...state, companyInformation: payload };
      break;
    case "COMPANY_INFORMATION_CONTENT_FAILURE":
      object = { ...state };
      break;

    case "UPDATE_CONTENT_REQUESTED":
      object = {
        ...state,
        isLoading: true,
        statusMessage: null,
        isLoadError: false,
      };
      break;
    case "UPDATE_CONTENT_SUCESS":
      object = { ...state, isLoading: false, statusMessage: payload };
      break;

    case "UPDATE_CONTENT_FALIURE":
      object = {
        ...state,
        isLoading: false,
        isLoadError: true,
        statusMessage:
          "There seems some technical issue  while updating content.",
      };
      break;
    case "ADD_SCHEDULE_REQUESTED":
      object = {
        ...state,
        pageLoading: true,
        statusMessage: null,
        isLoadError: false,
      };
      break;
    case "ADD_SCHEDULE_SUCESS":
      object = { ...state, pageLoading: false, statusMessage: payload };
      break;
    case "ADD_SCHEDULE_FALIURE":
      object = {
        ...state,
        pageLoading: false,
        isLoadError: true,
        statusMessage:
          "There seems some technical issue  while adding schedule.",
      };
      break;
    case "GET_PACKAGE_DETAIL_SUCESS":
      object = { ...state, packageDetail: payload };
      break;

    case "GET_CAT_TESTIMONIAL_REQUESTED":
      object = { ...state, pageLoading: false, testimonialList: null };
      break;
    case "GET_CAT_TESTIMONIAL_SUCESS":
      object = { ...state, pageLoading: false, testimonialList: payload };
      break;

    default:
      object = state;
  }
  return object;
};
export default ManageContentReducer;
