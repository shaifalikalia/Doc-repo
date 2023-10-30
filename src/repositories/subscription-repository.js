import axios from "axios";
import { useQuery } from "react-query";
import { Config } from "./../config";

const subscriptionMicroserviceBaseUrl = Config.serviceUrls.subscriptionBaseUrl;
const { cmsBaseUrl } = Config.serviceUrls;

export async function getSubscriptionDetail(accountOwnerId) {
  const response = await axios.get(
    `${subscriptionMicroserviceBaseUrl}/Package/subscriptionDetail/${accountOwnerId}`
  );
  return response.data;
}

export function useSubscriptionDetail(accountOwnerId) {
  let x = useQuery(["subscriptionDetail", accountOwnerId], () =>
    getSubscriptionDetail(accountOwnerId)
  );
  return x;
}

export async function editSubscriptionprices(
  OwnerId,
  PerOfficeCharge,
  PerPermanentMemberCharge,
  PerTemporaryMemberCharge,
  PerPlacementCharge,
  SetUpFeeCharge
) {
  const response = await axios.put(
    `${subscriptionMicroserviceBaseUrl}/Package/UserSubscriptionPrice`,
    {
      OwnerId,
      PerOfficeCharge,
      PerPermanentMemberCharge,
      PerTemporaryMemberCharge,
      PerPlacementCharge,
      SetUpFeeCharge,
    }
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;
}

export async function getAddDetailsLink(body) {
  const response = await axios.post(
    `${subscriptionMicroserviceBaseUrl}/Card/CreateStripeConnectAccountAndLoginLink`,
    body
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;
}

export const listofSubscriptionPlan = async (subscriptionId, isForVendor) => {
  const response = await axios.get(
    `${subscriptionMicroserviceBaseUrl}/Package/ListBySubscriptionPlan?SubscriptionPlan=${subscriptionId}`,
    {
      params: {
        IsForVendor: isForVendor,
      },
    }
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

export const useToGetListOfSubscription = (
  subscriptionId,
  isForVendor = false,
  options = {}
) => {
  return useQuery(
    ["LIST_OF_SUBSCRIPTION_PLANS", subscriptionId],
    () => listofSubscriptionPlan(subscriptionId, isForVendor),
    options
  );
};

export const getSubscriptionFeature = async (subscriptionId) => {
  const response = await axios.get(
    `${subscriptionMicroserviceBaseUrl}/SubscriptionFeature/List`
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

export const useToGetSubscriptionFeature = (options = {}) => {
  return useQuery(
    ["LIST_OF_SUBSCRIPTION_FEATURE"],
    () => getSubscriptionFeature(),
    options
  );
};

export async function updateSubscriptionFeature(body) {
  const response = await axios.post(
    `${subscriptionMicroserviceBaseUrl}/SubscriptionFeature`,
    body
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;
}

export async function updateSubscriptionPlan(body) {
  const response = await axios.put(
    `${subscriptionMicroserviceBaseUrl}/Package`,
    body
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;
}

const listofSubscriptionPlanAvaliable = async () => {
  const response = await axios.get(`${cmsBaseUrl}/Package`);
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

export const useToGetListOfSubscriptionAvaliable = (options = {}) => {
  return useQuery(
    ["LIST_OF_SUBSCRIPTION_PLANS_AVALIABLE"],
    () => listofSubscriptionPlanAvaliable(),
    options
  );
};

const listofSubscriptionPlanFeatures = async () => {
  const response = await axios.get(`${cmsBaseUrl}/Package/FeatureList`);
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

export const useToGetListOfSubscriptionFeatures = (options = {}) => {
  return useQuery(
    ["LIST_OF_SUBSCRIPTION_PLANS_Features"],
    () => listofSubscriptionPlanFeatures(),
    options
  );
};

const listofSubscriptionPlanFeaturesOfOwner = async (ownerId) => {
  const response = await axios.get(
    `${subscriptionMicroserviceBaseUrl}/SubscriptionFeature/ForUser?ownerId=${ownerId}`
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

export const useToGetListOfSubscriptionFeaturesOfOwner = (
  ownerId,
  options = {}
) => {
  return useQuery(
    ["LIST_OF_SUBSCRIPTION_PLANS_Features_OF_ADMIN"],
    () => listofSubscriptionPlanFeaturesOfOwner(ownerId),
    options
  );
};

export const extendTrialDate = async (params) => {
  const response = await axios.post(
    `${subscriptionMicroserviceBaseUrl}/Package/ExtendTrial`,
    params
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;
};

export const addPackageSubscription = async (payload) => {
  let response = await axios.post(
    `${subscriptionMicroserviceBaseUrl}/Package/subscribe`,
    payload
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;
};

const listOfModules = async (ownerId) => {
  let response = await axios.get(
    `${subscriptionMicroserviceBaseUrl}/SubscriptionFeature/ForUser?userId=${ownerId}`
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

export const useToGetSubsModuleAccess = (ownerId, options = {}) => {
  return useQuery(
    ["MODULE_ACESS_OWNER", ownerId],
    () => listOfModules(ownerId),
    options
  );
};

const getSubValidDate = async () => {
  let response = await axios.get(
    `${subscriptionMicroserviceBaseUrl}/Package/subscribedSince`
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

export const useToGetSubsValid = (options = {}) => {
  return useQuery(
    ["SUBSCRIPTION_TILL_VALID"],
    () => getSubValidDate(),
    options
  );
};

export const cancelSubscription = async (payload) => {
  let response = await axios.post(
    `${subscriptionMicroserviceBaseUrl}/Package/cancelSubscription`,
    payload
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;
};

export const updateEnterPrice = async (payload) => {
  let response = await axios.put(
    `${subscriptionMicroserviceBaseUrl}/Package`,
    payload
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;
};

export const addEnterPrice = async (payload) => {
  let response = await axios.post(
    `${subscriptionMicroserviceBaseUrl}/Package`,
    payload
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;
};

const getVendorEnterPrise = async (searchTerm, pageNumber, PAGE_SIZE) => {
  let response = await axios.get(
    `${subscriptionMicroserviceBaseUrl}/Package/list`,
    {
      params: {
        searchTerm,
        pageSize: PAGE_SIZE,
        pageNumber,
        IsVendor: true,
        isPaginated: true,
        type: "enterprise",
      },
    }
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;
};

export const useVendorEnterPriseList = (
  searchTerm,
  pageNumber,
  PAGE_SIZE,
  options = {}
) => {
  return useQuery(
    ["SUBSCRIPTION_VENDOR_ENTERPRISE", searchTerm, pageNumber],
    () => getVendorEnterPrise(searchTerm, pageNumber, PAGE_SIZE),
    options
  );
};

export const editEnterPriceVendor = async (payload) => {
  let response = await axios.put(
    `${subscriptionMicroserviceBaseUrl}/Package/UpdateVendorPackage`,
    payload
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;
};

const vendorSubPlans = async () => {
  let response = await axios.get(
    `${subscriptionMicroserviceBaseUrl}/Package/vendoravailable`
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;
};

export const useVendorSubscriptionPackages = (options = {}) => {
  return useQuery(
    ["VENDOR_SUBSCRIPTION_PLAN"],
    () => vendorSubPlans(),
    options
  );
};

export const buyVendorSubscription = async (payload) => {
  let response = await axios.post(
    `${subscriptionMicroserviceBaseUrl}/Package/vendorSubscribe`,
    payload
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;
};

export const assignEnterPrise = async (payload) => {
  let response = await axios.post(
    `${subscriptionMicroserviceBaseUrl}/Association`,
    payload
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;
};

export const editAssignEnterPrise = async (payload) => {
  let response = await axios.put(
    `${subscriptionMicroserviceBaseUrl}/Association`,
    payload
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;
};

const vendorAssigneesPlans = async (arg) => {
  const { pageSize, pageNumber, packageId } = arg;
  let response = await axios.get(
    `${subscriptionMicroserviceBaseUrl}/Association`,
    {
      params: {
        pageSize,
        pageNumber,
        packageId,
        IsForVendor: true,
      },
    }
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;
};

export const useVendorAssignees = (
  pageSize,
  pageNumber,
  packageId,
  options = {}
) => {
  return useQuery(
    ["VENDOR_ENTERPRISES_ASSIGNEES", pageSize, pageNumber, packageId],
    () => vendorAssigneesPlans({ pageSize, pageNumber, packageId }),
    options
  );
};

export const vendorSubDetails = async (vendorId) => {
  let response = await axios.get(
    `${subscriptionMicroserviceBaseUrl}/Package/vendorSubscriptionDetail/${vendorId}`
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;
};

export const useGetVendorSubDetails = (vendorId, options = {}) => {
  return useQuery(
    ["VENDOR_SUBSCRIPTION DETAILS"],
    () => vendorSubDetails(vendorId),
    options
  );
};

export const terminateVendorSub = async () => {
  let response = await axios.post(
    `${subscriptionMicroserviceBaseUrl}/Package/terminateVendorSubscription`
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;
};

export const extendTrialVendorDate = async (params) => {
  const response = await axios.post(
    `${subscriptionMicroserviceBaseUrl}/Package/ExtendVendorTrial`,
    params
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;
};

export const updateVendorSubscription = async (params) => {
  const response = await axios.put(
    `${subscriptionMicroserviceBaseUrl}/Package/VendorSubscriptionPrice`,
    params
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;
};

export const checkNotificationAccesibility = async (officeId) => {
  let response = await axios.get(
    `${subscriptionMicroserviceBaseUrl}/SubscriptionFeature/ForUser?officeId=${officeId}`
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response?.data?.data;
};
