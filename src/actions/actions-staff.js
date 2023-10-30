export const getstaffDesignation = (data) => {
  return {
    type: "GET_STAFF_DESIGNATION",
    payload: data,
  };
};

export const addEditStaff = (data) => {
  return {
    type: "ADD_EDIT_STAFF",
    payload: data,
  };
};

export const editStaff = (data) => {
  return {
    type: "EDIT_STAFF",
    payload: data,
  };
};

export const addEditStaffInvite = (data) => {
  return {
    type: "ADD_EDIT_STAFF_INVITE",
    payload: data,
  };
};

export const getstaffMembers = (data) => {
  return {
    type: "GET_STAFF_MEMBERS",
    payload: data,
  };
};

export const getstaffMembersScroll = (data) => {
  return {
    type: "GET_STAFF_MEMBERS_SCROLL",
    payload: data,
  };
};

export const DeleteMembers = (data) => {
  return {
    type: "DELETE_STAFF_MEMBERS",
    payload: data,
  };
};

export const addstaffDesignation = (data) => {
  return {
    type: "ADD_STAFF_DESIGNATION",
    payload: data,
  };
};

export const editstaffDesignation = (data) => {
  return {
    type: "EDIT_STAFF_DESIGNATION",
    payload: data,
  };
};

export const deletestaffDesignation = (data) => {
  return {
    type: "DELETE_STAFF_DESIGNATION",
    payload: data,
  };
};

export const markDefaultDesignation = (data) => {
  return {
    type: "MARK_DEFAULT_DESGINATION",
    payload: data,
  };
};

export const startLoading = () => {
  return { type: "START_LOADING" };
};

export const stopLoading = () => {
  return { type: "STOP_LOADING" };
};
