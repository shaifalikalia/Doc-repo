export const addHoliday = (data) => {
  return {
    type: "ADD_HOLIDAY",
    payload: data,
  };
};

export const getHolidayList = (data) => {
  return {
    type: "GET_HOLIDAY_LIST",
    payload: data,
  };
};

export const DeleteHoliday = (data) => {
  return {
    type: "DELETE_HOLIDAY",
    payload: data,
  };
};

export const updateHoliday = (data) => {
  return {
    type: "UPDATE_HOLIDAY",
    payload: data,
  };
};
