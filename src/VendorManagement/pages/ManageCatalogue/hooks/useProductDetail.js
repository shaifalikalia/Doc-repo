import useQueryParam from "hooks/useQueryParam";
import { useHistory } from "react-router-dom";
import { useGetProductDetails } from "repositories/vendor-repository";
import { decodeId, encodeId } from "utils";
import constants from "../../../../constants";
import useHandleApiError from "hooks/useHandleApiError";
import qs from "query-string";
import { useEffect } from "react";

const useProductDetail = () => {
  const history = useHistory();
  let id = useQueryParam("id", null);
  if (id) {
    id = decodeId(id);
  }

  useEffect(() => {
    if (!id) {
      history.push(constants.routes.vendor.manageCatalogue);
    }
  }, []);

  const {
    isLoading,
    isFetching,
    data: productDetail,
    error,
    refetch,
  } = useGetProductDetails(id, { enabled: !!id });
  useHandleApiError(isLoading, isFetching, error);

  const onBack = () => {
    history.push(constants.routes.vendor.manageCatalogue);
  };

  const handleEditClick = (e, from) => {
    e.stopPropagation();
    if (from) {
      sessionStorage.setItem(constants.vendor.cache.editingValue, from);
    }
    history.push({
      pathname: constants.routes.vendor.addNewItem,
      search: qs.stringify({
        isEdit: true,
        id: encodeId(id),
      }),
    });
  };

  return {
    otherData: {
      productDetail: productDetail || {},
      loading: isLoading || isFetching,
      history,
    },
    methods: {
      onBack,
      refetch,
      handleEditClick,
    },
  };
};

export default useProductDetail;
