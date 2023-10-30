export const getProfile = (data) => {
  return {
    type: "GET_PROFILE",
    payload: data,
  };
};

export const getSastoken = (data) => {
  return {
    type: "GET_SAS_TOKEN",
    payload: data,
  };
};
