import constants from "../../../../constants";
import useHandleApiError from "hooks/useHandleApiError";
import { useState, useEffect, useCallback } from "react";
import { useGetManageCustomerList } from "repositories/vendor-repository";
import { encodeId } from "utils";
import { debounce } from "lodash";
import useRemoveCache from "hooks/useRemoveCache";
import useScrollTopOnPageChange from "hooks/useScrollTopOnPageChange";

const CUSTOMER_PAGE_SIZE = 10;

const useManageCustomers = ({ t }) => {
  const options = [
    {
      value: "",
      label: t("vendorManagement.allCustomers"),
    },
    {
      value: true,
      label: "Bill Me Later  - Allowed",
    },
    {
      value: false,
      label: "Bill Me Later - Not Allowed",
    },
  ];

  let cacheData = sessionStorage.getItem(
    constants.vendor.cache.manageCustomersList
  );
  cacheData = cacheData ? JSON.parse(cacheData) : {};

  const [customersList, setCustomersList] = useState([]);
  const [totalItems, setTotalItems] = useState(1);
  const [currentPage, setCurrentPage] = useState(cacheData.currentPage || 1);
  const [apiSearchTerm, setApiSearchTerm] = useState(
    cacheData.apiSearchTerm || ""
  );
  const [selectedOption, setSelectedOption] = useState(
    cacheData.selectedOption || options[0]
  );

  const handleApiSearchTerm = useCallback(
    debounce(
      (value) => {
        setCurrentPage(1);
        setApiSearchTerm(value);
      },
      1500,
      { trailing: true }
    ),
    []
  );

  const handleSearchTerm = (e) => {
    const value = e.target.value;
    handleApiSearchTerm(value?.trim());
  };

  const {
    isLoading: loadingCustomersList,
    isFetching: fetchingCustomersList,
    data: customersData,
    error: customersListError,
  } = useGetManageCustomerList(
    currentPage,
    CUSTOMER_PAGE_SIZE,
    apiSearchTerm,
    selectedOption.value
  );
  useHandleApiError(
    loadingCustomersList,
    fetchingCustomersList,
    customersListError
  );
  useScrollTopOnPageChange(currentPage);

  const handlePageNumber = (page) => {
    setCurrentPage(page);
  };

  const handleSelectOption = (op) => {
    setCurrentPage(1);
    setSelectedOption(op);
  };

  useEffect(() => {
    if (customersData) {
      const newList = customersData.data.map((cus) => {
        const {
          id,
          name: officeName,
          owner,
          vendorCustomerBillingPreference,
        } = cus;
        const hasData = vendorCustomerBillingPreference?.[0];
        const isBillMeLater = hasData?.isBillMeLater;
        return {
          id,
          officeName: officeName || "-",
          accountOwnerName: `${owner.firstName || "-"} ${owner.lastName || ""}`,
          billMeLaterAccess: isBillMeLater ? "Yes" : "No",
          to: constants.routes.vendor.customerDetail.replace(
            ":id",
            encodeId(id)
          ),
        };
      });
      setCustomersList(newList);
      setTotalItems(customersData?.pagination?.totalItems || 1);
    }
  }, [customersData]);

  useEffect(() => {
    const cachePayload = {
      currentPage,
      apiSearchTerm,
      selectedOption,
    };
    sessionStorage.setItem(
      constants.vendor.cache.manageCustomersList,
      JSON.stringify(cachePayload)
    );
  }, [currentPage, apiSearchTerm, selectedOption]);

  useRemoveCache(
    [constants.routes.vendor.customerDetail],
    constants.vendor.cache.manageCustomersList
  );

  return {
    data: {
      loading: loadingCustomersList,
      customersList,
      currentPage,
      PAGE_SIZE: CUSTOMER_PAGE_SIZE,
      totalItems,
      options,
      selectedOption,
    },
    methods: {
      handlePageNumber,
      handleSearchTerm,
      handleSelectOption,
    },
  };
};

export default useManageCustomers;
