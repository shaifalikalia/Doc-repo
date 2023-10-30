import { useEffect, useState } from "react";
import {
  useToGetSubscriptionFeature,
  updateSubscriptionFeature,
} from "repositories/subscription-repository";
import useHandleApiError from "hooks/useHandleApiError";
import constants from "../../../constants";
import { handleError, handleSuccess } from "utils";
import { useHistory } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function useToManageFeatures({ t }) {
  let lengendColorType = {
    1: "green",
    2: "blue",
    3: "orange",
  };

  const subscriptionModuleCategory = {
    1: t("userPages.plan.officStaffManagement"),
    2: t("userPages.plan.StaffManagementCollaboration"),
    3: t("userPages.plan.virtualHr"),
    4: t("userPages.plan.doctorsCollaboration"),
    5: t("userPages.plan.patientEngagement"),
    6: t("userPages.plan.supplyManagement"),
    7: t("userPages.plan.supportTraining"),
  };

  const { data, isLoading, isFetching, error } = useToGetSubscriptionFeature();
  useHandleApiError(isLoading, isFetching, error);
  const [subscriptionFeatures, setsubscriptionFeatures] = useState([]);
  const [isLoader, setIsLoader] = useState(false);

  let { subscriptionType, subscriptionModuleType } = constants;
  const history = useHistory();
  const goBack = () => {
    history.goBack();
  };
  useEffect(() => {
    if (Array.isArray(data) && data.length) {
      let subscriptionFeaturesModify = data.map((item) => {
        item.moduleFeature = item.moduleFeature.map((list) => {
          list.lengendColor = lengendColorType[list.type];
          return list;
        });
        item.categoryName = subscriptionModuleCategory[item.category];
        return item;
      });

      setsubscriptionFeatures(subscriptionFeaturesModify);
    }
  }, [data]);

  const isChecked = (featuresList, featureType) => {
    const { type, isAdvance, isProfessional, isBasic } = featuresList;
    if (type === subscriptionModuleType.Default) return true;
    else if (featureType === subscriptionType.basic && isBasic) return true;
    else if (featureType === subscriptionType.advanced && isAdvance)
      return true;
    else if (featureType === subscriptionType.professional && isProfessional)
      return true;
    else return false;
  };

  const handleChange = (type, parentIndex, childIndex, detail, featureType) => {
    try {
      if (detail.type === subscriptionModuleType.Default) {
        toast.error(t("featurecannotUnselected"));
        return;
      }
      if (
        detail.type === subscriptionModuleType.LinkedWithFeature &&
        featureType === subscriptionType.professional
      ) {
        toast.error(t("featurecannotUnselectedProfessionalplan"));
        return;
      }

      if (featureType !== subscriptionType.basic && detail.isBasic) {
        toast.error(t("featurecannotUnselectedBasicPlan"));
        return;
      }

      if (featureType === subscriptionType.professional && detail.isAdvance) {
        toast.error(t("featurecannotUnselectedAdvancedPlan"));
        return;
      }

      updateCheckBox(type, parentIndex, childIndex, detail);
    } catch (err) {
      handleError(err);
    }
  };

  const updateCheckBox = (type, parentIndex, childIndex, detail) => {
    if (type === subscriptionType.basic) {
      setsubscriptionFeatures((pre) => {
        pre[parentIndex].moduleFeature[childIndex].isBasic = !detail.isBasic;
        pre[parentIndex].moduleFeature[childIndex].isAdvance = true;
        pre[parentIndex].moduleFeature[childIndex].isProfessional = true;
        return structuredClone(pre);
      });
    }

    if (type === subscriptionType.advanced) {
      setsubscriptionFeatures((pre) => {
        pre[parentIndex].moduleFeature[childIndex].isBasic = false;
        pre[parentIndex].moduleFeature[childIndex].isAdvance =
          !detail.isAdvance;
        pre[parentIndex].moduleFeature[childIndex].isProfessional = true;
        return structuredClone(pre);
      });
    }

    if (type === subscriptionType.professional) {
      setsubscriptionFeatures((pre) => {
        pre[parentIndex].moduleFeature[childIndex].isProfessional =
          !detail.isProfessional;
        return structuredClone(pre);
      });
    }

    if (Array.isArray(detail?.linkedModule) && detail?.linkedModule?.length) {
      let linkedModule = detail.linkedModule;
      setsubscriptionFeatures((pre) => {
        return pre.map((list) => {
          list.moduleFeature = list.moduleFeature.map((feature) => {
            if (linkedModule.includes(feature.id)) {
              feature.isBasic =
                pre[parentIndex].moduleFeature[childIndex].isBasic;
              feature.isAdvance =
                pre[parentIndex].moduleFeature[childIndex].isAdvance;
              feature.isProfessional =
                pre[parentIndex].moduleFeature[childIndex].isProfessional;
            }
            return feature;
          });
          return list;
        });
      });
    }
  };

  const saveSubscriptionPlan = async () => {
    try {
      if (!subscriptionFeatures?.length) return false;
      setIsLoader(true);
      let subscriptionFeaturesOfArray = [];
      subscriptionFeatures.forEach((item) => {
        item.moduleFeature?.forEach((list) => {
          let isDefaultSelected = list.type === subscriptionModuleType.Default;
          subscriptionFeaturesOfArray.push({
            MiraxisModuleId: list.id,
            IsBasic: isDefaultSelected ? isDefaultSelected : list.isBasic,
            IsAdvance: isDefaultSelected ? isDefaultSelected : list.isAdvance,
            IsProfessional: isDefaultSelected
              ? isDefaultSelected
              : list.isProfessional,
          });
        });
      });

      let res = await updateSubscriptionFeature({
        SubscriptionAndFeatures: subscriptionFeaturesOfArray,
      });
      handleSuccess(res.message);
      goBack();
    } catch (err) {
      handleError(err);
    }
    setIsLoader(false);
  };

  const disabledClass = (detail) => {
    if (detail.type === subscriptionModuleType.Default) return "disabled-check";
    return "";
  };

  return {
    data: {
      subscriptionFeatures,
      isLoading: isLoader || isLoading,
    },
    methods: {
      isChecked,
      handleChange,
      goBack,
      saveSubscriptionPlan,
      disabledClass,
    },
  };
}
