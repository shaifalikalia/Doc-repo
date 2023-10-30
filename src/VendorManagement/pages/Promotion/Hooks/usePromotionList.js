import React, { useState, useEffect } from "react";
import { getStorage, setStorage } from "utils";
import constants from "../../../../constants";
import { useGetPromotionList } from "repositories/vendor-repository";
import useHandleApiError from "hooks/useHandleApiError";
import { cloneDeep } from "lodash";
import useRemoveCache from "hooks/useRemoveCache";

export const usePromotionList = ({ pageSize }) => {
  const launchedTab = "1";
  const cacheValue =
    getStorage(constants.vendor.cache.promotionPaginationCache) || {};
  const [activeTab, setActiveTab] = useState(
    cacheValue?.activeTab || launchedTab
  );
  const [showDisableModel, setShowDisableModel] = useState(false);

  const [pageNumbers, setPagesNumbers] = useState(
    cacheValue.pageNumbers || {
      launched: 1,
      expired: 1,
    }
  );
  const apiPageNumber =
    activeTab === launchedTab ? pageNumbers.launched : pageNumbers.expired;
  const isExpired = activeTab !== launchedTab ? true : false;

  const { data, isLoading, isFetching, error } = useGetPromotionList(
    apiPageNumber,
    pageSize,
    isExpired
  );
  useHandleApiError(isLoading, isFetching, error);
  useRemoveCache(
    [
      constants.routes.vendor.addPromotion,
      constants.routes.vendor.promotionDetail,
    ],
    constants.vendor.cache.promotionPaginationCache
  );

  const updateTab = (tab) => {
    setActiveTab(tab);
    setStorage(constants.vendor.cache.promotionTabCache, tab);
  };

  useEffect(() => {
    setStorage(constants.vendor.cache.promotionPaginationCache, {
      pageNumbers,
      activeTab,
    });
  }, [activeTab, pageNumbers]);

  const handlePageNumber = (page) => {
    const copyPageNumberObj = cloneDeep(pageNumbers);
    if (isExpired) {
      copyPageNumberObj.expired = page;
    } else {
      copyPageNumberObj.launched = page;
    }
    setPagesNumbers(copyPageNumberObj);
  };

  return {
    activeTab,
    promotionList: data?.data || [],
    totalItems: data?.pagination?.totalItems,
    isLoading: isLoading || isFetching,
    pageNumber: apiPageNumber,
    showDisableModel,
    setShowDisableModel,
    handlePageNumber,
    updateTab,
  };
};
