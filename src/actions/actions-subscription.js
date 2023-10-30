export const getPackage = (data) => {
  return {
    type: "GET_SUB_PACKAGE",
    payload: data,
  };
};

export const AddEnterprisePackage = (data) => {
  return {
    type: "ADD_ENTERPRISE_PACKAGE",
    payload: data,
  };
};

export const getPackageSingleMultipule = (data) => {
  return {
    type: "GET_SINGLE_MULIPULE_PACKAGE",
    payload: data,
  };
};

export const getenterpriseOwners = (data) => {
  return {
    type: "GET_ENTERPRISE_OWNERS",
    payload: data,
  };
};

export const AddownerUser = (data) => {
  return {
    type: "ADD_ENTERPRISE_OWNER",
    payload: data,
  };
};

export const getOwnerDetails = (data) => {
  return {
    type: "GET_OWNER_DETAIL",
    payload: data,
  };
};

export const UpdateOwnerUser = (data) => {
  return {
    type: "UPDATE_OWNER",
    payload: data,
  };
};

export const getAllPlans = (data) => {
  return {
    type: "GET_ALL_PLANS",
    payload: data,
  };
};

export const AddsubPackage = (data) => {
  return {
    type: "SUBSCRIBE_LATEST_PACKAGE",
    payload: data,
  };
};

export const getcardSecret = (data) => {
  return {
    type: "GET_CARD",
    payload: data,
  };
};

export const saveCardId = (data) => {
  return {
    type: "SAVE_CARD",
    payload: data,
  };
};

export const saveCardBilling = (data) => {
  return {
    type: "SAVE_BILLING",
    payload: data,
  };
};

export const UpdatePackage = (data) => {
  return {
    type: "UPDATE_PACKAGE",
    payload: data,
  };
};

export const getMyPlan = (data) => {
  return {
    type: "GET_MY_PLAN",
    payload: data,
  };
};

export const cancelPlan = (data) => {
  return {
    type: "CANCEL_MY_PLAN",
    payload: data,
  };
};

export const setEnaleOffice = (data) => {
  return {
    type: "SET_ENABLE_OFFICE",
    payload: data,
  };
};

export const getAllCard = (data) => {
  return {
    type: "GET_ALL_CARDS",
    payload: data,
  };
};

export const getAllCardByOffice = (data) => {
  return {
    type: "GET_ALL_CARDS_OFFICE",
    payload: data,
  };
};

export const updateCardOffice = (data) => {
  return {
    type: "UPDATE_CARD_BY_OFFICE",
    payload: data,
  };
};

export const getSubscriptionStatus = (data) => {
  return {
    type: "GET_SUBSCRIPTON_STATUS",
    payload: data,
  };
};

export const clearSubscription = (data) => {
  return {
    type: "CLEAR_SUBSCRIPTION",
    payload: data,
  };
};

export const subcriptionTime = (data) => {
  return {
    type: "GET_SUBSCRIPTION_TIME",
    payload: data,
  };
};
