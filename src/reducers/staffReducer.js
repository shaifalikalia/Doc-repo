const initialState = {
  staffDesignation: null,
  isLoading: false,
  statusMessage: null,
  staffMembers: [],
  pagnation: null,
  isRoleAdded: false,
  isRoleAddedError: false,
};
const staffReducer = (state, { type, payload }) => {
  if (state === undefined) {
    state = initialState;
  }
  let object;
  switch (type) {
    case "DESGINATIONREQUESTED":
      object = {
        ...state,
        isLoading: true,
        isRoleAdded: false,
        isRoleAddedError: false,
      };
      break;
    case "DESGINATIONSUCESS":
      object = { ...state, isLoading: false, staffDesignation: payload };
      break;
    case "DESGINATIONFAILURE":
    case "STAFFMEMBERFALIURE":
    case "STAFFMEMBER_SCROLL_FAILURE":
      object = { ...state, isLoading: false };
      break;
    case "ADDEDITREQUTESTED":
      object = {
        ...state,
        isLoading: true,
        statusMessage: null,
        isStaffAdd: false,
        isAddedError: false,
      };
      break;
    case "ADDEDITSUCESS":
      object = {
        ...state,
        isLoading: false,
        statusMessage: payload,
        isStaffAdd: true,
        isAddedError: false,
      };
      break;
    case "ADDEDITFAILURE":
      object = {
        ...state,
        isLoading: false,
        isStaffAdd: false,
        statusMessage:
          payload || "There seems some technical issue while adding office.",
        isAddedError: true,
      };
      break;
    case "STAFFMEMBERREQUESTED":
      object = { ...state, isLoading: true, staffMembers: [], pagnation: null };
      break;
    case "STAFFMEMBERSUCESS":
      object = {
        ...state,
        isLoading: false,
        staffMembers: [...payload.data.staff_list],
        pagnation: payload.pagination,
      };
      break;
    case "STAFFMEMBER_SCROLL_REQUESTED":
      object = { ...state, isLoading: true, pagnation: null };
      break;
    case "STAFFMEMBER_SCROLL_SUCESS":
      object = {
        ...state,
        isLoading: false,
        staffMembers: [...state.staffMembers, ...payload.data.staff_list],
        pagnation: payload.pagination,
      };
      break;
    case "DELETE_MEMBER_REQUESTED":
      object = {
        ...state,
        isLoading: true,
        isStaffDelete: false,
        isStaffDeleteError: false,
      };
      break;
    case "DELETE_MEMBER_SUCESS":
      object = {
        ...state,
        statusMessage: payload,
        isLoading: false,
        isStaffDelete: true,
        isStaffDeleteError: false,
      };
      break;
    case "DElETE_MEMBER_FALIURE":
      object = {
        ...state,
        isLoading: false,
        statusMessage: "There seems some technical issue while adding office.",
        isStaffDelete: false,
        isStaffDeleteError: true,
      };
      break;
    case "ADD_ROLE_REQUESTED":
    case "EDIT_ROLE_REQUESTED":
    case "DELETE_ROLE_REQUESTED":
    case "MARK_DEFAULT_REQUESTED":
      object = {
        ...state,
        isLoading: true,
        isRoleAdded: false,
        isRoleAddedError: false,
        statusMessage: null,
      };
      break;
    case "ADD_ROLE_SUCESS":
    case "EDIT_ROLE_SUCESS":
    case "DELETE_ROLE_SUCESS":
    case "MARK_DEFAULT_SUCESS":
      object = {
        ...state,
        isLoading: false,
        isRoleAdded: true,
        isRoleAddedError: false,
        statusMessage: payload,
      };
      break;
    case "ADD_ROLE_FALIURE":
    case "EDIT_ROLE_FALIURE":
      object = {
        ...state,
        isLoading: false,
        isRoleAdded: false,
        isRoleAddedError: true,
        statusMessage: "There seems some technical issue while adding office.",
      };
      break;
    case "DELETE_ROLE_FALIURE":
      object = {
        ...state,
        isLoading: false,
        isRoleAdded: false,
        isRoleAddedError: true,
        statusMessage: "There seems some technical issue while Delete office.",
      };
      break;
    case "MARK_DEFAULT_FALIURE":
      object = {
        ...state,
        isLoading: false,
        isRoleAdded: false,
        isRoleAddedError: true,
        statusMessage:
          "There seems some technical issue while making default .",
      };
      break;
    case "START_LOADING":
      object = { ...state, isLoading: true };
      break;
    case "STOP_LOADING":
      object = { ...state, isLoading: false };
      break;
    default:
      object = state;
  }
  return object;
};
export default staffReducer;
