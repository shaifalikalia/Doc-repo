import { useState, useCallback, useEffect } from "react";
import constants from "../../../../constants";
import moment from "moment/moment";
import { setStorage, getStorage } from "utils";
import { useGetOrderList } from "repositories/vendor-repository";
import { debounce } from "lodash";
import useHandleApiError from "hooks/useHandleApiError";
import useRemoveCache from "hooks/useRemoveCache";

export const useManageOrders = ({ status, PAGE_SIZE }) => {
  const cacheValue = getStorage(constants.vendor.cache.manageOrderslisting);
  const [pageNumber, setPageNumber] = useState(cacheValue?.pageNumber || 1);
  const [searchText, setSearchText] = useState(cacheValue?.searchText || null);
  const [apiSearchText, setApiSearchText] = useState(
    cacheValue?.searchText || null
  );

  const [date, setDate] = useState({
    from: cacheValue?.dateFrom
      ? new Date(cacheValue?.dateFrom)
      : new Date(moment().startOf("year").format("YYYY-MM-DD")),
    to: cacheValue?.dateTo ? new Date(cacheValue?.dateTo) : new Date(),
  });
  const startDate = moment(date.from).format("YYYY-MM-DD");
  const endDate = moment(date.to).format("YYYY-MM-DD");
  const searchInputText = apiSearchText ? apiSearchText : "";
  let orderStatus =
    status === constants.orderStatus.all ||
    status === constants.orderStatus.UnPaid
      ? ""
      : status;
  let isBillMeLaterAndUnPaid =
    status === constants.orderStatus.UnPaid ? true : false;

  const {
    data,
    error: isError,
    isLoading,
    isFetching,
    refetch,
  } = useGetOrderList(
    pageNumber,
    PAGE_SIZE,
    startDate,
    endDate,
    searchInputText,
    orderStatus,
    isBillMeLaterAndUnPaid
  );
  useHandleApiError(isLoading, isFetching, isError);
  useRemoveCache(
    [constants.routes.vendor.orderDetail],
    constants.vendor.cache.manageOrderslisting
  );

  useEffect(() => {
    setStorage(constants.vendor.cache.manageOrderslisting, {
      dateFrom: date.from,
      dateTo: date.to,
      searchText: searchText || null,
      pageNumber: pageNumber,
      activeTab: status,
    });
  }, [date, pageNumber, searchText, status]);

  useEffect(() => {
    // when status change and reload  to avoid multiply api calls
    if (pageNumber !== 1 && status !== cacheValue?.activeTab) {
      setPageNumber(1);
    }
    if (pageNumber === 1) {
      refetch();
    }
  }, [status]);

  const handleSearchText = useCallback(
    debounce((searchTextValue) => {
      setPageNumber(1);
      setApiSearchText(searchTextValue);
    }, 1000),
    []
  );

  const updatePageNumber = (page) => {
    setPageNumber(page);
  };

  const changeDate = (obj) => {
    setDate((prev) => ({ ...prev, ...obj }));
    updatePageNumber(1);
  };

  const handleChange = (event) => {
    const { value } = event.target;
    setSearchText(value);
    handleSearchText(value);
  };

  return {
    pageNumber,
    searchText,
    date,
    isLoading: isLoading || isFetching,
    orderListing: data?.data || [],
    totalItems: data?.pagination?.totalItems,
    handleChange,
    changeDate,
    updatePageNumber,
  };
};
