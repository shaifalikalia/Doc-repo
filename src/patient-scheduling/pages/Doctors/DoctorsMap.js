import React, { useMemo } from "react";
import ReactDom from "react-dom";
import { Map, InfoWindow, Marker, GoogleApiWrapper } from "google-maps-react";
import mapMarker from "assets/images/map-marker.svg";
import MapPinPopup from "./MapPinPopup";

const DoctorsMap = (props) => {
  const {
    google,
    center,
    items,
    activeMarker,
    setActiveMarker,
    clickHandlers,
  } = props;

  const handleInfoPopupClose = () => {
    setActiveMarker(null);
  };

  const onInfoWindowOpen = () => {
    const infoContent = (
      <MapPinPopup
        activeMarker={activeMarker}
        handleInfoPopupClose={handleInfoPopupClose}
        clickHandlers={clickHandlers}
      />
    );
    ReactDom.render(infoContent, document.getElementById("map-info-popover"));
  };

  const markerContent = useMemo(() => {
    return items.map((marker, index) => (
      <Marker
        key={`map_marker_${index}`}
        animation={google?.maps?.Animation?.DROP || 2}
        position={{
          lat: marker?.location?.lat,
          lng: marker?.location?.lng,
        }}
        onClick={() => {
          setActiveMarker(marker);
        }}
        icon={mapMarker}
      />
    ));
    //eslint-disable-next-line
  }, [items]);

  const mapPopupContent = useMemo(() => {
    return (
      <InfoWindow
        position={activeMarker?.location}
        visible={!!activeMarker}
        maxWidth={"100%"}
        onOpen={onInfoWindowOpen}
        pixelOffset={google?.maps ? new google.maps.Size(0, -47) : null}
      >
        <div id="map-info-popover" />
      </InfoWindow>
    );
    //eslint-disable-next-line
  }, [activeMarker]);

  return (
    <Map
      google={google}
      disableDefaultUI={true}
      initialCenter={center || { lat: 0, lng: 0 }}
      zoomControl={true}
      scaleControl={true}
      zoomControlOptions={{
        position: google?.maps?.ControlPosition?.TOP_LEFT,
      }}
      center={center}
      zoom={14}
    >
      {markerContent}
      {mapPopupContent}
    </Map>
  );
};

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
})(DoctorsMap);
