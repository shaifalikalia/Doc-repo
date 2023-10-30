import constants from "../constants";

export default function Notification(state, action) {
  switch (action.type) {
    case constants.NOTIFICATIONREADED:
      return false;
    case constants.NOTIFICATIONUNREAD:
      return true;
    default:
      return state || false;
  }
}
