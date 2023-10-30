import { useMemo, Suspense, useEffect, useState } from "react";
import Loader from "components/Loader";
import { withTranslation } from "react-i18next";
import { testRegexCheck } from "utils";
import Page from "components/Page";
import { useEditProfile } from "./hooks/useEditProfile";
import styles from "./editProfile.module.scss";
import "./editProfile.scss";
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import { useHistory } from "react-router-dom";
import LayoutVendor from "VendorManagement/components/LayoutVendor";
import Input from "components/Input";
import CustomSelect from "components/CustomSelect";
import CardDetails from "./component/CardDetails";
import CustomInput from "pages/Ofiices/components/CustomInput";
import Select from "components/Select";

const SetupAccount = (props) => {
  const [activeTab, setActiveTab] = useState("1");
  const { t } = props;
  const history = useHistory();

  useEffect(() => {
    const isCardView = new URLSearchParams(window.location.search).get(
      "isCardView"
    );
    isCardView && setActiveTab("2");
  }, []);

  const goBack = () => {
    history.push("/vendor-profile");
  };

  const {
    googleServices,
    formFields,
    errors,
    countryList,
    provienceList,
    isLoading,
    cityList,
    showPredictions,
    imageUrl,
    listOfCards,
    handlePlaceSelect,
    handleChange,
    setShowPredictions,
    onSubmit,
    handleChangeNumber,
    fileChange,
    customInputBlurChange,
  } = useEditProfile({ t, goBack });

  const {
    companyName,
    contactNumber,
    officeAddress,
    province,
    city,
    postalCode,
    country,
    firstName,
    lastName,
  } = formFields;

  let selectedCountry = useMemo(
    () => countryList?.find((e) => e.id === +country)?.name?.slice(0, 2),
    [country, countryList]
  );

  const closePredictions = () => {
    setShowPredictions(false);
  };

  const predictionHandleChange = (e) => {
    if (!testRegexCheck(e.target.value)) return;
    handleChange(e);
    !showPredictions && setShowPredictions(true);
    googleServices?.getPlacePredictions({
      input: e.target.value,
      componentRestrictions: { country: selectedCountry ?? "" },
    });
  };

  const placePredictionContent = () => {
    return googleServices?.placePredictions?.map((place) => {
      const { description, place_id } = place;
      return (
        <li
          key={place_id}
          onClick={() => {
            setTimeout(() => {
              handlePlaceSelect(place_id, description);
              closePredictions();
            });
          }}
        >
          {description}
        </li>
      );
    });
  };

  const getSelectedOption = (list, value) => {
    const selectedData =
      list.find((val) => val.id.toString() === value?.toString()) || {};
    return selectedData.name;
  };

  const handleCustomDropDown = (value, name) => {
    const eventObject = {
      target: {
        value: value.id.toString(),
        name: name,
      },
    };

    return eventObject;
  };

  return (
    <LayoutVendor>
      <Page
        onBack={goBack}
        className={"edit-profile " + styles["edit-profile"]}
        title={t("vendorManagement.editProfile")}
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
                    className={activeTab == "1" ? "active" : ""}
                    onClick={() => setActiveTab("1")}
                  >
                    {t("vendorManagement.personalDetails")}
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={activeTab == "2" ? "active" : ""}
                    onClick={() => setActiveTab("2")}
                  >
                    {t("vendorManagement.cardDetails")}
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={activeTab}>
                <Suspense fallback={<Loader />}>
                  <TabPane tabId="1">
                    {activeTab === "1" && (
                      <div className="account-setup-form">
                        <div className="row no-gutters">
                          <div className="col-xl-3 col-lg-4 order-lg-last">
                            <div
                              className={
                                "file-upload-container " +
                                styles["file-upload-container"]
                              }
                            >
                              <div className="file-upload-field">
                                <div className="img">
                                  {imageUrl ? (
                                    <img src={imageUrl} alt="upload" />
                                  ) : (
                                    <img
                                      src={
                                        require("assets/images/default-image.svg")
                                          .default
                                      }
                                      alt="upload"
                                    />
                                  )}
                                </div>
                                <div className="ch-upload-button">
                                  <input
                                    id="fileUpload"
                                    type="file"
                                    onChange={fileChange}
                                  />
                                  <span>
                                    <img
                                      src={
                                        require("assets/images/upload-image.svg")
                                          .default
                                      }
                                      alt="upload"
                                    />
                                  </span>
                                </div>
                              </div>
                              <span className="upload-help-text">
                                {t("clickHereToUploadPicture")}
                              </span>
                              {errors.profileImage && (
                                <span className="error-msg text-md-center">
                                  {errors.profileImage}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="col-xl-9 col-lg-8">
                            <div className={styles["inner-form"]}>
                              <div
                                className={
                                  "field-group pr-0 " + styles["field-group"]
                                }
                              >
                                <Input
                                  Title={t("form.fields.firstName")}
                                  Type="text"
                                  Placeholder={t("form.placeholder1", {
                                    field: t("form.fields.firstName"),
                                  })}
                                  Name={"firstName"}
                                  Error={errors.firstName}
                                  MaxLength={200}
                                  HandleChange={handleChange}
                                  Value={firstName}
                                />
                                <Input
                                  Title={t("form.fields.lastName")}
                                  Type="text"
                                  Placeholder={t("form.placeholder1", {
                                    field: t("form.fields.lastName"),
                                  })}
                                  Name={"lastName"}
                                  Error={errors.lastName}
                                  MaxLength={200}
                                  HandleChange={handleChange}
                                  Value={lastName}
                                />

                                <Input
                                  Title={t("form.fields.companyName")}
                                  Type="text"
                                  Placeholder={t("form.placeholder1", {
                                    field: t("form.fields.companyName"),
                                  })}
                                  Name={"companyName"}
                                  Error={errors.companyName}
                                  MaxLength={200}
                                  HandleChange={handleChange}
                                  Value={companyName}
                                />
                                <Input
                                  Title={t("form.fields.contactNumber")}
                                  Type="text"
                                  Placeholder={t("form.placeholder1", {
                                    field: t("form.fields.contactNumber"),
                                  })}
                                  MaxLength={16}
                                  Name={"contactNumber"}
                                  HandleChange={handleChangeNumber}
                                  Value={contactNumber}
                                  Error={errors.contactNumber}
                                />

                                {countryList && countryList.length > 0 && (
                                  <div className="custom-dropdown-only">
                                    <Select
                                      Title={t("form.fields.country")}
                                      selectedOption={country}
                                      Options={countryList}
                                      Disabled
                                    />
                                  </div>
                                )}
                                {errors.country && (
                                  <span className="error-msg">
                                    {errors.country}
                                  </span>
                                )}

                                <div className={"location-input-wrapper"}>
                                  <CustomInput
                                    Title={t("form.fields.officeAddress")}
                                    Type="text"
                                    Placeholder={t("form.placeholder1", {
                                      field: t("form.fields.officeAddress"),
                                    })}
                                    Name={"officeAddress"}
                                    autoComplete={"off"}
                                    onBlurChange={customInputBlurChange}
                                    HandleChange={predictionHandleChange}
                                    Error={errors?.officeAddress}
                                    Value={officeAddress}
                                  />
                                  <ul className="location-list">
                                    {showPredictions &&
                                      placePredictionContent()}
                                  </ul>
                                </div>
                                {provienceList && provienceList.length > 0 && (
                                  <div className="custom-dropdown-only">
                                    <CustomSelect
                                      Title={t("form.fields.provinceOrState")}
                                      options={provienceList}
                                      dropdownClasses={"custom-select-scroll"}
                                      id={"province"}
                                      selectedOption={{
                                        name: getSelectedOption(
                                          provienceList,
                                          province
                                        ),
                                      }}
                                      selectOption={(value) => {
                                        const eventObj = handleCustomDropDown(
                                          value,
                                          "province"
                                        );
                                        handleChange(eventObj);
                                      }}
                                    />
                                  </div>
                                )}
                                {errors.province && (
                                  <span className="error-msg">
                                    {errors.province}
                                  </span>
                                )}

                                <div className="row">
                                  <div className="col-md-6">
                                    {cityList && cityList.length > 0 && (
                                      <div className="custom-dropdown-only">
                                        <CustomSelect
                                          Title={t("form.fields.city")}
                                          options={cityList}
                                          id={"city"}
                                          dropdownClasses={
                                            "custom-select-scroll"
                                          }
                                          selectedOption={{
                                            name: getSelectedOption(
                                              cityList,
                                              city
                                            ),
                                          }}
                                          selectOption={(value) => {
                                            const eventObj =
                                              handleCustomDropDown(
                                                value,
                                                "city"
                                              );
                                            handleChange(eventObj);
                                          }}
                                        />
                                      </div>
                                    )}
                                    {errors.city && (
                                      <span className="error-msg">
                                        {errors.city}
                                      </span>
                                    )}
                                  </div>
                                  <div className="col-md-6">
                                    <Input
                                      Title={t("form.fields.postalCode")}
                                      Classes="c-field-lg-none"
                                      Type="text"
                                      Placeholder={t("form.placeholder1", {
                                        field: t("form.fields.postalCode"),
                                      })}
                                      Name={"postalCode"}
                                      Value={postalCode}
                                      HandleChange={handleChange}
                                      Error={errors.postalCode}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="btn-field">
                                <button
                                  className="button button-round button-shadow w-sm-100 mr-md-4"
                                  title={t("save")}
                                  onClick={onSubmit}
                                >
                                  {t("save")}
                                </button>

                                <button
                                  className="w-sm-100 button button-round button-border btn-mobile-link button-dark"
                                  title={t("cancel")}
                                  onClick={goBack}
                                >
                                  {t("cancel")}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </TabPane>
                  <TabPane tabId="2">
                    {activeTab === "2" && (
                      <CardDetails listOfCards={listOfCards} goBack={goBack} />
                    )}
                  </TabPane>
                </Suspense>
              </TabContent>
            </div>
          </div>
        </div>
      </Page>
    </LayoutVendor>
  );
};

export default withTranslation()(SetupAccount);
