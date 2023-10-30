import { useLocation } from "react-router";
import qs from "query-string";

export default function usePageNumber() {
  const { search } = useLocation();
  let { pageNumber } = qs.parse(search);

  if (pageNumber === undefined || isNaN(pageNumber) || pageNumber <= 0) {
    return 1;
  }

  return parseInt(pageNumber);
}
