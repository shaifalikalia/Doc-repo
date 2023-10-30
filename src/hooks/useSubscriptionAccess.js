import { Store } from "containers/routes";
import { useContext } from "react";
import { useSelector } from "react-redux";
import constants, { isModuleAccessable } from "../constants";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { handleError } from "utils";

export default function useSubscriptionAccess() {
  const { setIsSubscriptionModel } = useContext(Store);
  const modulesAccess = useSelector((prev) => prev);

  const history = useHistory();

  const isModuleDisabledClass = (moduleToAccess, plan) => {
    try {
      if (
        (plan?.planFeature || modulesAccess?.Subscription?.planFeature) &&
        !isModuleAccessable(
          plan?.planFeature || modulesAccess?.Subscription?.planFeature,
          moduleToAccess
        )
      )
        return "disabled-element";

      return "";
    } catch (error) {
      handleError(error);
    }
  };

  const isModuleDisabledClassForStaff = (moduleToAccess) => {
    try {
      let subscription = modulesAccess?.Subscription;
      let onwnerMessanger = modulesAccess?.OnwnerMessanger;

      let isModuleDisabled;

      if (subscription) {
        if (
          subscription.length > 0 &&
          onwnerMessanger &&
          onwnerMessanger.length > 0 &&
          moduleToAccess === constants.moduleNameWithId.teamLiveChat
        ) {
          const ownerIds = onwnerMessanger?.map((messanger) => messanger.id);
          subscription = subscription?.filter((subs) =>
            ownerIds.includes(subs?.ownerId)
          );
        }

        for (let i = 0; i < subscription.length; i++) {
          const val = subscription[i];

          if (val?.planFeature) {
            isModuleDisabled = isModuleDisabledClass(moduleToAccess, val);

            if (!isModuleDisabled) {
              break; // Break out of the loop
            }
          }
        }
      }

      return isModuleDisabled;
    } catch (error) {
      handleError(error);
    }
  };

  const redirectWithCheck = (path, isDisabled) => {
    try {
      if (
        modulesAccess?.Subscription?.subscriptionPlan ===
        constants.subscriptionType.trial
      ) {
        history.push(path);
        return null;
      }

      if (isDisabled) {
        setIsSubscriptionModel(true);
        return null;
      }

      history.push(path);
    } catch (error) {
      handleError(error);
    }
  };

  return {
    redirectWithCheck,
    isModuleDisabledClass,
    isModuleDisabledClassForStaff,
  };
}
