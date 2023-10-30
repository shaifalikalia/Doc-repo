import constants from "../constants";

export default function Subscription(state, action) {
  switch (action.type) {
    case constants.SUBSCRIPTIONMODULEADDED:
      return action?.payload;
    case constants.SUBSCRIPTIONMODULEREMOVED:
      return {};
    default:
      return state || {};
  }
}
