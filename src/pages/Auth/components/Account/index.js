import React, { Component } from "react";
import { connect } from "react-redux";
import {
  officeFieldData,
  getOfficesProvience,
  addOffice,
  getSastoken,
  getOfficesCountry,
  getOfficesCity,
} from "actions/index";
import {
  BlobServiceClient,
  AnonymousCredential,
  newPipeline,
} from "@azure/storage-blob";
import { v4 as uuidv4 } from "uuid";

/*components*/
import Input from "components/Input";
import CustomSelect from "components/CustomSelect";
import Helper from "utils/helper";
import Loader from "components/Loader";
import Toast from "components/Toast";
import _isLoading from "hoc/isLoading";
import { withTranslation } from "react-i18next";
import { testRegexCheck, testRegexCheckDescription } from "utils";
import constants from "../../../../constants";
import { toast } from "react-hot-toast";
import CurrencyConfirmation from "../CurrencyConfirmation";

class Account extends Component {
  state = {
    officeName: "",
    officeAddress: "",
    contactNumber: "",
    country: "",
    province: "",
    city: "",
    curreny: "",
    currencyConfirmation: {},
    postalCode: "",
    accountLogo: "",
    errors: {},
    blobLoader: false,
    isToastView: false,
    blobFileName: null,
  };

  componentDidMount() {
    this.props.getOfficesCountry();
    this.props.getSastoken();

    if (this.props.profile && this.props.profile.isAccountOwnerSetup) {
      this.props.history.push("/");
    }
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.isOfficeAdd !== this.props.isOfficeAdd ||
      prevProps.isAddedError !== this.props.isAddedError
    ) {
      window.scrollTo(0, 0);
      this.setState({ isToastView: true });
    }
  }

  fileChange = (event) => {
    event.preventDefault();
    let files;
    if (event.dataTransfer) {
      files = event.dataTransfer.files;
    } else if (event.target) {
      files = event.target.files;
    }
    const fsize = files[0].size;
    const fileLimit = Math.round(fsize / 1024);
    let fileSizeLimit = true;
    const extFile = files.length ? files[0].type : "";

    if (fileLimit >= 5120) {
      const errors = this.state.errors;
      this.setState({
        errors: {
          ...errors,
          file: "File too Big, please select a file less than 5mb",
        },
      });
      fileSizeLimit = false;
    }

    if (extFile && fileSizeLimit) {
      if (
        extFile === "image/jpeg" ||
        extFile === "image/jpg" ||
        extFile === "image/png"
      ) {
        if (this.state.blobFileName) {
          this.deleteBlob();
        }
        this.upload();
        this.setState({ blobLoader: true });
        const reader = new FileReader();
        reader.onload = () => {
          const errors = this.state.errors;
          this.setState({
            accountLogo: reader.result,
            error: { ...errors, file: "" },
          });
        };
        reader.readAsDataURL(files[0]);
        this.setState({ errors: { ...this.state.errors, file: "" } });
      } else {
        const errors = this.state.errors;
        this.setState({
          errors: { ...errors, file: "Please select valid file" },
        });
      }
    }
  };

  InputChange = (event) => {
    this.setState({ isProps: false });
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  errorMessageToast(message) {
    toast.error(message, { duration: 3000 });
  }

  upload = () => {
    const accountName = `${process.env.REACT_APP_AZURE_STORAGE_ACCOUNT}`;
    const sasString = this.props.sasToken.token;
    const file = document.getElementById("fileUpload").files[0];
    const pipeline = newPipeline(new AnonymousCredential());
    const containerName = `${process.env.REACT_APP_AZURE_STORAGE_CONTAINER}`;
    const fileExtenstion = file.name.split(".").pop();
    const blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net?${sasString}`,
      pipeline
    );

    async function main() {
      const containerClient =
        blobServiceClient.getContainerClient(containerName);
      const blobName = `${uuidv4()}.${fileExtenstion}`;
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);
      const blobOptions = {
        blobHTTPHeaders: { blobContentType: file.type },
      };
      const uploadBlobResponse = await blockBlobClient.uploadBrowserData(
        file,
        blobOptions
      );
      return uploadBlobResponse;
    }
    const Result = main();
    Result.then((data) => {
      if (data._response.status === 201 || data._response.status === 200) {
        this.setState({ blobLoader: false });
        const fileName = data._response.request.url.split("?");
        this.setState({ accountLogo: fileName[0] });

        if (!this.state.blobFileName) {
          this.setState({
            blobFileName: fileName[0].split("accountpictures/"),
          });
        }
      } else {
        this.setState({ blobLoader: false });
      }
    });
  };

  deleteBlob = () => {
    const accountName = `${process.env.REACT_APP_AZURE_STORAGE_ACCOUNT}`;
    const sasString = this.props.sasToken.token;
    const pipeline = newPipeline(new AnonymousCredential());
    const containerName = `${process.env.REACT_APP_AZURE_STORAGE_CONTAINER}`;
    const blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net?${sasString}`,
      pipeline
    );
    const fileName1 = this.state.blobFileName[1];
    async function mainDeleteBlob() {
      const containerClient =
        blobServiceClient.getContainerClient(containerName);
      const blockBlobClient = containerClient.getBlockBlobClient(fileName1);
      blockBlobClient.delete();
    }
    mainDeleteBlob();
    this.setState({ blobFileName: null });
  };

  isValid = () => {
    const {
      officeName,
      officeAddress,
      contactNumber,
      country,
      province,
      city,
      postalCode,
      curreny,
    } = this.state;
    const errors = {};
    let isValid = true;

    const { t } = this.props;

    if (!officeName) {
      errors.officeName = t("form.errors.emptyField", {
        field: t("form.fields.fullName") + "/" + t("form.fields.companyName"),
      });
      isValid = false;
    }
    if (!officeAddress) {
      errors.officeAddress = t("form.errors.emptyField", {
        field: t("form.fields.address"),
      });
      isValid = false;
    }

    if (!contactNumber) {
      errors.contactNumber = t("form.errors.emptyField", {
        field: t("form.fields.contactNumber"),
      });
      isValid = false;
    }

    if (contactNumber && !Helper.validateNumber(contactNumber)) {
      errors.contactNumber = t("form.errors.invalidValue", {
        field: t("form.fields.contactNumber"),
      });
      isValid = false;
    }

    if (!country) {
      errors.country = t("form.errors.emptySelection", {
        field: t("form.fields.country"),
      });
      isValid = false;
    }

    if (!curreny) {
      errors.curreny = t("form.errors.emptySelection", {
        field: t("form.fields.currency"),
      });
      isValid = false;
    }

    if (!province) {
      errors.province = t("form.errors.emptySelection", {
        field: t("form.fields.provinceOrState"),
      });
      isValid = false;
    }

    if (!city) {
      errors.city = t("form.errors.emptySelection", {
        field: t("form.fields.city"),
      });
      isValid = false;
    }

    if (!postalCode) {
      errors.postalCode = t("form.errors.emptyField", {
        field: t("form.fields.postalCode"),
      });
      isValid = false;
    }

    if (country == 1) {
      if (postalCode && !Helper.validatePostcode(postalCode)) {
        errors.postalCode = t("form.errors.invalidValue", {
          field: t("form.fields.postalCode"),
        });
        isValid = false;
      }
    }

    if (country == 2) {
      if (postalCode && !Helper.validateUSAPostcode(postalCode)) {
        errors.postalCode = t("form.errors.invalidValue", {
          field: t("form.fields.postalCode"),
        });
        isValid = false;
      }
    }

    this.setState({ errors });

    return isValid;
  };

  handleCountry = (event) => {
    this.setState({ isProps: false });
    const { name, value } = event.target;

    this.setState({ [name]: value, province: "", city: "" });
    this.props.getOfficesProvience({ id: value });
  };

  handleProvience = (event) => {
    this.setState({ isProps: false });
    const { name, value } = event.target;
    this.setState({ [name]: value, city: "" });
    this.props.getOfficesCity({ id: value });
  };

  handleAddAccount = () => {
    const isValid = this.isValid();
    const {
      officeName,
      officeAddress,
      contactNumber,
      country,
      province,
      city,
      postalCode,
      accountLogo,
    } = this.state;
    if (isValid) {
      const payload = {
        userId: this.props.profile.id,
        officeName,
        officeAddress,
        contactNumber,
        countryId: parseInt(country),
        provinceId: parseInt(province),
        cityId: parseInt(city),
        postalCode,
        isOwnerAccount: true,
        accountLogo,
        cardId: null,
      };

      this.props.addOffice({ ...payload });
    }
  };

  toastHide = () => {
    this.setState({ isToastView: false });
  };

  getSelectedOption = (list, value) => {
    const selectedData =
      list?.find((val) => val.id.toString() === value?.toString()) || {};
    return selectedData.name;
  };

  handleCustomDropDown = (value, name) => {
    const eventObject = {
      target: {
        value: value.id.toString(),
        name: name,
      },
    };

    return eventObject;
  };

  handleCurrency = (currencyObject) => {
    try {
      this.setState({
        curreny: currencyObject,
        currencyConfirmation: {},
      });

      if (
        Array.isArray(this.props.countryList) &&
        this.props.countryList.length
      ) {
        let { value } = currencyObject;
        let countryMathcCurrency = this.props.countryList.find(
          (item) => item.id === value
        );
        countryMathcCurrency?.id &&
          this.handleCountry(
            this.handleCustomDropDown(countryMathcCurrency, "country")
          );
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  handleCurrencyConfirmation = (currencyObject) => {
    this.setState({ currencyConfirmation: currencyObject });
  };

  handleCountryValue = (value) => {
    const eventObj = this.handleCustomDropDown(value, "country");

    if (this.state.curreny && this.state?.curreny?.value !== value.id) {
      if (this.state?.curreny?.value === constants.curreny.CAD) {
        this.errorMessageToast(this.props.t("accountOwner.cannotSelectUs"));
      } else {
        this.errorMessageToast(this.props.t("accountOwner.cannotSelectCad"));
      }
      return;
    }

    this.handleCountry(eventObj);
  };

  render() {
    const {
      errors,
      accountLogo,
      blobLoader,
      isToastView,
      country,
      province,
      city,
    } = this.state;
    const {
      statusMessage,
      provienceList,
      isAddedError,
      countryList,
      cityList,
      t,
    } = this.props;

    return (
      <div className="account-setup-block">
        {blobLoader && <Loader />}
        <CurrencyConfirmation
          isOpen={this.state.currencyConfirmation?.value ? true : false}
          t={t}
          isCadCurrency={
            this.state.currencyConfirmation?.value === constants.curreny.CAD
          }
          onSubmit={() => {
            this.handleCurrency(this.state.currencyConfirmation);
          }}
          closeModel={() => {
            this.setState({ currencyConfirmation: {} });
          }}
        />
        {isToastView && (
          <Toast
            message={statusMessage}
            handleClose={this.toastHide}
            errorToast={isAddedError ? true : false}
          />
        )}
        <div className="container  container-smd">
          <h2 className="title">{t("accountOwner.setupYourAccount")}</h2>
          <h4 className="sub-title">
            {t("accountOwner.letsHelpYouInSettingUpYourAccount")}
          </h4>

          <div className="form-wrapper">
            <div className="account-setup-form">
              <div className="row no-gutters">
                <div className="col-lg-auto order-lg-last">
                  <div className="file-upload-container">
                    <div className="file-upload-field">
                      <div className="img">
                        {accountLogo ? (
                          <img src={accountLogo} alt="upload" />
                        ) : (
                          <img
                            src={
                              require("assets/images/default-image.svg").default
                            }
                            alt="upload"
                          />
                        )}
                      </div>
                      <div className="ch-upload-button">
                        <input
                          id="fileUpload"
                          type="file"
                          onChange={this.fileChange}
                        />
                        <span>
                          <img
                            src={
                              require("assets/images/upload-image.svg").default
                            }
                            alt="upload"
                          />
                        </span>
                      </div>
                    </div>
                    <span className="upload-help-text">
                      {t("clickHereToUploadPicture")}
                    </span>
                    {Object.keys(errors).length > 0 && (
                      <span className="error-msg text-center">
                        {errors.file}{" "}
                      </span>
                    )}
                  </div>
                </div>
                <div className="col-lg-7">
                  <div className="field-group">
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
                      Name={"officeName"}
                      Error={errors.officeName}
                      HandleChange={(e) => {
                        testRegexCheck(e.target.value) && this.InputChange(e);
                      }}
                      Value={this.state.officeName}
                    />

                    <Input
                      Title={t("form.fields.contactNumber")}
                      Type="text"
                      Placeholder={t("form.placeholder1", {
                        field: t("form.fields.contactNumber"),
                      })}
                      MaxLength={15}
                      Name={"contactNumber"}
                      HandleChange={(e) => {
                        testRegexCheck(e.target.value) && this.InputChange(e);
                      }}
                      Value={this.state.contactNumber}
                      Error={errors.contactNumber}
                    />

                    <Input
                      Title={t("form.fields.address")}
                      Type="text"
                      Placeholder={t("form.placeholder1", {
                        field: t("form.fields.address"),
                      })}
                      Name={"officeAddress"}
                      HandleChange={(e) => {
                        testRegexCheckDescription(e.target.value) &&
                          this.InputChange(e);
                      }}
                      Value={this.state.officeAddress}
                      Error={errors.officeAddress}
                    />

                    <div className="row">
                      <div className="col-6">
                        <div className="custom-dropdown-only">
                          <CustomSelect
                            Title={t("Currency")}
                            options={constants.currenyArray}
                            id={"currency"}
                            dropdownClasses={"custom-select-scroll"}
                            selectedOption={this.state.curreny}
                            selectOption={this.handleCurrencyConfirmation}
                          />
                        </div>
                        {errors.curreny && (
                          <span className="error-msg">{errors.curreny}</span>
                        )}
                      </div>

                      <div className="col-6">
                        {countryList && countryList.length > 0 && (
                          <div className="custom-dropdown-only">
                            <CustomSelect
                              Title={t("form.fields.country")}
                              options={countryList}
                              id={"country"}
                              dropdownClasses={"custom-select-scroll"}
                              selectedOption={{
                                name: this.getSelectedOption(
                                  countryList,
                                  country
                                ),
                              }}
                              selectOption={(value) => {
                                this.handleCountryValue(value);
                              }}
                            />
                          </div>
                        )}
                        {errors.country && (
                          <span className="error-msg">{errors.country}</span>
                        )}
                      </div>
                    </div>

                    <div className="custom-dropdown-only">
                      <CustomSelect
                        Title={t("form.fields.provinceOrState")}
                        options={provienceList || []}
                        id={"province"}
                        dropdownClasses={"custom-select-scroll"}
                        selectedOption={{
                          name: this.getSelectedOption(provienceList, province),
                        }}
                        selectOption={(value) => {
                          const eventObj = this.handleCustomDropDown(
                            value,
                            "province"
                          );
                          this.handleProvience(eventObj);
                        }}
                      />
                    </div>
                    {errors.province && (
                      <span className="error-msg">{errors.province}</span>
                    )}

                    <div className="row">
                      <div className="col-md-6 custom-dropdown-only">
                        <CustomSelect
                          Title={t("form.fields.city")}
                          options={cityList || []}
                          id={"city"}
                          dropdownClasses={"custom-select-scroll"}
                          selectedOption={{
                            name: this.getSelectedOption(cityList, city),
                          }}
                          selectOption={(value) => {
                            const eventObj = this.handleCustomDropDown(
                              value,
                              "city"
                            );
                            this.InputChange(eventObj);
                          }}
                        />
                        {errors.city && (
                          <span className="error-msg">{errors.city}</span>
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
                          Value={this.state.postalCode}
                          HandleChange={(e) => {
                            testRegexCheck(e.target.value) &&
                              this.InputChange(e);
                          }}
                          Error={errors.postalCode}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="btn-field">
                    <button
                      className="button button-round button-shadow w-sm-100"
                      title={t("accountOwner.setupAccount")}
                      onClick={this.handleAddAccount}
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
    );
  }
}

const mapStateToProps = ({
  userProfile: { profile },
  offices: {
    statusMessage,
    isLoading,
    isOfficeAdd,
    officeDetail,
    provienceList,
    isAddedError,
    countryList,
    cityList,
  },
  errors: { isError },
  userProfile: { sasToken },
}) => ({
  statusMessage,
  isLoading,
  isError,
  isOfficeAdd,
  officeDetail,
  provienceList,
  isAddedError,
  sasToken,
  profile,
  countryList,
  cityList,
});

export default connect(mapStateToProps, {
  addOffice,
  officeFieldData,
  getOfficesProvience,
  getSastoken,
  getOfficesCountry,
  getOfficesCity,
})(_isLoading(withTranslation()(Account)));
