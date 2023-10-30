import constants from "../constants";

export default function OnwnerMessanger(state, action) {
  switch (action.type) {
    case constants.OWNERMESSAENGERMODULEADDED:
      return action?.payload;
    case constants.OWNERMESSAENGERMODULEREMOVED:
      return {};
    default:
      return state || {};
  }
}
