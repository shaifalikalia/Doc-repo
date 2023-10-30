import Input from "components/Input";
import Select from "components/Select";
import Loader from "components/Loader";
import { withTranslation } from "react-i18next";
import { testRegexCheck } from "utils";
import Page from "components/Page";
import CustomInput from "pages/Ofiices/components/CustomInput";
import { useVendorSetup } from "VendorManagement/pages/SetupAccount/hooks/useVendorSetup";
import { useMemo } from "react";
import HeaderVendor from "VendorManagement/components/HeaderVendor";
import styles from "./SetUpAccount.module.scss";

const SetupAccount = (props) => {
  const { t } = props;
  const {
    googleServices,
    formFields,
    errors,
    countryList,
    provienceList,
    isLoading,
    cityList,
    handlePlaceSelect,
    showPredictions,
    setShowPredictions,
    onSubmit,
    handleChange,
    handleChangeNumber,
    fileChange,
    imageUrl,
    customInputBlurChange,
  } = useVendorSetup({ t });

  const {
    companyName,
    contactNumber,
    officeAddress,
    province,
    city,
    postalCode,
    country,
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
    googleServices.getPlacePredictions({
      input: e.target.value,
      componentRestrictions: { country: selectedCountry ?? "" },
    });
  };

  const placePredictionContent = () => {
    return googleServices.placePredictions.map((place) => {
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

  return (
    <>
      <HeaderVendor simple={true} />
      <Page className={"vendor-setup-account"}>
        {isLoading && <Loader />}
        <div className="account-setup-block">
          <div className="container  container-smd">
            <h2 className="title">
              {t("vendorManagement.setupAccount.pageTitle")}
            </h2>
            <div className={styles["sub-title"]}>
              {t("vendorManagement.setupAccount.pageSubTitle")}
            </div>

            <div className="form-wrapper">
              <div className="account-setup-form">
                <div className="row no-gutters">
                  <div className="col-lg-4 order-lg-last">
                    <div className="file-upload-container">
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
                  <div className="col-lg-8">
                    <div className="field-group">
                      <div className={styles["page-step"]}>
                        {t("form.fields.pageStep2")}
                      </div>
                      <Input
                        Title={
                          t("form.fields.fullName") +
                          "/" +
                          t("form.fields.companyName")
                        }
                        Type="text"
                        Placeholder={t("form.placeholder1", {
                          field:
                            t("form.fields.fullName") +
                            "/" +
                            t("form.fields.companyName"),
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

                      <Select
                        Title={t("form.fields.country")}
                        Options={countryList}
                        Name={"country"}
                        HandleChange={handleChange}
                        Disabled
                        selectedOption={country}
                        Error={errors.country}
                      />

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
                          {showPredictions && placePredictionContent()}
                        </ul>
                      </div>

                      <Select
                        Title={t("form.fields.provinceOrState")}
                        Options={provienceList}
                        Name={"province"}
                        HandleChange={handleChange}
                        selectedOption={province}
                        Error={errors.province}
                      />

                      <div className="row">
                        <div className="col-md-6">
                          <Select
                            Title={t("form.fields.city")}
                            Options={cityList}
                            Name={"city"}
                            HandleChange={handleChange}
                            selectedOption={city}
                            Error={errors.city}
                          />
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
                        className="button button-round button-shadow w-sm-100"
                        title={t("accountOwner.setupAccount")}
                        onClick={onSubmit}
                      >
                        {t("accountOwner.setupAccount")}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Page>
    </>
  );
};

export default withTranslation()(SetupAccount);
