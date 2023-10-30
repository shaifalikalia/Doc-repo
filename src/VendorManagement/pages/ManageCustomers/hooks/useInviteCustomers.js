import { useState } from "react";
import {
  handleError,
  handleSuccess,
  testRegexCheck,
  testRegexCheckDescription,
  validateEmail,
} from "utils";
import produce from "immer";
import { useHistory } from "react-router-dom";
import constants from "../../../../constants";
import { useInviteCustomerMutation } from "repositories/vendor-repository";

const useInviteCustomers = ({ t }) => {
  const history = useHistory();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});

  const handleFirstName = (e) => {
    const value = e.target.value;
    if (!testRegexCheck(value)) return;
    setFirstName(value);
    setErrors(
      produce((draft) => {
        delete draft.firstName;
        if (!value.trim()) {
          draft.firstName = t("vendorManagement.errors.errorMessage");
        }
      })
    );
  };

  const handleLastName = (e) => {
    const value = e.target.value;
    if (!testRegexCheck(value)) return;
    setLastName(value);
    setErrors(
      produce((draft) => {
        delete draft.lastName;
        if (!value.trim()) {
          draft.lastName = t("vendorManagement.errors.errorMessage");
        }
      })
    );
  };

  const handleEmail = (e) => {
    const value = e.target.value;
    if (!testRegexCheckDescription(value)) return;
    setEmail(value);
    setErrors(
      produce((draft) => {
        delete draft.email;
        if (!value.trim()) {
          draft.email = t("vendorManagement.errors.errorMessage");
        } else if (!validateEmail(value)) {
          draft.email = t("vendorManagement.errors.emailError");
        } else if (!/^.{1,64}@.+$/.test(value)) {
          draft.email = t("vendorManagement.errors.emailError2");
        }
      })
    );
  };

  const isValidForm = () => {
    const errs = {};
    //for first name
    if (!firstName.trim()) {
      errs.firstName = t("vendorManagement.errors.errorMessage");
    }
    //for last name
    if (!lastName.trim()) {
      errs.lastName = t("vendorManagement.errors.errorMessage");
    }
    //for email
    if (!email.trim()) {
      errs.email = t("vendorManagement.errors.errorMessage");
    } else if (!validateEmail(email)) {
      errs.email = t("vendorManagement.errors.emailError");
    } else if (!/^.{1,64}@.+$/.test(email)) {
      errs.email = t("vendorManagement.errors.emailError2");
    }

    setErrors(errs);

    const hasSomeError = Object.values(errs).some((err) => !!err);
    const isValid = !hasSomeError;

    return isValid;
  };

  const onBack = () => {
    history.push(constants.routes.vendor.manageCustomers);
  };

  const inviteCustomerMutation = useInviteCustomerMutation();
  const { isLoading: invitingCustomer } = inviteCustomerMutation;

  const sendInvite = async (e) => {
    e.preventDefault();
    if (isValidForm()) {
      const payload = {
        FirstName: firstName.trim(),
        LastName: lastName.trim(),
        EmailId: email.trim(),
      };
      try {
        await inviteCustomerMutation.mutateAsync(payload);
        handleSuccess(t("vendorManagement.inviteSent"));
        onBack();
      } catch (err) {
        handleError(err);
      }
    }
  };

  return {
    data: {
      firstName,
      lastName,
      email,
      errors,
      loading: invitingCustomer,
    },
    methods: {
      handleFirstName,
      handleLastName,
      handleEmail,
      onBack,
      sendInvite,
    },
  };
};

export default useInviteCustomers;
