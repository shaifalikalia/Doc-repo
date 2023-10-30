import useHandleApiError from "hooks/useHandleApiError";
import { find } from "lodash";
import moment from "moment";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  useGetOrderListByCustomer,
  addPaymentMode,
  generateInvoiceVendorOrders,
  generatePdfVendorOrders,
} from "repositories/vendor-repository";
import {
  isMobileTab,
  decodeId,
  encodeId,
  testRegexCheckDescription,
  handleError,
  handleSuccess,
} from "utils";
import produce from "immer";
import constants, {
  paymentMethodStatus,
  paymentStatus as getPaymentStatusTitle,
  orderStatus as getOrderStatusTitle,
} from "../../../../constants";
import useScrollTopOnPageChange from "hooks/useScrollTopOnPageChange";
import FileSaver from "file-saver";
import { toast } from "react-hot-toast";

const PAGE_SIZE = 5;

const useCustomerOrderList = ({ filters, refetchOfficeDetails, t }) => {
  const { id } = useParams();
  const officeId = decodeId(id);

  const {
    selectedOrderStatus,
    selectedPaymentMethod,
    selectedPaymentStatus,
    selectedCustomer,
    fromDate,
    toDate,
    orderListPage,
  } = filters;

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [VendorOrderId, setVendorOrderId] = useState(null);
  const [totalItems, setTotalItems] = useState(1);
  const [columnData, setColumnData] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [selectedAll, setSelectedAll] = useState(false);
  const [isLoader, setIsLoader] = useState(false);

  const fromDateFilter = fromDate && moment(fromDate).format("YYYY-MM-DD");
  const toDateFilter = toDate && moment(toDate).format("YYYY-MM-DD");
  const isEnabled = fromDateFilter && toDateFilter;
  const {
    isLoading: loadingOrderList,
    isFetching: fetchingOrderList,
    data: orders,
    error: orderListError,
    refetch,
  } = useGetOrderListByCustomer(
    officeId,
    orderListPage.orderListPageNumber,
    PAGE_SIZE,
    fromDateFilter,
    toDateFilter,
    selectedPaymentStatus.id,
    selectedPaymentMethod.id,
    selectedOrderStatus.id,
    selectedCustomer.id,
    { enabled: !!isEnabled }
  );
  useHandleApiError(loadingOrderList, fetchingOrderList, orderListError);
  useScrollTopOnPageChange(orderListPage.orderListPageNumber);

  const handlePageNumber = (page) => {
    orderListPage.setOrderListPageNumber(page);
    setSelectedOrders([]);
    setSelectedAll(false);
  };

  const [modalInputValue, setModalInputValue] = useState("");

  const handleModalInputValue = (e) => {
    const value = e.target.value;
    if (!testRegexCheckDescription(value)) return;
    setModalInputValue(value);
  };

  const openConfirmationModal = (orderVendorId) => {
    setIsConfirmationModalOpen(true);
    setVendorOrderId(orderVendorId);
  };

  const closeConfirmationModal = () => {
    setIsConfirmationModalOpen(false);
    setVendorOrderId(null);
    setModalInputValue("");
  };

  const handleConfirmMarkAsPaid = async () => {
    setIsLoader(true);
    try {
      let res = await addPaymentMode({
        VendorOrderId: VendorOrderId,
        BillMeLaterModeOfPayment: modalInputValue?.trim(),
      });
      refetchOfficeDetails();
      refetch();
      handleSuccess(res?.message);
      setIsConfirmationModalOpen(false);
      setModalInputValue("");
    } catch (err) {
      handleError(err);
    }
    setIsLoader(false);
  };

  const isSelected = (order) => {
    return selectedAll || !!find(selectedOrders, { id: order.id });
  };

  const toggleCheckbox = (e, currentOrder) => {
    const currentId = currentOrder.id;
    if (!e.target.checked) {
      setSelectedOrders((prev) => prev.filter((it) => it.id !== currentId));
    } else {
      setSelectedOrders((prev) => [...prev, currentOrder]);
    }
  };

  const toggleAllCheckbox = (e) => {
    if (e.target.checked && Array.isArray(columnData) && columnData?.length) {
      setSelectedOrders([...columnData]);
    } else {
      setSelectedOrders([]);
    }
    setSelectedAll(e.target.checked);
  };

  useEffect(() => {
    if (orders) {
      const convertedData = orders.data.map((order) => {
        const {
          id: orderId,
          orderNo,
          date,
          orderBy,
          paymentMethod,
          paymentStatus,
          status,
          invoiceNumber,
        } = order;
        const { firstName = "-", lastName = "" } = orderBy || {};
        return {
          id: orderId,
          orderNo: orderNo,
          date: moment(date).format("MMM DD, YYYY"),
          customerName: `${firstName} ${lastName}`,
          paymentMethod: paymentMethodStatus(paymentMethod),
          paymentStatus: getPaymentStatusTitle(paymentStatus),
          orderStatus: getOrderStatusTitle(status),
          isBillMeLater:
            paymentMethod === constants.vendor.enums.paymentMethod.billMeLater,
          isNotPaid:
            paymentStatus === constants.vendor.enums.paymentStatus.notPaid,
          invoiceNo: invoiceNumber || "--",
          to: constants.routes.vendor.orderDetail.replace(
            ":orderId",
            encodeId(orderId)
          ),
          refreshCounter: 0,
          tooltip: false,
          billMeLaterModeOfPayment: order.billMeLaterModeOfPayment,
        };
      });
      setColumnData(convertedData);
      setTotalItems(orders?.pagination?.totalItems);
    }
  }, [orders]);

  const toggleTooltip = (rowIndex) => {
    setColumnData(
      produce((draft) => {
        draft[rowIndex].tooltip = !draft[rowIndex].tooltip;
      })
    );
  };

  useEffect(() => {
    //This use effect is very importent to run the column formatter on state changes.
    setColumnData(
      produce((draft) => {
        draft.forEach((_, idx) => {
          draft[idx].refreshCounter += 1;
        });
      })
    );
  }, [selectedOrders, selectedAll]);

  const generateInvoice = async () => {
    try {
      if (!selectedOrders.length) return;
      setIsLoader(true);
      let res = await generateInvoiceVendorOrders({
        VendorOrderIds: selectedOrders.map((item) => item.id),
      });

      handleSuccess(res?.message);
      refetch();
      setSelectedOrders([]);
      setSelectedAll(false);
    } catch (err) {
      handleError(err);
    }
    setIsLoader(false);
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

  const generatePdf = async () => {
    try {
      if (!selectedOrders.length) return;

      setIsLoader(true);
      let res = await generatePdfVendorOrders({
        vendorOrderIds: selectedOrders.map((item) => item.id),
        StartDate: fromDateFilter,
        EndDate: toDateFilter,
        PaymentMethod: selectedPaymentMethod.id,
        PaymentStatus: selectedPaymentStatus.id,
      });
      if (res && res.data) {
        const blob = b64toBlob(res.data, "application/pdf");
        if (isMobileTab()) {
          FileSaver.saveAs(blob);
        } else {
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
            setIsLoader(false);

            return;
          }
          pdfWindow.document.write(
            "<iframe width='100%' height='100%' src='" + blobUrl + "'></iframe>"
          );
          pdfWindow.document.close();
        }
        setSelectedOrders([]);
        setSelectedAll(false);
      }
      handleSuccess(res?.message);
    } catch (err) {
      handleError(err);
    }
    setIsLoader(false);
  };

  return {
    data: {
      loading: loadingOrderList || isLoader,
      columnData,
      isConfirmationModalOpen,
      currentPageNumber: orderListPage.orderListPageNumber,
      pageSize: PAGE_SIZE,
      totalItems,
      selectedAll,
      modalInputValue,
      isOrderSelected: selectedOrders?.length,
    },
    methods: {
      openConfirmationModal,
      closeConfirmationModal,
      handlePageNumber,
      handleConfirmMarkAsPaid,
      toggleCheckbox,
      toggleAllCheckbox,
      isSelected,
      toggleTooltip,
      handleModalInputValue,
      generateInvoice,
      generatePdf,
    },
  };
};

export default useCustomerOrderList;
