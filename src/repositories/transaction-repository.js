import axios from "axios";
import { useQuery } from "react-query";
import { Config } from "../config";

const subscriptionMicroserviceBaseUrl = Config.serviceUrls.subscriptionBaseUrl;

export async function getTransactions(
  accountOwnerId,
  limit,
  nextPage,
  transactionId
) {
  var response = await axios.get(
    `${subscriptionMicroserviceBaseUrl}/Transaction`,
    {
      params: {
        userId: accountOwnerId,
        limit,
        nextPage,
        transactionId,
      },
    }
  );

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data;
}

export function useTransactions(
  accountOwnerId,
  limit,
  nextPage,
  transactionId
) {
  return useQuery(
    ["transactions", accountOwnerId, limit, nextPage, transactionId],
    () => getTransactions(accountOwnerId, limit, nextPage, transactionId)
  );
}
