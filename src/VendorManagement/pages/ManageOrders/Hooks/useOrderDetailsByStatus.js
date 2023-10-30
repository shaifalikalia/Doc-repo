import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import constants from "../../../../constants";
import {
  updateOrderStatus,
  useGetOrderDetailsByStatus,
} from "repositories/vendor-repository";
import useHandleApiError from "hooks/useHandleApiError";
import { decodeId, handleError, handleSuccess } from "utils";
import moment from "moment";
import produce from "immer";

const useOrderDetailsByStatus = ({ t, fetchOrderDetail }) => {
  const tabs = {
    notShipped: "1",
    shipped: "2",
    delivered: "3",
    cancelled: "4",
    allItems: "5",
    newShipments: "6",
  };

  const mapTabsToOrderStatus = (tab) => {
    switch (tab) {
      case tabs.notShipped:
        return constants.orderStatus.Accepted;
      case tabs.shipped:
        return constants.orderStatus.Shipped;
      case tabs.delivered:
        return constants.orderStatus.Delivered;
      case tabs.cancelled:
        return constants.orderStatus.Cancelled;
      case tabs.allItems:
        return null;
      case tabs.newShipments:
        return constants.orderStatus.newShipment;
      default:
        return null;
    }
  };

  let { orderId } = useParams();
  orderId = decodeId(orderId);

  let cachedTab = sessionStorage.getItem(constants.vendor.cache.orderDetail);
  const [activeTab, setActiveTab] = useState(cachedTab || tabs.notShipped);
  const [isAdditionalItemModalOpen, setIsAdditionalItemModalOpen] =
    useState(false);
  const [isCancelItemsModalOpen, setIsCancelItemsModalOpen] = useState(false);
  const [isTrackOrderModel, setIsTrackOrderModel] = useState(false);

  //State for nonShippedItems
  const [details, setDetails] = useState(null);
  const [inProgress, setInProgress] = useState(false);

  const {
    isLoading,
    isFetching,
    data: orderDetails,
    error,
    refetch,
  } = useGetOrderDetailsByStatus(orderId, mapTabsToOrderStatus(activeTab), {
    enabled: !!orderId,
  });
  useHandleApiError(isLoading, isFetching, error);

  const getDetails = () => {
    if (!orderDetails) return null;
    if (activeTab === tabs.notShipped) {
      if (orderDetails?.length && Array.isArray(orderDetails)) {
        return orderDetails?.map((orderDetail) => ({
          ...orderDetail,
          isSelectedAll: true,
        }));
      }
      return orderDetails;
    } else if (activeTab === tabs.shipped || activeTab === tabs.newShipments) {
      return orderDetails.map((item) => {
        const { date, vendorOrderProductShipment: products, ...rest } = item;
        return {
          ...rest,
          date: moment(date).format("MMM DD, YYYY - h:mm A"),
          products,
        };
      });
    } else if (activeTab === tabs.delivered) {
      return orderDetails.map((item) => {
        const { date, vendorOrderProductDelivered: products, ...rest } = item;
        return {
          ...rest,
          date: moment(date).format("MMM DD, YYYY - h:mm A"),
          products,
        };
      });
    } else if (activeTab === tabs.cancelled || activeTab === tabs.allItems) {
      const { vendorOrderProductDetails, ...rest } = orderDetails;
      return {
        ...rest,
        products: vendorOrderProductDetails,
      };
    } else {
      return null;
    }
  };

  useEffect(() => {
    sessionStorage.setItem(constants.vendor.cache.orderDetail, activeTab);
    return () => sessionStorage.removeItem(constants.vendor.cache.orderDetail);
  }, [activeTab]);

  useEffect(() => {
    setDetails(getDetails());
  }, [orderDetails]);

  const openCancelItemsModal = () => {
    const selectedItems = details.filter((item) => item.selected);
    if (!selectedItems.length) return;
    setIsCancelItemsModalOpen(true);
  };

  const closeCancelItemsModal = () => {
    setIsCancelItemsModalOpen(false);
  };

  const handleSelectItems = (e, rowIndex) => {
    const checked = e.target.checked;
    if (checked) {
      setDetails(
        produce((draft) => {
          draft[rowIndex].selected = true;
          draft[rowIndex].selectedQuantity = draft[rowIndex].quantityRemaining;
        })
      );
    } else {
      setDetails(
        produce((draft) => {
          draft[rowIndex].selected = false;
          draft[rowIndex].selectedQuantity = draft[rowIndex].quantityRemaining;
        })
      );
    }
  };

  const isAnyNotShippedItemSelected = () => {
    return details?.some((item) => item.selected);
  };

  const handleQuantity = (row, rowIndex, operation = "+") => {
    if (row.selected) {
      setDetails(
        produce((draft) => {
          const { selectedQuantity, quantityRemaining } = draft[rowIndex];
          if (operation === "+") {
            if (selectedQuantity < quantityRemaining) {
              draft[rowIndex].selectedQuantity += 1;
            } else {
              handleError(new Error(t("vendorManagement.errors.cannotBeMore")));
            }
          } else {
            if (selectedQuantity > 1) {
              draft[rowIndex].selectedQuantity -= 1;
            } else {
              handleError(new Error(t("vendorManagement.errors.cannotBeLess")));
            }
          }
        })
      );
    }
  };

  const handleSelectAllItems = (row, rowIndex, type) => {
    if (row.selected && type === constants.selectType.selectAll) {
      setDetails(
        produce((draft) => {
          const { quantityRemaining } = draft[rowIndex];
          draft[rowIndex].isSelectedAll = true;
          draft[rowIndex].selectedQuantity = quantityRemaining;
        })
      );
    }

    if (row.selected && type === constants.selectType.selectQuantity) {
      setDetails(
        produce((draft) => {
          draft[rowIndex].isSelectedAll = false;
        })
      );
    }
  };

  const markAsShipped = async (trackDetails) => {
    const selectedItems = details.filter((item) => item.selected);
    if (!selectedItems.length) return;
    setInProgress(true);
    try {
      const payload = {
        VendorOrderId: orderId,
        Status: constants.orderStatus.Shipped,
        TrackingDetail: trackDetails,
        VendorOrderProductDetails: selectedItems.map((item) => {
          const {
            vendorOrderProductDetailId: Id,
            selectedQuantity: QuantityShipped,
          } = item;
          return {
            Id,
            QuantityShipped,
          };
        }),
      };
      await updateOrderStatus(payload);
      setIsTrackOrderModel(false);
      fetchOrderDetail();
      refetch();
      handleSuccess(t("vendorManagement.updatedSuccessfully"));
    } catch (err) {
      handleError(err);
    }
    setInProgress(false);
  };

  const markAsCancelled = async () => {
    const selectedItems = details.filter((item) => item.selected);
    if (!selectedItems.length) return;
    setInProgress(true);
    try {
      const payload = {
        VendorOrderId: orderId,
        Status: constants.orderStatus.Cancelled,
        VendorOrderProductDetails: selectedItems.map((item) => {
          const {
            vendorOrderProductDetailId: Id,
            selectedQuantity: QuantityCancelled,
          } = item;
          return {
            Id,
            QuantityCancelled,
          };
        }),
      };
      await updateOrderStatus(payload);
      fetchOrderDetail();
      refetch();
      closeCancelItemsModal();
      handleSuccess(t("vendorManagement.updatedSuccessfully"));
    } catch (err) {
      handleError(err);
    }
    setInProgress(false);
  };

  const openTrackModel = () => {
    setIsTrackOrderModel(true);
  };

  return {
    data: {
      loading: isLoading || inProgress,
      activeTab,
      isAdditionalItemModalOpen,
      tabs,
      isTrackOrderModel,
      details,
      orderId,
      isCancelItemsModalOpen,
    },
    methods: {
      setActiveTab,
      setIsAdditionalItemModalOpen,
      openTrackModel,
      mapTabsToOrderStatus,
      openCancelItemsModal,
      closeCancelItemsModal,
      handleSelectItems,
      handleQuantity,
      markAsShipped,
      markAsCancelled,
      handleSelectAllItems,
      isAnyNotShippedItemSelected,
      closeTrackModel: () => {
        setIsTrackOrderModel(false);
      },
    },
  };
};

export default useOrderDetailsByStatus;
