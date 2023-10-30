import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  officeFieldData,
  getOfficesProvience,
  addOffice,
  editOffice,
  getSastoken,
  getOfficesCountry,
  getOfficesCity,
  UpdateImage,
} from "actions/index";
import {
  BlobServiceClient,
  AnonymousCredential,
  newPipeline,
} from "@azure/storage-blob";
import { v4 as uuidv4 } from "uuid";

/*components*/
import Input from "components/Input";
import Select from "components/Select";
import CustomSelect from "components/CustomSelect";
import Helper from "utils/helper";
import Loader from "components/Loader";
import Toast from "components/Toast";
import _isLoading from "hoc/isLoading";
import { withTranslation } from "react-i18next";
import constants from "./../../../../constants";
import TitleInput from "components/TitleInput";
import Text from "components/Text";
import circularAddIcon from "./../../../../assets/images/circular-add.svg";
import SelectSpecialtyPopup from "./SelectSpecialtyPopup";
import { getUserSpecialties } from "repositories/specialty-repository";
import { testRegexCheck } from "utils";

class EditProfile extends Component {
  state = {
    officeName: "",
    officeAddress: "",
    contactNumber: "",
    country: "",
    province: "",
    city: "",
    postalCode: "",
    accountLogo: "",
    errors: {},
    blobLoader: false,
    isToastView: false,
    isProps: true,
    blobFileName: null,
    emailId: null,
    RoleType: null,
    title: null,
    firstName: null,
    lastName: null,
    yearsOfExperience: "",
    licenseId: "",
    isSpecialtyPopupOpen: false,
    userSpecialties: [],
  };

  async componentDidMount() {
    this.props.getOfficesCountry();
    this.props.getSastoken();
    await this.getUserSpecialties();

    if (this.state.isProps) {
      this.props.getOfficesProvience({ id: this.props.profile.countryId });
      this.props.getOfficesCity({ id: this.props.profile.provinceId });
    }

    if (
      (this.props.profile &&
        this.props.profile.profileSetupStep === "packageExpired") ||
      this.props.profile.profileSetupStep === "subscriptionTerminated"
    ) {
      this.props.history.push("/");
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (Object.keys(props.profile).length > 0 && state.isProps) {
      return {
        officeName: props.profile.companyName,
        officeAddress: props.profile.address,
        contactNumber: props.profile.contactNumber,
        country: props.profile.countryId,
        province: props.profile.provinceId,
        city: props.profile.cityId,
        postalCode: props.profile.postalCode,
        accountLogo: props.profile.profilePic,
        blobFileName:
          props.profile.profilePic &&
          props.profile.profilePic.split("accountpictures/"),
        emailId: props.profile.emailId,
        RoleType: props.profile.role.systemRole,
        title: props.profile.honorific,
        firstName: props.profile.firstName,
        lastName: props.profile.lastName,
        yearsOfExperience:
          props.profile.yearsOfExperience &&
          `${props.profile.yearsOfExperience}`,
        licenseId: props.profile.licenseId,
      };
    }
    return null;
  }

  getUserSpecialties = async () => {
    try {
      const userSpecialties = await getUserSpecialties(this.props.profile.id);
      this.setState({ userSpecialties });
    } catch (e) {}
  };

  componentDidUpdate(prevProps) {
    if (
      prevProps.isOfficeAdd !== this.props.isOfficeAdd ||
      prevProps.isAddedError !== this.props.isAddedError ||
      prevProps.isImageAdded !== this.props.isImageAdded
    ) {
      window.scrollTo(0, 0);

      this.setState({ isToastView: true });
      setTimeout(() => {
        if (this.props.isImageAdded) {
          this.setState({ isToastView: false });
        }
        if (this.props.isOfficeAdd) {
          this.props.history.push("/");
        }
      }, 2500);
    }
  }

  fileChange = (event) => {
    this.setState({ isProps: false });
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

    if (extFile !== "" && fileSizeLimit) {
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
    let fieldsArray = [
      "officeName",
      "firstName",
      "lastName",
      "officeAddress",
      "licenseId",
    ];
    if (fieldsArray.includes(name) && !testRegexCheck(value)) return;
    this.setState({ [name]: value });
  };

  upload = () => {
    //const accountName = 'mxhhstagingstorageacc';
    const accountName = `${process.env.REACT_APP_AZURE_STORAGE_ACCOUNT}`;
    const sasString = this.props.sasToken.token;
    const file = document.getElementById("fileUpload").files[0];
    const pipeline = newPipeline(new AnonymousCredential());
    //const containerName = 'accountpictures';
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
        this.setState({ accountLogo: fileName[0] }, () => {
          const payload = {
            resourceType: "user",
            resourceId: this.props.profile.id,
            imageUrl: fileName[0],
          };
          this.props.UpdateImage({ ...payload });
        });
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
    async function main() {
      const containerClient =
        blobServiceClient.getContainerClient(containerName);
      const item = await containerClient.getBlockBlobClient(fileName1).exists();
      return item;
    }
    async function mainDeleteBlob() {
      const containerClient =
        blobServiceClient.getContainerClient(containerName);
      const blockBlobClient = containerClient.getBlockBlobClient(fileName1);
      blockBlobClient.delete();
    }
    const Result = main();
    Result.then((data) => {
      if (data) {
        this.setState({ blobFileName: null });
        mainDeleteBlob();
      }
    });
  };

  isValid = () => {
    const {
      officeName,
      title,
      firstName,
      lastName,
      officeAddress,
      contactNumber,
      country,
      province,
      city,
      postalCode,
      yearsOfExperience,
    } = this.state;
    const errors = {};
    let isValid = true;

    const { t } = this.props;

    if (!officeName) {
      errors.officeName = t("form.errors.emptyField", {
        field: t("form.fields.name"),
      });
      isValid = false;
    }

    if (!title) {
      errors.title = t("form.errors.emptySelection", { field: t("title") });
      isValid = false;
    }

    if (!firstName) {
      errors.firstName = t("form.errors.emptyField", {
        field: t("form.fields.firstName"),
      });
      isValid = false;
    }

    if (!lastName) {
      errors.lastName = t("form.errors.emptyField", {
        field: t("form.fields.lastName"),
      });
      isValid = false;
    }

    if (!officeAddress) {
      errors.officeAddress = t("form.errors.emptyField", {
        field: t("form.fields.officeAddress"),
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

    if (
      yearsOfExperience &&
      yearsOfExperience.trim().length !== 0 &&
      !/^\d{0,2}(\.\d{1,2})?$/.test(yearsOfExperience.trim())
    ) {
      errors.yearsOfExperience = t("form.errors.yearsOfExperienceFormat");
      isValid = false;
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
      title,
      licenseId,
      yearsOfExperience,
      firstName,
      lastName,
      officeAddress,
      contactNumber,
      country,
      province,
      city,
      postalCode,
      accountLogo,
      userSpecialties,
    } = this.state;
    if (isValid) {
      const payload = {
        userId: this.props.profile.id,
        honorific: title,
        officeName,
        userFirstName: firstName,
        userLastName: lastName,
        officeAddress,
        contactNumber,
        countryId: parseInt(country),
        provinceId: parseInt(province),
        cityId: parseInt(city),
        postalCode,
        isOwnerAccount: true,
        accountLogo,
        cardId: null,
        specialities: userSpecialties.map((it) => it.id),
      };

      if (licenseId && licenseId.trim().length > 0) {
        payload.licenseId = licenseId.trim();
      }

      if (yearsOfExperience && yearsOfExperience.trim().length > 0) {
        payload.yearsOfExperience = parseFloat(yearsOfExperience);
      }

      this.props.editOffice({
        ...payload,
        officeId: this.props.profile.officeId,
      });
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

  render() {
    const {
      errors,
      accountLogo,
      blobLoader,
      isToastView,
      officeName,
      officeAddress,
      contactNumber,
      country,
      province,
      city,
      postalCode,
      RoleType,
      yearsOfExperience,
      licenseId,
      isSpecialtyPopupOpen,
      userSpecialties,
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
      <div className="profile-setup-block">
        {blobLoader && <Loader />}
        {isToastView && statusMessage && (
          <Toast
            message={statusMessage}
            handleClose={this.toastHide}
            errorToast={isAddedError ? true : false}
          />
        )}

        {/* Specialty Popup */}
        {isSpecialtyPopupOpen && (
          <SelectSpecialtyPopup
            alreadySelectedSpecialties={this.state.userSpecialties}
            onSave={(_userSpecialties) =>
              this.setState({
                isSpecialtyPopupOpen: false,
                userSpecialties: _userSpecialties,
              })
            }
            onClose={() => this.setState({ isSpecialtyPopupOpen: false })}
          />
        )}
        {/* Specialty Popup */}

        <div className="container container-smd">
          <h2 className="title">
            {RoleType && RoleType !== constants.systemRoles.superAdmin
              ? t("accountOwner.editProfile")
              : t("accountOwner.myProfile")}
          </h2>

          <div className="form-wrapper">
            <div className="profile-form">
              <div className="row no-gutters">
                {RoleType && RoleType !== constants.systemRoles.superAdmin && (
                  <div className="col-lg-auto order-lg-last">
                    <div className="file-upload-container">
                      <div className="file-upload-field">
                        <div className="img">
                          {accountLogo ? (
                            <img src={accountLogo} alt="upload" />
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
                            onChange={this.fileChange}
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
                      {Object.keys(errors).length > 0 && (
                        <span className="error-msg text-center">
                          {errors.file}{" "}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div
                  className={`${
                    RoleType && RoleType !== constants.systemRoles.superAdmin
                      ? "col-lg-auto"
                      : "col-lg-12 super-admin-profile"
                  }`}
                >
                  <div className="field-group">
                    {RoleType &&
                      RoleType !== constants.systemRoles.superAdmin && (
                        <>
                          <Text
                            secondary
                            marginBottom="30px"
                            weight="600"
                            size="16px"
                          >
                            {t("accountOwner.basicInfo")}
                          </Text>

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
                            HandleChange={this.InputChange}
                            Value={officeName}
                            Error={errors.officeName}
                          />

                          <TitleInput
                            value={this.state.title}
                            onChange={(v) =>
                              this.setState({ isProps: false, title: v })
                            }
                            error={errors.title}
                          />
                        </>
                      )}

                    <Input
                      Title={t("form.fields.firstName")}
                      Type="text"
                      Placeholder={t("form.placeholder1", {
                        field: t("form.fields.firstName"),
                      })}
                      MaxLength={50}
                      Name="firstName"
                      HandleChange={this.InputChange}
                      Value={this.state.firstName}
                      Error={errors.firstName}
                      Disabled={
                        RoleType &&
                        RoleType === constants.systemRoles.superAdmin
                      }
                    />

                    <Input
                      Title={t("form.fields.lastName")}
                      Type="text"
                      Placeholder={t("form.placeholder1", {
                        field: t("form.fields.lastName"),
                      })}
                      MaxLength={50}
                      Name="lastName"
                      HandleChange={this.InputChange}
                      Value={this.state.lastName}
                      Error={errors.lastName}
                      Disabled={
                        RoleType &&
                        RoleType === constants.systemRoles.superAdmin
                      }
                    />

                    <div className="c-field">
                      <label>{t("form.fields.emailAddress")}</label>
                      <input
                        type="text"
                        className="c-form-control"
                        placeholder={t("form.placeholder1", {
                          field: t("form.fields.emailAddress"),
                        })}
                        value={this.state.emailId}
                        disabled
                      />
                    </div>

                    {RoleType &&
                      RoleType !== constants.systemRoles.superAdmin && (
                        <Fragment>
                          <Input
                            Title={t("form.fields.contactNumber")}
                            Type="text"
                            Placeholder={t("form.placeholder1", {
                              field: t("form.fields.contactNumber"),
                            })}
                            MaxLength={15}
                            Name={"contactNumber"}
                            HandleChange={this.InputChange}
                            Value={contactNumber}
                            Error={errors.contactNumber}
                          />
                          <Input
                            Title={t("form.fields.officeAddress")}
                            Type="text"
                            Placeholder={t("form.placeholder1", {
                              field: t("form.fields.officeAddress"),
                            })}
                            Name={"officeAddress"}
                            HandleChange={this.InputChange}
                            Error={errors.officeAddress}
                            Value={officeAddress}
                          />
                          {countryList && countryList.length > 0 && (
                            <div className="custom-dropdown-only">
                              <Select
                                Title={t("form.fields.country")}
                                Disabled={true}
                                Options={countryList}
                                selectedOption={country}
                              />
                            </div>
                          )}
                          {errors.country && (
                            <span className="error-msg">{errors.country}</span>
                          )}

                          {provienceList && provienceList.length > 0 && (
                            <div className="custom-dropdown-only">
                              <CustomSelect
                                Title={t("form.fields.provinceOrState")}
                                options={provienceList}
                                dropdownClasses={"custom-select-scroll"}
                                id={"province"}
                                selectedOption={{
                                  name: this.getSelectedOption(
                                    provienceList,
                                    province
                                  ),
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
                          )}
                          {errors.province && (
                            <span className="error-msg">{errors.province}</span>
                          )}
                          <div className="row">
                            <div className="col-md-6">
                              <div className="custom-dropdown-only">
                                <CustomSelect
                                  Title={t("form.fields.city")}
                                  options={cityList || []}
                                  id={"city"}
                                  dropdownClasses={"custom-select-scroll"}
                                  selectedOption={{
                                    name: this.getSelectedOption(
                                      cityList,
                                      city
                                    ),
                                  }}
                                  selectOption={(value) => {
                                    const eventObj = this.handleCustomDropDown(
                                      value,
                                      "city"
                                    );
                                    this.InputChange(eventObj);
                                  }}
                                />
                              </div>
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
                                Value={postalCode}
                                HandleChange={this.InputChange}
                                Error={errors.postalCode}
                              />
                            </div>
                          </div>

                          <Text
                            secondary
                            marginTop="70px"
                            marginBottom="30px"
                            weight="600"
                            size="16px"
                          >
                            {t("accountOwner.medicalBackground")}
                          </Text>

                          <Input
                            Title={t("form.fields.yearsOfExperience")}
                            Type="text"
                            MaxLength={5}
                            Placeholder={t("form.placeholder1", {
                              field: t("form.fields.yearsOfExperience"),
                            })}
                            Name={"yearsOfExperience"}
                            Value={yearsOfExperience}
                            HandleChange={this.InputChange}
                            Error={errors.yearsOfExperience}
                          />

                          <div className="mb-4">
                            <Input
                              ReadOnly
                              Title={t("form.fields.specialtiesAndServices")}
                              Classes="c-field-lg-none"
                              Type="text"
                              Placeholder={t("form.placeholder1", {
                                field: t("form.fields.specialtiesAndServices"),
                              })}
                              Name={"specialtiesAndServices"}
                              Value={
                                userSpecialties.length === 1
                                  ? userSpecialties[0].title
                                  : `${userSpecialties.length} Selected`
                              }
                              Error={errors.specialtiesAndServices}
                            />
                            <div
                              className="d-flex flex-row align-items-center pointer mt-3"
                              onClick={() =>
                                this.setState({ isSpecialtyPopupOpen: true })
                              }
                            >
                              <img
                                src={circularAddIcon}
                                alt="circular-add-icon"
                              />
                              <Text
                                className="ml-2"
                                secondary
                                size="12px"
                                underline
                              >
                                {t("accountOwner.addOrEdit")}
                              </Text>
                            </div>
                          </div>

                          <Input
                            Title={t("form.fields.licenseId")}
                            Type="text"
                            Placeholder={t("form.placeholder1", {
                              field: t("form.fields.licenseId"),
                            })}
                            MaxLength={35}
                            Name={"licenseId"}
                            Value={licenseId}
                            HandleChange={this.InputChange}
                            Error={errors.licenseId}
                          />
                        </Fragment>
                      )}
                  </div>

                  {RoleType &&
                    RoleType !== constants.systemRoles.superAdmin && (
                      <div className="btn-field">
                        <div className="row gutters-12">
                          <div className="col-md-auto">
                            <button
                              className="button button-round button-min-130 button-shadow"
                              title={t("save")}
                              onClick={this.handleAddAccount}
                            >
                              {t("save")}
                            </button>
                          </div>
                          <div className="col-md-auto">
                            <Link to="/">
                              <button
                                className="button button-round button-border button-dark"
                                title={t("cancel")}
                              >
                                {t("cancel")}
                              </button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
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
    isImageAdded,
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
  isImageAdded,
});

export default connect(mapStateToProps, {
  addOffice,
  officeFieldData,
  getOfficesProvience,
  getSastoken,
  getOfficesCountry,
  getOfficesCity,
  editOffice,
  UpdateImage,
})(_isLoading(withTranslation()(EditProfile)));
