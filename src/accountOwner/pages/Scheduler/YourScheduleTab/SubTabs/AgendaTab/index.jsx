import React, { useEffect, useState, useMemo } from 'react';
import SchedulerCalendar from '../../../components/SchedulerCalendar';
import StickySidebar from '../../../components/StickySidebar';
import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
} from 'react-accessible-accordion';
import OfficeFilter from '../../../components/SchedulerFilters/OfficeFilter';
import Text from 'components/Text';
import { withTranslation } from 'react-i18next';
import "./../../../Scheduler.scss";
import styles from "./AgendaTab.module.scss";
import AgendaDailyView from './AgendaView/AgendaDailyView';
import AgendaWeeklyView from './AgendaView/AgendaWeeklyView';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import constants from '../../../../../../constants';
import { useSelector } from 'react-redux';
import { isMobileTab, cacheSideBarActive } from 'utils';
import moment from 'moment';
import AddToCalendar from 'accountOwner/pages/components/AddToCalendar';
import CustomModal from 'components/CustomModal';
import { getSyncCalendar } from 'repositories/scheduler-repository';
import toast from 'react-hot-toast';
import Loader from 'components/Loader';
import SyncModal from 'accountOwner/pages/Scheduler/components/Modals/SyncModal';
import AgendaMonthView from './AgendaView/AgendaMonthView';
import CustomDropdown from 'components/Dropdown';


function AgendaTab({ t, agendaFiltersData }) {

    const [toolTipModal, setToolTipModal] = useState(false);
    const [syncModal, setSyncModal] = useState(false);
    const [syncLoading, setSyncLoading] = useState(false);
    const [syncUrl, setSyncUrl] = useState(null);
    const profile = useSelector(state => state.userProfile.profile);
    let selectedOwnerId = 0;
    let currentUserId = null;
    if (profile && profile.role) {
        if (profile.role.systemRole !== constants.systemRoles.staff) {
            selectedOwnerId = profile.id;
        } else {
            selectedOwnerId = localStorage.getItem('selectedOwner') ? JSON.parse(localStorage.getItem('selectedOwner')).id : selectedOwnerId;
        }
        currentUserId = profile.id;
    }

    let cachedDate = sessionStorage.getItem('selectedDate');
    cachedDate = cachedDate ? new Date(cachedDate) : new Date();
    const [currentDate, onDateChange] = useState(cachedDate);

    useEffect(() => {
        sessionStorage.setItem("selectedDate", moment(currentDate).format('YYYY-MM-DD'));
    }, [currentDate])

    const agendaView = [
        { id: '1', name: 'Daily' },
        { id: '2', name: 'Weekly' },
        { id: '3', name: 'Monthly' }
    ]
    const cachedView = sessionStorage.getItem('agendaView') || null;

    const [agendaViewSelected, setAgendaViewSelected] = useState(cachedView || agendaView[0].id);

    useEffect(() => {
        sessionStorage.setItem("agendaView", agendaViewSelected);
    }, [agendaViewSelected])


    const { selectedOfficeFilter, setOfficeFilter, apiOffices, setApiOffices, resetFilters: resetAgendaFilters } = agendaFiltersData;

    const [isSidebarActive, setSidebarActive] = useState(cacheSideBarActive());



    const handleSidebarToggle = () => {
        setSidebarActive(!isSidebarActive);
        localStorage.setItem("isSidebarActive", !isSidebarActive);
    };

    const resetFilter = () => {
        resetAgendaFilters()
    }

    const applyFilter = () => {
        setApiOffices(selectedOfficeFilter);
        if (isMobileTab() && isSidebarActive && selectedOfficeFilter?.length) {
            handleSidebarToggle()
        }
    }

    const handleAddToCalendar = async () => {
        setSyncLoading(true);
        const isWeekly = agendaViewSelected === "2";
        const isMonthly = agendaViewSelected === "3";
        let startDate = moment(currentDate).format("YYYY-MM-DD");
        if (isWeekly) {
            startDate = moment(currentDate).startOf('isoWeek').format("YYYY-MM-DD");
        } else if (isMonthly) {
            startDate = moment(currentDate).startOf('month').format("YYYY-MM-DD");
        }
        try {
            const { data } = await getSyncCalendar(selectedOwnerId, startDate);
            setSyncLoading(false);
            setSyncUrl(data);
            setSyncModal(true)
        } catch (error) {
            toast.error(error.message);
            setSyncLoading(false);
        }
    }



    const dateChange = (type) => {
        let changeDate = agendaViewSelected === '2' ? 'week' : 'month'
        let date = null
        if (agendaViewSelected === '1') {
            date = (type === constants.arrow.PREVIOUS) ? new Date(moment(currentDate).subtract(1, 'day')) : new Date(moment(currentDate).add(1, 'day'))
        }
        if (agendaViewSelected === '2') {
            date = (type === constants.arrow.PREVIOUS) ? new Date(moment(currentDate).subtract(1, changeDate).startOf('isoweek')) : new Date(moment(currentDate).add(1, changeDate).startOf('isoweek'))
        }
        if (agendaViewSelected === '3') {
            date = (type === constants.arrow.PREVIOUS) ? new Date(moment(currentDate).subtract(1, changeDate).startOf('month')) : new Date(moment(currentDate).add(1, changeDate).startOf('month'))
        }

        date && onDateChange(date)
    }

    const onActiveStartDateChange = (value) => {
        if (constants.calanderActions.includes(value?.action) || (value?.action === constants.calanderActionKey.drillDown && (value?.view === 'month' || value?.view === 'year'))) {
            value?.activeStartDate && onDateChange(value.activeStartDate);
        }

    }

    const syncCalenderText = useMemo(() => (
        <>
            <p>Syncing the calendar allows you to add all the events showing in the Agenda to your personal calendar on the web.</p>
            <p>You can sync the Scheduler with your personal calendar by following the below-mentioned steps:</p>
            <ol>
                <li>Click on the Sync link.</li>
                <li>Click on the link to copy the link.</li>
                <li>To sync Agenda on Google Calendar, open <a href='http://calendar.google.com' rel='noreferrer' className='link-btn' target="_blank">calendar.google.com</a> on the browser.</li>
                <li>Click on Add Calendar + icon on Google Calendar.</li>
                <li>Select “From URL” from the available options.</li>
                <li>Paste the URL that you copied from Agenda.</li>
                <li>Click on the button for “Add Calendar”.</li>
            </ol>
            <p>Once added, all the events from the Agenda screen will be added to Google Calendar. By doing so, whenever a new event is added in the Scheduler Agenda, the same will be added in the Google calendar as well.</p>
            <p>You can follow the same steps to sync the Agenda with other calendars such as Outlook etc.</p>
            <p>You can also unsubscribe to the calendar to remove the Agenda events from your personal calendar.</p>
        </>
    ), [])

    return (
        <div className="scheduler-tabs-main-wrapper agenda-daily-view">
            {syncLoading && <Loader />}
            <StickySidebar isSidebarActive={isSidebarActive} handleSidebarToggle={handleSidebarToggle}  resetFilter={resetFilter} >
                <SchedulerCalendar value={currentDate} onChange={onDateChange}
                    onActiveStartDateChange={onActiveStartDateChange}
                />
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
                    <button className={"button button-round button-shadow mr-3"} title={t("apply")} onClick={applyFilter}> {t("apply")}
                    </button>
                    <button className={"button button-round button-border button-dark reset-btn "}
                        title={t('reset')} onClick={resetFilter}>
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
                <div className={styles["staff-availability-header"]}>
                    <ul className={styles["view-color-list"]}>
                        <li>
                            <div className={styles["color-box"]} />
                            <div className={styles["text-box"]}> {t("accountOwner.createdByYou")}  </div>
                        </li>
                        <li>
                            <div className={styles["color-box"] + " " + styles["color-grey"]} />
                            <div className={styles["text-box"]}> {t("accountOwner.createdByOthers")}  </div>
                        </li>
                        <li>
                            <div className={styles["color-box"] + " " + styles["color-blue"]} />
                            <div className={styles["text-box"]}> {t("accountOwner.eventsNotAccepted")}  </div>
                        </li>
                        <li>
                            <div className={styles["color-box"] + " " + styles["color-orange"]} />
                            <div className={styles["text-box"]}> {t("accountOwner.busy")}  </div>
                        </li>
                        <li>
                            <div className={styles["color-box"] + " " + styles["color-red"]} />
                            <div className={styles["text-box"]}> {t("accountOwner.onLeave")}  </div>
                        </li>
                        <li>
                            <div className={styles["color-box"] + " " + styles["light-purple-bg"]} />
                            <div className={styles["text-box"]}> {t("appointments")}  </div>
                        </li>
                    </ul>
                    <div className='d-flex staff-calendar-select-box'>
                        <div className='monthly-calendar-arrows'>
                            <>
                                <div className='arrow-img' onClick={() => dateChange(constants.arrow.PREVIOUS)}>
                                    <img src={require('assets/images/monthly-arrow-left.svg').default} alt="icon" />
                                </div>

                                <div className='monthly-calendar-text'>
                                    {agendaViewSelected === "1" && moment(currentDate).format('MMM DD, ddd')}
                                    {agendaViewSelected === "3" && moment(currentDate).format('MMM YYYY')}

                                    {
                                        agendaViewSelected === "2" &&
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
                            options={agendaView}
                            selectedOption={agendaViewSelected}
                            selectOption={setAgendaViewSelected}
                        />
                    </div>

                </div>
                <div className={styles["agenda-header"]}>
                    <div>
                        <AddToCalendar
                            firstIcon={require('assets/images/ico_sync.svg').default}
                            middleText={t('accountOwner.sync')}
                            secondIcon={require('assets/images/alert-circle.svg').default}
                            handleAddToCalendar={handleAddToCalendar}
                            setToolTipModal={setToolTipModal}
                        />
                    </div>
                    <Link to="/add-busy-slots"
                        className={"button button-round button-shadow " + styles.button}
                    >
                        {t("accountOwner.addBusyTimeslots")}
                    </Link>
                </div>
                {
                    agendaViewSelected === "1" &&
                    <AgendaDailyView
                        isSidebarActive={isSidebarActive}
                        currentDate={currentDate}
                        selectedOwnerId={selectedOwnerId}
                        currentUserId={currentUserId}
                        apiOffices={apiOffices}
                        setCurrentDate={onDateChange}
                    />
                }
                {
                    (agendaViewSelected === "2") &&
                    <AgendaWeeklyView
                        isSidebarActive={isSidebarActive}
                        currentDate={currentDate}
                        setCurrentDate={onDateChange}
                        isWeekly={agendaViewSelected === "2"}
                        selectedOwnerId={selectedOwnerId}
                        currentUserId={currentUserId}
                        apiOffices={apiOffices}
                    />
                }

                {
                    agendaViewSelected === "3" &&
                    <AgendaMonthView
                        isSidebarActive={isSidebarActive}
                        currentDate={currentDate}
                        setCurrentDate={onDateChange}
                        isWeekly={agendaViewSelected === "2"}
                        selectedOwnerId={selectedOwnerId}
                        currentUserId={currentUserId}
                        apiOffices={apiOffices}
                    />
                }

                <CustomModal
                    isOpen={toolTipModal}
                    setIsOpen={setToolTipModal}
                    title={t('accountOwner.syncModalTitle')}
                    subTitle1={syncCalenderText}
                    calender={true}
                />
                <SyncModal
                    isOpen={syncModal}
                    setIsOpen={setSyncModal}
                    title={t('accountOwner.syncModalTitle')}
                    syncUrl={syncUrl}
                />
            </div>
        </div>
    );
}

export default withTranslation()(AgendaTab);