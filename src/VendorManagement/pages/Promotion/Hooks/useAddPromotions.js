import { useState, useEffect, useCallback } from "react";
import moment from "moment";
import useHandleApiError from "hooks/useHandleApiError";
import {
  useGetCustomersList,
  useGetLaunchedPromocodes,
  addPromotions,
} from "repositories/vendor-repository";
import { uniqBy, debounce, cloneDeep } from "lodash";
import { removeStorage } from "utils";
import constants from "../../../../constants";
import { toast } from "react-hot-toast";
import { useHistory } from "react-router-dom";
import { testRegexCheck } from "utils";

const CUSTOMER_PAGE_SIZE = 10;

export const useAddPromotions = ({ t }) => {
  const [formFields, setformFields] = useState({
    heading: "",
    launchDate: moment().toDate(),
    expiryDate: null,
    description: "",
    promoCode: "",
    isForAllCustomer: true,
    isPromoCodeActive: false,
  });
  const [errors, setErrors] = useState({});
  const {
    heading,
    expiryDate,
    description,
    launchDate,
    isForAllCustomer,
    promoCode,
    isPromoCodeActive,
  } = formFields;
  const [apiSearchTerm, setApiSearchTerm] = useState("");
  const [searchText, setSearchtext] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [promoCodePage, setPromoCodePage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showLoader, setShowLoader] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [promoTotalPages, setPromoTotalPages] = useState(1);
  const [customersList, setCustomersList] = useState([]);
  const [promoCodesList, setPromoCodesList] = useState([]);
  const [isSelectCustomerModalOpen, setSelectCustomerModalOpen] =
    useState(false);
  const pagesize = 20;
  const {
    isLoading: loading1,
    isFetching: fetching1,
    data: launchedData,
    error: error1,
  } = useGetLaunchedPromocodes(promoCodePage, pagesize, {
    cacheTime: 0,
  });
  const history = useHistory();

  useEffect(() => {
    if (launchedData?.data) {
      setPromoCodesList((prev) => [...prev, ...launchedData?.data]);
      setPromoTotalPages(launchedData.pagination.totalPages);
    }
  }, [launchedData]);
  useHandleApiError(loading1, fetching1, error1);

  const {
    isLoading: loadingCustomersList,
    isFetching: fetchingCustomersList,
    data: customersData,
    error: customersListError,
  } = useGetCustomersList(currentPage, CUSTOMER_PAGE_SIZE, apiSearchTerm, {
    cacheTime: 0,
  });
  useHandleApiError(
    loadingCustomersList,
    fetchingCustomersList,
    customersListError
  );

  const showNoRecord = !customersList?.length && !fetchingCustomersList;

  useEffect(() => {
    if (customersData) {
      const newList = customersData.data.map((cus) => {
        const { customer, office } = cus;
        const OfficeId = office.id;
        const UserId = customer.id;
        return {
          ...cus,
          OfficeId,
          UserId,
          isChecked: false,
          key: `${customer.id}-${office.id}`,
        };
      });
      setCustomersList((prev) => uniqBy([...prev, ...newList], "key"));
      setTotalPages(customersData?.pagination?.totalPages);
    }
  }, [customersData]);

  const errorsMessage = {
    heading: t("form.errors.emptyField", { field: t("heading") }),
    promoCode: t("form.errors.emptyField", { field: t("Promo Code") }),
    description: t("form.errors.emptyField", { field: t("description") }),
    expiryDate: t("form.errors.emptySelection", { field: t("expiry date") }),
    expiryDateSmaller: t("form.errors.promotionstartDate"),
    selectCustomer: t("vendorManagement.errors.selectCustomersError"),
  };

  const handleDatePicker = (dateName, dateObj) => {
    setformFields((prev) => ({ ...prev, ...dateObj }));
    if (
      dateName === "expiryDate" &&
      formatDate(launchDate) === formatDate(dateObj.expiryDate)
    ) {
      setErrors((prev) => {
        prev["expiryDate"] = errorsMessage["expiryDateSmaller"];
        return prev;
      });
    } else {
      setErrors((prev) => {
        delete prev["expiryDate"];
        return prev;
      });
    }
  };

  const handleInput = (event) => {
    const { name, value } = event.target;
    if (!testRegexCheck(value)) return;
    setformFields((prev) => ({ ...prev, [name]: value }));
    if (!value.trim()?.length) {
      errors[name] = errorsMessage[name];
    } else {
      delete errors[name];
    }
    setErrors({ ...errors });
  };

  const handleRadio = (item) => {
    setformFields((pre) => ({ ...pre, isForAllCustomer: item }));
  };

  const handleSelectCustomer = (e, cusData) => {
    if (e.target.checked) {
      setSelectedUsers((prev) => [...prev, cusData]);
    } else {
      setSelectedUsers((prev) =>
        prev.filter((item) => item.key !== cusData.key)
      );
    }

    setErrors((pre) => {
      delete pre["selectCustomer"];
      return pre;
    });
  };

  const closeModal = () => {
    if (searchText) {
      setApiSearchTerm("");
      setCurrentPage(1);
      setCustomersList([]);
      setSearchtext("");
      setSelectCustomerModalOpen(false);
    } else {
      setSelectCustomerModalOpen(false);
    }
  };

  const loadMore = () => {
    setCurrentPage((prev) => prev + 1);
  };

  //for custoemr search
  const handleApiSearchTerm = useCallback(
    debounce(
      (value, _apiSearchTerm) => {
        if (value != _apiSearchTerm) {
          setApiSearchTerm(value);
          setCurrentPage(1);
          setCustomersList([]);
        }
      },
      2000,
      { trailing: true }
    ),
    []
  );

  const handleSearchTerm = (e) => {
    const value = e.target.value;
    handleApiSearchTerm(value.trim(), apiSearchTerm);
  };

  const selectPromoCode = (value) => {
    setformFields((prev) => ({
      ...prev,
      promoCode: value,
    }));

    setErrors((pre) => {
      delete pre["promoCode"];
      return pre;
    });
  };

  const loadMoreData = () => {
    setPromoCodePage((prev) => prev + 1);
  };

  const formatDate = (date) => {
    return moment(date).format("YYYY-MM-DD");
  };

  const isValid = () => {
    const errorCopy = cloneDeep(errors);
    let isValidFormFields = true;

    if (!heading.trim()?.length) {
      errorCopy["heading"] = errorsMessage["heading"];
      isValidFormFields = false;
    }

    if (!description.trim()?.length) {
      errorCopy["description"] = errorsMessage["description"];
      isValidFormFields = false;
    }

    if (!expiryDate) {
      errorCopy["expiryDate"] = errorsMessage["expiryDate"];
      isValidFormFields = false;
    }

    if (!isForAllCustomer && !selectedUsers?.length) {
      errorCopy["selectCustomer"] = errorsMessage["selectCustomer"];
      isValidFormFields = false;
    }

    if (isPromoCodeActive && !promoCode) {
      errorCopy["promoCode"] = errorsMessage["promoCode"];
      isValidFormFields = false;
    }

    if (formatDate(launchDate) === formatDate(expiryDate)) {
      errorCopy["expiryDate"] = errorsMessage["expiryDateSmaller"];
      isValidFormFields = false;
    }

    setErrors(errorCopy);
    return isValidFormFields;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(isValid());
    if (!isValid()) return;
    setShowLoader(true);
    let CustomerForVendorPromotions = [];
    if (!isForAllCustomer) {
      CustomerForVendorPromotions = selectedUsers.map((item) => {
        return {
          UserId: item.UserId,
          OfficeId: item.OfficeId,
        };
      });
    }

    try {
      const params = {
        Heading: heading?.trim(),
        Description: description?.trim(),
        isForAllCustomer: isForAllCustomer,
        LaunchedDate: formatDate(launchDate),
        ExpireDate: formatDate(expiryDate),
        VendorPromoCodeId: promoCode?.id ? promoCode?.id : null,
        CustomerForVendorPromotions: CustomerForVendorPromotions,
      };
      let res = await addPromotions(params);
      setformFields({
        heading: "",
        launchDate: moment().toDate(),
        expiryDate: null,
        description: "",
        promoCode: "",
        isForAllCustomer: true,
        isPromoCodeActive: false,
      });
      removeStorage([
        constants.vendor.cache.promotionTabCache,
        constants.vendor.cache.promotionPaginationCache,
      ]);
      toast.success(res.message);
      history.push(constants.routes.vendor.promotion);
    } catch (err) {
      toast.error(err.message);
    }
    setShowLoader(false);
  };

  const promocodeHandler = () => {
    if (Array.isArray(promoCodesList) && promoCodesList?.length > 0) {
      setformFields((prev) => ({
        ...prev,
        isPromoCodeActive: !prev.isPromoCodeActive,
      }));
    } else {
      toast.error(t("noCodesAvailable"));
    }
  };

  const goBack = () => {
    history.push(constants.routes.vendor.promotion);
  };

  const isSelectedCustomer = (cusData) => {
    return selectedUsers.some((item) => item.key === cusData.key);
  };

  const saveModal = (arryOfSelection) => {
    setSelectedUsers(arryOfSelection);
    closeModal();
  };

  return {
    formFields,
    errors,
    customersList: customersList || [],
    isSelectCustomerModalOpen,
    selectedUserCount: selectedUsers?.length,
    hasMore: currentPage < totalPages,
    hasMorePromo: promoCodePage < promoTotalPages,
    isLoading: showLoader || loadingCustomersList || loading1,
    promoCodesList: promoCodesList || [],
    showNoRecord,
    selectedUsers,
    searchText,
    setSearchtext,
    isSelectedCustomer,
    promocodeHandler,
    loadMore,
    selectPromoCode,
    handleInput,
    handleSubmit,
    setSelectCustomerModalOpen,
    handleSelectCustomer,
    handleDatePicker,
    handleSearchTerm,
    closeModal,
    handleRadio,
    loadMoreData,
    saveModal,
    goBack,
  };
};
