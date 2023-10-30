import useHandleApiError from "hooks/useHandleApiError";
import { uniqBy, debounce, find } from "lodash";
import moment from "moment/moment";
import { useEffect, useCallback, useState, useMemo } from "react";
import { useHistory } from "react-router-dom";
import {
  generatePromocode,
  useAddPromocode,
  useGetCustomersList,
} from "repositories/vendor-repository";
import { handleError, handleSuccess } from "utils";
import constants from "../../../../constants";

const CUSTOMER_PAGE_SIZE = 20;

const useAddPromoCode = (dependencies) => {
  const { t } = dependencies;
  const history = useHistory();

  const onBack = () => {
    history.push(constants.routes.vendor.promoCodes);
  };

  const [isCustomerModalOpen, setCustomerModalOpen] = useState(false);
  const [codeGenerating, setCodeGenerating] = useState(false);
  const [isSendToAll, setIsSendToAll] = useState(true);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState("");
  const minDate = useMemo(() => {
    const today = new Date();
    const tomorrow = today.setDate(today.getDate() + 1);
    return tomorrow;
  }, []);
  const [expiryDate, setExpiryDate] = useState(minDate);

  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [prevSelCus, setPrevSelCus] = useState([]);

  const [errors, setErrors] = useState({});

  const [apiSearchTerm, setApiSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [customersList, setCustomersList] = useState([]);

  const loadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  //Api calls
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
  const addPromoCodeMutation = useAddPromocode();
  const { isLoading: addingPromocode } = addPromoCodeMutation;

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
          key: `${customer.id}-${office.id}`,
        };
      });
      setCustomersList((prev) => uniqBy([...prev, ...newList], "key"));
      setTotalPages(customersData?.pagination?.totalPages);
    }
  }, [customersData]);
  //Methods
  const radioHandler = (value) => {
    setIsSendToAll(value);
    if (value) {
      setErrors((prev) => ({
        ...prev,
        selectedCustomers: "",
      }));
    }
  };

  const openCustomerModal = () => {
    setPrevSelCus(selectedCustomers);
    setCustomerModalOpen(true);
  };

  const closeCustomerModal = () => {
    if (currentPage > 1 || apiSearchTerm) {
      setCustomersList([]);
      setCurrentPage(1);
      setApiSearchTerm("");
    }
    setCustomerModalOpen(false);
    setSelectedCustomers(prevSelCus);
  };

  //promocode
  const handlePromocode = (e) => {
    const value = e.target.value;
    if (!/^[\w\-\s]*$/.test(value)) return;
    if (!value.trim()) {
      setErrors((prev) => ({
        ...prev,
        promoCode: t("vendorManagement.errors.errorMessage"),
      }));
    } else {
      setErrors((prev) => ({ ...prev, promoCode: "" }));
    }
    setPromoCode(value?.toUpperCase());
  };
  const handleGenerateCode = async () => {
    setCodeGenerating(true);
    try {
      const code = await generatePromocode();
      setPromoCode(code);
      setErrors((prev) => ({ ...prev, promoCode: "" }));
    } catch (err) {
      handleError(err);
    }
    setCodeGenerating(false);
  };

  //For discounts
  const parseDiscount = (newValue, oldValue) => {
    if (!newValue) return "";
    //strip white spaces
    const percentWithoutSpaces = newValue.replace(/\s/g, "");
    // strip all chars ohter than digits and .
    const percentWithDigitsOnly = percentWithoutSpaces.replace(/[^\d.]/g, "");
    const isValidPercent = /(^\d{1,3}\.\d{0,2}$)|(^\d{0,3}$)/.test(
      percentWithDigitsOnly
    );
    if (isValidPercent && +percentWithDigitsOnly <= 100) {
      return percentWithDigitsOnly;
    }
    return oldValue;
  };

  const handleDiscountKeyDown = (e) => {
    ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();
  };

  const handleDiscount = (e) => {
    const value = e.target.value;
    if (!value.trim()) {
      setErrors((prev) => ({
        ...prev,
        discount: t("vendorManagement.errors.errorMessage"),
      }));
    } else {
      setErrors((prev) => ({ ...prev, discount: "" }));
    }
    setDiscount((prev) => parseDiscount(value, prev));
  };

  //For expiry date
  const onDateSelect = (date) => {
    setExpiryDate(date);
  };

  //for custoemr search
  const handleApiSearchTerm = useCallback(
    debounce(
      (value, _apiSearchTerm) => {
        if (value != _apiSearchTerm) {
          setCustomersList([]);
          setApiSearchTerm(value);
          setCurrentPage(1);
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

  //for customers selection
  const isCustomerSelected = (customer) => {
    const { key } = customer;
    return !!find(selectedCustomers, { key });
  };

  const handleSelectCustomer = (e, customer) => {
    const checked = e.target.checked;
    const { key } = customer;
    if (checked) {
      setSelectedCustomers((prev) => [...prev, customer]);
      setErrors((prev) => ({
        ...prev,
        selectedCustomers: "",
      }));
    } else {
      const updatedList = selectedCustomers.filter((cus) => cus.key !== key);
      setSelectedCustomers(updatedList);
    }
  };

  const handleSaveCustomers = () => {
    if (!selectedCustomers.length) {
      setErrors((prev) => ({
        ...prev,
        selectedCustomers: t("vendorManagement.errors.selectCustomersError"),
      }));
    } else {
      if (currentPage > 1 || apiSearchTerm) {
        setCustomersList([]);
        setCurrentPage(1);
        setApiSearchTerm("");
      }
      setCustomerModalOpen(false);
    }
  };

  // save form
  const isValidForm = () => {
    let isValid = true;
    if (!promoCode.trim()) {
      isValid = false;
      setErrors((prev) => ({
        ...prev,
        promoCode: t("vendorManagement.errors.errorMessage"),
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        promoCode: "",
      }));
    }
    if (!discount.trim()) {
      isValid = false;
      setErrors((prev) => ({
        ...prev,
        discount: t("vendorManagement.errors.errorMessage"),
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        discount: "",
      }));
    }
    if (!isSendToAll && selectedCustomers.length < 1) {
      isValid = false;
      setErrors((prev) => ({
        ...prev,
        selectedCustomers: t("vendorManagement.errors.selectCustomersError"),
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        selectedCustomers: "",
      }));
    }
    return isValid;
  };

  const handleAddPromocode = async (e) => {
    e.preventDefault();
    if (isValidForm()) {
      try {
        const body = {
          PromoCode: promoCode,
          ExpiryDate: moment(expiryDate).format("YYYY-MM-DD"),
          DiscountAllowed: +discount,
          IsForAllCustomer: isSendToAll,
          CustomerForVendorPromoCodes: isSendToAll
            ? []
            : selectedCustomers.map(({ UserId, OfficeId }) => ({
                UserId,
                OfficeId,
              })),
        };
        await addPromoCodeMutation.mutateAsync(body);
        sessionStorage.removeItem(constants.vendor.cache.promoCodesList);
        handleSuccess(t("vendorManagement.promoCodesModule.promoCodeAddSuc"));
        onBack();
      } catch (err) {
        handleError(err);
      }
    }
  };
  return {
    data: {
      minDate,
      isCustomerModalOpen,
      isSendToAll,
      promoCode,
      discount,
      expiryDate,
      customersList,
      selectedCustomers,
      hasMore: currentPage < totalPages,
      errors,
      loading: codeGenerating || loadingCustomersList || addingPromocode,
    },
    methods: {
      radioHandler,
      openCustomerModal,
      closeCustomerModal,
      handleGenerateCode,
      handlePromocode,
      handleDiscount,
      handleDiscountKeyDown,
      onDateSelect,
      handleSearchTerm,
      loadMore,
      isCustomerSelected,
      handleSelectCustomer,
      handleAddPromocode,
      onBack,
      handleSaveCustomers,
    },
  };
};

export default useAddPromoCode;
