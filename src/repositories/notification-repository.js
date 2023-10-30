import axios from "axios";
import { useQuery } from "react-query";
import { Config } from "../config";

const notificationsBaseUrl = Config.serviceUrls.notificationsBaseUrl;

const getNotifications = async ({ queryKey }) => {
  const [, pageSize, pageNumber, withData] = queryKey;
  const params = { pageSize, pageNumber, withData };
  const axiosRes = await axios.get(
    `${notificationsBaseUrl}/Notification/getWebNotifications`,
    { params }
  );
  const apiRes = axiosRes.data;
  if (apiRes.statusCode !== 200) {
    throw new Error(apiRes.message);
  }
  return apiRes;
};

export const useGetNotifications = (pageSize, pageNumber, withData = true) => {
  return useQuery(
    ["notifications", pageSize, pageNumber, withData],
    getNotifications,
    {
      refetchOnWindowFocus: true,
      staleTime: 2000,
    }
  );
};
