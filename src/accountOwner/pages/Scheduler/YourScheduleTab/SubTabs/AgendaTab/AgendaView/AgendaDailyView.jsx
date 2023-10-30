import React, { useState, useEffect } from 'react';
import styles from "./../../../../Scheduler.module.scss";
import moment from 'moment';
import { useGetAgenda } from 'repositories/scheduler-repository';
import Loader from 'components/Loader';
import { withTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import constants from '../../../../../../../constants.js';
import { encodeId, isMobileTab } from 'utils';
import MoveToApp from 'accountOwner/pages/Scheduler/components/Modals/MoveToApp';
import toast from 'react-hot-toast';


function AgendaDailyView(props) {
    const { t, currentDate, selectedOwnerId, currentUserId, isSidebarActive, apiOffices, setCurrentDate } = props;
    const [dateRange, setDateRange] = useState(null);
    const [isModal,setIsModal] = useState({open:false})
    const history = useHistory();

    const changeWeek = (type) => {
        if (type === 'next') {
            setCurrentDate(moment(currentDate).add(1, 'day').toDate())
        } else {
            setCurrentDate(moment(currentDate).subtract(1, 'day').toDate())
        }
    }

    useEffect(() => {
        if(currentDate){
            setDateRange({
                startDate: moment(currentDate).format('YYYY-MM-DD'),
                endDate: moment(currentDate).format('YYYY-MM-DD')
            })
        }
        if(isMobileTab() && isSidebarActive ){
            toast.success(t('accountOwner.dateApply'))
        }
        //eslint-disable-next-line
    }, [currentDate])

    const enableFetch = (selectedOwnerId && dateRange) ? true : false;
    const { isLoading, isFetching, data: agenda, error } = useGetAgenda(selectedOwnerId, dateRange?.startDate, dateRange?.endDate, apiOffices, { enabled: enableFetch });
    
    useEffect(() => {
        if(!isLoading && !isFetching && error?.message){
            toast.error(error.message)
        }
        //eslint-disable-next-line
    }, [error])



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
            
            <div key={index} className={styles["scheduler-event-box"] + " " + styles["box-flex"] + " " + styles['light-purple-bg']}
            onClick={()=>{
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
                className={styles["scheduler-event-box"] + " " + styles[data.backgroudColorClass] + " " + styles["box-flex"] + " cursor-pointer " } 
                onClick={() => goToDetails(data.id, constants.agendaType.EVENT, data.createdByMe, data.isInvite)}
            >
                <div className={styles["event-tag"] + " " + styles['theme-green-bg']}>{t('scheduler.agenda.eventTag')}</div>
                <div className={styles["event-date"]}>
                    {data.timeString}
                    {data.timezoneCode ? ` (${data.timezoneCode})`: null}
                </div>
                <div className={styles["event-office"]}>{data.officeName}</div>
                <div className={styles["event-type"]}> {data.title} </div>
            </div>
        )
    }
    const getSchedulerBusySlotsView = (item, index , shouldRedirect) => {
        
        const data = getUsefulInfo(item);
        return (
            <div 
                key={index} 
                className={styles["scheduler-event-box"] + " " + styles['light-orange-bg'] + " " + styles["box-flex"] + " cursor-pointer " } 
                onClick={() => {
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
            <div key={index} className={styles["scheduler-event-box"] + " " + styles['light-red-bg'] + " " + styles["box-flex"]}
            onClick={()=>{
                setIsModal({open:true,type:constants.agendaType.LEAVE})
            }}
            >
                <div className={styles["event-tag"] + " " + styles['dark-red-bg']}>{t('scheduler.agenda.leaveTag')}</div>
                <div className={styles["event-date"]}>{t('scheduler.agenda.leaveTitle')}</div>
                <div className={styles["event-office"]}>{data.officeName} </div>
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
                                    return getSchedulerBusySlotsView(item, index , agendaType === constants.agendaType.BUSY_SLOT );
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
    return (
        <div className={"agenda-fixed-table  table-card-border"}>
             {isLoading && <Loader />}
            <div className={styles["scheduler-fixed-table"]}>
                <table className={"table table-bordered " + styles["schedular-table"] + " " + styles["daily-table"]}>
                    <thead>
                        <tr>
                            <th className='th-height-60'>
                                <div className={styles["arrow-btn"] + " " + styles["prev-btn"] + " "} onClick={() => changeWeek('prev')}>
                                    <img src={require('assets/images/scheduler-table-arrow-left.svg').default} alt="icon" />
                                </div>
                                <div className={styles["arrow-btn"] + " " + styles["next-btn"] + " "} onClick={() => changeWeek('next')}>
                                    <img src={require('assets/images/scheduler-table-arrow-right.svg').default} alt="icon" />
                                </div>
                                {moment(currentDate).format('MMM DD, ddd')}
                            </th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th></th>
                            {tableData}
                            <MoveToApp isModal={isModal?.open} openModal={setIsModal} type={isModal?.type}/>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>);
}

export default withTranslation()(AgendaDailyView);