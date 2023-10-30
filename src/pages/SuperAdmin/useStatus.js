import useQueryParam from "hooks/useQueryParam";

export default function useStatus() {
  const status = useQueryParam("status", null);

  if (parseInt(status) === 1) {
    return true;
  } else if (parseInt(status) === 2) {
    return false;
  } else {
    return null;
  }
}
