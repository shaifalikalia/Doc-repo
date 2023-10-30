import React, { useMemo, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllPlans, getProfile } from "actions/index";
import { Alert, Modal, ModalBody } from "reactstrap";
import Moment from "react-moment";
import moment from "moment";
import styles from "./PricingPlan.module.scss";
import "./PricingPlan.scss";

/*components*/
import CustomSelect from "components/CustomSelect";
import EnterpriseContactModal from "../EnterpriseContact";
import { withTranslation } from "react-i18next";
import constants, { getsubcriptionPlanTitle } from "./../../../constants";
import { Col, Row } from "reactstrap/lib";
import Features from "./Features";

import Loader from "components/Loader";
import { useHistory, useLocation } from "react-router-dom";
import { addPackageSubscription } from "repositories/subscription-repository";
import { handleError, handleSuccess } from "utils";

function AddSubscription({ t }) {
  const location = useLocation();
  const value = useSelector((pre) => pre);
  const profile = value?.userProfile?.profile || {};
  const isProfileSetUp = profile?.userSubscription?.id ? true : false;

  const isLocationState = location?.state;

  const isAvaliableSubscriptionPlans = useMemo(() => {
    if (isProfileSetUp) {
      return [
        { name: t("subscriptionPlanTypes.basic"), id: 1 },
        { name: t("subscriptionPlanTypes.advanced"), id: 2 },
        { name: t("subscriptionPlanTypes.professional"), id: 3 },
        { name: t("subscriptionPlanTypes.enterprise"), id: 6 },
      ];
    }

    return [
      { name: t("subscriptionPlanTypes.basic"), id: 1 },
      { name: t("subscriptionPlanTypes.advanced"), id: 2 },
      { name: t("subscriptionPlanTypes.professional"), id: 3 },
      { name: t("subscriptionPlanTypes.free"), id: 4 },
      { name: t("subscriptionPlanTypes.trial"), id: 5 },
      { name: t("subscriptionPlanTypes.enterprise"), id: 6 },
    ];
  });

  const start = moment().add(30, "days");
  const { isLoading, planList } = value?.sub || {};
  const dispatch = useDispatch();
  const history = useHistory();
  const [isMultipleOffice, setIsMultipleOffice] = useState(false);
  const [isEnterPrisePlanExist, setIsEnterPrisePlanExist] = useState(false);

  const [subscriptionPlans, setSubscriptionPlans] = useState([]);

  const [isSingleOfficeDisabed, setIsSingleOfficeDisabed] = useState(false);
  const [enterpriseModel, setEnterpriseModel] = useState(false);
  const [confimrationModel, setConfimrationModel] = useState(false);
  const [currentPlan, setCurrentPlan] = useState({});
  const [isLoader, setIsLoader] = useState(false);
  const [
    professionalSubscriptionModalOpen,
    setProfessionalSubscriptionModalOpen,
  ] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState({});
  const showLoader = isLoading || isLoader;

  const selectOfRadioFor = [
    constants.subscriptionType.basic,
    constants.subscriptionType.advanced,
    constants.subscriptionType.professional,
    constants.subscriptionType.trial,
  ];

  useEffect(() => {
    // Fetch all plans
    dispatch(getAllPlans());
  }, []);

  useEffect(() => {
    if (
      Array.isArray(planList) &&
      planList.find((item) => item.type === "enterprise" && item.id)
    ) {
      let filterList = planList.filter(
        (item) => item.type === "enterprise" && item.id
      );
      setSubscriptionPlans(filterList);
      setIsEnterPrisePlanExist(true);
      setSelectedPlan(filterList[0]);
    }
    if (
      Array.isArray(planList) &&
      !planList.find((item) => item.type === "enterprise" && item.id)
    ) {
      setSubscriptionPlans(isAvaliableSubscriptionPlans);
      setIsEnterPrisePlanExist(false);
      setSelectedPlan(
        isLocationState && isProfileSetUp
          ? isAvaliableSubscriptionPlans[0]
          : isAvaliableSubscriptionPlans[4]
      );
    }
  }, [planList]);

  useEffect(() => {
    planList?.length && refechPrevValue();
  }, [value, planList]);

  const refechPrevValue = () => {
    try {
      if (profile?.profileSetupStep === "completed" && !isLocationState) {
        history.push("/");
      }

      if (
        isLocationState?.planType &&
        profile?.userSubscription &&
        planList?.length
      ) {
        let existPlan = location.state.planType || {};
        let plan = null;
        let defatultItem = subscriptionPlans.find(
          (item) => item.id === existPlan?.subscriptionPlan
        );
        plan = planList.find(
          (item) => item.id === parseInt(location.state.planType.packageId)
        );
        defatultItem && setSelectedPlan(defatultItem);
        if (plan) {
          setIsMultipleOffice(!plan.isMultipleOffice);
          setIsSingleOfficeDisabed(plan.isMultipleOffice ? false : true);
          setCurrentPlan(plan);
        }
      }
    } catch (err) {
      handleError(err);
    }
  };

  const handleRadio = (inputValue) => {
    setIsMultipleOffice(Boolean(inputValue));
  };

  const disabledRadio = (radioType) => {
    try {
      const { radioTypeSubscription } = constants;
      if (!currentPlan?.id) return false;
      const selectedId = selectedPlan?.id;

      if (
        isSingleOfficeDisabed &&
        currentPlan?.subscriptionPlan === selectedId &&
        radioType === radioTypeSubscription.SINGLE
      ) {
        return true;
      }

      if (
        !isSingleOfficeDisabed &&
        currentPlan?.subscriptionPlan === selectedId &&
        radioType === radioTypeSubscription.MULTIPLE
      ) {
        return true;
      }
    } catch (err) {
      handleError(err);
    }
  };

  const handleSelect = (inputValue) => {
    setSelectedPlan(inputValue);
    // If selected value is enterprice to open a model
    if (inputValue.id === constants.subscriptionType.enterprise) {
      setEnterpriseModel(true);
    }

    if (currentPlan?.subscriptionPlan === inputValue.id) {
      setIsMultipleOffice(!currentPlan.isMultipleOffice);
    }
  };

  const renderPageHeader = () => {
    if (selectedPlan?.id === constants.subscriptionType.free) {
      return (
        <>
          <h2 className="title">
            {t("accountOwner.startFreeSubscriptionToday")}
          </h2>
          <div className="title-description">
            {t("accountOwner.freePackageDescription")}
          </div>
        </>
      );
    }
    return <h2 className="title">{t("accountOwner.confirmSubscription")}</h2>;
  };

  const showStartTime = useMemo(() => {
    if (selectedPlan?.id === constants.subscriptionType.trial) {
      return (
        <div className="free-trial">
          <h3>{t("accountOwner.startTrialNow")}</h3>
        </div>
      );
    }
    return null;
  }, [selectedPlan]);

  const closeConfirmatioModel = () => {
    setConfimrationModel(false);
  };

  const handleSubOfficeSelect = () => {
    try {
      let selectedPackage = {};
      if (selectedPlan.type !== "enterprise") {
        selectedPackage =
          planList.find((item) => {
            if (
              item.subscriptionPlan === constants.subscriptionType.free &&
              item.subscriptionPlan === selectedPlan?.id
            ) {
              return true;
            }
            if (item.subscriptionPlan !== constants.subscriptionType.free) {
              return (
                item.subscriptionPlan === selectedPlan?.id &&
                item.isMultipleOffice === isMultipleOffice
              );
            }
            return null;
          }) || {};
      } else {
        selectedPackage = selectedPlan;
      }

      history.push({
        pathname: constants.routes.accountOwner.selectOffice,
        state: {
          packageId: selectedPackage?.id
            ? parseInt(selectedPackage.id)
            : location.state.planType.packageId,
          type: selectedPackage?.type,
        },
      });
    } catch (err) {
      handleError(err);
    }
  };

  const closeEnterPriceModal = () => {
    setEnterpriseModel(false);
    setSelectedPlan(
      isLocationState ? subscriptionPlans[0] : subscriptionPlans[4]
    );
  };

  const buyPackage = async () => {
    try {
      setIsLoader(true);
      let selectedPackage = {};
      if (selectedPlan.type !== "enterprise") {
        selectedPackage =
          planList.find((item) => {
            if (
              item.subscriptionPlan === constants.subscriptionType.free &&
              item.subscriptionPlan === selectedPlan?.id
            ) {
              return true;
            }

            if (item.subscriptionPlan !== constants.subscriptionType.free) {
              return (
                item.subscriptionPlan == selectedPlan?.id &&
                item.isMultipleOffice === isMultipleOffice
              );
            }
          }) || {};
      } else {
        selectedPackage = selectedPlan;
      }

      let payload = {
        packageId: selectedPackage?.id
          ? parseInt(selectedPackage.id)
          : location.state.planType.id,
        officeIds: null,
      };

      let res = await addPackageSubscription(payload);
      dispatch(getProfile());
      handleSuccess(res.message);
    } catch (error) {
      handleError(error);
    }
    setIsLoader(false);
  };

  const changeConfirm = () => (
    <Modal
      isOpen={confimrationModel}
      className="modal-dialog-centered  change-plan-modal"
      modalClassName="custom-modal"
      toggle={closeConfirmatioModel}
    >
      <span className="close-btn" onClick={closeConfirmatioModel}>
        <img src={require("assets/images/cross.svg").default} alt="close" />
      </span>
      <ModalBody>
        <div className="change-modal-content ">
          <p>{t("accountOwner.changePlanConfirmation")}</p>
          <button
            className="button button-round button-shadow  button-min-100"
            title={t("ok")}
            onClick={handleSubOfficeSelect}
          >
            {t("ok")}
          </button>
        </div>
      </ModalBody>
    </Modal>
  );

  return (
    <div>
      {showLoader && <Loader />}
      <div className={"add-subscription-block " + styles["add-subscription"]}>
        <div className="container container-smd">
          {renderPageHeader()}
          <div className="add-block">
            <div className="row no-gutters ">
              {isLocationState?.planType?.subscriptionPlan && (
                <div className="alert-img-icon custom-mb-40 align-items-md-center">
                  <span className="alert-image">
                    {" "}
                    <img
                      src={
                        require("assets/images/alert-circle-black.svg").default
                      }
                      alt="icon"
                    />{" "}
                  </span>
                  <div className="alert-content">
                    {t("currentlyUsingPackage", {
                      field: getsubcriptionPlanTitle(
                        isLocationState?.planType?.subscriptionPlan
                      ),
                    })}
                  </div>
                </div>
              )}

              <div className="col-md-8">
                {showStartTime}
                <Row>
                  <Col md="8">
                    <div className="field-group">
                      <div className="custom-dropdown-only custom-subsription-plan ">
                        <CustomSelect
                          Title={t("accountOwner.chooseSubscription")}
                          options={subscriptionPlans}
                          id={"Type"}
                          dropdownClasses={"custom-select-scroll"}
                          selectedOption={selectedPlan}
                          selectOption={handleSelect}
                        />
                      </div>
                      {selectedPlan?.id ===
                        constants.subscriptionType.trial && (
                        <span className="error-msg">
                          {t("accountOwner.freeTrialEndsOn")}{" "}
                          <Moment
                            date={start}
                            format="dddd, MMMM Do YYYY"
                          ></Moment>
                        </span>
                      )}
                    </div>

                    {!isLocationState &&
                      constants.subscriptionTypesArray.includes(
                        selectedPlan?.id
                      ) && (
                        <Alert
                          color="warning"
                          className={
                            "event-alert-box mt-0 " + styles["basic-alert"]
                          }
                        >
                          {t("accountOwner.paidAlert")}
                        </Alert>
                      )}
                  </Col>
                </Row>

                {selectOfRadioFor.includes(selectedPlan?.id) && (
                  <div className={"ch-radio c-field " + styles["ch-radio"]}>
                    <div className={styles["select-office"]}>
                      {" "}
                      <label className="pb-3">
                        {" "}
                        {t("accountOwner.selectNoOfOffice")}
                      </label>
                    </div>
                    <label className={styles["label"]}>
                      <input
                        type="radio"
                        name="office"
                        disabled={disabledRadio(
                          constants.radioTypeSubscription.SINGLE
                        )}
                        checked={!isMultipleOffice}
                        onChange={() => handleRadio(false)}
                      />
                      <span> {t("accountOwner.singleOffice")} </span>
                    </label>

                    <label
                      className={
                        styles["label"] + " " + styles["multiple-office"]
                      }
                    >
                      <input
                        type="radio"
                        name="office"
                        disabled={disabledRadio(
                          constants.radioTypeSubscription.MULTIPLE
                        )}
                        checked={isMultipleOffice}
                        onChange={() => handleRadio(true)}
                      />
                      <span>{t("accountOwner.multipleOffices")}</span>
                    </label>
                  </div>
                )}
              </div>

              <Features
                t={t}
                closeProfessionalModel={() =>
                  setProfessionalSubscriptionModalOpen(false)
                }
                professionalSubscriptionModalOpen={
                  professionalSubscriptionModalOpen
                }
                planList={planList}
                selectedDropDownValue={selectedPlan?.id}
                isEnterPrisePlanExist={isEnterPrisePlanExist}
              />

              {selectedPlan?.id === constants.subscriptionType.trial && (
                <div className="alert-img-icon ">
                  <div className="alert-image">
                    <img
                      src={
                        require("assets/images/alert-circle-black.svg").default
                      }
                      alt="icon"
                    />
                  </div>
                  <div className="alert-content">
                    {t("accountOwner.alerttrial")}
                    <span
                      onClick={() => {
                        setProfessionalSubscriptionModalOpen(true);
                      }}
                    >
                      <u className="pointer">
                        <b> {t("accountOwner.ViewDetails")}</b>
                      </u>
                    </span>
                  </div>
                </div>
              )}

              {/* this if for when user comes after signUp proccess */}
              <div className="col-md-12">
                {!profile.userSubscription && selectedPlan?.id && (
                  <div className={"button-block custom-button-block"}>
                    <button
                      className="button button-round button-shadow"
                      title={t("accountOwner.paySubscription")}
                      onClick={() => buyPackage()}
                    >
                      {selectedPlan?.id === constants.subscriptionType.trial
                        ? t("accountOwner.startYourFreeTrial")
                        : t("userPages.plan.getStarted")}
                    </button>
                  </div>
                )}

                {/* this check when user already purchased a subscription */}
                {profile.userSubscription && selectedPlan?.id && (
                  <div className="button-block">
                    <button
                      className="button button-round button-shadow"
                      title={t("accountOwner.paySubscription")}
                      onClick={() => setConfimrationModel(true)}
                    >
                      {t("accountOwner.paySubscription")}
                    </button>
                  </div>
                )}

                {confimrationModel && changeConfirm()}
                <EnterpriseContactModal
                  show={enterpriseModel}
                  closeModal={closeEnterPriceModal}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withTranslation()(AddSubscription);
