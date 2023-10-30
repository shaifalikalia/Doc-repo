import axios from "axios";
import { useQuery } from "react-query";
import { Config } from "./../config";

const leaveMicroserviceBaseUrl = Config.serviceUrls.leaveBaseUrl;
const personnelBaseUrl = Config.serviceUrls.personnelBaseUrl;

export async function getLeaveTypes() {
  const response = await axios.get(
    `${leaveMicroserviceBaseUrl}/Leave/LeaveType`
  );
  return response.data;
}

export function useLeaveTypes() {
  return useQuery(["leaveTypes"], getLeaveTypes);
}

export async function getLeaveDetail(staffId, invitationId) {
  const response = await axios.get(`${leaveMicroserviceBaseUrl}/Leave/Detail`, {
    params: {
      staffId,
      invitationId,
    },
  });

  return response.data;
}

export const updateLeaveStatus = async (params) => {
  let response = await axios.put(
    `${leaveMicroserviceBaseUrl}/Leave/Action`,
    params
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response?.data;
};

const getStaffLeaveListing = async ({
  officeId,
  userId,
  year,
  pageNumber,
  pageSize,
}) => {
  const response = await axios.get(
    `${leaveMicroserviceBaseUrl}/Leave?officeId=${officeId}&userid=${userId}&year=${year}&pageNo=${pageNumber}&pageSize=${pageSize}`
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;
};

export const useStaffLeaveListing = (
  officeId,
  userId,
  year,
  pageNumber,
  pageSize,
  options = {}
) => {
  return useQuery(
    ["staff-leave-listing", officeId, userId, year, pageNumber, pageSize],
    () =>
      getStaffLeaveListing({ officeId, userId, year, pageNumber, pageSize }),
    options
  );
};

const getLeaveListing = async ({
  officeId,
  statusId,
  year,
  pageNumber,
  pageSize,
  searchTerm,
}) => {
  const response = await axios.get(
    `${leaveMicroserviceBaseUrl}/Leave/Office?officeId=${officeId}&statusId=${statusId}&year=${year}&pageNo=${pageNumber}&pageSize=${pageSize}&searchTerm=${searchTerm}`
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;
};

export const useLeaveListing = (
  officeId,
  statusId,
  year,
  pageNumber,
  pageSize,
  searchTerm,
  options = {}
) => {
  return useQuery(
    [
      "leave-listing",
      officeId,
      statusId,
      year,
      pageNumber,
      pageSize,
      searchTerm,
    ],
    () =>
      getLeaveListing({
        officeId,
        statusId,
        year,
        pageNumber,
        pageSize,
        searchTerm,
      }),
    options
  );
};

async function getTemporaryStaffList(officeId, LeaveId, fromDate, toDate) {
  const response = await axios.post(`${personnelBaseUrl}/Resume/InternalJob`, {
    officeId,
    LeaveId,
    fromDate,
    toDate,
  });

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return { data: response.data.data, pagination: response.data.pagination };
}

export function useTemporaryStaffList(officeId, LeaveId, fromDate, toDate) {
  return useQuery(
    ["staff-temporary-list", officeId, LeaveId, fromDate, toDate],
    () => getTemporaryStaffList(officeId, LeaveId, fromDate, toDate)
  );
}

export const addBackupStaff = async (params) => {
  let response = await axios.patch(
    `${leaveMicroserviceBaseUrl}/Leave/UpdateBackup`,
    params
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response?.data;
};

const getLeaveCategoryCounts = async ({ officeId, userId }) => {
  const response = await axios.get(
    `${leaveMicroserviceBaseUrl}/Leave/Detail?officeId=${officeId}&userId=${userId}`
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;
};

export const useLeaveCategoryCounts = (officeId, userId, options = {}) => {
  return useQuery(
    ["leave-category-counts", officeId, userId],
    () => getLeaveCategoryCounts({ officeId, userId }),
    options
  );
};

export const applyLeave = async (params) => {
  const response = await axios.post(
    `${leaveMicroserviceBaseUrl}/Leave`,
    params
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;
};
