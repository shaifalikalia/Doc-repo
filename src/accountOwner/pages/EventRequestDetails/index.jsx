import React, { useState, useContext, useEffect, Fragment } from "react";
import { withTranslation } from "react-i18next";
import styles from "../EventDetails/EventDetails.module.scss";
import constants, { getSchedulerStatusById } from "../../../constants";
import { Col, Row } from "reactstrap";
import Card from "components/Card";
import Page from "components/Page";
import Text from "components/Text";
import moment from "moment";
import toast from "react-hot-toast";
import Loader from "components/Loader";
import RejectionModal from "../Scheduler/components/Modals/RejectionModal";
import ConfirmAcceptModal from "../Scheduler/components/Modals/ConfirmAcceptModal";
import {
  acceptEventRequest,
  rejectEventRequest,
  cancelEventRequest,
  checkOverlapEvent,
  getEventListDetails,
  getEventIcsLink,
} from "repositories/scheduler-repository";
import { addToCalenderText, checkExpiredEvent, decodeId } from "../../../utils";
import { Store } from "containers/routes";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Eventnotexist from "../components/Modal/Eventnotexist";
import AddToCalendar from "../components/AddToCalendar";
import CustomModal from "components/CustomModal";

const EventRequestDetails = ({ t, location, history }) => {
  const profile = useSelector((state) => state.userProfile.profile);
  const { setIsBack } = useContext(Store);
  const [isLoading, setIsLoading] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
  const [isConfirmAcceptModalOpen, setIsConfirmAcceptModalOpen] = useState(false);
  const [eventDetails, setEventDetails] = useState();
  const [employeeStatus, setEmployeeStatus] = useState({});
  const [eventNotExist, setEventNotExist] = useState(false);
  const [toolTipModal, setToolTipModal] = useState(false);


  let  { eventId } = useParams();
  eventId = decodeId(eventId)

  const goBack = () => {
    setIsBack(constants.routes.scheduler.eventRequestDetails);
    if(location?.state?.from === 'notifications'){
      history.push(constants.routes.notification.notificationDetail)
    } else{
      history.push(constants.routes.scheduler.calendar)
    }
  };

  useEffect(() => {
    getDetails();
    // eslint-disable-next-line
  }, []);

  const getDetails = async () => {
    setIsLoading(true);
    try {
      let response = await getEventListDetails(eventId);
      if (response && response?.data) {
        setEventDetails(response?.data);
        if (response?.data.eventEmployees?.length) {
          getStatus(response?.data?.eventEmployees);
        }
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const getStatus = (employees) => {
    let employee = employees?.find((e) => e.userId === profile.id);
      setEventNotExist(employee ? false : true )
    setEmployeeStatus(employee);
  };

  const isExpired = checkExpiredEvent(eventDetails);

  const confirmReject = async (reason) => {
    setIsLoading(true);
    setIsRejectionModalOpen(false);
    try {
      if (employeeStatus?.status === 2) {
        await cancelEventRequest(
          eventDetails.id,
          eventDetails.office.id,
          reason
        );
        employeeStatus.reasonForCancel = reason;
        employeeStatus.status = 4;
        setEmployeeStatus({ ...employeeStatus });
        toast.success(t("scheduler.reqCancelledSuccessfully"));
      } else {
        await rejectEventRequest(
          eventDetails.id,
          eventDetails.office.id,
          reason
        );
        employeeStatus.reasonForRejection = reason;
        employeeStatus.status = 3;
        setEmployeeStatus({ ...employeeStatus });
        toast.success(t("scheduler.reqRejectSuccessfully"));
      }
      setIsLoading(false);

    } catch (e) {
      setIsLoading(false);
      toast.error(e.message);
    }
  };

  const confirmAccept = async () => {
    setIsLoading(true);
    setIsConfirmAcceptModalOpen(false);

    try {
      await acceptEventRequest(eventDetails.id, eventDetails.office.id);
      getDetails()
      toast.success(t("scheduler.reqAcceptSuccessfully"));
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      toast.error(e.message);
    }
  };

  const checkEventSlot = async () => {
    setIsLoading(true);
    setIsBooked(false);
    try {
      let response = await checkOverlapEvent(
        eventDetails.id,
        eventDetails.ownerId
      );
      setIsLoading(false);
      setIsBooked(response?.data);
      setIsConfirmAcceptModalOpen(true);
    } catch (e) {
      setIsLoading(false);
      toast.error(e.message);
    }
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
    <Page
      onBack={() => {
        goBack();
      }}
      title={t("accountOwner.eventDetails")}
    >
      {(isLoading || isDownloading) && <Loader />}
      <Card
        className={styles["event-detail-card"]}
        radius="10px"
        marginBottom="18px"
        shadow="0 0 15px 0 rgba(0, 0, 0, 0.08)"
      >
       {
        (eventDetails && eventNotExist === false) &&
        <Fragment>
          
         <div className="d-flex justify-content-between">
         <Text size="20px" marginBottom="0px" weight="500" color="#111b45">
           {eventDetails?.title}
         </Text>
         <div className={styles["delete-edit-icons"]}>
           <div
             className={
               styles["status-tag"] +
               " " +
               (employeeStatus?.status > 2 ? styles["bg-red"] : "")
             }
           >
             {t(getSchedulerStatusById(employeeStatus?.status))}
           </div>
         </div>
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
                   {moment(eventDetails?.date).format("MMM DD, YYYY - ddd")} (
                   {eventDetails?.office?.state?.timezoneCode})
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
                   {t("accountOwner.employees")}
                 </Text>
                 <Text
                   size="14px"
                   marginBottom="0"
                   weight="600"
                   color="#102c42"
                 >
                   {eventDetails?.eventEmployees?.length === 0
                     ? t("accountOwner.noEmployeesSelected")
                     : eventDetails?.eventEmployees?.length === 1
                     ? eventDetails?.eventEmployees[0]?.user?.firstName +
                       " " +
                       eventDetails?.eventEmployees[0]?.user?.lastName
                     : eventDetails?.eventEmployees?.length +
                       " " +
                       t("Selected")}
                 </Text>
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
                   {eventDetails?.eventTags?.length > 0 &&
                     eventDetails?.eventTags.map((v, key) => (
                       <span key={key}>{v?.title}</span>
                     ))}
                   {eventDetails?.eventTags?.length === 0 && <span>-</span>}
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
               {(employeeStatus?.reasonForRejection ||
                 employeeStatus?.reasonForCancel) && (
                 <li>
                   <Text
                     size="12px"
                     marginBottom="5px"
                     weight="400"
                     color="#6f7788"
                   >
                     {employeeStatus?.reasonForCancel
                       ? t("accountOwner.reasonOfCancellation")
                       : t("accountOwner.reasonOfRejection")}
                   </Text>
                   <Text
                     size="14px"
                     marginBottom="0"
                     weight="600"
                     color="#102c42"
                   >
                     {employeeStatus?.reasonForRejection ||
                       employeeStatus?.reasonForCancel}
                   </Text>
                 </li>
               )}
             </ul>
           </Col>
           <Col lg="6"></Col>
         </Row>
       </div>
       {!isExpired && (
         <div className="d-flex">
           {employeeStatus?.status === 1 && (
             <>
               <button
                 className="button button-round mr-4 button-shadow"
                 title={t("accept")}
                 onClick={() => {
                   checkEventSlot();
                 }}
               >
                 {t("accept")}
               </button>
               <button
                 className="button button-round button-border button-dark"
                 onClick={() => {
                   setIsRejectionModalOpen(true);
                 }}
                 title={t("decline")}
               >
                 {t("decline")}
               </button>
             </>
           )}
           {employeeStatus?.status === 2 && (
             <>
               <button
                 className="button button-round button-border button-dark"
                 onClick={() => {
                   setIsRejectionModalOpen(true);
                 }}
                 title={t("scheduler.cancelEvent")}
               >
                 {t("scheduler.cancelEvent")}
               </button>
             </>
           )}
         </div>
       )}
        </Fragment>
  
                }


                {
                  (!eventDetails || eventNotExist ) && <Eventnotexist />
                }





        
      </Card>











      {isRejectionModalOpen && (
        <RejectionModal
          isRejectionModalOpen={isRejectionModalOpen}
          setIsRejectionModalOpen={setIsRejectionModalOpen}
          confirmReject={confirmReject}
          isCancel={employeeStatus?.status === 2}
        />
      )}
      {isConfirmAcceptModalOpen && (
        <ConfirmAcceptModal
          isConfirmAcceptModalOpen={isConfirmAcceptModalOpen}
          setIsConfirmAcceptModalOpen={setIsConfirmAcceptModalOpen}
          confirmAccept={confirmAccept}
          isBooked={isBooked}
        />
      )}
      <CustomModal
        isOpen={toolTipModal}
        setIsOpen={setToolTipModal}
        title={t('accountOwner.addToCalendar')}
        subTitle1={addToCalenderText()}
        calender={true}
      />
    </Page>
  );
};

export default withTranslation()(EventRequestDetails);
