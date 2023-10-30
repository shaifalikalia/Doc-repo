import axios from "axios";
import { useQuery } from "react-query";
import { Config } from "./../config";

const baseUrl = Config.serviceUrls.patientSchedulingBaseUrl.replace(
  "/api/v1",
  ""
);

export async function getDoctors(
  pageNumber,
  pageSize,
  lat,
  lng,
  searchTerm,
  specialtyId
) {
  const response = await axios.post(`${baseUrl}/Common/Doctors`, {
    pageNumber,
    pageSize,
    Latitude: lat,
    Longitude: lng,
    SearchTerm: searchTerm,
    SpecialityId: specialtyId,
  });

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return {
    items: response.data.data,
    totalItems: response.data.pagination.totalItems,
  };
}

export function useDoctors(
  pageNumber,
  pageSize,
  lat,
  lng,
  searchTerm,
  specialtyId,
  options = {}
) {
  return useQuery(
    [
      "/Common/Doctors",
      pageNumber,
      pageSize,
      lat,
      lng,
      searchTerm,
      specialtyId,
    ],
    () => getDoctors(pageNumber, pageSize, lat, lng, searchTerm, specialtyId),
    options
  );
}

export async function getDoctorDetail(doctorId, officeId) {
  const response = await axios.get(`${baseUrl}/Common/Doctor`, {
    params: {
      doctorId,
      officeId,
    },
  });

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data.data;
}

export function useDoctorDetail(doctorId, officeId, options = {}) {
  return useQuery(
    ["/Common/Doctor", doctorId, officeId],
    () => getDoctorDetail(doctorId, officeId),
    options
  );
}

export async function getDoctorOffices(doctorId, pageNumber, pageSize) {
  const response = await axios.get(
    `${baseUrl.replace("/api/v1", "")}/common/DoctorOffices`,
    {
      params: {
        doctorId,
        pageNumber,
        pageSize,
      },
    }
  );

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return {
    items: response.data.data,
    totalItems: response.data.pagination.totalItems,
  };
}

export function useDoctorOffices(doctorId, pageNumber, pageSize) {
  return useQuery(
    ["/common/DoctorOffice", doctorId, pageNumber, pageSize],
    () => getDoctorOffices(doctorId, pageNumber, pageSize)
  );
}
