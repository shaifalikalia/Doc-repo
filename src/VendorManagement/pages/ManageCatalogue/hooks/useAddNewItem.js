import { useState, useEffect } from "react";
import produce from "immer";
import {
  sortAlphabetically,
  inBytes,
  handleError,
  scrollToError,
  decodeId,
  getBlobnameFromUrl,
  testRegexCheck,
  scrollToErrorInModal,
  testRegexCheckDescription,
} from "utils";
import constants from "../../../../constants";
import { useCategory, useGetTaxes } from "repositories/admin-vendor-repository";
import { useGetProviceList } from "repositories/office-repository";
import {
  useAddProduct,
  useGetProductDetails,
  useUpdateProduct,
} from "repositories/vendor-repository";
import toast from "react-hot-toast";
import { uniqBy, findIndex } from "lodash";
import useUploadService from "hooks/useUploadService";
import useQueryParam from "hooks/useQueryParam";
import useHandleApiError from "hooks/useHandleApiError";

const CANADA_ID = 1;
const TAXES_LIST_PAGE_SIZE = 60;
const PRODUCT_TYPES_PAGE_SIZE = 60;

const useAddNewItem = (dependencies = {}) => {
  const { t, history } = dependencies;

  let isEdit = useQueryParam("isEdit");
  isEdit = isEdit === "true" ? true : false;
  let productId = useQueryParam("id");
  productId = productId ? decodeId(productId) : null;

  const onBack = () => {
    if (isEdit) {
      history.goBack();
    } else {
      history.push(constants.routes.vendor.manageCatalogue);
    }
  };

  ////////STATES///////////////////
  //Modal states
  const [tooltipReminderOpen, setTooltipReminderOpen] = useState(false);
  const [isSetPriceModalOpen, setIsSetPriceModalOpen] = useState(false);
  const [isSetTaxPriceModalOpen, setIsSetTaxPriceModalOpen] = useState(false);
  const [isLocationDeliveryModalOpen, setIsLocationDeliveryModalOpen] =
    useState(false);
  //Input data state
  const initialData = {
    productId: "",
    productName: "",
    productType: null,
    minQuantityOrder: 1,
    maxQuantityOrder: 1,
    totalQuantityInInventory: 1,
    quantityShortageReminder: 1,
    productDescription: "",
    priceDetails: {
      unitPrice: "",
      samePriceForAll: true,
      locationPrices: [],
      error: "",
      saved: false,
    },
    taxDetails: {
      saved: false,
      selectedTax: null,
      error: "",
    },
    deliveryDetails: {
      locations: [],
      saved: false,
    },
    vipDiscount: "",
    normalDiscount: "",
    productImage: {
      image: null,
      imageUrl: "",
    },
    errors: {},
  };
  const [inputData, setInputData] = useState(initialData);
  //This data is used to reset the modal data to previous state - when closed without saving
  const [previousDetails, setPreviousDetails] = useState(null);

  //Other data
  const [productTypeOptions, setProductTypeOptions] = useState([]);
  const [totalProductTypePages, setTotalProductTypePages] = useState(1);
  const [currentProductTypePage, setCurrentProductTypePage] = useState(1);
  const loadMoreProductTypes = () => {
    if (currentProductTypePage < totalProductTypePages) {
      setCurrentProductTypePage((prev) => prev + 1);
    }
  };
  const [taxList, setTaxList] = useState([]);
  const [totalTaxPages, setTotalTaxPages] = useState(1);
  const [currentTaxPage, setCurrentTaxPage] = useState(1);
  const loadMoreTax = () => {
    if (currentTaxPage < totalTaxPages) {
      setCurrentTaxPage((prev) => prev + 1);
    }
  };

  ////////////aPI CALLS//////////////////
  const {
    isLoading: loadingProductDetail,
    isFetching: fetchingProductDetail,
    data: productDetail,
    error: productDetailError,
  } = useGetProductDetails(productId, { enabled: isEdit });
  useHandleApiError(
    loadingProductDetail,
    fetchingProductDetail,
    productDetailError
  );
  const {
    isLoading: loadingProductType,
    isFetching: fetchingProductType,
    data: productTypes,
    error: productTypesError,
  } = useCategory(PRODUCT_TYPES_PAGE_SIZE, currentProductTypePage);
  useHandleApiError(loadingProductType, fetchingProductType, productTypesError);
  const {
    isLoading: loadingProvinceList,
    isFetching: fetchingProvinceList,
    data: provincesList,
    error: provincesListError,
  } = useGetProviceList(CANADA_ID);
  useHandleApiError(
    loadingProvinceList,
    fetchingProvinceList,
    provincesListError
  );
  const {
    isLoading: loadingTaxList,
    isFetching: fetchingTaxList,
    data: taxData,
    error: taxListError,
  } = useGetTaxes(TAXES_LIST_PAGE_SIZE, currentTaxPage);
  useHandleApiError(loadingTaxList, fetchingTaxList, taxListError);
  const addProductMutation = useAddProduct();
  const { isLoading: addingProduct } = addProductMutation;
  const updateProductMutation = useUpdateProduct();
  const { isLoading: updatingProduct } = updateProductMutation;

  const createLocationPricesArray = (locations) => {
    if (!locations || !locations.length) return [];
    const sortedLocations = sortAlphabetically(locations, "name");
    return sortedLocations.map((location) => ({
      unitPrice: "",
      error: "",
      ...location,
    }));
  };
  const createDeliveryLocationsArray = (locations) => {
    if (!locations || !locations.length) return [];
    const sortedLocations = sortAlphabetically(locations, "name");
    return sortedLocations.map((location) => ({
      selected: false,
      from: "",
      fromError: "",
      to: "",
      toError: "",
      ...location,
    }));
  };

  ///TO CREATE THE INITAIL DATA FOR EDITING PURPOSES
  const createInitialData = (prodDetails) => {
    const convertLocationData = (array) => {
      return array.reduce((acc, locationData) => {
        const { stateId } = locationData;
        return {
          ...acc,
          [stateId]: locationData,
        };
      }, {});
    };
    const getInitialPricingDetails = () => {
      let isDataComplete = true;
      const toReturn = {
        error: "",
      };
      if (prodDetails.isPriceSameForAllState) {
        const priceDetails = prodDetails.cataloguePriceForState[0];
        toReturn.unitPrice = priceDetails?.price;
        toReturn.samePriceForAll = true;
        toReturn.locationPrices = createLocationPricesArray(provincesList);
        isDataComplete = priceDetails?.price ? true : false;
      } else {
        const dbData = convertLocationData(
          prodDetails.cataloguePriceForState || []
        );
        toReturn.samePriceForAll = false;
        toReturn.unitPrice = "";
        toReturn.locationPrices = createLocationPricesArray(provincesList).map(
          (location) => {
            const { id: stateId } = location;
            const locationData = dbData[stateId];
            if (locationData) {
              isDataComplete = !locationData.price ? false : isDataComplete;
              return {
                ...location,
                unitPrice: locationData?.price,
              };
            }
            isDataComplete = false;
            return location;
          }
        );
      }
      toReturn.saved = isDataComplete;
      return toReturn;
    };
    const getInitialDeliveryDetails = () => {
      const dbData = convertLocationData(
        prodDetails.catalogueDeliveryTimeForState || []
      );
      const hasAtLeastOneState = !!Object.keys(dbData).length;
      return {
        saved: hasAtLeastOneState ? true : false,
        locations: createDeliveryLocationsArray(provincesList).map(
          (location) => {
            const { id: stateId } = location;
            const locationData = dbData[stateId];
            if (locationData) {
              return {
                ...location,
                selected: true,
                from: locationData?.fromDays,
                to: locationData?.toDays,
              };
            }
            return location;
          }
        ),
      };
    };
    const initialData = {
      productId: prodDetails.productId,
      productName: prodDetails.productName,
      productType: prodDetails.vendorCatalogueCategory,
      minQuantityOrder: prodDetails.minimumQuantity,
      maxQuantityOrder: prodDetails.maximumQuantity,
      totalQuantityInInventory: prodDetails.totalQuantity,
      quantityShortageReminder: prodDetails.quantityShortageReminder,
      productDescription: prodDetails.productDescription,
      priceDetails: getInitialPricingDetails(),
      taxDetails: {
        saved: productDetail.vendorTax ? true : false,
        selectedTax: productDetail.vendorTax,
        error: "",
      },
      deliveryDetails: getInitialDeliveryDetails(),
      vipDiscount: prodDetails.vipCustomerDiscount,
      normalDiscount: prodDetails.normalCustomerDiscount,
      productImage: {
        image: null,
        imageUrl: prodDetails.image,
      },
      errors: {},
    };
    setInputData(initialData);
    const editingValue = sessionStorage.getItem(
      constants.vendor.cache.editingValue
    );
    if (editingValue === "price") {
      setPreviousDetails(getInitialPricingDetails());
      const el = document.getElementById("price-details");
      scroll(el, () => setIsSetPriceModalOpen(true));
    }
    if (editingValue === "location") {
      setPreviousDetails(getInitialDeliveryDetails());
      const el = document.getElementById("location-details");
      scroll(el, () => setIsLocationDeliveryModalOpen(true));
    }
    if (editingValue === "discount") {
      const el = document.getElementById("discount-details");
      el?.focus?.({ preventScroll: true });
      scroll(el);
    }
  };

  function scroll(el, callback) {
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "start",
      });
      sessionStorage.removeItem(constants.vendor.cache.editingValue);
      if (typeof callback === "function") {
        setTimeout(() => {
          callback();
        }, 700);
      }
    }
  }

  useEffect(() => {
    if (isEdit && productDetail && provincesList) {
      createInitialData(productDetail);
    }
  }, [productDetail, provincesList]);

  /*****************************************************/
  useEffect(() => {
    if (productTypes) {
      const newTypes = productTypes.data;
      setProductTypeOptions((prevTypes) =>
        uniqBy([...prevTypes, ...newTypes], "name")
      );
      setInputData(
        produce((data) => {
          if (!isEdit && !data.productType) {
            data.productType = newTypes[0];
          }
        })
      );
      setTotalProductTypePages(productTypes?.pagination?.totalPages);
    }
  }, [productTypes]);

  useEffect(() => {
    if (!isEdit && provincesList) {
      setInputData(
        produce((data) => {
          data.priceDetails.locationPrices =
            createLocationPricesArray(provincesList);
          data.deliveryDetails.locations =
            createDeliveryLocationsArray(provincesList);
        })
      );
    }
  }, [provincesList]);

  useEffect(() => {
    if (taxData) {
      const newTaxes = taxData.data;
      setTaxList((prevTaxes) => uniqBy([...prevTaxes, ...newTaxes], "id"));
      setInputData(
        produce((data) => {
          if (!isEdit && !data.taxDetails.selectedTax) {
            data.taxDetails.selectedTax = newTaxes[0];
            data.taxDetails.saved = true;
          }
        })
      );
      setTotalTaxPages(taxData?.pagination?.totalPages);
    }
  }, [taxData]);

  //Methods to handle inputs
  const handleProductId = (e) => {
    const value = e.target.value;
    if (!testRegexCheck(value)) return;
    setInputData(
      produce((data) => {
        delete data.errors.productId;
        data.productId = value;
        if (!value.trim()) {
          data.errors.productId = t("vendorManagement.errors.errorMessage");
        }
      })
    );
  };
  const handleProductName = (e) => {
    const value = e.target.value;
    if (!testRegexCheck(value)) return;
    setInputData(
      produce((data) => {
        delete data.errors.productName;
        data.productName = value;
        if (!value.trim()) {
          data.errors.productName = t("vendorManagement.errors.errorMessage");
        }
      })
    );
  };
  //For product type/category
  const handleProductType = (type) => {
    setInputData(
      produce((data) => {
        data.productType = type;
      })
    );
  };

  //fOR QUANTITES
  const parseQuantity = (value) =>
    (value ? value.replace(/\s/g, "") : "").replace(/[^\d]/g, "");
  const handleMinQuantityOrder = (e) => {
    const value = e.target.value;
    setInputData(
      produce((data) => {
        delete data.errors.minQuantityOrder;
        const parsedNumber = parseQuantity(value);
        data.minQuantityOrder = parsedNumber;
        if (!parsedNumber) {
          data.errors.minQuantityOrder = t(
            "vendorManagement.errors.errorMessage"
          );
        } else if (+parsedNumber > 0) {
          if (+data.maxQuantityOrder) {
            if (+parsedNumber <= +data.maxQuantityOrder) {
              delete data.errors.minQuantityOrder;
              delete data.errors.maxQuantityOrder;
            } else {
              data.errors.minQuantityOrder = t(
                "vendorManagement.errors.minQuantityOrder2"
              );
              data.errors.maxQuantityOrder = t(
                "vendorManagement.errors.maxQuantityOrder2"
              );
            }
          }
        } else {
          data.errors.minQuantityOrder = t(
            "vendorManagement.errors.minQuantityOrder1"
          );
        }
      })
    );
  };
  const handleMaxQuantityOrder = (e) => {
    const value = e.target.value;
    setInputData(
      produce((data) => {
        delete data.errors.maxQuantityOrder;
        const parsedNumber = parseQuantity(value);
        data.maxQuantityOrder = parsedNumber;
        if (!parsedNumber) {
          data.errors.maxQuantityOrder = t(
            "vendorManagement.errors.errorMessage"
          );
        } else if (+parsedNumber > 0) {
          if (+data.minQuantityOrder) {
            if (+parsedNumber >= +data.minQuantityOrder) {
              delete data.errors.minQuantityOrder;
              delete data.errors.maxQuantityOrder;
            } else {
              data.errors.minQuantityOrder = t(
                "vendorManagement.errors.minQuantityOrder2"
              );
              data.errors.maxQuantityOrder = t(
                "vendorManagement.errors.maxQuantityOrder2"
              );
            }
          }
        } else {
          data.errors.maxQuantityOrder = t(
            "vendorManagement.errors.maxQuantityOrder1"
          );
        }
      })
    );
  };
  const handleTotalQuantityInInventory = (e) => {
    const value = e.target.value;
    setInputData(
      produce((data) => {
        delete data.errors.totalQuantityInInventory;
        const parsedNumber = parseQuantity(value);
        data.totalQuantityInInventory = parsedNumber;
        if (!parsedNumber) {
          data.errors.totalQuantityInInventory = t(
            "vendorManagement.errors.errorMessage"
          );
        } else if (+parsedNumber < 1) {
          data.errors.totalQuantityInInventory = t(
            "vendorManagement.errors.totalQuantityInInventory"
          );
        }
      })
    );
  };
  const handleQuantityShortageReminder = (e) => {
    const value = e.target.value;
    setInputData(
      produce((data) => {
        delete data.errors.quantityShortageReminder;
        const parsedNumber = parseQuantity(value);
        data.quantityShortageReminder = parsedNumber;
        if (!parsedNumber) {
          data.errors.quantityShortageReminder = t(
            "vendorManagement.errors.errorMessage"
          );
        } else if (+parsedNumber < 1) {
          data.errors.quantityShortageReminder = t(
            "vendorManagement.errors.quantityShortageReminder"
          );
        }
      })
    );
  };
  const handleProductDescription = (e) => {
    const value = e.target.value;
    if (!testRegexCheckDescription(value)) return;
    setInputData(
      produce((data) => {
        delete data.errors.productDescription;
        data.productDescription = value;
        if (!value.trim()) {
          data.errors.productDescription = t(
            "vendorManagement.errors.errorMessage"
          );
        }
      })
    );
  };
  //For Pricing modal
  const openPriceModal = () => {
    setPreviousDetails(inputData.priceDetails);
    setIsSetPriceModalOpen(true);
  };
  const handleSamePriceForAll = (value) => {
    setInputData(
      produce((data) => {
        data.priceDetails.samePriceForAll = value;
      })
    );
  };
  const parsePrice = (newValue, oldValue) => {
    if (!newValue) return "";
    //strip white spaces
    const priceWithoutSpaces = newValue.replace(/\s/g, "");
    // strip all chars ohter than digits and .
    const priceWithDigitsOnly = priceWithoutSpaces.replace(/[^\d.]/g, "");
    const isValidPrice = /(^\d{1,4}\.\d{0,2}$)|(^\d{0,4}$)/.test(
      priceWithDigitsOnly
    );
    if (isValidPrice) {
      return priceWithDigitsOnly;
    }
    return oldValue;
  };
  const handleUnitPrice = (e) => {
    const value = e.target.value;
    setInputData(
      produce((data) => {
        delete data.priceDetails.error;
        const price = parsePrice(value, data.priceDetails.unitPrice);
        data.priceDetails.unitPrice = price;
        if (!price) {
          data.priceDetails.error = t("vendorManagement.errors.priceError");
        } else if (price && !+price) {
          data.priceDetails.error = t("vendorManagement.errors.priceZeroError");
        }
      })
    );
  };
  const handleUnitPriceForLocation = (e, index) => {
    const value = e.target.value;
    setInputData(
      produce((data) => {
        delete data.priceDetails.locationPrices[index].error;
        const price = parsePrice(
          value,
          data.priceDetails.locationPrices[index].unitPrice
        );
        data.priceDetails.locationPrices[index].unitPrice = price;
        if (!price) {
          data.priceDetails.locationPrices[index].error = t(
            "vendorManagement.errors.priceError"
          );
        } else if (price && !+price) {
          data.priceDetails.locationPrices[index].error = t(
            "vendorManagement.errors.priceZeroError"
          );
        }
      })
    );
  };
  const closeAndResetPriceModal = () => {
    setIsSetPriceModalOpen(false);
    setInputData(
      produce((data) => {
        data.priceDetails = previousDetails;
      })
    );
  };
  const closePriceModal = () => {
    setIsSetPriceModalOpen(false);
  };
  const arePricesValid = () => {
    const { priceDetails } = inputData;
    let isValid = true;
    if (priceDetails.samePriceForAll) {
      if (!priceDetails.unitPrice) {
        setInputData(
          produce((data) => {
            data.priceDetails.error = t("vendorManagement.errors.priceError");
          })
        );
        isValid = false;
      } else if (priceDetails.unitPrice && !+priceDetails.unitPrice) {
        setInputData(
          produce((data) => {
            data.priceDetails.error = t(
              "vendorManagement.errors.priceZeroError"
            );
          })
        );
        isValid = false;
      }
    } else {
      const { locationPrices } = priceDetails;
      locationPrices.forEach((location, index) => {
        if (!location.unitPrice) {
          setInputData(
            produce((data) => {
              data.priceDetails.locationPrices[index].error = t(
                "vendorManagement.errors.priceError"
              );
            })
          );
          isValid = false;
        } else if (location.unitPrice && !+location.unitPrice) {
          setInputData(
            produce((data) => {
              data.priceDetails.locationPrices[index].error = t(
                "vendorManagement.errors.priceZeroError"
              );
            })
          );
          isValid = false;
        }
      });
    }
    return isValid;
  };
  const handleSavePrices = () => {
    if (!arePricesValid()) {
      scrollToErrorInModal("location-prices-modal");
    } else {
      setInputData(
        produce((data) => {
          data.priceDetails.saved = true;
        })
      );
      closePriceModal();
    }
  };
  //For Tax Modal
  const openTaxModal = () => {
    setPreviousDetails(inputData.taxDetails);
    setIsSetTaxPriceModalOpen(true);
  };
  const closeTaxModal = () => {
    setIsSetTaxPriceModalOpen(false);
    setCurrentTaxPage(1);
  };
  const closeAndResetTaxModal = () => {
    closeTaxModal();
    setInputData(
      produce((data) => {
        data.taxDetails = previousDetails;
      })
    );
  };
  const handleTaxSelect = (tax) => {
    setInputData(
      produce((data) => {
        data.taxDetails.selectedTax = tax;
        data.taxDetails.error = "";
      })
    );
  };
  const isValidTaxDetails = () => {
    const { taxDetails } = inputData;
    let isValid = true;
    if (!taxDetails.selectedTax) {
      setInputData(
        produce((data) => {
          data.taxDetails.error = t("vendorManagement.errors.taxError");
        })
      );
      isValid = false;
    }
    return isValid;
  };
  const handleSaveTax = () => {
    if (isValidTaxDetails()) {
      setInputData(
        produce((data) => {
          data.taxDetails.saved = true;
        })
      );
      closeTaxModal();
    }
  };
  //For location and delivery modal
  const openDeliveryModal = () => {
    setPreviousDetails(inputData.deliveryDetails);
    setIsLocationDeliveryModalOpen(true);
  };
  const closeAndResetDeliveryModal = () => {
    setIsLocationDeliveryModalOpen(false);
    setInputData(
      produce((data) => {
        data.deliveryDetails = previousDetails;
      })
    );
  };
  const closeDeliveryModal = () => {
    setIsLocationDeliveryModalOpen(false);
  };
  const handleSelectDeliveryLocation = (value, index) => {
    setInputData(
      produce((data) => {
        data.deliveryDetails.locations[index].selected = value;
        if (!value) {
          data.deliveryDetails.locations[index].to = "";
          data.deliveryDetails.locations[index].from = "";
          data.deliveryDetails.locations[index].toError = "";
          data.deliveryDetails.locations[index].fromError = "";
        }
      })
    );
  };
  const handleFromDays = (e, index) => {
    const value = e.target.value;
    const parsedDays = parseQuantity(value);
    setInputData(
      produce((data) => {
        if (!parsedDays) {
          data.deliveryDetails.locations[index].from = parsedDays;
          data.deliveryDetails.locations[index].fromError = t(
            "vendorManagement.errors.daysError"
          );
        } else if (+parsedDays && +parsedDays <= 365) {
          delete data.deliveryDetails.locations[index].fromError;
          data.deliveryDetails.locations[index].from = parsedDays;
          const to = +data.deliveryDetails.locations[index].to;
          if (to) {
            if (+parsedDays > to) {
              data.deliveryDetails.locations[index].fromError = t(
                "vendorManagement.errors.fromError"
              );
              data.deliveryDetails.locations[index].toError = t(
                "vendorManagement.errors.toError"
              );
            } else if (+parsedDays == to) {
              data.deliveryDetails.locations[index].fromError = t(
                "vendorManagement.errors.sameFromAndTo"
              );
              data.deliveryDetails.locations[index].toError = t(
                "vendorManagement.errors.sameFromAndTo"
              );
            } else {
              delete data.deliveryDetails.locations[index].fromError;
              delete data.deliveryDetails.locations[index].toError;
            }
          }
        }
      })
    );
  };
  const handleToDays = (e, index) => {
    const value = e.target.value;
    const parsedDays = parseQuantity(value);
    setInputData(
      produce((data) => {
        if (!parsedDays) {
          data.deliveryDetails.locations[index].to = parsedDays;
          data.deliveryDetails.locations[index].toError = t(
            "vendorManagement.errors.daysError"
          );
        } else if (+parsedDays && +parsedDays <= 365) {
          delete data.deliveryDetails.locations[index].toError;
          data.deliveryDetails.locations[index].to = parsedDays;
          const from = +data.deliveryDetails.locations[index].from;
          if (from) {
            if (+parsedDays < from) {
              data.deliveryDetails.locations[index].fromError = t(
                "vendorManagement.errors.fromError"
              );
              data.deliveryDetails.locations[index].toError = t(
                "vendorManagement.errors.toError"
              );
            } else if (+parsedDays == from) {
              data.deliveryDetails.locations[index].fromError = t(
                "vendorManagement.errors.sameFromAndTo"
              );
              data.deliveryDetails.locations[index].toError = t(
                "vendorManagement.errors.sameFromAndTo"
              );
            } else {
              delete data.deliveryDetails.locations[index].fromError;
              delete data.deliveryDetails.locations[index].toError;
            }
          }
        }
      })
    );
  };
  const isValidDeliveryDetails = () => {
    const { locations } = inputData.deliveryDetails;
    let isValid = true;
    const isSelected = locations.some((location) => location.selected);
    locations.forEach((location, index) => {
      const { selected, from, to } = location;
      if (selected) {
        //For from days
        if (!from) {
          setInputData(
            produce((data) => {
              data.deliveryDetails.locations[index].fromError = t(
                "vendorManagement.errors.daysError"
              );
            })
          );
          isValid = false;
        } else {
          if (+to) {
            if (+from > +to) {
              setInputData(
                produce((data) => {
                  data.deliveryDetails.locations[index].fromError = t(
                    "vendorManagement.errors.fromError"
                  );
                  data.deliveryDetails.locations[index].toError = t(
                    "vendorManagement.errors.toError"
                  );
                })
              );
              isValid = false;
            } else if (+from == +to) {
              setInputData(
                produce((data) => {
                  data.deliveryDetails.locations[index].fromError = t(
                    "vendorManagement.errors.sameFromAndTo"
                  );
                  data.deliveryDetails.locations[index].toError = t(
                    "vendorManagement.errors.sameFromAndTo"
                  );
                })
              );
              isValid = false;
            }
          }
        }
        //For to days
        if (!to) {
          setInputData(
            produce((data) => {
              data.deliveryDetails.locations[index].toError = t(
                "vendorManagement.errors.daysError"
              );
            })
          );
          isValid = false;
        } else {
          if (+from) {
            if (+to < +from) {
              setInputData(
                produce((data) => {
                  data.deliveryDetails.locations[index].fromError = t(
                    "vendorManagement.errors.fromError"
                  );
                  data.deliveryDetails.locations[index].toError = t(
                    "vendorManagement.errors.toError"
                  );
                })
              );
              isValid = false;
            } else if (+from == +to) {
              setInputData(
                produce((data) => {
                  data.deliveryDetails.locations[index].fromError = t(
                    "vendorManagement.errors.sameFromAndTo"
                  );
                  data.deliveryDetails.locations[index].toError = t(
                    "vendorManagement.errors.sameFromAndTo"
                  );
                })
              );
              isValid = false;
            }
          }
        }
      }
    });
    return [isValid, isSelected];
  };
  const handleSaveDeliveryDetails = () => {
    const [isValid, isSelected] = isValidDeliveryDetails();
    if (!isSelected) {
      setInputData(
        produce((data) => {
          data.deliveryDetails.saved = false;
        })
      );
      closeDeliveryModal();
      return;
    }
    if (isValid) {
      setInputData(
        produce((data) => {
          data.deliveryDetails.saved = true;
        })
      );
      closeDeliveryModal();
    } else {
      scrollToErrorInModal("location-delivery-modal");
    }
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
  const handleVipDiscount = (e) => {
    const value = e.target.value;
    setInputData(
      produce((data) => {
        data.vipDiscount = parseDiscount(value, data.vipDiscount);
      })
    );
  };
  const handleNormalDiscount = (e) => {
    const value = e.target.value;
    setInputData(
      produce((data) => {
        data.normalDiscount = parseDiscount(value, data.normalDiscount);
      })
    );
  };
  //For productImage
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (constants.vendor.allowedTypesForProductImage.includes(file?.type)) {
      if (file?.size < inBytes(constants.vendor.productImageSizeInMbs)) {
        const url = URL.createObjectURL(file);
        setInputData(
          produce((data) => {
            data.productImage.image = file;
            data.productImage.imageUrl = url;
            delete data.errors.productImage;
          })
        );
      } else {
        setInputData(
          produce((data) => {
            data.errors.productImage = t(
              "vendorManagement.errors.productImageSizeError",
              { size: constants.vendor.productImageSizeInMbs }
            );
          })
        );
      }
    } else {
      setInputData(
        produce((data) => {
          data.errors.productImage = t(
            "vendorManagement.errors.productImageTypeError",
            { type: file.type }
          );
        })
      );
    }
  };

  const isValidForm = () => {
    const errors = {};
    //product id
    if (!inputData.productId.trim()) {
      errors.productId = t("vendorManagement.errors.errorMessage");
    }
    //product name
    if (!inputData.productName.trim()) {
      errors.productName = t("vendorManagement.errors.errorMessage");
    }
    //product type
    if (!inputData.productType) {
      errors.productType = t("vendorManagement.errors.errorMessage");
    }
    //min quantity
    if (!inputData.minQuantityOrder) {
      errors.minQuantityOrder = t("vendorManagement.errors.errorMessage");
    } else if (+inputData.minQuantityOrder < 1) {
      errors.minQuantityOrder = t("vendorManagement.errors.minQuantityOrder1");
    } else if (
      +inputData.maxQuantityOrder &&
      +inputData.minQuantityOrder > +inputData.maxQuantityOrder
    ) {
      errors.minQuantityOrder = t("vendorManagement.errors.minQuantityOrder2");
      errors.maxQuantityOrder = t("vendorManagement.errors.maxQuantityOrder2");
    }
    //max queanttiy
    if (!inputData.maxQuantityOrder) {
      errors.maxQuantityOrder = t("vendorManagement.errors.errorMessage");
    } else if (+inputData.maxQuantityOrder < 1) {
      errors.maxQuantityOrder = t("vendorManagement.errors.maxQuantityOrder1");
    } else if (
      +inputData.minQuantityOrder &&
      +inputData.maxQuantityOrder < +inputData.minQuantityOrder
    ) {
      errors.minQuantityOrder = t("vendorManagement.errors.minQuantityOrder2");
      errors.maxQuantityOrder = t("vendorManagement.errors.maxQuantityOrder2");
    }
    //total qunattyt
    if (!inputData.totalQuantityInInventory) {
      errors.totalQuantityInInventory = t(
        "vendorManagement.errors.errorMessage"
      );
    } else if (+inputData.totalQuantityInInventory < 1) {
      errors.totalQuantityInInventory = t(
        "vendorManagement.errors.totalQuantityInInventory"
      );
    }
    // shortage qunattiyt reminder
    if (!inputData.quantityShortageReminder) {
      errors.quantityShortageReminder = t(
        "vendorManagement.errors.errorMessage"
      );
    } else if (+inputData.quantityShortageReminder < 1) {
      errors.quantityShortageReminder = t(
        "vendorManagement.errors.quantityShortageReminder"
      );
    }
    //product descriptin
    if (!inputData.productDescription.trim()) {
      errors.productDescription = t("vendorManagement.errors.errorMessage");
    }
    // image -- optional
    // if(!inputData.productImage.imageUrl){
    //     errors.productImage = t('vendorManagement.errors.productImageError');
    // }
    //price details
    if (!inputData.priceDetails.saved) {
      errors.priceDetails = t("vendorManagement.errors.errorMessage");
    }
    //tax details
    if (!inputData.taxDetails.saved) {
      errors.taxDetails = t("vendorManagement.errors.errorMessage");
    }
    //delivery details
    if (!inputData.deliveryDetails.saved) {
      errors.deliveryDetails = t("vendorManagement.errors.errorMessage");
    }

    setInputData(
      produce((data) => {
        data.errors = errors;
      })
    );
    const hasSomeError = Object.values(errors).some((err) => !!err);
    const isValid = !hasSomeError;
    return isValid;
  };
  const getPricingDetails = () => {
    if (inputData.priceDetails.samePriceForAll) {
      return [
        {
          StateId: null,
          price: +inputData.priceDetails.unitPrice,
        },
      ];
    } else {
      return inputData.priceDetails.locationPrices.map((locationPrice) => {
        const { id, unitPrice } = locationPrice;
        return {
          StateId: id,
          price: +unitPrice,
        };
      });
    }
  };
  const getDeliveryDetails = () => {
    return inputData.deliveryDetails.locations
      .filter((location) => location.selected)
      .map((location) => {
        const { id, from, to } = location;
        return {
          StateId: id,
          FromDays: +from,
          ToDays: +to,
        };
      });
  };
  const {
    uploading,
    deleting,
    upload: uploadImage,
    delete: deleteImage,
  } = useUploadService();
  const saveProductDetails = async (e) => {
    e.preventDefault();
    if (isValidForm()) {
      if (isEdit) {
        editProductDetails();
        return;
      }
      let imageBlobName = null;
      try {
        if (inputData.productImage.image) {
          const [err, blobData] = await uploadImage(
            inputData.productImage.image,
            constants.vendor.productImageContainer
          );
          if (err) {
            throw new Error(err);
          }
          imageBlobName = blobData.blobName;
        }
        const payload = {
          productId: inputData.productId.trim(),
          productName: inputData.productName.trim(),
          Image: imageBlobName
            ? `${constants.vendor.productImageContainer}/${imageBlobName}`
            : null,
          VendorCatalogueCategoryId: inputData.productType.id,
          MinimumQuantity: +inputData.minQuantityOrder,
          MaximumQuantity: +inputData.maxQuantityOrder,
          TotalQuantity: +inputData.totalQuantityInInventory,
          QuantityShortageReminder: +inputData.quantityShortageReminder,
          ProductDescription: inputData.productDescription.trim(),
          VendorTaxId: inputData.taxDetails.selectedTax.id,
          VipCustomerDiscount: +inputData.vipDiscount,
          NormalCustomerDiscount: +inputData.normalDiscount,
          IsPriceSameForAllState: inputData.priceDetails.samePriceForAll,
          CataloguePriceForState: getPricingDetails(),
          CatalogueDeliveryTimeForState: getDeliveryDetails(),
        };
        await addProductMutation.mutateAsync(payload);
        sessionStorage.removeItem(constants.vendor.cache.catalogueList);
        onBack();
        toast.success(t("vendorManagement.productAdded"));
      } catch (error) {
        if (imageBlobName) {
          await deleteImage(
            imageBlobName,
            constants.vendor.productImageContainer
          );
        }
        handleError(error);
      }
    } else {
      scrollToError();
    }
  };

  const getDeliveryDetailsForEdit = () => {
    if (!productDetail) return [];
    const updateData = (item) => {
      const { id, stateId: StateId, fromDays: FromDays, toDays: ToDays } = item;
      return { id, StateId, FromDays, ToDays, IsDeleted: true };
    };
    const dbDeliveryData =
      productDetail.catalogueDeliveryTimeForState.map(updateData);
    inputData.deliveryDetails.locations
      .filter((item) => item.selected)
      .forEach((item) => {
        const { id: StateId, to, from } = item;
        const idx = findIndex(dbDeliveryData, { StateId });
        if (idx > -1) {
          dbDeliveryData[idx].FromDays = +from;
          dbDeliveryData[idx].ToDays = +to;
          dbDeliveryData[idx].IsDeleted = false;
        } else {
          dbDeliveryData.push({
            id: 0,
            StateId,
            FromDays: +from,
            ToDays: +to,
            IsDeleted: false,
          });
        }
      });
    return dbDeliveryData;
  };

  const getPricingDetailsForEdit = () => {
    if (!productDetail) return [];
    const updateData = (item) => {
      const { id, stateId: StateId, price } = item;
      return { id, StateId, price, IsDeleted: true };
    };
    let dbPriceData = productDetail.cataloguePriceForState.map(updateData);
    if (productDetail.isPriceSameForAllState) {
      if (inputData.priceDetails.samePriceForAll) {
        dbPriceData[0].price = +inputData.priceDetails.unitPrice;
        dbPriceData[0].IsDeleted = false;
      } else {
        dbPriceData = inputData.priceDetails.locationPrices.map((item) => {
          const { id: StateId, unitPrice } = item;
          return {
            id: 0,
            StateId,
            price: +unitPrice,
            IsDeleted: false,
          };
        });
      }
    } else {
      if (inputData.priceDetails.samePriceForAll) {
        dbPriceData = [
          {
            id: 0,
            StateId: null,
            price: +inputData.priceDetails.unitPrice,
            IsDeleted: false,
          },
        ];
      } else {
        inputData.priceDetails.locationPrices.forEach((item) => {
          const { id: StateId, unitPrice } = item;
          const idx = findIndex(dbPriceData, { StateId });
          if (idx > -1) {
            dbPriceData[idx].price = +unitPrice;
            dbPriceData[idx].IsDeleted = false;
          } else {
            dbPriceData.push({
              id: 0,
              StateId,
              price: +unitPrice,
              IsDeleted: false,
            });
          }
        });
      }
    }

    return dbPriceData;
  };

  const editProductDetails = async () => {
    let imageBlobName = null;
    const newImageAdded =
      !!productDetail &&
      productDetail.image !== inputData.productImage.imageUrl;
    let oldImageBlobName = "";
    if (productDetail && productDetail.image) {
      //If image is already uploaded
      oldImageBlobName = getBlobnameFromUrl(
        productDetail.image,
        constants.vendor.productImageContainer
      );
    }
    try {
      if (newImageAdded) {
        const [err, blobData] = await uploadImage(
          inputData.productImage.image,
          constants.vendor.productImageContainer
        );
        if (err) {
          throw new Error(err);
        }
        imageBlobName = blobData.blobName;
      } else {
        imageBlobName = oldImageBlobName;
      }
      const payload = {
        VendorCatalogueId: productId,
        productId: inputData.productId.trim(),
        productName: inputData.productName.trim(),
        Image: imageBlobName
          ? `${constants.vendor.productImageContainer}/${imageBlobName}`
          : null,
        VendorCatalogueCategoryId: inputData.productType.id,
        MinimumQuantity: +inputData.minQuantityOrder,
        MaximumQuantity: +inputData.maxQuantityOrder,
        TotalQuantity: +inputData.totalQuantityInInventory,
        QuantityShortageReminder: +inputData.quantityShortageReminder,
        ProductDescription: inputData.productDescription.trim(),
        VendorTaxId: inputData.taxDetails.selectedTax.id,
        VipCustomerDiscount: +inputData.vipDiscount,
        NormalCustomerDiscount: +inputData.normalDiscount,
        IsPriceSameForAllState: inputData.priceDetails.samePriceForAll,
        CataloguePriceForState: getPricingDetailsForEdit(),
        CatalogueDeliveryTimeForState: getDeliveryDetailsForEdit(),
      };
      await updateProductMutation.mutateAsync(payload);
      if (newImageAdded && oldImageBlobName) {
        //On successfull addition of new image, delete the old image
        await deleteImage(
          oldImageBlobName,
          constants.vendor.productImageContainer
        );
      }
      onBack();
      toast.success(t("vendorManagement.productUpdated"));
    } catch (error) {
      if (newImageAdded && imageBlobName) {
        await deleteImage(
          imageBlobName,
          constants.vendor.productImageContainer
        );
      }
      handleError(error);
    }
  };
  return {
    state: {
      tooltipReminderOpen,
      isSetPriceModalOpen,
      isSetTaxPriceModalOpen,
      isLocationDeliveryModalOpen,
      inputData,
    },
    otherData: {
      title: isEdit
        ? t("vendorManagement.editProduct")
        : t("vendorManagement.addNewItem"),
      taxList,
      hasMoreTaxes: currentTaxPage < totalTaxPages,
      hasMoreProductTypes: currentProductTypePage < totalProductTypePages,
      productTypeOptions,
      loading:
        loadingProductType ||
        loadingProvinceList ||
        uploading ||
        deleting ||
        addingProduct ||
        loadingTaxList ||
        loadingProductDetail ||
        updatingProduct ||
        fetchingProductDetail,
    },
    methods: {
      setTooltipReminderOpen,
      setIsSetPriceModalOpen,
      setIsSetTaxPriceModalOpen,
      setIsLocationDeliveryModalOpen,
      setInputData,
      handleProductId,
      handleProductName,
      //product type
      handleProductType,
      handleMinQuantityOrder,
      handleMaxQuantityOrder,
      handleTotalQuantityInInventory,
      handleQuantityShortageReminder,
      handleProductDescription,
      //pricing modal
      openPriceModal,
      handleSamePriceForAll,
      handleUnitPrice,
      closePriceModal,
      closeAndResetPriceModal,
      handleUnitPriceForLocation,
      handleSavePrices,
      //taxing modal
      openTaxModal,
      closeAndResetTaxModal,
      closeTaxModal,
      handleTaxSelect,
      handleSaveTax,
      //Delivery Modal
      openDeliveryModal,
      closeAndResetDeliveryModal,
      closeDeliveryModal,
      handleSelectDeliveryLocation,
      handleFromDays,
      handleToDays,
      handleSaveDeliveryDetails,
      //discounts
      handleVipDiscount,
      handleNormalDiscount,
      //product-image
      handleImageChange,
      //Save product
      saveProductDetails,
      loadMoreTax,
      loadMoreProductTypes,
      onBack,
    },
  };
};

export default useAddNewItem;
