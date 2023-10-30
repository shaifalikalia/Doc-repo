import React, { useEffect, useState, useMemo } from 'react'
import { encodeId, generateCalanderMonthView } from 'utils';
import moment from 'moment';
import constants  from '../../../../../../../constants';
import styles from '../../../../Scheduler.module.scss'
import { withTranslation } from 'react-i18next';
import { useGetAgenda } from 'repositories/scheduler-repository';
import toast from 'react-hot-toast';
import Loader from 'components/Loader';
import { useHistory } from 'react-router-dom';
import { getWeekDay } from 'utils';
import MoveToApp from 'accountOwner/pages/Scheduler/components/Modals/MoveToApp';


function MonthlyViewNew({ t, currentDate, selectedOwnerId, currentUserId, onDateChange, apiOffices, apiEmps, isSidebarActive, isWeekly }) {
    const history = useHistory()
    const weekDays = constants.weekday
    const [, setmonthDates] = useState([]);
    const startDate = moment(currentDate).startOf('month').startOf('isoweek').format('YYYY-MM-DD')
    const [dateRange, setDateRange] = useState(null);
    const [popupList,setPopupList] = useState({})
    const [isModal,setIsModal] = useState({open: false})

    const enableFetch = (selectedOwnerId && dateRange) ? true : false;
    const { isLoading, isFetching, data: agenda, error } = useGetAgenda(selectedOwnerId, dateRange?.startDate, dateRange?.endDate, apiOffices, { enabled: enableFetch });
    
    useEffect(() => {
        if(!isLoading && !isFetching && error?.message){
            toast.error(error.message)
        }
        //eslint-disable-next-line
    }, [error])
    
    useEffect(() => {
        calanderDates(currentDate)
    }, [startDate])

    

    const calanderDates = (dateCurrent) => {
        if(dateCurrent){
            let dates = generateCalanderMonthView(dateCurrent)
            setDateRange({
                startDate: moment(dateCurrent).startOf('month').startOf('isoweek').format('YYYY-MM-DD'),
                endDate:moment(dateCurrent).endOf('month').format('YYYY-MM-DD')
            })
            setmonthDates([...dates])
        }
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


    const handleEventList = (item,list,index,childIndex,date) => {
        setPopupList({
            id:(list.id + index + childIndex),
            index:index,
            item: item,
            date:date
        })
    };


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

    const boxBgColor = (type,item   ) =>{
        switch (type) {
            case constants.agendaType.EVENT: {
                return 'theme-green-bg'
            }
            case constants.agendaType.BUSY_SLOT:
            case constants.agendaType.BLOCKED: {
                return 'light-orange-bg'
            }
            case constants.agendaType.APPOINTMENT: {
                return 'light-purple-bg'
            }
            case constants.agendaType.LEAVE: {
                return 'light-red-bg'
            }
            default: {
                return null;
            }
        }
    }

    const goToDetails = (id, type, createdByMe, isInvite) => {
        if(!id || !type) return;
        switch(constants.agendaType[type]){
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


    const eventCardView =  (type,item) =>{
        let data = getUsefulInfo(item)
        let colorType = boxBgColor(type,item)
        const goToDetailPage = e =>{
            let cardType = Object.keys(constants.agendaType)?.find(key => constants.agendaType[key] === type);
            if(type === constants.agendaType.APPOINTMENT || type === constants.agendaType.LEAVE || type === constants.agendaType.BLOCKED ) {
                setIsModal({ open:true, type:type})
                return 
            }
        
            goToDetails(data.id, cardType,data?.createdByMe , data.isInvite)
        }


        if(type === constants.agendaType.EVENT){

            return (
                <div className={` ${styles["scheduler-event-box"]}  ${styles[data?.backgroudColorClass]}`}
                onClick={goToDetailPage}
                >
                <div className={styles["event-date"]}> {data.timeString} {data.timezoneCode ? ` (${data.timezoneCode})` : null}</div>
                <div className={styles["event-office"]}>{data?.officeName} </div>
                <div className={styles["event-user"]}>{data?.title}</div>    
                </div>
            )
        }

        return (
            <div className={` ${styles["scheduler-event-box"]}  ${styles[colorType]} ${styles[data?.backgroudColorClass]}`} onClick={goToDetailPage}>
            {
                type === constants.agendaType.LEAVE ?
            <div className={styles["event-date"]}>{t('scheduler.agenda.leaveTitle')}</div>
            :
            <div className={styles["event-date"]}> {data.timeString} {data.timezoneCode ? ` (${data.timezoneCode})` : null}</div>
            }

            <div className={styles["event-office"]}>{data?.officeName} </div>
            <div className={styles["event-user"]}>{data?.title}</div>
            {
                type === constants.agendaType.APPOINTMENT &&
            <div className={styles["event-type"]}>{t('scheduler.agenda.appointmentTitle')}</div>
            }

            </div>
        )

    }


    const tableData = useMemo(() =>{
        if(agenda?.data?.length){
            return (
                agenda.data.map((_item,index)=>{
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
                    let allItemsCopy =  JSON.parse(JSON.stringify(allItems))
                      if (!allItems || !allItems?.length) {
                            return (
                                <div className={styles['monthly-col'] + ' ' + styles["monthly-td"]}>
                                    <div className={styles["date-box"]}>
                                        {moment(requestedDate).format('DD')}
                                    </div>
                                    <div className={styles['empty-event']}> {t("scheduler.noEvent")} </div>
                                </div>
                            )
                        }
                    return(
                        <>
                              <div className={`${styles['monthly-col']} ${styles["monthly-td"]}  ${(popupList?.date === requestedDate)  && styles["active-date"]}`}>
                                  <div className={styles["more-event-box"]}>
                          {
                            allItems.splice(0,2).map((list,childIndex) => 
                                <> 
                                { !childIndex   && <div className={styles["date-box"]}>{moment(requestedDate).format('DD')} 
                                <span className={styles['day-box']}>({getWeekDay(requestedDate)})</span></div>}
                                {list?.agendaType && eventCardView(list?.agendaType,list)} 
                        

                                    {
                                        (allItemsCopy?.length > 2 && childIndex === 1) &&
                                            <span className={"link-btn"} onClick={() => handleEventList(allItems,list,index , childIndex,requestedDate)}> See more </span>
                                    }
        
                                            {
                                            
                                            ((popupList?.id ===  (parseInt(list.id) + index + childIndex) && (index === popupList?.index)
                                                ) &&  popupList?.item?.length > 0 )  && (
                                                <div className={styles["monthly-event-list"]}>
                                                    <span className={styles["close-icon-list"]}
                                                        onClick={() => setPopupList({})}>
                                                        <img src={require('assets/images/close-grey.svg').default} alt="icon" />
                                                    </span>
                                                    <div className={styles['day-date-box']}>
                                                        <div className={styles['day-name']}> {getWeekDay(requestedDate)}</div>
                                                        <div className={styles['date-name']}>  {moment(requestedDate).format('D')}</div>
                                                    </div>
                                                    <div className={styles["event-list-ul"]}>
                                                        {
                                                            popupList?.item?.map(data =>{
                                                                
                                                                return(
                                                                    <>
                                                                    { data?.agendaType && eventCardView(data?.agendaType,data,)} 
                                                                    </>                                          
                                                                )
                                                            }
        
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                            )}
        
                                </>
                            )
                        }
                        </div>
                        </div>
                        </>
                    )
                })
            )
        }
        return null
       
    } ,[agenda,popupList])

    return (
        <div className={styles['montly-calendar-wrapper']}>
            <div className={styles['monthly-tr']}>
            {isLoading && <Loader />}
                {weekDays?.map(item =>
                    <div className={styles['monthly-th'] + " " + styles['monthly-col'] + ' border-right-none'}>
                        {item.slice(0, 3)} 
                    </div>
                )}
            </div>

            <div className={styles['monthly-tr']}>
              {tableData}
              {isModal?.open &&
              <MoveToApp isModal={isModal?.open} openModal={setIsModal} type={isModal?.type}/>
                }

            </div>
        </div>
    );
}

export default withTranslation()(MonthlyViewNew);
