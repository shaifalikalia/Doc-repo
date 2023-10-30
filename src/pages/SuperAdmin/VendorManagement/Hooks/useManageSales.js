import { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash";
import { setStorage, getStorage } from "utils";
import constants from "../../../../constants";
import {
  useSalesRepDetailsAdmin,
  updateSalesRepStatus,
} from "repositories/admin-vendor-repository";
import useHandleApiError from "hooks/useHandleApiError";
import useRemoveCache from "hooks/useRemoveCache";
import { toast } from "react-hot-toast";

const PAGE_SIZE = 3;

export const useManageSales = ({ t }) => {
  const cacheValue =
    getStorage(constants.vendor.cache.manageSalesRepAdmin) || {};
  const [pageNumber, setPageNumber] = useState(cacheValue?.pageNumber || 1);
  const [isDeactive, setIsDeactive] = useState({ isOpen: false });
  const [showLoader, setShowLoader] = useState(false);
  const [searchText, setSearchText] = useState(cacheValue?.searchText || null);
  const [apiSearchText, setApiSearchText] = useState(
    cacheValue?.searchText || null
  );
  const searchTextValue = apiSearchText === null ? "" : apiSearchText?.trim();
  const {
    data,
    isLoading,
    error: isError,
    isFetching,
    refetch,
  } = useSalesRepDetailsAdmin(pageNumber, searchTextValue, PAGE_SIZE);
  useHandleApiError(isLoading, isFetching, isError);

  useEffect(() => {
    setStorage(constants.vendor.cache.manageSalesRepAdmin, {
      pageNumber,
      searchText,
    });
  }, [pageNumber, searchText]);

  useRemoveCache(
    [
      constants.routes.superAdmin.manageVendors,
      constants.routes.superAdmin.VendorDetails,
    ],
    constants.vendor.cache.manageSalesRepAdmin
  );

  const handleSearch = (event) => {
    setSearchText(event.target.value);
    searchHandle(event.target.value);
  };

  const searchHandle = useCallback(
    debounce((searchValue) => {
      setPageNumber(1);
      setApiSearchText(searchValue);
    }, 1000),
    []
  );

  const isChangedStatus = (details) => {
    setIsDeactive({
      isOpen: true,
      ...details,
    });
  };

  const closeStatusModel = () => {
    setIsDeactive({
      isOpen: false,
    });
  };

  const updateStatus = async () => {
    setShowLoader(true);
    try {
      let res = await updateSalesRepStatus({
        id: isDeactive.id,
        isActive: !isDeactive.isActive,
      });
      refetch();
      toast.success(res?.message);
      closeStatusModel();
    } catch (err) {
      toast.error(err?.message);
    }
    setShowLoader(false);
  };

  return {
    pageNumber,
    pageSize: PAGE_SIZE,
    searchText,
    salesRepListing: data?.data || [],
    showLoader: isLoading || showLoader || isFetching,
    totalItems: data?.pagination?.totalItems || 0,
    isDeactive,
    closeStatusModel,
    isChangedStatus,
    updateStatus,
    setPageNumber,
    handleSearch,
  };
};
