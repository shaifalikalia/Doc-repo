import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
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
import { addOffice, editOffice } from "actions/index";
import Toast from "components/Toast";
import {
  getSastoken,
  officeFieldData,
  getOfficesProvience,
  getOfficesCountry,
  getOfficesCity,
  getOfficesDetail,
} from "actions/index";
import _isLoading from "hoc/isLoading";
import PaymentDetails from "pages/Subscription/PaymentDetails";
import { withTranslation } from "react-i18next";
import cameraIconWithBg from "./../../../assets/images/camera-icon-with-bg.svg";
import Loader from "components/Loader";
import { TabContent, TabPane } from "reactstrap";
import MapViewModal from "../components/MapViewModal";
import constants from "../../../constants";
import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import styles from "../Office.module.scss";
import { getCityList } from "repositories/office-repository";
import toast from "react-hot-toast";
import CustomInput from "../components/CustomInput";
import { testRegexCheck } from "utils";
import Alert from "reactstrap/lib/Alert";

function withGoogleAutoSuggestion(Wrapcomponent) {
  return (props) => {
    const googleServices = usePlacesService({
      apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
      debounce: 700,
    });
    return <Wrapcomponent googleServices={googleServices} {...props} />;
  };
}

class AddOffice extends Component {
  state = {
    officeName: "",
    officeAddress: "",
    contactNumber: "",
    country: "",
    province: "",
    city: "",
    postalCode: "",
    errors: {},
    isToastView: false,
    isProps: true,
    accountLogo: "",
    officeDetailTab: true,
    paymentDetailsTab: false,
    cardId: "",
    officeImage: "",
    officeLogo: "",
    cityList: [],
    showMapPredictions: false,
    showCountryToaster: false,
    googleSearchListNearBy: [],
    markerPosition: "",
    lat: 0,
    long: 0,
    selectedPlacedId: "",
    placeId: null,

    currentFormDetail: {
      officeName: "",
      officeAddress: "",
      contactNumber: "",
      country: "",
      province: "",
      city: "",
      postalCode: "",
      accountLogo: "",
      cardId: "",
      officeAddressEdit: "",
    },
    activeTab: "1",
    isMapViewModalOpen: false,
  };

  toggle(key) {
    this.state.activeTab = key;
    this.setState(this.state);
  }

  openModal = () => this.setState({ isMapViewModalOpen: true });
  closeModal = () => this.setState({ isMapViewModalOpen: false });

  componentDidMount() {
    this.props.getOfficesCountry();
    this.props.getSastoken();

    if (
      this.props.profile &&
      this.props.location.pathname === "/AddOffice" &&
      (this.props.profile.profileSetupStep === "packageExpired" ||
        this.props.profile.profileSetupStep === "subscriptionTerminated" ||
        this.props.profile.officesAvailableToAdd === 0)
    ) {
      this.props.history.push("/");
    }

    if (this.props.location.state) {
      this.props.getOfficesDetail({ Id: this.props.location.state.officeId });
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.location.pathname !== "/AddOffice" && state.isProps) {
      return {
        officeName: props.officeDetail.name,
        officeAddress: props.officeDetail.address,
        officeAddressEdit: props.officeDetail.address,
        contactNumber: props.officeDetail.contactNumber,
        country: props.officeDetail.countryId || props?.profile?.countryId,
        province: props.officeDetail.provinceId,
        city: props.officeDetail.cityId,
        postalCode: props.officeDetail.postCode,
        cardId: props.officeDetail.cardId,
        officeImage: props.officeDetail.officeImage,
        officeLogo: props.officeDetail.officeLogo,
        placeId: props.officeDetail.placeId,
        lat: props.officeDetail.latitude,
        long: props.officeDetail.longitude,
        selectedPlacedId: props.officeDetail.placeId,
        markerPosition: {
          lat: props.officeDetail.latitude,
          lng: props.officeDetail.longitude,
        },
        currentFormDetail: {
          officeName: props.officeDetail.name,
          officeAddress: props.officeDetail.address,
          selectedPlacedId: props.officeDetail.placeId,
          contactNumber: props.officeDetail.contactNumber,
          country: props.officeDetail.countryId,
          province: props.officeDetail.provinceId,
          city: props.officeDetail.cityId,
          postalCode: props.officeDetail.postCode,
          accountLogo: "",
          cardId: props.officeDetail.cardId,
          officeImage: props.officeDetail.officeImage,
          officeLogo: props.officeDetail.officeLogo,
          lat: props.officeDetail.latitude,
          long: props.officeDetail.longitude,
        },
      };
    }

    if (props.location.pathname == "/AddOffice" && state.isProps) {
      return {
        country: props?.profile?.countryId,
      };
    }

    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.isOfficeAdd !== this.props.isOfficeAdd ||
      prevProps.isAddedError !== this.props.isAddedError ||
      prevProps.isPaymentDetailError !== this.props.isPaymentDetailError ||
      prevProps.cardstatusMessage !== this.props.cardstatusMessage
    ) {
      window.scrollTo(0, 0);
      this.setState({ isToastView: true });
      setTimeout(() => {
        if (this.props.cardstatusMessage && this.props.cardSaved) {
          this.setState({ isToastView: false });
        }

        if (this.props.isOfficeAdd) {
          this.props.history.push("/Offices");
        }
      }, 2000);
    }

    if (
      this.props.location.state &&
      prevProps.officeDetail !== this.props.officeDetail &&
      this.props.officeDetail.provinceId
    ) {
      this.getListCity(this.props.officeDetail.provinceId);
    }
    if (this.state.country && !this.props?.provienceList?.length) {
      this.props.getOfficesProvience({ id: this.state.country });
    }

    if (
      !this.props.provienceList?.length &&
      this.state.country !== prevState.country
    ) {
      this.state.country &&
        this.props.getOfficesProvience({ id: this.state.country });
      if (this.state.placeId) {
        let location = {
          lat: this.state.lat,
          long: this.state.long,
        };
        this.handlePlaceSelect(
          this.state.placeId,
          this.state.officeAddress,
          this.state.placeId,
          location
        );
      }
    }
  }

  InputChange = (event) => {
    this.setState({ isProps: false });
    const { name, value } = event.target;
    if (name === "officeName" && !testRegexCheck(value)) return;
    this.setState({ [name]: value });
  };

  async getListCity(id) {
    if (!id) return;
    try {
      let res = await getCityList(id);
      this.setState({ cityList: res });
    } catch (error) {
      toast.error(error.message);
    }
  }

  isCardValid = () => {
    let isCardValid = true;

    const { cardId } = this.state;
    const errors = {};
    const { t } = this.props;

    if (!cardId) {
      errors.cardId = t("accountOwner.selectACard");
      isCardValid = false;
    }

    this.setState({ errors });

    return isCardValid;
  };

  handleCountry = (event) => {
    this.setState({
      isProps: false,
      showCountryToaster:
        parseFloat(this.props.profile.countryId) !==
        parseFloat(event.target.value),
    });
  };

  handleProvience = async (event) => {
    try {
      this.setState({ isProps: false });
      const { name, value } = event.target;
      this.setState({ [name]: value, city: "" });
      let res = await getCityList(value);
      this.setState({ cityList: res });
    } catch (error) {
      toast.error(error.message);
      this.setState({ cityList: [] });
    }
  };

  handleAddofficeContinue = (data) => {
    try {
      const isValid = this.isValid();
      const {
        officeName,
        officeAddress,
        contactNumber,
        country,
        province,
        city,
        postalCode,
        cardId,
        officeImage,
        officeLogo,
        placeId,
        lat,
        long,
      } = this.state;

      const {
        officeDetail: { id },
      } = this.props;

      if (isValid) {
        this.setState({ officeDetailTab: false, paymentDetailsTab: true });

        if (data) {
          const isCardValid = this.isCardValid();
          if (isCardValid) {
            const payload = {
              userId: this.props.profile.id,
              officeName,
              officeAddress,
              contactNumber,
              countryId: parseInt(country),
              provinceId: parseInt(province),
              cityId: parseInt(city),
              postalCode,
              isOwnerAccount: false,
              accountLogo: "",
              officeImage,
              officeLogo,
              cardId,
              placeId: placeId,
              latitude: lat,
              longitude: long,
            };

            if (this.props.location.pathname !== "/AddOffice") {
              this.props.editOffice({ ...payload, officeId: id });
            } else {
              this.props.addOffice({ ...payload });
            }
          }
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  toastHide = () => {
    this.setState({ isToastView: false });
  };

  officeTabShow = () => {
    this.setState({ officeDetailTab: true, paymentDetailsTab: false });
  };

  paymentTabShow = () => {
    const isValid = this.isValid();
    if (isValid) {
      this.setState({ officeDetailTab: false, paymentDetailsTab: true });
    }
  };

  fileChange = (event, imageType) => {
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

    if (fileLimit >= 1024 * 5) {
      const errors = this.state.errors;
      this.setState({
        errors: {
          ...errors,
          [imageType]: "File size should be less than 5 MB.",
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
        this.upload(imageType);
        this.setState({ blobLoader: true });
        const reader = new FileReader();
        reader.onload = () => {
          const errors = this.state.errors;
          this.setState({
            [imageType]: reader.result,
            error: { ...errors, [imageType]: "" },
          });
        };
        reader.readAsDataURL(files[0]);
        this.setState({ errors: { ...this.state.errors, [imageType]: "" } });
      } else {
        const errors = this.state.errors;
        this.setState({
          errors: { ...errors, [imageType]: "Please select valid file" },
        });
      }
    }
  };

  upload = (imageType) => {
    //const accountName = 'mxhhstagingstorageacc';
    const accountName = `${process.env.REACT_APP_AZURE_STORAGE_ACCOUNT}`;
    const sasString = this.props.sasToken.token;
    const file = document.getElementById(`fileUpload-${imageType}`).files[0];
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
        this.setState({ [imageType]: fileName[0] });
      }
    });
  };

  deleteBlob = () => {
    //const accountName = 'mxhhstagingstorageacc';
    const accountName = `${process.env.REACT_APP_AZURE_STORAGE_ACCOUNT}`;
    const sasString = this.props.sasToken.token;
    const pipeline = newPipeline(new AnonymousCredential());
    //const containerName = 'accountpictures';
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

  handleCardSelect = (id) => {
    this.setState({ cardId: id, isProps: false });
  };

  shouldDisableUpdateButton = () => {
    if (this.state.currentFormDetail.officeName !== this.state.officeName)
      return false;

    if (this.state.currentFormDetail.officeAddress !== this.state.officeAddress)
      return false;

    if (this.state.currentFormDetail.contactNumber !== this.state.contactNumber)
      return false;

    if (this.state.currentFormDetail.country !== this.state.country)
      return false;

    if (this.state.currentFormDetail.province !== this.state.province)
      return false;

    if (this.state.currentFormDetail.city !== this.state.city) return false;

    if (this.state.currentFormDetail.postalCode !== this.state.postalCode)
      return false;

    if (this.state.currentFormDetail.cardId !== this.state.cardId) return false;

    if (this.state.currentFormDetail.officeImage !== this.state.officeImage)
      return false;

    if (this.state.currentFormDetail.officeLogo !== this.state.officeLogo)
      return false;

    if (
      this.state.currentFormDetail.selectedPlacedId !==
      this.state.selectedPlacedId
    )
      return false;

    if (this.state.currentFormDetail.lat !== this.state.lat) return false;

    if (this.state.currentFormDetail.long !== this.state.long) return false;

    return true;
  };

  getCountry() {
    let name = this.props.countryList?.find(
      (e) => e.id === parseInt(this.state.country)
    )?.name;
    if (name) {
      name = name.slice(0, 2).toLowerCase();
    }
    return name ? [name.slice(0, 2)] : [];
  }

  placePredictionContent = () => {
    return this.props.googleServices.placePredictions.map((place) => {
      const { description, place_id } = place;
      return (
        <li
          key={place_id}
          onClick={() => {
            setTimeout(() => {
              this.setState({ showMapPredictions: false });
              this.handlePlaceSelect(place_id, description);
            }, 300);
          }}
        >
          {description}
        </li>
      );
    });
  };

  getLocationByAddress = (address) => {
    let locationInfo = {};
    for (const element of address) {
      let component = element.types[0];
      switch (component) {
        case constants.MAPKEY.COUNTRY:
          locationInfo.countryShortName = element["short_name"];
          locationInfo.country = element["long_name"];
          break;
        case constants.MAPKEY.ADMINISTRATIVE:
          locationInfo.state = element["long_name"];
          break;
        case constants.MAPKEY.LOCALITY:
          locationInfo.city = element["long_name"];
          break;
        case constants.MAPKEY.POSTALCODE:
          locationInfo.postalCode = element["long_name"];
          break;
        default:
          break;
      }
    }

    return locationInfo;
  };

  nearByLocationList = () => {
    return (
      <>
        <li>
          <div className="ch-radio">
            <label className="mr-5">
              <input
                type="radio"
                name="selectTime"
                checked={this.state.selectedPlacedId == constants.NOTINGOOGLE}
                onChange={() => {
                  this.setState({
                    isProps: false,
                    selectedPlacedId: constants.NOTINGOOGLE,
                    placeId: null,
                  });
                }}
              />
              <span> {this.props.t("accountOwner.notRegisterInGoogle")}</span>
            </label>
          </div>
        </li>
        {this.state.googleSearchListNearBy?.map((item, index) => (
          <li key={index}>
            <div className="ch-radio">
              <label className="mr-5">
                <input
                  type="radio"
                  name="selectTime"
                  value={item.place_id}
                  checked={item.place_id == this.state.selectedPlacedId}
                  onChange={() => {
                    this.setState({
                      isProps: false,
                      selectedPlacedId: item.place_id,
                      placeId: item.place_id,
                    });
                  }}
                />
                <span>{item.name} </span>
              </label>
            </div>
          </li>
        ))}
      </>
    );
  };

  handlePlaceSelect = (placeId, description, selectedPlacedId, location) => {
    try {
      this.props.googleServices?.placesService?.getDetails(
        { placeId },
        async (details) => {
          this.setState({
            isProps: false,
            officeAddress: description || details.formatted_address,
            selectedPlacedId: selectedPlacedId
              ? selectedPlacedId
              : constants.NOTINGOOGLE,
            lat: location?.lat
              ? location?.lat
              : details.geometry.location.lat(),
            long: location?.long
              ? location?.long
              : details.geometry.location.lng(),
            placeId: placeId,
            markerPosition: {
              lat: location?.lat
                ? location?.lat
                : details.geometry.location.lat(),
              lng: location?.long
                ? location?.long
                : details.geometry.location.lng(),
            },
          });

          this.props.googleServices?.placesService?.nearbySearch(
            {
              location: details.geometry.location,
              rankBy: window.google.maps.places.RankBy.DISTANCE,
              types: constants.GOOGLEPLACETYPE,
            },
            (list) => {
              this.setState({
                googleSearchListNearBy: list,
                showMapPredictions: false,
              });
            }
          );

          let locationInfo = this.getLocationByAddress(
            details.address_components
          );
          if (locationInfo?.state && this.state.country) {
            let res;
            let googleState = this.props.provienceList?.find(
              (item) =>
                item.name.toLowerCase() === locationInfo.state.toLowerCase()
            );
            if (googleState) {
              res = await getCityList(googleState.id);
              this.setState({ province: googleState.id });
            }
            if (res) {
              this.setState({
                cityList: res,
                postalCode: locationInfo.postalCode ?? "",
              });
              let googleCity = res?.find(
                (item) =>
                  item.name.toLowerCase() === locationInfo?.city?.toLowerCase()
              );
              if (googleCity) {
                // selected city
                this.setState({ city: googleCity.id });
              } else {
                if (locationInfo.city) {
                  this.setState({
                    cityList: [
                      { name: locationInfo.city, id: locationInfo.city },
                      ...res,
                    ],
                    city: locationInfo.city,
                  });
                } else {
                  this.setState({
                    cityList: [...res],
                    city: "",
                  });
                }
              }
            }
          }
        }
      );
    } catch (error) {
      toast.error(error.message);
    }
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
      placeId,
      selectedPlacedId,
    } = this.state;
    const errors = {};
    let isValid = true;

    const { t } = this.props;

    if (!officeName) {
      errors.officeName = t("form.errors.emptyField", {
        field: t("form.fields.officeName"),
      });
      isValid = false;
    }
    if (!officeAddress) {
      errors.officeAddress = t("form.errors.emptyField", {
        field: t("form.fields.officeAddress"),
      });
      isValid = false;
    }

    if (officeAddress?.length > constants.wordLimits.ADDOFFICEADDRESS) {
      errors.officeAddress = t("form.errors.officeAddressLimit");
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
    if (!postalCode) {
      errors.postalCode = t("form.errors.emptyField", {
        field: t("form.fields.postalCode"),
      });
      isValid = false;
    }

    if (!selectedPlacedId && placeId) {
      errors.selectGooglePredection = t("form.fields.selectGooglePredection");
      isValid = false;
    }

    this.setState({ errors });

    return isValid;
  };

  handleAddoffice = () => {
    const isValid = this.isValid();
    if (!isValid) return;
    let {
      officeName,
      officeAddress,
      contactNumber,
      country,
      province,
      city,
      postalCode,
      officeImage,
      officeLogo,
      placeId,
      lat,
      long,
      cityList,
    } = this.state;
    const {
      officeDetail: { id },
    } = this.props;

    let selectedCity;
    if (isNaN(parseInt(city))) {
      selectedCity = cityList?.find((e) => e.id === city);
      if (!selectedCity) {
        return;
      }
      city = 0;
    }

    const payload = {
      userId: this.props.profile.id,
      officeName,
      officeAddress,
      contactNumber,
      countryId: parseInt(country),
      provinceId: parseInt(province),
      cityId: parseInt(city),
      city: selectedCity ? selectedCity.name : null,
      postalCode,
      isOwnerAccount: false,
      accountLogo: "",
      officeImage,
      officeLogo,
      placeId: placeId,
      latitude: lat,
      longitude: long,
    };

    if (this.props.location.pathname !== "/AddOffice") {
      this.props.editOffice({ ...payload, officeId: id });
    } else {
      this.props.addOffice({ ...payload });
    }
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
      officeName,
      officeAddress,
      contactNumber,
      country,
      province,
      city,
      postalCode,
      errors,
      cityList,
      isToastView,
      officeImage,
      officeLogo,
      showMapPredictions,
      googleSearchListNearBy,
      showCountryToaster,
    } = this.state;
    const {
      statusMessage,
      provienceList,
      isAddedError,
      countryList,
      PaymentstatusMessage,
      isPaymentDetailError,
      cardstatusMessage,
      isLoadError,
      t,
    } = this.props;

    let selectedCountry = countryList
      ?.find((e) => e.id == country)
      ?.name?.slice(0, 2);
    return (
      <>
        <div className="add-office-block">
          {this.state.blobLoader && <Loader />}
          {isToastView && statusMessage && (
            <Toast
              message={statusMessage}
              handleClose={this.toastHide}
              errorToast={isAddedError ? true : false}
            />
          )}
          {isToastView && PaymentstatusMessage && (
            <Toast
              message={PaymentstatusMessage}
              handleClose={this.toastHide}
              errorToast={isPaymentDetailError ? true : false}
            />
          )}

          {isToastView && !this.props.statusMessage && cardstatusMessage && (
            <Toast
              message={cardstatusMessage}
              handleClose={this.toastHide}
              errorToast={isLoadError ? true : false}
            />
          )}

          <div className="container">
            <button className="back-btn">
              <Link to="/Offices">
                <span className="ico">
                  <img
                    src={require("assets/images/arrow-back-icon.svg").default}
                    alt="arrow"
                  />
                </span>
                {t("back")}
              </Link>
            </button>
          </div>

          <div className="mx-auto container container-smd">
            <h2 className="title">
              {this.props.location.pathname !== "/AddOffice"
                ? this.state.paymentDetailsTab
                  ? t("accountOwner.editCardDetail", { officeName: officeName })
                  : t("accountOwner.editOffice")
                : t("accountOwner.addOffice")}
            </h2>
            <div
              className={`form-wrapper ${
                this.props.profile &&
                this.props.profile.billingPreferenceType === 2 &&
                "add-office-wrapper"
              }`}
            >
              <div className="common-tabs">
                <TabContent activeTab={this.state.activeTab}>
                  <TabPane tabId="1">
                    {this.props.profile &&
                      this.props.profile.billingPreferenceType === 2 && (
                        <div className="tabs-block">
                          <h4
                            className={`${
                              this.state.officeDetailTab ? "active" : ""
                            }`}
                            onClick={this.officeTabShow}
                          >
                            {t("accountOwner.officeDetails")}
                          </h4>
                          <h4
                            className={`${
                              this.state.paymentDetailsTab ? "active" : ""
                            }`}
                            onClick={this.paymentTabShow}
                          >
                            {t("accountOwner.paymentDetails")}
                          </h4>
                        </div>
                      )}

                    <div className="row no-gutters">
                      {/* Images */}
                      {this.state.officeDetailTab && (
                        <div className="col-lg-4 order-lg-last mx-auto mt-5">
                          <div className="file-upload-container">
                            <div className="file-upload-field">
                              <div className="office-image">
                                {officeImage ? (
                                  <img src={officeImage} alt="upload" />
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
                                  id="fileUpload-officeImage"
                                  type="file"
                                  onChange={(e) =>
                                    this.fileChange(e, "officeImage")
                                  }
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
                            <div className="upload-help-text">
                              {t("accountOwner.uploadOfficePictureDescription")}
                            </div>
                            {Object.keys(errors).length > 0 && (
                              <span className="error-msg text-center">
                                {errors.officeImage}{" "}
                              </span>
                            )}
                          </div>

                          <hr className="my-5" />

                          <div className="file-upload-container mb-5">
                            <div className="file-upload-field">
                              <div className="office-logo">
                                {officeLogo ? (
                                  <img src={officeLogo} alt="upload" />
                                ) : (
                                  <img src={cameraIconWithBg} alt="upload" />
                                )}
                              </div>
                              <div
                                className="ch-upload-button"
                                style={{ bottom: -10 }}
                              >
                                <input
                                  id="fileUpload-officeLogo"
                                  type="file"
                                  onChange={(e) =>
                                    this.fileChange(e, "officeLogo")
                                  }
                                />
                                <span>
                                  <img
                                    width="32px"
                                    height="32px"
                                    src={
                                      require("assets/images/upload-image.svg")
                                        .default
                                    }
                                    alt="upload"
                                  />
                                </span>
                              </div>
                            </div>
                            <div className="upload-help-text">
                              {t("accountOwner.uploadOfficeLogoDescription")}
                            </div>
                            {Object.keys(errors).length > 0 && (
                              <span className="error-msg text-center">
                                {errors.officeLogo}{" "}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      {/* Images */}

                      <div
                        className={
                          this.state.officeDetailTab ? "col-lg-8" : "col-lg-12"
                        }
                      >
                        <div
                          className={"add-office-form "}
                          style={
                            this.state.paymentDetailsTab
                              ? { borderRight: "none" }
                              : {}
                          }
                        >
                          {this.state.officeDetailTab && (
                            <div className="office-tab">
                              <Input
                                Title={t("form.fields.officeName")}
                                Type="text"
                                Placeholder={t("form.placeholder1", {
                                  field: t("form.fields.officeName"),
                                })}
                                Name={"officeName"}
                                HandleChange={this.InputChange}
                                Error={errors.officeName}
                                Value={officeName}
                              />
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
                                      const eventObj =
                                        this.handleCustomDropDown(
                                          value,
                                          "country"
                                        );
                                      this.handleCountry(eventObj);
                                    }}
                                  />
                                </div>
                              )}
                              {errors.country && (
                                <span className="error-msg">
                                  {errors.country}
                                </span>
                              )}
                              {showCountryToaster && (
                                <Alert
                                  color="warning"
                                  className="event-alert-box"
                                >
                                  {constants.curreny.CAD ===
                                  this.props?.profile?.countryId
                                    ? t("accountOwner.toastSectionOfUs")
                                    : t("accountOwner.toastSectionOfCad")}
                                </Alert>
                              )}
                              <div
                                className={
                                  "text-right " + styles["show-on-map"]
                                }
                                onClick={this.openModal}
                              >
                                <span className="link-btn">
                                  {t("accountOwner.showOnMap")}
                                </span>
                              </div>
                              <div className={styles["location-input-wrapper"]}>
                                <CustomInput
                                  Title={t("form.fields.officeAddress")}
                                  Type="text"
                                  Placeholder={t("form.placeholder1", {
                                    field: t("form.fields.officeAddress"),
                                  })}
                                  Name={"officeAddress"}
                                  autoComplete={"off"}
                                  onBlurChange={() => {
                                    if (
                                      this.state.officeAddressEdit !==
                                      this.state.officeAddress
                                    ) {
                                      setTimeout(() => {
                                        this.setState({
                                          placeId: null,
                                          selectedPlacedId: "",
                                          markerPosition: "",
                                          lat: 0,
                                          long: 0,
                                        });
                                      }, 200);
                                    }
                                  }}
                                  HandleChange={(e) => {
                                    if (testRegexCheck(e.target.value)) {
                                      this.setState({
                                        isProps: false,
                                        officeAddress: e.target.value,
                                      });

                                      if (!showMapPredictions) {
                                        this.setState({
                                          showMapPredictions: true,
                                        });
                                      }
                                      this.props.googleServices.getPlacePredictions(
                                        {
                                          input: e.target.value,
                                          componentRestrictions: {
                                            country: selectedCountry ?? "",
                                          },
                                        }
                                      );
                                    }
                                  }}
                                  Error={errors?.officeAddress}
                                  Value={officeAddress}
                                />
                                <ul
                                  className={
                                    styles["location-list"] +
                                    `${!showMapPredictions ? "d-none" : ""}`
                                  }
                                >
                                  {showMapPredictions &&
                                    this.placePredictionContent()}
                                </ul>
                              </div>

                              {provienceList && provienceList.length > 0 && (
                                <div className="custom-dropdown-only">
                                  <CustomSelect
                                    Title={t("form.fields.provinceOrState")}
                                    options={provienceList}
                                    id={"province"}
                                    dropdownClasses={"custom-select-scroll"}
                                    selectedOption={{
                                      name: this.getSelectedOption(
                                        provienceList,
                                        province
                                      ),
                                    }}
                                    selectOption={(value) => {
                                      const eventObj =
                                        this.handleCustomDropDown(
                                          value,
                                          "province"
                                        );
                                      this.handleProvience(eventObj);
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
                                <div className="col-md-6 custom-dropdown-only">
                                  <CustomSelect
                                    Title={t("form.fields.city")}
                                    options={cityList}
                                    id={"city"}
                                    dropdownClasses={"custom-select-scroll"}
                                    selectedOption={{
                                      name: this.getSelectedOption(
                                        cityList,
                                        city
                                      ),
                                    }}
                                    selectOption={(value) => {
                                      const eventObj =
                                        this.handleCustomDropDown(
                                          value,
                                          "city"
                                        );
                                      this.InputChange(eventObj);
                                    }}
                                  />
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
                                    HandleChange={this.InputChange}
                                    Error={errors.postalCode}
                                    Value={postalCode}
                                  />
                                </div>

                                <div className="col-md-12">
                                  <Input
                                    Title={t("form.fields.contactNumber")}
                                    MaxLength={15}
                                    Type="text"
                                    Placeholder={t("form.placeholder1", {
                                      field: t("form.fields.contactNumber"),
                                    })}
                                    Name={"contactNumber"}
                                    HandleChange={this.InputChange}
                                    Error={errors.contactNumber}
                                    Value={contactNumber}
                                  />
                                </div>

                                <div className="c-field">
                                  {((googleSearchListNearBy?.length > 0 &&
                                    this.state.placeId) ||
                                    (googleSearchListNearBy?.length > 0 &&
                                      this.state.selectedPlacedId)) && (
                                    <Fragment>
                                      <label className="mb-2">
                                        {t("accountOwner.addOfficeBottomDesc")}
                                      </label>
                                      <ul
                                        className={styles["google-radio-list"]}
                                      >
                                        {this.nearByLocationList()}
                                      </ul>
                                    </Fragment>
                                  )}
                                </div>

                                {errors?.selectGooglePredection && (
                                  <span className="error-msg">
                                    {errors.selectGooglePredection}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          {this.state.paymentDetailsTab && (
                            <div className="payment-detail-tab">
                              <PaymentDetails
                                Errors={errors}
                                CardSelect={this.handleCardSelect}
                                CardId={this.state.cardId}
                              />
                            </div>
                          )}

                          <div className="btn-field">
                            <div className="row gutters-12">
                              <div className="col-md-auto">
                                {this.props.profile &&
                                this.props.profile.billingPreferenceType &&
                                this.props.profile.billingPreferenceType ===
                                  2 ? (
                                  <button
                                    className="button button-round button-shadow button-min-130"
                                    disabled={
                                      this.state.officeDetailTab === false &&
                                      this.props.location.pathname !==
                                        "/AddOffice" &&
                                      this.shouldDisableUpdateButton()
                                    }
                                    title={
                                      this.state.officeDetailTab
                                        ? t("continue")
                                        : t("accountOwner.createOffice")
                                    }
                                    onClick={() =>
                                      this.handleAddofficeContinue(
                                        this.state.officeDetailTab
                                          ? false
                                          : true
                                      )
                                    }
                                  >
                                    {this.state.officeDetailTab
                                      ? t("continue")
                                      : this.props.location.pathname !==
                                        "/AddOffice"
                                      ? t("save")
                                      : t("accountOwner.createOffice")}
                                  </button>
                                ) : (
                                  <button
                                    className="button button-round button-shadow"
                                    disabled={isToastView}
                                    title={t("accountOwner.saveOffice")}
                                    onClick={this.handleAddoffice}
                                  >
                                    {t("accountOwner.saveOffice")}
                                  </button>
                                )}
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
                        </div>
                      </div>
                    </div>
                  </TabPane>
                  <TabPane tabId="2"> Payment tab</TabPane>
                </TabContent>
              </div>
            </div>
          </div>
        </div>

        {this.state.isMapViewModalOpen && (
          <MapViewModal
            isOpen={this.state.isMapViewModalOpen}
            setIsMapViewModalOpen={this.closeModal}
            markerPosition={this.state.markerPosition}
            updateMarkerPosition={(position) => {
              this.setState({
                isProps: false,
                markerPosition: {
                  lat: position.lat(),
                  lng: position.lng(),
                },
              });
            }}
            handlePlaceSelect={this.handlePlaceSelect}
            getLocationByAddress={this.getLocationByAddress}
            selectedCountry={countryList
              ?.find((e) => e.id == country)
              ?.name?.slice(0, 2)}
            googleServices={this.props.googleServices}
            officeAddress={this.state.officeAddress}
            placeId={this.state.placeId}
            showMapPredictions={(e) =>
              this.setState({ showMapPredictions: false })
            }
          />
        )}
      </>
    );
  }
}

const mapStateToProps = ({
  userProfile: { profile, sasToken },
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
  sub: {
    PaymentstatusMessage,
    isPaymentDetailError,
    cardstatusMessage,
    isLoadError,
    cardSaved,
  },
  errors: { isError },
}) => ({
  statusMessage,
  isLoading,
  isError,
  isOfficeAdd,
  officeDetail,
  provienceList,
  isAddedError,
  profile,
  countryList,
  cityList,
  sasToken,
  PaymentstatusMessage,
  isPaymentDetailError,
  cardstatusMessage,
  isLoadError,
  cardSaved,
});

export default connect(mapStateToProps, {
  addOffice,
  officeFieldData,
  getOfficesProvience,
  editOffice,
  getSastoken,
  getOfficesCountry,
  getOfficesCity,
  getOfficesDetail,
})(_isLoading(withTranslation()(withGoogleAutoSuggestion(AddOffice))));
