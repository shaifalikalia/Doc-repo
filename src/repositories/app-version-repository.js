import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Config } from "./../config";

const utilityMicroserviceBaseUrl = Config.serviceUrls.utilityBaseUrl;

export async function getAppVersions(pageNumber, pageSize) {
  const response = await axios.get(`${utilityMicroserviceBaseUrl}/AppVersion`, {
    params: {
      pageNumber,
      pageSize,
    },
  });

  return response.data;
}

export function useAppVersions(pageNumber, pageSize) {
  return useQuery(["appVersions", pageNumber, pageSize], () =>
    getAppVersions(pageNumber, pageSize)
  );
}

export async function getAppVersion(appVersionId) {
  const response = await axios.get(
    `${utilityMicroserviceBaseUrl}/AppVersion/${appVersionId}`
  );
  return response.data;
}

export function useAppVersion(appVersionId) {
  return useQuery(["appVersion", appVersionId], () =>
    getAppVersion(appVersionId)
  );
}

export async function addAppVersion({
  versionNumber,
  appDescription,
  deviceType,
  appType,
  appURL,
  isActive,
  isMandatory,
}) {
  const response = await axios.post(
    `${utilityMicroserviceBaseUrl}/AppVersion`,
    {
      version: versionNumber,
      appDescription,
      deviceType,
      appType,
      appUrl: appURL,
      isMandatory,
      isActive,
    }
  );

  if (response.data.statusCode !== 200) throw new Error(response.data.message);

  return response.data;
}

export function useAddAppVersionMutation() {
  const queryClient = useQueryClient();
  return useMutation((dto) => addAppVersion(dto), {
    onSuccess: () => {
      queryClient.invalidateQueries("appVersions");
    },
  });
}

export async function updateAppVersion({
  appVersionId,
  appDescription,
  versionNumber,
  deviceType,
  appType,
  appURL,
  isActive,
  isMandatory,
}) {
  const response = await axios.put(`${utilityMicroserviceBaseUrl}/AppVersion`, {
    appVersionId,
    appDescription,
    version: versionNumber,
    deviceType,
    appType,
    appUrl: appURL,
    isMandatory,
    isActive,
  });

  if (response.data.statusCode !== 200) throw new Error(response.data.message);

  return response.data;
}

export function useUpdateAppVersionMutation() {
  const queryClient = useQueryClient();
  return useMutation((dto) => updateAppVersion(dto), {
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries("appVersions");
      queryClient.invalidateQueries(["appVersion", variables.appVersionId]);
    },
  });
}
