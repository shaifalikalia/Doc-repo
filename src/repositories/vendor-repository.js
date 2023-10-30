import axios from "axios";
import { useQuery, useMutation } from "react-query";
import { Config } from "../config";

const vendorManagementBaseUrl = Config.serviceUrls.vendorManagementBaseUrl;
const userBaseUrl = Config.serviceUrls.userBaseUrl;
const subscriptionBaseUrl = Config.serviceUrls.subscriptionBaseUrl;
const customerOrderBaseUrl = Config.serviceUrls.customerOrderBaseUrl;
const promocodesBaseUrl = Config.serviceUrls.promocodesBaseUrl;
const promotionBaseUrl = Config.serviceUrls.promotionBaseUrl;

export const addProduct = async (payload) => {
  const response = await axios.post(
    `${vendorManagementBaseUrl}/VendorCatalogue/AddCatalogue`,
    payload
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

export const useAddProduct = () => {
  return useMutation(addProduct);
};

export const getProductList = async (PageSize, PageNumber, SearchTerm) => {
  const response = await axios.get(
    `${vendorManagementBaseUrl}/VendorCatalogue/CatalogueList`,
    {
      params: {
        PageSize,
        PageNumber,
        SearchTerm,
      },
    }
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;
};

export const useGetProductList = (
  PageSize,
  PageNumber,
  SearchTerm,
  options = {}
) => {
  return useQuery(
    ["product-list", PageSize, PageNumber, SearchTerm],
    () => getProductList(PageSize, PageNumber, SearchTerm),
    options
  );
};

export const getProductDetails = async (CatalogueId) => {
  const response = await axios.get(
    `${vendorManagementBaseUrl}/VendorCatalogue/Catalogue`,
    {
      params: {
        CatalogueId,
      },
    }
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

export const useGetProductDetails = (CatalogueId, options = {}) => {
  return useQuery(
    ["product-details", CatalogueId],
    () => getProductDetails(CatalogueId),
    options
  );
};

export const inviteSalesRep = async (payload) => {
  const response = await axios.post(
    `${userBaseUrl}/User/InviteSalesRepresentative`,
    payload
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;
};

export const useInviteSalesRepMutation = () => {
  return useMutation(inviteSalesRep);
};

export const getSalesRepList = async (PageSize, PageNumber, SearchByName) => {
  const response = await axios.get(
    `${vendorManagementBaseUrl}/Vendor/GetSalesRep`,
    {
      params: {
        PageSize,
        PageNumber,
        SearchByName,
      },
    }
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;
};

export const useGetSalesRepList = (
  PageSize,
  PageNumber,
  SearchByName,
  options = {}
) => {
  return useQuery(
    ["sales-rep-list", PageSize, PageNumber, SearchByName],
    () => getSalesRepList(PageSize, PageNumber, SearchByName),
    options
  );
};

export const vendorSetUp = async (payload) => {
  const response = await axios.post(
    `${vendorManagementBaseUrl}/Vendor`,
    payload
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;
};

export const updateVendorProfile = async (payload) => {
  const response = await axios.put(
    `${vendorManagementBaseUrl}/Vendor`,
    payload
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;
};

export const updateProductDetails = async (body) => {
  const response = await axios.put(
    `${vendorManagementBaseUrl}/VendorCatalogue/Catalogue`,
    body
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

export const useUpdateProduct = () => {
  return useMutation(updateProductDetails);
};

export const getStripeClientSecret = async () => {
  const response = await axios.get(`${subscriptionBaseUrl}/Card`);
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

export const useGetStripeClientSecret = (options = {}) => {
  return useQuery(["stripe-client-secret"], getStripeClientSecret, options);
};

export const addVendorCardDetails = async (payload) => {
  const response = await axios.post(
    `${subscriptionBaseUrl}/Card/VendorCard`,
    payload
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

export const useAddVendorCardDetails = () => {
  return useMutation(addVendorCardDetails);
};

export const getCardList = async () => {
  const response = await axios.get(`${subscriptionBaseUrl}/Card/list`);
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

export const useGetCardList = (options = {}) => {
  return useQuery(["stripe-card-list"], getCardList, options);
};

export const getSalesRepDetails = async (SalesRepresentativeId) => {
  const response = await axios.get(
    `${vendorManagementBaseUrl}/SalesRepresentative/GetById`,
    {
      params: {
        SalesRepresentativeId,
      },
    }
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

export const useGetSalesRepDetails = (id, options = {}) => {
  return useQuery(
    ["sales-rep-details", id],
    () => getSalesRepDetails(id),
    options
  );
};

export const getOfficeList = async (params) => {
  const response = await axios.get(
    `${vendorManagementBaseUrl}/SalesRepresentative/OfficeList`,
    { params }
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;
};

export const useGetOfficeList = (
  SalesRepresentativeId,
  PageNumber,
  SearchByName,
  PageSize,
  options = {}
) => {
  return useQuery(
    [
      "sales-rep-office-list",
      SalesRepresentativeId,
      PageNumber,
      SearchByName,
      PageSize,
    ],
    () =>
      getOfficeList({
        SalesRepresentativeId,
        PageNumber,
        SearchByName,
        PageSize,
      }),
    options
  );
};

const getOrdersList = async ({
  pageNumber,
  pageSize,
  from,
  to,
  searchText,
  status,
  IsBillMeLaterAndUnPaid,
}) => {
  const response = await axios.get(
    `${customerOrderBaseUrl}/VendorOrder/List?pageNumber=${pageNumber}&pageSize=${pageSize}&from=${from}&to=${to}&searchTerm=${searchText}&Status=${status}&IsBillMeLaterAndUnPaid=${IsBillMeLaterAndUnPaid}`
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;
};

export const useGetOrderList = (
  pageNumber,
  pageSize,
  from,
  to,
  searchText,
  status,
  IsBillMeLaterAndUnPaid,
  options = {}
) => {
  return useQuery(
    [
      "vendor-get-order-list",
      pageNumber,
      pageSize,
      from,
      to,
      searchText,
      IsBillMeLaterAndUnPaid,
    ],
    () =>
      getOrdersList({
        pageNumber,
        pageSize,
        from,
        to,
        searchText,
        status,
        IsBillMeLaterAndUnPaid,
      }),
    options
  );
};

export const updateOrderStatus = async (params = {}) => {
  const response = await axios.put(
    `${customerOrderBaseUrl}/VendorOrder/UpdateStatus`,
    params
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;
};

const getOrdersDetails = async ({ orderId }) => {
  const response = await axios.get(
    `${customerOrderBaseUrl}/VendorOrder/${orderId}`
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;
};
export const useGetOrderDetail = (orderId, options = {}) => {
  return useQuery(
    ["vendor-get-order-detail", orderId],
    () => getOrdersDetails({ orderId }),
    options
  );
};

export const getOrderDetailsByStatus = async (VendorOrderId, Status) => {
  let paramsObj = {
    VendorOrderId,
    IsNewShipment: true,
  };
  if (Status !== true) {
    delete paramsObj.IsNewShipment;
    paramsObj.Status = Status;
  }

  const response = await axios.get(
    `${customerOrderBaseUrl}/VendorOrder/DetailByStatus`,
    {
      params: paramsObj,
    }
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

export const useGetOrderDetailsByStatus = (
  VendorOrderId,
  Status,
  options = {}
) => {
  return useQuery(
    ["vendor-order-details-by-status", VendorOrderId, Status],
    () => getOrderDetailsByStatus(VendorOrderId, Status),
    options
  );
};

export const assignOffices = async (body) => {
  const response = await axios.post(
    `${vendorManagementBaseUrl}/SalesRepresentative/AssignOffice`,
    body
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

export const useAssignOffices = () => {
  return useMutation(assignOffices);
};

export const updateProductAvailability = async ({
  CatalogueId,
  IsAvailable,
}) => {
  const response = await axios.patch(
    `${vendorManagementBaseUrl}/VendorCatalogue`,
    null,
    {
      params: {
        CatalogueId,
        IsAvailable,
      },
    }
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

export const useUpdateProductAvailability = () => {
  return useMutation(updateProductAvailability);
};

export const deleteProduct = async ({ CatalogueId }) => {
  const response = await axios.delete(
    `${vendorManagementBaseUrl}/VendorCatalogue`,
    {
      params: {
        CatalogueId,
      },
    }
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

export const useDeleteProduct = () => {
  return useMutation(deleteProduct);
};

//Promocodes Apis
export const getCustomersList = async (PageNumber, PageSize, SearchTerm) => {
  const response = await axios.get(`${promocodesBaseUrl}/PromoCode/Customers`, {
    params: {
      PageNumber,
      PageSize,
      SearchTerm,
    },
  });
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;
};

export const useGetCustomersList = (
  PageNumber,
  PageSize,
  SearchTerm,
  options = {}
) => {
  return useQuery(
    ["promocodes-customer-list", PageNumber, PageSize, SearchTerm],
    () => getCustomersList(PageNumber, PageSize, SearchTerm),
    options
  );
};

export const generatePromocode = async () => {
  const response = await axios.get(`${promocodesBaseUrl}/PromoCode`);
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

export const getLaunchedPromocodes = async (PageNumber, PageSize) => {
  const response = await axios.get(`${promocodesBaseUrl}/PromoCode/Launched`, {
    params: {
      PageNumber,
      PageSize,
    },
  });
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;
};

export const useGetLaunchedPromocodes = (
  PageNumber,
  PageSize,
  options = {}
) => {
  return useQuery(
    ["launched-promocodes", PageNumber, PageSize],
    () => getLaunchedPromocodes(PageNumber, PageSize),
    options
  );
};

export const getExpiredPromocodes = async (PageNumber, PageSize) => {
  const response = await axios.get(`${promocodesBaseUrl}/PromoCode/Expired`, {
    params: {
      PageNumber,
      PageSize,
    },
  });
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;
};

export const useGetExpiredPromocodes = (PageNumber, PageSize, options = {}) => {
  return useQuery(
    ["expired-promocodes", PageNumber, PageSize],
    () => getExpiredPromocodes(PageNumber, PageSize),
    options
  );
};

export const addPromocode = async (body) => {
  const response = await axios.post(`${promocodesBaseUrl}/PromoCode`, body);
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

export const useAddPromocode = () => {
  return useMutation(addPromocode);
};

export const updateSalesRepStatus = async ({
  SalesRepresentativeId,
  IsActive,
}) => {
  const response = await axios.patch(
    `${vendorManagementBaseUrl}/SalesRepresentative/ActiveStatus`,
    null,
    {
      params: {
        SalesRepresentativeId,
        IsActive,
      },
    }
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

export const useUpdateSalesRepStatus = () => {
  return useMutation(updateSalesRepStatus);
};

export const deleteAssignedOffice = async ({
  SalesRepresentativeId,
  OfficeId,
}) => {
  const response = await axios.delete(
    `${vendorManagementBaseUrl}/SalesRepresentative/DeleteAssignedOffice`,
    {
      params: {
        SalesRepresentativeId,
        OfficeId,
      },
    }
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

export const useDeleteAssignedOffice = () => {
  return useMutation(deleteAssignedOffice);
};

export const updateSalesRep = async (body) => {
  const response = await axios.put(
    `${vendorManagementBaseUrl}/SalesRepresentative`,
    body
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

export const useUpdateSalesRep = () => {
  return useMutation(updateSalesRep);
};

const getVendorCards = async (body) => {
  const response = await axios.get(
    `${subscriptionBaseUrl}/Card/vendorAssignments`,
    body
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

export const useVendorCards = (options = {}) => {
  return useQuery(["Vendor_Cards"], () => getVendorCards(), options);
};

export const getManageCustomerList = async (
  PageNumber,
  PageSize,
  SearchTerm,
  BillMeLater
) => {
  const params = { PageNumber, PageSize, SearchTerm, BillMeLater };
  const response = await axios.get(
    `${vendorManagementBaseUrl}/Vendor/CustomerList`,
    {
      params,
    }
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;
};

export const useGetManageCustomerList = (
  PageNumber,
  PageSize,
  SearchTerm,
  BillMeLater,
  options = {}
) => {
  return useQuery(
    [
      "manage-customer-customer-list",
      PageNumber,
      PageSize,
      SearchTerm,
      BillMeLater,
    ],
    () => getManageCustomerList(PageNumber, PageSize, SearchTerm, BillMeLater),
    options
  );
};

export const getOrderListByCustomer = async (
  OfficeId,
  PageNumber,
  PageSize,
  StartDate,
  EndDate,
  PaymentStatus,
  PaymentMethod,
  Status,
  CustomerUserId
) => {
  const body = {
    OfficeId,
    PageNumber,
    PageSize,
    StartDate,
    EndDate,
    PaymentStatus,
    PaymentMethod,
    Status,
    CustomerUserId,
  };
  const response = await axios.post(
    `${customerOrderBaseUrl}/VendorOrder/OrderList`,
    body
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;
};

export const useGetOrderListByCustomer = (
  OfficeId,
  PageNumber,
  PageSize,
  StartDate,
  EndDate,
  PaymentStatus,
  PaymentMethod,
  Status,
  CustomerUserId,
  options = {}
) => {
  return useQuery(
    [
      "order-list-by-customer",
      OfficeId,
      PageNumber,
      PageSize,
      StartDate,
      EndDate,
      PaymentStatus,
      PaymentMethod,
      Status,
      CustomerUserId,
    ],
    () =>
      getOrderListByCustomer(
        OfficeId,
        PageNumber,
        PageSize,
        StartDate,
        EndDate,
        PaymentStatus,
        PaymentMethod,
        Status,
        CustomerUserId
      ),
    options
  );
};

export const getCustomerOfficeByOfficeId = async (OfficeId) => {
  const response = await axios.get(
    `${vendorManagementBaseUrl}/Vendor/${OfficeId}/CustomerOffice`
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

export const useGetCustomerOfficeByOfficeId = (OfficeId, options = {}) => {
  return useQuery(
    ["customer-office-by-office-id", OfficeId],
    () => getCustomerOfficeByOfficeId(OfficeId),
    options
  );
};

export const updateCustomerDetails = async ({
  OfficeId,
  BillMeLater,
  VipCustomer,
  TotalBillMeLaterLimit,
}) => {
  const body = { OfficeId, BillMeLater, VipCustomer, TotalBillMeLaterLimit };
  const response = await axios.put(
    `${vendorManagementBaseUrl}/Vendor/EditBillMeLater`,
    body
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

export const useUpdateCustomerDetails = () => {
  return useMutation(updateCustomerDetails);
};

export const getOfficeCustomerList = async (OfficeId, PageNumber, PageSize) => {
  const params = { OfficeId, PageNumber, PageSize };
  const response = await axios.get(
    `${vendorManagementBaseUrl}/Vendor/OfficeCustomer`,
    {
      params,
    }
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;
};

export const useGetOfficeCustomerList = (
  OfficeId,
  PageNumber,
  PageSize,
  options = {}
) => {
  return useQuery(
    ["office-customer-list", OfficeId, PageNumber, PageSize],
    () => getOfficeCustomerList(OfficeId, PageNumber, PageSize),
    options
  );
};

export const inviteCustomer = async ({ EmailId, FirstName, LastName }) => {
  const body = { EmailId, FirstName, LastName };
  const response = await axios.post(
    `${vendorManagementBaseUrl}/Vendor/InviteCustomer`,
    body
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

export const useInviteCustomerMutation = () => {
  return useMutation(inviteCustomer);
};

export const sendPromocodeToCustomers = async (promoCodeId) => {
  const response = await axios.get(
    `${promocodesBaseUrl}/PromoCode/Send/${promoCodeId}`
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

export const useSendPromocodeToCustomers = () => {
  return useMutation(sendPromocodeToCustomers);
};

export const addPaymentMode = async ({
  VendorOrderId,
  BillMeLaterModeOfPayment,
}) => {
  const response = await axios.put(
    `${customerOrderBaseUrl}/VendorOrder/PaymentStatus?VendorOrderId=${VendorOrderId}&BillMeLaterModeOfPayment=${BillMeLaterModeOfPayment}`
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;
};

const getPromotions = async (PageNumber, PageSize, isExpired) => {
  const response = await axios.get(
    `${promotionBaseUrl}/VendorPromotion/List?PageNumber=${PageNumber}&PageSize=${PageSize}&IsExpired=${isExpired}`
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;
};

export const useGetPromotionList = (
  PageNumber,
  PageSize,
  isExpired,
  options = {}
) => {
  return useQuery(
    ["vendor-Promotions-list", PageNumber, PageSize, isExpired],
    () => getPromotions(PageNumber, PageSize, isExpired),
    options
  );
};

export const addPromotions = async (params) => {
  const response = await axios.post(
    `${promotionBaseUrl}/VendorPromotion`,
    params
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;
};

const GetPromotionDetail = async (VendorPromotionId) => {
  const response = await axios.get(
    `${promotionBaseUrl}/VendorPromotion/${VendorPromotionId}`
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;
};

export const useGetPromotionDetail = (VendorPromotionId, options = {}) => {
  return useQuery(
    ["vendor-Promotions-Details", VendorPromotionId],
    () => GetPromotionDetail(VendorPromotionId),
    options
  );
};

const GetPromotionDashboardDetail = async (startDate, endDate) => {
  const response = await axios.get(
    `${customerOrderBaseUrl}/VendorOrder/Dashboard?StartDate=${startDate}&EndDate=${endDate}`
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;
};

export const useToGetDashBoardData = (startDate, endDate, options = {}) => {
  return useQuery(
    ["vendor-Dashboard-Details", startDate, endDate],
    () => GetPromotionDashboardDetail(startDate, endDate),
    options
  );
};

export const importProductCsv = async (url) => {
  const response = await axios.get(
    `${vendorManagementBaseUrl}/VendorCatalogue/Import?fileUrl=${url}`
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;
};

export const downloadCsv = async () => {
  const response = await axios.get(
    `${vendorManagementBaseUrl}/VendorCatalogue/Export`
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

export const generateInvoiceVendorOrders = async (body) => {
  const response = await axios.post(
    `${customerOrderBaseUrl}/VendorOrder/GenerateInvoice`,
    body
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;
};

export const generatePdfVendorOrders = async (body) => {
  const response = await axios.post(
    `${customerOrderBaseUrl}/VendorOrder/GeneratePdf`,
    body
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;
};

export const getVendorInvoices = async (
  pageSize,
  pageNumber,
  searchText,
  status
) => {
  const response = await axios.get(
    `${customerOrderBaseUrl}/VendorOrder/InvoiceList`,
    {
      params: {
        PageNumber: pageNumber,
        PageSize: pageSize,
        SearchTerm: searchText,
        PaymentMethod: status,
      },
    }
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;
};

export const useToGetInvoice = (
  pageSize,
  pageNumber,
  searchText,
  status,
  options = {}
) => {
  return useQuery(
    ["Vendor_Order_Invoices", pageNumber, searchText, status],
    () => getVendorInvoices(pageSize, pageNumber, searchText, status),
    options
  );
};

export const getNewShipmentList = async (pageSize, pageNumber, orderId) => {
  const response = await axios.get(
    `${customerOrderBaseUrl}/VendorOrder/ShippedProducts`,
    {
      params: {
        PageNumber: pageNumber,
        PageSize: pageSize,
        VendorOrderId: orderId,
      },
    }
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;
};

export const useToGetNewShipmentList = (
  pageSize,
  pageNumber,
  orderId,
  options = {}
) => {
  return useQuery(
    ["Vendor_SHIPMENT_LIST", pageSize, pageNumber, orderId],
    () => getNewShipmentList(pageSize, pageNumber, orderId),
    options
  );
};

export const exportOrderDetails = async (orderId, VendorOrderShipmentId) => {
  let path = `/VendorOrder/ShipmentPdf?VendorOrderId=${orderId}`;
  if (VendorOrderShipmentId) {
    path = `/VendorOrder/ShipmentPdf?VendorOrderId=${orderId}&VendorOrderShipmentId=${VendorOrderShipmentId}`;
  }
  const response = await axios.get(`${customerOrderBaseUrl}${path}`);
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;
};

export const addNewShipment = async (body) => {
  const response = await axios.post(
    `${customerOrderBaseUrl}/VendorOrder/NewShipment`,
    body
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;
};
