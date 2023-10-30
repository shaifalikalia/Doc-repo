import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Config } from "../config";

const baseUrl = Config.serviceUrls.officeBaseUrl;

export async function getGeocoordinate(officeId) {
  const response = await axios.get(
    `${baseUrl}/TimesheetPreference/Geocoordinate`,
    {
      params: {
        officeId,
      },
    }
  );

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data.data;
}

export function useGeocoordinate(officeId) {
  return useQuery(["Geocoordinate", officeId], () =>
    getGeocoordinate(officeId)
  );
}

export async function addGeocoordinate(officeId, geocoordinate) {
  const response = await axios.post(
    `${baseUrl}/TimesheetPreference/Geocoordinate`,
    {
      officeId,
      geocoordinate,
    }
  );

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data.data;
}

export function useAddGeocoordinateMutation() {
  const queryClient = useQueryClient();
  return useMutation(
    ({ officeId, geocoordinate }) => addGeocoordinate(officeId, geocoordinate),
    {
      onSuccess: (data, variables) =>
        queryClient.invalidateQueries(["Geocoordinate", variables.officeId]),
    }
  );
}

export async function updateGeocoordinate(
  officeId,
  geocoordinateId,
  geocoordinate
) {
  const response = await axios.put(
    `${baseUrl}/TimesheetPreference/Geocoordinate`,
    {
      officeId,
      geocoordinateId,
      geocoordinate,
    }
  );

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data.data;
}

export function useUpdateGeocoordinateMutation() {
  const queryClient = useQueryClient();
  return useMutation(
    ({ officeId, geocoordinateId, geocoordinate }) =>
      updateGeocoordinate(officeId, geocoordinateId, geocoordinate),
    {
      onSuccess: (data, variables) =>
        queryClient.invalidateQueries(["Geocoordinate", variables.officeId]),
    }
  );
}
