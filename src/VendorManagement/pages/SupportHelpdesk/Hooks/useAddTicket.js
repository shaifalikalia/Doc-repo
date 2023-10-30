import { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash";
import { handleError, handleSuccess } from "utils";
import { useHistory } from "react-router-dom";
import constants from "../../../../constants";
import {
  useGetTicketType,
  addTicketType,
  useGetOrderListVendor,
} from "repositories/admin-vendor-repository";
import useHandleApiError from "hooks/useHandleApiError";

export const useAddTicket = ({ t }) => {
  const pageSize = 10;
  const [isLoading, setisLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);

  const [errors, setErrors] = useState({});
  const [formsValues, setFormsValues] = useState({
    ticketType: "",
    selectOrder: "",
    selectVendorId: "",
    description: "",
    assignOrder: false,
  });

  const [OrderListing, setOrderListing] = useState([]);
  const [selectOrderModal, setSelectOrderModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [apiSearchText, setApiSearchText] = useState("");
  const searchTextValue = apiSearchText === null ? "" : apiSearchText?.trim();

  const { ticketType, selectOrder, description, assignOrder, selectVendorId } =
    formsValues;
  const {
    data,
    isLoading: isLoader,
    error: isError,
    isFetching,
  } = useGetTicketType();
  const {
    data: orderList,
    isLoading: isLoadingOrderListing,
    error: isErrorOrderList,
    isFetching: isFetchingOrderlist,
  } = useGetOrderListVendor(pageSize, pageNumber, searchTextValue);
  useHandleApiError(
    isLoadingOrderListing,
    isFetchingOrderlist,
    isErrorOrderList
  );
  useHandleApiError(isLoader, isFetching, isError);
  const showNoRecord = !OrderListing?.length && !isFetchingOrderlist;

  const ticketTypeList = data?.data || [];
  const history = useHistory();

  useEffect(() => {
    if (orderList?.data && Array.isArray(orderList?.data)) {
      setOrderListing((prev) => [...prev, ...orderList?.data]);
    }
  }, [orderList]);

  const goBack = () => [history.push(constants.routes.vendor.supportHelpdesk)];

  const handleChangeSelect = (event) => {
    const { value, name } = event.target;
    setFormsValues((pre) => ({ ...pre, [name]: value }));
    setErrors((pre) => {
      delete pre[name];
      return { ...pre };
    });
  };

  const handleChangeInput = (event) => {
    const { value, name } = event.target;
    setFormsValues((pre) => ({ ...pre, [name]: value }));
    setErrors((pre) => {
      if (value?.trim()?.length) {
        delete pre[name];
      } else {
        pre[name] = t("form.errors.emptyField", {
          field: t("vendorManagement.description"),
        });
      }
      return { ...pre };
    });
  };

  const isValid = () => {
    let formValid = true;
    const errorCopy = JSON.parse(JSON.stringify(errors));
    if (!ticketType) {
      errorCopy["ticketType"] = t("form.errors.emptyField", {
        field: t("vendorManagement.ticketType"),
      });
      formValid = false;
    }

    if (!selectOrder && assignOrder) {
      errorCopy["selectOrder"] = t("form.errors.emptySelection", {
        field: "Order",
      });
      formValid = false;
    }

    if (!description && !description?.trim()?.length) {
      errorCopy["description"] = t("form.errors.emptyField", {
        field: t("vendorManagement.description"),
      });
      formValid = false;
    }

    setErrors((prev) => ({ ...prev, ...errorCopy }));
    return formValid;
  };

  const handleSubmit = async () => {
    try {
      if (!isValid()) return;
      setisLoading(true);
      let params = {
        SupportAndHelpDeskTicketTypeId: ticketType,
        VendorOrderId: selectVendorId,
        Description: description,
      };
      if (!assignOrder) {
        delete params.VendorOrderId;
      }

      let res = await addTicketType(params);
      handleSuccess(res.message);
      goBack();
    } catch (err) {
      handleError(err);
    }
    setisLoading(false);
  };

  const goToNextPage = () => {
    setPageNumber((prev) => prev + 1);
  };

  const isOpenSelectOrder = () => {
    setSelectOrderModal(true);
  };

  const isCloseSelectOrder = () => {
    if (searchText) {
      setSelectOrderModal(false);
      setPageNumber(1);
      setApiSearchText("");
      setSearchText("");
      setOrderListing([]);
    } else {
      setSelectOrderModal(false);
    }
  };

  const handleSearch = (event) => {
    const { value } = event.target;
    setSearchText(value);
    searchHandle(value);
  };

  const searchHandle = useCallback(
    debounce((searchValue) => {
      setPageNumber(1);
      setApiSearchText(searchValue);
      setOrderListing([]);
    }, 1000),
    []
  );

  const closeModelClickOnSaveBtn = () => {
    setSelectOrderModal(false);
    setPageNumber(1);
    setApiSearchText("");
    setSearchText("");
    setOrderListing([]);
  };

  return {
    isLoading,
    formsValues,
    errors,
    ticketTypeList,
    orderList: OrderListing || [],
    hasMore: OrderListing?.length < orderList?.pagination?.totalItems,
    selectOrderModalOpen: selectOrderModal,
    searchText,
    showNoRecord,
    handleSearch,
    goBack,
    goToNextPage,
    handleSubmit,
    handleChangeInput,
    handleChangeSelect,
    setFormsValues,
    isOpenSelectOrder,
    isCloseSelectOrder,
    closeModelClickOnSaveBtn,
  };
};
