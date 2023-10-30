import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Config } from "../config";

const baseUrl = Config.serviceUrls.patientSchedulingBaseUrl;

export async function getPatients(pageNumber, pageSize, searchTerm) {
  const response = await axios.get(`${baseUrl}/Patient/Patients`, {
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

export function usePatients(pageNumber, pageSize, searchTerm) {
  return useQuery(["/Patient/Patients", pageNumber, pageSize, searchTerm], () =>
    getPatients(pageNumber, pageSize, searchTerm)
  );
}

export async function activatePatient(patientId) {
  const response = await axios.put(
    `${baseUrl}/Patient/Activate`,
    {},
    {
      params: {
        patientId,
      },
    }
  );

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data.message;
}

export async function deactivatePatient(patientId) {
  const response = await axios.put(
    `${baseUrl}/Patient/Deactivate`,
    {},
    {
      params: {
        patientId,
      },
    }
  );

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data.message;
}

export function usePatientStatusUpdateMutation() {
  const queryClient = useQueryClient();
  return useMutation(
    ({ patientId, newStatus }) => {
      if (newStatus) {
        return activatePatient(patientId);
      } else {
        return deactivatePatient(patientId);
      }
    },
    { onSuccess: () => queryClient.invalidateQueries(["/Patient/Patients"]) }
  );
}

export const listYourPracticeEmail = async (params) => {
  let response = await axios.post(
    `${baseUrl.replace("/api/v1", "/Common/ListYourPracticeEmail")}`,
    null,
    { params: params }
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;
};
