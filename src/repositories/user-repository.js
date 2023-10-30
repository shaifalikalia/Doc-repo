import axios from "axios";
import { useMutation, useQuery } from "react-query";
import { Config } from "../config";
import { config, parameters, options } from "services/authProvider";
import { MsalAuthProvider } from "react-aad-msal";

const userMicroserviceBaseURL = Config.serviceUrls.userBaseUrl;

export async function getUser(userId) {
  var response = await axios.get(`${userMicroserviceBaseURL}/User/${userId}`);
  return response.data;
}

export function useUser(userId) {
  return useQuery(["user", userId], () => getUser(userId));
}

export async function addLocation(countryId, stateId, cityId, address) {
  var response = await axios.post(
    `${userMicroserviceBaseURL}/User/addLocation`,
    {
      countryId,
      stateId,
      cityId,
      address,
    }
  );

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data.data;
}

export function useAddLocationMutation() {
  return useMutation(({ countryId, stateId, cityId, address }) =>
    addLocation(countryId, stateId, cityId, address)
  );
}

export async function deleteAccount() {
  var response = await axios.delete(
    `${userMicroserviceBaseURL}/User/FreeAccount`
  );

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data.message;
}

export function useDeleteAccountMutation() {
  return useMutation(() => deleteAccount(), {
    onSuccess: () => {
      new MsalAuthProvider(config, parameters, options).logout();
    },
  });
}
