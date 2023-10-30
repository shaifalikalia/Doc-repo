import { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash";
import toast from "react-hot-toast";
import { getProvinceList } from "repositories/office-repository";
import { useGetTaxes } from "repositories/admin-vendor-repository";
import usePageNumber from "hooks/usePageNumber";
import { useHistory } from "react-router-dom";
import constants from "../../../../constants";
import useSearchText from "hooks/useSearchText";

const useTaxmanagment = ({ t }) => {
  const [showTaxManagmentPopup, setShowTaxManagmentPopup] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [taxDetails, setTaxDetails] = useState({});
  const [isEditTaxDetails, setisEditTaxDetails] = useState({});
  const [provienceList, setProvienceList] = useState([]);
  const canadaCode = 1;
  const PageSize = 3;
  const pageNumber = usePageNumber();
  const searchQueryText = useSearchText();
  const [searchText, setSearchText] = useState(null);
  const history = useHistory();
  const {
    data,
    error: errorMessage,
    isLoading: showLoader,
    refetch,
  } = useGetTaxes(PageSize, pageNumber, searchQueryText);

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage.message);
    }
  }, [errorMessage]);

  useEffect(() => {
    if (
      (showTaxManagmentPopup || isEditTaxDetails?.id) &&
      !provienceList?.length
    ) {
      getProviences();
    }
  }, [showTaxManagmentPopup, isEditTaxDetails, provienceList]);

  useEffect(() => {
    searchText !== null && searchHandle(searchText);
  }, [searchText]);

  const searchHandle = useCallback(
    debounce((searchValue) => {
      let updatedPageNumber = 1;
      updatePage(updatedPageNumber, searchValue);
    }, 1000),
    []
  );

  const getProviences = async () => {
    setisLoading(true);
    try {
      let res = await getProvinceList(canadaCode);
      if (res?.length) {
        setProvienceList(res);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setisLoading(false);
  };

  const toogleAddTaxPopUp = () => {
    setShowTaxManagmentPopup(true);
  };

  const closePopUp = () => {
    setShowTaxManagmentPopup(false);
    setisEditTaxDetails({});
  };

  const getTaxDetails = (details) => {
    setTaxDetails(details);
  };

  const optimisedSearch = (event) => {
    setSearchText(event.target.value);
  };

  const isRefetch = (isEdit = false) => {
    if (!isEdit && pageNumber !== 1) {
      updatePage(1);
    } else {
      refetch();
    }

    closePopUp();
    setTaxDetails({});
  };

  const updatePage = (page, searchValue) => {
    let queryParams = `pageNumber=${page}`;
    if (searchText || searchValue) {
      queryParams = `pageNumber=${page}&searchText=${
        searchValue ? searchValue : searchText
      }`;
    }

    history.push({
      pathname: constants.routes.superAdmin.tax,
      search: queryParams,
    });
  };

  return {
    toogleAddTaxPopUp,
    showTaxManagmentPopup,
    isRefetch,
    setPageNumber: updatePage,
    pageNumber,
    pageSize: PageSize,
    totalItems: data?.pagination?.totalItems || 1,
    getTaxDetails: getTaxDetails,
    taxDetails: taxDetails,
    showLoader: isLoading || showLoader,
    provienceList: provienceList,
    taxListing: data?.data || [],
    optimisedSearch,
    searchTextInput: searchText !== null ? searchText : searchQueryText,
    isEditTaxDetails,
    closePopUp,
    setisEditTaxDetails,
  };
};

export default useTaxmanagment;
