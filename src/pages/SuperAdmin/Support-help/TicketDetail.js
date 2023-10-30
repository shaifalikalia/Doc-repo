import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import Page from "components/Page";
import styles from "./SupportHelpdesk.module.scss";
import { Col, Row } from "reactstrap";
import Card from "components/Card";
import Text from "components/Text";
import ChatCard from "./components/ChatCard";
import { useParams } from "react-router-dom";
import {
  useTicketById,
  inProgressTicketStatus,
  resolveTicketStatus,
} from "repositories/support-helpdesk-repository";
import moment from "moment";
import ChangeStatusmodal from "./components/changeStatusmodal";
import { useHistory } from "react-router-dom";
import Loader from "components/Loader";
import toast from "react-hot-toast";
import constants from "../../../constants";
import { decodeId, isValueEmpty } from "utils";

const TicketDetail = ({ t }) => {
  let { ticketId } = useParams();
  ticketId = decodeId(ticketId);
  const [ticketData, setTicketData] = useState(null);
  const { isLoading, error, data } = useTicketById(ticketId);
  const [modal, setModal] = useState(false);
  const [changeStatus, setChangeStatus] = useState(0);
  let history = useHistory();

  useEffect(() => {
    if (data) {
      setTicketData(data);
    }
  }, [data]);

  const resolveHandler = (_ticketId) => {
    resolveTicketStatus(_ticketId)
      .then((e) => {
        ticketData.ticketStatus = constants.ticketStatus.resolved;
        setTicketData({ ...ticketData });
        toast.success(e);
        setModal(!modal);
      })
      .catch((err) => {
        toast.error(err?.message);
      });
  };

  const inProgressHandler = (_ticketId) => {
    inProgressTicketStatus(_ticketId)
      .then((e) => {
        setTicketData({
          ...ticketData,
          ticketStatus: constants.ticketStatus.progress,
        });
        setModal(!modal);
        toast.success(e);
      })
      .catch((err) => {
        toast.error(err?.message);
      });
  };
  const toggle = (changeStatusTo) => {
    setChangeStatus(changeStatusTo);
    setModal(!modal);
  };

  const ticketStatusCard = (ticketStatus) => {
    let status = "";
    switch (ticketStatus) {
      case constants.ticketStatus.pending:
        status = t("vendorManagement.pending");
        break;

      case constants.ticketStatus.progress:
        status = t("vendorManagement.inProgress");
        break;

      case constants.ticketStatus.resolved:
        status = t("vendorManagement.resolved");
        break;

      default:
        break;
    }
    return status;
  };

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <div>{error.message}</div>
      ) : (
        <Page
          onBack={() => history.goBack()}
          title={t("vendorManagement.ticketDetails")}
        >
          <ChangeStatusmodal
            modal={modal}
            toggle={toggle}
            resolveHandler={resolveHandler}
            inProgressHandler={inProgressHandler}
            ticketId={ticketId}
            changeStatus={changeStatus}
          />
          <Card
            className={styles["helpdesk-card"]}
            radius="10px"
            marginBottom="10px"
            shadow="0 0 15px 0 rgba(0, 0, 0, 0.08)"
            cursor="default"
          >
            <div className={styles["card-status-box"]}>
              <div className={styles["timer-clock"]}>
                <img
                  className="mr-2"
                  src={require("assets/images/clock-icon.svg").default}
                  alt=""
                />
                {t("vendorManagement.issuedOn")}{" "}
                {moment(ticketData?.createdAt).format(
                  "MMM D, YYYY [at] h:mm A"
                )}
              </div>
              <span
                className={
                  styles["status-box"] +
                  " " +
                  styles[
                    ticketData?.ticketStatus == constants.ticketStatus.pending
                      ? "pending"
                      : ticketData?.ticketStatus ==
                        constants.ticketStatus.progress
                      ? "inProgress"
                      : "resolved"
                  ]
                }
              >
                {ticketData?.ticketStatus &&
                  ticketStatusCard(ticketData?.ticketStatus)}
              </span>
            </div>

            <Text size="16px" marginBottom="10px" weight="600" color="#587E85">
              {ticketData?.supportAndHelpDeskTicketType
                ? ticketData?.supportAndHelpDeskTicketType?.ticketType
                : ""}
            </Text>
            <Row>
              <Col sm="3">
                <Text
                  size="12px"
                  marginBottom="5px"
                  weight="400"
                  color="#6f7788"
                >
                  {t("vendorManagement.name")}
                </Text>
                <Text
                  size="14px"
                  marginBottom="25px"
                  weight="600"
                  color="#102c42"
                >
                  {ticketData?.createdBy?.firstName}{" "}
                  {ticketData?.createdBy?.lastName}
                </Text>
              </Col>
              <Col sm="3">
                <Text
                  size="12px"
                  marginBottom="5px"
                  weight="400"
                  color="#6f7788"
                >
                  {t("vendorManagement.ticketNo")}
                </Text>
                <Text
                  size="14px"
                  marginBottom="25px"
                  weight="600"
                  color="#102c42"
                >
                  {ticketData?.ticketNo}
                </Text>
              </Col>

              <Col sm="3">
                <Text
                  size="12px"
                  marginBottom="5px"
                  weight="400"
                  color="#6f7788"
                >
                  {t("vendorManagement.orderNo")}
                </Text>
                <Text
                  size="14px"
                  marginBottom="25px"
                  weight="600"
                  color="#102c42"
                >
                  {isValueEmpty(ticketData?.vendorOrder?.orderNo)}
                </Text>
              </Col>
            </Row>
            <div className="c-field mb-2">
              <label>{t("vendorManagement.description")}</label>
              <Text
                size="14px"
                marginBottom="25px"
                weight="400"
                color="#535B5F"
              >
                {ticketData?.description}
              </Text>
            </div>
            {ticketData?.ticketStatus == constants.ticketStatus.progress ? (
              <button
                className="btn-small-40 button button-round button-shadow mb-4 mr-3"
                title={t("vendorManagement.resolved")}
                onClick={() => toggle(3)}
              >
                {t("vendorManagement.markAsResolved")}
              </button>
            ) : ticketData?.ticketStatus == constants.ticketStatus.pending ? (
              <>
                <button
                  className="btn-small-40 button button-round button-shadow mb-4 mr-3"
                  title={t("vendorManagement.resolved")}
                  onClick={() => toggle(3)}
                >
                  {t("vendorManagement.markAsResolved")}
                </button>
                <button
                  className="btn-small-40 button button-round button-shadow mb-4"
                  title={t("vendorManagement.inProgress")}
                  onClick={() => toggle(2)}
                >
                  {t("vendorManagement.inProgress")}
                </button>
              </>
            ) : (
              ""
            )}

            <ChatCard
              ticketId={ticketId}
              ticketData={ticketData}
              setTicketData={setTicketData}
            />
          </Card>
        </Page>
      )}
    </div>
  );
};

export default withTranslation()(TicketDetail);
