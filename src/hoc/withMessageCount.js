import { SendBirdProvider } from "@sendbird/uikit-react";
import constants from "../constants";

const withMessageCount = (Component) => {
  return (props) => {
    const profile = props.profile || {};
    const { role } = profile || {};

    const messengerAccess = [
      constants.systemRoles.accountOwner,
      constants.systemRoles.staff,
    ];

    if (messengerAccess.includes(role?.systemRole)) {
      return (
        <SendBirdProvider
          appId={process.env.REACT_APP_SENDBIRD_APP_ID}
          userId={`${profile.id}`}
        >
          <Component {...props} />
        </SendBirdProvider>
      );
    }

    return <Component {...props} />;
  };
};

export default withMessageCount;
