import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import constants from "../../../../constants";
import {
  addCategory,
  useCategory,
  updateCategory,
  updateCategoryStatus,
} from "repositories/admin-vendor-repository";
import { debounce } from "lodash";
import usePageNumber from "hooks/usePageNumber";
import useSearchText from "hooks/useSearchText";
import { useHistory } from "react-router-dom";

export const useCategories = () => {
  const [editCategory, setEditCategory] = useState({ open: false });
  const [changeCategory, setChangeCategory] = useState({ open: false });
  const [isLoading, setisLoading] = useState(false);
  const PageSize = 5;
  const history = useHistory();
  const pageNumber = usePageNumber();
  const searchQueryText = useSearchText();
  const [searchText, setSearchText] = useState(null);
  const {
    data,
    error: errorMessage,
    isLoading: showLoader,
    refetch,
  } = useCategory(PageSize, pageNumber, searchQueryText);

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage.message);
    }
  }, [errorMessage]);

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

  const closePopUp = () => {
    setEditCategory({ open: false });
  };

  const openPopUp = (details = {}) => {
    setEditCategory({ open: true, ...details });
  };

  const submitCategory = async (type, name) => {
    setisLoading(true);
    try {
      let response = "";
      if (constants.categoryType.add === type) {
        response = await addCategory({ CategoryName: name?.trim() });
        if (pageNumber === 1) {
          refetch();
        }
        updatePage(1);
      } else {
        response = await updateCategory({
          CategoryName: name?.trim(),
          categoryId: editCategory.id,
        });
        refetch();
        updatePage(pageNumber);
      }

      toast.success(response?.message);
      closePopUp();
    } catch (error) {
      toast.error(error.message);
    }
    setisLoading(false);
  };

  const optimisedSearch = (event) => {
    setSearchText(event.target.value);
  };

  const updatePage = (page, searchValue) => {
    let queryParams = `pageNumber=${page}`;
    if (searchText || searchValue) {
      queryParams = `pageNumber=${page}&searchText=${
        searchValue ? searchValue : searchText
      }`;
    }
    history.push({
      pathname: constants.routes.superAdmin.categories,
      search: queryParams,
    });
  };

  const actiDecCategory = async () => {
    setisLoading(true);
    try {
      let response = await updateCategoryStatus({
        categoryId: changeCategory.id,
        isActive: !changeCategory.isActive,
      });
      refetch();
      setChangeCategory({ open: false });
      toast.success(response?.message);
    } catch (error) {
      toast.error(error?.message);
    }
    setisLoading(false);
  };

  return {
    editCategoryDetails: editCategory,
    categoryListing: data?.data || [],
    showLoader: isLoading || showLoader,
    pageNumber,
    pageSize: PageSize,
    totalItems: data?.pagination?.totalItems || 1,
    showCategoryPopup: editCategory?.open,
    searchTextInput: searchText !== null ? searchText : searchQueryText,
    changeCategory: changeCategory,
    optimisedSearch,
    submitCategory,
    closePopUp,
    openPopUp,
    setPageNumber: updatePage,
    setChangeCategory: setChangeCategory,
    actiDecCategory: actiDecCategory,
  };
};
