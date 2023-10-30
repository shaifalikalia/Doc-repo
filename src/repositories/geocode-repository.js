import axios from "axios";
import { useQuery } from "react-query";

export async function getLatLng(address) {
  const response = await axios
    .create()
    .get("https://maps.googleapis.com/maps/api/geocode/json", {
      params: {
        address,
        key: process.env.REACT_APP_GOOGLE_API_KEY,
      },
    });

  if (response.data && response.data.results.length > 0) {
    return response.data.results[0].geometry.location;
  }

  return null;
}

export function useLatLng(address) {
  const isEnabled = address ? true : false;
  return useQuery(
    ["https://maps.googleapis.com/maps/api/geocode/json", address],
    () => getLatLng(address),
    { enabled: isEnabled }
  );
}
