import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Config } from "./../config";

const utilityMicroserviceBaseUrl = Config.serviceUrls.utilityBaseUrl;
const patientSchedulingBaseUrl = Config.serviceUrls.patientSchedulingBaseUrl;

export async function getSpecialties(pageNumber, pageSize) {
  const response = await axios.get(`${utilityMicroserviceBaseUrl}/Speciality`, {
    params: {
      pageNumber,
      pageSize,
    },
  });

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return { data: response.data.data, pagination: response.data.pagination };
}

export function useSpecialties(pageNumber, pageSize) {
  return useQuery(["specialties", pageNumber, pageSize], () =>
    getSpecialties(pageNumber, pageSize)
  );
}

export async function addSpecialty(title) {
  const response = await axios.post(
    `${utilityMicroserviceBaseUrl}/Speciality`,
    {
      title,
    }
  );

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data.data;
}

export function useAddSpecialty() {
  const queryClient = useQueryClient();
  return useMutation((title) => addSpecialty(title), {
    onSuccess: () => {
      queryClient.invalidateQueries("specialties");
      queryClient.invalidateQueries("Specialty/forSelection");
    },
  });
}

export async function updateSpecialty(specialtyId, title) {
  const response = await axios.put(`${utilityMicroserviceBaseUrl}/Speciality`, {
    specialityId: specialtyId,
    title,
  });

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data.data;
}

export function useUpdateSpecialtyMutation() {
  const queryClient = useQueryClient();
  return useMutation(
    ({ specialtyId, title }) => updateSpecialty(specialtyId, title),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries("specialties");
        queryClient.invalidateQueries(["specialty", variables.specialtyId]);
      },
    }
  );
}

export async function getSpecialty(specialtyId) {
  const response = await axios.get(
    `${utilityMicroserviceBaseUrl}/Speciality/${specialtyId}`
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data.data;
}

export function useSpecialty(specialtyId) {
  return useQuery(["specialty", specialtyId], () => getSpecialty(specialtyId));
}

export async function updateActiveStatusOfSpecialty(specialtyId, status) {
  const response = await axios.patch(
    `${utilityMicroserviceBaseUrl}/Speciality`,
    {
      specialityId: specialtyId,
      status,
    }
  );

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data.data;
}

export function useUpdateActiveStatusOfSpecialtyMutation() {
  const queryClient = useQueryClient();
  return useMutation(
    ({ specialtyId, status }) =>
      updateActiveStatusOfSpecialty(specialtyId, status),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries("specialties");
        queryClient.invalidateQueries(["specialty", variables.specialtyId]);
      },
    }
  );
}

export async function getSpecialtiesForSelection(pageNumber, pageSize) {
  const response = await axios.get(
    `${utilityMicroserviceBaseUrl}/Speciality/forSelection`,
    {
      params: {
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

export function useSpecialtiesForSelection(pageNumber, pageSize) {
  return useQuery(["Specialty/forSelection", pageNumber, pageSize], () =>
    getSpecialtiesForSelection(pageNumber, pageSize)
  );
}

export async function getUserSpecialties(userId) {
  const response = await axios.get(
    `${utilityMicroserviceBaseUrl.replace(
      "/api/v1",
      ""
    )}/common/SpecialitiesForUser`,
    {
      params: {
        userId,
      },
    }
  );

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data.data;
}

export function useUserSpecialties(userId, options = {}) {
  return useQuery(
    ["common/SpecialitiesForUser", userId],
    () => getUserSpecialties(userId),
    options
  );
}

export async function getCommonSpecialties(pageNumber, pageSize, searchTerm) {
  const response = await axios.get(
    `${utilityMicroserviceBaseUrl.replace(
      "/api/v1",
      ""
    )}/common/GlobalSpecialities`,
    {
      params: {
        pageNumber,
        pageSize,
        searchTerm,
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

export function useCommonSpecialties(pageNumber, pageSize, searchTerm) {
  return useQuery(
    ["/common/GlobalSpecialities", pageNumber, pageSize, searchTerm],
    () => getCommonSpecialties(pageNumber, pageSize, searchTerm)
  );
}

export async function getSpecialtiesByName(searchTerm, pageNumber, pageSize) {
  const response = await axios.get(
    `${patientSchedulingBaseUrl.replace(
      "/api/v1",
      ""
    )}/common/SearchSpecialities`,
    {
      params: {
        searchTerm,
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

export function useSpecialtiesByName(
  searchTerm,
  pageNumber,
  pageSize,
  isEnabled
) {
  return useQuery(
    ["/common/SearchSpecialties", searchTerm, pageNumber, pageSize],
    () => getSpecialtiesByName(searchTerm, pageNumber, pageSize),
    { enabled: isEnabled }
  );
}
