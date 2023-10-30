export const ADD_UNREAD_MESSAGE_COUNT = "ADD_UNREAD_MESSAGE_COUNT";

const initialState = {
  profile: null,
  isLoading: false,
  sasToken: null,
  profileErrorMessage: null,
  profileError: false,
  networkError: false,
  sendbirdMessageCount: 0,
};

const ProfileRedcuer = (state, { type, payload }) => {
  if (state === undefined) {
    state = initialState;
  }
  switch (type) {
    case "PROFILEREQUESTED":
      return { ...state, isLoading: true };

    case "PROFILE":
      return { ...state, profile: payload, isLoading: false };

    case "PROFILE_SUCCESS_ERROR":
      return {
        ...state,
        profileErrorMessage: payload,
        isLoading: false,
        profileError: true,
        profile: null,
      };

    case "PROFILE_SUCCESS_NETWORK_ERROR":
      return {
        ...state,
        profileErrorMessage: payload,
        isLoading: false,
        networkError: true,
        profile: null,
      };

    case "TOKEN_SUCESS":
      return { ...state, sasToken: payload };

    case "UPDATE_SHOW_IN_SEARCH_RESULT":
      const profile = state.profile;
      profile.showInSearch = payload.value;
      return { ...state, profile: { ...profile } };

    case ADD_UNREAD_MESSAGE_COUNT:
      return {
        ...state,
        profile: {
          ...state.profile,
          sendbirdMessageCount: payload,
        },
      };

    default:
      return state;
  }
};
export default ProfileRedcuer;
