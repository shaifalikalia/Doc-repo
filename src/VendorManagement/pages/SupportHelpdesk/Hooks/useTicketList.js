import { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash";
import constants, {
  getClassNameVenodorTicket,
  getStatusVenodorTicket,
} from "../../../../constants";
import { getStorage, setStorage } from "utils";
import useHandleApiError from "hooks/useHandleApiError";
import { useTicketsListVendor } from "repositories/admin-vendor-repository";

export const useTicketList = ({ t }) => {
  const options = constants.vendorTicketType;

  const PAGE_SIZE = 5;
  const cacheValue =
    getStorage(constants.vendor.cache.supportHelpVendorCache) || {};
  const [pageNumber, setPageNumber] = useState(cacheValue?.pageNumber || 1);
  const [searchText, setSearchText] = useState(cacheValue?.searchText || null);
  const [apiSearchText, setApiSearchText] = useState(
    cacheValue?.searchText || null
  );
  const searchTextValue = apiSearchText === null ? "" : apiSearchText?.trim();
  const [selectedOption, setSelectedOption] = useState(
    cacheValue?.selectedOption || options[0].value
  );
  const [ticketListing, setTicketListing] = useState([]);
  const updateSelectedOptions = selectedOption ? [selectedOption] : [];
  const {
    data,
    isLoading,
    error: isError,
    isFetching,
  } = useTicketsListVendor(
    pageNumber,
    PAGE_SIZE,
    updateSelectedOptions,
    searchTextValue
  );
  useHandleApiError(isLoading, isFetching, isError);

  useEffect(() => {
    setStorage(constants.vendor.cache.supportHelpVendorCache, {
      pageNumber,
      searchText,
      selectedOption,
    });
  }, [pageNumber, searchText, selectedOption]);

  useEffect(() => {
    if (data?.data?.length) {
      setTicketListing(
        data?.data?.map((item) => {
          item.className = getClassNameVenodorTicket(item.ticketStatus);
          item.status = getStatusVenodorTicket(item.ticketStatus);
          item.orderNumber = item?.vendorOrder?.orderNo;
          return item;
        })
      );
    } else {
      setTicketListing([]);
    }
  }, [data]);

  const handleSearch = (event) => {
    const { value } = event.target;
    setSearchText(value);
    searchHandle(value);
  };

  const updatePageNumber = (number) => {
    setPageNumber(number);
  };

  const searchHandle = useCallback(
    debounce((searchValue) => {
      updatePageNumber(1);
      setApiSearchText(searchValue);
    }, 1000),
    []
  );

  const handleStatus = (item) => {
    setSelectedOption(item?.value);
    updatePageNumber(1);
  };

  return {
    isLoading,
    list: ticketListing,
    PAGE_SIZE,
    pageNumber,
    totalItems: data?.pagination?.totalItems,
    searchText,
    options,
    selectedOption,
    handleSearch,
    handleStatus,
    updatePageNumber,
  };
};
