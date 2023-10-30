import React, { useState, useEffect } from "react";
import { withTranslation } from "react-i18next";
import PricingDetailsBasicModal from "./component/PricingDetailsBasicModal";
import useToGetFeaturesList from "hooks/useToGetFeaturesList";

const RESPONSIVE_WIDTH = 991;
const HomePlansNew = ({ t, SignupClick , hideTitle }) => {
  const { selectedPlan, subscriptionFeatures, subscriptionType, methods } =
    useToGetFeaturesList({ t });
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(0);

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getFeaturesTdClass = (index) => {
    return `${windowWidth <= RESPONSIVE_WIDTH} ? width-50 : '' ${
      selectedPlanIndex !== index && windowWidth <= RESPONSIVE_WIDTH
        ? "d-none"
        : ""
    }`;
  };

  return (
    <div className="home-plans-new" id="sub-details">
      <div className="container">
        {
           hideTitle === true ? null 
           : <h2>{t("userPages.plan.title")}</h2>
        }

        <div className="right-block plan-container">
          <div
            className={`free plan ${
              selectedPlanIndex !== 0 && windowWidth <= RESPONSIVE_WIDTH
                ? "d-none"
                : ""
            }`}
          >
            <div className="d-flex justify-content-between d-lg-none mb-3 arrow-container">
              <div></div>
              <img
                src={require("assets/images/right-arrow.svg").default}
                alt="icon"
                onClick={() => setSelectedPlanIndex(selectedPlanIndex + 1)}
                className="arrow cursor-pointer"
              />
            </div>
            <h3>{t("userPages.plan.free")}</h3>
            <p>{t("userPages.plan.findNewPatiientsOnline")}</p>
            <button
              className="button button-round button-shadow button-block"
              onClick={SignupClick}
              title={t("userPages.plan.getStarted")}
            >
              {t("userPages.plan.getStarted")}
            </button>
          </div>
          <div
            className={`basic-others plan ${
              selectedPlanIndex !== 1 && windowWidth <= RESPONSIVE_WIDTH
                ? "d-none"
                : ""
            }`}
          >
            <div className="d-flex justify-content-between d-lg-none mb-3 arrow-container">
              <img
                className="arrow cursor-pointer"
                onClick={() => setSelectedPlanIndex(selectedPlanIndex - 1)}
                src={require("assets/images/left-arrow.svg").default}
                alt="icon"
              />
              <img
                src={require("assets/images/right-arrow.svg").default}
                alt="icon"
                onClick={() => setSelectedPlanIndex(selectedPlanIndex + 1)}
                className="arrow cursor-pointer"
              />
            </div>
            <h3>{t("userPages.plan.basic")}</h3>
            <span>{t("userPages.plan.freeTrialIstMonth")}</span>
            <span
              className="viewPricing"
              onClick={() => {
                methods.setSelectedPlan(subscriptionType.basic);
              }}
            >
              {t("userPages.plan.viewPricing")}
            </span>

            <p>{t("userPages.plan.manageStaffcost")}</p>
            <button
              className="button button-round button-border button-dark button-block mb-2"
              onClick={SignupClick}
              title={t("userPages.plan.cta1")}
            >
              {t("userPages.plan.cta1")}
            </button>
            <button
              onClick={SignupClick}
              className="button button-round button-shadow button-block"
              title={t("userPages.plan.cta1")}
            >
              {t("userPages.plan.cta2")}
            </button>
          </div>
          <div
            className={`basic-others plan ${
              selectedPlanIndex !== 2 && windowWidth <= RESPONSIVE_WIDTH
                ? "d-none"
                : ""
            }`}
          >
            <div className="d-flex justify-content-between d-lg-none mb-3 arrow-container">
              <img
                className="arrow cursor-pointer"
                onClick={() => setSelectedPlanIndex(selectedPlanIndex - 1)}
                src={require("assets/images/left-arrow.svg").default}
                alt="icon"
              />
              <img
                src={require("assets/images/right-arrow.svg").default}
                alt="icon"
                onClick={() => setSelectedPlanIndex(selectedPlanIndex + 1)}
                className="arrow cursor-pointer"
              />
            </div>
            <h3>{t("userPages.plan.advanced")}</h3>
            <span>{t("userPages.plan.freeTrialIstMonth")}</span>
            <span
              onClick={() => {
                methods.setSelectedPlan(subscriptionType.advanced);
              }}
              className="viewPricing"
            >
              {t("userPages.plan.viewPricing")}
            </span>
            <p className="advance-para">
              {t("userPages.plan.staffManagement")}
            </p>
            <button
              onClick={SignupClick}
              className="button button-round button-border button-dark button-block mb-2"
              title={t("userPages.plan.cta1")}
            >
              {t("userPages.plan.cta1")}
            </button>
            <button
              onClick={SignupClick}
              className="button button-round button-shadow button-block"
              title={t("userPages.plan.cta1")}
            >
              {t("userPages.plan.cta2")}
            </button>
          </div>
          <div
            className={`basic-others plan ${
              selectedPlanIndex !== 3 && windowWidth <= RESPONSIVE_WIDTH
                ? "d-none"
                : ""
            }`}
          >
            <div className="d-flex justify-content-between d-lg-none mb-3 arrow-container">
              <img
                onClick={() => setSelectedPlanIndex(selectedPlanIndex - 1)}
                className="arrow cursor-pointer"
                src={require("assets/images/left-arrow.svg").default}
                alt="icon"
              />
            </div>
            <h3>{t("userPages.plan.professional")}</h3>
            <span>{t("userPages.plan.freeTrialIstMonth")}</span>
            <span
              onClick={() => {
                methods.setSelectedPlan(subscriptionType.professional);
              }}
              className="viewPricing"
            >
              {t("userPages.plan.viewPricing")}
            </span>
            <p>{t("userPages.plan.inventoryOrder")}</p>
            <button
              onClick={SignupClick}
              className="button button-round button-border button-dark button-block mb-2"
              title={t("userPages.plan.cta1")}
            >
              {t("userPages.plan.cta1")}
            </button>
            <button
              onClick={SignupClick}
              className="button button-round button-shadow button-block"
              title={t("userPages.plan.cta1")}
            >
              {t("userPages.plan.cta2")}
            </button>
          </div>
        </div>

        {!!subscriptionFeatures?.length &&
          subscriptionFeatures?.map((item) => {
            let isCategoryVisible = !!item?.moduleFeature?.find((detail) => {
              return (
                detail.isBasic || detail.isAdvance || detail.isProfessional
              );
            });
            if (!isCategoryVisible) return false;

            return (
              <table className="feature-comparision-table" key={item.category}>
                <thead>
                  <tr onClick={() => methods.openCollapseTab(item.category)}>
                    <th>
                      <div className="text-left" >{item?.categoryName}</div>
                    </th>
                    <th className="custom-width-heading"></th>
                    <th className="custom-width-heading"></th>
                    <th className="custom-width-heading"></th>
                    <th>
                      {" "}
                      <div className="circle">
                        {item.isOpen ? (
                          <img
                            src={require("assets/images/remove.svg").default}
                            alt="icon"
                          />
                        ) : (
                          <img
                            src={require("assets/images/add.svg").default}
                            alt="icon"
                          />
                        )}
                      </div>
                    </th>
                  </tr>
                </thead>
                {item.isOpen && (
                  <tbody className="content">
                    {!!item?.moduleFeature?.length &&
                      item?.moduleFeature.map((list) => {
                        let rowVisible = methods.isRowVisible(list);
                        if (!rowVisible) return null;
                        return (
                          <tr key={list.id}>
                            <td
                              className={`${
                                windowWidth <= RESPONSIVE_WIDTH
                              } ? width-50 : ''`}
                            >
                              {list?.name}
                            </td>
                            <td className={getFeaturesTdClass(0)}>
                              {methods.isCheckIcon(list?.isFree)}
                            </td>
                            <td className={getFeaturesTdClass(1)}>
                              {methods.isCheckIcon(list.isBasic)}
                            </td>
                            <td className={getFeaturesTdClass(2)}>
                              {methods.isCheckIcon(list.isAdvance)}
                            </td>
                            <td className={getFeaturesTdClass(3)}>
                              {methods.isCheckIcon(list.isProfessional)}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                )}
              </table>
            );
          })}
      </div>

      <PricingDetailsBasicModal
        isOpen={selectedPlan ? true : false}
        handleClose={() => methods.setSelectedPlan(null)}
        subscriptionPlanId={selectedPlan}
      />
    </div>
  );
};
export default withTranslation()(HomePlansNew);
