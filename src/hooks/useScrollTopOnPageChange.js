import { useEffect } from "react";

const useScrollTopOnPageChange = (pageNumber) => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
    });
  }, [pageNumber]);
};

export default useScrollTopOnPageChange;
