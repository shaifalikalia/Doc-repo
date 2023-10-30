import React, { useState, useEffect } from 'react';
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
import SchedulerCalendar from '../../../components/SchedulerCalendar';
import OfficeFilter from '../../../components/SchedulerFilters/OfficeFilter';
import styles from "./EventsShiftsTab.module.scss";
import EventsShiftsWeekly from './EventShiftsView/EventsShiftsWeekly';
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux';
import constants from '../../../../../../constants';
import moment from 'moment';
import CustomDropdown from 'components/Dropdown';
import EventsShiftsMonthly from './EventShiftsView/EventsShiftsMonthly';
import { cacheSideBarActive } from 'utils';


function EventsShiftsTab({ t }) {
    const profile = useSelector(state => state.userProfile.profile);
    let selectedOwnerId = 0;
    if (profile && profile.role) {
        if (profile.role.systemRole !== constants.systemRoles.staff) {
            selectedOwnerId = profile.id;
        } else {
            selectedOwnerId = localStorage.getItem('selectedOwner') ? JSON.parse(localStorage.getItem('selectedOwner')).id : selectedOwnerId;
        }
    }
    let cacheDate = sessionStorage.getItem(constants.EVENT_DATE_SESSION_KEY) ? sessionStorage.getItem(constants.EVENT_DATE_SESSION_KEY) :  new Date()
    
    const [currentDate, onDateChange] = useState(new Date(cacheDate));
    const [getDetailsOwnerIfStaff, setgetDetailsOwnerIfStaff] = useState()
    const [selectedOfficeFilter, setOfficeFilter] = useState([]);
    const [upDateList, setupDateList] = useState(true);
    const [totalEvents, settotalEvents] = useState(0);
    const [searchValue, setSearchValue] = useState('')
    
    const eventShiftsView = [
        { id: '1', name: 'Weekly' },
        { id: '2', name: 'Monthly' },
    ]
    let cacheViewType =sessionStorage.getItem(constants.EVENT_TYPE_SESSION_KEY) ? sessionStorage.getItem(constants.EVENT_TYPE_SESSION_KEY) :  eventShiftsView[1].id
    const [eventShiftsViewSelected, seteventShiftsViewSelected] = useState(cacheViewType);

    const [isSidebarActive, setSidebarActive] = useState(cacheSideBarActive());


    useEffect(() => {
        let ownerId = (profile.role.systemRole === constants.systemRoles.staff && selectedOwnerId) ? selectedOwnerId : profile?.id
        setgetDetailsOwnerIfStaff(ownerId)
        // eslint-disable-next-line
    }, [selectedOwnerId])



    useEffect(() => {
        sessionStorage.setItem(constants.EVENT_DATE_SESSION_KEY,currentDate)
    }, [currentDate])

    useEffect(() => {
        sessionStorage.setItem(constants.EVENT_TYPE_SESSION_KEY,eventShiftsViewSelected)
    }, [eventShiftsViewSelected])
    

    const applyFilter = () => {
        setupDateList(e => !e)
    }

    const resetFilter = () => {
        setSearchValue('')
        setOfficeFilter([])
        setupDateList(e => !e)

    }


    const handleSidebarToggle = () => {
        setSidebarActive(!isSidebarActive);
        localStorage.setItem("isSidebarActive", !isSidebarActive);
    };


    const dateChange = (type) =>{
        let changeDate = eventShiftsViewSelected === '1' ? 'week' : 'month'
        let date = null
        if(eventShiftsViewSelected === '1'){
            date = (type === constants.arrow.PREVIOUS) ? new Date(moment(currentDate).subtract(1,changeDate).startOf('isoweek')) : new Date(moment(currentDate).add(1,changeDate).startOf('isoweek'))
        }else{
            date =  (type === constants.arrow.PREVIOUS) ? new Date(moment(currentDate).subtract(1,changeDate).startOf('month')) : new Date(moment(currentDate).add(1,changeDate).startOf('month'))
        }
        
        date && onDateChange(date)
    }

    
    const onActiveStartDateChange =(value)=>{
        if(constants.calanderActions.includes(value?.action) || (value?.action === constants.calanderActionKey.drillDown && (value?.view === 'month' || value?.view === 'year' ))){            
            value?.activeStartDate && onDateChange(value.activeStartDate);
        }
    }

    return (
        <>
            <div className={`d-lg-flex d-none staff-calendar-select-box  ${styles["event-shift-view"]}`}>
                <div className='monthly-calendar-arrows'>
                    {eventShiftsViewSelected  && (
                        <>
                            <div className='arrow-img' onClick={() => dateChange(constants.arrow.PREVIOUS)}>
                                <img src={require('assets/images/monthly-arrow-left.svg').default} alt="icon" />
                            </div>

                            <div className='monthly-calendar-text'>

                                { eventShiftsViewSelected === "2" && moment(currentDate).format('MMM YYYY')}
                            
                            {
                                eventShiftsViewSelected === "1" &&
                                <>
                                        {
                                            `${moment(currentDate).startOf('isoweek').format('D MMM')} - ${moment(currentDate).endOf('isoweek').format('D MMM')} `
                                        }
                                        </>
                                    
                                }
                                </div>

                            <div className='arrow-img' onClick={() => dateChange(constants.arrow.NEXT)} >
                                <img src={require('assets/images/monthly-arrow-right.svg').default} alt="icon" />
                            </div>
                        </>)}
                </div>
                <CustomDropdown
                    options={eventShiftsView}
                    selectedOption={eventShiftsViewSelected}
                    selectOption={seteventShiftsViewSelected}
                />
            </div>
            <div className="scheduler-tabs-main-wrapper">
                <StickySidebar isSidebarActive={isSidebarActive} handleSidebarToggle={handleSidebarToggle} resetFilter={resetFilter}>
                    <SchedulerCalendar value={currentDate} onChange={onDateChange} onActiveStartDateChange={onActiveStartDateChange} />
                    <Text
                        size='15px'
                        marginBottom="12px"
                        weight='600'
                        color='#102C42' >
                        {t("accountOwner.filters")}
                    </Text>
                    <Accordion preExpanded={['a']} className="filter-accordion" allowZeroExpanded>
                        <AccordionItem uuid="a">
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
                        <button className={"button button-round button-border button-dark cancel-btn"}
                            title={t('close')}
                            onClick={handleSidebarToggle}

                        >
                            {t('close')}
                        </button>
                    </div>
                </StickySidebar>
                <div className="tabs-right-col">

                    <div className={styles["event-shift-header"]}>

                        <div className={"search-box " + styles["search-box"]} >

                            <input type="text" placeholder={t('accountOwner.searchForTagsEventsTitle')}
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}


                            />
                            <span className="ico">
                                <img src={require('assets/images/search-icon.svg').default} alt="icon" />
                            </span>
                        </div>
                        <Link to="/add-event" className={styles["add-event-btn"]}>
                            <button
                                className={"button button-round  button-shadow"} >
                                {t("accountOwner.newEvent")}
                            </button>
                        </Link>
                    </div>
                    <div className={`d-lg-none d-flex staff-calendar-select-box  ${styles["event-shift-view"]}`}>
                <div className='monthly-calendar-arrows'>
                <>
                            <div className='arrow-img' onClick={() => dateChange(constants.arrow.PREVIOUS)}>
                                <img src={require('assets/images/monthly-arrow-left.svg').default} alt="icon" />
                            </div>

                            <div className='monthly-calendar-text'>
                              { eventShiftsViewSelected === "2" && moment(currentDate).format('MMM YYYY')}
                            
                            {
                                eventShiftsViewSelected === "1" &&
                                <>
                                        {
                                            `${moment(currentDate).startOf('isoweek').format('D MMM')} - ${moment(currentDate).endOf('isoweek').format('D MMM')} `
                                        }
                                        </>
                                    
                                }
                            </div>
                            <div className='arrow-img' onClick={() => dateChange(constants.arrow.NEXT)}>
                                <img src={require('assets/images/monthly-arrow-right.svg').default} alt="icon" />
                            </div>
                        </>
                </div>
                <CustomDropdown
                    options={eventShiftsView}
                    selectedOption={eventShiftsViewSelected}
                    selectOption={seteventShiftsViewSelected}
                />
            </div>
                    {
                        totalEvents > 0 ?
                            <div className='d-flex align-items-center '> {totalEvents}{t('scheduler.eventFound')} </div>
                            :
                            <div className='d-none align-items-center'>
                                {t("scheduler.noEventsFound")}
                            </div>

                    }
                    {
                        (getDetailsOwnerIfStaff && (eventShiftsViewSelected === '1' ) ) &&
                        <EventsShiftsWeekly
                            selectedOfficeFilter={selectedOfficeFilter}
                            upDateListonApply={upDateList}
                            searchValue={searchValue}
                            getDetailsOwnerIfStaff={getDetailsOwnerIfStaff}
                            isSidebarActive={isSidebarActive}
                            handleSidebarToggle={handleSidebarToggle}
                            calendarView={eventShiftsViewSelected}
                            currentDate={currentDate}
                            setcurrentDate={onDateChange}
                            settotalEvents={settotalEvents}

                        />
                    }


                    {
                        (getDetailsOwnerIfStaff && eventShiftsViewSelected === '2') &&
                        <EventsShiftsMonthly
                            selectedOfficeFilter={selectedOfficeFilter}
                            upDateListonApply={upDateList}
                            searchValue={searchValue}
                            getDetailsOwnerIfStaff={getDetailsOwnerIfStaff}
                            isSidebarActive={isSidebarActive}
                            handleSidebarToggle={handleSidebarToggle}
                            calendarView={eventShiftsViewSelected}
                            currentDate={currentDate}
                            setcurrentDate={onDateChange}
                            settotalEvents={settotalEvents}

                        />
                    }

                </div>
            </div>
        </>
    );
}

export default withTranslation()(EventsShiftsTab);