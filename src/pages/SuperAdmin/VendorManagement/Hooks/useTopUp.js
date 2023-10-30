import { useState, useEffect, useCallback } from "react";
import constants from "../../../../constants";
import { getStorage, setStorage, handleError, handleSuccess } from "utils";
import useHandleApiError from "hooks/useHandleApiError";
import { debounce } from "lodash";
import {
  useToGetTopUpPromotion,
  addTopUpPromotions,
  editTopUpPromotions,
  statusChangeTopPromotions,
} from "repositories/admin-vendor-repository";

const useTopUp = ({ t }) => {
  const options = [
    {
      value: 0,
      apiValue: "",
      label: t("superAdminTopUp.allPromotions"),
    },
    {
      value: 1,
      label: "Active",
      apiValue: true,
    },
    {
      value: 2,
      label: "Inactive",
      apiValue: false,
    },
  ];

  const modelType = {
    ADD: 1,
    EDIT: 1,
  };

  const PAGE_SIZE = 3;
  const cacheValue = getStorage(constants.vendor.cache.superAdminTopUp) || {};
  const [openModel, setOpenModel] = useState({
    isOpen: false,
    type: null,
  });

  const [changeStatusModal, setChangeStatusModal] = useState({
    isOpen: false,
  });

  const [pageNumber, setPageNumber] = useState(cacheValue?.pageNumber || 1);
  const [showLoader, setShowLoader] = useState(false);
  const [searchText, setSearchText] = useState(cacheValue?.searchText || null);
  const [apiSearchText, setApiSearchText] = useState(
    cacheValue?.searchText || null
  );
  const [selectedOption, setSelectedOption] = useState(
    cacheValue?.selectedOption || options[0]
  );

  let status = selectedOption.apiValue;
  const searchTextValue = apiSearchText === null ? "" : apiSearchText?.trim();
  const {
    data,
    isLoading,
    error: isError,
    isFetching,
    refetch,
  } = useToGetTopUpPromotion(PAGE_SIZE, pageNumber, searchTextValue, status);
  useHandleApiError(isLoading, isFetching, isError);

  useEffect(() => {
    setStorage(constants.vendor.cache.superAdminTopUp, {
      pageNumber,
      searchText,
      selectedOption,
    });
  }, [pageNumber, searchText, selectedOption]);

  const handleSearch = (event) => {
    const { value } = event.target;
    setSearchText(value);
    searchHandle(value);
  };
  const searchHandle = useCallback(
    debounce((searchValue) => {
      setPageNumber(1);
      setApiSearchText(searchValue);
    }, 1000),
    []
  );

  const updatePageNumber = (number) => {
    setPageNumber(number);
  };

  const handleStatus = (item) => {
    setSelectedOption(item);
    updatePageNumber(1);
  };

  const submitPromotions = async (values, topUpId) => {
    try {
      setShowLoader(true);
      const { name, noofPromotions, price } = values;
      let body = {
        Name: name.trim(),
        NumberOfPromotions: +noofPromotions,
        Price: +price,
        TopUpPromotionId: topUpId,
      };
      let res = topUpId
        ? await editTopUpPromotions(body)
        : await addTopUpPromotions(body);
      if (topUpId || pageNumber === 1) {
        refetch();
      } else {
        setPageNumber(1);
      }
      handleSuccess(res.message);
      setOpenModel({ isOpen: false });
    } catch (err) {
      handleError(err);
    }
    setShowLoader(false);
  };

  const openStatusChangeModel = (item) => {
    setChangeStatusModal({ isOpen: true, ...item });
  };
  const closeStausModel = () => {
    setChangeStatusModal({ isOpen: false });
  };

  const statusChange = async () => {
    try {
      if (!changeStatusModal?.id) return;
      setShowLoader(true);
      let res = await statusChangeTopPromotions({
        id: changeStatusModal?.id,
        status: !changeStatusModal?.isActive,
      });

      if (data?.data?.length === 1) {
        setPageNumber(1);
      } else {
        refetch();
      }

      handleSuccess(res.message);
      closeStausModel();
    } catch (err) {
      handleError(err);
    }
    setShowLoader(false);
  };

  return {
    data: {
      isLoading: isLoading || showLoader,
      PAGE_SIZE,
      pageNumber,
      totalItems: data?.pagination?.totalItems || 0,
      searchText,
      options,
      selectedOption,
      promotionList: data?.data || [],
      openModel,
      modelType,
      statusChangeIsOpen: changeStatusModal.isOpen,
      setOpenModel,
      statusTitle: changeStatusModal?.isActive
        ? t("Deactivate")
        : t("Activate"),
      statusDescription: changeStatusModal?.isActive
        ? t("vendorManagement.deactivateTopUp")
        : t("vendorManagement.activateTopUp"),
    },
    methods: {
      handleSearch,
      handleStatus,
      updatePageNumber,
      submitPromotions,
      openStatusChangeModel,
      closeStausModel,
      statusChange,
    },
  };
};

export default useTopUp;
