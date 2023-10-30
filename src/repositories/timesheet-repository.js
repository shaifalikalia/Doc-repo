import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Config } from "../config";

const baseUrl = Config.serviceUrls.timesheetBaseUrl;

export async function getTimesheet(userId, officeId, startDate, endDate) {
  const response = await axios.get(`${baseUrl}/Timesheet`, {
    params: {
      userId,
      officeId,
      startDate,
      endDate,
    },
  });

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data.data;
}

export function useTimesheet(userId, officeId, startDate, endDate) {
  return useQuery(["getTimesheet", userId, officeId, startDate, endDate], () =>
    getTimesheet(userId, officeId, startDate, endDate)
  );
}

export async function addTimesheet({
  userId,
  officeId,
  statusId,
  date,
  startDateTime,
  endDateTime,
  timeSpentInMinutes,
  breakDurationInMinutes,
  ip = null,
  IsTypeAdvance,
  AdvanceTimesheetType,
  TimesheetTasks,
  currentDate,
}) {
  const response = await axios.post(`${baseUrl}/Timesheet`, {
    userId,
    officeId,
    statusId,
    date,
    startTime: startDateTime,
    endTime: endDateTime,
    timeSpent: timeSpentInMinutes,
    breakTime: breakDurationInMinutes,
    ip,
    geocoordinates: "",
    IsRequestFromMobile: false,
    IsTypeAdvance,
    AdvanceTimesheetType,
    TimesheetTasks,
    currentDate,
  });

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data.message;
}

export function useAddTimesheetMutation() {
  const queryClient = useQueryClient();
  return useMutation((addTimesheetDto) => addTimesheet(addTimesheetDto), {
    onSuccess: () => {
      queryClient.invalidateQueries(["getTimesheet"]);
      queryClient.invalidateQueries(["checkRequestApproval"]);
    },
  });
}

export async function updateTimesheet({
  userId,
  officeId,
  timesheetId,
  statusId,
  date,
  startDateTime,
  endDateTime,
  timeSpentInMinutes,
  breakDurationInMinutes,
  ip = null,
  IsTypeAdvance,
  AdvanceTimesheetType,
  TimesheetTasks,
  currentDate,
}) {
  const response = await axios.put(`${baseUrl}/Timesheet/${timesheetId}`, {
    userId,
    officeId,
    id: timesheetId,
    statusId,
    date,
    startTime: startDateTime,
    endTime: endDateTime,
    timeSpent: timeSpentInMinutes,
    breakTime: breakDurationInMinutes,
    ip,
    geocoordinates: "",
    IsRequestFromMobile: false,
    IsTypeAdvance,
    AdvanceTimesheetType,
    TimesheetTasks,
    currentDate,
  });

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data.message;
}

export function useUpdateTimesheetMutation() {
  const queryClient = useQueryClient();
  return useMutation(
    (updateTimesheetDto) => updateTimesheet(updateTimesheetDto),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["getTimesheet"]);
        queryClient.invalidateQueries(["checkRequestApproval"]);
      },
    }
  );
}

export async function getWorkTypeList(OfficeId, PageSize, PageNumber) {
  const response = await axios.get(`${baseUrl}/TimeSheet/WorkTypeList`, {
    params: {
      OfficeId,
      PageNumber,
      PageSize,
    },
  });

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data.data;
}

export async function getTaskList(OfficeId, PageSize, PageNumber) {
  const response = await axios.get(`${baseUrl}/TimeSheet/TaskList`, {
    params: {
      OfficeId,
      PageNumber,
      PageSize,
    },
  });

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data.data;
}

export async function addCustomTask({ OfficeId, title }) {
  const response = await axios.post(`${baseUrl}/TimeSheet/CreateCustomTask`, {
    OfficeId,
    title,
  });

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data.message;
}

export function useCustomTaskMutation() {
  const queryClient = useQueryClient();
  return useMutation((data) => addCustomTask(data), {
    onSuccess: () => {
      queryClient.invalidateQueries(["getWorkTypeList"]);
    },
  });
}

export async function addCustomWorkType({ OfficeId, title }) {
  const response = await axios.post(`${baseUrl}/TimeSheet/CreateWorkType`, {
    OfficeId,
    title,
  });

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data.message;
}

export function useCustomWorkTypeMutation() {
  const queryClient = useQueryClient();
  return useMutation((data) => addCustomWorkType(data), {
    onSuccess: () => {
      queryClient.invalidateQueries(["getTaskList"]);
    },
  });
}

export async function getTimesheetDetail(userId, officeId, startDate, endDate) {
  const response = await axios.get(`${baseUrl}/Timesheet/Details`, {
    params: {
      userId,
      officeId,
      startDate,
      endDate,
    },
  });

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data.data;
}

export function useTimesheetDetail(userId, officeId, startDate, endDate) {
  return useQuery(
    ["getTimesheetDetail", userId, officeId, startDate, endDate],
    () => getTimesheetDetail(userId, officeId, startDate, endDate)
  );
}

export async function getTimesheetTaskList(TimesheetId, AdvanceTimesheetType) {
  const response = await axios.get(`${baseUrl}/Timesheet/TimesheetTaskList`, {
    params: {
      TimesheetId,
      AdvanceTimesheetType,
    },
  });

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data.data;
}
export async function getAdvancedTimesheetDetails(
  TimesheetId,
  AdvanceTimesheetType
) {
  const response = await axios.get(
    `${baseUrl}/TimeSheet/AdvanceTimesheetDetails`,
    {
      params: {
        TimesheetId,
        AdvanceTimesheetType,
      },
    }
  );

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data.data;
}
export function useAdvancedTimesheetDetails(TimesheetId, AdvanceTimesheetType) {
  return useQuery(
    ["getAdvancedTimesheetDetails", TimesheetId, AdvanceTimesheetType],
    () => getAdvancedTimesheetDetails(TimesheetId, AdvanceTimesheetType)
  );
}

export async function checkRequestApproval(timesheetDate, officeId) {
  const response = await axios.get(`${baseUrl}/Timesheet/EditRequest`, {
    params: {
      timesheetDate,
      officeId,
    },
  });

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data.data;
}

export function useCheckTimesheetRequest(timesheetDate, officeId) {
  return useQuery(["checkRequestApproval", timesheetDate, officeId], () =>
    checkRequestApproval(timesheetDate, officeId)
  );
}
export async function editRequest({
  timesheetRequestDate,
  userId,
  officeId,
  reason,
}) {
  const response = await axios.post(`${baseUrl}/TimeSheet/EditRequest`, {
    timesheetRequestDate,
    userId,
    officeId,
    reason,
  });

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data.message;
}

export function useEditRequestMutation() {
  const queryClient = useQueryClient();
  return useMutation((data) => editRequest(data), {
    onSuccess: () => {
      queryClient.invalidateQueries(["checkRequestApproval"]);
    },
  });
}

export async function getTimesheetBreak(timesheetId) {
  const response = await axios.get(`${baseUrl}/Timesheet/Break`, {
    params: {
      timesheetId,
    },
  });

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data.data;
}

export async function startStopTimesheetBreak(
  timesheetId,
  startbreak,
  timeZoneOffset
) {
  const response = await axios.post(`${baseUrl}/TimeSheet/Break`, {
    timesheetId,
    break: startbreak,
    timeZoneOffset,
  });

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data.data;
}

const getStaffTimesheet = async ({
  officeId,
  pageNumber,
  pageSize,
  from,
  to,
  searchTerm,
  status,
}) => {
  const response = await axios.get(
    `${baseUrl}/TimeSheet/Office?officeId=${officeId}&pageNo=${pageNumber}&pageSize=${pageSize}&fromDate=${from}&toDate=${to}&searchTerm=${searchTerm}&statusId=${status}`
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;
};

export const useStaffTimesheet = (
  officeId,
  pageNumber,
  pageSize,
  from,
  to,
  searchTerm,
  status,
  options = {}
) => {
  return useQuery(
    [
      "staff-listing-timesheet",
      officeId,
      pageNumber,
      pageSize,
      from,
      to,
      searchTerm,
      status,
    ],
    () =>
      getStaffTimesheet({
        officeId,
        pageNumber,
        pageSize,
        from,
        to,
        searchTerm,
        status,
      }),
    options
  );
};

const getTimesheetListing = async ({
  officeId,
  userId,
  pageNumber,
  pageSize,
  from,
  to,
  status,
}) => {
  const response = await axios.get(
    `${baseUrl}/TimeSheet/Details?officeId=${officeId}&userId=${userId}&pageNo=${pageNumber}&pageSize=${pageSize}&startDate=${from}&endDate=${to}&statusId=${status}`
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;
};

export const useTimesheetListing = (
  officeId,
  userId,
  pageNumber,
  pageSize,
  from,
  to,
  status,
  options = {}
) => {
  return useQuery(
    [
      "timesheet-listing",
      officeId,
      userId,
      pageNumber,
      pageSize,
      from,
      to,
      status,
    ],
    () =>
      getTimesheetListing({
        officeId,
        userId,
        pageNumber,
        pageSize,
        from,
        to,
        status,
      }),
    options
  );
};

export const timeSheetDataExport = async (
  officeId,
  startDate,
  endDate,
  userId,
  statusId
) => {
  const response = await axios.get(
    `${baseUrl}/TimeSheet/Export?officeId=${officeId}&startDate=${startDate}&endDate=${endDate}&userId=${userId}&statusId=${statusId}`
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

export const updateTimesheetStatus = async (params) => {
  let response = await axios.put(`${baseUrl}/TimeSheet/Office`, params);
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response?.data;
};

export const updateEditTimesheetRequestStatus = async (sheetId, isApproved) => {
  let response = await axios.put(
    `${baseUrl}/TimeSheet/ApproveEditRequest?clockInOutTimeSheetEditRequestId=${sheetId}&IsRequestApproved=${isApproved}`
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response?.data;
};
