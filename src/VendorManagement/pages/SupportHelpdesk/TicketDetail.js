import React, { useEffect, useState } from "react";
import LayoutVendor from "../../components/LayoutVendor";
import { withTranslation } from "react-i18next";
import Page from "components/Page";
import styles from "./SupportHelpdesk.module.scss";
import { Col, Row } from "reactstrap";
import Card from "components/Card";
import Text from "components/Text";
import ChatCard from "./components/ChatCard";

import { useTicketById } from "repositories/support-helpdesk-repository";
import useHandleApiError from "hooks/useHandleApiError";
import { decodeId } from "utils";
import { useParams } from "react-router-dom";
import { isValueEmpty } from "utils";
import moment from "moment";
import constants, {
  getClassNameVenodorTicket,
  getStatusVenodorTicket,
} from "../../../constants";
import { useHistory } from "react-router-dom";
import { createMessage } from "repositories/support-helpdesk-repository";
import { toast } from "react-hot-toast";
import Loader from "components/Loader";

const TicketDetail = ({ t }) => {
  const [details, setDetails] = useState({});
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const history = useHistory();
  const { id } = useParams();
  const {
    data,
    isLoading: isLoader,
    error: isError,
    isFetching,
  } = useTicketById(decodeId(id));
  useHandleApiError(isLoader, isFetching, isError);

  useEffect(() => {
    setDetails(data);
  }, [data]);

  const goBack = () => {
    history.push(constants.routes.vendor.supportHelpdesk);
  };

  const sendMessage = async () => {
    if (!message?.trim()?.length || !details?.id) return;
    setIsLoading(true);
    try {
      let res = await createMessage(details.id, message);
      setDetails(res.data);
      setMessage("");
      scrollToLastMessage();
    } catch (err) {
      toast.error(err.message);
    }
    setIsLoading(false);
  };

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  const scrollToLastMessage = () => {
    setTimeout(() => {
      const error = document.getElementsByClassName("lastMessage");
      if (error && error.length) {
        error[0].scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "start",
        });
      }
    }, 1000);
  };

  const arrayOfMessage = details?.messageForSupportAndHelpDesks || [];
  return (
    <LayoutVendor>
      <Page onBack={goBack} title={t("vendorManagement.ticketDetails")}>
        <Card
          className={styles["helpdesk-card"]}
          radius="10px"
          marginBottom="10px"
          shadow="0 0 15px 0 rgba(0, 0, 0, 0.08)"
          cursor="default"
        >
          {(isLoading || isLoader) && <Loader />}

          <div
            className={styles["card-status-box"] + " " + styles["detail-box"]}
          >
            <div className="order-1 order-md-2">
              <span
                className={
                  styles["status-box"] +
                  " " +
                  styles[getClassNameVenodorTicket(details?.ticketStatus)]
                }
              >
                {getStatusVenodorTicket(details?.ticketStatus)}
              </span>
            </div>
            <div className={styles["timer-clock"] + " order-2 order-md-1"}>
              <img
                className="mr-2"
                src={require("assets/images/clock-icon.svg").default}
                alt=""
              />
              {t("vendorManagement.createdOn")}
              {moment(details?.createdAt).format("MMM D, YYYY [at] h:mm A")}
            </div>
          </div>

          <Text size="16px" marginBottom="10px" weight="600" color="#587E85">
            Refund
          </Text>
          <Row>
            <Col sm="3" xs="6">
              <Text size="12px" marginBottom="5px" weight="400" color="#6f7788">
                {t("vendorManagement.ticketNo")}
              </Text>
              <Text
                size="14px"
                marginBottom="25px"
                weight="600"
                color="#102c42"
              >
                {isValueEmpty(details?.ticketNo)}
              </Text>
            </Col>
            <Col sm="3" xs="6">
              <Text size="12px" marginBottom="5px" weight="400" color="#6f7788">
                {t("vendorManagement.orderNo")}
              </Text>
              <Text
                size="14px"
                marginBottom="25px"
                weight="600"
                color="#102c42"
              >
                {isValueEmpty(details?.vendorOrder?.orderNo)}
              </Text>
            </Col>
          </Row>
          <div className="c-field-label mb-2">
            <label>{t("vendorManagement.description")}</label>
            <div className={styles["ticket-desc-detail"]}>
              {isValueEmpty(details?.description)}
            </div>
          </div>
          <ChatCard
            arrayOfMessage={arrayOfMessage}
            handleChange={handleChange}
            sendMessage={sendMessage}
            message={message}
            isDisabled={!message?.trim()?.length}
          />
        </Card>
      </Page>
    </LayoutVendor>
  );
};

export default withTranslation()(TicketDetail);
