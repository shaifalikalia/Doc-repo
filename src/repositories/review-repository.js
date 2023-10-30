import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Config } from "./../config";

const baseUrl = Config.serviceUrls.patientSchedulingBaseUrl;

export async function getReviews(pageNumber, pageSize, activeStatus = null) {
  const response = await axios.get(`${baseUrl}/Review`, {
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
    items: response.data.data,
    totalCount: response.data.pagination.totalItems,
  };
}

export function useReviews(pageNumber, pageSize, activeStatus = null) {
  return useQuery(["/Review", pageNumber, pageSize, activeStatus], () =>
    getReviews(pageNumber, pageSize, activeStatus)
  );
}

export async function getPatients(pageNumber, pageSize, searchTerm) {
  const response = await axios.get(`${baseUrl}/Review/patients`, {
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
  return useQuery(["/Review/patients", pageNumber, pageSize, searchTerm], () =>
    getPatients(pageNumber, pageSize, searchTerm)
  );
}

export async function getDoctors(pageNumber, pageSize, searchTerm) {
  const response = await axios.get(`${baseUrl}/Review/doctors`, {
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

export function useDoctors(pageNumber, pageSize, searchTerm) {
  return useQuery(["/Review/doctors", pageNumber, pageSize, searchTerm], () =>
    getDoctors(pageNumber, pageSize, searchTerm)
  );
}

export async function updateReviewActiveStatus(appointmentId, status) {
  const response = await axios.patch(`${baseUrl}/Review`, {
    appointmentId,
    isApproved: status,
  });

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data.message;
}

export function useUpdateReviewActiveStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation(
    ({ appointmentId, status }) =>
      updateReviewActiveStatus(appointmentId, status),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("/Review");
        queryClient.invalidateQueries("/Review/byPatient");
        queryClient.invalidateQueries("/Review/byDoctor");
      },
    }
  );
}

export async function getReviewsByPatient(
  patientId,
  pageNumber,
  pageSize,
  activeStatus
) {
  const response = await axios.get(`${baseUrl}/Review/byPatient`, {
    params: {
      patientId,
      pageNumber,
      pageSize,
      approvedStatus: activeStatus,
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

export function useReviewsByPatient(
  patientId,
  pageNumber,
  pageSize,
  activeStatus
) {
  return useQuery(
    ["/Review/byPatient", patientId, pageNumber, pageSize, activeStatus],
    () => getReviewsByPatient(patientId, pageNumber, pageSize, activeStatus)
  );
}

export async function getReviewsByDoctor(
  doctorId,
  pageNumber,
  pageSize,
  activeStatus
) {
  const response = await axios.get(`${baseUrl}/Review/byDoctor`, {
    params: {
      doctorId,
      pageNumber,
      pageSize,
      approvedStatus: activeStatus,
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

export function useReviewsByDoctor(
  doctorId,
  pageNumber,
  pageSize,
  activeStatus
) {
  return useQuery(
    ["/Review/byDoctor", doctorId, pageNumber, pageSize, activeStatus],
    () => getReviewsByDoctor(doctorId, pageNumber, pageSize, activeStatus)
  );
}

export async function getReviewsForDoctor(
  doctorId,
  officeId,
  pageNumber,
  pageSize
) {
  const response = await axios.get(
    `${baseUrl.replace("/api/v1", "")}/common/ReviewForDoctor`,
    {
      params: {
        doctorId,
        officeId,
        pageNumber,
        pageSize,
      },
    }
  );

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return {
    items: response.data.data,
    totalItems: response.data.pagination.totalItems,
  };
}

export function useReviewsForDoctor(doctorId, officeId, pageNumber, pageSize) {
  return useQuery(
    ["/common/ReviewForDoctor", doctorId, officeId, pageNumber, pageSize],
    () => getReviewsForDoctor(doctorId, officeId, pageNumber, pageSize)
  );
}
