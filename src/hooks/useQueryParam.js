import { useLocation } from "react-router";
import qs from "query-string";

export default function useQueryParam(paramName, defaultValue = null) {
  const location = useLocation();
  const query = qs.parse(location.search);

  if (!query || !query[paramName]) {
    return defaultValue;
  }

  return query[paramName];
}
