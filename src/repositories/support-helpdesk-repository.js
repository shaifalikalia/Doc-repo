import axios from "axios";
import { useQuery } from "react-query";
import { Config } from "../config";

const supportHelpDeskBaseUrl = Config.serviceUrls.supportHelpdeskBaseUrl;

export async function getTicketList(pageNumber, pageSize, Statuses, TicketNo) {
  const response = await axios.post(
    `${supportHelpDeskBaseUrl}/SupportAndHelpDesk/TicketList`,
    {
      pageNumber,
      pageSize,
      Statuses,
      TicketNo,
    }
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return { data: response.data.data, pagination: response.data.pagination };
}

export function useTickets(pageNumber, pageSize, Statuses, TicketNo) {
  return useQuery(["tickets", pageNumber, pageSize, Statuses, TicketNo], () =>
    getTicketList(pageNumber, pageSize, Statuses, TicketNo)
  );
}

export async function getTicketById(ticketId) {
  const response = await axios.get(
    `${supportHelpDeskBaseUrl}/SupportAndHelpDesk/${ticketId}`
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data.data;
}

export function useTicketById(ticketId) {
  return useQuery(["GET_TICKET_BY_ID", ticketId], () =>
    getTicketById(ticketId)
  );
}

export async function createMessage(SupportAndHelpDeskId, Message) {
  const response = await axios.post(
    `${supportHelpDeskBaseUrl}/SupportAndHelpDesk/Message`,
    {
      SupportAndHelpDeskId,
      Message,
    }
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return { data: response.data.data, pagination: response.data.pagination };
}

export async function inProgressTicketStatus(SupportAndHelpDeskId) {
  const response = await axios.patch(
    `${supportHelpDeskBaseUrl}/SupportAndHelpDesk/InProgress?SupportAndHelpDeskId=${SupportAndHelpDeskId}`
  );

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data.message;
}

export async function resolveTicketStatus(SupportAndHelpDeskId) {
  const response = await axios.patch(
    `${supportHelpDeskBaseUrl}/SupportAndHelpDesk/Resolve?SupportAndHelpDeskId=${SupportAndHelpDeskId}`
  );

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data.message;
}
