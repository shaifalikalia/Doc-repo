export const changePassword = (data) => {
  return {
    type: "CHANGE_PASSWORD",
    payload: data,
  };
};

export const getaccountowner = (data) => {
  return {
    type: "GET_ACCOUNT_OWNER",
    payload: data,
  };
};

export const setOwnerStatus = (data) => {
  return {
    type: "SET_OWNER_STATUS",
    payload: data,
  };
};

export const setcancelPlan = (data) => {
  return {
    type: "SET_CANCEL_PLAN",
    payload: data,
  };
};

export const getpersonnel = (data) => {
  return {
    type: "GET_PERSONNEL_MEMBER",
    payload: data,
  };
};

export const getOwnersPlans = (data) => {
  return {
    type: "GET_OWNER_PLAN_TYPE",
    payload: data,
  };
};
