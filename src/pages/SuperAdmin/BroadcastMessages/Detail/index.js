import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import Page from "components/Page";
import styles from "./BroadcastMessageDetail.module.scss";
import Card from "components/Card";
import Text from "components/Text";
import {
  useBroadCastMessagesDetail,
  useDeleteBroadCastMessageMutation,
  useSendBroadCastMessagMutation,
} from "repositories/broadcast-repository";
import toast from "react-hot-toast";
import Loader from "components/Loader";
import ConfirmDeleteModal from "../ConfirmDeleteModal";
import deleteIcon from "./../../../../assets/images/delete-icon.svg";
import ShowOfficeUsers from "../ShowOfficeUsers";
import { decodeId } from "utils";
function BroadcastMessageDetail({ t, history, match, location }) {
  const broadcastDetailId = decodeId(match.params.id);
  const { isLoading, error, data } =
    useBroadCastMessagesDetail(broadcastDetailId);
  const [confirmDelete, setConfirmDeleteModal] = useState(false);

  const deleteBroadCastMessageMutation = useDeleteBroadCastMessageMutation();
  const sendBroadCastMessagMutation = useSendBroadCastMessagMutation();
  const [showUsers, setShowUsers] = useState(false);
  const [showLoader, setshowLoader] = useState(false);
  const goBack = () =>
    history.push({
      pathname: "/broadcast-messages",
      state: location.state,
    });

  if (broadcastDetailId === undefined || isNaN(broadcastDetailId)) {
    goBack();
    return null;
  }
  let content = null;

  if (!isLoading && error) {
    toast.error(error.message);
    goBack();
    return null;
  }
  if (!isLoading && !data) {
    goBack();
    return null;
  }

  if (!isLoading && data) {
    content = (
      <Card radius="10px" className={styles["broadcast-card"]}>
        <div
          className={styles["btn-link"]}
          onClick={() => setConfirmDeleteModal(true)}
        >
          {" "}
          <img src={deleteIcon} alt="delete" />{" "}
        </div>
        <div className={styles["inner-wrapper"]}>
          <div className={styles["c-field"]}>
            <Text size="13px" color="#79869a">
              {t("superAdmin.messageName")}
            </Text>

            <Text size="14px" weight="600" color="#102c42">
              {data.messageName ? (
                data.messageName
              ) : (
                <div className="text-placeholder-150 shimmer-animation"></div>
              )}
            </Text>
          </div>
          <div className={styles["c-field"]}>
            <Text size="13px" color="#79869a">
              {t("title")}
            </Text>

            <Text size="14px" weight="600" color="#102c42">
              {data.messageTitle ? (
                data.messageTitle
              ) : (
                <div className="text-placeholder-150 shimmer-animation"></div>
              )}
            </Text>
          </div>
          <div className={styles["c-field"]}>
            <Text size="13px" color="#79869a">
              {t("superAdmin.descriptionBroadcast")}
            </Text>
            <Text size="14px" weight="600" color="#102c42">
              <div dangerouslySetInnerHTML={{ __html: data.description }}></div>
            </Text>
          </div>
          <div className={styles["c-field"]}>
            <Text size="13px" color="#79869a">
              {t("superAdmin.users")}
            </Text>
            {data.totalOwnersCount > 0 && (
              <>
                <Text
                  size="14px"
                  weight="600"
                  marginBottom="5px"
                  color="#102c42"
                >
                  {" "}
                  {data.totalOwnersCount > 1
                    ? t("superAdmin.multipleUsersSelected")
                    : data.broadcastMessageOwners[0].owner.firstName +
                      " " +
                      data.broadcastMessageOwners[0].owner.lastName}
                </Text>
                <span
                  className="link-btn"
                  onClick={() => {
                    setShowUsers(true);
                  }}
                >
                  {t("superAdmin.viewUsers")}
                </span>
              </>
            )}
          </div>
        </div>
        <button
          className="button button-round button-shadow mr-3"
          onClick={() => sendMessageNotification(true, false)}
        >
          {t("superAdmin.sendNotification")}
        </button>
        <button
          className="button button-round button-border button-dark"
          onClick={() => sendMessageNotification(false, true)}
        >
          {t("superAdmin.sendEmail")}
        </button>
      </Card>
    );
  }

  const confirmDeleteMessage = async () => {
    setshowLoader(true);
    try {
      const resp = await deleteBroadCastMessageMutation.mutateAsync({
        BroadcastMessageId: broadcastDetailId,
      });
      setConfirmDeleteModal(false);
      setshowLoader(false);
      toast.success(resp);
      goBack();
    } catch (e) {
      setConfirmDeleteModal(false);
      setshowLoader(false);
      toast.error(e.message);
    }
  };

  const sendMessageNotification = async (SendNotification, SendEmail) => {
    setshowLoader(true);
    try {
      const _data = {
        RequestorId: "",
        BroadcastMessageId: broadcastDetailId,
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

  const closeModal = () => {
    setConfirmDeleteModal(false);
  };

  return (
    <>
      {!showUsers && (
        <Page onBack={goBack}>
          {(showLoader || isLoading) && <Loader />}
          <div className={styles["broadcast-message-detail"]}>
            <h2 className="page-title mt-2 mb-4">
              {t("superAdmin.broadcastMessageDetails")}{" "}
            </h2>
            {content}
          </div>

          {/* Modal */}
          <ConfirmDeleteModal
            closeModal={closeModal}
            confirmDelete={confirmDelete}
            confirmDeleteMessage={confirmDeleteMessage}
          />
          {/* Modal */}
        </Page>
      )}
      {showUsers && (
        <ShowOfficeUsers
          setShowUsers={setShowUsers}
          broadcastDetailId={broadcastDetailId}
        />
      )}
    </>
  );
}
export default withTranslation()(BroadcastMessageDetail);
