import { useEffect } from "react";
import { handleError } from "utils";

const useHandleApiError = (isLoading, isFetching, error) => {
  useEffect(() => {
    if (!isLoading && !isFetching && error) {
      handleError(error);
    }
  }, [error]);
};

export default useHandleApiError;
