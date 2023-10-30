import axios from "axios";
import { useQuery } from "react-query";
import { Config } from "../config";

const baseUrl = Config.serviceUrls.utilityBaseUrl.replace("/api/v1", "");
const CMS_POINT_URL = Config.serviceUrls.cmsBaseUrl;
const subscriptionBaseUrl = Config.serviceUrls.subscriptionBaseUrl;

export async function getCountries() {
  const response = await axios.get(`${baseUrl}/Common/Country`);
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data.data;
}

export function useCountries() {
  return useQuery(["/Common/Country"], getCountries);
}

export async function getStates(countryId) {
  const response = await axios.get(`${baseUrl}/Common/Province/${countryId}`);
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data.data;
}

export function useStates(countryId) {
  const isEnabled = !isNaN(countryId);
  return useQuery(["/Common/Province", countryId], () => getStates(countryId), {
    enabled: isEnabled,
  });
}

export async function getCities(stateId) {
  const response = await axios.get(`${baseUrl}/Common/City/${stateId}`);
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data.data;
}

export function useCities(stateId) {
  const isEnabled = !isNaN(stateId);
  return useQuery(["/Common/City", stateId], () => getCities(stateId), {
    enabled: isEnabled,
  });
}

export async function FeedBackAndSuggestionCategoryList() {
  const response = await axios.get(
    `${baseUrl}/api/v1/FeedBackAndSuggestion/CategoryList`
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data.data;
}

export async function addFeedBackAndSuggestions(params) {
  const response = await axios.post(
    `${baseUrl}/api/v1/FeedBackAndSuggestion`,
    params
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data;
}

export async function getListFeedBackAndSuggestions(pageNumber, pageSize) {
  const response = await axios.get(
    `${baseUrl}/api/v1/FeedBackAndSuggestion/List?PageNumber=${pageNumber}&PageSize=${pageSize}`
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data;
}

export async function getDetailFeedBackAndSuggestions(id) {
  const response = await axios.get(
    `${baseUrl}/api/v1/FeedBackAndSuggestion/${id}`
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data;
}

export async function addDemoRequest(payload) {
  const response = await axios.post(`${CMS_POINT_URL}/DemoRequest`, payload);
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data;
}

export async function getCardsList() {
  const response = await axios.get(
    `${subscriptionBaseUrl}/Card/StripeCardList`
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data.data;
}

export function useTogetSavedCards() {
  return useQuery(["/Card/StripeCardList"], () => getCardsList());
}

export async function getUserCardList(pageSize, pageNumber) {
  const response = await axios.get(
    `${subscriptionBaseUrl}/Card/vendorAssignments`,
    {
      params: {
        pageSize,
        pageNumber,
      },
    }
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data.data;
}

export function useToGetManageCards(pageSize, pageNumber) {
  return useQuery(["/Card/StripeCardList"], () =>
    getUserCardList(pageSize, pageNumber)
  );
}
