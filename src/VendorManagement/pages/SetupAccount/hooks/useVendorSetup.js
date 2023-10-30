import { useState, useEffect } from "react";
import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import { getCountries } from "repositories/utility-repository";
import { getProvinceList, getCityList } from "repositories/office-repository";
import { toast } from "react-hot-toast";
import { cloneDeep } from "lodash";
import constants from "../../../../constants";
import Helper from "utils/helper";
import { inBytes, testRegexCheck, toNormalizeString } from "utils";
import { vendorSetUp } from "repositories/vendor-repository";
import useUploadService from "hooks/useUploadService";

const IMAGE_SIZE = 5;
const containerName = "accountpictures";
let scheme = {
  companyName: "",
  contactNumber: "",
  officeAddress: "",
  country: "",
  province: "",
  city: "",
  postalCode: "",
  placeId: "",
  Latitude: 0.0,
  Longitude: 0.0,
};

const countryChangeEmptyState = {
  officeAddress: "",
  province: "",
  city: "",
  postalCode: "",
  placeId: "",
  Latitude: 0.0,
  Longitude: 0.0,
};

export const useVendorSetup = ({ t }) => {
  const errorMessage = {
    companyName: t("form.errors.emptyField", {
      field: t("form.fields.companyName"),
    }),
    contactNumber: t("form.errors.emptyField", {
      field: t("form.fields.contactNumber"),
    }),
    officeAddress: t("form.errors.emptyField", {
      field: t("form.fields.officeAddress"),
    }),
    country: t("form.errors.emptyField", { field: t("form.fields.country") }),
    province: t("form.errors.emptyField", { field: t("form.fields.province") }),
    city: t("form.errors.emptyField", { field: t("form.fields.city") }),
    postalCode: t("form.errors.emptyField", {
      field: t("form.fields.postalCode"),
    }),
  };

  const googleServices = usePlacesService({
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    debounce: 700,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [errors, setErrors] = useState({});
  const [countryList, setCountryList] = useState([]);
  const [provienceList, setProvienceList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [formFields, setformFields] = useState(scheme);
  const [isLoading, setIsLoading] = useState(false);
  const [showPredictions, setShowPredictions] = useState(false);
  const {
    companyName,
    contactNumber,
    officeAddress,
    country,
    province,
    city,
    postalCode,
    placeId,
    Latitude,
    Longitude,
  } = formFields;
  const {
    uploading,
    deleting,
    upload: uploadImage,
    delete: deleteImage,
  } = useUploadService();

  useEffect(() => {
    getCountry();
  }, []);

  useEffect(() => {
    if (country) {
      getProvince(country);
      setformFields((prevProps) => ({
        ...prevProps,
        ...countryChangeEmptyState,
      }));
    }
  }, [country]);

  useEffect(() => {
    province && getCity(province);
  }, [province]);

  // get country list
  const getCountry = async () => {
    try {
      let res = await getCountries();
      if (res?.length) {
        setCountryList(res);
        setformFields((prevProps) => ({ ...prevProps, country: res[0].id }));
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // get ProvimceList list
  const getProvince = async (id) => {
    setIsLoading(true);
    try {
      let res = await getProvinceList(id);
      res && setProvienceList(res);
    } catch (error) {
      toast.error(error.message);
    }
    setIsLoading(false);
  };

  // get ProvinceList list
  const getCity = async (id) => {
    setIsLoading(true);
    try {
      let res = await getCityList(id);
      res && setCityList(res);
    } catch (error) {
      toast.error(error.message);
    }
    setIsLoading(false);
  };

  const getLocationByAddress = (address) => {
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

  const customInputBlurChange = () => {
    // setTimeout is for handle blurEvents
    setTimeout(() => {
      setShowPredictions(false);
      setformFields((prevProps) => ({
        ...prevProps,
        placeId: "",
        Latitude: 0.0,
        Longitude: 0.0,
      }));
    }, 200);
  };

  const fileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (constants.vendor.allowedTypesForProductImage.includes(file?.type)) {
      if (file?.size < inBytes(IMAGE_SIZE)) {
        const url = URL.createObjectURL(file);
        setImageFile(file);
        setImageUrl(url);
        setErrors((prev) => ({
          ...prev,
          profileImage: " ",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          profileImage: "File size should be less than 5 MB.",
        }));
      }
    } else {
      setErrors((prev) => ({
        ...prev,
        profileImage: "Not supported type",
      }));
    }
  };

  const handlePlaceSelect = (googlePlaceId, description) => {
    // setTimeout is for handle blurEvents
    try {
      const errorCopy = cloneDeep(errors);
      googleServices?.placesService?.getDetails(
        { placeId: googlePlaceId },
        async (details) => {
          let locationInfo = getLocationByAddress(details.address_components);

          if (locationInfo?.state && country) {
            const googleStateString = toNormalizeString(
              locationInfo.state.toLowerCase()
            );
            let googleState = provienceList?.find(
              (item) => item.name.toLowerCase() === googleStateString
            );
            if (googleState) {
              if (locationInfo?.postalCode) delete errorCopy["postalCode"];
              if (description) delete errorCopy["officeAddress"];
              if (googleState?.id) delete errorCopy["province"];

              setformFields((prevProps) => ({
                ...prevProps,
                province: googleState?.id,
                postalCode: locationInfo.postalCode ?? "",
                officeAddress: description,
                Latitude: details.geometry.location.lat(),
                Longitude: details.geometry.location.lng(),
                placeId: googlePlaceId,
              }));
              let res = await getCityList(googleState?.id);
              setCityList([...res]);
              const googleCityString = toNormalizeString(
                locationInfo?.city?.toLowerCase()
              );
              let googleCity = res?.find(
                (item) => item.name.toLowerCase() === googleCityString
              );
              if (res && googleCity?.id) {
                delete errorCopy["city"];
                setformFields((prevProps) => ({
                  ...prevProps,
                  city: googleCity.id,
                }));
              }
            }
          } else {
            setformFields((prevProps) => ({
              ...prevProps,
              officeAddress: description,
            }));
          }
          setErrors({ ...errorCopy });
        }
      );
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleChange = (event) => {
    if (!testRegexCheck(event.target.value)) return;
    const errorCopy = cloneDeep(errors);
    const { name, value } = event.target;
    if (!value.trim()?.length) {
      errorCopy[name] = errorMessage[name];
    }

    if (value?.trim()?.length) {
      delete errorCopy[name];
    }

    if (name === "province") {
      setformFields((prevProps) => ({ ...prevProps, city: "" }));
    }

    setformFields((prevProps) => ({ ...prevProps, [name]: value }));
    setErrors(errorCopy);
  };

  const handleChangeNumber = (event) => {
    let contactNumberValue = event.target.value;
    let errorCopy = cloneDeep(errors);

    if (!contactNumberValue) {
      errorCopy.contactNumber = errorMessage.contactNumber;
    }

    if (contactNumberValue && !Helper.validateNumber(contactNumberValue)) {
      errorCopy.contactNumber = t("form.errors.invalidValue", {
        field: t("form.fields.contactNumber"),
      });
    }

    if (contactNumberValue && Helper.validateNumber(contactNumberValue)) {
      delete errorCopy.contactNumber;
    }

    setformFields((prevProps) => ({
      ...prevProps,
      contactNumber: contactNumberValue,
    }));
    setErrors({ ...errorCopy });
  };

  const isValid = () => {
    const errorCopy = {};
    let isValidFields = true;

    if (!companyName?.trim()?.length) {
      errorCopy.companyName = errorMessage.companyName;
      isValidFields = false;
    }
    if (!officeAddress?.trim()?.length) {
      errorCopy.officeAddress = errorMessage.officeAddress;
      isValidFields = false;
    }
    if (officeAddress?.length > constants.wordLimits.ADDOFFICEADDRESS) {
      errorCopy.officeAddress = t("form.errors.officeAddressLimit");
      isValidFields = false;
    }
    if (!contactNumber) {
      errorCopy.contactNumber = errorMessage.contactNumber;
      isValidFields = false;
    }
    if (contactNumber && !Helper.validateNumber(contactNumber)) {
      errorCopy.contactNumber = t("form.errors.invalidValue", {
        field: t("form.fields.contactNumber"),
      });
      isValidFields = false;
    }
    if (!country) {
      errorCopy.country = errorMessage.country;
      isValidFields = false;
    }
    if (!province) {
      errorCopy.province = errorMessage.province;
      isValidFields = false;
    }
    if (!city) {
      errorCopy.city = errorMessage.city;
      isValidFields = false;
    }
    if (!postalCode) {
      errorCopy.postalCode = errorMessage.postalCode;
      isValidFields = false;
    }
    if (!postalCode) {
      errorCopy.postalCode = t("form.errors.emptyField", {
        field: t("form.fields.postalCode"),
      });
      isValidFields = false;
    }

    setErrors({ ...errorCopy });
    return isValidFields;
  };

  const onSubmit = async () => {
    if (!isValid()) return;
    setIsLoading(true);
    let imageBlobName = null;
    try {
      if (imageFile) {
        const [err, blobData] = await uploadImage(imageFile, containerName);
        if (err) {
          throw new Error(err);
        }
        imageBlobName = blobData.blobName;
      }
      let params = {
        name: companyName,
        address: officeAddress,
        Latitude: Latitude,
        Longitude: Longitude,
        PlaceId: placeId,
        CountryId: country,
        StateId: province,
        CityId: city,
        PostCode: postalCode,
        ContactNumber: contactNumber,
        Image: imageBlobName ? `${containerName}/${imageBlobName}` : "",
      };
      let res = await vendorSetUp(params);
      window.location.reload();
      toast.success(res.message);
    } catch (error) {
      if (imageBlobName && imageFile) {
        await deleteImage(imageBlobName, containerName);
      }
      toast.error(error.message);
    }
    setIsLoading(false);
  };

  return {
    googleServices,
    formFields,
    errors,
    countryList,
    provienceList,
    isLoading: isLoading || uploading || deleting,
    cityList,
    showPredictions,
    imageUrl,
    handleChange,
    handlePlaceSelect,
    setShowPredictions,
    onSubmit,
    handleChangeNumber,
    fileChange,
    customInputBlurChange,
  };
};
