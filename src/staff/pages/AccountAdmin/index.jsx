import React, { useEffect, useState } from "react";
import Page from "components/Page";
import { Col, Row } from "reactstrap";
import styles from "./AccountAdmin.module.scss";
import contractsIcon from "./../../../assets/images/contracts.svg";
import staffMembersIcon from "./../../../assets/images/staff-members.svg";
import timesheetIcon from "./../../../assets/images/timesheet-icon.svg";
import leavesIcon from "./../../../assets/images/leaves-icon.svg";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import constants from "../../../constants";
import { motion } from "framer-motion";
import { useOfficeDetail } from "repositories/office-repository";
import tooltipIcon from "./../../../assets/images/ico_admin.svg";
import { useLocation } from "react-router";
import useSubscriptionAccess from "hooks/useSubscriptionAccess";
import { useSelector } from "react-redux";

function AccountAdmin({ history, match, t }) {
  const location = useLocation();
  const modulesAccess = useSelector((prev) => prev);
  const profile = useSelector((state) => state.userProfile.profile);
  const isStaff = profile?.role?.systemRole === constants?.systemRoles?.staff;

  const { redirectWithCheck, isModuleDisabledClass } = useSubscriptionAccess();
  const [selectedPlanFeature, setSelectedPlanFeature] = useState({});

  const goBack = () => {
    history.push({
      pathname: constants.routes.staff.officeOptions.replace(
        ":officeId",
        match.params.officeId
      ),
      state: location.state,
    });
  };

  let officeName = null;
  if (location.state && location.state.officeName) {
    officeName = location.state.officeName;
  }

  const { isLoading, data } = useOfficeDetail(match.params.officeId);

  useEffect(() => {
    if (modulesAccess && isStaff) getFormContractsModuleAccess();
  }, [modulesAccess]);

  const getFormContractsModuleAccess = () => {
    try {
      const subscription = modulesAccess?.Subscription;

      if (subscription?.length) {
        const selectedPlanData = subscription?.find(
          (val) => val?.ownerId === data?.ownerId
        );
        setSelectedPlanFeature(selectedPlanData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Page
      onBack={goBack}
      isTitleLoading={!officeName && isLoading}
      title={officeName || (data && data.name)}
      className={styles["page"]}
    >
      <div className={styles["page-subheading"]}>{t("adminControls")}</div>

      <Row>
        <Col lg="4">
          <Card
            to={constants.routes.accountOwner.staffGrid.replace(
              ":officeId",
              match.params.officeId
            )}
            icon={staffMembersIcon}
            title={t("contracts.staffMembers")}
          />
        </Col>
        <Col lg="4">
          <Card
            to={constants.routes.accountOwner.timesheet.replace(
              ":officeId",
              match.params.officeId
            )}
            icon={timesheetIcon}
            title={t("contracts.timesheet")}
          />
        </Col>
        <Col lg="4">
          <Card
            to={constants.routes.accountOwner.leaves.replace(
              ":officeId",
              match.params.officeId
            )}
            icon={leavesIcon}
            title={t("contracts.leaves")}
          />
        </Col>
        <Col
          lg="4"
          className={isModuleDisabledClass(
            constants.moduleNameWithId.formAndContracts,
            isStaff ? selectedPlanFeature : null
          )}
        >
          <Card
            to={constants.routes.accountOwner.contracts.replace(
              ":officeId",
              match.params.officeId
            )}
            icon={contractsIcon}
            redirect={() =>
              redirectWithCheck(
                {
                  pathname: constants.routes.accountOwner.contracts.replace(
                    ":officeId",
                    match.params.officeId
                  ),
                  state: location?.state,
                },
                !!isModuleDisabledClass(
                  constants.moduleNameWithId.formAndContracts,
                  isStaff ? selectedPlanFeature : null
                )
              )
            }
            title={t("contracts.formsAndContract")}
            officeName={officeName}
          />
        </Col>
      </Row>
    </Page>
  );
}

function Card({ to, icon, title, officeName, redirect }) {
  const location = useLocation();
  if (redirect) {
    return (
      <motion.div
        whileHover={{ scale: constants.animation.hoverScale }}
        whileTap={{ scale: constants.animation.hoverScale }}
      >
        <span onClick={redirect} className="pointer">
          <div className={styles["card"]}>
            <div className={styles["tooltip-icon"]}>
              <img src={tooltipIcon} alt="icon" />
            </div>
            <img className={`${styles["icon"]} mr-2`} src={icon} alt="icon" />
            <h4>{title}</h4>
          </div>
        </span>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: constants.animation.hoverScale }}
      whileTap={{ scale: constants.animation.hoverScale }}
    >
      <Link
        to={{
          pathname: to,
          state: location.state,
        }}
      >
        <div className={styles["card"]}>
          <div className={styles["tooltip-icon"]}>
            <img src={tooltipIcon} alt="icon" />
          </div>
          <img className={`${styles["icon"]} mr-2`} src={icon} alt="icon" />
          <h4>{title}</h4>
        </div>
      </Link>
    </motion.div>
  );
}

export default withTranslation()(AccountAdmin);
