import useHandleApiError from "hooks/useHandleApiError";
import useRemoveCache from "hooks/useRemoveCache";
import { uniqBy } from "lodash";
import moment from "moment";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetOfficeCustomerList } from "repositories/vendor-repository";
import { decodeId } from "utils";
import constants from "../../../../constants";

const CUSTOMER_PAGE_SIZE = 8;

const useOrderHistoryFilter = () => {
  const { id } = useParams();
  const officeId = decodeId(id);

  let cacheData = sessionStorage.getItem(
    constants.vendor.cache.orderHistoryFilter
  );
  cacheData = cacheData ? JSON.parse(cacheData) : {};

  const orderStatusOptions = constants.vendor.enums.orderStatus.list;
  const [selectedOrderStatus, setOrderStatus] = useState(
    cacheData.selectedOrderStatus || orderStatusOptions[0]
  );

  const paymentMethodsOptions = constants.vendor.enums.paymentMethod.list;
  const [selectedPaymentMethod, setPaymentMethod] = useState(
    cacheData.selectedPaymentMethod || paymentMethodsOptions[0]
  );

  const paymentStatusOptions = constants.vendor.enums.paymentStatus.list;
  const [selectedPaymentStatus, setPaymentStatus] = useState(
    cacheData.selectedPaymentStatus || paymentStatusOptions[0]
  );

  const [fromDate, setFromDate] = useState(
    cacheData.fromDate
      ? new Date(cacheData.fromDate)
      : moment().startOf("year").toDate()
  );
  const [toDate, setToDate] = useState(
    cacheData.toDate ? new Date(cacheData.toDate) : new Date()
  );

  const [customersList, setCustomersList] = useState([
    { id: null, name: "All Customers" },
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedCustomer, setCustomer] = useState(
    cacheData.selectedCustomer || { id: null, name: "All Customers" }
  );

  const [orderListPageNumber, setOrderListPageNumber] = useState(
    cacheData.orderListPageNumber || 1
  );

  const selectOption = (optionSetterFunction) => {
    setOrderListPageNumber(1);
    optionSetterFunction?.();
  };

  const loadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const {
    isLoading: loadingCustomersList,
    isFetching: fetchingCustomersList,
    data: customersData,
    error: customersListError,
  } = useGetOfficeCustomerList(officeId, currentPage, CUSTOMER_PAGE_SIZE, {
    enabled: !!officeId,
  });
  useHandleApiError(
    loadingCustomersList,
    fetchingCustomersList,
    customersListError
  );

  useEffect(() => {
    if (customersData) {
      const newList = customersData.data.map((cus) => {
        const { id: customerId, firstName, lastName } = cus;
        return {
          id: customerId,
          name: `${firstName} ${lastName}`,
        };
      });
      setCustomersList((prev) => uniqBy([...prev, ...newList], "id"));
      setTotalPages(customersData?.pagination?.totalPages);
    }
  }, [customersData]);

  useEffect(() => {
    const cachePayload = {
      selectedOrderStatus,
      selectedPaymentMethod,
      selectedPaymentStatus,
      selectedCustomer,
      fromDate,
      toDate,
      orderListPageNumber,
    };
    sessionStorage.setItem(
      constants.vendor.cache.orderHistoryFilter,
      JSON.stringify(cachePayload)
    );
  }, [
    selectedOrderStatus,
    selectedPaymentMethod,
    selectedPaymentStatus,
    selectedCustomer,
    fromDate,
    toDate,
    orderListPageNumber,
  ]);

  useRemoveCache(
    [constants.routes.vendor.orderDetail],
    constants.vendor.cache.orderHistoryFilter
  );

  return {
    data: {
      orderStatusOptions,
      paymentMethodsOptions,
      paymentStatusOptions,
      customersList,
      selectedOrderStatus,
      selectedPaymentMethod,
      selectedPaymentStatus,
      selectedCustomer,
      hasMore: currentPage < totalPages,
      fromDate,
      toDate,
      orderListPage: {
        orderListPageNumber,
        setOrderListPageNumber,
      },
    },
    methods: {
      setOrderStatus,
      setPaymentMethod,
      setPaymentStatus,
      setCustomer,
      loadMore,
      setFromDate,
      setToDate,
      selectOption,
    },
  };
};

export default useOrderHistoryFilter;
