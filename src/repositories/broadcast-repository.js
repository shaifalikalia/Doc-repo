import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Config } from "../config";

const baseUrl = Config.serviceUrls.utilityBaseUrl;

export async function getBroadCastMessages(pageNumber, pageSize) {
  const response = await axios.get(`${baseUrl}/BroadcastMessage/allMessages`, {
    params: {
      pageNumber,
      pageSize,
    },
  });

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return {
    items: response.data.data,
    totalCount: response.data.pagination.totalItems,
  };
}

export function useBroadCastMessages(pageNumber, pageSize) {
  return useQuery(["/BroadcastMessage/allMessages", pageNumber, pageSize], () =>
    getBroadCastMessages(pageNumber, pageSize)
  );
}
///////
export async function getBroadCastMessagesDetail(id) {
  const response = await axios.get(`${baseUrl}/BroadcastMessage/${id}`);

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data.data;
}

export function useBroadCastMessagesDetail(id) {
  return useQuery(["/BroadcastMessage/", id], () =>
    getBroadCastMessagesDetail(id)
  );
}

export async function deleteBroadCastMessage(BroadcastMessageId) {
  const response = await axios.delete(
    `${baseUrl}/BroadcastMessage/${BroadcastMessageId}`
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data.message;
}

export function useDeleteBroadCastMessageMutation() {
  const queryClient = useQueryClient();
  return useMutation(
    ({ BroadcastMessageId }) => deleteBroadCastMessage(BroadcastMessageId),
    {
      onSuccess: () =>
        queryClient.invalidateQueries("/BroadcastMessage/allMessages"),
    }
  );
}

export async function sendBroadCastMessage(data) {
  const response = await axios.post(
    `${baseUrl}/BroadcastMessage/sendNotificationEmail`,
    data
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data.message;
}
export function useSendBroadCastMessagMutation() {
  const queryClient = useQueryClient();
  return useMutation((data) => sendBroadCastMessage(data), {
    onSuccess: () =>
      queryClient.invalidateQueries("/BroadcastMessage/allMessages"),
  });
}

export async function getAllOfficeOwners(pageNumber, pageSize, searchTerm) {
  const response = await axios.get(`${baseUrl}/BroadcastMessage/allOwners`, {
    params: {
      pageNumber,
      pageSize,
      searchTerm,
    },
  });

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return {
    items: response.data.data,
    totalCount: response.data.pagination.totalItems,
  };
}

export function useAllOfficeOwners(pageNumber, pageSize, searchTerm) {
  return useQuery(
    ["/BroadcastMessage/allOwners", pageNumber, pageSize, searchTerm],
    () => getAllOfficeOwners(pageNumber, pageSize, searchTerm)
  );
}

export async function saveMessage(data) {
  const response = await axios.post(`${baseUrl}/BroadcastMessage`, data);
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data.data;
}

export function useSaveMessageMutation() {
  const queryClient = useQueryClient();
  return useMutation((data) => saveMessage(data), {
    onSuccess: () =>
      queryClient.invalidateQueries("/BroadcastMessage/allMessages"),
  });
}

export async function getAllSelectedOwners(
  pageNumber,
  pageSize,
  broadcastMessageId
) {
  const response = await axios.get(
    `${baseUrl}/BroadcastMessage/allSelectedOwners`,
    {
      params: {
        pageNumber,
        pageSize,
        broadcastMessageId,
      },
    }
  );

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return {
    items: response.data.data,
    totalCount: response.data.pagination.totalItems,
  };
}

export function useAllSelectedOwners(pageNumber, pageSize, broadcastMessageId) {
  return useQuery(
    ["/BroadcastMessage/allOwners", pageNumber, pageSize, broadcastMessageId],
    () => getAllSelectedOwners(pageNumber, pageSize, broadcastMessageId)
  );
}
