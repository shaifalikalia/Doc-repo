export const getOffices = (data) => {
  return {
    type: "GET_OFFICES",
    payload: data,
  };
};

export const getOfficesScroll = (data) => {
  return {
    type: "GET_OFFICES_SCROLL",
    payload: data,
  };
};

export const getOfficesDetail = (data) => {
  return {
    type: "GET_OFFICES_Detail",
    payload: data,
  };
};

export const addOffice = (data) => {
  return {
    type: "ADD_OFFICES",
    payload: data,
  };
};

export const editOffice = (data) => {
  return {
    type: "EDIT_OFFICES",
    payload: data,
  };
};

export const UpdateImage = (data) => {
  return {
    type: "UPDATE_IMAGE",
    payload: data,
  };
};

export const officeFieldData = (data) => {
  return {
    type: "OFFICE_FIELDS",
    payload: data,
  };
};

export const getOfficesProvience = (data) => {
  return {
    type: "GET_OFFICES_PROVIENCE",
    payload: data,
  };
};

export const getOfficesCountry = (data) => {
  return {
    type: "GET_OFFICES_COUNTRY",
    payload: data,
  };
};

export const getOfficesCity = (data) => {
  return {
    type: "GET_OFFICES_CITY",
    payload: data,
  };
};

export const setOfficeStatus = (data) => {
  return {
    type: "SET_OFFICE_STATUS",
    payload: data,
  };
};
