import axios from "axios";
import { useQuery } from "react-query";
import { Config } from "../config";

const userBaseUrl = Config.serviceUrls.userBaseUrl;
const sendBirdApiUrl = Config.serviceUrls.sendBirdApiUrl;

export const getStaffMembersList = async ({ queryKey }) => {
  const [, OwnerId, OfficeIds, SearchByName, PageNo, PageSize] = queryKey;
  const response = await axios.post(
    `${userBaseUrl}/Staff/StaffListByMessagePrefrence`,
    {
      OwnerId,
      OfficeIds,
      SearchByName,
      PageNo,
      PageSize,
    }
  );

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response?.data;
};

export const useGetStaffMembers = (
  ownerId,
  officeIds,
  SearchByName,
  PageNo,
  PageSize,
  options = {}
) => {
  return useQuery(
    [
      "messanger-staff-members",
      ownerId,
      officeIds,
      SearchByName,
      PageNo,
      PageSize,
    ],
    getStaffMembersList,
    options
  );
};

export const getMessangerOwnerList = async () => {
  const response = await axios.get(
    `${userBaseUrl}/User/OwnerListByMessengerPreference`
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response?.data?.data;
};

export const useGetMessangerOwnerList = (ownerId, options = {}) => {
  return useQuery(
    ["messanger-owner-list", ownerId],
    () => getMessangerOwnerList(),
    options
  );
};

export const getExternalMembers = async (SearchTerm, OwnerId) => {
  const response = await axios.post(
    `${userBaseUrl}/User/ExternalMessengerList`,
    {
      SearchTerm,
      OwnerId,
    }
  );

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response?.data?.data;
};

export const getCanUserCreateGroups = async (OwnerId) => {
  const response = await axios.get(`${userBaseUrl}/User/CanUserCreateGroup`, {
    params: {
      OwnerId,
    },
  });

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response?.data?.data;
};

export const useGetCanUserCreateGroups = (ownerId, options = {}) => {
  return useQuery(
    ["can-create-groups", ownerId],
    () => getCanUserCreateGroups(ownerId),
    options
  );
};

export const createSendbirdUser = async (postData) => {
  const response = await axios.post(`${sendBirdApiUrl}/v3/users`, postData, {
    headers: {
      "Api-Token": process.env.REACT_APP_SENDBIRD_API_TOKEN,
    },
  });

  return response.data;
};

export const updateSendbirdUserStatus = async (userId, status) => {
  const payload = {
    metadata: {
      status,
    },
    upsert: true,
  };
  const response = await axios.put(
    `${sendBirdApiUrl}/v3/users/${userId}/metadata`,
    payload,
    {
      headers: {
        "Api-Token": process.env.REACT_APP_SENDBIRD_API_TOKEN,
      },
    }
  );

  return response.data;
};

export const getSendbirdUnreadCount = async (userId) => {
  const response = await axios.get(
    `${sendBirdApiUrl}/v3/users/${userId}/unread_message_count`,
    {
      params: {
        super_mode: "nonsuper",
      },
      headers: {
        "Api-Token": process.env.REACT_APP_SENDBIRD_API_TOKEN,
      },
    }
  );

  return response.data;
};

export const useGetSendbirdUnreadCount = (userId, options = {}) => {
  return useQuery(
    ["sendird-unread-count", userId],
    () => getSendbirdUnreadCount(userId),
    options
  );
};
