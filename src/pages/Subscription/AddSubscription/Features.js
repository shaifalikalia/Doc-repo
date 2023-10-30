import React, { Fragment, useState } from "react";
import { Col, Row } from "reactstrap/lib";
import styles from "./PricingPlan.module.scss";
import { Alert } from "reactstrap";
import constants from "../../../constants";
import useToGetFeaturesList from "hooks/useToGetFeaturesList";
import BasicPriceDetailModal from "./BasicPriceDetailModal";
import ComparisionFeatureModal from "./ComparisionFeatureModal";
import Loader from "components/Loader";
import { useSelector } from "react-redux";
import EnterpriseDetailModal from "./EnterpriseDetailModal";

const { subscriptionTypesArray, subscriptionType } = constants;

export default function Features({
  t,
  closeProfessionalModel,
  isEnterPrisePlanExist,
  selectedDropDownValue,
  professionalSubscriptionModalOpen,
  planList,
}) {
  // Return null If we select free and trail subscription
  const [openComparisonModel, setopenComparisonModel] = useState(false);
  const [isBasicPriceDetailModalOpen, setisBasicPriceDetailModalOpen] =
    useState(false);
  const [isEnterPriseModel, setIsEnterPriseModel] = useState(false);

  const curreny = useSelector((e) => e.userProfile.profile.countryId);
  const { subscriptionFeatures, isLoading, methods } = useToGetFeaturesList({
    t,
  });

  const heading = () => {
    if (isEnterPrisePlanExist) {
      return t("accountOwner.featureIncludedInEnterPrisePlan");
    }

    let headings = {
      1: t("accountOwner.featureIncludedInBasicPlan"),
      2: t("accountOwner.featureIncludedInAdvancedPlan"),
      3: t("accountOwner.featureIncludedInProfessionalPlan"),
    };
    return headings[selectedDropDownValue];
  };

  return (
    <div>
      <>
        {isLoading && <Loader />}
        {(subscriptionTypesArray.includes(selectedDropDownValue) ||
          isEnterPrisePlanExist) && (
          <Alert className={styles["basic-plan-box"]}>
            <h3> {heading()}</h3>
            <hr />
            <div className={styles["basic-plan-box-container"]}>
              {!!subscriptionFeatures?.length &&
                subscriptionFeatures.map((item) => {
                  let isCategoryVisible = !!item?.moduleFeature?.find(
                    (detail) => {
                      if (
                        subscriptionType.basic === selectedDropDownValue &&
                        detail.isBasic
                      )
                        return true;
                      if (
                        subscriptionType.advanced === selectedDropDownValue &&
                        detail.isAdvance
                      )
                        return true;
                      if (
                        (subscriptionType.professional ===
                          selectedDropDownValue ||
                          isEnterPrisePlanExist) &&
                        detail.isProfessional
                      )
                        return true;
                    }
                  );
                  if (!isCategoryVisible) return false;

                  return (
                    <Fragment key={item.id}>
                      <h4>{item.categoryName}</h4>
                      <Row className={styles["basic-row"]}>
                        {item?.moduleFeature?.length &&
                          item.moduleFeature.map((list) => {
                            if (
                              subscriptionType.basic ===
                                selectedDropDownValue &&
                              !list.isBasic
                            )
                              return null;
                            if (
                              subscriptionType.advanced ===
                                selectedDropDownValue &&
                              !list.isAdvance
                            )
                              return null;
                            if (
                              subscriptionType.professional ===
                                selectedDropDownValue &&
                              !list.isProfessional
                            )
                              return null;

                            return (
                              <Col
                                lg="6"
                                className={styles["basic-container"]}
                                key={list.id}
                              >
                                <span className={styles["features"]}>
                                  <img
                                    src={
                                      require("assets/images/heavy-check.svg")
                                        .default
                                    }
                                    alt="icon"
                                  />
                                  {list.name}
                                </span>
                              </Col>
                            );
                          })}
                      </Row>
                    </Fragment>
                  );
                })}
            </div>
            <hr />
            <HandleActions
              t={t}
              isEnterPrisePlanExist={isEnterPrisePlanExist}
              setopenComparisonModel={setopenComparisonModel}
              setIsEnterPriseModel={setIsEnterPriseModel}
              setisBasicPriceDetailModalOpen={setisBasicPriceDetailModalOpen}
            />
          </Alert>
        )}

        <div>
          <ComparisionFeatureModal
            isComparisionFeatureModalOpen={openComparisonModel}
            subscriptionFeatures={subscriptionFeatures}
            methods={methods}
            planList={planList}
            curreny={curreny}
            closeComparisionFeatureModal={() => {
              setopenComparisonModel(false);
            }}
          />

          <BasicPriceDetailModal
            isBasicPriceDetailModalOpen={
              isBasicPriceDetailModalOpen || professionalSubscriptionModalOpen
            }
            planList={planList}
            curreny={curreny}
            isEnterPrisePlanExist={isEnterPrisePlanExist}
            planType={
              professionalSubscriptionModalOpen
                ? constants.subscriptionType.professional
                : selectedDropDownValue
            }
            closeBasicPriceDetailModal={() => {
              setisBasicPriceDetailModalOpen(false);
              closeProfessionalModel(false);
            }}
          />

          <EnterpriseDetailModal
            isBasicPriceDetailModalOpen={isEnterPriseModel}
            planList={planList}
            curreny={curreny}
            isEnterPrisePlanExist={isEnterPrisePlanExist}
            planType={
              professionalSubscriptionModalOpen
                ? constants.subscriptionType.professional
                : selectedDropDownValue
            }
            closeBasicPriceDetailModal={() => {
              setIsEnterPriseModel(false);
            }}
          />
        </div>
      </>
    </div>
  );
}

function HandleActions(props) {
  return (
    <div className="d-lg-flex">
      <span
        onClick={() => {
          if (props.isEnterPrisePlanExist) {
            props.setIsEnterPriseModel(true);
          } else {
            props.setisBasicPriceDetailModalOpen(true);
          }
        }}
        className={"d-block d-md-block " + styles["basic-button"]}
        title={props.t("accountOwner.viewPricingDetails")}
      >
        {props.t("accountOwner.viewPricingDetails")}
      </span>
      {!props.isEnterPrisePlanExist && (
        <span
          onClick={() => {
            props.setopenComparisonModel(true);
          }}
          className={"d-block d-md-block " + styles["basic-button"]}
          title={props.t("accountOwner.viewComparisonFeatures")}
        >
          {props.t("accountOwner.viewComparisonFeatures")}
        </span>
      )}
    </div>
  );
}
