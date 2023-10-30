import { useEffect } from "react";
import { UserEventHandler } from "@sendbird/chat";
import { ADD_UNREAD_MESSAGE_COUNT } from "reducers/ProfileRedcuer";
import { v4 as uuidv4 } from "uuid";
import {
  useSendbirdStateContext,
  sendbirdSelectors,
} from "@sendbird/uikit-react";

export const useSendbirdMessageCount = (dependencies) => {
  const { dispatch } = dependencies;
  const context = useSendbirdStateContext();

  //In case of superadmin context will be undefined because we are not wrapping the
  //Header with SendbirdProvider in case of super admin in withMessageCount() HOC

  let sdk;
  if (context) {
    sdk = sendbirdSelectors?.getSdk(context);
  }

  const onTotalUnreadMessageCountUpdated = (totalCount) => {
    dispatch({
      type: ADD_UNREAD_MESSAGE_COUNT,
      payload: totalCount,
    });
  };

  useEffect(() => {
    const eventHandlerId = uuidv4();
    if (sdk?.addUserEventHandler) {
      const userEventHandler = new UserEventHandler({
        onTotalUnreadMessageCountUpdated,
      });
      sdk?.addUserEventHandler(eventHandlerId, userEventHandler);
    }
    return () => {
      if (eventHandlerId && sdk?.removeUserEventHandler) {
        sdk?.removeUserEventHandler(eventHandlerId);
      }
    };
  }, [sdk]);
};
