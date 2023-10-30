import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Config } from "../config";

const baseUrl = Config.serviceUrls.officeBaseUrl;

export async function getIPs(officeId) {
  const response = await axios.get(`${baseUrl}/TimesheetPreference/IPList`, {
    params: {
      officeId,
    },
  });

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data.data;
}

export function useIPs(officeId) {
  return useQuery(["IPList", officeId], () => getIPs(officeId));
}

export async function addIP(name, address, officeId) {
  const response = await axios.post(`${baseUrl}/TimesheetPreference/IP`, {
    name,
    ip: address,
    officeId,
  });

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data.message;
}

export function useAddIPMutation() {
  const queryClient = useQueryClient();
  return useMutation(
    ({ name, address, officeId }) => addIP(name, address, officeId),
    {
      onSuccess: (data, variables) =>
        queryClient.invalidateQueries(["IPList", variables.officeId]),
    }
  );
}

export async function updateIP(id, name, address, officeId) {
  const response = await axios.put(
    `${baseUrl}/TimesheetPreference/IP`,
    {},
    {
      params: {
        ipId: id,
        name,
        ip: address,
        officeId,
      },
    }
  );

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data.message;
}

export function useUpdateIPMutation() {
  const queryClient = useQueryClient();
  return useMutation(
    ({ id, name, address, officeId }) => updateIP(id, name, address, officeId),
    {
      onSuccess: (data, variables) =>
        queryClient.invalidateQueries(["IPList", variables.officeId]),
    }
  );
}

export async function deleteIP(id, officeId) {
  const response = await axios.delete(`${baseUrl}/TimesheetPreference/IP`, {
    params: {
      officeId,
      ipId: id,
    },
  });

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data.message;
}

export function useDeleteIPMutation() {
  const queryClient = useQueryClient();
  return useMutation(({ id, officeId }) => deleteIP(id, officeId), {
    onSuccess: (data, variables) =>
      queryClient.invalidateQueries(["IPList", variables.officeId]),
  });
}

export async function updateIPActiveStatus(id, officeId, newStatus) {
  const response = await axios.patch(
    `${baseUrl}/TimesheetPreference/UpdateIPActiveStatus`,
    {},
    {
      params: {
        officeId,
        ipId: id,
        isActive: newStatus,
      },
    }
  );

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data.message;
}

export function useUpdateIPActiveStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation(
    ({ id, officeId, newStatus }) =>
      updateIPActiveStatus(id, officeId, newStatus),
    {
      onSuccess: (data, variables) =>
        queryClient.invalidateQueries(["IPList", variables.officeId]),
    }
  );
}
