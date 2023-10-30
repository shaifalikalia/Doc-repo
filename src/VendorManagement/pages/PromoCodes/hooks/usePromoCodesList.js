import constants from "../../../../constants";
import useHandleApiError from "hooks/useHandleApiError";
import { useState, useEffect } from "react";
import {
  useGetExpiredPromocodes,
  useGetLaunchedPromocodes,
  useSendPromocodeToCustomers,
} from "repositories/vendor-repository";
import useRemoveCache from "hooks/useRemoveCache";
import useScrollTopOnPageChange from "hooks/useScrollTopOnPageChange";
import { handleError, handleSuccess } from "utils";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

const tabs = {
  launched: "1",
  expired: "2",
};

const PAGE_SIZE = 4;

const usePromoCodesList = (dependencies) => {
  const { t } = dependencies;
  const history = useHistory();
  const profile = useSelector((e) => e.userProfile.profile);
  const isAccountTerminated = profile?.profileSetupStep === constants.subscriptionTerminated
  const disabledClass = isAccountTerminated ? 'disabled-element': ''

  let cachedData = sessionStorage.getItem(
    constants.vendor.cache.promoCodesList
  );
  cachedData = cachedData ? JSON.parse(cachedData) : {};

  const [activeTab, setActiveTab] = useState(
    cachedData.activeTab || tabs.launched
  );
  const [currentLaunchedPage, setCurrentLaunchedPage] = useState(
    cachedData.currentLaunchedPage || 1
  );
  const {
    isLoading: loading1,
    isFetching: fetching1,
    data: launchedData,
    error: error1,
  } = useGetLaunchedPromocodes(currentLaunchedPage, PAGE_SIZE, {
    enabled: activeTab === tabs.launched,
  });
  const [showDisableModel, setShowDisableModel] = useState(false);
  useHandleApiError(loading1, fetching1, error1);
  useScrollTopOnPageChange(currentLaunchedPage);

  const [currentExpiredPage, setCurrentExpiredPage] = useState(
    cachedData.currentExpiredPage || 1
  );
  const {
    isLoading: loading2,
    isFetching: fetching2,
    data: expiredData,
    error: error2,
  } = useGetExpiredPromocodes(currentExpiredPage, PAGE_SIZE, {
    enabled: activeTab === tabs.expired,
  });
  useHandleApiError(loading2, fetching2, error2);
  useScrollTopOnPageChange(currentExpiredPage);

  useEffect(() => {
    const cache = {
      activeTab,
      currentLaunchedPage,
      currentExpiredPage,
    };
    sessionStorage.setItem(
      constants.vendor.cache.promoCodesList,
      JSON.stringify(cache)
    );
  }, [activeTab, currentLaunchedPage, currentExpiredPage]);

  useRemoveCache(
    [constants.routes.vendor.addPromoCode],
    constants.vendor.cache.promoCodesList
  );

  const sendPromocodeMutation = useSendPromocodeToCustomers();
  const { isLoading: sendingPromocode } = sendPromocodeMutation;

  const handleCustomerBtn = async (promoCodeId) => {
    try {
      if (isAccountTerminated) {
        setShowDisableModel(true);
        return false;
      }
      await sendPromocodeMutation.mutateAsync(promoCodeId);
      handleSuccess(t("vendorManagement.promocodeSend"));
    } catch (err) {
      handleError(err);
    }
  };

  const handleRedirect = () => {
    if (isAccountTerminated) {
      setShowDisableModel(true);
      return false;
    }
    history.push(constants.routes.vendor.addPromoCode);
  };

  return {
    data: {
      loading: loading1 || loading2 || sendingPromocode,
      tabs,
      activeTab,
      launchedList: launchedData?.data || [],
      totalLaunchedItems: launchedData?.pagination?.totalItems || 1,
      currentLaunchedPage,
      expiredList: expiredData?.data || [],
      currentExpiredPage,
      totalExpiredItems: expiredData?.pagination?.totalItems || 1,
      pageSize: PAGE_SIZE,
      showDisableModel,
      disabledClass
    },
    methods: {
      setActiveTab,
      setCurrentLaunchedPage,
      setCurrentExpiredPage,
      handleCustomerBtn,
      setShowDisableModel,
      handleRedirect,
    },
  };
};

export default usePromoCodesList;
