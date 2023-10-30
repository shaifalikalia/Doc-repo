import React, { useState, useEffect, createRef } from 'react';
import styles from "./../../../../Scheduler.module.scss";
import * as moment from 'moment';
import { encodeId, generateMonth, generateWeek } from 'utils';
import { isMobileTab } from 'utils';
import toast from 'react-hot-toast';
import { withTranslation } from 'react-i18next';
import { useGetAgenda } from 'repositories/scheduler-repository';
import Loader from 'components/Loader';
import constants from '../../../../../../../constants.js';
import { useHistory } from 'react-router-dom';
import MoveToApp from 'accountOwner/pages/Scheduler/components/Modals/MoveToApp';


function AgendaWeeklyView({ t, isSidebarActive , currentDate,setCurrentDate, isWeekly, selectedOwnerId, currentUserId, apiOffices }) {
    const calendarRef = createRef(null);
    const [weekData, setWeekData] = useState([]);
    const [monthData, setMonthData] = useState([]);
    const [dateRange, setDateRange] = useState(null);
    const [isModal,setIsModal] = useState({open: false})

    const scrollWidth = 125;
    const history = useHistory();

    useEffect(() => {
        getWeeksDates(currentDate);
        getMonthDates(currentDate);
        if(isMobileTab() && isSidebarActive ){
            toast.success(t('accountOwner.dateApply'))
        }
        // eslint-disable-next-line
    }, [currentDate, isWeekly]);

    const getWeeksDates = (_currentDate) => {
        const selectedStartWeek = moment(_currentDate).startOf('isoWeek');
        const selectedEndWeek = moment(_currentDate).endOf('isoWeek');
        const currentweekData = generateWeek(selectedStartWeek, selectedEndWeek);
        if(isWeekly) {
            setDateRange({
                startDate: moment(selectedStartWeek).format('YYYY-MM-DD'),
                endDate: moment(selectedEndWeek).format('YYYY-MM-DD')
            })
        }
        setWeekData(currentweekData);
    }

    const getMonthDates = (_currentDate) => {
        const monthDates = generateMonth(_currentDate);
        const monthLength = monthDates.length;
        if(!isWeekly) {
            setDateRange({
                startDate: moment(monthDates[0].date).format('YYYY-MM-DD'),
                endDate: moment(monthDates[monthLength - 1].date).format('YYYY-MM-DD')
            })
        }
        setMonthData(monthDates);
    }

    const enableFetch = (selectedOwnerId && dateRange) ? true : false;
    const { isLoading, isFetching, data: agenda, error } = useGetAgenda(selectedOwnerId, dateRange?.startDate, dateRange?.endDate, apiOffices, { enabled: enableFetch });
    
    useEffect(() => {
        if(!isLoading && !isFetching && error?.message){
            toast.error(error.message)
        }
        //eslint-disable-next-line
    }, [error])

    const tableWeekDates = weekData.map((v, i) => (
        <th key={i} className={styles["height-60"]}>
            {v.mDate}
        </th>
    ));

    const tableMonthDates = monthData.map((v, i) => (
        <th key={i} className={styles["height-60"]}>
            {v.mDate}
        </th>
    ))

    const goToDetails = (id, type, createdByMe, isInvite) => {
        if(!id || !type) return;
        switch(type){
            case constants.agendaType.EVENT: {
                let pathname = '/';
                pathname = createdByMe ? 
                            constants.routes.scheduler.eventDetails.replace(':eventId', encodeId(id)) :
                            isInvite ? constants.routes.scheduler.eventRequestDetails.replace(':eventId', encodeId(id)) :
                            constants.routes.scheduler.EventWorkingDetails.replace(':eventId', encodeId(id))
                history.push(pathname);
                break;
            }
            case constants.agendaType.BUSY_SLOT: {
                const pathname = constants.routes.scheduler.busySlotDetail.replace(':busySlotId', encodeId(id));
                history.push(pathname);
                break;
            }
            default: {
                return;
            }
        }
    }
    
    
    const getUsefulInfo = (item) => {
        const id = item?.id;
        const officeName = item?.officeName || null;
        let title = item?.title || item?.reasonForBlock || null;
        title = (title && (title.length > constants.agendaTitleLength)) ? title.slice(0, constants.agendaTitleLength).concat(' ...') : title;
        const timezoneCode = item?.timezoneCode || null;
        const isAllDayEvent = item?.isAllDayEvent;
        const timeString = item?.isAllDayEvent ? t('scheduler.agenda.allDayEvent')
            : (
                moment(item?.startTime).format('h:mm A') + " - " +
                moment(item?.endTime).format('h:mm A')
            )
        //sepecific to Schedular events
        const createdByMe = item.createdById === currentUserId; 
        const isInvite = !!item.eventEmployeeStatus;
        const status = item.eventEmployeeStatus || item.eventRequestToJoinStatus;
        let backgroudColorClass;
        backgroudColorClass = createdByMe ? '' : status === constants.SCHEDULERSTATUS.PENDING ? 'color-blue' : 'color-grey';
        return {
            officeName,
            title,
            timezoneCode,
            timeString,
            id,
            isAllDayEvent,
            createdByMe,
            isInvite,
            status,
            backgroudColorClass
        }
    }
    const getAppointmentsView = (item, index) => {
        
        const data = getUsefulInfo(item);
        return (
            <div key={index} className={styles["scheduler-event-box"] + " " + styles['light-purple-bg']}
            onClick={() =>  {
                setIsModal({open:true,type:constants.agendaType.APPOINTMENT})
            }}
            >
                <div className={styles["event-tag"] + " " + styles['dark-grey-bg']}>{t('scheduler.agenda.appointmentTag')}</div>
                <div className={styles["event-date"]}>
                    {data.timeString}
                    {data.timezoneCode ? ` (${data.timezoneCode})` : null}
                </div>
                <div className={styles["event-office"]}>{data.officeName}</div>
                <div className={styles["event-type"]}>{t('scheduler.agenda.appointmentTitle')}</div>
            </div>
        )
    }
    const getSchedulerEventsView = (item, index) => {
        
        const data = getUsefulInfo(item);
        return (
            <div
                key={index}
                className={styles["scheduler-event-box"] + " " + styles[data.backgroudColorClass] + " cursor-pointer "}
                onClick={() => goToDetails(data.id, constants.agendaType.EVENT, data.createdByMe, data.isInvite)}
            >
                <div className={styles["event-tag"] + " " + styles['theme-green-bg']}>{t('scheduler.agenda.eventTag')}</div>
                <div className={styles["event-date"]}>
                    {data.timeString}
                    {data.timezoneCode ? ` (${data.timezoneCode})` : null}
                </div>
                <div className={styles["event-office"]}>{data.officeName}</div>
                <div className={styles["event-type"]}> {data.title} </div>
            </div>
        )
    }
    const getSchedulerBusySlotsView = (item, index,shouldRedirect) => {
        
        const data = getUsefulInfo(item);
        return (
            <div 
                key={index} 
                className={styles["scheduler-event-box"] + " " + styles['light-orange-bg'] + " cursor-pointer " } 
                onClick={() =>  {
                    if(shouldRedirect) {
                        goToDetails(data.id, constants.agendaType.BUSY_SLOT)
                    }else{
                        setIsModal({open:true,type:constants.agendaType.BLOCKED})
                    }
                }}
            >
                <div className={styles["event-tag"] + " " + styles['dark-orange-bg']}>{t('scheduler.agenda.busyTag')}</div>
                <div className={styles["event-date"]}>
                    {data.timeString}
                    {data.timezoneCode ? ` (${data.timezoneCode})` : null}
                </div>
                <div className={styles["event-office"]}>{data.officeName} </div>
                <div className={styles["event-type"]}> {data.title} </div>
            </div>
        )
    }
    const getLeavesView = (item, index) => {
        
        const data = getUsefulInfo(item);
        return (
            <div key={index} className={styles["scheduler-event-box"] + " " + styles['light-red-bg']} 
            onClick={() =>  {
                setIsModal({open:true,type:constants.agendaType.LEAVE})
            }}
            >
                <div className={styles["event-tag"] + " " + styles['dark-red-bg']}>{t('scheduler.agenda.leaveTag')}</div>
                <div className={styles["event-date"]}>{t('scheduler.agenda.leaveTitle')}</div>
                <div className={styles["event-office"]}>{data.officeName}</div>
            </div>
        )
    }
    const getDifferentEvents = (events) => {
        return events.reduce((acc, item) => {
            const { isAllDayEvent } = item;
            if(isAllDayEvent){
                acc[0].push(item);
            } else {
                acc[1].push(item);
            }
            return acc;
        }, [[], []])
    }
    let tableData = null;
    if(agenda?.data?.length){
        tableData = agenda.data.map(_item => {
            let { requestedDate, appointments, leaves, schedulerBusySlots, schedulerEvents, appointmentSlots } = _item;
            appointments = appointments || []; leaves = leaves || []; schedulerBusySlots = schedulerBusySlots || []; 
            schedulerEvents = schedulerEvents || []; appointmentSlots = appointmentSlots || [];
            const [allDayEvents, allOtherEvents] = getDifferentEvents(schedulerEvents);
            let allItems = [appointments, schedulerBusySlots, allOtherEvents, appointmentSlots].flat().sort((a, b) => {
                if(moment(moment(b.startTime).format('HH:mm'), 'HH:mm').isAfter(moment(moment(a.startTime).format('HH:mm'), 'HH:mm'))){
                    return -1
                } else {
                    return 1
                }
            });
            allItems = [...leaves, ...allDayEvents, ...allItems];
            return (
                <td key={requestedDate}>
                    {
                        allItems.map((item, index) => {
                            const { agendaType } = item;
                            switch (agendaType) {
                                case constants.agendaType.EVENT: {
                                    return getSchedulerEventsView(item, index);
                                }
                                case constants.agendaType.BUSY_SLOT:
                                case constants.agendaType.BLOCKED: {
                                    return getSchedulerBusySlotsView(item, index , agendaType === constants.agendaType.BUSY_SLOT);
                                }
                                case constants.agendaType.APPOINTMENT: {
                                    return getAppointmentsView(item, index);
                                }
                                case constants.agendaType.LEAVE: {
                                    return getLeavesView(item, index);
                                }
                                default: {
                                    return null;
                                }
                            }
                        })
                    }
                </td>
            )
        })
    }

    useEffect(() => {
        if (currentDate && calendarRef?.current) {
            if (!isWeekly) {
                calendarRef.current.scrollLeft = scrollWidth * (moment(currentDate).date() - 1);
            } else {
                calendarRef.current.scrollLeft = scrollWidth * (moment(currentDate).isoWeekday() - 1);
            }
        }
        //eslint-disable-next-line
    }, [currentDate, isWeekly, agenda, weekData, monthData])

  
    return (
        <div className={"table-card-border agenda-fixed-table"}>
            {isLoading && <Loader />}
            <div className={styles["scheduler-table-wrapper"] + " " + styles["fixed-header-table-wrapper"]}>
                <div ref={calendarRef} className={styles["scheduler-fixed-table"]}>
                    <table  className={"table table-bordered " + styles["schedular-table"] + " " + styles["fixed-header-table"] + " " + styles["agenda-weekly-table"]}>
                        <thead>
                            <tr>
                                {isWeekly ? tableWeekDates : tableMonthDates}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                {tableData}
                                <MoveToApp isModal={isModal?.open} openModal={setIsModal} type={isModal?.type}/>

                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default withTranslation()(AgendaWeeklyView);
