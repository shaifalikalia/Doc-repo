import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import constants from "../../../constants";
import {
  useToGetListOfSubscription,
  updateSubscriptionPlan,
} from "repositories/subscription-repository";
import useHandleApiError from "hooks/useHandleApiError";
import { useHistory } from "react-router-dom";
import { handleError } from "utils";

const formFields = {
  // object for Single office
  singleSetUpFeeCad: "",
  singleOfficeChargesCad: "",
  singlePermanentStaffChargesCad: "",
  singleTemporaryStaffChargesCad: "",
  singlePerEachPlacmentCad: "",

  singleSetUpFeeUsd: "",
  singleOfficeChargesUsd: "",
  singlePermanentStaffChargesUsd: "",
  singleTemporaryStaffChargesUsd: "",
  singlePerEachPlacmentUsd: "",

  // object for Multiple office
  multipleSetUpFeeCad: "",
  multipleOfficeChargesCad: "",
  multiplePermanentStaffChargesCad: "",
  multipleTemporaryStaffChargesCad: "",
  multiplePerEachPlacmentCad: "",

  multipleSetUpFeeUsd: "",
  multipleOfficeChargesUsd: "",
  multiplePermanentStaffChargesUsd: "",
  multipleTemporaryStaffChargesUsd: "",
  multiplePerEachPlacmentUsd: "",
};
export default function useEditSubscription({ t, subscriptionType }) {
  const [error, setError] = useState({});
  const [isLoader, setIsLoader] = useState(false);

  const [officeCharges, setOfficeCharges] = useState(formFields);
  const {
    data,
    isLoading,
    isFetching,
    error: subsError,
  } = useToGetListOfSubscription(subscriptionType);
  const history = useHistory();
  useHandleApiError(isLoading, isFetching, subsError);
  const converToString = (num) => {
    return num.toString();
  };
  const converToNumber = (num) => {
    return Number(num);
  };

  useEffect(() => {
    if (Array.isArray(data) && data.length && data[0] && data[1]) {
      let singleOffice = data[0];
      let multipleOffice = data[1];

      const formValues = {
        // object for Single office
        singleSetUpFeeCad: converToString(singleOffice.setupFeeChargeInCad),
        singleOfficeChargesCad: converToString(
          singleOffice.perOfficeChargeInCad
        ),
        singlePermanentStaffChargesCad: converToString(
          singleOffice.perPermanentStaffMemberChargeInCad
        ),
        singleTemporaryStaffChargesCad: converToString(
          singleOffice.perTemporaryStaffMemberChargeInCad
        ),
        singlePerEachPlacmentCad: converToString(
          singleOffice.perPlacementChangeInCad
        ),

        singleSetUpFeeUsd: converToString(singleOffice.setupFeeChargeInUsd),
        singleOfficeChargesUsd: converToString(
          singleOffice.perOfficeChargeInUsd
        ),
        singlePermanentStaffChargesUsd: converToString(
          singleOffice.perPermanentStaffMemberChargeInUsd
        ),
        singleTemporaryStaffChargesUsd: converToString(
          singleOffice.perTemporaryStaffMemberChargeInUsd
        ),
        singlePerEachPlacmentUsd: converToString(
          singleOffice.perPlacementChangeInUsd
        ),

        // object for Multiple office
        multipleSetUpFeeCad: converToString(multipleOffice.setupFeeChargeInCad),
        multipleOfficeChargesCad: converToString(
          multipleOffice.perOfficeChargeInCad
        ),
        multiplePermanentStaffChargesCad: converToString(
          multipleOffice.perPermanentStaffMemberChargeInCad
        ),
        multipleTemporaryStaffChargesCad: converToString(
          multipleOffice.perTemporaryStaffMemberChargeInCad
        ),
        multiplePerEachPlacmentCad: converToString(
          multipleOffice.perPlacementChangeInCad
        ),

        multipleSetUpFeeUsd: converToString(multipleOffice.setupFeeChargeInUsd),
        multipleOfficeChargesUsd: converToString(
          multipleOffice.perOfficeChargeInUsd
        ),
        multiplePermanentStaffChargesUsd: converToString(
          multipleOffice.perPermanentStaffMemberChargeInUsd
        ),
        multipleTemporaryStaffChargesUsd: converToString(
          multipleOffice.perTemporaryStaffMemberChargeInUsd
        ),
        multiplePerEachPlacmentUsd: converToString(
          multipleOffice.perPlacementChangeInUsd
        ),
      };
      setOfficeCharges(formValues);
    }
  }, [data]);

  const contvertIntoDec = (newValue, oldValue) => {
    if (!newValue) return "";
    let acceptNumberWithDecimal = new RegExp(/^\d*\.?\d*$/);
    if (acceptNumberWithDecimal.test(newValue)) return newValue;
    return oldValue;
  };

  const handleChange = (event, key) => {
    const { value, name } = event.target;
    let price = contvertIntoDec(value, officeCharges[name]);

    if (price || price === 0) {
      setError((pre) => {
        delete pre[name];
        return pre;
      });
    } else {
      setError((pre) => {
        pre[name] = t("fieldNotEmpty");
        return pre;
      });
    }
    setOfficeCharges((prev) => ({ ...prev, [name]: price }));
  };

  const isValueExist = (value) => {
    if (value || value === 0) return null;
    return t("fieldNotEmpty");
  };

  const isValid = () => {
    let errorMessage = {
      // object for Single office
      singleSetUpFeeCad: isValueExist(officeCharges.singleSetUpFeeCad),
      singleOfficeChargesCad: isValueExist(
        officeCharges.singleOfficeChargesCad
      ),
      singlePermanentStaffChargesCad: isValueExist(
        officeCharges.singlePermanentStaffChargesCad
      ),
      singleTemporaryStaffChargesCad: isValueExist(
        officeCharges.singleTemporaryStaffChargesCad
      ),
      singlePerEachPlacmentCad: isValueExist(
        officeCharges.singlePerEachPlacmentCad
      ),
      singleSetUpFeeUsd: isValueExist(officeCharges.singleSetUpFeeUsd),
      singleOfficeChargesUsd: isValueExist(
        officeCharges.singleOfficeChargesUsd
      ),
      singlePermanentStaffChargesUsd: isValueExist(
        officeCharges.singlePermanentStaffChargesUsd
      ),
      singleTemporaryStaffChargesUsd: isValueExist(
        officeCharges.singleTemporaryStaffChargesUsd
      ),
      singlePerEachPlacmentUsd: isValueExist(
        officeCharges.singleTemporaryStaffChargesUsd
      ),

      // object for MultipleOffice office

      multipleSetUpFeeCad: isValueExist(officeCharges.multipleSetUpFeeCad),
      multipleOfficeChargesCad: isValueExist(
        officeCharges.multipleOfficeChargesCad
      ),
      multiplePermanentStaffChargesCad: isValueExist(
        officeCharges.multiplePermanentStaffChargesCad
      ),
      multipleTemporaryStaffChargesCad: isValueExist(
        officeCharges.multipleTemporaryStaffChargesCad
      ),
      multiplePerEachPlacmentCad: isValueExist(
        officeCharges.multiplePerEachPlacmentCad
      ),
      multipleSetUpFeeUsd: isValueExist(officeCharges.multipleSetUpFeeUsd),
      multipleOfficeChargesUsd: isValueExist(
        officeCharges.multipleOfficeChargesUsd
      ),
      multiplePermanentStaffChargesUsd: isValueExist(
        officeCharges.multiplePermanentStaffChargesUsd
      ),
      multipleTemporaryStaffChargesUsd: isValueExist(
        officeCharges.multipleTemporaryStaffChargesUsd
      ),
      multiplePerEachPlacmentUsd: isValueExist(
        officeCharges.multiplePerEachPlacmentUsd
      ),
    };

    setError(errorMessage);
    return !Object.values(errorMessage).filter(Boolean)?.length;
  };

  const handleSave = async () => {
    try {
      if (
        isValid() &&
        Array.isArray(data) &&
        data.length &&
        data[0] &&
        data[1]
      ) {
        let singleOffice = data[0];
        let multiplyOffice = data[1];

        setIsLoader(true);
        let body = [
          {
            packageId: singleOffice.id,
            name: singleOffice.name,
            SetupFeeChargeChargeInCad: converToNumber(
              officeCharges.singleSetUpFeeCad
            ),
            perOfficeChargeInCad: converToNumber(
              officeCharges.singleOfficeChargesCad
            ),
            perPermanentMemberChargeInCad: converToNumber(
              officeCharges.singlePermanentStaffChargesCad
            ),
            perTemporaryMemberChargeInCad: converToNumber(
              officeCharges.singleTemporaryStaffChargesCad
            ),
            perPlacementChargeInCad: converToNumber(
              officeCharges.singlePerEachPlacmentCad
            ),
            SetupFeeChargeChargeInUsd: converToNumber(
              officeCharges.singleSetUpFeeUsd
            ),
            perOfficeChargeInUsd: converToNumber(
              officeCharges.singleOfficeChargesUsd
            ),
            perPermanentMemberChargeInUsd: converToNumber(
              officeCharges.singlePermanentStaffChargesUsd
            ),
            perTemporaryMemberChargeInUsd: converToNumber(
              officeCharges.singleTemporaryStaffChargesUsd
            ),
            perPlacementChargeInUsd: converToNumber(
              officeCharges.singlePerEachPlacmentUsd
            ),
          },
          {
            packageId: multiplyOffice.id,
            name: multiplyOffice.name,
            SetupFeeChargeChargeInCad: converToNumber(
              officeCharges.multipleSetUpFeeCad
            ),
            perOfficeChargeInCad: converToNumber(
              officeCharges.multipleOfficeChargesCad
            ),
            perPermanentMemberChargeInCad: converToNumber(
              officeCharges.multiplePermanentStaffChargesCad
            ),
            perTemporaryMemberChargeInCad: converToNumber(
              officeCharges.multipleTemporaryStaffChargesCad
            ),
            perPlacementChargeInCad: converToNumber(
              officeCharges.multiplePerEachPlacmentCad
            ),
            SetupFeeChargeChargeInUsd: converToNumber(
              officeCharges.multipleSetUpFeeUsd
            ),
            perOfficeChargeInUsd: converToNumber(
              officeCharges.multipleOfficeChargesUsd
            ),
            perPermanentMemberChargeInUsd: converToNumber(
              officeCharges.multiplePermanentStaffChargesUsd
            ),
            perTemporaryMemberChargeInUsd: converToNumber(
              officeCharges.multipleTemporaryStaffChargesUsd
            ),
            perPlacementChargeInUsd: converToNumber(
              officeCharges.multiplePerEachPlacmentUsd
            ),
          },
        ];
        let res = await updateSubscriptionPlan(body);
        toast.success(res.message);
        history.goBack();
      }
    } catch (err) {
      handleError(err);
    }
    setIsLoader(false);
  };

  const printSubscriptionType = () => {
    if (subscriptionType === constants.subscriptionType.advanced)
      return t("superAdmin.advancedSubscription");
    if (subscriptionType === constants.subscriptionType.professional)
      return t("superAdmin.professionalSubscription");
    if (subscriptionType === constants.subscriptionType.basic)
      return t("superAdmin.basicSubscription");
  };

  return {
    data: {
      error,
      isLoading: isLoader || isLoading,
      officeCharges,
      priceInputMaxLenght: 6,
    },
    methods: {
      handleChange,
      handleSave,
      printSubscriptionType,
    },
  };
}
