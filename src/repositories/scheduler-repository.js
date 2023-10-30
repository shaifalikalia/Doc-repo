import axios from "axios";
import { useMutation, useQuery } from "react-query";
import { Config } from "../config";

const baseUrl = Config.serviceUrls.schedulerBaseUrl;
const OFFICE_POINT_URL = Config.serviceUrls.officeBaseUrl;
const notesBaseUrl = Config.serviceUrls.notesBaseUrl;
const utilityBaseUrl = Config.serviceUrls.utilityBaseUrl;
const userBaseUrl = Config.serviceUrls.userBaseUrl;

export async function createSchedulerEvent(data) {
  const response = await axios.post(`${baseUrl}/SchedulerEvent`, data);
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data.message;
}
export function useCreateSchedulerEventMutation() {
  return useMutation((data) => createSchedulerEvent(data), {});
}

export async function updateSchedulerEvent(data) {
  const response = await axios.put(`${baseUrl}/SchedulerEvent`, data);
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data.message;
}
export function useCreateUpdateSchedulerEventMutation() {
  return useMutation((data) => updateSchedulerEvent(data), {});
}

export async function getAllActiveOffices(pageNumber, pageSize, ownerId) {
  const response = await axios.get(`${OFFICE_POINT_URL}/Office/AllActive`, {
    params: {
      pageNumber,
      pageSize,
      ownerId,
    },
  });

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data;
}

export function useAllActiveOffices(
  pageNumber,
  pageSize,
  ownerId,
  options = {}
) {
  return useQuery(
    ["/Office/AllActive", pageNumber, pageSize, ownerId],
    () => getAllActiveOffices(pageNumber, pageSize, ownerId),
    options
  );
}

export async function getStaffMembers(officeId) {
  const response = await axios.get(`${notesBaseUrl}/GlobalNote/OfficeMembers`, {
    params: { officeId },
  });
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data.data;
}

export const getStaffMembersList = async (ownerId, officeId) => {
  const response = await axios.post(`${userBaseUrl}/User/StaffListByOwner`, {
    ownerId: ownerId,
    officeIds: officeId,
  });

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response?.data;
};

export async function getStaffDesignation() {
  const response = await axios.get(
    `${utilityBaseUrl}/Designation/getAllRolesDesignation`
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data.data;
}

export function useStaffDesignation() {
  return useQuery(["/Utility/Designations"], () => getStaffDesignation());
}

export async function getAccountOwners() {
  const response = await axios.get(`${userBaseUrl}/Staff/OwnerList`);
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data.data;
}

export function useAccountOwners(options = {}) {
  return useQuery(["/Staff/OwnerList"], () => getAccountOwners(), options);
}

export async function getEventListByAssignedUser(
  pageNumber,
  pageSize,
  ownerId,
  startDate,
  endDate,
  officeIds,
  statuses
) {
  const response = await axios.post(
    `${baseUrl}/SchedulerEvent/ListByAssignedUser`,
    {
      pageNumber,
      pageSize,
      ownerId,
      startDate,
      endDate,
      officeIds,
      statuses,
    }
  );

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data;
}

export function useEventListByAssignedUser(
  pageNumber,
  pageSize,
  ownerId,
  startDate,
  endDate,
  officeIds,
  statuses
) {
  return useQuery(
    [
      "/SchedulerEvent/ListByAssignedUser",
      pageNumber,
      pageSize,
      ownerId,
      startDate,
      endDate,
      officeIds,
      statuses,
    ],
    () =>
      getEventListByAssignedUser(
        pageNumber,
        pageSize,
        ownerId,
        startDate,
        endDate,
        officeIds,
        statuses
      )
  );
}

export async function getSchedularNotes(startDate, endDate, ownerId) {
  const response = await axios.get(
    `${baseUrl}/Scheduler/DayNote/List?StartDate=${startDate}&EndDate=${endDate}&OwnerId=${ownerId}`
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data;
}

export async function getOfficeNotesMonthly({ queryKey }) {
  const [, ownerId, startDate, endDate] = queryKey;
  const axiosRes = await axios.get(
    `${baseUrl}/Scheduler/DayNote/List?StartDate=${startDate}&EndDate=${endDate}&OwnerId=${ownerId}`
  );
  const apiRes = axiosRes.data;
  if (apiRes.statusCode !== 200) {
    throw new Error(apiRes.message);
  }
  return apiRes;
}

export function useGetNotesEventMonthly(
  ownerId,
  startDate,
  endDate,
  options = {}
) {
  return useQuery(
    ["MONTHLY_NOTES_EVENT", ownerId, startDate, endDate],
    getOfficeNotesMonthly,
    options
  );
}

export async function addSchedularNotes(data) {
  const response = await axios.post(`${baseUrl}/Scheduler/DayNote`, data);

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response?.data;
}

export async function editSchedularNotes(text, noteId) {
  const response = await axios.put(
    `${baseUrl}/Scheduler/DayNote?Text=${text}&SchedulerDayNoteId=${noteId}`
  );

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response?.data;
}

export async function deleteSchedularNote(id) {
  const response = await axios.delete(
    `${baseUrl}/Scheduler/DayNote?SchedulerDayNoteId=${id}`
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data;
}

export async function checkOverlapEvent(schedulerEventId, OwnerId) {
  const response = await axios.get(
    `${baseUrl}/SchedulerEvent/CheckEventOverlap?SchedulerEventId=${schedulerEventId}&OwnerId=${OwnerId}`
  );

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data;
}

export async function acceptEventRequest(schedulerEventId, officeId) {
  const response = await axios.patch(
    `${baseUrl}/SchedulerEvent/Accept?SchedulerEventId=${schedulerEventId}&OfficeId=${officeId}`
  );

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data.message;
}

export async function rejectEventRequest(
  schedulerEventId,
  officeId,
  ReasonForRejection
) {
  const response = await axios.patch(
    `${baseUrl}/SchedulerEvent/Reject?SchedulerEventId=${schedulerEventId}&OfficeId=${officeId}&ReasonForRejection=${ReasonForRejection}`
  );

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data.message;
}

export async function cancelEventRequest(
  schedulerEventId,
  officeId,
  ReasonForCancel
) {
  const response = await axios.patch(
    `${baseUrl}/SchedulerEvent/Cancel?SchedulerEventId=${schedulerEventId}&OfficeId=${officeId}&ReasonForCancel=${ReasonForCancel}`
  );

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data.message;
}

export async function getEventListForAssigner(
  ownerId,
  startDate,
  endDate,
  officeIds
) {
  const response = await axios.post(
    `${baseUrl}/SchedulerEvent/ListForAssigner`,
    {
      ownerId,
      startDate,
      endDate,
      officeIds,
    }
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;
}

export async function getEventListDetails(SchedulerEventId) {
  const response = await axios.get(
    `${baseUrl}/SchedulerEvent/${SchedulerEventId}`
  );

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response?.data;
}

export async function eventPublished(SchedulerEventId) {
  const response = await axios.patch(
    `${baseUrl}/SchedulerEvent/${SchedulerEventId}/Publish`
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response?.data;
}

export async function getEventPublishedList(
  pageNumber,
  pageSize,
  ownerId,
  statuses
) {
  const response = await axios.post(`${baseUrl}/SchedulerEvent/PublishedList`, {
    pageNumber,
    pageSize,
    ownerId,
    statuses,
  });
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response?.data;
}

export async function requestToJoin(params) {
  const response = await axios.post(
    `${baseUrl}/SchedulerEvent/RequestToJoin`,
    params
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response?.data;
}

export async function acceptRequestEvents(id) {
  const response = await axios.patch(
    `${baseUrl}/SchedulerEvent/RequestToJoin/Accept?EventRequestToJoinId=${id}`
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response?.data;
}

export async function withDrawEvent(id) {
  const response = await axios.patch(
    `${baseUrl}/SchedulerEvent/RequestToJoin/Withdraw?EventRequestToJoinId=${id}`
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response?.data;
}

export async function declineEvents(id) {
  const response = await axios.patch(
    `${baseUrl}/SchedulerEvent/RequestToJoin/Decline?SchedulerEventId=${id}`
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response?.data;
}

export async function deleteEvent(SchedulerEventId) {
  const response = await axios.delete(
    `${baseUrl}/SchedulerEvent/${SchedulerEventId}`
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response?.data;
}

export async function rejectRequestEventToJoin(id, reasonForReajection) {
  const response = await axios.patch(
    `${baseUrl}/SchedulerEvent/RequestToJoin/Reject?EventRequestToJoinId=${id}&ReasonForRejection=${reasonForReajection}`
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response?.data;
}

export async function acceptRequestEventToJoin(EventRequestToJoinId) {
  const response = await axios.patch(
    `${baseUrl}/SchedulerEvent/RequestToJoin/Accept?EventRequestToJoinId=${EventRequestToJoinId}`
  );

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data;
}

export async function createBusySlot(body) {
  const response = await axios.post(`${baseUrl}/Scheduler/BusySlot`, body);
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;
}

export async function updateBusySlot(body) {
  const response = await axios.put(`${baseUrl}/Scheduler/BusySlot`, body);
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;
}
export async function getAgenda({ queryKey }) {
  const [, OwnerId, StartDate, EndDate, OfficeIds] = queryKey;
  const body = { OwnerId, StartDate, EndDate, OfficeIds };
  const axiosRes = await axios.post(`${baseUrl}/Scheduler/Agenda`, body);
  const apiRes = axiosRes.data;
  if (apiRes.statusCode !== 200) {
    throw new Error(apiRes.message);
  }
  return apiRes;
}

export function useGetAgenda(
  ownerId,
  startDate,
  endDate,
  officeIds,
  options = {}
) {
  const ids = [...officeIds].sort((a, b) => a - b);
  return useQuery(
    ["agenda", ownerId, startDate, endDate, ids],
    getAgenda,
    options
  );
}

export async function getBusySlot({ queryKey }) {
  const [, busySlotId] = queryKey;
  const axiosRes = await axios.get(
    `${baseUrl}/Scheduler/BusySlot/${busySlotId}`
  );
  const apiRes = axiosRes.data;
  if (apiRes.statusCode !== 200) {
    throw new Error(apiRes.message);
  }
  return apiRes;
}

export function useGetBusySlot(busySlotId, options = {}) {
  return useQuery(["busy-slot-details", busySlotId], getBusySlot, options);
}

export async function deleteBusySlots(slotId) {
  const response = await axios.delete(
    `${baseUrl}/Scheduler/BusySlot/${slotId}`
  );

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data;
}

export async function getOfficeAgenda({ queryKey }) {
  const [, OwnerId, StartDate, EndDate, OfficeIds, UserIds] = queryKey;
  const body = { OwnerId, StartDate, EndDate, OfficeIds, UserIds };
  const axiosRes = await axios.post(
    `${baseUrl}/Scheduler/OfficeScheduler`,
    body
  );
  const apiRes = axiosRes.data;
  if (apiRes.statusCode !== 200) {
    throw new Error(apiRes.message);
  }
  return apiRes;
}

export async function getOfficeAgendaMonthly({ queryKey }) {
  const [, OwnerId, StartDate, EndDate, OfficeIds, UserIds] = queryKey;
  const body = { OwnerId, StartDate, EndDate, OfficeIds, UserIds };
  const axiosRes = await axios.post(
    `${baseUrl}/Scheduler/OfficeSchedulerMonthly`,
    body
  );
  const apiRes = axiosRes.data;
  if (apiRes.statusCode !== 200) {
    throw new Error(apiRes.message);
  }
  return apiRes;
}
// getOfficeEventMonthlygetOfficeEventMonthly

export async function getOfficeEventMonthly(
  ownerId,
  startDate,
  endDate,
  office_ids
) {
  const body = {
    OwnerId: ownerId,
    StartDate: startDate,
    EndDate: endDate,
    OfficeIds: office_ids,
  };
  const axiosRes = await axios.post(
    `${baseUrl}/SchedulerEvent/ListForAssigner`,
    body
  );
  const apiRes = axiosRes.data;
  if (apiRes.statusCode !== 200) {
    throw new Error(apiRes.message);
  }
  return apiRes;
}

export async function getOfficeAgendaMonthlyList({ queryKey }) {
  const [, OwnerId, StartDate, EndDate, OfficeIds, UserIds] = queryKey;
  const body = { OwnerId, StartDate, EndDate, OfficeIds, UserIds };
  const axiosRes = await axios.post(
    `${baseUrl}/Scheduler/OfficeScheduler`,
    body
  );
  const apiRes = axiosRes.data;
  if (apiRes.statusCode !== 200) {
    throw new Error(apiRes.message);
  }
  return apiRes;
}

export function useGetOfficeAgenda(
  ownerId,
  startDate,
  endDate,
  officeIds,
  userIds,
  options = {}
) {
  const office_ids = [...officeIds].sort((a, b) => a - b);
  const user_ids = [...userIds].sort((a, b) => a - b);
  return useQuery(
    ["office_agenda", ownerId, startDate, endDate, office_ids, user_ids],
    getOfficeAgenda,
    options
  );
}

export function useGetOfficeAgendaMonthly(
  ownerId,
  startDate,
  endDate,
  officeIds,
  userIds,
  options = {}
) {
  const office_ids = [...officeIds].sort((a, b) => a - b);
  const user_ids = [...userIds].sort((a, b) => a - b);
  return useQuery(
    [
      "office_agenda_Monthly",
      ownerId,
      startDate,
      endDate,
      office_ids,
      user_ids,
    ],
    getOfficeAgendaMonthly,
    options
  );
}

export function useGetOfficeEventMonthly(
  ownerId,
  startDate,
  endDate,
  officeIds,
  options = {}
) {
  const office_ids = [...officeIds].sort((a, b) => a - b);
  return useQuery(
    ["office_agenda_Monthly", ownerId, startDate, endDate],
    () => getOfficeEventMonthly(ownerId, startDate, endDate, office_ids),
    options
  );
}

export function useGetOfficeAgendaMonthlyList(
  ownerId,
  startDate,
  endDate,
  officeIds,
  userIds,
  options = {}
) {
  const office_ids = [...officeIds].sort((a, b) => a - b);
  const user_ids = [...userIds].sort((a, b) => a - b);
  return useQuery(
    [
      "office_agenda_Monthly_List",
      ownerId,
      startDate,
      endDate,
      office_ids,
      user_ids,
    ],
    getOfficeAgendaMonthlyList,
    options
  );
}

export async function getSyncCalendar(ownerId, startDate) {
  const response = await axios.get(`${baseUrl}/Scheduler/CalendarFileUrl`, {
    params: { ownerId, startDate },
  });

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;
}

export async function getEventIcsLink(id) {
  const response = await axios.get(
    `${baseUrl}/Scheduler/IcsUrlForSingleEvent/${id}`
  );

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data.data;
}

export async function getBusySlotIcsLink(id) {
  const response = await axios.get(
    `${baseUrl}/Scheduler/IcsUrlForSingleBusySlot/${id}`
  );

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data.data;
}

export async function isEventDeclined(SchedulerEventId) {
  const response = await axios.get(
    `${baseUrl}/SchedulerEvent/${SchedulerEventId}/IsDeclined`
  );

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response?.data;
}
