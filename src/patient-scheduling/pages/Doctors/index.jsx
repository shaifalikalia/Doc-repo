import Card from "components/Card";
import Page from "components/Page";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./Home.module.scss";
import searchIcon from "./../../../assets/images/search-icon.svg";
import pin from "./../../../assets/images/pin-icon.svg";
import Text from "components/Text";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import constants from "../../../constants";
import { useDoctors } from "repositories/doctor-repository";
import Toast from "components/Toast/Alert";
import usePageNumber from "hooks/usePageNumber";
import qs from "query-string";
import useQueryParam from "hooks/useQueryParam";
import { debounce, isEmpty } from "lodash";
import {
  compose,
  convertToMarkerList,
  decodeId,
  getTotalPossiblePages,
  paginateArray,
} from "utils";
import DoctorGridNew from "./DoctorGridNew";
import OutsideClickHandler from "react-outside-click-handler";
import Loader from "components/Loader";
import { GoogleApiWrapper } from "google-maps-react";
import toast from "react-hot-toast";
import OfficeDownloadApp from "staff/pages/Offices/components/OfficeDownloadApp";

const pageSize = 5;

const debounceDuration = 1500;

function Doctors({ history, location, t, google }) {
  const pageNumber = usePageNumber();
  const searchTerm = useQueryParam("search", "");
  let specialtyId = useQueryParam("specialtyId", null);
  const specialtyName = useQueryParam("specialtyName", null);
  const [input, setInput] = useState(null);
  const [locationDropdown, setLocationDropdown] = useState(false);
  const [locationTextInput, setLocationTextInput] = useState("");
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [googleDoctors, setGoogleDoctors] = useState([]);
  const [googleDoctorsLoading, setGoogleDoctorsLoading] = useState(false);
  
  const [mapCenter, setMapCenter] = useState(null);
  const [placePredictions, setPlacePredictions] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [activeMarker, setActiveMarker] = useState(null);
  const [showMobileMap, setShowMobileMap] = useState(false);

  const toggleMap = () => setShowMobileMap((s) => !s);

  const placeService = useMemo(() => {
    if (google?.maps?.places?.PlacesService) {
      return new google.maps.places.PlacesService(
        document.createElement("div")
      );
    }
  }, [google]);

  try {
    if (specialtyId) {
      const decodedSpecialtyId = decodeId(specialtyId);
      specialtyId = isNaN(decodedSpecialtyId) ? null : decodedSpecialtyId;
    }
  } catch (e) {
    specialtyId = null;
  }

  const { isLoading, error, data } = useDoctors(
    pageNumber,
    pageSize,
    mapCenter?.lat,
    mapCenter?.lng,
    searchTerm,
    specialtyId,
    { enabled: !!mapCenter }
  );

  //eslint-disable-next-line
  const searchHandler = useCallback(
    debounce((_searchTerm, query) => {
      query.pageNumber = 1;

      if (_searchTerm.trim().length === 0) {
        delete query.search;
      } else {
        query.search = _searchTerm.trim();
      }

      history.push({
        pathname: constants.routes.doctors,
        search: qs.stringify(query),
      });
    }, debounceDuration),
    []
  );

  useEffect(() => {
    if (input !== null) {
      searchHandler(input, qs.parse(location.search));
    }
    //eslint-disable-next-line
  }, [input]);

  useEffect(() => {
    return () => {
      searchHandler.cancel();
    };
    //eslint-disable-next-line
  }, []);

  let content = null;
  if (isLoading) {
    content = (
      <div className="center" style={{ height: "500px" }}>
        <div className="loader"></div>
      </div>
    );
  }

  if (!isLoading && error) {
    content = <Toast errorToast message={error.message} />;
  }

  if (!isLoading && !error) {
    content = (
      <DoctorGridNew
        items={doctors}
        pageNumber={pageNumber}
        pageSize={pageSize}
        onPageChange={(_pageNumber) => {
          let query = qs.parse(location.search);
          if (!query) {
            query = {}; 
          }
          query.pageNumber = _pageNumber;
          history.push({
            pathname: constants.routes.doctors,
            search: qs.stringify(query),
          });
        }}
        total={(data?.totalItems || 0) + googleDoctors.length}
        searchTerm={searchTerm}
        specialtyId={specialtyId}
        specialtyName={specialtyName}
        t={t}
        center={mapCenter}
        activeMarker={activeMarker}
        setActiveMarker={setActiveMarker}
        placeService={placeService}
        history={history}
        selectedPlace={selectedPlace}
        showMobileMap={showMobileMap}
      />
    );
  }

  let specialtySearch = null;
  if (specialtyId) {
    specialtySearch = (
      <div className={`${styles["reset-search-container"]}`}>
        <Text size="12px" color="#6f7788">
          {t("patient.showingResultsFor", { specialty: specialtyName })}
        </Text>
        <Text
          secondary
          size="12px"
          underline
          cursor="pointer"
          onClick={() => {
            const query = qs.parse(location.search);
            delete query.specialtyId;
            delete query.specialtyName;
            query.pageNumber = 1;
            history.push({
              pathname: constants.routes.doctors,
              search: qs.stringify(query),
            });
          }}
        >
          {t("patient.resetSearch")}
        </Text>
      </div>
    );
  }

  const handleGooglePlacesError = (status) => {
    toast.error(t("patient.googleError", { status }));
  };

  const getGooglePlaces = (locationObj) => {
    const opt = {
      location: locationObj,
      radius: constants.INITIAL_GOOGLE_RADIUS,
      types: constants.GOOGLEPLACETYPE,
    };
    if (searchTerm && specialtyName) {
      opt.keyword = `${searchTerm} ${specialtyName}`;
    } else if (searchTerm) {
      opt.keyword = `${searchTerm}`;
    } else if (specialtyName) {
      opt.keyword = `${specialtyName}`;
    }
    placeService?.nearbySearch(opt, onSuccesForInitialRadius);

    function onSuccesForInitialRadius(places, status, pagination) {
      if (status === "OK" || status === "ZERO_RESULTS") {
        if (!places.length) {
          const request = { ...opt, radius: constants.EXTENDED_GOOGLE_RADIUS };
          placeService?.nearbySearch(request, onSuccesForExtendedRadius);
        } else {
          setGoogleDoctors(places);
        }
      } else {
        handleGooglePlacesError(status);
      }
      setGoogleDoctorsLoading(false);
    }

    function onSuccesForExtendedRadius(places, status, pagination) {
      if (status === "OK" || status === "ZERO_RESULTS") {
        setGoogleDoctors(places);
      } else {
        handleGooglePlacesError(status);
      }
    }
  };

  const getLocationObj = (place) => {
    const {
      geometry: { location: loc },
    } = place;
    return {
      lat: typeof loc.lat === "function" ? loc.lat() : loc.lat,
      lng: typeof loc.lng === "function" ? loc.lng() : loc.lng,
    };
  };

  const resetPageNumber = () => {
    const query = qs.parse(location.search);
    query.pageNumber = 1;
    history.push({
      pathname: constants.routes.doctors,
      search: qs.stringify(query),
    });
  };

  const handlePlaceSelect = ({ place_id: placeId, description }) => {
    setLocationDropdown(false);
    setGoogleDoctorsLoading(true);
    setLocationTextInput(description);
    placeService?.getDetails({ placeId }, (place, status) => {
      if (status === "OK") {
        place.locationInputText = description;
        setSelectedPlace(place);
        const locationObj = getLocationObj(place);
        setMapCenter(locationObj);
        resetPageNumber();
      } else {
        handleGooglePlacesError(status);
        setGoogleDoctorsLoading(false);
      }
    });
  };

  useEffect(() => {
    if (selectedPlace) {
      const locationObj = getLocationObj(selectedPlace);
      getGooglePlaces(locationObj);
    }
  }, [selectedPlace, searchTerm, specialtyName]);

  const placePredictionContent = placePredictions?.map((place) => {
    const { description, place_id } = place;
    return (
      <li key={place_id} onClick={() => handlePlaceSelect(place)}>
        {description}
      </li>
    );
  });

  const getCurrentLocation = () => {
    if (typeof window !== "undefined") {
      window.navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationDropdown(false);
          setGoogleDoctorsLoading(true);
          const locationObj = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          new google.maps.Geocoder().geocode(
            { location: locationObj },
            (result, status) => {
              if (status === "OK") {
                let firstPlace = {
                  place_id: "",
                  formatted_address: "",
                  geometry: { location: { lat: 0, lng: 0 } },
                };
                if (result) {
                  if (Array.isArray(result)) {
                    firstPlace = result[0] || firstPlace;
                    for (let i = 0; i < result.length; i++) {
                      const place = result[i];
                      const { types = [] } = place || {};
                      if (types.includes("street_address")) {
                        firstPlace = place;
                        break;
                      }
                      if (types.includes("locality")) {
                        firstPlace = place;
                        break;
                      }
                    }
                  } else {
                    firstPlace = result;
                  }
                }
                firstPlace.locationInputText = firstPlace.formatted_address;
                setSelectedPlace(firstPlace);
                setLocationTextInput(firstPlace.formatted_address);
                setMapCenter(locationObj);
                resetPageNumber();
              } else {
                handleGooglePlacesError(status);
                setGoogleDoctorsLoading(false);
              }
            }
          );
        },
        (err) => {
          toast.error(err.message);
        }
      );
    }
  };

  //eslint-disable-next-line
  const getPlacePredictions = useCallback(
    debounce((request) => {
      if (google && google.maps) {
        new google.maps.places.AutocompleteService().getPlacePredictions(
          request,
          (places, status) => {
            if (status === "OK" || status === "ZERO_RESULTS") {
              setPlacePredictions(places || []);
            } else {
              handleGooglePlacesError(status);
            }
          }
        );
      }
    }, 700),
    []
  );

  const handleLocationTextChange = (event) => {
    setLocationDropdown(true);
    getPlacePredictions({ input: event.target.value });
    setLocationTextInput(event.target.value);
  };

  useEffect(() => {
    if (data && data.items) {
      setDoctors(convertToMarkerList(data.items));
    }
  }, [data]);

  useEffect(() => {
    if (data && pageNumber) {
      let [totalPages, itemsInLastPage] = getTotalPossiblePages(
        pageSize,
        data.totalItems
      );
      itemsInLastPage = itemsInLastPage || pageSize;
      const itemsToAdd = pageSize - itemsInLastPage;
      if (pageNumber === totalPages) {
        if (itemsToAdd > 0) {
          setDoctors([
            ...convertToMarkerList(data.items),
            ...convertToMarkerList(googleDoctors.slice(0, itemsToAdd)),
          ]);
        }
      }
      if (pageNumber > totalPages) {
        const googlePageNo = pageNumber - totalPages;
        setDoctors(
          convertToMarkerList(
            paginateArray(
              googleDoctors.slice(itemsToAdd),
              pageSize,
              googlePageNo
            )
          )
        );
      }
    }
    //eslint-disable-next-line
  }, [data, pageNumber, googleDoctors, selectedPlace]);

  //To store the location information into the session storage and to retrieve it
  useEffect(() => {
    if (selectedPlace) {
      const toSave = {
        formatted_address: selectedPlace?.formatted_address,
        geometry: {
          location: getLocationObj(selectedPlace),
        },
        locationInputText: selectedPlace?.locationInputText,
        place_id: selectedPlace?.place_id,
      };
      sessionStorage.setItem(
        constants.localStorageKeys.doctorListLocation,
        JSON.stringify(toSave)
      );
    }
  }, [selectedPlace]);

  useEffect(() => {
    let cachedLocation = sessionStorage.getItem(
      constants.localStorageKeys.doctorListLocation
    );
    if (!cachedLocation) getCurrentLocation();
    else {
      cachedLocation = JSON.parse(cachedLocation);
      const locationObj = getLocationObj(cachedLocation);
      setMapCenter(locationObj);
      setLocationTextInput(cachedLocation.locationInputText);
      setSelectedPlace(cachedLocation);
    }
  }, []);

  useEffect(() => {
    window?.scrollTo({
      top: 0,
      left: 0,
    });
  }, [pageNumber]);

  return (
    <>
      <Page className={styles.page} titleKey="patient.findYourDoctor">
        {googleDoctorsLoading && <Loader />}

        <div className={styles["input-container"]}>
          <Card className={`${styles["search-input-card"]}`} marginRight="20px">
            <div className={styles["input-card-layout"]}>
              <img src={searchIcon} alt="search-icon" />
              <input
                className={styles["search-input"]}
                onChange={(e) => setInput(e.target.value)}
                value={input === null ? decodeURIComponent(searchTerm) : input}
                placeholder={t("patient.searchByDoctorName")}
              />
            </div>
          </Card>

          <Card>
            <div
              className={`${styles["input-card-layout"]} ${styles["location-input-container"]}`}
            >
              <img src={pin} alt="pin-icon" />
              <OutsideClickHandler
                onOutsideClick={() => setLocationDropdown(false)}
              >
                <input
                  onClick={() => {
                    if (!placePredictions.length)
                      handleLocationTextChange({
                        target: { value: locationTextInput },
                      });
                    else setLocationDropdown(true);
                  }}
                  className={styles["search-input"]}
                  placeholder={t("patient.searchByLocation")}
                  onChange={handleLocationTextChange}
                  value={locationTextInput}
                />

                {locationDropdown && (
                  <div
                    className={
                      styles["location-search-dropdown"] +
                      " " +
                      styles["location-current"]
                    }
                  >
                    <div
                      className={styles["curremt-location-box"]}
                      onClick={getCurrentLocation}
                    >
                      <img
                        src={
                          require("assets/images/current-location.svg").default
                        }
                        alt="icon"
                      />
                      {t("patient.useMyLocation")}
                    </div>
                    {!isEmpty(placePredictions) && (
                      <ul className={styles["location-list"]}>
                        {placePredictionContent}
                      </ul>
                    )}
                  </div>
                )}
              </OutsideClickHandler>
            </div>
            {/* </Link> */}
          </Card>

          <div className={styles["specility-link"] + " mb-3"}>
            <Text color="#6f7788" size="12px">
              {t("patient.lookingForMore")}
            </Text>
            <Link to={constants.routes.searchDoctorBySpecialty}>
              <span className="link-btn">
                {t("patient.searchBySpecialties")}
              </span>
            </Link>
          </div>
        </div>
        {specialtySearch}

        <div className={"d-lg-none d-block text-right"}>
          <span className="align-items-center  d-inline-flex">
            {!showMobileMap && (
              <img
                src={require("assets/images/doctors-map.svg").default}
                alt="icon"
                className="mr-1"
              />
            )}
            {showMobileMap && (
              <img
                src={require("assets/images/doctors-list.svg").default}
                alt="icon"
                className="mr-1"
              />
            )}
            <span className="link-btn" onClick={toggleMap}>
              {t(
                showMobileMap
                  ? "patient.viewDoctorsList"
                  : "patient.viewDoctorsMap"
              )}
            </span>
          </span>
        </div>

        {content}
      </Page>
      <OfficeDownloadApp />
    </>
  );
}

export default compose(
  withTranslation(),
  GoogleApiWrapper({
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
  })
)(Doctors);
