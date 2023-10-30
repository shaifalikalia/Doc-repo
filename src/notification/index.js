import Card from "components/Card";
import Page from "components/Page";
import { Store } from "containers/routes";
import React, { useEffect, useState, useContext } from "react";
import styles from "./Notification.module.scss";
import { withTranslation } from "react-i18next";
import { useGetNotifications } from "repositories/notification-repository";
import { checkNotificationAccesibility } from "repositories/subscription-repository";
import Loader from "components/Loader";
import { encodeId, formatDate, handleError } from "utils";
import { unionBy } from "lodash";
import { useHistory } from "react-router-dom";
import Text from "components/Text";
import constants from "../constants";
import { useDispatch } from "react-redux";

const PAGE_SIZE = 3;

function Notification({ t }) {
  const history = useHistory();

  const goBack = () => {
    history.push("/");
  };

  const { setIsSubscriptionModel } = useContext(Store);
  const { setIsModelOpenForNotification } = useContext(Store);
  const [currentPage, setCurrentPage] = useState(1);
  const [showLoader, setShowLoader] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const { isLoading, data: apiData } = useGetNotifications(
    PAGE_SIZE,
    currentPage,
    true
  );
  const { data, pagination } = apiData || {};
  const { totalPages } = pagination || {};
  const { notification_list = [] } = data || {};
  const dispatch = useDispatch();

  useEffect(() => {
    setNotifications((prev) => [...unionBy(prev, notification_list, "id")]);
    //eslint-disable-next-line
  }, [apiData]);

  useEffect(() => {
    dispatch({ type: constants.NOTIFICATIONREADED });
  }, []);

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const isNotificationAccessible = async (id, redirectionCode, officeId) => {
    setShowLoader(true);
    try {
      let response = await checkNotificationAccesibility(officeId);
      const accessResponse = response;
      const schedulerNotification = accessResponse?.planFeature?.find(
        (val) => val.id === constants.moduleNameWithId.scheduler
      );

      if (schedulerNotification?.isAvailable) {
        redirectToNotification(id, redirectionCode, officeId);
      } else {
        setIsSubscriptionModel(true);
        setIsModelOpenForNotification(true);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setShowLoader(false);
    }
  };

  const redirectToNotification = (id, redirectionCode, officeId) => {
    const {
      eventAcceptAndReject,
      RequestToJoin,
      PulishEvent,
      EventRequestToJoin,
      EventEmployee,
      eventJoinandInvite,
    } = constants.notificationRedirectionCode;

    if (
      redirectionCode === eventAcceptAndReject ||
      redirectionCode === RequestToJoin
    ) {
      history.push({
        pathname: constants.routes.scheduler.eventDetails.replace(
          ":eventId",
          encodeId(id)
        ),
        state: {
          from: "notifications",
        },
      });
    } else if (
      redirectionCode === PulishEvent ||
      redirectionCode === EventRequestToJoin
    ) {
      history.push({
        pathname: constants.routes.scheduler.EventWorkingDetails.replace(
          ":eventId",
          encodeId(id)
        ),
        state: {
          from: "notifications",
        },
      });
    } else if (
      redirectionCode === EventEmployee ||
      redirectionCode === eventJoinandInvite
    ) {
      history.push({
        pathname: constants.routes.scheduler.eventRequestDetails.replace(
          ":eventId",
          encodeId(id)
        ),
        state: {
          from: "notifications",
        },
      });
    } else {
      history.push({
        pathname: constants.routes.scheduler.eventDetailsOnly.replace(
          ":eventId",
          encodeId(id)
        ),
        state: {
          from: "notifications",
        },
      });
    }
  };

  return (
    <Page onBack={goBack} title={t("notificationsPage.title")}>
      {(isLoading || showLoader) && <Loader />}
      <Card
        className={styles["notification-card"]}
        radius="10px"
        marginBottom="18px"
        shadow="0 0 15px 0 rgba(0, 0, 0, 0.08)"
      >
        <ul className={styles["notification-list"]}>
          {notifications.length > 0 ? (
            notifications.map((n) => {
              const {
                id,
                dateCreated,
                title,
                schedulerEventId,
                redirectionCode,
                officeId,
              } = n;
              const formatedDate = formatDate(dateCreated);
              return (
                <li key={id}>
                  <div className={styles["notify-icon"]}>
                    <img
                      src={
                        require("assets/images/Notification-icon.svg").default
                      }
                      alt="icon"
                    />
                  </div>
                  <div className={styles["content-box"]}>
                    <div className={styles["notify-text"]}>{title}</div>
                    <div className={styles["notify-date"]}>{formatedDate}</div>
                    <span
                      className="link-btn"
                      onClick={() =>
                        isNotificationAccessible(
                          schedulerEventId,
                          redirectionCode,
                          officeId
                        )
                      }
                    >
                      {t("superAdmin.viewDetails")}
                    </span>
                  </div>
                </li>
              );
            })
          ) : (
            <div className="scheduler-empty-box">
              <p>
                <img
                  src={require("assets/images/notification_bell.svg").default}
                  alt="icon"
                />{" "}
              </p>
              <Text size="25px" marginBottom="0" weight="500" color="#111B45">
                {t("accountOwner.NoNotificationsFound")}
              </Text>
            </div>
          )}
        </ul>
      </Card>
      {totalPages && totalPages > currentPage ? (
        <div className="text-center mb-5">
          <button
            className="button button-round button-dark button-border"
            title={t("loadMore")}
            onClick={handleLoadMore}
          >
            {t("loadMore")}
          </button>
        </div>
      ) : null}
    </Page>
  );
}

export default withTranslation()(Notification);
