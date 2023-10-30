import axios from "axios";
import { useQuery } from "react-query";
import { Config } from "./../config";

const performanceReviewBaseUrl = Config.serviceUrls.performanceReviewBaseUrl;
const userBaseUrl = Config.serviceUrls.userBaseUrl;

export async function getPerformanceReviews(officeId, userId) {
  const response = await axios.get(
    `${performanceReviewBaseUrl}/PerformanceReviewForm/PerformanceReview`,
    {
      params: {
        officeId,
        userId,
        pageNumber: 1,
        pageSize: 100,
      },
    }
  );

  return response.data;
}

export async function getHourlyRates(userId, officeId, pageNumber, pageSize) {
  const response = await axios.get(`${userBaseUrl}/User/HourlyRateHistory`, {
    params: {
      userId,
      officeId,
      pageNumber,
      pageSize,
    },
  });

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data;
}

export function useHourlyRates(userId, officeId, pageNumber, pageSize) {
  return useQuery(
    ["getHourlyRates", userId, officeId, pageNumber, pageSize],
    () => getHourlyRates(userId, officeId, pageNumber, pageSize)
  );
}
