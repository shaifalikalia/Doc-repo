import { useState, useEffect } from "react";
import markerIcon from "../../../../assets/images/map-marker.svg";

const Marker = ({ Map, position }) => {
  let options = {
    animation: window.google.maps.Animation.DROP,
    icon: markerIcon,
    position: position,
    map: Map,
  };
  const [marker, setMarker] = useState();

  useEffect(() => {
    if (!marker) {
      setMarker(new window.google.maps.Marker());
    }
    return () => {
      if (marker) {
        marker.setMap(null);
      }
    };
  }, [marker]);

  useEffect(() => {
    if (marker) {
      marker.setOptions(options);
    }
  }, [marker, position]);

  return null;
};

export default Marker;
