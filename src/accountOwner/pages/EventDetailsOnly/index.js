import React, { useState, useContext, Fragment, useEffect } from "react";
import { withTranslation } from "react-i18next";
import styles from "../EventDetails/EventDetails.module.scss";
import constants  from "../../../constants";
import { Col, Row } from "reactstrap";
import Card from "components/Card";
import Page from "components/Page";
import "rc-time-picker/assets/index.css";
import Text from "components/Text";
import moment from "moment";
import Loader from "components/Loader";
import { Store } from "containers/routes";
import "./scheduler-calendar.scss";
import { getEventListDetails } from "../../../repositories/scheduler-repository";
import { useParams } from "react-router-dom";
import Eventnotexist from "../components/Modal/Eventnotexist";
import { decodeId } from "utils";

const EventDetailsOnly = ({ t, location, history }) => {
  const { setIsBack } = useContext(Store);
  const [eventDetails, setEventDetails] = useState();
  const [isLoading, setIsLoading] = useState(false);
  let { eventId } = useParams();
  eventId = decodeId(eventId)
  
  const goBack = () => {
    setIsBack(constants.routes.scheduler.eventRequestDetails);
    if(location?.state?.from === 'notifications'){
      history.push(constants.routes.notification.notificationDetail)
    } else{
      history.push(constants.routes.scheduler.calendar)
    }
  };

  if (!eventId) {
    goBack();
  }

  useEffect(() => {
    const getDetails = async () => {
      setIsLoading(true);
      try {
        let response = await getEventListDetails(eventId);
        response?.data && setEventDetails(response.data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };
    getDetails();
  }, []);

  return (
    <Fragment>
      {isLoading && <Loader />}
      
        <Page
          onBack={() => {
            goBack();
          }}
          title={t("accountOwner.eventDetails")}
        >
          <Card
            className={styles["event-detail-card"]}
            radius="10px"
            marginBottom="18px"
            shadow="0 0 15px 0 rgba(0, 0, 0, 0.08)"
          >
            {
              eventDetails ?
              <Fragment>

              <div className="d-flex justify-content-between">
                <Text size="20px" marginBottom="0px" weight="500" color="#111b45">
                  {eventDetails?.title}
                </Text>
              </div>
              <div className="common-tabs mt-3">
                <Row>
                  <Col lg="6">
                    <ul className={styles["white-col-list"]}>
                      <li>
                        <Text
                          size="12px"
                          marginBottom="5px"
                          weight="400"
                          color="#6f7788"
                        >
                          {t("accountOwner.eventCreatedBy")}
                        </Text>
                        <Text
                          size="14px"
                          marginBottom="0"
                          weight="600"
                          color="#102c42"
                        >
                          {eventDetails?.createdBy?.firstName +
                            " " +
                            eventDetails?.createdBy?.lastName}
                        </Text>
                      </li>
                      <li>
                        <Text
                          size="12px"
                          marginBottom="5px"
                          weight="400"
                          color="#6f7788"
                        >
                          {t("accountOwner.offices")}
                        </Text>
                        <Text
                          size="14px"
                          marginBottom="0"
                          weight="600"
                          color="#102c42"
                        >
                          {eventDetails?.office?.name}
                        </Text>
                      </li>
                      <li>
                        <Text
                          size="12px"
                          marginBottom="5px"
                          weight="400"
                          color="#6f7788"
                        >
                          {t("accountOwner.date")}
                        </Text>
                        <Text
                          size="14px"
                          marginBottom="0"
                          weight="600"
                          color="#102c42"
                        >
                          {moment(eventDetails?.date).format(
                            "MMM DD, YYYY - ddd"
                          )}{" "}
                          ({eventDetails?.office?.state?.timezoneCode})
                        </Text>
                      </li>
                      <li>
                        <Row>
                          <Col xs="6">
                            <Text
                              size="12px"
                              marginBottom="5px"
                              weight="400"
                              color="#6f7788"
                            >
                              {t("staff.startTime")}
                            </Text>
                            <Text
                              size="14px"
                              marginBottom="0"
                              weight="600"
                              color="#102c42"
                            >
                              {moment(eventDetails?.startTime).format("h:mm A")}
                            </Text>
                          </Col>
                          <Col xs="6">
                            <Text
                              size="12px"
                              marginBottom="5px"
                              weight="400"
                              color="#6f7788"
                            >
                              {t("staff.endTime")}
                            </Text>
                            <Text
                              size="14px"
                              marginBottom="0"
                              weight="600"
                              color="#102c42"
                            >
                              {moment(eventDetails?.endTime).format("h:mm A")}
                            </Text>
                          </Col>
                        </Row>
                      </li>
                      {eventDetails?.repeatedType !== 1 &&
                        eventDetails?.repeatedEndDate && (
                          <li>
                            <Text
                              size="12px"
                              marginBottom="5px"
                              weight="400"
                              color="#6f7788"
                            >
                              {t("accountOwner.endDateRepeatedEvents")}
                            </Text>
                            <Text
                              size="14px"
                              marginBottom="0"
                              weight="600"
                              color="#102c42"
                            >
                              {moment(
                                eventDetails?.repeatedEndDate,
                                "YYYY-MM-DDTHH:mm:ss"
                              ).format("MMM DD, YYYY - ddd")}{" "}
                              ({eventDetails?.office?.state?.timezoneCode})
                            </Text>
                          </li>
                        )}
                      <li>
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
                          {eventDetails?.repeatedType === 2
                            ? `${t("scheduler.repeatForAll")} ${moment(
                                eventDetails.date,
                                "YYYY-MM-DDTHH:mm:ss"
                              ).format("dddd")}`
                            : eventDetails?.repeatedType === 3
                            ? t("scheduler.repeatForAllFuture")
                            : t("scheduler.never")}
                        </Text>
                      </li>
                      <li>
                        <Text
                          size="12px"
                          marginBottom="5px"
                          weight="400"
                          color="#6f7788"
                        >
                          {t("location")}
                        </Text>
                        <Text
                          size="14px"
                          marginBottom="0"
                          weight="600"
                          color="#102c42"
                        >
                          {eventDetails?.location}
                        </Text>
                      </li>
                      <li>
                        <Text
                          size="12px"
                          marginBottom="5px"
                          weight="400"
                          color="#6f7788"
                        >
                          {t("superAdmin.role")}
                        </Text>
                        {eventDetails?.eventRoles?.length > 0 &&
                          eventDetails?.eventRoles.map((v, key) => (
                            <Text
                              size="14px"
                              marginBottom="5px"
                              weight="600"
                              color="#102c42"
                              key={key}
                            >
                              {v?.designations?.name}
                            </Text>
                          ))}
                      </li>
                      <li>
                        <Text
                          size="12px"
                          marginBottom="5px"
                          weight="400"
                          color="#6f7788"
                        >
                          {t("accountOwner.notes")}
                        </Text>
                        <Text
                          size="14px"
                          marginBottom="0"
                          weight="600"
                          color="#102c42"
                        >
                          {eventDetails?.note}
                        </Text>
                      </li>
                      <li>
                        <Text
                          size="12px"
                          marginBottom="5px"
                          weight="400"
                          color="#6f7788"
                        >
                          {t("accountOwner.tags")}
                        </Text>
                        <div className={styles["tag-list"]}>
                          {eventDetails?.eventTags.length > 0 &&
                            eventDetails?.eventTags.map((v, key) => (
                              <span key={key}>{v?.title}</span>
                            ))}
                          {eventDetails?.eventTags.length === 0 && <span>-</span>}
                        </div>
                      </li>
                    </ul>
                  </Col>
                </Row>
              </div>
              </Fragment>
              :
              
              <Eventnotexist />
            }


          </Card>
        </Page>
    </Fragment>
  );
};

export default withTranslation()(EventDetailsOnly);
