import React, { useEffect, useState } from "react";
import constants from "../constants";
import { useToGetListOfSubscriptionFeatures } from "repositories/subscription-repository";
import useHandleApiError from "hooks/useHandleApiError";

export default function useToGetFeaturesList({ t }) {
  const { subscriptionType } = constants;
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [subscriptionFeatures, setsubscriptionFeatures] = useState([]);
  const { data, isLoading, isFetching, error } =
    useToGetListOfSubscriptionFeatures();
  useHandleApiError(isLoading, isFetching, error);

  const subscriptionModuleCategory = {
    1: t("userPages.plan.officStaffManagement"),
    2: t("userPages.plan.StaffManagementCollaboration"),
    3: t("userPages.plan.virtualHr"),
    4: t("userPages.plan.doctorsCollaboration"),
    5: t("userPages.plan.patientEngagement"),
    6: t("userPages.plan.supplyManagement"),
    7: t("userPages.plan.supportTraining"),
  };

  useEffect(() => {
    if (Array.isArray(data) && data.length) {
      let subscriptionFeaturesModify = data.map((item) => {
        item.categoryName = subscriptionModuleCategory[item.category];
        item.isOpen = false;
        return item;
      });
      setsubscriptionFeatures(subscriptionFeaturesModify);
    }
  }, [data]);

  const isRowVisible = (item) => {
    return item.isBasic || item.isAdvance || item.isProfessional;
  };

  const isCheckIcon = (value) => {
    if (value)
      return (
        <img
          src={require("assets/images/pricing-check-uncheck.svg").default}
          alt="icon"
        />
      );
    return (
      <img
        src={require("assets/images/cross-mark-button.svg").default}
        alt="icon"
      />
    );
  };
  const openCollapseTab = (id) => {
    setsubscriptionFeatures((pre) =>
      pre.map((item) => {
        if (item.category === id) {
          item.isOpen = !item.isOpen;
        }
        return item;
      })
    );
  };

  return {
    selectedPlan,
    subscriptionFeatures,
    subscriptionType,
    isLoading,
    methods: {
      openCollapseTab,
      isCheckIcon,
      isRowVisible,
      setSelectedPlan,
    },
  };
}
