import React, { useState, useEffect } from "react";
import { withTranslation } from "react-i18next";
import Input from "components/Input";
import { useLocation, useParams } from "react-router-dom";
import UpdateSubscriptionModal from "./UpdateSubscriptionModal";
import { editSubscriptionprices } from "repositories/subscription-repository";
import Loader from "components/Loader";
import toast from "react-hot-toast";
import { decodeId, encodeId, handleError } from "utils";
import { getsubcriptionPlanTitle } from "../../../../constants";

function EditSubscription({ t, history }) {
  const [inputState, setInputState] = useState({});
  const [errors, setErrors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const location = useLocation();
  const accountOwnerId = useParams();

  const {
    perOfficeCharge,
    perPermanentStaffCharge,
    perPlacementCharge,
    perTemporaryStaffCharge,
    setupFee,
    subscriptionPlan,
  } = location?.state?.APIdata;

  const inputHandler = (e) => {
    try {
      const inputName = e.target.name;
      const inputValue = e.target.value;
      const maxInputLenght = 6;
      if (inputValue?.toString()?.trim()?.length > maxInputLenght) return null;
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[inputName];
        return copy;
      });

      if (inputValue || inputValue === "") {
        setInputState((prev) => {
          return { ...prev, [inputName]: inputValue };
        });
      }
    } catch (err) {
      handleError(err);
    }
  };

  const handleEditPlan = async () => {
    const {
      officeUnitPrice: PerOfficeCharge,
      permanentStaffUnitPrice: PerPermanentMemberCharge,
      temporaryStaffUnitPrice: PerTemporaryMemberCharge,
      placementUnitPrice: PerPlacementCharge,
      setupFee: SetUpFeeCharge,
    } = inputState;
    let { subscriptionId: OwnerId } = accountOwnerId;
    OwnerId = decodeId(OwnerId);
    try {
      closeModal();
      setIsUpdating(true);
      const editresponse = await editSubscriptionprices(
        OwnerId,
        PerOfficeCharge,
        PerPermanentMemberCharge,
        PerTemporaryMemberCharge,
        PerPlacementCharge,
        SetUpFeeCharge
      );
      toast.success(editresponse.message);
      history.push(
        `/account-owner/${encodeId(OwnerId)}/subscription-and-invoices`
      );
    } catch (error) {
      handleError(error);
    }
    setIsUpdating(false);
  };

  const handleConfirmationPopup = () => {
    let noErrorState = true;

    if (inputState.setupFee === "") {
      setErrors((prev) => {
        return { ...prev, setupFee: t("superAdmin.setUpFeeCharges") };
      });
      noErrorState = false;
    }

    if (inputState.officeUnitPrice === "") {
      setErrors((prev) => {
        return {
          ...prev,
          officeUnitPrice: t("superAdmin.officeUnitPriceError"),
        };
      });
      noErrorState = false;
    }
    if (inputState.temporaryStaffUnitPrice === "") {
      setErrors((prev) => {
        return {
          ...prev,
          temporaryStaffUnitPrice: t("superAdmin.temporaryStaffUnitPriceError"),
        };
      });
      noErrorState = false;
    }
    if (inputState.permanentStaffUnitPrice === "") {
      setErrors((prev) => {
        return {
          ...prev,
          permanentStaffUnitPrice: t("superAdmin.permanentStaffUnitPriceError"),
        };
      });
      noErrorState = false;
    }
    if (inputState.placementUnitPrice === "") {
      setErrors((prev) => {
        return {
          ...prev,
          placementUnitPrice: t("superAdmin.placementUnitPriceError"),
        };
      });
      noErrorState = false;
    }
    if (noErrorState) {
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    setInputState({
      officeUnitPrice: perOfficeCharge,
      temporaryStaffUnitPrice: perTemporaryStaffCharge,
      permanentStaffUnitPrice: perPermanentStaffCharge,
      placementUnitPrice: perPlacementCharge,
      setupFee,
    });
  }, []);

  return (
    <div className="edit-pan-block">
      <div className="container">
        <button className="back-btn">
          <span className="ib_v pointer" onClick={() => history.goBack()}>
            <span className="ico">
              <img
                src={require("assets/images/arrow-back-icon.svg").default}
                alt="arrow"
              />
            </span>
            <span className="link-btn">{t("back")}</span>
          </span>
        </button>
      </div>
      <div className="container container-smd">
        <h2 className="title">
          {`${getsubcriptionPlanTitle(subscriptionPlan)} ${t("subscription")}`}
        </h2>
        <div className="form-wrapper">
          <div className="edit-plan-form">
            <div className="row">
              <div className="col-xl-7">
                <Input
                  Title={t("form.fields.SetUpFee")}
                  Type="number"
                  Placeholder={t("form.placeholder1", {
                    field: t("form.fields.SetUpFee"),
                  })}
                  Name={"setupFee"}
                  HandleChange={inputHandler}
                  Error={errors.setupFee}
                  Value={inputState.setupFee}
                />

                <Input
                  Title={t("form.fields.officeCharges")}
                  Type="number"
                  Placeholder={t("form.placeholder1", {
                    field: t("form.fields.officeCharges"),
                  })}
                  Name={"officeUnitPrice"}
                  HandleChange={inputHandler}
                  Error={errors.officeUnitPrice}
                  Value={inputState.officeUnitPrice}
                />
                <Input
                  Title={t("form.fields.temporaryStaffCharges")}
                  Type="number"
                  Placeholder={t("form.placeholder1", {
                    field: t("form.fields.temporaryStaffCharges"),
                  })}
                  Name={"temporaryStaffUnitPrice"}
                  HandleChange={inputHandler}
                  Error={errors.temporaryStaffUnitPrice}
                  Value={inputState.temporaryStaffUnitPrice}
                />
                <Input
                  Title={t("form.fields.permanentStaffCharges")}
                  Type="number"
                  Placeholder={t("form.placeholder1", {
                    field: t("form.fields.permanentStaffCharges"),
                  })}
                  Name={"permanentStaffUnitPrice"}
                  HandleChange={inputHandler}
                  Error={errors.permanentStaffUnitPrice}
                  Value={inputState.permanentStaffUnitPrice}
                />
                <Input
                  Title={t("form.fields.placementCharges")}
                  Type="number"
                  Placeholder={t("form.placeholder1", {
                    field: t("form.fields.placementCharges"),
                  })}
                  Name={"placementUnitPrice"}
                  HandleChange={inputHandler}
                  Error={errors.placementUnitPrice}
                  Value={inputState.placementUnitPrice}
                />
                <div className="btn-field">
                  <div className="row gutters-12">
                    <div className="col-md-auto">
                      <button
                        className="button button-round button-shadow button-width-large"
                        title={t("save")}
                        onClick={handleConfirmationPopup}
                      >
                        {t("save")}
                      </button>
                    </div>
                    <div className="col-md-auto">
                      <button
                        className="button button-round button-border button-dark"
                        onClick={() => history.goBack()}
                        title={t("cancel")}
                      >
                        {t("cancel")}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <UpdateSubscriptionModal
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        handleEditPlan={handleEditPlan}
      />
      {isUpdating && <Loader />}
    </div>
  );
}

export default withTranslation()(EditSubscription);
