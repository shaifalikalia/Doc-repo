import { useState } from "react";
import { useHistory } from "react-router-dom";
import produce from "immer";
import {
  handleError,
  testRegexCheck,
  testRegexCheckDescription,
  validateEmail,
} from "utils";
import { useInviteSalesRepMutation } from "repositories/vendor-repository";
import { toast } from "react-hot-toast";

const useInviteSalesRep = (dependencies) => {
  const history = useHistory();
  const onBack = () => {
    history.goBack();
  };
  const { t } = dependencies;
  const [inputData, setInputData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    errors: {},
  });

  const inviteSalesRepMutation = useInviteSalesRepMutation();
  const { isLoading: invitingSalesRep } = inviteSalesRepMutation;

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

  const handleEmail = (e) => {
    const value = e.target.value;
    if (!testRegexCheckDescription(value)) return;
    setInputData(
      produce((data) => {
        delete data.errors.email;
        data.email = value;
        if (!value.trim()) {
          data.errors.email = t("vendorManagement.errors.errorMessage");
        } else if (!validateEmail(value)) {
          data.errors.email = t("vendorManagement.errors.emailError");
        } else if (!/^.{1,64}@.+$/.test(value)) {
          data.errors.email = t("vendorManagement.errors.emailError2");
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
    //for email
    if (!inputData.email.trim()) {
      errors.email = t("vendorManagement.errors.errorMessage");
    } else if (!validateEmail(inputData.email)) {
      errors.email = t("vendorManagement.errors.emailError");
    } else if (!/^.{1,64}@.+$/.test(inputData.email)) {
      errors.email = t("vendorManagement.errors.emailError2");
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
  const sendInvite = async (e) => {
    e.preventDefault();
    if (isValidForm()) {
      const payload = {
        firstName: inputData.firstName.trim(),
        lastName: inputData.lastName.trim(),
        emailId: inputData.email.trim(),
      };
      try {
        await inviteSalesRepMutation.mutateAsync(payload);
        toast.success(t("vendorManagement.inviteSent"));
        onBack();
      } catch (error) {
        handleError(error);
      }
    }
  };
  return {
    state: {
      inputData,
    },
    otherData: {
      loading: invitingSalesRep,
    },
    methods: {
      onBack,
      handleFirstName,
      handleLastName,
      handleEmail,
      sendInvite,
    },
  };
};

export default useInviteSalesRep;
