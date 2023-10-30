import React, { useState } from "react";
import styles from "./ManageFeatures.module.scss";
import "./ManageFeatures.scss";
import Tooltip from "reactstrap/lib/Tooltip";
import { withTranslation } from "react-i18next";
import Page from "components/Page";
import Card from "components/Card";
import constants from "../../../constants";
import useToManageFeatures from "../Hooks/useToManageFeatures";
import Loader from "components/Loader";

const ManageFeatures = ({ t, history }) => {
  const goBack = () => {
    history.push(constants.routes.superAdmin.accountBasicSubscription);
  };
  const [tooltipReminderOpen, setTooltipReminderOpen] = useState(false);
  const [tooltipReminderOpen2, setTooltipReminderOpen2] = useState(false);
  const [tooltipReminderOpen3, setTooltipReminderOpen3] = useState(false);
  const { data, methods } = useToManageFeatures({ t });
  const { subscriptionType } = constants;

  return (
    <Page
      onBack={goBack}
      className="manage-feature-page"
      title={t("superAdmin.manageFeatures")}
    >
      {data.isLoading && <Loader />}

      <Card
        className={styles["manage-feature-card"]}
        padding="30px"
        radius="10px"
        marginBottom="10px"
        shadow="0 0 15px 0 rgba(0, 0, 0, 0.08)"
        cursor="default"
      >
        <div className="alert-img-icon pr-0">
          <div className="alert-content">
            <b>{t("superAdmin.note")}</b>
            <span>{t("superAdmin.featureAlert")}</span>
          </div>
        </div>
        <div className={"d-flex " + styles["main-border-container"]}>
          <div className={styles["inner-border-container"]}>
            <span className={styles["border"] + " " + styles["green"]}></span>
            <label>{t("superAdmin.default")}</label>
            <img
              onMouseLeave={() => {
                setTooltipReminderOpen((pre) => false);
              }}
              onMouseEnter={() => {
                setTooltipReminderOpen((pre) => true);
              }}
              id="TooltipRemider"
              src={require("assets/images/info_black-tooltip.svg").default}
              alt="icon"
            />

            <Tooltip
              className="new-item-card-catalogue-tooltip default-tooltip"
              isOpen={tooltipReminderOpen}
              placement="top"
              target="TooltipRemider"
            >
              {t("superAdmin.defaultTooltip")}
            </Tooltip>
          </div>
          <div className={styles["inner-border-container"]}>
            <span className={styles["border"] + " " + styles["blue"]}></span>
            <label>{t("superAdmin.linkedWithFeature")}</label>
            <img
              onMouseLeave={() => {
                setTooltipReminderOpen2((pre) => false);
              }}
              onMouseEnter={() => {
                setTooltipReminderOpen2((pre) => true);
              }}
              id="TooltipRemider2"
              src={require("assets/images/info_black-tooltip.svg").default}
              alt="icon"
            />

            <Tooltip
              className="new-item-card-catalogue-tooltip default-tooltip"
              isOpen={tooltipReminderOpen2}
              placement="top"
              target="TooltipRemider2"
            >
              {t("superAdmin.linkedWithFeatureToolTip")}
            </Tooltip>
          </div>
          <div className={styles["inner-border-container"]}>
            <span className={styles["border"] + " " + styles["orange"]}></span>
            <label>{t("superAdmin.textual")}</label>
            <img
              onMouseLeave={() => {
                setTooltipReminderOpen3((pre) => false);
              }}
              onMouseEnter={() => {
                setTooltipReminderOpen3((pre) => true);
              }}
              id="TooltipRemider3"
              src={require("assets/images/info_black-tooltip.svg").default}
              alt="icon"
            />

            <Tooltip
              className="new-item-card-catalogue-tooltip default-tooltip"
              isOpen={tooltipReminderOpen3}
              placement="top"
              target="TooltipRemider3"
            >
              {t("superAdmin.textualTooltip")}
            </Tooltip>
          </div>
        </div>
        <table className={styles["upper-table"]}>
          <thead>
            <tr>
              <th></th>
              <th>{t("superAdmin.basic")}</th>
              <th>{t("superAdmin.advanced")}</th>
              <th>{t("superAdmin.professional")}</th>
            </tr>
          </thead>
        </table>

        {!!data.subscriptionFeatures.length &&
          data.subscriptionFeatures.map((item, parentIndex) => (
            <table className={styles["manage-feature-table"]} key={item.id}>
              <thead>
                <tr>
                  <th>
                    <div>{item.categoryName} </div>
                  </th>
                  <th></th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody className="content">
                {!!item.moduleFeature.length &&
                  item.moduleFeature.map((list, childIndex) => {
                    return (
                      <tr key={list.id}>
                        <td>
                          {list?.name}{" "}
                          <span
                            className={
                              styles["border"] +
                              " " +
                              styles[list?.lengendColor]
                            }
                          ></span>
                        </td>
                        <td>
                          {" "}
                          <div className="ch-checkbox removeCursorPointer">
                            <label>
                              <input
                                type="checkbox"
                                className="pointer"
                                checked={methods.isChecked(
                                  list,
                                  subscriptionType.basic
                                )}
                                // disabled={isDisabledCheck}
                                onChange={(e) => {
                                  methods.handleChange(
                                    subscriptionType.basic,
                                    parentIndex,
                                    childIndex,
                                    list,
                                    subscriptionType.basic
                                  );
                                }}
                              />

                              <span className={methods.disabledClass(list)}>
                                {" "}
                                &nbsp;{" "}
                              </span>
                            </label>
                          </div>
                        </td>
                        <td>
                          {" "}
                          <div className="ch-checkbox removeCursorPointer">
                            <label>
                              <input
                                type="checkbox"
                                className="pointer"
                                checked={methods.isChecked(
                                  list,
                                  subscriptionType.advanced
                                )}
                                // disabled={isDisabledCheck}
                                onChange={(e) => {
                                  methods.handleChange(
                                    subscriptionType.advanced,
                                    parentIndex,
                                    childIndex,
                                    list,
                                    subscriptionType.advanced
                                  );
                                }}
                              />

                              <span className={methods.disabledClass(list)}>
                                {" "}
                                &nbsp;{" "}
                              </span>
                            </label>
                          </div>
                        </td>
                        <td>
                          {" "}
                          <div className="ch-checkbox removeCursorPointer">
                            <label>
                              <input
                                type="checkbox"
                                className="pointer"
                                checked={methods.isChecked(
                                  list,
                                  subscriptionType.professional
                                )}
                                // disabled={isDisabledCheck}
                                onChange={(e) => {
                                  methods.handleChange(
                                    subscriptionType.professional,
                                    parentIndex,
                                    childIndex,
                                    list,
                                    subscriptionType.professional
                                  );
                                }}
                              />
                              <span className={methods.disabledClass(list)}>
                                {" "}
                                &nbsp;{" "}
                              </span>
                            </label>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          ))}
        <button
          className="button button-round button-shadow mr-4"
          onClick={methods.saveSubscriptionPlan}
          title={t("save")}
        >
          {t("save")}
        </button>
        <button
          className="button button-round button-dark button-border"
          title={t("cancel")}
          onClick={methods.goBack}
        >
          {t("cancel")}
        </button>
      </Card>
    </Page>
  );
};

export default withTranslation()(ManageFeatures);
