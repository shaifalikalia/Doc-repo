export const getpagecontent = (data) => {
  return {
    type: "GET_PAGE_CONTENT",
    payload: data,
  };
};

export const getConent = (data) => {
  return {
    type: "GET_CONTENT",
    payload: data,
  };
};

export const getCompanyInformation = () => {
  return {
    type: "GET_COMPANY_INFORMATION",
  };
};

export const getContactConent = (data) => {
  return {
    type: "GET_CONTACT_CONTENT",
    payload: data,
  };
};

export const updatepagecontent = (data) => {
  return {
    type: "UPDATE_PAGE_CONTENT",
    payload: data,
  };
};

export const addSchedule = (data) => {
  return {
    type: "ADD_SCHEDULE",
    payload: data,
  };
};

export const getpackageDetail = (data) => {
  return {
    type: "GET_PACKAGE_DETAIL",
    payload: data,
  };
};

export const getCatTestimonial = (data) => {
  return {
    type: "GET_CAT_TESTIMONIAL",
    payload: data,
  };
};
