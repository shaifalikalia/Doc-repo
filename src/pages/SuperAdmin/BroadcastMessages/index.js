import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import Page from "components/Page";
import { Link } from "react-router-dom";
import styles from "./BroadcastMessages.module.scss";
import Table from "components/table";
import {
  useBroadCastMessages,
  useDeleteBroadCastMessageMutation,
  useSendBroadCastMessagMutation,
} from "repositories/broadcast-repository";
import moment from "moment";
import Empty from "components/Empty";
import toast from "react-hot-toast";
import Loader from "components/Loader";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { encodeId } from "utils";

function BroadcastMessages({ t }) {
  const PAGE_SIZE = 5;
  const [pageNumber, setPageNumber] = useState(1);
  const [showLoader, setshowLoader] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const { isLoading, data } = useBroadCastMessages(pageNumber, PAGE_SIZE);
  const [confirmDelete, setConfirmDeleteModal] = useState(false);
  const deleteBroadCastMessageMutation = useDeleteBroadCastMessageMutation();
  const sendBroadCastMessagMutation = useSendBroadCastMessagMutation();

  const closeModal = () => {
    setConfirmDeleteModal(false);
  };

  const deleteBroadCastMessage = (messageId) => {
    setSelectedItem(messageId);
    setConfirmDeleteModal(true);
  };
  const confirmDeleteMessage = async () => {
    setshowLoader(true);
    try {
      const resp = await deleteBroadCastMessageMutation.mutateAsync({
        BroadcastMessageId: selectedItem,
      });
      setConfirmDeleteModal(false);
      setshowLoader(false);
      toast.success(resp);
    } catch (e) {
      setConfirmDeleteModal(false);
      setshowLoader(false);
      toast.error(e.message);
    }
  };

  const sendMessageNotification = async (
    BroadcastMessageId,
    SendNotification,
    SendEmail
  ) => {
    setshowLoader(true);
    try {
      const _data = {
        RequestorId: "",
        BroadcastMessageId,
        SendNotification,
        SendEmail,
      };
      const resp = await sendBroadCastMessagMutation.mutateAsync(_data);
      setshowLoader(false);
      toast.success(resp);
    } catch (e) {
      setshowLoader(false);
      toast.error(e.message);
    }
  };
  const columns = [
    {
      attrs: { datatitle: t("superAdmin.message") },
      dataField: "messageName",
      text: t("superAdmin.message"),
      formatter: (cellContent) => {
        if (!isLoading) return cellContent;
        return <div className="text-placeholder-150 shimmer-animation"></div>;
      },
    },
    {
      attrs: { datatitle: t("superAdmin.savedOn") },
      dataField: "createdAt",
      text: t("superAdmin.savedOn"),
      formatter: (cellContent) => {
        if (!isLoading)
          return cellContent ? moment(cellContent).format("MMM DD, YYYY") : "";
        return <div className="text-placeholder-150 shimmer-animation"></div>;
      },
    },
    {
      attrs: { datatitle: t("superAdmin.sentOn") },
      dataField: "sendAt",
      text: t("superAdmin.sentOn"),
      formatter: (cellContent) => {
        if (!isLoading)
          return cellContent ? moment(cellContent).format("MMM DD, YYYY") : "";
        return <div className="text-placeholder-150 shimmer-animation"></div>;
      },
    },
    {
      attrs: { datatitle: t("superAdmin.notification") },
      formatter: (cellContent, row) => {
        if (isLoading)
          return <div className="text-placeholder-100 shimmer-animation"></div>;
        return (
          <span
            className="pointer"
            style={{
              fontSize: "12px",
              fontWeight: "500",
              color: "#587e85",
            }}
            onClick={() => sendMessageNotification(row.id, true, false)}
          >
            <u>{t("superAdmin.sendNotification")}</u>
          </span>
        );
      },
    },
    {
      attrs: { datatitle: t("superAdmin.email") },
      formatter: (cellContent, row) => {
        if (isLoading)
          return <div className="text-placeholder-100 shimmer-animation"></div>;
        return (
          <span
            className="pointer"
            style={{
              fontSize: "12px",
              fontWeight: "500",
              color: "#587e85",
            }}
            onClick={() => sendMessageNotification(row.id, false, true)}
          >
            <u>{t("superAdmin.sendEmail")}</u>
          </span>
        );
      },
    },

    {
      attrs: { datatitle: t("superAdmin.details") },
      formatter: (cellContent, row) => {
        if (isLoading)
          return <div className="text-placeholder-100 shimmer-animation"></div>;
        return (
          <Link
            to={`broadcast-message-detail/${encodeId(row.id)}`}
            className="table-row-main-link"
          >
            <span
              className="pointer"
              style={{ fontSize: "12px", fontWeight: "500", color: "#587e85" }}
            >
              <u>{t("superAdmin.viewDetails")}</u>
            </span>
          </Link>
        );
      },
    },
    {
      formatter: (cellContent, row) => {
        if (isLoading)
          return <div className="text-placeholder-100 shimmer-animation"></div>;
        return (
          <span
            className="pointer"
            onClick={() => {
              deleteBroadCastMessage(row.id);
            }}
            style={{
              fontSize: "12px",
              fontWeight: "500",
              color: "#e76f2a",
            }}
          >
            {" "}
            <u>{t(row.isDeleted ? "Deleted" : " Delete")}</u>
          </span>
        );
      },
    },
  ];
  let rows = [];
  let totalItems = 0;
  if (!isLoading && data && data.items) {
    rows = data.items;
    totalItems = data.totalCount;
  } else {
    rows = new Array(PAGE_SIZE).fill({});
    totalItems = PAGE_SIZE;
  }
  return (
    <>
      {(showLoader || isLoading) && <Loader />}
      <Page
        title={t("superAdmin.broadcastMessages")}
        className={styles["broadcast-messages"]}
      >
        <div className={styles["brodcast-message-btn"]}>
          <Link
            to="/create-broadcast-message"
            className="button  button-round button-shadow"
          >
            {t("superAdmin.newBroadcastMessages")}
          </Link>
        </div>
        <div className="data-list">
          <Table
            columns={columns}
            data={rows}
            keyField="id"
            handlePagination={setPageNumber}
            pageNumber={pageNumber}
            totalItems={totalItems}
            pageSize={PAGE_SIZE}
          />
          {!isLoading && totalItems === 0 && (
            <Empty Message={t("noRecordFound")} />
          )}
        </div>
      </Page>
      {/* Modal */}
      <ConfirmDeleteModal
        closeModal={closeModal}
        confirmDelete={confirmDelete}
        confirmDeleteMessage={confirmDeleteMessage}
      />
      {/* Modal */}
    </>
  );
}
export default withTranslation()(BroadcastMessages);
