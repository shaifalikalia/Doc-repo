export default function useSearchLocation() {
  const value = localStorage.getItem("doctorSearchLocation");
  if (value !== null) {
    return JSON.parse(value);
  }

  // Default value
  return {
    countryId: 1,
    countryName: "Canada",
    stateId: null,
    stateName: null,
    cityId: null,
    cityName: null,
    street: null,
  };
}
