import React, { Fragment } from "react";
import styles from "./SchedularEvents.module.scss";
import { withTranslation } from "react-i18next";
import { Row, Col } from "reactstrap";
import Text from "components/Text";
import moment from "moment";
import constants, { getSchedulerStatusById } from "../../../../../constants";
import { useHistory } from "react-router-dom";
import { checkExpiredEvent, encodeId } from '../../../../../utils';

function WorkingEventsDetail({
  t,
  details,
  seteventDetailModal,
  setwithdrawModal,
  setdeclineModal,
  index,
}) {
  const history = useHistory();
  const repeatedType =
    details?.repeatedType === 2
      ? `${t("scheduler.repeatForAll")} ${moment(
          details.date,
          "YYYY-MM-DDTHH:mm:ss"
        ).format("dddd")}`
      : details?.repeatedType === 3
      ? t("scheduler.repeatForAllFuture")
      : t("scheduler.never");

  const viewEventDetail = (id) => {
    history.push({
      pathname: constants.routes.scheduler.EventWorkingDetails.replace(':eventId', encodeId(id)),
      state: {
        eventData: details,
      },
    });
  };

  const isExpired = checkExpiredEvent(details);

  return (
    <>
      <div
        className={
          styles["event-card"] +
          " " +
          (isExpired ? styles["exipred-time-card"] : styles.pb5)
        }
      >
        <div
          className={styles["event-card-body"]}
          onClick={(e) => viewEventDetail(details.id)}
        >
          <div className={styles["event-header"]}>
            <h4 className={styles.heading}>{details?.title}</h4>

            {details?.eventRequestToJoins?.[0]?.status && (
              <div
                className={
                  styles["status-tag"] +
                  " " +
                  (details?.eventRequestToJoins?.[0]?.status > 2
                    ? styles["bg-red"]
                    : "")
                }
              >
                {t(
                  getSchedulerStatusById(
                    details?.eventRequestToJoins?.[0]?.status
                  )
                )}
              </div>
            )}
          </div>
          <Row>
            <Col sm="5">
              <div className={styles["c-field"]}>
                <Text
                  size="12px"
                  marginBottom="5px"
                  weight="400"
                  color="#6f7788"
                >
                  {t("accountOwner.assigneddBy")}
                </Text>
                <Text size="14px" marginBottom="0" weight="600" color="#102c42">
                  {details?.createdBy?.firstName +
                    " " +
                    details?.createdBy?.lastName}
                </Text>
              </div>
            </Col>
            <Col sm="7">
              <div className={styles["c-field"]}>
                <Text
                  size="12px"
                  marginBottom="5px"
                  weight="400"
                  color="#6f7788"
                >
                  {t("accountOwner.date")}
                </Text>
                <Text size="14px" marginBottom="0" weight="600" color="#102c42">
                  {moment(details?.date).format("MMM DD, YYYY")} -{" "}
                  {moment(details?.startTime).format("h:mm A")} -{" "}
                  {moment(details?.endTime).format("h:mm A")} (
                  {details?.office?.state?.timezoneCode})
                </Text>
              </div>
            </Col>
            {repeatedType && (
              <Col sm="5">
                <div className={styles["c-field"]}>
                  <Text
                    size="12px"
                    marginBottom="5px"
                    weight="400"
                    color="#6f7788"
                  >
                    {t("repeat")}
                  </Text>
                  <Text
                    size="14px"
                    marginBottom="0"
                    weight="600"
                    color="#102c42"
                  >
                    {repeatedType}
                  </Text>
                </div>
              </Col>
            )}
            <Col sm="7">
              <div className={styles["c-field"]}>
                <Text
                  size="12px"
                  marginBottom="5px"
                  weight="400"
                  color="#6f7788"
                >
                  {t("superAdmin.officeName")}
                </Text>
                <Text size="14px" marginBottom="0" weight="600" color="#102c42">
                  {details?.office?.name}
                </Text>
              </div>
            </Col>

            {details?.eventRequestToJoins?.[0]?.status ===
              constants.SCHEDULERSTATUS.REJECT && (
              <Col sm="12">
                <div className={styles["c-field"]}>
                  <Text
                    size="12px"
                    marginBottom="5px"
                    weight="400"
                    color="#6f7788"
                  >
                    {t("accountOwner.reasonOfRejection")}
                  </Text>
                  <Text
                    size="14px"
                    marginBottom="0"
                    weight="600"
                    color="#102c42"
                  >
                    {details?.eventRequestToJoins?.[0]?.reasonForRejection}
                  </Text>
                </div>
              </Col>
            )}
          </Row>
        </div>
          
        <div className="d-flex mb-3">
          {!isExpired &&
            details?.eventRequestToJoins?.[0]?.status !==
              constants.SCHEDULERSTATUS.REJECT && (
              <Fragment>
                {details?.eventRequestToJoins?.length === 0 ? (
                  <Fragment>
                    <button
                      className="button button-round button-border button-dark  mr-4"
                      title={t("accountOwner.decline")}
                      onClick={() => setdeclineModal({ ...details, index })}
                    >
                      {t("accountOwner.decline")}
                    </button>
                    <button
                      className="button button-round  button-shadow"
                      title={t("accountOwner.requestToJoin")}
                      onClick={() => seteventDetailModal({ ...details, index })}
                    >
                      {t("accountOwner.requestToJoin")}
                    </button>
                  </Fragment>
                ) : (
                  <button
                    className="button button-round  button-shadow"
                    title={t("accountOwner.withdraw")}
                    onClick={() => setwithdrawModal({ ...details, index })}
                  >
                    {t("accountOwner.withdraw")}
                  </button>
                )}
              </Fragment>
            )}

          {isExpired  && (
            <button
              className="button button-round button-border button-dark  mr-4"
              title={t("accountOwner.decline")}
              onClick={() => setdeclineModal({ ...details, index })}
            >
              {t("accountOwner.decline")}
            </button>
          )}
        </div>

        {(isExpired && details?.eventRequestToJoins?.[0]?.status !== constants.SCHEDULERSTATUS.ACCEPT ) && (
          <div className={styles["expire-status-box"]}>
            {" "}
            {t("staff.timeExpiredToJoin")}
          </div>
        )}
      </div>
    </>
  );
}

export default withTranslation()(WorkingEventsDetail);
