const initialState = {
  Offices: [],
  isLoading: false,
  statusMessage: null,
  isOfficeAdd: false,
  isAddedError: false,
  officeDetail: {},
  provienceList: null,
  countryList: null,
  cityList: null,
  isLoadError: false,
  isOfficeLoadList: false,
  pagnation: null,
  isImageAdded: false,
};

const officeRedcuer = (state, { type, payload }) => {
  if (state === undefined) {
    state = initialState;
  }
  let object;
  switch (type) {
    case "OFFICEREQUESTED":
      object = {
        ...state,
        isLoading: true,
        isOfficeAdd: false,
        statusMessage: null,
        isOfficeLoadList: false,
        pagnation: null,
        Offices: [],
      };
      break;
    case "OFFICESUCCESS":
      object = {
        ...state,
        Offices: [...payload.data.office_list],
        pagnation: payload.pagination,
        isLoading: false,
      };
      break;
    case "OFFICES_FALIURE":
      object = {
        ...state,
        isLoading: false,
        isOfficeLoadList: true,
        statusMessage: payload,
      };
      break;
    case "OFFICEREQUESTED_SCROLL_REQUESTED":
      object = {
        ...state,
        isLoading: true,
        pagnation: null,
        isOfficeLoadList: false,
        statusMessage: null,
      };
      break;
    case "OFFICEREQUESTED_SCROLL_SUCCESS":
      object = {
        ...state,
        isLoading: false,
        Offices: [...state.Offices, ...payload.data.office_list],
        pagnation: payload.pagination,
      };
      break;
    case "OFFICEREQUESTED_SCROLL_FALIURE":
    case "OFFICE_DETAIL_FALIURE":
      object = {
        ...state,
        isLoading: false,
        isOfficeLoadList: true,
        statusMessage: "There seems some technical issue while getting office.",
      };
      break;
    case "OFFICE_DETAIL_REQUESTED":
      object = { ...state, isLoading: true, officeDetail: {} };
      break;
    case "OFFICE_DETAIL_SUCCESS":
      object = { ...state, isLoading: false, officeDetail: payload };
      break;
    case "OFFICEADDREQUESTED":
      object = {
        ...state,
        isLoading: true,
        isAddedError: false,
        statusMessage: null,
        isOfficeAdd: false,
      };
      break;
    case "OFIICEADDSUCCESS":
      object = {
        ...state,
        isLoading: false,
        isOfficeAdd: true,
        statusMessage: payload,
        isAddedError: false,
      };
      break;
    case "OFIICEADDSUCCESSERROR":
      object = {
        ...state,
        isLoading: false,
        isOfficeAdd: false,
        statusMessage: payload,
        isAddedError: true,
      };
      break;
    case "OFIICEADDERROR":
      object = {
        ...state,
        isLoading: false,
        isOfficeAdd: false,
        statusMessage: "There seems some technical issue while adding office.",
        isAddedError: true,
      };
      break;
    case "UPDATE_IMAGE_REQUESTED":
      object = {
        ...state,
        isLoading: true,
        isAddedError: false,
        statusMessage: null,
        isOfficeAdd: false,
        isImageAdded: false,
      };
      break;
    case "UPDATE_IMAGE_SUCCESS":
      object = {
        ...state,
        isLoading: false,
        isOfficeAdd: false,
        statusMessage: payload,
        isAddedError: false,
        isImageAdded: true,
      };
      break;
    case "UPDATE_IMAGE_ERROR":
      object = {
        ...state,
        isLoading: false,
        isOfficeAdd: false,
        statusMessage: "There seems some technical issue while adding Image.",
        isAddedError: true,
        isImageAdded: false,
      };
      break;

    case "OFFICE_FIELDS":
      object = { ...state, isOfficeAdd: false, officeDetail: payload };
      break;
    case "PROVIENCE_REQUESTED":
      object = { ...state, isLoading: true, cityList: null };
      break;
    case "PROVIENCE_SUCESS":
      object = { ...state, provienceList: payload, isLoading: false };
      break;
    case "COUNTRY_REQUESTED":
      object = {
        ...state,
        isLoading: true,
        countryList: null,
        provienceList: null,
        cityList: null,
      };
      break;
    case "COUNTRY_SUCESS":
      object = { ...state, countryList: payload, isLoading: false };
      break;
    case "CITY_REQUESTED":
      object = { ...state, isLoading: true };
      break;
    case "CITY_SUCESS":
      object = { ...state, cityList: payload, isLoading: false };
      break;
    case "SET_OFFICE_STATUS_REQUESTED":
      object = {
        ...state,
        isLoading: true,
        statusMessage: null,
        isLoadError: false,
      };
      break;
    case "SET_OFFICE_STATUS_SUCCESS":
      object = { ...state, isLoading: false, statusMessage: payload };
      break;
    case "SET_OFFICE_STATUS_SUCCESS_ERROR":
      object = {
        ...state,
        isLoading: false,
        statusMessage: payload,
        isLoadError: true,
      };
      break;
    case "SET_OFFICE_STATUS_ERROR":
      object = {
        ...state,
        isLoading: false,
        statusMessage: payload,
        isLoadError: true,
      };
      break;
    default:
      object = state;
  }
  return object;
};
export default officeRedcuer;
