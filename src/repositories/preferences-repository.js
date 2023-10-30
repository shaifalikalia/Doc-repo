import axios from "axios";
import { useMutation } from "react-query";
import { useDispatch } from "react-redux";
import { Config } from "../config";

const userMicroserviceBaseUrl = Config.serviceUrls.userBaseUrl;

export async function updateShowInSearchResult(value) {
  const response = await axios.put(
    `${userMicroserviceBaseUrl}/User/ShowInSearch/${value}`
  );

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data.message;
}

export function useUpdateShowInSearchResultMutation() {
  const dispatch = useDispatch();
  return useMutation((value) => updateShowInSearchResult(value), {
    onSuccess: (data, variables) => {
      dispatch({
        type: "UPDATE_SHOW_IN_SEARCH_RESULT",
        payload: { value: variables },
      });
    },
  });
}
