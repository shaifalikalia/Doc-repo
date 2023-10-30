import { useEffect } from "react";
import { matchPath, useHistory } from "react-router-dom";

const useRemoveCache = (locations, cacheKey) => {
  const history = useHistory();
  useEffect(() => {
    //This useEffect is used to remove the session storage keys only when they move to next location
    // that is not peresent in locations from current.
    const unregister = history.block((location) => {
      if (!matchPath(location.pathname, locations)) {
        sessionStorage.removeItem(cacheKey);
      }
      return true;
    });

    return unregister;
  }, []);
};

export default useRemoveCache;
