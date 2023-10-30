import React, { useState, useMemo, Fragment } from "react";
import { withTranslation } from "react-i18next";
import "rc-time-picker/assets/index.css";
import { Modal, ModalBody } from "reactstrap";
import crossIcon from "./../../../assets/images/cross.svg";
import Text from "components/Text";
import ToggleSwitch from "components/ToggleSwitch";
import { useToGetListOfSubscriptionAvaliable } from "repositories/subscription-repository";
import useHandleApiError from "hooks/useHandleApiError";
import { convertIntoTwoDecimal } from "utils";
import constants from "../../../constants";

const PricingDetailsBasicModal = ({
  t,
  isOpen,
  handleClose,
  subscriptionPlanId,
}) => {
  const printSubscriptionType = () => {
    if (subscriptionPlanId === constants.subscriptionType.advanced)
      return t("userPages.plan.pricingDetailsForAdvancedPlan");
    if (subscriptionPlanId === constants.subscriptionType.professional)
      return t("userPages.plan.pricingDetailsForProfessionalPlan");
    if (subscriptionPlanId === constants.subscriptionType.basic)
      return t("userPages.plan.pricingDetailsForBasicPlan");
  };

  const closePricingDetailsBasicModal = () => handleClose(false);
  const { data, isLoading, isFetching, error } =
    useToGetListOfSubscriptionAvaliable();
  useHandleApiError(isLoading, isFetching, error);
  const acticeTab = {
    CAD: 1,
    USD: 2,
  };

  const [activePrice, setactivePrice] = useState(acticeTab.CAD);

  const subscriptionPlans = useMemo(() => {
    if (!subscriptionPlanId || !data) return [];
    return data.filter((item) => item.subscriptionPlan === subscriptionPlanId);
  }, [subscriptionPlanId, data]);

  let singleOffice = {};
  let multipleOffice = {};

  if (Array.isArray(subscriptionPlans) && subscriptionPlans?.length) {
    singleOffice = subscriptionPlans[0];
    multipleOffice = subscriptionPlans[1];
  }

  return (
    <Modal
      isOpen={isOpen}
      toggle={closePricingDetailsBasicModal}
      className="modal-dialog-centered pricing-details-basic"
      modalClassName="custom-modal"
    >
      <span className="close-btn" onClick={closePricingDetailsBasicModal}>
        <img src={crossIcon} alt="close" />
      </span>
      <ModalBody>
        <div className="modal-custom-title">
          <Text size="25px" marginBottom="35px" weight="500" color="#111B45">
            <span className="modal-title-25">{printSubscriptionType()}</span>
          </Text>
        </div>
        <div className="text-center currency-container">
          <label className="currency">{t("cad")}</label>
          <ToggleSwitch
            label="sales-rep-status"
            onChange={(event) =>
              setactivePrice(
                event.target.checked ? acticeTab.USD : acticeTab.CAD
              )
            }
          />
          <label className="currency">{t("usd")}</label>
        </div>

        <div className="features-pricing">
          <div className="plan-list-section">
            <div className="container">
              <div className="plan-list">
                <div className="row content-row">
                  <div className="col-lg-6">
                    <div className="plan-block">
                      <div className="plan-header">
                        <div className="d-flex flex-column align-items-center plan-content-layout">
                          <div>
                            <img
                              src={
                                require("assets/images/landing-pages/single-office.svg")
                                  .default
                              }
                              alt="img"
                            />

                            <h3> {t("userPages.plan.singleOffice")}</h3>
                            {activePrice === acticeTab.CAD ? (
                              <SubscriptionFeaturesCad
                                details={singleOffice}
                                t={t}
                              />
                            ) : (
                              <SubscriptionFeaturesUsd
                                details={singleOffice}
                                t={t}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="plan-block">
                      <div className="plan-header">
                        <div className="d-flex flex-column align-items-center plan-content-layout">
                          <div>
                            <img
                              src={
                                require("assets/images/landing-pages/office-multiple.svg")
                                  .default
                              }
                              alt="img"
                            />

                            <h3> {t("userPages.plan.multipleOffice")}</h3>
                            {activePrice === acticeTab.CAD ? (
                              <SubscriptionFeaturesCad
                                details={multipleOffice}
                                t={t}
                              />
                            ) : (
                              <SubscriptionFeaturesUsd
                                details={multipleOffice}
                                t={t}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* alertContentInLandingPage */}
        <div className="alert-img-icon">
          <div className="alert-image">
            <img
              src={require("assets/images/alert-circle-black.svg").default}
              alt="icon"
            />
          </div>
          <div className="alert-content">
            {t("userPages.plan.alertContentInLandingPage")}
          </div>
        </div>
        <div className="text-center">
          <button
            className="button button-round button-border btn-mobile-link button-dark"
            title={t("close")}
            onClick={handleClose}
          >
            {t("close")}
          </button>
        </div>
      </ModalBody>
    </Modal>
  );
};
export default withTranslation()(PricingDetailsBasicModal);

function SubscriptionFeaturesCad({ details, t }) {
  const isValueExist = (value) => {
    if (value) return `$${convertIntoTwoDecimal(value)}`;
    else return t("userPages.plan.free");
  };

  const convertIntoTwoDecimalWithDoller = (value) => {
    return `$${convertIntoTwoDecimal(value)}`;
  };

  return (
    <Fragment>
      <div class="price">
        <h4 className="custom-font">
          {convertIntoTwoDecimal(details?.perOfficeChargeInCad)}
          <sup className="custom-office">{t("userPages.plan.perOffice")} </sup>
          <span className="custom-sub">{t("userPages.plan.perMonths")}</span>
        </h4>
      </div>
      <div className="feature-list">
        <ul>
          <li>
            <span className="price-bold">
              {isValueExist(details?.setupFeeChargeInCad)}{" "}
            </span>
            {t("userPages.plan.oneTimeSetupFree")}
          </li>
          <li>
            <span className="price-bold">
              {convertIntoTwoDecimalWithDoller(
                details?.perPermanentStaffMemberChargeInCad
              )}
            </span>{" "}
            {t("userPages.plan.perActiveStaff")}/{t("userPages.plan.perMonth")}
          </li>
          <li>
            <span className="price-bold">
              {convertIntoTwoDecimalWithDoller(
                details?.perTemporaryStaffMemberChargeInCad
              )}
            </span>{" "}
            {t("userPages.plan.perActiveTempStaff")}/
            {t("userPages.plan.perMonth")}
          </li>
          <li>
            <span className="price-bold">
              {convertIntoTwoDecimalWithDoller(
                details?.perPlacementChangeInCad
              )}
            </span>{" "}
            {t("userPages.plan.perStaffPlacement")}
          </li>
        </ul>
      </div>
    </Fragment>
  );
}

function SubscriptionFeaturesUsd({ details, t }) {
  const isValueExist = (value) => {
    if (value) return `$${convertIntoTwoDecimal(value)}`;
    else return t("userPages.plan.free");
  };

  const convertIntoTwoDecimalWithDoller = (value) => {
    return `$${convertIntoTwoDecimal(value)}`;
  };

  return (
    <Fragment>
      <div class="price">
        <h4 className="custom-font">
          {convertIntoTwoDecimal(details?.perOfficeChargeInUsd)}
          <sup className="custom-office">{t("userPages.plan.perOffice")} </sup>
          <span className="custom-sub">{t("userPages.plan.perMonths")}</span>
        </h4>
      </div>
      <div className="feature-list">
        <ul>
          <li>
            <span className="price-bold">
              {`${isValueExist(details?.setupFeeChargeInUsd)} `}
            </span>
            {t("userPages.plan.oneTimeSetupFree")}
          </li>
          <li>
            <span className="price-bold">
              {convertIntoTwoDecimalWithDoller(
                details?.perPermanentStaffMemberChargeInUsd
              )}
            </span>{" "}
            {t("userPages.plan.perActiveStaff")}/{t("userPages.plan.perMonth")}
          </li>
          <li>
            <span className="price-bold">
              {convertIntoTwoDecimalWithDoller(
                details?.perTemporaryStaffMemberChargeInUsd
              )}
            </span>{" "}
            {t("userPages.plan.perActiveTempStaff")}/
            {t("userPages.plan.perMonth")}
          </li>
          <li>
            <span className="price-bold">
              {convertIntoTwoDecimalWithDoller(
                details?.perPlacementChangeInUsd
              )}
            </span>{" "}
            {t("userPages.plan.perStaffPlacement")}
          </li>
        </ul>
      </div>
    </Fragment>
  );
}
