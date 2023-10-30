import { useState, useEffect } from "react";
import constants, {
  orderStatus,
  paymentMethodStatus,
  paymentStatus,
} from "../../../../constants";
import {
  useGetOrderDetail,
  updateOrderStatus,
  exportOrderDetails,
} from "repositories/vendor-repository";
import { decodeId, isMobileTab } from "utils";
import { toast } from "react-hot-toast";
import { cloneDeep } from "lodash";
import useHandleApiError from "hooks/useHandleApiError";
import FileSaver from "file-saver";
import { useSelector } from "react-redux";

const modelEnum = {
  isAccept: false,
  isDecline: false,
};

export const useManageOrderDetails = ({ orderId, history, t }) => {
  const [modelView, setmodelView] = useState(modelEnum);
  const [showLoader, setShowLoader] = useState(false);
  const [productListing, setProductListing] = useState([]);
  const { data, isLoading, isFetching, isError, refetch } = useGetOrderDetail(
    decodeId(orderId)
  );
  useHandleApiError(isLoading, isFetching, isError);
  const details = data?.data;
  const logginedUserId = useSelector((state) => state.userProfile.profile.id);

  const openModel = (obj) => {
    setmodelView((prev) => ({ ...prev, ...obj }));
  };

  const closeModel = () => {
    setmodelView(modelEnum);
  };

  const onSubmit = async (type, SelectQuantity = []) => {
    setShowLoader(true);
    try {
      let params = {};
      if (
        type === constants.orderDetails.ACCEPT ||
        type === constants.orderDetails.DECLINE
      ) {
        params = {
          VendorOrderId: details?.id,
          Status:
            type === constants.orderDetails.ACCEPT
              ? constants.orderStatus.Accepted
              : constants.orderStatus.Cancelled,
          VendorOrderProductDetails: [],
        };
      } else {
        params = {
          VendorOrderId: details?.id,
          Status: constants.orderStatus.PartiallyAccepted,
          VendorOrderProductDetails: SelectQuantity,
        };
      }

      let res = await updateOrderStatus(params);
      toast.success(res?.message);
      closeModel();
      history.push(constants.routes.vendor.manageOrders);
    } catch (error) {
      toast.error(error.message);
      setShowLoader(false);
    }
  };

  useEffect(() => {
    details && setProductListing(updateArrayOfProducts());
  }, [details]);

  const updateArrayOfProducts = () => {
    return cloneDeep(details?.vendorOrderProductDetails)?.map((item) => {
      item.isChecked = false;
      item.value = item.totalQuantity;
      item.isSelectAll = false;
      return item;
    });
  };

  const fetchOrderDetail = () => {
    refetch();
  };

  const b64toBlob = (b64Data, contentType = "", sliceSize = 512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  };

  const exportOrder = async (shipmentId) => {
    try {
      setShowLoader(true);
      let resp = await exportOrderDetails(decodeId(orderId), shipmentId);
      if (resp && resp.data) {
        const blob = b64toBlob(resp.data, "application/pdf");
        if (isMobileTab()) {
          FileSaver.saveAs(blob);
        } else {
          console.log("i am called");
          const blobUrl = URL.createObjectURL(blob);
          const pdfWindow = window.open("");
          if (
            !pdfWindow ||
            pdfWindow.closed ||
            typeof pdfWindow.closed == "undefined"
          ) {
            toast.error(t("vendorManagement.browserPopUpSupportMessage"), {
              duration: 5000,
            });
            setShowLoader(false);
            return;
          }

          pdfWindow.document.write(
            "<iframe width='100%' height='100%' src='" + blobUrl + "'></iframe>"
          );
          pdfWindow.document.close();
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
    setShowLoader(false);
  };

  let orderStatusUpdated = orderStatus(details?.status) || "--";
  if (
    details?.status &&
    details?.cancelledBy &&
    details?.cancelledBy?.id !== logginedUserId
  ) {
    orderStatusUpdated = t("vendorManagement.orderCancelledByCustomer");
  }

  return {
    modelView,
    isLoading: showLoader || isLoading,
    vendorOrderProductDetails: details?.vendorOrderProductDetails || [],
    productListing: productListing,
    totalAmount: details?.totalPayableAmount || "--",
    isPendingOrder: details?.status === constants.orderStatus.Pending,
    showModel: modelView.isAccept || modelView.isDecline,
    isAvalible: true,
    hideExportBtn: !(
      details?.status === constants.orderStatus.Pending ||
      details?.status === constants.orderStatus.Cancelled
    ),
    details,
    updateProductListing: setProductListing,
    openModel,
    onSubmit,
    fetchOrderDetail,
    closeModel,
    exportOrder,
    basicDetails: {
      name: `${details?.orderBy?.firstName || "-"} ${
        details?.orderBy?.lastName || ""
      }`,
      accountOwnerName: `${details?.office?.owner?.firstName || "-"} ${
        details?.office?.owner?.lastName || ""
      }`,
      officeName: details?.office.name || "--",
      officeAddress: details?.office?.address || "--",
      date: details?.date || new Date(),
      orderNumber: details?.orderNo || "--",
      status: orderStatusUpdated || "--",
      paymentMethod: paymentMethodStatus(details?.paymentMethod) || "--",
      paymentStatus: paymentStatus(details?.paymentStatus) || "--",
      invoiceNo: details?.invoiceNumber || "--",
      billMeLaterModeOfPayment: details?.billMeLaterModeOfPayment,
      isToolTipVisible:
        constants.paymentStatusObj.paid === details?.paymentStatus &&
        constants.paymentMethodObj.billMeLater === details?.paymentMethod &&
        details?.billMeLaterModeOfPayment,
    },
  };
};
