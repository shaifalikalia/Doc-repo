import { useLocation } from "react-router";
import qs from "query-string";

export default function useTabIndex() {
  const { search } = useLocation();
  const tab = parseInt(qs.parse(search).tab);

  return isNaN(tab) ? 1 : tab;
}
