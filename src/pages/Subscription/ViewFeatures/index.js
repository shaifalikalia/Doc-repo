import React, { Fragment, useMemo } from "react";
import {
  useToGetListOfSubscriptionFeaturesOfOwner,
  useToGetListOfSubscriptionFeatures,
} from "repositories/subscription-repository";
import { useSelector } from "react-redux";
import useHandleApiError from "hooks/useHandleApiError";
import Page from "components/Page";
import Card from "components/Card";
import { withTranslation } from "react-i18next";
import constants, { getsubcriptionPlanTitle } from "../../../constants";
import { useHistory } from "react-router-dom";
import { Col, Row } from "reactstrap/lib";
import Empty from "components/Empty";
import Loader from "components/Loader";
import styles from "./ViewFeature.module.scss";
import alertLogo from "../../../assets/images/alert-circle-black.svg";

function View({ t }) {
  const profile = useSelector((e) => e.userProfile.profile);
  const history = useHistory();
  const isTrial =
    profile?.userSubscription?.subscriptionPlan ===
    constants.subscriptionType.trial;
  const isEnterPrise =
    profile?.userSubscription?.subscriptionPlan ===
    constants.subscriptionType.enterprise;

  const subscriptionModuleCategory = {
    1: t("userPages.plan.officStaffManagement"),
    2: t("userPages.plan.StaffManagementCollaboration"),
    3: t("userPages.plan.virtualHr"),
    4: t("userPages.plan.doctorsCollaboration"),
    5: t("userPages.plan.patientEngagement"),
    6: t("userPages.plan.supplyManagement"),
    7: t("userPages.plan.supportTraining"),
  };

  const {
    data: planData,
    isLoading: planisLoading,
    isFetching: planIsFetching,
    error: planIsError,
  } = useToGetListOfSubscriptionFeatures({
    enabled: isTrial || isEnterPrise,
  });
  useHandleApiError(planisLoading, planIsFetching, planIsError);

  const { data, isLoading, isFetching, error } =
    useToGetListOfSubscriptionFeaturesOfOwner(profile?.id, {
      enabled: !isTrial || !isEnterPrise,
    });
  useHandleApiError(isLoading, isFetching, error);

  const subscriptionData = useMemo(() => {
    if (data?.planFeature?.length) {
      const category = [
        {
          categoryId: 1,
          moduleFeature: [],
          categoryName: t("userPages.plan.officStaffManagement"),
        },
        {
          categoryId: 2,
          moduleFeature: [],
          categoryName: t("userPages.plan.StaffManagementCollaboration"),
        },
        {
          categoryId: 3,
          moduleFeature: [],
          categoryName: t("userPages.plan.virtualHr"),
        },
        {
          categoryId: 4,
          moduleFeature: [],
          categoryName: t("userPages.plan.doctorsCollaboration"),
        },
        {
          categoryId: 5,
          moduleFeature: [],
          categoryName: t("userPages.plan.patientEngagement"),
        },
        {
          categoryId: 6,
          moduleFeature: [],
          categoryName: t("userPages.plan.supplyManagement"),
        },
        {
          categoryId: 7,
          moduleFeature: [],
          categoryName: t("userPages.plan.supportTraining"),
        },
      ];
      data?.planFeature.forEach((element) => {
        category.forEach((list, index) => {
          if (element.category === list.categoryId && element.isAvailable) {
            category[index].moduleFeature.push(element);
          }
        });
      });
      return category;
    }
    return [];
  }, [data?.planFeature]);

  const trailPlanDetails = useMemo(() => {
    if (Array.isArray(planData) && planData.length) {
      let subscriptionFeaturesModify = planData.map((item) => {
        item.categoryName = subscriptionModuleCategory[item.category];
        item.isOpen = false;
        return item;
      });
      return subscriptionFeaturesModify;
    }
    return [];
  }, [planData]);

  let featuresView = null;

  if (isTrial || isEnterPrise) {
    featuresView = (
      <Fragment>
        {trailPlanDetails?.length > 0 ? (
          trailPlanDetails.map((item) => {
            let isCategoryVisible = !!item?.moduleFeature?.find(
              (detail) => detail.isProfessional
            );
            if (!isCategoryVisible) return false;

            return (
              <Fragment key={item.id}>
                <div className={styles["card-interior-heading"]}>
                  {item?.categoryName}
                </div>
                <Row className={styles["basic-row"]}>
                  {item?.moduleFeature?.length &&
                    item.moduleFeature.map((list) => {
                      if (!list.isProfessional) {
                        return null;
                      } else {
                        return (
                          <Col
                            lg="6"
                            key={list?.id}
                            className={styles["card-col"]}
                          >
                            <span className={styles["card-data"]}>
                              <img
                                className={styles["check-img"]}
                                src={
                                  require("assets/images/heavy-check.svg")
                                    .default
                                }
                                alt="icon"
                              />
                              <div className={styles["main-data"]}>
                                {list?.name}
                              </div>
                            </span>
                          </Col>
                        );
                      }
                    })}
                </Row>
              </Fragment>
            );
          })
        ) : (
          <Empty Message={t("noRecordFound")} />
        )}
      </Fragment>
    );
  } else {
    featuresView = (
      <Fragment>
        {subscriptionData.length > 0 ? (
          subscriptionData.map((item) => {
            if (!item?.moduleFeature?.length) return null;

            return (
              <Fragment key={item?.id}>
                <div className={styles["card-interior-heading"]}>
                  {item?.categoryName}
                </div>
                <Row>
                  {item?.moduleFeature?.length &&
                    item.moduleFeature.map((list) => {
                      return (
                        <Col
                          lg="6"
                          key={list?.id}
                          className={styles["card-col"]}
                        >
                          <span className={styles["card-data"]}>
                            <img
                              className={styles["check-img"]}
                              src={
                                require("assets/images/heavy-check.svg").default
                              }
                              alt="icon"
                            />
                            <div className={styles["main-data"]}>
                              {list?.name}
                            </div>
                          </span>
                        </Col>
                      );
                    })}
                </Row>
              </Fragment>
            );
          })
        ) : (
          <Empty Message={t("noRecordFound")} />
        )}
      </Fragment>
    );
  }

  return (
    <Page
      className={styles["subscriptionDataPage"]}
      title={t("features")}
      onBack={() => history.push(constants.routes.accountOwner.managePlan)}
    >
      {isLoading && <Loader />}
      <Card className={styles["subscriptionDataCard1"]}>
        <div className={styles["top-div"]}>
          <div className={styles["top-div-logo"]}>
            <img src={alertLogo} alt="icon" />
          </div>
          <div className={styles["top-div-para"]}>
            {t("userPages.currentrlUsingProffessionalText", {
              field: getsubcriptionPlanTitle(
                isTrial
                  ? constants.subscriptionType.trial
                  : data?.subscriptionPlan
              ),
            })}
          </div>
        </div>

        <Card className={styles["subscriptionDataCard2"]}>
          <div className={styles["card-title"]}>
            {t("userPages.featuresAddediInProfessionalPlan", {
              field: getsubcriptionPlanTitle(
                isTrial
                  ? constants.subscriptionType.trial
                  : data?.subscriptionPlan
              ),
            })}
          </div>
          <div className={styles["line"]}></div>
          {featuresView}
        </Card>
      </Card>
    </Page>
  );
}
export default withTranslation()(View);
