import { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash";
import { setStorage, getStorage, encodeId } from "utils";
import constants from "../../../../constants";
import { useHistory } from "react-router-dom";
import {
  useVendorListing,
  updateVendorStatus,
} from "repositories/admin-vendor-repository";
import useHandleApiError from "hooks/useHandleApiError";
import useRemoveCache from "hooks/useRemoveCache";
import { toast } from "react-hot-toast";

const PAGE_SIZE = 3;

export const useManageVendor = ({ t }) => {
  const options = [
    {
      value: 0,
      label: t("All Members"),
      apiValue: "",
    },
    {
      value: 1,
      label: t("active"),
      apiValue: true,
    },
    {
      value: 2,
      label: t("inactive"),
      apiValue: false,
    },
  ];

  const cacheValue = getStorage(constants.vendor.cache.manageOrders) || {};
  const [selectedOption, setSelectedOption] = useState(
    cacheValue?.selectedOption || options[0].value
  );
  const [pageNumber, setPageNumber] = useState(cacheValue?.pageNumber || 1);
  const [isDeactive, setIsDeactive] = useState({ isOpen: false });
  const [showLoader, setShowLoader] = useState(false);
  const [searchText, setSearchText] = useState(cacheValue?.searchText || null);
  const [apiSearchText, setApiSearchText] = useState(
    cacheValue?.searchText || null
  );
  const status = options.find(
    (item) => item.value === selectedOption
  )?.apiValue;
  const {
    data,
    isLoading,
    error: isError,
    isFetching,
    refetch,
  } = useVendorListing(
    PAGE_SIZE,
    pageNumber,
    status,
    apiSearchText === null ? "" : apiSearchText?.trim()
  );
  useHandleApiError(isLoading, isFetching, isError);
  const history = useHistory();

  useEffect(() => {
    setStorage(constants.vendor.cache.manageOrders, {
      pageNumber,
      searchText,
      selectedOption,
    });
  }, [pageNumber, selectedOption, searchText]);

  useRemoveCache(
    [
      constants.routes.superAdmin.manageVendors,
      constants.routes.superAdmin.VendorDetails,
    ],
    constants.vendor.cache.manageOrders
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

  const redirectToVendorDetails = (VendorDetail) => {
    if (!VendorDetail) return;
    history.push({
      pathname: constants.routes.superAdmin.VendorDetails.replace(
        ":vendorId",
        encodeId(VendorDetail?.user?.id)
      ),
      state: VendorDetail,
    });
  };

  const updateSelectedOptions = (item) => {
    setPageNumber(1);
    setSelectedOption(item?.value);
  };

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
      let res = await updateVendorStatus({
        vendorId: isDeactive.user.id,
        isActive: !isDeactive.isApproved ? true : !isDeactive.user.isActive,
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
    selectedOption,
    pageNumber,
    options,
    pageSize: PAGE_SIZE,
    searchText,
    vendorListing: data?.data || [],
    showLoader: isLoading || showLoader || isFetching,
    totalItems: data?.pagination?.totalItems || 0,
    isDeactive,
    closeStatusModel,
    updateSelectedOptions,
    isChangedStatus,
    updateStatus,
    setPageNumber,
    handleSearch,
    redirectToVendorDetails,
  };
};
