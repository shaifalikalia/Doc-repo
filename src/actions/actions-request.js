export const getDemoRequest = (data) => {
  return {
    type: "GET_DEMO_REQUEST",
    payload: data,
  };
};

export const markComplete = (data) => {
  return {
    type: "ADD_MARK_COMPLETE",
    payload: data,
  };
};
