import axios from "axios";
import { Config } from "./../config";
import { useQuery, useMutation } from "react-query";

const patientSchedulingBaseUrl = Config.serviceUrls.patientSchedulingBaseUrl;

export const addFamilyMember = async (params) => {
  const response = await axios.post(
    `${patientSchedulingBaseUrl}/PatientFamilyMember/AddFamilyMember`,
    params
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;
};

const getFamilyMemberList = async ({ pageNumber, pageSize }) => {
  const response = await axios.get(
    `${patientSchedulingBaseUrl}/PatientFamilyMember/FamilyMemberList?PageNumber=${pageNumber}&PageSize=${pageSize}`
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;
};

export const useGetFamilyMemberList = (pageNumber, pageSize, options = {}) => {
  return useQuery(
    ["family-member-get-list", pageNumber, pageSize],
    () => getFamilyMemberList({ pageNumber, pageSize }),
    options
  );
};

const getFamilyMemberAddedYouList = async ({ pageNumber, pageSize }) => {
  const response = await axios.get(
    `${patientSchedulingBaseUrl}/PatientFamilyMember/PatientAsFamilyMemberList?PageNumber=${pageNumber}&PageSize=${pageSize}`
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;
};

export const useGetFamilyMemberAddedYouList = (
  pageNumber,
  pageSize,
  options = {}
) => {
  return useQuery(
    ["family-member-added-you-get-list", pageNumber, pageSize],
    () => getFamilyMemberAddedYouList({ pageNumber, pageSize }),
    options
  );
};

export const deleteAddedMember = async ({ FamilyMemberId }) => {
  const response = await axios.delete(
    `${patientSchedulingBaseUrl}/PatientFamilyMember/${FamilyMemberId}`
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;
};

export const useDeleteAddedMember = () => {
  return useMutation(deleteAddedMember);
};

export async function getSingleMemberDetails(memberId) {
  const response = await axios.get(
    `${patientSchedulingBaseUrl}/PatientFamilyMember/GetById?FamilyMemberId=${memberId}`
  );

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response?.data;
}

export async function updateAddedFamilyMember(params) {
  const response = await axios.put(
    `${patientSchedulingBaseUrl}/PatientFamilyMember`,
    params
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;
}

export const deleteYourSelfAsMember = async ({ FamilyMemberId }) => {
  const response = await axios.delete(
    `${patientSchedulingBaseUrl}/PatientFamilyMember/${FamilyMemberId}/Remove`
  );

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data;
};

export const useYourSelfAsMember = () => {
  return useMutation(deleteYourSelfAsMember);
};

const getMembersForBooking = async ({ pageNumber, pageSize }) => {
  const response = await axios.get(
    `${patientSchedulingBaseUrl}/PatientFamilyMember/MembersForBooking?PageNumber=${pageNumber}&PageSize=${pageSize}`
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data;
};

export const useGetMembersForBooking = (pageNumber, pageSize, options = {}) => {
  return useQuery(
    ["get-family-member-list-for-booking", pageNumber, pageSize],
    () => getMembersForBooking({ pageNumber, pageSize }),
    options
  );
};
