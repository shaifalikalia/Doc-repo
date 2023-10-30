import { useState, useEffect } from "react";
import produce from "immer";
import { useHistory, useParams } from "react-router-dom";
import constants from "../../../../constants";
import { decodeId, handleError, handleSuccess } from "utils";
import {
  useGetCustomerOfficeByOfficeId,
  useUpdateCustomerDetails,
} from "repositories/vendor-repository";
import useHandleApiError from "hooks/useHandleApiError";
import { isEqual } from "lodash";

const CREDIT_LENGTH = 15;
const useCustomerDetail = ({ t }) => {
  const { id } = useParams();
  const officeId = decodeId(id);

  const history = useHistory();
  const onBack = () => {
    history.push(constants.routes.vendor.manageCustomers);
  };
  const [isEditCustomerModalOpen, setEditCustomerModalOpen] = useState(false);

  const initialModalState = {
    hasVipAccess: false,
    hasBillMeLaterAccess: false,
    creditAmount: "",
    error: "",
  };

  const [editModalState, setEditModalState] = useState(initialModalState);

  //Used to reset the modal state back to before editing;
  const [previousModalState, setPreviousModalState] = useState(null);

  const [formattedOfficeDetails, setFormattedOfficeDetails] = useState({
    officeName: "--",
    ownerName: "--",
    vipAccess: "--",
    billMeLaterDetail: "--",
    totalLimit: "--",
    remainingLimit: "--",
  });

  const {
    isLoading: loadingOfficeDetails,
    isFetching: fetchingOfficeDetails,
    data: officeDetails,
    error: officeDetailsError,
    refetch: refetchOfficeDetails,
  } = useGetCustomerOfficeByOfficeId(officeId, { enabled: !!officeId });
  useHandleApiError(
    loadingOfficeDetails,
    fetchingOfficeDetails,
    officeDetailsError
  );

  useEffect(() => {
    if (officeDetails) {
      const { name, owner, vendorCustomerBillingPreference } = officeDetails;
      const { firstName, lastName } = owner;
      const {
        isVipCustomer,
        isBillMeLater,
        currentBillMeLaterLimit,
        totalBillMeLaterLimit,
      } = vendorCustomerBillingPreference?.[0] || {};
      const modalState = {
        hasVipAccess: isVipCustomer,
        hasBillMeLaterAccess: isBillMeLater,
        creditAmount: totalBillMeLaterLimit,
        error: "",
      };
      setEditModalState(modalState);
      //State saved to reset the modal state if user cancels after editing the values.
      setPreviousModalState(modalState);
      let billMeLaterDetailText = `${isBillMeLater ? "Yes" : "No"}`;
      if (isBillMeLater) {
        billMeLaterDetailText = `${isBillMeLater ? "Yes" : "No"} - CAD ${
          currentBillMeLaterLimit || " 0.0"
        }`;
      }

      setFormattedOfficeDetails({
        officeName: name || "-",
        ownerName: `${firstName || "-"} ${lastName || ""}`,
        vipAccess: isVipCustomer ? "Yes" : "No",
        billMeLaterDetail: billMeLaterDetailText,
        totalLimit: `CAD ${totalBillMeLaterLimit}`,
        isBillMeLater: isBillMeLater,
        remainingLimit: `CAD ${currentBillMeLaterLimit}`,
      });
    }
  }, [officeDetails]);

  const openEditCustomerModal = () => {
    setEditCustomerModalOpen(true);
  };

  const closeEditCustomerModal = () => {
    setEditCustomerModalOpen(false);
    setEditModalState(previousModalState);
  };

  const handleVipAccess = (newValue) => {
    setEditModalState(
      produce((draft) => {
        draft.hasVipAccess = newValue;
      })
    );
  };

  const handleBillMeLaterAccess = (newValue) => {
    setEditModalState(
      produce((draft) => {
        draft.hasBillMeLaterAccess = newValue;
        if (newValue === false) {
          draft.creditAmount = "";
          draft.error = "";
        } else {
          console.log(previousModalState);
          draft.creditAmount = previousModalState.creditAmount;
          draft.error = "";
        }
      })
    );
  };

  const handleCreditAmount = (e) => {
    if (editModalState.hasBillMeLaterAccess) {
      const value = e.target.value;
      if (value?.length > CREDIT_LENGTH) return "";
      setEditModalState(
        produce((draft) => {
          delete draft.error;
          if (!value?.trim()) {
            draft.error = t("vendorManagement.errors.errorMessage");
          }
          draft.creditAmount = value;
        })
      );
    }
  };

  const updateCustomerMutation = useUpdateCustomerDetails();
  const { isLoading: updatingCustomerDetails } = updateCustomerMutation;

  const handleSaveModalState = async () => {
    if (editModalState.hasBillMeLaterAccess && !editModalState.creditAmount) {
      setEditModalState(
        produce((draft) => {
          draft.error = t("vendorManagement.errors.errorMessage");
        })
      );
      return;
    }
    try {
      const payload = {
        OfficeId: officeId,
        BillMeLater: editModalState.hasBillMeLaterAccess,
        VipCustomer: editModalState.hasVipAccess,
        TotalBillMeLaterLimit: +editModalState.creditAmount,
      };
      await updateCustomerMutation.mutateAsync(payload);
      refetchOfficeDetails();
      setEditCustomerModalOpen(false);
      handleSuccess(t("vendorManagement.updatedSuccessfully"));
    } catch (err) {
      handleError(err);
    }
  };

  return {
    data: {
      loading: loadingOfficeDetails,
      updatingCustomerDetails,
      formattedOfficeDetails,
      isEditCustomerModalOpen,
      editModalState,
      disableEditModalSaveButton: isEqual(previousModalState, editModalState),
    },
    methods: {
      openEditCustomerModal,
      closeEditCustomerModal,
      handleVipAccess,
      handleBillMeLaterAccess,
      handleCreditAmount,
      handleSaveModalState,
      refetchOfficeDetails,
      onBack,
    },
  };
};

export default useCustomerDetail;
