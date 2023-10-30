import React, { useState, useMemo, Fragment, useEffect } from "react";
import { withTranslation } from "react-i18next";
import "rc-time-picker/assets/index.css";
import { Modal, ModalBody } from "reactstrap";
import crossIcon from "./../../../assets/images/cross.svg";
import "./PricingPlan.scss";
import Text from "components/Text";
import styles from "./PricingPlan.module.scss";
import { Col, Row } from "reactstrap/lib";
import "./PricingPlan.scss";
import constants from "../../.././constants";
import { convertIntoTwoDecimal } from "utils";
import { getcurreny } from "../../.././constants";

const RESPONSIVE_WIDTH = 991;
const ComparisionFeatureModal = ({
  t,
  isComparisionFeatureModalOpen,
  curreny,
  closeComparisionFeatureModal,
  subscriptionFeatures,
  methods,
  planList,
}) => {
  const { subscriptionType } = constants;

  const [singleOpen, setSingleOpen] = useState(true);
  const [multipleOpen, setMultipleOpen] = useState(true);
  const [planType, setPlanType] = useState(subscriptionType.basic);
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

  const subHeading = () => {
    let Obj = {
      1: t("accountOwner.pricingDetailsOfBasicPlan"),
      2: t("accountOwner.pricingDetailsOfAdvancedPlan"),
      3: t("accountOwner.pricingDetailsOfProfessionalPlan"),
    };

    return Obj[planType];
  };

  const isCheckIcon = (value) => {
    if (value)
      return (
        <img
          src={require("assets/images/heavy-check.svg").default}
          alt="icon"
        />
      );
    return (
      <img
        src={require("assets/images/cross-mark-button.svg").default}
        alt="icon"
      />
    );
  };

  const subscriptionPlans = useMemo(() => {
    if (!planType || !planList) return [];
    return planList.filter((item) => item.subscriptionPlan === planType);
  }, [planType, planList]);

  let singleOffice = {};
  let multipleOffice = {};

  if (Array.isArray(subscriptionPlans) && subscriptionPlans?.length) {
    singleOffice = subscriptionPlans[0];
    multipleOffice = subscriptionPlans[1];
  }

  const SelectionOfPlan = (type) => {
    setPlanType(type);
  };

  const convertIntoDecimalWithCurrency = (value) => {
    const countryCurreny = constants.currenyArray.find(
      (item) => item.value === curreny
    );
    return `${countryCurreny?.name} ${convertIntoTwoDecimal(value)}`;
  };

  return (
    <Modal
      isOpen={isComparisionFeatureModalOpen}
      toggle={closeComparisionFeatureModal}
      className="modal-dialog-centered comparision-feature-modal"
      modalClassName="custom-modal"
    >
      <span className="close-btn" onClick={closeComparisionFeatureModal}>
        <img src={crossIcon} alt="close" />
      </span>
      <ModalBody>
        <div className="modal-custom-title">
          <Text size="25px" marginBottom="40px" weight="500" color="#111B45">
            <span className="modal-title-25">
              {t("accountOwner.subscriptionPlanFeaturesComparison")}
            </span>
          </Text>
        </div>

        <table className="feature-comparision-types">
          <tr>
            <th></th>
            <th
              id="basic"
              className={`${
                selectedPlanIndex !== 0 && windowWidth <= RESPONSIVE_WIDTH
                  ? "d-none"
                  : ""
              }`}
            >
              {t("accountOwner.basic")}
              <img
                className=" d-md-none ml-2 cursor-pointer"
                id="advanced"
                src={require("assets/images/right-arrow.svg").default}
                onClick={() => {
                  SelectionOfPlan(subscriptionType.advanced);
                  setSelectedPlanIndex(selectedPlanIndex + 1);
                }}
                alt="icon"
              />
            </th>
            <th
              id="advanced"
              className={`${
                selectedPlanIndex !== 1 && windowWidth <= RESPONSIVE_WIDTH
                  ? "d-none"
                  : ""
              }`}
            >
              <img
                className="d-md-none mr-2 cursor-pointer"
                id="professional"
                onClick={() => {
                  SelectionOfPlan(subscriptionType.basic);
                  setSelectedPlanIndex(selectedPlanIndex - 1);
                }}
                src={require("assets/images/left-arrow.svg").default}
                alt="icon"
              />
              {t("accountOwner.advanced")}
              <img
                className=" d-md-none ml-2 cursor-pointer"
                id="advanced"
                src={require("assets/images/right-arrow.svg").default}
                onClick={() => {
                  SelectionOfPlan(subscriptionType.professional);
                  setSelectedPlanIndex(selectedPlanIndex + 1);
                }}
                alt="icon"
              />
            </th>
            <th
              className={`${
                selectedPlanIndex !== 2 && windowWidth <= RESPONSIVE_WIDTH
                  ? "d-none"
                  : ""
              }`}
              id="professional"
            >
              <img
                className="d-md-none mr-2 cursor-pointer"
                id="professional"
                onClick={() => {
                  SelectionOfPlan(subscriptionType.advanced);
                  setSelectedPlanIndex(selectedPlanIndex - 1);
                }}
                src={require("assets/images/left-arrow.svg").default}
                alt="icon"
              />
              {t("accountOwner.professional")}
            </th>
          </tr>
        </table>

        <div className={styles["scroll-div"]}>
          {!!subscriptionFeatures?.length &&
            subscriptionFeatures?.map((item) => {
              return (
                <table
                  className="feature-comparision-table"
                  key={item.category}
                >
                  <thead>
                    <tr onClick={() => methods.openCollapseTab(item.category)}>
                      <th>
                        <div>{item?.categoryName}</div>
                      </th>
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
                                {isCheckIcon(list.isBasic)}
                              </td>
                              <td className={getFeaturesTdClass(1)}>
                                {isCheckIcon(list.isAdvance)}
                              </td>
                              <td className={getFeaturesTdClass(2)}>
                                {isCheckIcon(list.isProfessional)}
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

        <table className="feature-comparision-pricing">
          <tr>
            <th></th>
            <th className={getFeaturesTdClass(0)}>
              {planType === subscriptionType.basic ? (
                <button
                  className={
                    "button button-round button-shadow " +
                    styles["pricing-color"]
                  }
                  title={t("accountOwner.pricingDetails")}
                >
                  {t("accountOwner.pricingDetails")}
                  <img
                    src={require("assets/images/arrow-up.svg").default}
                    alt="icon"
                  />
                </button>
              ) : (
                <button
                  className="button button-round button-dark button-border"
                  onClick={() => SelectionOfPlan(subscriptionType.basic)}
                  title={t("accountOwner.pricingDetails")}
                >
                  {t("accountOwner.pricingDetails")}
                  <img
                    src={require("assets/images/arrow-down.svg").default}
                    alt="icon"
                  />
                </button>
              )}
            </th>
            <th className={getFeaturesTdClass(1)}>
              {planType === subscriptionType.advanced ? (
                <button
                  className={
                    "button button-round button-shadow " +
                    styles["pricing-color"]
                  }
                  title={t("accountOwner.pricingDetails")}
                >
                  {t("accountOwner.pricingDetails")}
                  <img
                    src={require("assets/images/arrow-up.svg").default}
                    alt="icon"
                  />
                </button>
              ) : (
                <button
                  className="button button-round button-dark button-border"
                  onClick={() => SelectionOfPlan(subscriptionType.advanced)}
                  title={t("accountOwner.pricingDetails")}
                >
                  {t("accountOwner.pricingDetails")}
                  <img
                    src={require("assets/images/arrow-down.svg").default}
                    alt="icon"
                  />
                </button>
              )}
            </th>

            <th className={getFeaturesTdClass(2)}>
              {planType === subscriptionType.professional ? (
                <button
                  className={
                    "button button-round button-shadow " +
                    styles["pricing-color"]
                  }
                  title={t("accountOwner.pricingDetails")}
                >
                  {t("accountOwner.pricingDetails")}
                  <img
                    src={require("assets/images/arrow-up.svg").default}
                    alt="icon"
                  />
                </button>
              ) : (
                <button
                  className="button button-round button-dark button-border"
                  onClick={() => SelectionOfPlan(subscriptionType.professional)}
                  title={t("accountOwner.pricingDetails")}
                >
                  {t("accountOwner.pricingDetails")}
                  <img
                    src={require("assets/images/arrow-down.svg").default}
                    alt="icon"
                  />
                </button>
              )}
            </th>
          </tr>
        </table>

        {
          <div
            className={
              "plan-detail " +
              styles["plan-detail"] +
              " " +
              styles["plan-detail-border"]
            }
          >
            <div className={styles["sub-head"]}>
              <Text
                size="20px"
                marginBottom="40px"
                weight="500"
                color="#111B45"
              >
                <span className="modal-title-25">{subHeading()}</span>
              </Text>
            </div>

            <Row>
              <Col md="6" className={styles["left-container"]}>
                <div className={"plan-detail-box " + styles["plan-detail-box"]}>
                  <div
                    className={
                      "d-flex justify-content-between align-items-center " +
                      styles["accordian"]
                    }
                  >
                    {" "}
                    <h3>{t("superAdmin.singleOffice")}</h3>{" "}
                    {singleOpen ? (
                      <img
                        className="d-block d-md-none"
                        onClick={() => setSingleOpen((pre) => !pre)}
                        src={
                          require("assets/images/ico-forward-green.svg").default
                        }
                        alt="icon"
                      />
                    ) : (
                      <img
                        className="d-block d-md-none"
                        onClick={() => setSingleOpen((pre) => !pre)}
                        src={require("assets/images/ico-forward.svg").default}
                        alt="icon"
                      />
                    )}
                  </div>
                  <SubscriptionFeatures
                    details={singleOffice}
                    curreny={curreny}
                    t={t}
                    convertIntoDecimalWithCurrency={
                      convertIntoDecimalWithCurrency
                    }
                  />
                </div>
              </Col>
              <Col md="6" className={styles["right-container"]}>
                <div className={"plan-detail-box " + styles["plan-detail-box"]}>
                  <div
                    className={
                      "d-flex justify-content-between align-items-center " +
                      styles["accordian"]
                    }
                  >
                    {" "}
                    <h3> {t("accountOwner.multipleOffice")}</h3>{" "}
                    {multipleOpen ? (
                      <img
                        className="d-block d-md-none"
                        onClick={() => setMultipleOpen((pre) => !pre)}
                        src={
                          require("assets/images/ico-forward-green.svg").default
                        }
                        alt="icon"
                      />
                    ) : (
                      <img
                        className="d-block d-md-none"
                        onClick={() => setMultipleOpen((pre) => !pre)}
                        src={require("assets/images/ico-forward.svg").default}
                        alt="icon"
                      />
                    )}
                  </div>
                  <SubscriptionFeatures
                    curreny={curreny}
                    details={multipleOffice}
                    t={t}
                    convertIntoDecimalWithCurrency={
                      convertIntoDecimalWithCurrency
                    }
                  />
                </div>
              </Col>
              <Col md="12">
                <div className="alert-img-icon">
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
                    {t("accountOwner.basicPlanAlert")}
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        }
      </ModalBody>
    </Modal>
  );
};

export default withTranslation()(ComparisionFeatureModal);

function SubscriptionFeatures({ details, t, curreny }) {
  let setupFee = t("userPages.plan.free");
  let countryCurreny = getcurreny(curreny);
  if (curreny === constants.curreny.CAD && details?.setupFeeChargeInCad) {
    setupFee = `${countryCurreny} ${convertIntoTwoDecimal(
      details?.setupFeeChargeInCad
    )}`;
  }
  let officeCharges = `${countryCurreny} ${convertIntoTwoDecimal(
    details?.perOfficeChargeInCad
  )}${t("perMonthperOffice")}`;
  let permanentStaff = `${countryCurreny} ${convertIntoTwoDecimal(
    details?.perPermanentStaffMemberChargeInCad
  )}${t("perMonthperStaff")}`;
  let tempraryStaff = `${countryCurreny} ${convertIntoTwoDecimal(
    details?.perTemporaryStaffMemberChargeInCad
  )}${t("perMonthperStaff")}`;
  let perStaff = `${countryCurreny} ${convertIntoTwoDecimal(
    details?.perPlacementChangeInCad
  )}${t("perStaff")}`;

  if (curreny === constants.curreny.USD) {
    if (details?.setupFeeChargeInUsd) {
      setupFee = `${countryCurreny} ${convertIntoTwoDecimal(
        details?.setupFeeChargeInUsd
      )}`;
    }
    officeCharges = `${countryCurreny} ${convertIntoTwoDecimal(
      details?.perOfficeChargeInUsd
    )}${t("perMonthperOffice")}`;
    permanentStaff = `${countryCurreny} ${convertIntoTwoDecimal(
      details?.perPermanentStaffMemberChargeInUsd
    )}${t("perMonthperStaff")}`;
    tempraryStaff = `${countryCurreny} ${convertIntoTwoDecimal(
      details?.perTemporaryStaffMemberChargeInUsd
    )}${t("perMonthperStaff")}`;
    perStaff = `${countryCurreny} ${convertIntoTwoDecimal(
      details?.perPlacementChangeInUsd
    )}${t("perStaff")}`;
  }

  return (
    <Fragment>
      <div className="feature-list">
        <ul>
          <li>
            <label>{t("accountOwner.oneTimeSetupFee")}</label>
            <span>{setupFee}</span>
          </li>
          <li>
            <label>{t("superAdmin.officeCharges")}</label>
            <span>{officeCharges}</span>
          </li>
          <li>
            <label>{t("superAdmin.permanentStaffCharges")}</label>
            <span>{permanentStaff}</span>
          </li>
          <li>
            <label>{t("superAdmin.temporaryStaffCharges")}</label>
            <span>{tempraryStaff}</span>
          </li>

          <li className={styles["last-child"]}>
            <label>{t("superAdmin.perEachPlacement")}</label>
            <span>{perStaff}</span>
          </li>
        </ul>
      </div>
    </Fragment>
  );
}
