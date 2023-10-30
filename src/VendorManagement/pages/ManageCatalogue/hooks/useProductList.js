import useRemoveCache from "hooks/useRemoveCache";
import useScrollTopOnPageChange from "hooks/useScrollTopOnPageChange";
import { debounce } from "lodash";
import { useCallback, useState, useEffect, useMemo } from "react";
import {
  useGetProductList,
  importProductCsv,
  downloadCsv,
} from "repositories/vendor-repository";
import { handleError, inBytes, handleSuccess, testRegexCheck } from "utils";
import constants from "../../../../constants";
import useUploadService from "hooks/useUploadService";
import toast from "react-hot-toast";
import { getSastoken } from "repositories/contract-repository";
import {
  AnonymousCredential,
  BlobServiceClient,
  newPipeline,
} from "@azure/storage-blob";
import { useSelector } from "react-redux";

const pageSize = 3;

const useProductList = ({ t }) => {
  const IMAGE_SIZE = 5;
  const [productList, setProductList] = useState([]);
  const [totalProducts, setTotalProducts] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const containerName = "inventoryassets";
  let id = useSelector((e) => e.userProfile.profile.aadUserId);
  const containerNameForImages = `inventoryassets/${id}`;

  const [isLoader, setIsLoader] = useState(false);
  const [imageFiles, setimageFiles] = useState({
    isOpen: false,
  });

  let cacheData = sessionStorage.getItem(constants.vendor.cache.catalogueList);
  cacheData = cacheData ? JSON.parse(cacheData) : {};

  const [currentPage, setCurrentPage] = useState(cacheData.currentPage || 1);
  const [apiSearchTerm, setApiSearchTerm] = useState(
    cacheData.apiSearchTerm || ""
  );
  const [searchTerm, setSearchTerm] = useState(cacheData.apiSearchTerm || "");

  const {
    isLoading,
    isFetching,
    data: catalogueData,
    error,
    refetch,
  } = useGetProductList(pageSize, currentPage, apiSearchTerm, {
    cacheTime: 0,
  });
  useScrollTopOnPageChange(currentPage);
  const { uploading, upload: uploadImage } = useUploadService();

  useEffect(() => {
    if (!isLoading && !isFetching && error) {
      handleError(error);
    }
  }, [error]);

  useEffect(() => {
    if (catalogueData) {
      setProductList(catalogueData.data);
      setTotalPages(catalogueData?.pagination?.totalPages);
      setTotalProducts(catalogueData?.pagination?.totalItems);
    }
  }, [catalogueData, isFetching]);

  const handlePageNumber = (page) => {
    setCurrentPage(page);
  };

  const handleApiSearchTerm = useCallback(
    debounce(
      (value) => {
        setApiSearchTerm(value);
        setCurrentPage(1);
      },
      1000,
      { trailing: true }
    ),
    []
  );

  const handleSearchTerm = (e) => {
    const value = e.target.value;
    if (!testRegexCheck(value)) return;
    setSearchTerm(value);
    handleApiSearchTerm(value.trim());
  };

  //cache the details
  useEffect(() => {
    const cacheData = JSON.stringify({
      currentPage,
      apiSearchTerm,
    });
    sessionStorage.setItem(constants.vendor.cache.catalogueList, cacheData);
  }, [currentPage, apiSearchTerm]);

  useRemoveCache(
    [
      constants.routes.vendor.catalogueDetail,
      constants.routes.vendor.addNewItem,
    ],
    constants.vendor.cache.catalogueList
  );

  useEffect(() => {
    //This is used wthen last itme of any page is deleted so that we can
    // automatically fallback to previous page.
    if (currentPage > 1 && catalogueData && !catalogueData.data?.length) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [currentPage, catalogueData]);

  const uploadCsv = async (event) => {
    try {
      const file = event.target.files?.[0];
      let fileTypeAllow = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
        "text/csv",
      ];

      if (!file || !fileTypeAllow.includes(file?.type)) {
        toast.error(t("fileNotSupported"));
        return;
      }
      setIsLoader(true);
      const [err, blobData] = await uploadImage(file, containerName);
      const csvUrl = blobData?.blobUrl;
      if (err) {
        throw new Error(err);
      }
      if (!csvUrl) return;
      let response = await importProductCsv(csvUrl);
      handleSuccess(response?.message);
      if (currentPage === 1) {
        refetch();
      } else {
        setCurrentPage(1);
      }
    } catch (err) {
      toast.error(err.message, {
        duration: 4000,
      });
    }
    setIsLoader(false);
  };

  const downloadExampleCsv = async () => {
    setIsLoader(true);
    try {
      let res = await downloadCsv();
      res?.file_Url && window.open(res.file_Url, "_self");
    } catch (err) {
      handleError(err);
    }
    setIsLoader(false);
  };

  const uploadFiles = async (file, nameOfContainer, sasToken) => {
    const accountName = `${process.env.REACT_APP_AZURE_STORAGE_ACCOUNT}`;
    const sasString = sasToken;
    const pipeline = newPipeline(new AnonymousCredential());
    const blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net?${sasString}`,
      pipeline
    );

    const containerClient =
      blobServiceClient.getContainerClient(nameOfContainer);
    let blobName = file.name;
    const fileExtenstion = file.name.split(".").pop();
    blobName = blobName.replace(fileExtenstion, fileExtenstion.toLowerCase());

    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const blobOptions = {
      blobHTTPHeaders: { blobContentType: file.type },
    };

    const uploadBlobResponse = await blockBlobClient.uploadBrowserData(
      file,
      blobOptions
    );
    if (
      uploadBlobResponse._response.status === 201 ||
      uploadBlobResponse._response.status === 200
    ) {
      const url = uploadBlobResponse._response.request.url;
      const blobUrl = url?.split("?")?.[0];
      const blobNameApi = blobUrl?.split(`${nameOfContainer}/`)?.[1];
      return { blobUrl, blobNameApi };
    }
  };

  const uploadImages = async (event) => {
    setIsLoader(true);
    try {
      let objectOfFiles = event.target.files;
      let arrayOfFiles = [];
      let errorImages = [];
      let successfully = true;
      let fileSupportedFormat = ["image/png", "image/jpg", "image/jpeg"];

      // Loop for check image should not be more than 5MB
      for (const file in objectOfFiles) {
        if (
          typeof objectOfFiles[file] === "object" &&
          (objectOfFiles[file]?.size > inBytes(IMAGE_SIZE) ||
            !fileSupportedFormat.includes(objectOfFiles[file]?.type))
        ) {
          errorImages.push({
            file: objectOfFiles[file],
            status: "rejected",
            fileName: objectOfFiles[file]?.name,
          });
        }
        if (
          typeof objectOfFiles[file] === "object" &&
          objectOfFiles[file]?.size < inBytes(IMAGE_SIZE) &&
          fileSupportedFormat.includes(objectOfFiles[file]?.type)
        ) {
          arrayOfFiles.push(objectOfFiles[file]);
        }
      }

      if (arrayOfFiles?.length + errorImages?.length > 500)
        throw new Error(t("vendorManagement.maximumImages"));

      if (arrayOfFiles?.length) {
        const sasToken = await getSastoken();
        const uploadPromises = arrayOfFiles.map((file) => {
          return uploadFiles(file, containerNameForImages, sasToken);
        });

        await Promise.allSettled(uploadPromises).then((result) => {
          if (Array.isArray(result)) {
            result.forEach((item, index) => {
              if (item.status === "rejected") {
                successfully = false;
                setimageFiles({
                  files: [
                    ...errorImages.map((list) => list.file),
                    ...arrayOfFiles,
                  ],
                  result: [...errorImages, ...result],
                  isOpen: true,
                });
              }
              if (item.status !== "rejected" && errorImages?.length) {
                successfully = false;
                setimageFiles({
                  files: [...errorImages.map((list) => list.file)],
                  result: [...errorImages],
                  isOpen: true,
                });
              }
            });
          }
        });
      } else {
        successfully = false;
        setimageFiles({
          files: errorImages.map((item) => item.file),
          result: [...errorImages],
          isOpen: true,
        });
      }
      if (currentPage === 1) {
        refetch();
      } else {
        setCurrentPage(1);
      }
      setProductList([]);
      setTotalPages(1);
      setTotalProducts(null);

      if (successfully) {
        handleSuccess("Upload successfully");
      }
    } catch (err) {
      toast.error(err.message, {
        duration: 3000,
      });
    }
    setIsLoader(false);
  };

  let arrayOFErrorFiles = useMemo(() => {
    let errorsFileandMsg = [];
    if (imageFiles?.files && imageFiles?.result) {
      imageFiles?.result.forEach((item, index) => {
        if (item.status === "rejected") {
          errorsFileandMsg.push({
            status: item.status,
            reason: item.reason,
            fileName: imageFiles?.files[index].name,
          });
        }
      });
    }
    return errorsFileandMsg;
  }, [imageFiles]);

  return {
    state: {
      productList,
      totalPages,
      currentPage,
      apiSearchTerm,
      searchTerm,
      totalProducts,
      imageFiles,
      arrayOfUnUploadedImages: arrayOFErrorFiles,
    },
    otherData: {
      loading: isLoading || isFetching || uploading || isLoader,
      pageSize,
    },
    methods: {
      handlePageNumber,
      handleSearchTerm,
      refetch,
      uploadCsv,
      downloadExampleCsv,
      uploadImages,
      closeModel: () => {
        setimageFiles({ isOpen: false });
      },
    },
  };
};

export default useProductList;
