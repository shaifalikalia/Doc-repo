import axios from "axios";
import { useQuery } from "react-query";
import { Config } from "./../config";

const subscriptionMicroserviceBaseUrl = Config.serviceUrls.subscriptionBaseUrl;

export async function getInvoiceEntries(accountOwnerId, pageNumber, pageSize) {
  const response = await axios.get(
    `${subscriptionMicroserviceBaseUrl}/Invoice/entries`,
    {
      params: {
        UserId: accountOwnerId,
        pageNumber,
        pageSize,
      },
    }
  );

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data;
}

export function useInvoiceEntries(accountOwnerId, pageNumber, pageSize) {
  return useQuery(
    ["invoiceEntries", accountOwnerId, pageNumber, pageSize],
    () => getInvoiceEntries(accountOwnerId, pageNumber, pageSize)
  );
}
