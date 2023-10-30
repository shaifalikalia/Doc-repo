import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import constants from "../../../../constants";
import { cloneDeep } from "lodash";
import { addTaxes, updateTaxes } from "repositories/admin-vendor-repository";

export const useAddTaxManagment = ({
  provienceListing,
  t,
  isRefetch,
  isEditTaxDetails,
}) => {
  const errorMessage = {
    taxName: t("form.errors.emptyField", { field: t("superAdminTax.taxName") }),
    taxPercentage: t("form.errors.emptyField", {
      field: t("superAdminTax.taxPercentage"),
    }),
  };
  const isEdit = isEditTaxDetails?.id ? true : false;
  let isSameForAllState = 1;
  let scheme = {
    taxName: "",
    taxPercentage: "",
  };

  if (isEdit) {
    isSameForAllState = isEditTaxDetails?.isSameForAllState === true ? 1 : 2;
    scheme = {
      taxName: isEditTaxDetails.name,
      taxPercentage:
        isEditTaxDetails?.isSameForAllState === true
          ? isEditTaxDetails?.vendorTaxForStates[0]?.percentage
          : "",
    };
  }

  const modifyprovienceList = (arrayOfProvience) => {
    if (!isEdit) {
      return arrayOfProvience?.map((item) => {
        item.Percentage = "";
        item.StateId = item.id;
        item.error = "";
        return item;
      });
    }

    return arrayOfProvience.map((item) => {
      item.Percentage = "";
      item.StateId = item.id;
      item.error = "";
      !isEditTaxDetails?.isSameForAllState &&
        isEditTaxDetails?.vendorTaxForStates.map((list) => {
          if (item.id === list.stateId) {
            item.Percentage = list.percentage;
            item.VendorTaxId = list.id;
          }
        });
      return item;
    });
  };

  const [formFields, setFormFields] = useState(scheme);
  const [taxType, setTaxType] = useState(isSameForAllState);
  const [isError, setIsError] = useState({});
  const [isLoading, setisLoading] = useState(false);
  const [provienceList, setProvienceList] = useState([]);

  const isNumber = (number) => {
    const re = /^[0-9\b]+$/;
    return typeof number === "number" && re.test(number) ? true : false;
  };

  useEffect(() => {
    let provienceListingCopy = cloneDeep(provienceListing);
    if (provienceListingCopy?.length) {
      setProvienceList(modifyprovienceList(provienceListingCopy));
    }
  }, [provienceListing]);

  const radioHandler = (taxType) => {
    setTaxType(taxType);
  };

  const afterDecimal = (num) => {
    if (Number.isInteger(num)) {
      return 0;
    }

    return num?.toString()?.split(".")[1]?.length;
  };

  const ParseFloatNum = (str, val) => {
    str = str?.toString();
    str = str?.slice(0, str.indexOf(".") + val + 1);
    return str;
  };

  const handleChanged = (event) => {
    let { value, name } = event.target;
    const errorCopy = cloneDeep(isError);
    if (name === "taxName") {
      if (!value?.trim()?.length) {
        errorCopy[name] = errorMessage[name];
      } else {
        delete errorCopy[name];
      }
      setFormFields((prev) => ({ ...prev, [name]: value }));
    }

    if (name === "taxPercentage") {
      let updateValue = parseInt(value);
      if (
        isNumber(updateValue) &&
        value.includes(".") &&
        afterDecimal(+value) >= 2
      ) {
        value = ParseFloatNum(+value, 2);
      }

      if (
        ((isNumber(updateValue) && updateValue <= 100 && value.length <= 5) ||
          value == "") &&
        !isNaN(value)
      ) {
        if (isNumber(updateValue)) {
          delete errorCopy[name];
        }
        if (!isNumber(updateValue)) {
          errorCopy[name] = errorMessage[name];
        }
        setFormFields((prev) => ({ ...prev, [name]: value }));
      }
    }

    setIsError(errorCopy);
  };

  const handleProvience = (value, id) => {
    let updateValue = parseInt(value);

    if (
      isNumber(updateValue) &&
      value.includes(".") &&
      afterDecimal(+value) >= 2
    ) {
      value = ParseFloatNum(+value, 2);
    }

    if (
      ((isNumber(updateValue) && updateValue <= 100 && value.length <= 5) ||
        value == "") &&
      !isNaN(value)
    ) {
      setProvienceList((prevProps) =>
        prevProps.map((item) => {
          if (item.id === id && isNumber(updateValue)) {
            item.error = "";
          }
          if (!isNumber(updateValue) && item.id === id) {
            item.error = t("form.errors.fieldrequired");
          }
          if (item.id === id) {
            item.Percentage = value;
          }
          return item;
        })
      );
    }
  };

  const isValid = () => {
    let valid = true;
    const errorCopy = cloneDeep(isError);
    const { taxName, taxPercentage } = formFields;

    if (!taxName?.trim()?.length) {
      errorCopy["taxName"] = errorMessage["taxName"];
      valid = false;
    }

    if (taxType === constants.taxType.oneTax) {
      if (!isNumber(parseInt(taxPercentage))) {
        valid = false;
        errorCopy["taxPercentage"] = errorMessage["taxPercentage"];
      }
    }
    if (taxType === constants.taxType.ProvienceTax) {
      let provienceListClone = cloneDeep(provienceList);
      let updateErrors = provienceListClone.map((item) => {
        if (!isNumber(parseInt(item?.Percentage))) {
          valid = false;
          item.error = t("form.errors.fieldrequired");
        }
        return item;
      });

      setProvienceList(updateErrors);
    }
    setIsError(errorCopy);
    return valid;
  };

  const submitTaxes = async () => {
    if (isEdit) {
      editTax();
    } else {
      addTax();
    }
  };

  const editTax = async () => {
    try {
      if (!isValid()) return;
      setisLoading(true);
      const { taxName, taxPercentage } = formFields;
      let taxForState = [
        {
          Percentage: +taxPercentage,
          StateId: null,
          id:
            isEditTaxDetails?.vendorTaxForStates?.length === 1
              ? isEditTaxDetails?.vendorTaxForStates[0]?.id
              : 0,
        },
      ];

      if (taxType === constants.taxType.ProvienceTax) {
        taxForState = provienceList.map((item) => {
          return {
            Percentage: +item.Percentage,
            StateId: item.StateId,
            id: item.VendorTaxId ? item.VendorTaxId : 0,
          };
        });
      }
      let params = {
        Name: taxName?.trim(),
        IsSameForAllState: taxType === constants.taxType.oneTax ? true : false,
        VendorTaxForStates: taxForState,
        isDeleted: false,
        VendorTaxId: isEditTaxDetails?.id,
      };

      let res = await updateTaxes(params);
      toast.success(res.message);
      isRefetch(true);
    } catch (error) {
      toast.error(error.message);
    }
    setisLoading(false);
  };

  const addTax = async () => {
    try {
      if (!isValid()) return;
      setisLoading(true);
      const { taxName, taxPercentage } = formFields;
      let taxForState = [
        {
          Percentage: +taxPercentage,
          StateId: null,
        },
      ];

      if (taxType === constants.taxType.ProvienceTax) {
        taxForState = provienceList.map((item) => {
          return {
            Percentage: +item.Percentage,
            StateId: item.StateId,
          };
        });
      }
      let params = {
        Name: taxName?.trim(),
        IsSameForAllState: taxType === constants.taxType.oneTax ? true : false,
        VendorTaxForStates: taxForState,
      };

      let res = await addTaxes(params);
      toast.success(res.message);
      isRefetch(false);
    } catch (error) {
      toast.error(error.message);
    }
    setisLoading(false);
  };

  return {
    showLoader: isLoading,
    formFields,
    taxType,
    provienceList: provienceList,
    isError,
    isEdit,
    radioHandler,
    setFormFields,
    setProvienceList: setProvienceList,
    handleChanged,
    handleProvience: handleProvience,
    submitTaxes,
  };
};
