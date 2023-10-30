import React, { useState, useEffect, useRef } from "react";
import { withTranslation } from "react-i18next";
import "rc-time-picker/assets/index.css";
import { Modal } from "reactstrap";
import ModalBody from "reactstrap/lib/ModalBody";
import crossIcon from "../../../assets/images/cross.svg";
import Text from "components/Text";
import { Wrapper } from "@googlemaps/react-wrapper";
import toast from "react-hot-toast";
import Marker from "./Marker/Marker";
import searchIcon from "../../../assets/images/search-icon.svg";
import constants from "../../../constants";

const MapViewModal = ({
  t,
  setIsMapViewModalOpen,
  isOpen,
  markerPosition,
  handlePlaceSelect,
  showMapPredictions,
  getLocationByAddress,
  selectedCountry,
  googleServices,
  officeAddress,
  placeId,
  modelMapSelect,
}) => {
  let countrySelected = selectedCountry?.toUpperCase();
  const center =
    countrySelected === constants.COUNTRY.CA
      ? constants.COUNTRY.CALATLNG
      : constants.COUNTRY.USLATLNG;

  let markerPositionForCenter;

  if (markerPosition) {
    markerPositionForCenter = {
      lat:
        markerPosition.lat === "function"
          ? markerPosition.lat()
          : markerPosition.lat,
      lng:
        markerPosition.lng === "function"
          ? markerPosition.lng()
          : markerPosition.lng,
    };
  }

  const countryBounds =
    countrySelected === constants.COUNTRY.CA
      ? constants.COUNTRY.CABOUNDS
      : constants.COUNTRY.USBOUNDS;
  const zoom = 16;
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [placePrediction, setPlacePrediction] = useState(false);
  const [, setMapCenter] = useState(center);
  const [markerPlaceId, setMarkerPlaceId] = useState("");
  const [marker, setMarker] = useState(null);

  const renderMapStatus = (status) => {
    return status;
  };

  useEffect(() => {
    setMarkerPlaceId(placeId);
  }, [placeId]);

  useEffect(() => {
    setMarker(markerPosition);
    setMapCenter(markerPositionForCenter);
  }, [markerPosition]);

  useEffect(() => {
    if (officeAddress) {
      setSearch(officeAddress);
    }
  }, [officeAddress]);

  const onClickMap = (e) => {
    try {
      let option = {
        location: e.latLng,
      };

      new window.google.maps.Geocoder().geocode(option, (data) => {
        let getLocationByDetail = getLocationByAddress(
          data[0].address_components
        );

        if (!getLocationByDetail?.countryShortName && data?.length > 0) {
          let newResult = getLocationByAddress(
            data[data?.length - 1].address_components
          );
          getLocationByDetail.countryShortName = newResult?.countryShortName;
        }

        if (
          getLocationByDetail?.countryShortName?.toUpperCase() ==
          countrySelected
        ) {
          setError("");
          setMarker(e.latLng);

          setSearch(data?.[0].formatted_address);
          data?.length && setMarkerPlaceId(data?.[0].place_id);
        } else {
          setError(t("accountOwner.selectValidCountry"));
        }
      });
    } catch (err) {
      toast.error(err.message);
    }
  };

  const placePredictionContent = () => {
    return googleServices.placePredictions.map((place) => {
      const { description, place_id } = place;
      return (
        <li
          key={place_id}
          onClick={() => {
            setSearch(description);
            setPlacePrediction(false);
            modelMapSelect(place_id);
          }}
        >
          {description}
        </li>
      );
    });
  };

  modelMapSelect = (idOfPlace) => {
    try {
      googleServices?.placesService?.getDetails(
        { placeId: idOfPlace },
        async (details) => {
          setMarker(details?.geometry?.location);
          setMapCenter(details?.geometry?.location);
          setMarkerPlaceId(idOfPlace);
        }
      );
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleSave = () => {
    try {
      let location = {};
      if (typeof marker?.lat === "function") {
        let lat = marker?.lat();
        let lng = marker?.lng();
        location.lat = lat;
        location.lng = lng;
      } else {
        location.lat = marker?.lat;
        location.lng = marker?.lng;
      }

      let place_id = markerPlaceId || placeId;
      let selectedId = markerPlaceId == placeId ? placeId : "";

      if (place_id) {
        handlePlaceSelect(place_id, search, selectedId, location);
      }

      setIsMapViewModalOpen(false);
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleClose = () => {
    setIsMapViewModalOpen(false);
    showMapPredictions();
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={() => handleClose()}
      className={["map-view-dialog"]}
      modalClassName="custom-modal"
    >
      <span className="close-btn" onClick={() => handleClose()}>
        <img src={crossIcon} alt="close" />
      </span>
      <ModalBody>
        <Text size="25px" color="#111B45" weight="500" marginBottom="5px">
          <span className="modal-title-25"> Map View</span>
        </Text>
        <Text size="14px" color="#000" weight="300" marginBottom="30px">
          Enter your office address and find it on the map and then click on
          Save location.
        </Text>
        <div className="location-input-wrapper">
          <div className={"search-box "}>
            <input
              type="text"
              placeholder={t("accountOwner.searchByName")}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                if (!placePrediction) {
                  setPlacePrediction(true);
                }
                googleServices.getPlacePredictions({
                  input: e.target.value,
                  componentRestrictions: { country: selectedCountry ?? "" },
                });
              }}
            />

            <span className="ico">
              <img src={searchIcon} alt="icon" />
            </span>
          </div>

          <ul className={"location-list"}>
            {placePrediction && placePredictionContent()}
          </ul>
        </div>
        {error && <span className="error-msg">{error} </span>}
        <div className="map_view">
          <Wrapper
            apiKey={process.env.REACT_APP_GOOGLE_API_KEY}
            render={renderMapStatus}
            libraries={["drawing", "places"]}
          >
            <MyMapComponent
              center={marker?.lat ? marker : center}
              zoom={zoom}
              onClickMap={onClickMap}
              countryBounds={countryBounds}
              markerPosition={marker?.lat ? marker : center}
            >
              {marker?.lat && <Marker position={marker} />}
            </MyMapComponent>
          </Wrapper>
        </div>

        <div className="btn-box">
          <button
            className="button button-round button-shadow mr-md-4 mb-3 w-sm-100"
            title={t("accountOwner.saveLocation")}
            onClick={() => handleSave()}
          >
            {t("accountOwner.saveLocation")}
          </button>
          <button
            className="mb-md-3 button button-round button-dark button-border btn-mobile-link"
            onClick={() => handleClose()}
            title={t("cancel")}
          >
            {t("cancel")}
          </button>
        </div>
      </ModalBody>
    </Modal>
  );
};

function MyMapComponent({
  center,
  zoom,
  children,
  onClickMap,
  countryBounds,
  markerPosition,
}) {
  const ref = useRef();
  const [Map, setMap] = useState(null);

  useEffect(() => {
    if (!Map) {
      let _map = initMap();
      setMap(_map);
    }
  });

  useEffect(() => {
    if (Map) {
      Map.setCenter(center);
    }
  }, [center]);

  useEffect(() => {
    if (Map) {
      new window.google.maps.event.clearListeners(Map, "click");
      if (onClickMap) {
        Map.addListener("click", onClickMap);
      }
    }
  }, [Map, onClickMap]);

  function initMap() {
    return new window.google.maps.Map(ref?.current, {
      clickableIcons: false,
      center,
      zoom,
      restriction: {
        latLngBounds: countryBounds,
        strictBounds: false,
      },
    });
  }

  return (
    <>
      <div ref={ref} id="map" className="map_view" />
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { Map });
        }
      })}
    </>
  );
}

export default withTranslation()(MapViewModal);
