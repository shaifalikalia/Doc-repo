import React, { Fragment, useEffect, useState } from "react";
import Card from "components/Card";
import Page from "components/Page";
import Text from "components/Text";
import { withTranslation } from "react-i18next";
import styles from "./EventDetails.module.scss";
import editIcon from "./../../../assets/images/edit-icon.svg";
import deleteIcon from "./../../../assets/images/delete-icon.svg";
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import DetailsTab from "./components/DetailsTab";
import Tooltip from "reactstrap/lib/Tooltip";
import RequestToJoin from "./components/RequestToJoin";
import DeleteEventModal from "./components/Modals/DeleteEventModal";
import constants from "../../../constants";
import {
  getEventListDetails,
  acceptRequestEventToJoin,
  deleteEvent,
  rejectRequestEventToJoin,
} from "repositories/scheduler-repository";
import { useParams } from "react-router-dom";
import Loader from "components/Loader";
import SpecficDates from "./components/Modals/SpecficDates";
import toast from "react-hot-toast";
import RejectionModal from "./components/Modals/RejectionModal";
import AcceptConfirmation from "./components/Modals/AcceptConfirmation";
import ReasonOfRejection from "./components/Modals/ReasonOfRejection";
import Eventnotexist from "../components/Modal/Eventnotexist";
import { decodeId, encodeId } from "utils";

const EventDetails = ({ t, location, history }) => {
  const goBack = () => {
    if(location?.state?.from === 'notifications'){
      history.push(constants.routes.notification.notificationDetail)
    } else{
      history.push(constants.routes.scheduler.calendar)
    }
  };

  const [activeTab, setActiveTab] = useState("1");
  let { eventId } = useParams();
  eventId = decodeId(eventId)
  const [tooltipEditOpen, setTooltipEditOpen] = useState(false);
  const [tooltipDeleteOpen, setTooltipDeleteOpen] = useState(false);
  const [isDeleteEventModalOpen, setIsDeleteEventModalOpen] = useState(false);
  const [eventDetails, seteventDetails] = useState();
  const [loaderShow, setloaderShow] = useState(true);
  const [ , setSpecficDates] = useState({});
  const [isSelectedRequestedEvent, setIsSelectedRequestedEvent] = useState({});
  const [rejectedTest, SetRejectedTest] = useState();
  const [isError, setIsError] = useState({});

  



  
  const moveToEditPage = () => {
    history.push(
      constants.routes.scheduler.editEvent.replace(":eventId", encodeId(eventId))
    );
  };

  
  useEffect(() => {
    getDetails();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    SetRejectedTest("");
    setIsError({})
  }, [isSelectedRequestedEvent]);

  const getDetails = async () => {
    try {
      let response = await getEventListDetails(eventId);
      if (response && response?.data) {
        seteventDetails(response?.data);
      }
      setloaderShow(false);
    } catch (error) {
      setloaderShow(false);
     
    }
  };



  const eventDelete = async () => {
    try {
      let res = await deleteEvent(eventId);
      setIsDeleteEventModalOpen(false);
      toast.success(res.message);
      goBack();
    } catch (err) {
      toast.error(err.message);
    }
  };


  
  const acceptEvent = async () => {
    if (!isSelectedRequestedEvent?.id) return;
    try {
      let res = await acceptRequestEventToJoin(isSelectedRequestedEvent?.id);
      if (res.statusCode === 200) {
        eventDetails.eventRequestToJoins[
          isSelectedRequestedEvent.index
        ].status = constants.SCHEDULERSTATUS.ACCEPT;
        setIsSelectedRequestedEvent({});
        seteventDetails({ ...eventDetails });
        toast.success(res.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };
  
  const rejectEvent = async () => {
    

    if(!rejectedTest?.trim()?.length){
      isError.reasonForRejection = t("form.errors.reasonOfRejection")
      setIsError({...isError})
      return

    }else{
       delete isError.reasonForRejection
      setIsError({...isError})
      }

    if (isSelectedRequestedEvent?.id && rejectedTest?.length <= constants.wordLimits.REJECTOINREQUESTJOIN) {
      try {
        let res = await rejectRequestEventToJoin(
          isSelectedRequestedEvent?.id,
          rejectedTest
        );
        if (res.statusCode === 200) {
          eventDetails.eventRequestToJoins[isSelectedRequestedEvent?.index].status = constants.SCHEDULERSTATUS.REJECT;
          eventDetails.eventRequestToJoins[isSelectedRequestedEvent?.index].reasonForRejection = rejectedTest
          seteventDetails({ ...eventDetails });
          setIsSelectedRequestedEvent({});
          toast.success(res.message);
        }
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  return (
    <Page
      onBack={() => {
        goBack();
      }}
      title={t("accountOwner.eventDetails")}
    >
      {loaderShow && <Loader />}
      <Card
        className={styles["event-detail-card"]}
        radius="10px"
        marginBottom="18px"
        shadow="0 0 15px 0 rgba(0, 0, 0, 0.08)"
      >
      { 
      eventDetails ?
        <Fragment>
                <div
              className={
                "d-flex justify-content-between " + styles["align-items-top"]
              }
            >
              <Text size="20px" marginBottom="10px" weight="500" color="#111b45">
                {eventDetails?.title}
              </Text>
              <div className={styles["delete-edit-icons"]}>
                <img
                  src={deleteIcon}
                  alt="delete"
                  id="TooltipDeleteBtn"
                  onClick={() => setIsDeleteEventModalOpen(true)}
                />

                <Tooltip
                  isOpen={tooltipDeleteOpen}
                  placement="top"
                  target="TooltipDeleteBtn"
                  toggle={() => {
                    setTooltipDeleteOpen(!tooltipDeleteOpen);
                  }}
                >
                  Delete Event
                </Tooltip>
                <img
                  src={editIcon}
                  alt="edit"
                  id="TooltipEditBtn"
                  onClick={moveToEditPage}
                />
                <Tooltip
                  isOpen={tooltipEditOpen}
                  placement="top"
                  target="TooltipEditBtn"
                  toggle={() => {
                    setTooltipEditOpen(!tooltipEditOpen);
                  }}
                >
                  Edit Event
                </Tooltip>
              </div>
            </div>
            <div className="common-tabs mt-3">
              <Nav tabs>
                <NavItem>
                  <NavLink
                    className={activeTab == "1" ? "active" : ""}
                    onClick={() => setActiveTab("1")}
                  >
                    {t("accountOwner.details")}
                  </NavLink>
                </NavItem>

                {!!eventDetails?.publishAsEvent && (
                  <NavItem>
                    <NavLink
                      className={activeTab == "2" ? "active" : ""}
                      onClick={() => setActiveTab("2")}
                    >
                      {t("accountOwner.requestToJoin")}
                    </NavLink>
                  </NavItem>
                )}
              </Nav>
              <TabContent activeTab={activeTab}>
                <TabPane tabId="1">
                  {!!eventDetails && <DetailsTab eventDetails={eventDetails} />}
                </TabPane>
                <TabPane tabId="2">
                  <RequestToJoin
                    eventDetails={eventDetails}
                    setSpecficDates={setSpecficDates}
                    acceptEvent={acceptEvent}
                    setIsRejectionModalOpen={setIsSelectedRequestedEvent}
                  />
                </TabPane>
              </TabContent>
            </div>
        </Fragment>
        :
        <Eventnotexist />
      }


      </Card>

      {!!isDeleteEventModalOpen && (
        <DeleteEventModal
          isDeleteEventModalOpen={isDeleteEventModalOpen}
          eventDetails={eventDetails}
          setIsDeleteEventModalOpen={setIsDeleteEventModalOpen}
          eventDelete={eventDelete}
        />
      )}

      {isSelectedRequestedEvent?.type === constants.SCHEDULEREVENTTYPE.SPECFICDATES && (
        <SpecficDates
          setSpecficDates={setIsSelectedRequestedEvent}
          specficTimeList={isSelectedRequestedEvent}
          acceptEvent={acceptEvent}
        />
      )}

      {isSelectedRequestedEvent?.type ===
        constants.SCHEDULEREVENTTYPE.REASONOFREJECT && (
        <ReasonOfRejection
        setIsSelectedRequestedEvent={setIsSelectedRequestedEvent}
        isSelectedRequestedEvent={isSelectedRequestedEvent}
        />
      )}


      {isSelectedRequestedEvent?.type ===
        constants.SCHEDULEREVENTTYPE.REJECT && (
        <RejectionModal
          isRejectionModalOpen={true}
          setIsRejectionModalOpen={setIsSelectedRequestedEvent}
          isSelectedRequestedEvent={isSelectedRequestedEvent}
          rejectEvent={rejectEvent}
          rejectedTest={rejectedTest}
          SetRejectedTest={SetRejectedTest}
          isError={isError}
        />
      )}

      {isSelectedRequestedEvent?.type ===
        constants.SCHEDULEREVENTTYPE.ACCEPT && (
        <AcceptConfirmation
          setIsRejectionModalOpen={setIsSelectedRequestedEvent}
          isSelectedRequestedEvent={isSelectedRequestedEvent}
          acceptEvent={acceptEvent}
        />
      )}
    </Page>
  );
};

export default withTranslation()(EventDetails);
