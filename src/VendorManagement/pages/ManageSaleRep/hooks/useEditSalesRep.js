import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import {
  encodeId,
  handleError,
  handleSuccess,
  parseNumber,
  testRegexCheck,
  validateNumber,
} from "utils";
import constants from "../../../../constants";
import produce from "immer";
import { useUpdateSalesRep } from "repositories/vendor-repository";

const useEditSalesRep = (dependencies) => {
  const { t } = dependencies;

  const location = useLocation();
  const history = useHistory();

  const [inputData, setInputData] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    errors: {},
  });

  useEffect(() => {
    if (!location?.state?.id) {
      history.push(constants.routes.vendor.manageSalesRep);
    } else {
      const {
        id,
        contactNumber,
        emailId: email,
        firstName,
        lastName,
      } = location.state;
      setInputData({
        id,
        firstName,
        lastName,
        email,
        contactNumber,
        errors: {},
      });
    }
  }, []);

  const updateSalesRepMutation = useUpdateSalesRep();
  const { isLoading: updatingSalesRep } = updateSalesRepMutation;

  const onBack = () => {
    history.push({
      pathname: constants.routes.vendor.salesRepDetail,
      search: `?id=${encodeId(inputData.id)}`,
    });
  };

  const handleFirstName = (e) => {
    const value = e.target.value;
    if (!testRegexCheck(value)) return;
    setInputData(
      produce((data) => {
        delete data.errors.firstName;
        data.firstName = value;
        if (!value.trim()) {
          data.errors.firstName = t("vendorManagement.errors.errorMessage");
        }
      })
    );
  };

  const handleLastName = (e) => {
    const value = e.target.value;
    if (!testRegexCheck(value)) return;
    setInputData(
      produce((data) => {
        delete data.errors.lastName;
        data.lastName = value;
        if (!value.trim()) {
          data.errors.lastName = t("vendorManagement.errors.errorMessage");
        }
      })
    );
  };

  const handleContactNumber = (e) => {
    const value = parseNumber(e.target.value);
    setInputData(
      produce((data) => {
        delete data.errors.contactNumber;
        data.contactNumber = value;
        if (value) {
          if (validateNumber(value)) {
            delete data.errors.contactNumber;
          } else {
            data.errors.contactNumber = t("form.errors.invalidValue", {
              field: t("form.fields.phoneNumber"),
            });
          }
        }
      })
    );
  };

  const isValidForm = () => {
    const errors = {};
    //for first name
    if (!inputData.firstName.trim()) {
      errors.firstName = t("vendorManagement.errors.errorMessage");
    }
    //for first name
    if (!inputData.lastName.trim()) {
      errors.lastName = t("vendorManagement.errors.errorMessage");
    }
    //for contact number
    if (inputData.contactNumber && !validateNumber(inputData.contactNumber)) {
      errors.contactNumber = t("form.errors.invalidValue", {
        field: t("form.fields.phoneNumber"),
      });
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

  const handleUpdateDetails = async (e) => {
    e.preventDefault();
    if (isValidForm()) {
      const body = {
        SalesRepresentativeId: inputData.id,
        FirstName: inputData.firstName.trim(),
        LastName: inputData.lastName.trim(),
        ContactNumber: inputData.contactNumber,
      };
      try {
        await updateSalesRepMutation.mutateAsync(body);
        handleSuccess(t("vendorManagement.salesRepDetailsSuc"));
        onBack();
      } catch (err) {
        handleError(err);
      }
    }
  };

  return {
    data: {
      inputData,
      loading: updatingSalesRep,
    },
    methods: {
      onBack,
      handleFirstName,
      handleLastName,
      handleContactNumber,
      handleUpdateDetails,
    },
  };
};

export default useEditSalesRep;
