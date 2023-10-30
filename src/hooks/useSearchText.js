import { useLocation } from "react-router";
import qs from "query-string";

export default function useSearchText() {
  const { search } = useLocation();
  let { searchText } = qs.parse(search);

  return searchText ? searchText : "";
}
