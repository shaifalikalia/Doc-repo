import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import StickySidebar from '../../../components/StickySidebar';
import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
} from 'react-accessible-accordion';
import Text from 'components/Text';
import "./../../../Scheduler.scss";
import EventsFilter from '../../../components/SchedulerFilters/EventsFilter';
import EventDetail from '../../../components/SchedularEvents/EventDetail';
import OfficeFilter from '../../../components/SchedulerFilters/OfficeFilter';
import DatePicker from "react-datepicker";
import { Row, Col } from 'reactstrap';
import moment from 'moment';
import { getEventListByAssignedUser, acceptEventRequest, rejectEventRequest, cancelEventRequest, checkOverlapEvent } from 'repositories/scheduler-repository';
import { useSelector } from 'react-redux';
import constants from '../../../../../../constants';
import Loader from 'components/Loader';
import toast from 'react-hot-toast';

import RejectionModal from '../../../components/Modals/RejectionModal';
import ConfirmAcceptModal from '../../../components/Modals/ConfirmAcceptModal';
import { Portal } from "react-overlays";
import InfiniteScroll from 'react-infinite-scroll-component';
import { motion } from 'framer-motion'
import { isMobileTab, cacheSideBarActive } from 'utils';
import useReadOnlyDateTextInput from 'hooks/useReadOnlyDateTextInput';

const PAGE_SIZE = 5
const animationVariants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.05
        }
    }
}

function RequestbTab({ t }) {
    const profile = useSelector(state => state.userProfile.profile);
    const [totalItems, setTotalItems] = useState(0)
    const [pageNumber, setPageNumber] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [isLoading, setIsLoading] = useState(false);
    let selectedOwnerId = 0;
    if (profile && profile.role) {
        if (profile.role.systemRole !== constants.systemRoles.staff) {
            selectedOwnerId = profile.id;
        } else {
            selectedOwnerId = localStorage.getItem('selectedOwner') ? JSON.parse(localStorage.getItem('selectedOwner')).id : selectedOwnerId;
        }
    }
    const [errors, seterrors] = useState({});
    const [isBooked, setIsBooked] = useState(false);

    const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
    const [isConfirmAcceptModalOpen, setIsConfirmAcceptModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState({});
    const [eventData, setEventData] = useState({});
    const [isSidebarActive, setSidebarActive] = useState(cacheSideBarActive());


    const [selectedStatusFilter, setStatusFilter] = useState([]);
    const [selectedOfficeFilter, setOfficeFilter] = useState([]);
    const [filterIsUpdate, setfilterIsUpdate] = useState(true)
    const [reset, setReset] = useState(true)

    const startDatePickerRef = useReadOnlyDateTextInput();
    const endDatePickerRef = useReadOnlyDateTextInput();


    const [dates, setdates] = useState({
        from: moment().toDate(),
        to: moment().endOf('year').toDate()

    });

    useEffect(() => {
        getEventListing();
        // eslint-disable-next-line
    }, [selectedOwnerId, filterIsUpdate, reset]);

    useEffect(() => {
        if (pageNumber > 1) {
            getEventListing(true);
        }
        // eslint-disable-next-line
    }, [pageNumber]);




    const getEventListing = async (loadMore = false) => {
        if (!loadMore) {
            setEventData([]);
            setPageNumber(1);
            setTotalPages(1);
        }
        setIsLoading(true);
        try {

            const response = await getEventListByAssignedUser(pageNumber, PAGE_SIZE, selectedOwnerId, moment(dates.from).format('YYYY-MM-DD'), moment(dates.to).format('YYYY-MM-DD'), selectedOfficeFilter, selectedStatusFilter)

            if (response.statusCode === 200) {
                setEventData(v => [...v, ...response?.data]);
                setTotalItems(response.pagination.totalItems);
                setTotalPages(response.pagination.totalPages);
            }

            setIsLoading(false);

        } catch (e) {
            setIsLoading(false);
            toast.error(e.message);
        }
    }

    const updateDatesValues = (e, type) => {
        dates[type] = e
        setdates({ ...dates })
    }

    const applyFilter = () => {
        if (dates.from && !dates.to) {
            errors['to'] = t('form.errors.emptyField', { field: t('end date') })
        }
        if (dates.to && !dates.from) {
            errors['from'] = t('form.errors.emptyField', { field: t('start date') })
        }
        seterrors({ ...errors })


        if (Object.keys(errors)?.length === 0) {
            setfilterIsUpdate(e => !e)
            if (isMobileTab() && isSidebarActive) {
                handleSidebarToggle()
            }
        } else {
            scrollToError()
        }


    }

    const scrollToError = () => {
        setTimeout(() => {
            const error = document.getElementsByClassName('error-msg');
            if (error && error.length) {
                error[0].scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'start',
                });
            }
        }, 1000);
    }


    const confirmReject = async (reason) => {
        setIsLoading(true);
        setIsRejectionModalOpen(false);
        try {
            let getIndex = eventData.findIndex(item => item.id === selectedEvent.id )
            if (selectedEvent?.eventEmployees[0]?.status === constants.requestEventStatus.Accepted) {                        
                let res = await cancelEventRequest(selectedEvent.id, selectedEvent.office.id, reason);
                if(res){
                    eventData[getIndex].eventEmployees[0].reasonForCancel = reason
                    eventData[getIndex].eventEmployees[0].status = constants.requestEventStatus.Cancel
                    toast.success(t('scheduler.reqCancelledSuccessfully'));
                }
            } else {
                let res = await rejectEventRequest(selectedEvent.id, selectedEvent.office.id, reason);
                if(res){
                    eventData[getIndex].eventEmployees[0].reasonForRejection = reason
                    eventData[getIndex].eventEmployees[0].status = constants.requestEventStatus.Reject
                    toast.success(t('scheduler.reqRejectSuccessfully'));
                }
            }
            setEventData([...eventData]);
            setIsLoading(false);

        } catch (e) {
            setIsLoading(false);
            toast.error(e.message)
        }
    }

    const confirmAccept = async () => {
        setIsLoading(true);
        setIsConfirmAcceptModalOpen(false);
        try {
            let getIndex = eventData.findIndex(item => item.id === selectedEvent.id )
            let res = await acceptEventRequest(selectedEvent.id, selectedEvent.office.id)
            if(res){
                eventData[getIndex].eventEmployees[0].reasonForRejection = null
                eventData[getIndex].eventEmployees[0].reasonForCancel = null
                eventData[getIndex].eventEmployees[0].status = constants.requestEventStatus.Accepted
                setEventData([...eventData]);
                setIsLoading(false);
                toast.success(t('scheduler.reqAcceptSuccessfully'));
            }
        } catch (e) {
            setIsLoading(false);
            toast.error(e.message)
        }
    }

    const checkEventSlot = async (details) => {
        setIsLoading(true);
        setIsBooked(false);
        try {
            let response = await checkOverlapEvent(details.id, details.ownerId)
            setIsLoading(false);
            setIsBooked(response?.data);
            setIsConfirmAcceptModalOpen(true);
            setSelectedEvent(details);
        } catch (e) {
            setIsLoading(false);
            toast.error(e.message);
        }
    }
    const CalendarContainer = ({ children }) => {
        const el = document.getElementById("calendar-portal");

        return <Portal container={el}>{children}</Portal>;
    };

    const resetFilter = () => {

        setStatusFilter([])
        setOfficeFilter([])
        setdates({
            from: moment().toDate(),
            to: moment().endOf('year').toDate()

        })
        setReset(e => !e)
    }



    const handleSidebarToggle = () => {
        setSidebarActive(!isSidebarActive);
        localStorage.setItem("isSidebarActive", !isSidebarActive);
    };



    return (
        <>
            {(isLoading) && <Loader />}
            <div className="scheduler-tabs-main-wrapper">
                <StickySidebar isSidebarActive={isSidebarActive} handleSidebarToggle={handleSidebarToggle} resetFilter={resetFilter}>
                    <Text
                        size='15px'
                        marginBottom="12px"
                        weight='600'
                        color='#102C42' >
                        {t("accountOwner.dateRange")}
                    </Text>
                    <Row className="pb-2">
                        <Col xs="6">
                            <div className="c-field">
                                <label>{t('from')}</label>
                                <div className="d-flex inputdate">

                                    <DatePicker
                                        dateFormat="dd-MM-yyyy"
                                        className="c-form-control"
                                        selected={dates.from}
                                        onChange={(e) => updateDatesValues(e, 'from')}
                                        maxDate={dates.to}
                                        popperPlacement="bottom-start"
                                        popperContainer={CalendarContainer}
                                        ref={startDatePickerRef}
                                    />
                                    {errors.from && <span className="error-msg" style={{ display: 'inline' }}>{errors.from}</span>}

                                </div>
                            </div>
                        </Col>
                        <Col xs="6">
                            <div className="c-field">
                                <label>{t('to')}</label>
                                <div className="d-flex inputdate">
                                    <DatePicker
                                        dateFormat="dd-MM-yyyy"
                                        className="c-form-control"
                                        selected={dates.to}
                                        minDate={dates.from}
                                        onChange={(e) => updateDatesValues(e, 'to')}
                                        popperPlacement="bottom-end"
                                        popperContainer={CalendarContainer}
                                        ref={endDatePickerRef}
                                    />
                                    {errors.to && <span className="error-msg" style={{ display: 'inline' }}>{errors.to}</span>}

                                </div>
                            </div>
                        </Col>
                    </Row>

                    <Text
                        size='15px'
                        marginBottom="12px"
                        weight='600'
                        color='#102C42' >
                        {t("accountOwner.filters")}
                    </Text>
                    <Accordion preExpanded={['a', "b"]} className="filter-accordion" allowZeroExpanded>
                        <AccordionItem uuid="a">
                            <AccordionItemHeading>
                                <AccordionItemButton>
                                    {t("status")}
                                </AccordionItemButton>
                            </AccordionItemHeading>
                            <AccordionItemPanel>
                                <EventsFilter selectedStatus={selectedStatusFilter} setStatusFilter={setStatusFilter} />
                            </AccordionItemPanel>
                        </AccordionItem>
                        <AccordionItem uuid="b">
                            <AccordionItemHeading>
                                <AccordionItemButton>
                                    {t("offices")}
                                </AccordionItemButton>
                            </AccordionItemHeading>
                            <AccordionItemPanel>
                                <OfficeFilter selectedOffice={selectedOfficeFilter} setOfficeFilter={setOfficeFilter} selectedOwnerId={selectedOwnerId} />
                            </AccordionItemPanel>
                        </AccordionItem>
                    </Accordion>
                    <div className={["filter-btn-box"]}>
                        <button className={"button button-round button-shadow mr-3"}
                            title={t("apply")}
                            onClick={applyFilter}
                        >
                            {t("apply")}
                        </button>
                        <button className={"button button-round button-border button-dark reset-btn"}
                            title={t('reset')}
                            onClick={resetFilter}


                        >
                            {t('reset')}
                        </button>
                        <button
                            className={"button button-round button-border button-dark cancel-btn"}
                            onClick={handleSidebarToggle}

                            title={t('close')}>
                            {t('close')}
                        </button>
                    </div>
                </StickySidebar>

                <div className="tabs-right-col">
                    {eventData.length > 0 &&
                        <motion.div
                            variants={animationVariants}
                            initial='hidden'
                            animate='show'>
                            <InfiniteScroll
                                dataLength={eventData.length}
                                hasMore={eventData.length < totalItems}
                                next={() => { if (pageNumber < totalPages) setPageNumber(v => v + 1) }}>
                                {eventData.map((item, key) => (
                                    <EventDetail details={item} key={key} setIsRejectionModalOpen={setIsRejectionModalOpen} checkEventSlot={checkEventSlot} setSelectedEvent={setSelectedEvent} />
                                ))}
                            </InfiniteScroll>

                        </motion.div>
                    }
                    {(!eventData || eventData.length === 0) && (
                        <div className="scheduler-empty-box">
                            <p><img src={require("assets/images/request-calendar.svg").default} alt="icon" /> </p>
                            <Text
                                size='25px'
                                marginBottom="0"
                                weight='500'
                                color='#111B45' >
                                {t("accountOwner.ouDontHaveAnyPendingRequests")}
                            </Text>
                        </div>)}
                </div>
            </div>

            {isRejectionModalOpen && <RejectionModal isRejectionModalOpen={isRejectionModalOpen}
                setIsRejectionModalOpen={setIsRejectionModalOpen} confirmReject={confirmReject} isCancel={selectedEvent?.eventEmployees[0]?.status === 2}
            />}
            {isConfirmAcceptModalOpen && <ConfirmAcceptModal isConfirmAcceptModalOpen={isConfirmAcceptModalOpen}
                setIsConfirmAcceptModalOpen={setIsConfirmAcceptModalOpen} confirmAccept={confirmAccept} isBooked={isBooked}
            />}</>

    );
}

export default withTranslation()(RequestbTab);