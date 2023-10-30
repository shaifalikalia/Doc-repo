import { sortBy } from "lodash";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import constants from "../../constants";
import { useGetMessangerOwnerList } from "repositories/chat-repository";
import useSubscriptionAccess from "hooks/useSubscriptionAccess";

const useSelectedAccountOwner = ({ localStorageKey, setCurrentChannel }) => {
  const profile = useSelector((state) => state.userProfile.profile);
  const modulesAccess = useSelector((prev) => prev);
  const { isModuleDisabledClass } = useSubscriptionAccess();

  const [showSwitchOwnerModal, setShowSwitchOwnerModal] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState(null);

  const { isLoading: loadinOwnerData, data: ownerData } =
    useGetMessangerOwnerList();

  let isStaff = false;
  let isAccountOwner = false;
  if (profile && profile.role) {
    isStaff = profile.role.systemRole === constants.systemRoles.staff;
    isAccountOwner =
      profile.role.systemRole === constants.systemRoles.accountOwner;
    if (!isStaff) localStorage.removeItem(localStorageKey);
  }

  const sortedOwnerList = (ownerList) => {
    return sortBy(ownerList, [(owner) => owner.firstName?.toLowerCase()]);
  };

  useEffect(() => {
    if (modulesAccess && ownerData) {
      if (isStaff) {
        getStaffHaveModuleAccess();
      } else {
        if (isModuleDisabledClass(constants.moduleNameWithId.teamLiveChat)) {
          window.location.href = "/";
        }
      }
    }
  }, [modulesAccess]);

  const getStaffHaveModuleAccess = () => {
    try {
      let subscription = modulesAccess?.Subscription;
      let accessibleModule;

      if (subscription?.length) {
        const ownerIds = ownerData?.map((messanger) => messanger.id);
        subscription = subscription?.filter((subs) =>
          ownerIds.includes(subs?.ownerId)
        );

        for (let i = 0; i < subscription.length; i++) {
          const val = subscription[i];
          accessibleModule = val?.planFeature?.find(
            (plan) =>
              plan?.id === constants.moduleNameWithId.teamLiveChat &&
              plan?.isAvailable
          );

          if (accessibleModule) {
            accessibleModule.ownerId = val.ownerId;
            break; // Break out of the loop
          }
        }

        if (!accessibleModule) {
          window.location.href = "/";
          return;
        }

        const selectedOwnerData = ownerData?.find(
          (owner) => owner.id === accessibleModule.ownerId
        );
        setSelectedOwner(selectedOwnerData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const switchNewAccountOwner = (owner) => {
    if (owner) {
      setSelectedOwner(owner);
      localStorage.setItem(localStorageKey, JSON.stringify(owner));
      setCurrentChannel(null);
    }
  };

  if (
    !loadinOwnerData &&
    isStaff &&
    ownerData &&
    !ownerData.length &&
    localStorage.getItem(localStorageKey)
  ) {
    localStorage.removeItem(localStorageKey);
  }

  if (
    !loadinOwnerData &&
    isStaff &&
    ownerData &&
    ownerData[0] &&
    selectedOwner === null
  ) {
    if (localStorage.getItem(localStorageKey)) {
      let _selectedOwner = JSON.parse(localStorage.getItem(localStorageKey));
      let ownerExist = ownerData.find((v) => v.id === _selectedOwner.id);
      if (ownerExist) {
        switchNewAccountOwner(ownerExist);
      } else {
        switchNewAccountOwner(sortedOwnerList(ownerData)[0]);
      }
    } else {
      switchNewAccountOwner(sortedOwnerList(ownerData)[0]);
    }
  }

  if (
    profile &&
    profile.role &&
    !isStaff &&
    isAccountOwner &&
    selectedOwner === null
  ) {
    setSelectedOwner({
      id: profile.id,
      firstName: profile.firstName,
      lastName: profile.lastName,
      emailId: profile.emailId,
    });
  }

  return {
    state: {
      showSwitchOwnerModal,
      selectedOwner,
      ownerData: sortedOwnerList(ownerData),
      loadinOwnerData,
    },
    updateMethods: {
      setSelectedOwner,
      setShowSwitchOwnerModal,
    },
    otherMethods: {
      switchNewAccountOwner,
    },
  };
};

export default useSelectedAccountOwner;
