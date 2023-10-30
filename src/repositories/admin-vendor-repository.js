import axios from "axios";
import { useQuery } from "react-query";
import { Config } from "../config";

const {
  taxManagementBaseUrl,
  vendorManagementBaseUrl,
  customerOrderBaseUrl,
  supportHelpdeskBaseUrl,
  promotionBaseUrl,
  subscriptionBaseUrl,
} = Config.serviceUrls;

export const addTaxes = async (params) => {
  let response = await axios.post(`${taxManagementBaseUrl}/Tax/Addtax`, params);
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response?.data;
};

export const updateTaxes = async (params) => {
  let response = await axios.put(`${taxManagementBaseUrl}/Tax/Tax`, params);
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response?.data;
};

const getTaxes = async ({ queryKey }) => {
  const [, pageSize, pageNumber, SearchTerm] = queryKey;
  const params = { pageSize, pageNumber, SearchTerm };
  const axiosRes = await axios.get(`${taxManagementBaseUrl}/Tax/TaxList`, {
    params,
  });
  const apiRes = axiosRes.data;
  if (apiRes.statusCode !== 200) {
    throw new Error(apiRes.message);
  }
  return apiRes;
};

export const useGetTaxes = (pageSize, pageNumber, SearchTerm) => {
  return useQuery(["GET_TAXES", pageSize, pageNumber, SearchTerm], getTaxes);
};

export const addCategory = async (params) => {
  let response = await axios.post(
    `${vendorManagementBaseUrl}/CatalogueCategory/AddCategory`,
    params
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response?.data;
};
export const updateCategory = async (params) => {
  let response = await axios.put(
    `${vendorManagementBaseUrl}/CatalogueCategory/EditCategory`,
    params
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response?.data;
};

export const updateCategoryStatus = async (params) => {
  let response = await axios.patch(
    `${vendorManagementBaseUrl}/CatalogueCategory/ActivateDeactivateCategory`,
    params
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response?.data;
};

const getCategory = async ({ queryKey }) => {
  const [, pageSize, pageNumber, SearchTerm] = queryKey;
  const params = { pageSize, pageNumber, SearchTerm };
  const axiosRes = await axios.get(
    `${vendorManagementBaseUrl}/CatalogueCategory/GetCategory`,
    { params }
  );
  const apiRes = axiosRes.data;
  if (apiRes.statusCode !== 200) {
    throw new Error(apiRes.message);
  }
  return apiRes;
};

export const useCategory = (pageSize, pageNumber, SearchTerm) => {
  return useQuery(
    ["GET_Category", pageSize, pageNumber, SearchTerm],
    getCategory
  );
};

const getVendorList = async (pageSize, pageNumber, Status, searchText) => {
  const axiosRes = await axios.get(
    `${vendorManagementBaseUrl}/Vendor/All?pageNumber=${pageNumber}&pageSize=${pageSize}&status=${Status}&searchTerm=${searchText}`
  );
  const apiRes = axiosRes.data;
  if (apiRes.statusCode !== 200) {
    throw new Error(apiRes.message);
  }
  return apiRes;
};

export const useVendorListing = (pageSize, pageNumber, Status, searchText) => {
  return useQuery(
    ["Get_Vendor_List_Admin", pageSize, pageNumber, Status, searchText],
    () => getVendorList(pageSize, pageNumber, Status, searchText)
  );
};

const getVendorDetail = async (vendorId) => {
  const axiosRes = await axios.get(
    `${vendorManagementBaseUrl}/Vendor?vendorId=${vendorId}`
  );
  const apiRes = axiosRes.data;
  if (apiRes.statusCode !== 200) {
    throw new Error(apiRes.message);
  }
  return apiRes;
};

export const useVendorProfileDetail = (vendorId, options = {}) => {
  return useQuery(
    ["Get_Vendor_Detail_Admin", vendorId],
    () => getVendorDetail(vendorId),
    options
  );
};

const getVendorOrderDetail = async (
  vendorId,
  pageNumber,
  searchText,
  paymentStatus,
  pageSize
) => {
  const axiosRes = await axios.get(
    `${customerOrderBaseUrl}/VendorOrder/ListForSuperAdmin?pageNumber=${pageNumber}&pageSize=${pageSize}&vendorId=${vendorId}&paymentStatus=${paymentStatus}&searchTerm=${searchText}`
  );
  const apiRes = axiosRes.data;

  if (apiRes.statusCode !== 200) {
    throw new Error(apiRes.message);
  }
  return apiRes;
};

export const useVendorOrderDetail = (
  vendorId,
  pageNumber,
  searchText,
  paymentStatus,
  pageSize,
  options = {}
) => {
  return useQuery(
    [
      "Get_Vendor_Order_History",
      vendorId,
      pageNumber,
      searchText,
      paymentStatus,
    ],
    () =>
      getVendorOrderDetail(
        vendorId,
        pageNumber,
        searchText,
        paymentStatus,
        pageSize
      ),
    options
  );
};

const getSalesRepDetails = async (
  pageNumber,
  searchText,
  pageSize,
  vendorId
) => {
  const axiosRes = await axios.get(
    `${vendorManagementBaseUrl}/SalesRepresentative?pageNumber=${pageNumber}&pageSize=${pageSize}&searchTerm=${searchText}&vendorId=${vendorId}`
  );
  const apiRes = axiosRes.data;

  if (apiRes.statusCode !== 200) {
    throw new Error(apiRes.message);
  }
  return apiRes;
};

export const useSalesRepDetails = (
  pageNumber,
  searchText,
  pageSize,
  vendorId,
  options = {}
) => {
  return useQuery(
    ["Get_SALE_REP_History", pageNumber, searchText, vendorId],
    () => getSalesRepDetails(pageNumber, searchText, pageSize, vendorId),
    options
  );
};

const getManageCommissionListing = async (pageNumber, searchText, pageSize) => {
  const axiosRes = await axios.get(
    `${vendorManagementBaseUrl}/Vendor/AdminCommission?pageNumber=${pageNumber}&pageSize=${pageSize}&searchTerm=${searchText}`
  );
  const apiRes = axiosRes.data;
  if (apiRes.statusCode !== 200) {
    throw new Error(apiRes.message);
  }
  return apiRes;
};

export const useManageCommisionListing = (
  pageNumber,
  searchText,
  pageSize,
  options = {}
) => {
  return useQuery(
    ["GET_MANAGE_COMMISON_ADMIN", pageNumber, searchText],
    () => getManageCommissionListing(pageNumber, searchText, pageSize),
    options
  );
};

export const changeCommission = async (params) => {
  const axiosRes = await axios.put(
    `${vendorManagementBaseUrl}/Vendor/AdminCommission`,
    params
  );
  const apiRes = axiosRes.data;
  if (apiRes.statusCode !== 200) {
    throw new Error(apiRes.message);
  }
  return apiRes;
};

export const updateVendorStatus = async (params) => {
  let response = await axios.put(
    `${vendorManagementBaseUrl}/Vendor/Status`,
    params
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response?.data;
};

const getSalesRepDetailsAdmin = async (pageNumber, searchText, pageSize) => {
  const axiosRes = await axios.get(
    `${vendorManagementBaseUrl}/SalesRepresentative?pageNumber=${pageNumber}&pageSize=${pageSize}&searchTerm=${searchText}`
  );
  const apiRes = axiosRes.data;
  if (apiRes.statusCode !== 200) {
    throw new Error(apiRes.message);
  }
  return apiRes;
};

const getSupportHelpListing = async (pageNumber, searchText, pageSize) => {
  const axiosRes = await axios.get(
    `${vendorManagementBaseUrl}/Vendor/AdminCommission?pageNumber=${pageNumber}&pageSize=${pageSize}&searchTerm=${searchText}`
  );
  const apiRes = axiosRes.data;
  if (apiRes.statusCode !== 200) {
    throw new Error(apiRes.message);
  }
  return apiRes;
};

export const useSalesRepDetailsAdmin = (
  pageNumber,
  searchText,
  pageSize,
  options = {}
) => {
  return useQuery(
    ["Get_SALE_REP_History_ADMIN", pageNumber, searchText],
    () => getSalesRepDetailsAdmin(pageNumber, searchText, pageSize),
    options
  );
};

export const useSupportHelpListing = (
  pageSize,
  pageNumber,
  searchText,
  status,
  options = {}
) => {
  return useQuery(
    ["GET_SUPPORT_HELP_VENDOR", pageNumber, searchText, status],
    () => getSupportHelpListing(pageNumber, searchText, pageSize),
    options
  );
};

async function getTicketList(pageNumber, pageSize, Statuses, TicketNo) {
  const response = await axios.post(
    `${supportHelpdeskBaseUrl}/SupportAndHelpDesk/TicketListForUser`,
    {
      pageNumber,
      pageSize,
      Statuses,
      TicketNo,
    }
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return { data: response.data.data, pagination: response.data.pagination };
}

export function useTicketsListVendor(pageNumber, pageSize, Statuses, TicketNo) {
  return useQuery(["tickets", pageNumber, pageSize, Statuses, TicketNo], () =>
    getTicketList(pageNumber, pageSize, Statuses, TicketNo)
  );
}

async function getTicketType() {
  const response = await axios.get(
    `${supportHelpdeskBaseUrl}/SupportAndHelpDesk/TicketType`
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return { data: response.data.data, pagination: response.data.pagination };
}

export function useGetTicketType() {
  return useQuery(["tickets_vendor_type"], () => getTicketType());
}

async function getOrderListForVendorTicket(
  pageSize,
  pageNumber,
  searchTextValue
) {
  const response = await axios.get(
    `${customerOrderBaseUrl}/VendorOrder/AllOrders?PageNumber=${pageNumber}&PageSize=${pageSize}&SearchTerm=${searchTextValue}`
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return { data: response.data.data, pagination: response.data.pagination };
}

export function useGetOrderListVendor(pageSize, pageNumber, searchTextValue) {
  return useQuery(
    ["Order_list_Vendor_TICKET", pageSize, pageNumber, searchTextValue],
    () => getOrderListForVendorTicket(pageSize, pageNumber, searchTextValue)
  );
}

export async function addTicketType(body) {
  const response = await axios.post(
    `${supportHelpdeskBaseUrl}/SupportAndHelpDesk/Ticket`,
    body
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;
}

export const updateSalesRepStatus = async (params = {}) => {
  const { id, isActive } = params;
  let response = await axios.patch(
    `${vendorManagementBaseUrl}/SalesRepresentative/ActiveStatus?SalesRepresentativeId=${id}&IsActive=${isActive}`
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response?.data;
};

const getTopUpPromotions = async (pageNumber, searchText, pageSize, status) => {
  const axiosRes = await axios.get(
    `${promotionBaseUrl}/TopUpPromotion/List?PageNumber=${pageNumber}&PageSize=${pageSize}&SearchTerm=${searchText}&isActive=${status}`
  );
  const apiRes = axiosRes.data;
  if (apiRes.statusCode !== 200) {
    throw new Error(apiRes.message);
  }
  return apiRes;
};

export const useToGetTopUpPromotion = (
  pageSize,
  pageNumber,
  searchText,
  status,
  options = {}
) => {
  return useQuery(
    ["GET_TOP_UP_SUPER_ADMIN", pageNumber, searchText, status],
    () => getTopUpPromotions(pageNumber, searchText, pageSize, status),
    options
  );
};

const getTopUpBalance = async () => {
  const axiosRes = await axios.get(
    `${promotionBaseUrl}/TopUpPromotion/Balance`
  );
  const apiRes = axiosRes.data;
  if (apiRes.statusCode !== 200) {
    throw new Error(apiRes.message);
  }
  return apiRes.data;
};

export const useToGetTopUpBalance = (options = {}) => {
  return useQuery(
    ["GET_TOP_UP_BALANCE_VENDORS"],
    () => getTopUpBalance(),
    options
  );
};

export const addTopUpPromotions = async (body) => {
  const axiosRes = await axios.post(`${promotionBaseUrl}/TopUpPromotion`, body);
  const apiRes = axiosRes.data;
  if (apiRes.statusCode !== 200) {
    throw new Error(apiRes.message);
  }
  return apiRes;
};

export const editTopUpPromotions = async (body) => {
  const axiosRes = await axios.put(`${promotionBaseUrl}/TopUpPromotion`, body);
  const apiRes = axiosRes.data;
  if (apiRes.statusCode !== 200) {
    throw new Error(apiRes.message);
  }
  return apiRes;
};

export const statusChangeTopPromotions = async ({ id, status }) => {
  const axiosRes = await axios.patch(
    `${promotionBaseUrl}/TopUpPromotion/ActiveStatus?TopUpPromotionId=${id}&IsActive=${status}`
  );
  const apiRes = axiosRes.data;
  if (apiRes.statusCode !== 200) {
    throw new Error(apiRes.message);
  }
  return apiRes;
};

const getTopUpHistory = async (pageNumber, pageSize) => {
  const axiosRes = await axios.get(
    `${promotionBaseUrl}/TopUpPromotion/History?PageNumber=${pageNumber}&PageSize=${pageSize}`
  );
  const apiRes = axiosRes.data;
  if (apiRes.statusCode !== 200) {
    throw new Error(apiRes.message);
  }
  return apiRes;
};

export const useToGetTopUpHistory = (pageSize, pageNumber, options = {}) => {
  return useQuery(
    ["GET_TOP_UP_HISTORY", pageNumber],
    () => getTopUpHistory(pageNumber, pageSize),
    options
  );
};

const getPaymentIndent = async (paymentAmount) => {
  const axiosRes = await axios.get(
    `${subscriptionBaseUrl}/Card/StripeCustomerIdAndSecretKeysForMainAccount?AmountInCad=${paymentAmount}`
  );
  const apiRes = axiosRes.data;
  if (apiRes.statusCode !== 200) {
    throw new Error(apiRes.message);
  }
  return apiRes;
};

export const useToGetPaymentIndent = (paymentAmount, options = {}) => {
  return useQuery(
    ["GET_PAYMENT_INDENT", paymentAmount],
    () => getPaymentIndent(paymentAmount),
    options
  );
};

const butTopUp = async (id, paymentIntentId) => {
  const axiosRes = await axios.post(
    `${promotionBaseUrl}/TopUpPromotion/Purchase?TopUpPromotionId=${id}&PaymentIntentId=${paymentIntentId}`
  );
  const apiRes = axiosRes.data;
  if (apiRes.statusCode !== 200) {
    throw new Error(apiRes.message);
  }
  return apiRes;
};

export const useToBuyTopUp = (id, paymentIntentId, options = {}) => {
  return useQuery(
    ["FOR-BUY_PAYMENT", id],
    () => butTopUp(id, paymentIntentId),
    options
  );
};
