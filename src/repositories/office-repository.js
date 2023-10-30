import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Config } from "../config";

const baseUrl = Config.serviceUrls.officeBaseUrl;
const UTILITY_POINT_URL = Config.serviceUrls.utilityBaseUrl;

export async function getOffices(
  userId,
  pageNumber,
  pageSize,
  activeStatus = null
) {
  const response = await axios.get(`${baseUrl}/Office/Owner/${userId}`, {
    params: {
      pageNumber,
      pageSize,
      activeStatus,
    },
  });

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return {
    items: response.data.data.office_list,
    pagination: response.data.pagination,
  };
}

export function useOffices(
  userId,
  pageNumber,
  pageSize,
  activeStatus = null,
  options = {}
) {
  return useQuery(
    ["/Office/Owner", userId, pageNumber, pageSize, activeStatus],
    () => getOffices(userId, pageNumber, pageSize, activeStatus),
    options
  );
}

export async function getOfficesByUserId(
  userId,
  pageNumber,
  pageSize,
  searchTerm
) {
  const response = await axios.post(`${baseUrl}/Office/ByUser/${userId}`, {
    pageNumber,
    pageSize,
    searchTerm,
  });
  return response.data;
}

export function useOfficesByUserId(userId, pageNumber, pageSize, searchTerm) {
  return useQuery(
    ["officesByUserId", userId, pageNumber, pageSize, searchTerm],
    () => getOfficesByUserId(userId, pageNumber, pageSize, searchTerm)
  );
}

export async function getStaff(
  officeId,
  pageNumber,
  pageSize,
  searchTerm,
  isActive
) {
  const response = await axios.post(`${baseUrl}/Office/${officeId}/staffList`, {
    pageNumber,
    pageSize,
    searchTerm,
    isActive,
  });
  return response.data;
}

export function useStaff(officeId, pageNumber, pageSize, searchTerm, isActive) {
  return useQuery(
    ["staff", officeId, pageNumber, pageSize, searchTerm, isActive],
    () => getStaff(officeId, pageNumber, pageSize, searchTerm, isActive)
  );
}

export async function getOfficeDetail(officeId) {
  const response = await axios.get(`${baseUrl}/Office/Details`, {
    params: {
      officeId,
    },
  });

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data.data;
}

export function useOfficeDetail(officeId, options = {}) {
  return useQuery(
    ["Office/Details", officeId],
    () => getOfficeDetail(officeId),
    options
  );
}

export async function updateTimesheetAndNotificationPreferences(
  officeId,
  isTimesheetPreferenceTypeOnPremises,
  isTypeStaticIP,
  isTypeGeocoordinate,
  isCovidFormFillNotificationOn,
  isTimesheetFillNotificationOn,
  isTimesheetFromMobileStaticIPAllowed
) {
  const response = await axios.put(
    `${baseUrl}/Office/${officeId}/updateOnPremisesAndNotificationPreferences`,
    {},
    {
      params: {
        isTimesheetPreferenceTypeOnPremises,
        isTypeStaticIP,
        isTypeGeocoordinate,
        isCovidFormFillNotificationOn,
        isTimesheetFillNotificationOn,
        isTimesheetFromMobileStaticIPAllowed,
      },
    }
  );

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data.message;
}

export function useUpdateTimesheetAndNotificationPreferenceMutation() {
  const queryClient = useQueryClient();
  return useMutation(
    ({
      officeId,
      isTimesheetPreferenceTypeOnPremises,
      isTypeStaticIP,
      isTypeGeocoordinate,
      isCovidFormFillNotificationOn,
      isTimesheetFillNotificationOn,
      isTimesheetFromMobileStaticIPAllowed,
    }) =>
      updateTimesheetAndNotificationPreferences(
        officeId,
        isTimesheetPreferenceTypeOnPremises,
        isTypeStaticIP,
        isTypeGeocoordinate,
        isCovidFormFillNotificationOn,
        isTimesheetFillNotificationOn,
        isTimesheetFromMobileStaticIPAllowed
      ),
    {
      onSuccess: (data, variables) =>
        queryClient.invalidateQueries(["Office/Details", variables.officeId]),
    }
  );
}

export async function getOfficeDetailForStaff(officeId) {
  const req1 = axios.get(`${baseUrl}/Office/Details`, { params: { officeId } });
  const req2 = axios.get(`${baseUrl}/Office/${officeId}`);

  var [res1, res2] = await Promise.all([req1, req2]);

  if (res1.data.statusCode !== 200) {
    throw new Error(res1.data.message);
  }

  if (res2.data.statusCode !== 200) {
    throw new Error(res2.data.message);
  }

  return {
    ...res1.data.data,
    ...res2.data.data,
  };
}

export function useOfficeDetailForStaff(officeId) {
  return useQuery(["officeDetailForStaff", officeId], () =>
    getOfficeDetailForStaff(officeId)
  );
}

export async function updateClockInClockOutPreferences(
  officeId,
  isClockInOutOn
) {
  const response = await axios.put(
    `${baseUrl}/Office/ClockInOut`,
    {},
    {
      params: {
        officeId,
        isClockInOutOn,
      },
    }
  );

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data.message;
}

export function useUpdateClockInClockOutPreferenceMutation() {
  const queryClient = useQueryClient();
  return useMutation(
    ({ officeId, isClockInOutOn }) =>
      updateClockInClockOutPreferences(officeId, isClockInOutOn),
    {
      onSuccess: (data, variables) =>
        queryClient.invalidateQueries(["Office/Details", variables.officeId]),
    }
  );
}

export const getCityList = async (provienceId) => {
  let res = await axios.get(`${UTILITY_POINT_URL}/Utility/City/${provienceId}`);

  if (res.data.statusCode !== 200) {
    throw new Error(res.data.message);
  }

  return res.data.data;
};

export const getProvinceList = async (countryId) => {
  let res = await axios.get(
    `${UTILITY_POINT_URL}/Utility/Province/${countryId}`
  );

  if (res.data.statusCode !== 200) {
    throw new Error(res.data.message);
  }

  return res.data.data;
};

export const useGetProviceList = (countryId, options = {}) => {
  return useQuery(
    ["provice-list", countryId],
    () => getProvinceList(countryId),
    options
  );
};

export async function getApprovalsAndRequests(officeId, pageNo, pageSize) {
  const response = await axios.get(`${baseUrl}/Office/RecentUpdates`, {
    params: {
      officeId,
      pageNo,
      pageSize,
    },
  });

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data;
}

export function useApprovalsAndRequests(
  officeId,
  pageNo,
  pageSize,
  options = {}
) {
  return useQuery(
    ["Office/ApprovalAndRequest", officeId],
    () => getApprovalsAndRequests(officeId, pageNo, pageSize),
    options
  );
}

export const getWarningDetails = async (officeId) => {
  let res = await axios.get(`${baseUrl}/Office/Preferences/${officeId}`);

  if (res.data.statusCode !== 200) {
    throw new Error(res.data.message);
  }

  return res.data.data;
};

export const useWarningDetails = (officeId, options = {}) => {
  return useQuery(
    ["warning-detail", officeId],
    () => getWarningDetails(officeId),
    options
  );
};

export const removeDeactivatedOffice = async (params) => {
  const response = await axios.post(`${baseUrl}/Office/leaveOffice`, params);
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;
};
