import constants from "../../constants";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useGetCanUserCreateGroups } from "repositories/chat-repository";
import { handleError } from "utils";
import { useHistory } from "react-router-dom";

const useTeamConversationState = (dependencies) => {
  const { selectedOwner } = dependencies;
  const profile = useSelector((state) => state.userProfile.profile);
  const {
    isLoading,
    isFetching,
    data: canCreateGroups,
    error,
  } = useGetCanUserCreateGroups(selectedOwner?.id, {
    enabled: !!(profile && selectedOwner),
  });

  const cachedChatTab = sessionStorage.getItem(
    constants.localStorageKeys.activeChatTab
  );
  const [activeTab, setActiveTab] = useState(cachedChatTab || "1");
  useEffect(() => {
    sessionStorage.setItem(constants.localStorageKeys.activeChatTab, activeTab);
  }, [activeTab]);

  const history = useHistory();

  useEffect(() => {
    if (!isLoading && !isFetching && error) {
      handleError(error);
    }
  }, [error, isLoading, isFetching]);

  let isAccountOwner = false,
    isStaff = false;
  if (profile && profile.role) {
    isAccountOwner =
      profile.role.systemRole === constants.systemRoles.accountOwner;
    isStaff = profile.role.systemRole === constants.systemRoles.staff;
  }

  const handleBack = () => {
    history.push("/");
  };

  return {
    state: {
      activeTab,
      profile: {
        ...profile,
        isAccountOwner,
        isStaff,
        canCreateGroups,
      },
    },
    updateMethods: {
      setActiveTab,
    },
    otherMethods: {
      handleBack,
    },
  };
};

export default useTeamConversationState;
