import React, { Fragment, useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import StickySidebar from "../../../components/StickySidebar";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import Text from "components/Text";
import "./../../../Scheduler.scss";
import EventsFilter from "../../../components/SchedulerFilters/EventsFilter";
import Loader from "components/Loader";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import constants from "../../../../../../constants";
import InfiniteScroll from "react-infinite-scroll-component";
import { motion } from "framer-motion";
import WorkingEventsDetail from "accountOwner/pages/Scheduler/components/SchedularEvents/WorkingEventsDetail";
import RepeatEventModal from "accountOwner/pages/Scheduler/components/Modals/RepeatEventModal";
import WithdrawEvent from "accountOwner/pages/Scheduler/components/Modals/WithdrawEvent";
import DeclineModal from "accountOwner/pages/Scheduler/components/Modals/DeclineModal";
import { cacheSideBarActive, isMobileTab } from "utils";
import moment from "moment";
import {
  requestToJoin,
  withDrawEvent,
  declineEvents,
  getEventPublishedList
} from "repositories/scheduler-repository";


const PAGE_SIZE = 5;
const animationVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

function WorkingEventsShiftsTab({ t }) {
  const profile = useSelector((state) => state.userProfile.profile);
  const [totalItems, setTotalItems] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [eventData, setEventData] = useState([]);
  const [eventDetailModal, seteventDetailModal] = useState({});
  const [withdrawModal, setwithdrawModal] = useState({});
  const [declineModal, setdeclineModal] = useState({});

  const [selectedDate, setselectedDate] = useState([]);
  const [selectedStatusFilter, setStatusFilter] = useState([]);

  const [isSidebarActive, setSidebarActive] = useState(cacheSideBarActive());
  const [selectedRepeatEvent, setSelectedRepeatEvent] = useState(
    constants.SCHEDULEREVENTTYPE.All
  );

  let selectedOwnerId = 0;
  if (profile && profile.role) {
    if (profile.role.systemRole !== constants.systemRoles.staff) {
      selectedOwnerId = profile.id;
    } else {
      selectedOwnerId = localStorage.getItem("selectedOwner")
        ? JSON.parse(localStorage.getItem("selectedOwner")).id
        : selectedOwnerId;
    }
  }

  useEffect(() => {
    if (pageNumber > 1) {
      getEventShiftsListing(pageNumber, true);
    }
  }, [pageNumber, profile]);

  useEffect(() => {
    if (selectedOwnerId) {
      setEventData([]);
      setTotalItems(0);
      setPageNumber(1);
      getEventShiftsListing(1, false);
    }
  }, [selectedOwnerId]);

  const applyFilter = () => {
      setPageNumber(1);
      getEventShiftsListing(1, false);

    if (isMobileTab() && isSidebarActive) {
      handleSidebarToggle();
    }
  };


  const resetFilter = () => {
    setStatusFilter([]);
    setPageNumber(1);
    getEventShiftsListing(1, false, []);
  };


  const  DeclineEvent = async () =>{
    try {
      let response = await declineEvents(declineModal.id)
      toast.success(response.message);
      setEventData(e => {
        e.splice(declineModal.index,1)
        return e
      })
      setdeclineModal({})
    } catch (error) {
      toast.error(error.message);      
    }
  } 

  const getEventShiftsListing = async (page, key, filter) => {
    setIsLoading(true);

    try {
      let selectFilter = filter ? filter : selectedStatusFilter;
      selectFilter = selectFilter?.length === constants.SchedulerStatuseWorkingEvents.length ? [] : selectFilter
      const response = await getEventPublishedList(
        page,
        PAGE_SIZE,
        selectedOwnerId,
        selectFilter
      );
      if (response.statusCode === 200) {
        if (key) {
          setEventData((v) => [...v, ...response?.data]);
        } else {
          setEventData((v) => [...response?.data]);
        }
        setTotalItems(response.pagination.totalItems);
        setTotalPages(response.pagination.totalPages);
      }
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      toast.error(e.message);
    }
  };

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
        setEventData((e) => {
          e[eventDetailModal.index].eventRequestToJoins = [response?.data];
          return e;
        });
        toast.success(response.message);
        setselectedDate([])
        seteventDetailModal({});
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSidebarToggle = () => {
    setSidebarActive(!isSidebarActive);
    localStorage.setItem("isSidebarActive", !isSidebarActive);
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

  const withdrawEvent = async () => {
    setIsLoading(true);
    try {
      let response = await withDrawEvent(
        withdrawModal?.eventRequestToJoins[0].id
      );
      setEventData((e) => {
        e[withdrawModal.index].eventRequestToJoins = [];
        return e;
      });
      toast.success(response.message);
      setwithdrawModal({});
      setIsLoading(false);
    } catch (error) {
      toast.error(error.message);
      setIsLoading(false);
    }
  };

  return (
    <Fragment>
      {isLoading && <Loader />}
      <div className="scheduler-tabs-main-wrapper ">
        <StickySidebar
          isSidebarActive={isSidebarActive}
          handleSidebarToggle={handleSidebarToggle}
          resetFilter={resetFilter}
        >
          <Text size="15px" marginBottom="12px" weight="600" color="#102C42">
            {t("accountOwner.filters")}
          </Text>
          <Accordion
            preExpanded={["a"]}
            className="filter-accordion"
            allowZeroExpanded
          >
            <AccordionItem uuid="a">
              <AccordionItemHeading>
                <AccordionItemButton>{t("status")}</AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel>
                <EventsFilter
                  selectedStatus={selectedStatusFilter}
                  setStatusFilter={setStatusFilter}
                />
              </AccordionItemPanel>
            </AccordionItem>
          </Accordion>
          <div className={["filter-btn-box"]}>
            <button
              className={"button button-round button-shadow mr-3"}
              title={t("apply")}
              onClick={applyFilter}
            >
              {t("apply")}
            </button>
            <button
              className={
                "button button-round button-border button-dark reset-btn "
              }
              title={t("reset")}
              onClick={resetFilter}
            >
              {t("reset")}
            </button>
            <button
              className={
                "button button-round button-border button-dark cancel-btn"
              }
              title={t("close")}
              onClick={handleSidebarToggle}
            >
              {t("close")}
            </button>
          </div>
        </StickySidebar>
        <div className="tabs-right-col">
          <motion.div
            variants={animationVariants}
            initial="hidden"
            animate="show"
          >
            <InfiniteScroll
              dataLength={eventData.length}
              hasMore={eventData.length < totalItems}
              next={() => {
                if (pageNumber < totalPages) setPageNumber((v) => v + 1);
              }}
            >
              {eventData?.length > 0 &&
                eventData.map((item, index) => (
                  <WorkingEventsDetail
                    details={item}
                    key={index}
                    index={index}
                    seteventDetailModal={seteventDetailModal}
                    setwithdrawModal={setwithdrawModal}
                    setdeclineModal={setdeclineModal}
                  />
                ))}
            </InfiniteScroll>
          </motion.div>

          {eventData?.length === 0 && (
            <div className="scheduler-empty-box">
              <p>
                <img
                  src={require("assets/images/request-calendar.svg").default}
                  alt="icon"
                />{" "}
              </p>
              <Text size="25px" marginBottom="0" weight="500" color="#111B45">
                {t("scheduler.noEventsFound")}
              </Text>
            </div>
          )}
          {eventDetailModal?.id && (
            <RepeatEventModal
              seteventDetailModal={seteventDetailModal}
              eventDetailModal={eventDetailModal}
              requestToJoin={requestToJoinButton}
              selectedDate={selectedDate}
              selectMultipleDates={selectMultipleDates}
              selectedRepeatEvent={selectedRepeatEvent}
              setselectedDate={setselectedDate}
              setSelectedRepeatEvent={setSelectedRepeatEvent}
            />
          )}
          {withdrawModal?.id && ( <WithdrawEvent setwithdrawModal={setwithdrawModal} withdrawEvent={withdrawEvent}/>)}
           { declineModal?.id && <DeclineModal  setdeclineModal={setdeclineModal} DeclineEvent={DeclineEvent} />}
        </div>
      </div>
    </Fragment>
  );
}

export default withTranslation()(WorkingEventsShiftsTab);
