import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Config } from "../config";

const baseUrl = Config.serviceUrls.contractBaseUrl;
const OFFICE_POINT_URL = Config.serviceUrls.officeBaseUrl;
const UTILITY_POINT_URL = Config.serviceUrls.utilityBaseUrl;
const CMS_POINT_URL = Config.serviceUrls.cmsBaseUrl;

export async function getContracts(officeId, pageNumber, pageSize) {
  const response = await axios.get(`${baseUrl}/Contract`, {
    params: {
      officeId,
      pageNumber,
      pageSize,
    },
  });

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return { items: response.data.data, pagination: response.data.pagination };
}

export function useContracts(officeId, pageNumber, pageSize) {
  return useQuery(["/Contract", officeId, pageNumber, pageSize], () =>
    getContracts(officeId, pageNumber, pageSize)
  );
}

export async function getStaffContracts(staffId, pageNumber, pageSize) {
  const response = await axios.get(`${baseUrl}/Contract/byStaff`, {
    params: {
      staffId,
      pageNumber,
      pageSize,
    },
  });

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return { items: response.data.data, pagination: response.data.pagination };
}

export function useStaffContracts(staffId, pageNumber, pageSize) {
  return useQuery(["/Contract/byStaff", staffId, pageNumber, pageSize], () =>
    getStaffContracts(staffId, pageNumber, pageSize)
  );
}

export async function getStaffMembers(
  officeId,
  searchTerm,
  pageNumber,
  pageSize
) {
  const response = await axios.post(`${OFFICE_POINT_URL}/Staff`, {
    officeId,
    searchTerm,
    pageNumber,
    pageSize,
  });

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return { items: response.data.data, pagination: response.data.pagination };
}

export function useStaffMembers(officeId, searchTerm, pageNumber, pageSize) {
  return useQuery(["/Staff", officeId, pageNumber, pageSize], () =>
    getStaffMembers(officeId, searchTerm, pageNumber, pageSize)
  );
}

export async function getSastoken() {
  const response = await axios.get(
    `${UTILITY_POINT_URL}/Utility/Account/Token`
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data.data.token;
}

export function useSastoken() {
  return useQuery(["/Token"], () => getSastoken());
}

export async function uploadContract(data) {
  const response = await axios.post(`${baseUrl}/Contract`, data);

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data.data;
}

export function useUploadContractMutation() {
  const queryClient = useQueryClient();
  return useMutation((data) => uploadContract(data), {
    onSuccess: (data, variables) =>
      queryClient.invalidateQueries(["Contract", variables.officeId]),
  });
}

export async function getContractTemplate(data) {
  const response = await axios.get(`${baseUrl}/Contract/Template`, {
    params: {
      officeId: data.officeId,
      isSavedTemplate: data.isSavedTemplate,
      templateType: data.designationType,
    },
  });

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data.data;
}

export function useGetContractTemplateMutation() {
  const queryClient = useQueryClient();
  return useMutation((data) => getContractTemplate(data), {
    onSuccess: (data, variables) =>
      queryClient.invalidateQueries(["Contract/Template", variables.officeId]),
  });
}
export async function getOfficeContracts(officeId, pageNumber, pageSize) {
  const response = await axios.get(`${baseUrl}/Contract`, {
    params: {
      officeId,
      pageNumber,
      pageSize,
    },
  });

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return { items: response.data.data, pagination: response.data.pagination };
}

export function useOfficeContracts(officeId, pageNumber, pageSize) {
  return useQuery(["/Contract", officeId, pageNumber, pageSize], () =>
    getOfficeContracts(officeId, pageNumber, pageSize)
  );
}

export async function deleteContract(contractId) {
  const response = await axios.delete(`${baseUrl}/Contract/${contractId}`);
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data.message;
}

export function useDeleteContractMutation() {
  const queryClient = useQueryClient();
  return useMutation(({ contractId }) => deleteContract(contractId), {
    onSuccess: (data, variables) =>
      queryClient.invalidateQueries(["Contract", variables.officeId]),
  });
}

export async function getTermsAndConditions(contentId) {
  const response = await axios.get(`${CMS_POINT_URL}/Cms/${contentId}`);

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data.data;
}

export async function sendFaqEmail(params) {
  const response = await axios.post(`${CMS_POINT_URL}/Cms/FAQEmail`, params);

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data;
}

export function useTermsAndConditions(contentId) {
  return useQuery(["/Cms"], () => getTermsAndConditions(contentId));
}

export async function getContractTemplateById(ContractId) {
  const response = await axios.get(`${baseUrl}/Contract/${ContractId}`);

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data.data;
}

export function useContractTemplateById(ContractId, options = {}) {
  return useQuery(
    ["/Contract/ContractId", ContractId],
    () => getContractTemplateById(ContractId),
    options
  );
}

export async function editContract(data) {
  const response = await axios.put(`${baseUrl}/Contract`, data);

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data.data;
}

export function useEditContractMutation() {
  const queryClient = useQueryClient();
  return useMutation((data) => editContract(data), {
    onSuccess: (data, variables) =>
      queryClient.invalidateQueries(["Contract", variables.officeId]),
  });
}

export async function getContractTemplatePdf(contractId) {
  const response = await axios.get(`${baseUrl}/Contract/${contractId}/Pdf?`);

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data.data;
}

export async function acceptContract(data) {
  const response = await axios.patch(
    `${baseUrl}/Contract/acceptContract?contractId=${data.contractId}&staffYoursTruly=${data.staffYoursTruly}&staffName=${data.staffName}&signature=${data.signature}&acceptedDate=${data.acceptedDate}`
  );

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data.data;
}

export function useAcceptContractMutation() {
  const queryClient = useQueryClient();
  return useMutation((data) => acceptContract(data), {
    onSuccess: (data, variables) =>
      queryClient.invalidateQueries([
        "Contract/acceptContract",
        variables.officeId,
      ]),
  });
}

export async function saveContractTemplate(data) {
  const response = await axios.post(`${baseUrl}/Contract/saveTemplate`, data);

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data.data;
}

export function useContractTemplateMutation() {
  const queryClient = useQueryClient();
  return useMutation((data) => saveContractTemplate(data), {
    onSuccess: (data, variables) =>
      queryClient.invalidateQueries([
        "Contract/saveTemplate",
        variables.officeId,
      ]),
  });
}
