import React from "react";
import Page from "components/Page";
import { withTranslation } from "react-i18next";
import {
  Col,
  Row,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { useState } from "react";
import ToggleSwitch from "components/ToggleSwitch";
import Text from "components/Text";
import { useSelector } from "react-redux";
import constants from "./../../../../constants";
import { Link } from "react-router-dom";
import { useUserSpecialties } from "repositories/specialty-repository";
import userDefaultImage from "./../../../../assets/images/staff-default.svg";
import { useUpdateShowInSearchResultMutation } from "repositories/preferences-repository";
import toast from "react-hot-toast";
import DeleteAccountConfirmationPopup from "./DeleteAccountConfirmationPopup";

function Profile({ history, t }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const [activeTab, setActiveTab] = useState("1");
  const [
    isDeleteAccountConfirmationPopupOpen,
    setIsDeleteAccountConfirmationPopupOpen,
  ] = useState(false);

  const profile = useSelector((state) => state.userProfile.profile);
  const {
    isLoading,
    error,
    data: specialties,
  } = useUserSpecialties(profile.id);

  let isFreePackageSubscription = false;
  let isFreeOrTrialPackageSubscription = false;
  if (profile && profile.userSubscription) {
    isFreePackageSubscription =
      profile.userSubscription.packageType === constants.packageTypes.free;
    isFreeOrTrialPackageSubscription =
      isFreePackageSubscription ||
      profile.userSubscription.packageType === constants.packageTypes.trial;
  }

  let isAccountOwner = false;
  let isDoctor = false;
  if (profile && profile.role) {
    isAccountOwner =
      profile.role.systemRole === constants.systemRoles.accountOwner;
  }
  if (profile && profile.isDoctor) {
    isDoctor = profile.isDoctor;
  }
  const goToPreviousScreen = () => {
    history.push("/");
  };

  const addDefaultSrc = (ev) => {
    ev.target.src = userDefaultImage;
    ev.target.onerror = null;
  };

  return (
    <>
      {isDeleteAccountConfirmationPopupOpen && (
        <DeleteAccountConfirmationPopup
          onClose={() => setIsDeleteAccountConfirmationPopupOpen(false)}
        />
      )}
      <Page title={t("accountOwner.profile")} onBack={goToPreviousScreen}>
        <div className="profile-tab-wrapper">
          <div className="container px-0">
            <div className="form-wrapper">
              <Row className="no-gutters">
                {/* Section 1 */}
                <Col
                  lg={
                    isFreeOrTrialPackageSubscription ||
                    isAccountOwner ||
                    isDoctor
                      ? "6"
                      : "12"
                  }
                >
                  {/* Profile heading */}
                  <div
                    className={
                      "profile-detail-col" +
                      (isFreeOrTrialPackageSubscription ||
                      isDoctor ||
                      isAccountOwner
                        ? " divider"
                        : "")
                    }
                  >
                    <div className="image-warepper">
                      <div className="d-sm-flex align-items-center">
                        <div className="profile-img">
                          <img
                            src={profile.profilePic || userDefaultImage}
                            onError={addDefaultSrc}
                            alt="profile"
                          />
                        </div>
                        <div className="profile-name">
                          {`${profile.firstName} ${profile.lastName}`}
                        </div>
                      </div>
                      {isAccountOwner && (
                        <div className="profile-dropdown">
                          <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                            <DropdownToggle
                              caret={false}
                              tag="div"
                              className="dropdown-btn"
                            >
                              <img
                                src={
                                  require("assets/images/dots-icon.svg").default
                                }
                                alt="icon"
                              />
                            </DropdownToggle>
                            <DropdownMenu right>
                              <DropdownItem>
                                <Link
                                  to={constants.routes.accountOwner.editProfile}
                                >
                                  {t("accountOwner.editProfile")}
                                </Link>
                              </DropdownItem>
                              {isFreePackageSubscription && (
                                <DropdownItem
                                  onClick={() =>
                                    setIsDeleteAccountConfirmationPopupOpen(
                                      true
                                    )
                                  }
                                >
                                  <span>
                                    {t("accountOwner.deleteMyAccount")}
                                  </span>
                                </DropdownItem>
                              )}
                            </DropdownMenu>
                          </Dropdown>
                        </div>
                      )}
                    </div>
                    <div className="common-tabs">
                      <Nav tabs>
                        <NavItem>
                          <NavLink
                            className={activeTab == "1" ? "active" : ""}
                            onClick={() => setActiveTab("1")}
                          >
                            {t("accountOwner.basicInfo")}
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            className={activeTab == "2" ? "active" : ""}
                            onClick={() => setActiveTab("2")}
                          >
                            {t("accountOwner.medicalBackground")}
                          </NavLink>
                        </NavItem>
                      </Nav>
                      <TabContent activeTab={activeTab}>
                        <TabPane tabId="1">
                          <div className="profile-basic-content">
                            {isAccountOwner && (
                              <>
                                <DetailItem
                                  title={
                                    t("form.fields.fullName") +
                                    "/" +
                                    t("form.fields.companyName")
                                  }
                                  value={
                                    profile.firstName + " " + profile.lastName
                                  }
                                />

                                <DetailItem
                                  title={t("form.fields.contactNumber")}
                                  value={profile.contactNumber}
                                />

                                <DetailItem
                                  title={t("accountOwner.practiceAddress")}
                                  value={profile.address}
                                />

                                <DetailItem
                                  title={t("form.fields.country")}
                                  value={profile.country}
                                />

                                <DetailItem
                                  title={t("form.fields.provinceOrState")}
                                  value={profile.province}
                                />

                                <DetailItem
                                  title={t("form.fields.city")}
                                  value={profile.city}
                                />

                                <DetailItem
                                  title={t("form.fields.postalCode")}
                                  value={profile.postalCode}
                                />
                              </>
                            )}

                            {!isAccountOwner && (
                              <>
                                <DetailItem
                                  title={t("form.fields.fullName")}
                                  value={
                                    profile.firstName + " " + profile.lastName
                                  }
                                />

                                <DetailItem
                                  title={t("role")}
                                  value={profile.designation || "-"}
                                />

                                <DetailItem
                                  title={t("form.fields.emailAddress")}
                                  value={profile.emailId}
                                />

                                <DetailItem
                                  title={t("form.fields.contactNumber")}
                                  value={profile.contactNumber}
                                />
                              </>
                            )}
                          </div>
                        </TabPane>
                        <TabPane tabId="2">
                          <div className="medical-content">
                            <DetailItem
                              title={t("form.fields.yearsOfExperience")}
                              value={
                                profile.yearsOfExperience
                                  ? `${profile.yearsOfExperience} year${
                                      profile.yearsOfExperience === 1 ? "" : "s"
                                    }`
                                  : "Not Added."
                              }
                            />

                            <Specialties
                              specialties={
                                !isLoading && !error ? specialties : []
                              }
                              t={t}
                            />

                            <DetailItem
                              title={t("form.fields.licenseId")}
                              value={
                                profile.licenseId
                                  ? profile.licenseId
                                  : "Not Added."
                              }
                            />
                          </div>
                        </TabPane>
                      </TabContent>
                    </div>
                  </div>
                </Col>

                {/* Section 2 */}
                {(isFreeOrTrialPackageSubscription ||
                  isAccountOwner ||
                  isDoctor) && (
                  <Col lg="6">
                    <div className="download-app-col">
                      {(isFreePackageSubscription ||
                        isAccountOwner ||
                        isDoctor) && (
                        <DoctorSearchResultToggle
                          shouldShow={profile.showInSearch}
                          t={t}
                        />
                      )}

                      {isFreeOrTrialPackageSubscription && (
                        <div className="download-wrapper">
                          <Text
                            secondary
                            size="16px"
                            weight="600"
                            marginBottom="15px"
                          >
                            {t("subscription")}
                          </Text>
                          <Text color="#6f7788" size="12px" marginBottom="30px">
                            {t("accountOwner.upgradeSubscriptionDescription")}
                          </Text>

                          <Link
                            className="button button-round button-shadow"
                            to={constants.routes.accountOwner.managePlan}
                          >
                            {t("accountOwner.upgradeSubscription")}
                          </Link>
                        </div>
                      )}
                    </div>
                  </Col>
                )}
              </Row>
            </div>
          </div>
        </div>
      </Page>
    </>
  );
}

function DetailItem({ title, value }) {
  return (
    <div className="c-field">
      <label>{title}</label>
      <div className="field-name">{value}</div>
    </div>
  );
}

function Specialties({ specialties, t }) {
  let content = null;

  if (specialties.length > 0) {
    content = specialties.map((it, i) => (
      <div className="field-name" key={i}>
        {it.title}
      </div>
    ));
  } else {
    content = <div className="field-name">{t("notAdded")}</div>;
  }

  return (
    <div className="c-field">
      <label>{t("form.fields.specialtiesAndServices")}</label>
      {content}
    </div>
  );
}

function DoctorSearchResultToggle({ shouldShow, t }) {
  const mutation = useUpdateShowInSearchResultMutation();

  const onToggle = async () => {
    try {
      await mutation.mutateAsync(!shouldShow);
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <div className="search-database-box">
      <Text color="#111b45" size="13px">
        {t("accountOwner.showInSearchDatabase")}
      </Text>
      <ToggleSwitch
        label="searchDatabase"
        value={shouldShow}
        onChange={onToggle}
      />
    </div>
  );
}

export default withTranslation()(Profile);
