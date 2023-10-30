import {
  AnonymousCredential,
  BlobServiceClient,
  newPipeline,
} from "@azure/storage-blob";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import { getSastoken } from "repositories/contract-repository";

const useUploadService = () => {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const upload = async (file, containerName, onSuccess, onError) => {
    setUploading(true);
    try {
      const sasToken = await getSastoken();
      const accountName = `${process.env.REACT_APP_AZURE_STORAGE_ACCOUNT}`;
      const sasString = sasToken;
      const pipeline = newPipeline(new AnonymousCredential());
      const fileExtenstion = file.name.split(".").pop();
      const blobServiceClient = new BlobServiceClient(
        `https://${accountName}.blob.core.windows.net?${sasString}`,
        pipeline
      );
      const containerClient =
        blobServiceClient.getContainerClient(containerName);
      const blobName = `${uuidv4()}.${fileExtenstion}`;
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
        const blobName = blobUrl?.split(`${containerName}/`)?.[1];
        onSuccess?.({ blobUrl, blobName });
        // [error, data]
        setUploading(false);
        return [null, { blobUrl, blobName }];
      }
      setUploading(false);
    } catch (error) {
      onError?.(error);
      // [error, data]
      setUploading(false);
      return [error, null];
    }
  };

  const deleteBlob = async (blobName, containerName, onSuccess, onError) => {
    setDeleting(true);
    try {
      const sasToken = await getSastoken();
      const accountName = `${process.env.REACT_APP_AZURE_STORAGE_ACCOUNT}`;
      const sasString = sasToken;
      const pipeline = newPipeline(new AnonymousCredential());
      const blobServiceClient = new BlobServiceClient(
        `https://${accountName}.blob.core.windows.net?${sasString}`,
        pipeline
      );
      const containerClient =
        blobServiceClient.getContainerClient(containerName);
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);
      const res = await blockBlobClient.deleteIfExists({
        deleteSnapshots: "include",
      });
      onSuccess?.(res);
      //return [error, data]
      setDeleting(false);
      return [null, res];
    } catch (error) {
      onError?.(error);
      //return [error, data]
      setDeleting(false);
      return [error, null];
    }
  };
  return {
    uploading,
    deleting,
    upload,
    delete: deleteBlob,
  };
};

export default useUploadService;
