import React, { useState, useContext, Fragment, useEffect } from "react";
import { withTranslation } from "react-i18next";
import styles from "../EventDetails/EventDetails.module.scss";
import constants, { getSchedulerStatusById } from "../../../constants";
import { Col, Row } from "reactstrap";
import Card from "components/Card";
import Page from "components/Page";
import "rc-time-picker/assets/index.css";
import Text from "components/Text";
import moment from "moment";
import toast from "react-hot-toast";
import Loader from "components/Loader";
import WithdrawEvent from "../Scheduler/components/Modals/WithdrawEvent";
import RepeatEventModal from "../Scheduler/components/Modals/RepeatEventModal";
import { Store } from "containers/routes";
import "./scheduler-calendar.scss";
import { useSelector } from "react-redux";

import {
  requestToJoin,
  withDrawEvent,
  declineEvents,
  getEventListDetails,
  isEventDeclined,
  getEventIcsLink
} from "../../../repositories/scheduler-repository";
import { useParams } from "react-router-dom";
import DeclineModal from "../Scheduler/components/Modals/DeclineModal";
import { addToCalenderText, checkExpiredEvent, decodeId } from "../../../utils";
import Eventnotexist from "../components/Modal/Eventnotexist";
import AddToCalendar from "../components/AddToCalendar";
import CustomModal from "components/CustomModal";

const EventRequestDetails = ({ t, location, history }) => {
  const { setIsBack } = useContext(Store);
  const [eventDetailModal, seteventDetailModal] = useState({});
  const [withdrawModal, setwithdrawModal] = useState({});
  const [selectedDate, setselectedDate] = useState([]);
  const [selectedRepeatEvent, setSelectedRepeatEvent] = useState(constants.SCHEDULEREVENTTYPE.All);
  const [eventDetails, setEventDetails] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [declineModal, setdeclineModal] = useState({});
  const [toolTipModal, setToolTipModal] = useState(false);
  let { eventId } = useParams();
  eventId = decodeId(eventId)
  const profile = useSelector((e) => e.userProfile.profile);
  if (!eventId) {
    goBack();
  }

  const goBack = () => {
    setIsBack(constants.routes.scheduler.eventRequestDetails);
    if(location?.state?.from === 'notifications'){
      history.push(constants.routes.notification.notificationDetail)
    } else{
      history.push(constants.routes.scheduler.calendar)
    }
  };

  useEffect(() => {
    eventDeclined();
  }, []);

  const eventDeclined = async () =>{
    try{
      setIsLoading(true);
      let res = await isEventDeclined(eventId)
      if(res?.data === false){
        getDetails()
      }else{
        setEventDetails()
      }
      setIsLoading(false);

    } catch (error) {
      toast.error(error.message)
      setEventDetails()
      setIsLoading(false);
      
    }
  }

  const getDetails = async () => {
    setIsLoading(true);
    try {
      let response = await getEventListDetails(eventId);
      response?.data && setEventDetails(response.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message)

    }
  };


  const selectMultipleDates = (value) => {
    if (
      selectedDate.filter((e) => e == moment(value).format("YYYY-MM-DD"))
        ?.length
    ) {
      let newArray = selectedDate.filter(
        (e) => e !== moment(value).format("YYYY-MM-DD")
      );
      setselectedDate([...newArray]);
    } else {
      setselectedDate((e) => [...e, moment(value).format("YYYY-MM-DD")]);
    }
  };

  const isExpired = checkExpiredEvent(eventDetails);

  const requestToJoinButton = async () => {
    try {
      if (
        selectedRepeatEvent === constants.SCHEDULEREVENTTYPE.SPECFIC &&
        !selectedDate?.length
      ) {
        return toast.error(t("message.atleastonedate"));
      }

      let params = {
        SchedulerEventId: eventDetailModal.id,
        RequestRepeatType:
          selectedRepeatEvent === constants.SCHEDULEREVENTTYPE.SPECFIC
            ? 4
            : eventDetailModal.repeatedType,
        SelectedDates: selectedDate,
      };

      let response = await requestToJoin(params);
      if (response?.statusCode === 200 && response.data) {
        eventDetails.eventRequestToJoins = [response.data];
        setEventDetails({ ...eventDetails });
        toast.success(response.message);
        seteventDetailModal({});
        setselectedDate([])
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const withdrawEvent = async () => {
    setIsLoading(true);
    try {
      let id = withdrawModal?.eventRequestToJoins.find(
        (e) => e.requestedById === profile?.id
      )?.id;
      let response = await withDrawEvent(id);
      setEventDetails((e) => ({ ...e, eventRequestToJoins: [] }));
      toast.success(response.message);
      setwithdrawModal({});
      setIsLoading(false);
    } catch (error) {
      toast.error(error.message);
      setIsLoading(false);
    }
  };

  const DeclineEvent = async () => {
    try {
      let response = await declineEvents(declineModal.id);
      toast.success(response.message);
      setdeclineModal({});
      goBack();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getStatus = () => {
    let value = eventDetails?.eventRequestToJoins?.find(
      (e) => e.requestedById === profile?.id
    );
    return value ? value.status : null;
  };

  const [isDownloading, setIsDownloading] = useState(false);

    const handleAddToCalendar = async () => {
        setIsDownloading(true);
        try {
            const url = await getEventIcsLink(eventDetails?.id);
            window?.open(url, "_self");
            toast.success(t('fileDownloaded'))
        } catch (error) {
            toast.error(error?.message);
        }
        setIsDownloading(false);
    }

  return (
    <Fragment>
      {(isLoading || isDownloading) && <Loader />}
      
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
  
                {getStatus() && (
                  < div>
                  <div
                    className={
                      styles["status-tag"] +
                      " " +
                      (getStatus() > 2 ? styles["bg-red"] : "")
                    }
                  >
                    {t(getSchedulerStatusById(getStatus()))}
                  </div>
                  </div>
                )}
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
                      <li>
                        <AddToCalendar
                            firstIcon={require('assets/images/download-icon.svg').default}
                            middleText={t('accountOwner.addToCalendar')}
                            secondIcon={require('assets/images/alert-circle.svg').default}
                            handleAddToCalendar={handleAddToCalendar}
                            setToolTipModal={setToolTipModal}
                        />
                      </li>
  
                      {getStatus() === constants.SCHEDULERSTATUS.REJECT && (
                        <li>
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
                            {
                              eventDetails?.eventRequestToJoins?.find(
                                (e) => e?.requestedById === profile?.id
                              )?.reasonForRejection
                            }
                          </Text>
                        </li>
                      )}
                    </ul>
  
                    {!isExpired &&
                      getStatus() != constants.SCHEDULERSTATUS.REJECT && (
                        <Fragment>
                          {!eventDetails?.eventRequestToJoins?.find(
                            (e) => e?.requestedById === profile?.id
                          ) ? (
                            <Fragment>
                              <button
                                className="button button-round button-border button-dark  mr-4"
                                title={t("accountOwner.decline")}
                                onClick={() =>
                                  setdeclineModal({ ...eventDetails })
                                }
                              >
                                {t("accountOwner.decline")}
                              </button>
                              <button
                                className="button button-round  button-shadow"
                                title={t("accountOwner.requestToJoin")}
                                onClick={() =>
                                  seteventDetailModal({ ...eventDetails })
                                }
                              >
                                {t("accountOwner.requestToJoin")}
                              </button>
                            </Fragment>
                          ) : (
                            <button
                              className="button button-round  button-shadow"
                              title={t("accountOwner.withdraw")}
                              onClick={() =>
                                setwithdrawModal({ ...eventDetails })
                              }
                            >
                              {t("accountOwner.withdraw")}
                            </button>
                          )}
                        </Fragment>
                      )}
  
                    {isExpired && (
                      <button
                        className="button button-round button-border button-dark  mr-4"
                        title={t("accountOwner.decline")}
                        onClick={() => setdeclineModal({ ...eventDetails })}
                      >
                        {t("accountOwner.decline")}
                      </button>
                    )}
                  </Col>
                </Row>
              </div>
              </Fragment>
              :
              
              <Eventnotexist />
            }


          </Card>
        </Page>


      {eventDetailModal?.id && (
        <RepeatEventModal
          seteventDetailModal={seteventDetailModal}
          selectMultipleDates={selectMultipleDates}
          selectedDate={selectedDate}
          eventDetailModal={eventDetailModal}
          selectedRepeatEvent={selectedRepeatEvent}
          requestToJoin={requestToJoinButton}
          setSelectedRepeatEvent={setSelectedRepeatEvent}
          setselectedDate={setselectedDate}
        />
      )}
      {withdrawModal?.id && (
        <WithdrawEvent
          setwithdrawModal={setwithdrawModal}
          withdrawEvent={withdrawEvent}
        />
      )}
      {declineModal?.id && (
        <DeclineModal
          setdeclineModal={setdeclineModal}
          DeclineEvent={DeclineEvent}
        />
      )}
      <CustomModal
        isOpen={toolTipModal}
        setIsOpen={setToolTipModal}
        title={t('accountOwner.addToCalendar')}
        subTitle1={addToCalenderText()}
        calender={true}
      />
    </Fragment>
  );
};

export default withTranslation()(EventRequestDetails);
