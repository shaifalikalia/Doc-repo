export const getTestimonialList = (data) => {
  return {
    type: "GET_TESTIMONIAL_LIST",
    payload: data,
  };
};

export const getTestimonialCat = (data) => {
  return {
    type: "GET_TESTIMONIAL_CAT",
    payload: data,
  };
};

export const setTestimonialStatus = (data) => {
  return {
    type: "SET_TESTIMONIAL_STATUS",
    payload: data,
  };
};

export const addTestimonial = (data) => {
  return {
    type: "ADD_TESTIMONIAL",
    payload: data,
  };
};

export const editTestimonial = (data) => {
  return {
    type: "EDIT_TESTIMONIAL",
    payload: data,
  };
};

export const updateTestimonialImage = (data) => {
  return {
    type: "UPDATE_TESTIMONIAL_IMAGE",
    payload: data,
  };
};
