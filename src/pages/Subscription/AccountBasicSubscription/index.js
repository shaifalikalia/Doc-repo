import { Suspense, useState, useMemo } from "react";
import Loader from "components/Loader";
import { withTranslation } from "react-i18next";
import Page from "components/Page";
import styles from "./BasicSubscription.module.scss";
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import { useHistory, useParams } from "react-router-dom";
import CADPrice from "./component/CADPrice";
import USDPrice from "./component/USDPrice";
import constants from "../../../constants";
import { convertIntoTwoDecimal, getStorage, setStorage } from "utils";
import useRemoveCache from "hooks/useRemoveCache";
import { useToGetListOfSubscription } from "repositories/subscription-repository";
import useHandleApiError from "hooks/useHandleApiError";

const AccountBasicSubscription = ({ t }) => {
  const [activeTab, setActiveTab] = useState(
    getStorage(constants.sessionStoragecache.subscriptionDetails) || "1"
  );
  let { subscriptionType } = useParams();
  subscriptionType = +subscriptionType;
  const history = useHistory();
  useRemoveCache(
    [constants.routes.superAdmin.editAccountBasicSubscription],
    constants.sessionStoragecache.subscriptionDetails
  );

  let editSubscriptionPath;
  if (subscriptionType) {
    editSubscriptionPath =
      constants.routes.superAdmin.editAccountBasicSubscription.replace(
        ":subscriptionType",
        subscriptionType
      );
  }

  const goBack = () => {
    history.push("/subscription-management");
  };

  const printSubscriptionType = () => {
    if (subscriptionType === constants.subscriptionType.advanced)
      return t("superAdmin.advancedSubscription");
    if (subscriptionType === constants.subscriptionType.professional)
      return t("superAdmin.professionalSubscription");
    if (subscriptionType === constants.subscriptionType.basic)
      return t("superAdmin.basicSubscription");
  };

  if (
    !subscriptionType ||
    !constants.subscriptionTypesArray.includes(subscriptionType)
  ) {
    goBack();
  }

  const changeTab = (tabValue) => {
    setActiveTab(tabValue);
    setStorage(constants.sessionStoragecache.subscriptionDetails, tabValue);
  };

  // useToGetListOfSubscription
  const { data, isLoading, isFetching, error } =
    useToGetListOfSubscription(subscriptionType);
  useHandleApiError(isLoading, isFetching, error);

  const details = useMemo(() => {
    if (Array.isArray(data) && data[0] && data[1]) {
      // this if for to show data in CAD
      if (activeTab === "1") {
        let {
          perOfficeChargeInCad,
          perPermanentStaffMemberChargeInCad,
          perTemporaryStaffMemberChargeInCad,
          setupFeeChargeInCad,
          perPlacementChangeInCad,
        } = data[0] || {};
        const multiplePackage = data[1];

        return {
          //   single  package
          perOfficeChargeInCad: `$ ${convertIntoTwoDecimal(
            perOfficeChargeInCad
          )}${t("perMonthperOffice")}`,
          perPermanentStaffMemberChargeInCad: `$ ${convertIntoTwoDecimal(
            perPermanentStaffMemberChargeInCad
          )}${t("perMonthperStaff")}`,
          perTemporaryStaffMemberChargeInCad: `$ ${convertIntoTwoDecimal(
            perTemporaryStaffMemberChargeInCad
          )}${t("perMonthperStaff")}`,
          setupFeeChargeInCad: `$ ${convertIntoTwoDecimal(
            setupFeeChargeInCad
          )}`,
          perPlacementChangeInCad: `$ ${convertIntoTwoDecimal(
            perPlacementChangeInCad
          )}${t("perStaff")}`,

          //    multiple package
          multipleperOfficeChargeInCad: `$ ${convertIntoTwoDecimal(
            multiplePackage?.perOfficeChargeInCad
          )}${t("perMonthperOffice")}`,
          multipleperPermanentStaffMemberChargeInCad: `$ ${convertIntoTwoDecimal(
            multiplePackage?.perPermanentStaffMemberChargeInCad
          )}${t("perMonthperStaff")}`,
          multipleperTemporaryStaffMemberChargeInCad: `$ ${convertIntoTwoDecimal(
            multiplePackage?.perTemporaryStaffMemberChargeInCad
          )}${t("perMonthperStaff")}`,
          multiplesetupFeeChargeInCad: `$ ${convertIntoTwoDecimal(
            multiplePackage?.setupFeeChargeInCad
          )}`,
          multipleperPlacementChangeInCad: `$ ${convertIntoTwoDecimal(
            multiplePackage?.perPlacementChangeInCad
          )}${t("perStaff")}`,
        };
      } else {
        let {
          perOfficeChargeInUsd,
          perPermanentStaffMemberChargeInUsd,
          perTemporaryStaffMemberChargeInUsd,
          setupFeeChargeInUsd,
          perPlacementChangeInUsd,
        } = data[0] || {};
        const multiplePackage = data[1];

        return {
          //   single  package
          perOfficeChargeInUsd: `$ ${convertIntoTwoDecimal(
            perOfficeChargeInUsd
          )}${t("perMonthperOffice")}`,
          perPermanentStaffMemberChargeInUsd: `$ ${convertIntoTwoDecimal(
            perPermanentStaffMemberChargeInUsd
          )}${t("perMonthperStaff")}`,
          perTemporaryStaffMemberChargeInUsd: `$ ${convertIntoTwoDecimal(
            perTemporaryStaffMemberChargeInUsd
          )}${t("perMonthperStaff")}`,
          setupFeeChargeInUsd: `$ ${convertIntoTwoDecimal(
            setupFeeChargeInUsd
          )}`,
          perPlacementChangeInUsd: `$ ${convertIntoTwoDecimal(
            perPlacementChangeInUsd
          )}${t("perStaff")}`,

          //    multiple package
          multipleperOfficeChargeInUsd: `$ ${convertIntoTwoDecimal(
            multiplePackage?.perOfficeChargeInUsd
          )}${t("perMonthperOffice")}`,
          multipleperPermanentStaffMemberChargeInUsd: `$ ${convertIntoTwoDecimal(
            multiplePackage?.perPermanentStaffMemberChargeInUsd
          )}${t("perMonthperStaff")}`,
          multipleperTemporaryStaffMemberChargeInUsd: `$ ${convertIntoTwoDecimal(
            multiplePackage?.perTemporaryStaffMemberChargeInUsd
          )}${t("perMonthperStaff")}`,
          multiplesetupFeeChargeInUsd: `$ ${convertIntoTwoDecimal(
            multiplePackage?.setupFeeChargeInUsd
          )}`,
          multipleperPlacementChangeInUsd: `$ ${convertIntoTwoDecimal(
            multiplePackage?.perPlacementChangeInUsd
          )}${t("perStaff")}`,
        };
      }
    } else {
      return {};
    }
  }, [data, activeTab]);

  console.log("details", details);

  return (
    <Page
      onBack={goBack}
      className={"basic-subscription " + styles["basic-subscription"]}
      title={printSubscriptionType()}
    >
      {isLoading && <Loader />}

      <div className="account-setup-block pt-0">
        <div className="form-wrapper">
          <div
            className={
              "common-tabs scheduler-tabs edit-profile-tabs " +
              styles["edit-profile-tabs"]
            }
          >
            <Nav tabs className={styles["nav-tabs"]}>
              <NavItem>
                <NavLink
                  className={activeTab === "1" ? "active" : ""}
                  onClick={() => changeTab("1")}
                >
                  {t("superAdmin.cadPrice")}
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={activeTab === "2" ? "active" : ""}
                  onClick={() => changeTab("2")}
                >
                  {t("superAdmin.usdPrice")}
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={activeTab}>
              <Suspense fallback={<Loader />}>
                <TabPane tabId="1">
                  {activeTab === "1" && (
                    <CADPrice
                      editSubscriptionPath={editSubscriptionPath}
                      details={details}
                    />
                  )}
                </TabPane>
                <TabPane tabId="2">
                  {activeTab === "2" && (
                    <USDPrice
                      editSubscriptionPath={editSubscriptionPath}
                      details={details}
                    />
                  )}
                </TabPane>
              </Suspense>
            </TabContent>
          </div>
        </div>
      </div>
    </Page>
  );
};
export default withTranslation()(AccountBasicSubscription);
