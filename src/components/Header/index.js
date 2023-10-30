import React, { useEffect } from "react";
import { connect, useSelector, useDispatch } from "react-redux";
import HeaderDropdown from "./components/dropdown";
import constants from "./../../constants";
import { getMessaging, onMessage, isSupported } from "firebase/messaging";
import { useGetNotifications } from "repositories/notification-repository";
import {
  useGetSendbirdUnreadCount,
  useGetMessangerOwnerList,
} from "repositories/chat-repository";
import { ADD_UNREAD_MESSAGE_COUNT } from "reducers/ProfileRedcuer";
import withMessageCount from "hoc/withMessageCount";
import { useSendbirdMessageCount } from "hooks/useSendbirdMessageCount";
import useSubscriptionAccess from "hooks/useSubscriptionAccess";
import { useToGetSubsModuleAccess } from "repositories/subscription-repository";
import Loader from "components/Loader";
import { Link } from "react-router-dom";

const Header = (props) => {
  let page = 1;
  let itemPerPage = 1;
  let listRequired = false;
  const {
    isModuleDisabledClass,
    redirectWithCheck,
    isModuleDisabledClassForStaff,
  } = useSubscriptionAccess();
  const newNotification = useSelector((e) => e.notification);
  let ownerId = props?.profile?.id || null;

  const dispatch = useDispatch();
  const { data: apiData } = useGetNotifications(
    itemPerPage,
    page,
    listRequired
  );
  const { data: sendbirdUnreadData } = useGetSendbirdUnreadCount(
    props?.profile?.id,
    { enabled: !!props?.profile?.id }
  );

  const { data, isLoading } = useToGetSubsModuleAccess(ownerId, {
    enabled:
      !!props?.profile?.id &&
      props?.profile?.role?.systemRole !== constants.systemRoles.superAdmin &&
      props?.profile?.role?.systemRole !== constants.systemRoles.patient,
  });
  const { data: ownerData } = useGetMessangerOwnerList(null, {
    enabled:
      !!props?.profile?.id &&
      props?.profile?.role?.systemRole !== constants.systemRoles.superAdmin,
  });

  const profile = useSelector((pre) => pre.userProfile?.profile);
  const isAdmin =
    profile?.role?.systemRole === constants.systemRoles.accountOwner;
  const isDisabledClass = {
    liveChat: isAdmin
      ? isModuleDisabledClass(constants.moduleNameWithId.teamLiveChat)
      : isModuleDisabledClassForStaff(constants.moduleNameWithId.teamLiveChat),
    scheduler: isAdmin
      ? isModuleDisabledClass(constants.moduleNameWithId.scheduler)
      : isModuleDisabledClassForStaff(constants.moduleNameWithId.scheduler),
  };

  useEffect(() => {
    if (data) {
      dispatch({
        type: constants.SUBSCRIPTIONMODULEADDED,
        payload: data,
      });
    } else {
      dispatch({
        type: constants.SUBSCRIPTIONMODULEADDED,
        payload: {},
      });
    }
  }, [data]);

  useEffect(() => {
    if (ownerData) {
      dispatch({
        type: constants.OWNERMESSAENGERMODULEADDED,
        payload: ownerData,
      });
    } else {
      dispatch({
        type: constants.OWNERMESSAENGERMODULEADDED,
        payload: {},
      });
    }
  }, [ownerData]);

  useEffect(() => {
    if (sendbirdUnreadData) {
      dispatch({
        type: ADD_UNREAD_MESSAGE_COUNT,
        payload: sendbirdUnreadData?.unread_count,
      });
    }
  }, [sendbirdUnreadData]);

  useSendbirdMessageCount({ dispatch });

  useEffect(() => {
    if (apiData && apiData?.data?.newNotifications) {
      dispatch({ type: constants.NOTIFICATIONUNREAD });
    }
  }, [apiData]);

  useEffect(() => {
    getNotifications();
  }, []);

  const getNotifications = async () => {
    const isSupportBrowser = await isSupported();
    if (isSupportBrowser) {
      const messaging = getMessaging();
      onMessage(messaging, (payload) => {
        if (payload) {
          dispatch({ type: constants.NOTIFICATIONUNREAD });
        }
      });
    }
  };

  let logo = null;
  const condtionFirst = props.profile && !props.profile.isAccountOwnerSetup;
  const condtionSecond = props.profile && props.profile.isAccountOwnerSetup;
  const condtionThree = props.profile.profileSetupStep !== "packageExpired";
  if (
    condtionFirst &&
    props.profile.role.systemRole === constants.systemRoles.accountOwner
  ) {
    logo = (
      <Link to="/account">
        <img
          src={require("assets/images/home-logo.svg").default}
          className="img-fluid"
          alt="logo"
        />
      </Link>
    );
  }
  if (
    condtionSecond &&
    props.profile.role.systemRole === constants.systemRoles.accountOwner &&
    (props.profile.profileSetupStep === "completed" ||
      props.profile.profileSetupStep === "packageExpired" ||
      props.profile.profileSetupStep === "subscriptionTerminated")
  ) {
    logo = (
      <Link to="/Offices">
        <img
          src={require("assets/images/home-logo.svg").default}
          className="img-fluid"
          alt="logo"
        />
      </Link>
    );
  }

  if (
    condtionSecond &&
    props.profile.role.systemRole === constants.systemRoles.accountOwner &&
    props.profile.profileSetupStep !== "completed" &&
    condtionThree &&
    props.profile.profileSetupStep !== "subscriptionTerminated"
  ) {
    logo = (
      <img
        src={require("assets/images/home-logo.svg").default}
        className="img-fluid"
        alt="logo"
      />
    );
  }
  if (
    props.profile &&
    props.profile.role.systemRole === constants.systemRoles.staff
  ) {
    logo = (
      <Link to="/">
        <img
          src={require("assets/images/home-logo.svg").default}
          className="img-fluid"
          alt="logo"
        />
      </Link>
    );
  }
  if (
    props.profile &&
    props.profile.role.systemRole === constants.systemRoles.superAdmin
  ) {
    logo = (
      <Link to="/manage-owner">
        <img
          src={require("assets/images/home-logo.svg").default}
          className="img-fluid"
          alt="logo"
        />
      </Link>
    );
  }

  if (
    props.profile &&
    props.profile.role.systemRole === constants.systemRoles.patient
  ) {
    logo = (
      <Link to={constants.routes.doctors}>
        <img
          src={require("assets/images/home-logo.svg").default}
          className="img-fluid"
          alt="logo"
        />
      </Link>
    );
  }

  return (
    <header>
      {isLoading && <Loader />}
      <div className="container-fluid custom-logo">
        <div className="row no-gutters align-items-center">
          <div className="col-4">
            <div className="logo">{logo}</div>
          </div>
          <div className="col-8 text-right header-right">
            <HeaderDropdown
              ProviderName={props.ProviderName}
              newNotification={newNotification}
              dispatch={dispatch}
              isDisabledClass={isDisabledClass}
              redirectWithCheck={redirectWithCheck}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
const mapStateToProps = ({ userProfile: { profile } }) => ({
  profile,
});
export default connect(mapStateToProps, null)(withMessageCount(Header));
