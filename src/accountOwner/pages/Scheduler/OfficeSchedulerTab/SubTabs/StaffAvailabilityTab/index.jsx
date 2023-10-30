import React, { useEffect, useState } from 'react';
import SchedulerCalendar from '../../../components/SchedulerCalendar';
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
import OfficeFilter from '../../../components/SchedulerFilters/OfficeFilter';
import { withTranslation } from 'react-i18next';
import EmployeesFilter from '../../../components/SchedulerFilters/EmployeesFilter';
import styles from "./StaffAvailabilityTab.module.scss";
import StaffAvailabilityWeeklyView from './StaffAvailabilityView/StaffAvailabilityWeeklyView';
import { getStaffMembersList } from 'repositories/scheduler-repository';
import constants from '../../../../../../constants';
import { useSelector } from 'react-redux';
import { isMobileTab } from 'utils';
import MonthlyViewNew from './StaffAvailabilityView/MonthlyViewNew';
import moment from 'moment';
import CustomDropdown from 'components/Dropdown';
import Loader from 'components/Loader';
import toast from 'react-hot-toast';
import { cacheSideBarActive } from 'utils';




function StaffAvailabilityTab({ t, staffAvailFiltersData }) {
    const profile = useSelector(state => state.userProfile.profile);
    const [isLoader, setIsLoader] = useState(false)
    
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

    let cachedDate = sessionStorage.getItem(constants.staffAvalibilityDate);
    cachedDate = cachedDate ? new Date(cachedDate) : new Date();
    const [currentDate, onDateChange] = useState(cachedDate);
    useEffect(() => {
        sessionStorage.setItem(constants.staffAvalibilityDate, moment(currentDate).format('YYYY-MM-DD'));
    }, [currentDate])


    const staffAvailabilityView = [
        { id: '1', name: 'Monthly' },
        { id: '2', name: 'Weekly ' },
    ]
    let setView =  sessionStorage.getItem(constants.staffAvalibility) ? sessionStorage.getItem(constants.staffAvalibility) : staffAvailabilityView[1].id
    const [staffAvailabilityViewSelected, setStaffAvailabilityViewSelected] = useState(setView);
    const { 
        apiOffices, 
        setApiOffices, 
        apiEmps, 
        setApiEmps, 
        selectedOfficeFilter, 
        setOfficeFilter, 
        selectedEmpFilter, 
        setEmpFilter, 
        employeeList, 
        setEmployeeList,
        resetFilters 
    } = staffAvailFiltersData;

    
    const [isSidebarActive, setSidebarActive] = useState(cacheSideBarActive());


    useEffect(() =>{
        sessionStorage.setItem(constants.staffAvalibility,staffAvailabilityViewSelected)
    },[staffAvailabilityViewSelected])

    const getEmployeeList = async (id) => {
        setIsLoader(true)
        try {
            let res = await getStaffMembersList(selectedOwnerId,id)
            res && setEmployeeList(res.data)
        } catch (error) {
            toast.error(error.message)
        }
        setIsLoader(false)
    }
    
    useEffect(() => {
        if(apiOffices.length){
            getEmployeeList(apiOffices);
        } 
    }, [])
    
    const handleSidebarToggle = () => {
        setSidebarActive(!isSidebarActive);
        localStorage.setItem("isSidebarActive", !isSidebarActive);
    };

    const applyFilter =()=>{
        setApiOffices(selectedOfficeFilter);
        setApiEmps(selectedEmpFilter);
        if (selectedOfficeFilter?.length && isMobileTab()) {
            handleSidebarToggle() 
        }
    }


    const dateChange = (type) =>{
        let changeDate = staffAvailabilityViewSelected === '2' ? 'week' : 'month'
        let date = null
        if(staffAvailabilityViewSelected === '2'){
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
        <div className="scheduler-tabs-main-wrapper">
            {
                isLoader &&
            <Loader />
            }
            <StickySidebar isSidebarActive={isSidebarActive} handleSidebarToggle={handleSidebarToggle} resetFilter={resetFilters} >
                <SchedulerCalendar value={currentDate} onChange={onDateChange} onActiveStartDateChange={onActiveStartDateChange} />
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
                                {t("offices")}
                            </AccordionItemButton>
                        </AccordionItemHeading>
                        <AccordionItemPanel>
                            <OfficeFilter getEmployeeList={getEmployeeList} selectedOffice={selectedOfficeFilter} setOfficeFilter={setOfficeFilter} selectedOwnerId={selectedOwnerId} />
                        </AccordionItemPanel>
                    </AccordionItem>
                    {employeeList.length > 0 && <AccordionItem uuid="b">
                        <AccordionItemHeading>
                            <AccordionItemButton>
                                {t("accountOwner.employees")}
                            </AccordionItemButton>
                        </AccordionItemHeading>
                        <AccordionItemPanel>
                            <EmployeesFilter
                                employeeList={employeeList}
                                selectedEmpFilter={selectedEmpFilter}
                                setEmpFilter={setEmpFilter}
                            />
                        </AccordionItemPanel>
                    </AccordionItem>
                    }
                </Accordion>
                <div className={["filter-btn-box"]}>
                    <button className={"button button-round button-shadow mr-3"} title={t("apply")} onClick={() => applyFilter()} > {t("apply")} </button>
                    <button className={"button button-round button-border button-dark reset-btn"}
                        onClick={resetFilters}
                        title={t('reset')}>
                        {t('reset')}
                    </button>
                    <button className={"button button-round button-border button-dark cancel-btn"} title={t('close')} onClick={handleSidebarToggle}>
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
                        <div  className='monthly-calendar-arrows'>
                            {staffAvailabilityViewSelected  && (
                                <>
                                    <div className='arrow-img' onClick={()=> dateChange(constants.arrow.PREVIOUS)}>
                                        <img src={require('assets/images/monthly-arrow-left.svg').default} alt="icon" />
                                    </div>

                                     <div className='monthly-calendar-text'>

                                     { staffAvailabilityViewSelected === "1" && moment(currentDate).format('MMM YYYY')}
                                     {
                                         staffAvailabilityViewSelected === "2" &&
                                         <>
                                        {
                                            `${moment(currentDate).startOf('isoweek').format('D MMM')} - ${moment(currentDate).endOf('isoweek').format('D MMM')} `
                                        }
                                        </> 
                                    }
                                    </div>
                                    <div className='arrow-img' onClick={()=> dateChange(constants.arrow.NEXT)}>
                                        <img src={require('assets/images/monthly-arrow-right.svg').default} alt="icon" />
                                    </div>
                                </>)}
                        </div>
                        <CustomDropdown
                            options={staffAvailabilityView}
                            selectedOption={staffAvailabilityViewSelected}
                            selectOption={setStaffAvailabilityViewSelected}
                        />
                    </div>
                </div>


                
                {
                    staffAvailabilityViewSelected === "2" ?
                <StaffAvailabilityWeeklyView
                    currentDate={currentDate}
                    selectedOwnerId={selectedOwnerId}
                    currentUserId={currentUserId}
                    apiOffices={apiOffices}
                    apiEmps={apiEmps}
                    onDateChange={onDateChange}
                    isSidebarActive={isSidebarActive}
                    isWeekly={staffAvailabilityViewSelected === "2"}
                /> :

                <MonthlyViewNew 
                currentDate={currentDate}
                selectedOwnerId={selectedOwnerId}
                currentUserId={currentUserId}
                apiOffices={apiOffices}
                apiEmps={apiEmps}
                onDateChange={onDateChange}
                isSidebarActive={isSidebarActive}
                />
                }
            </div>
        </div>
    );
}

export default withTranslation()(StaffAvailabilityTab);