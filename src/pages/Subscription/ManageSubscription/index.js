import Loader from "components/Loader";
import React, { useEffect, useState, Fragment, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getSubscriptionDetail,
  useToGetSubsValid,
  cancelSubscription,
} from "repositories/subscription-repository";
import { handleError, handleSuccess, convertIntoTwoDecimal } from "utils";
import Empty from "components/Empty";
import CancelSubscription from "./CancelSubscription";
import { withTranslation } from "react-i18next";
import constants, {
  getsubcriptionPlanTitle,
  getcurreny,
} from "./../../../constants";
import { useHistory, Link } from "react-router-dom";
import useHandleApiError from "hooks/useHandleApiError";
import { getProfile } from "actions/index";
import EnterpriseContactModal from "../EnterpriseContact";
import { getAllPlans } from "actions/index";

function AccountManageSubscription({ t }) {
  const profile = useSelector((pre) => pre?.userProfile?.profile);
  const { isLoading: isLoaderPlan, planList } = useSelector((pre) => pre?.sub);

  const [isLoader, setIsLoader] = useState(false);
  const [curPlanDetail, setCurPlanDetail] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [isEnterPrise, setIsEnterPrise] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch all plans
    dispatch(getAllPlans());
  }, []);

  const {
    data: subValidDate,
    error: subError,
    isLoading,
    isFetching,
  } = useToGetSubsValid();
  useHandleApiError(isLoading, isFetching, subError);
  const history = useHistory();

  useEffect(() => {
    profile?.id && getSubscriptionData();
  }, []);

  const getSubscriptionData = async () => {
    try {
      setIsLoader(true);
      const subscriptionData = await getSubscriptionDetail(profile.id);
      subscriptionData.data && setCurPlanDetail(subscriptionData.data);
    } catch (error) {
      handleError(error);
    }
    setIsLoader(false);
  };

  const subDetails = useMemo(() => {
    let subscriptionObj = {};
    if (curPlanDetail?.currency) {
      let currency = getcurreny(curPlanDetail?.currency);
      subscriptionObj.setupFee = `${currency} ${convertIntoTwoDecimal(
        curPlanDetail?.setupFee
      )}`;
      subscriptionObj.officeCharges = `${currency} ${convertIntoTwoDecimal(
        curPlanDetail?.perOfficeCharge
      )}${t("perMonthperOffice")}`;
      subscriptionObj.permanentStaff = `${currency} ${convertIntoTwoDecimal(
        curPlanDetail?.perPermanentStaffCharge
      )}${t("perMonthperStaff")}`;
      subscriptionObj.tempraryStaff = `${currency} ${convertIntoTwoDecimal(
        curPlanDetail?.perTemporaryStaffCharge
      )}${t("perMonthperStaff")}`;
      subscriptionObj.perStaff = `${currency} ${convertIntoTwoDecimal(
        curPlanDetail?.perPlacementCharge
      )}${t("perStaff")}`;
    }

    return subscriptionObj;
  }, [curPlanDetail]);

  const { setupFee, officeCharges, permanentStaff, tempraryStaff, perStaff } =
    subDetails;

  const handleChangePlan = () => {
    if (subValidDate?.hours <= 24) {
      handleError({ message: t("changeSubscription24") }, { duration: 6000 });
      return false;
    }

    if (!planList?.length) {
      setIsEnterPrise(true);
      return false;
    }

    history.push("/add-subscription", {
      changePlan: true,
      planType: curPlanDetail,
    });
  };

  const toogleModel = () => {
    setOpenModal((prev) => !prev);
  };

  const terminateSubscription = async () => {
    try {
      setIsLoader(true);
      let res = await cancelSubscription({ cancelImmediately: true });
      toogleModel();
      handleSuccess(res.message, { duration: 2000 });
      dispatch(getProfile());
    } catch (err) {
      handleError(err);
    }
    setIsLoader(false);
  };

  return (
    <div>
      {(isLoader || isLoading || isLoaderPlan) && <Loader />}
      <div className="mange-sub-section">
        <div className="container container-smd">
          <h2 className="title">{t("accountOwner.mySubscription")}</h2>
          {curPlanDetail && (
            <div className="cur-plan-block">
              <div className="d-block d-sm-flex justify-content-between">
                <div>
                  {" "}
                  <h3 className="mb-3 mb-sm-0">{t("currentSubscription")}</h3>
                </div>
                <div>
                  {" "}
                  <h3>
                    {getsubcriptionPlanTitle(curPlanDetail.subscriptionPlan)}
                  </h3>
                </div>
              </div>
              <div className="data-list">
                <ul>
                  {curPlanDetail.packageType === "enterprise" && (
                    <Fragment>
                      <li>
                        <label>{t("accountOwner.enterpriseName")}</label>
                        <span>{curPlanDetail?.packageName}</span>
                      </li>
                    </Fragment>
                  )}

                  <li>
                    <label>{t("superAdmin.setUpFees")}</label>
                    <span>{setupFee}</span>
                  </li>
                  <li>
                    <label>{t("superAdmin.officeCharges")}</label>
                    <span>{officeCharges}</span>
                  </li>
                  <li>
                    <label>{t("perActivePermanentStaffMember")}</label>
                    <span>{permanentStaff}</span>
                  </li>
                  <li>
                    <label>{t("perActiveTemporaryStaffMember")}</label>
                    <span>{tempraryStaff}</span>
                  </li>
                  <li>
                    <label>{t("perEachPlacement")}</label>
                    <span>{perStaff}</span>
                  </li>
                  <li className="d-none">
                    <label>{t("superAdmin.endDateOfTrialAccount")}</label>
                    <span>
                      {t("cad")} {"May 25, 2023"}
                    </span>
                  </li>
                </ul>
              </div>

              <div className="button-block">
                <div className="row gutters-10">
                  <div className="col-md-auto ">
                    <button
                      className="button button-round button-shadow custom-btn manage-subscription-btn"
                      title={t("accountOwner.changeSubscription")}
                      onClick={handleChangePlan}
                    >
                      {t("accountOwner.changeSubscription")}
                    </button>
                  </div>

                  {profile.userSubscription.packageType !==
                    constants.packageTypes.trial &&
                    profile.userSubscription.packageType !==
                      constants.packageTypes.free && (
                      <div className="col-md-auto">
                        <Link
                          to={constants.routes.accountOwner.manageCards}
                          className="button button-round button-shadow custom-btn manage-subscription-btn2"
                          title={t("accountOwner.manageCards")}
                        >
                          {t("accountOwner.manageCards")}
                        </Link>
                      </div>
                    )}
                  <div className="col-md-auto mb-4">
                    <button
                      className="button button-round button-border button-dark custom-border"
                      title={t("accountOwner.terminateSubscription")}
                      onClick={toogleModel}
                    >
                      {t("accountOwner.terminateSubscription")}
                    </button>
                  </div>
                  {profile?.userSubscription?.subscriptionPlan !==
                    constants.subscriptionType.free && (
                    <div className="col-md-auto ">
                      <Link
                        to={constants.routes.accountOwner.viewFeatures}
                        className="button button-round button-border button-dark custom-border "
                        title={t("accountOwner.manageCards")}
                      >
                        {t("accountOwner.viewFeatures")}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <EnterpriseContactModal
            show={isEnterPrise}
            closeModal={() => {
              setIsEnterPrise(false);
            }}
          />

          {(subError || !subDetails) && (
            <Empty Message={t("accountOwner.noPlanSubscribedYet")} />
          )}
          {openModal && (
            <CancelSubscription
              show={openModal}
              isLoader={isLoader}
              closeModal={toogleModel}
              CancelPlan={terminateSubscription}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default withTranslation()(AccountManageSubscription);
