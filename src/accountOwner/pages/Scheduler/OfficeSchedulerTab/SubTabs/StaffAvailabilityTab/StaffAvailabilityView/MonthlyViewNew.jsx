import React, { useEffect, useState, useMemo, Fragment } from 'react'
import { encodeId, generateCalanderMonthView } from 'utils';
import moment from 'moment';
import constants from '../../../../../../../constants'
import styles from "./../../../../Scheduler.module.scss";
import { Col, Row } from 'reactstrap';
import Text from 'components/Text';
import { withTranslation } from 'react-i18next';
import { useGetOfficeAgendaMonthly} from 'repositories/scheduler-repository';
import Loader from 'components/Loader';
import { findKey } from 'lodash';
import { getWeekDay } from 'utils';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';


function MonthlyViewNew({ t, currentDate, selectedOwnerId, currentUserId, onDateChange, apiOffices, apiEmps, isSidebarActive, isWeekly }) {

    const weekDays = constants.weekday
    const [, setmonthDates] = useState([]);
    const [isEventListActive, setEventListActive] = useState({});
    const [openPopUp, setopenPopUp] = useState({})
    const [activePopLast, setActivePopLast] = useState(null)
    const startDate = moment(currentDate).startOf('month').startOf('isoweek').format('YYYY-MM-DD')
    const [dateRange, setDateRange] = useState(null);
    const enableFetch = (selectedOwnerId && dateRange) ? true : false;
    const { isLoading, data: agenda, error } = useGetOfficeAgendaMonthly(selectedOwnerId, dateRange?.startDate, dateRange?.endDate, apiOffices, apiEmps, { enabled: enableFetch } );
    const history = useHistory()
    let tableData = null;

    useEffect(() => {
        if (error) {
            toast.error(error)
        }
    }, [error])


    useEffect(() => {
        calanderDates(currentDate)
    }, [startDate])


    const getDifferentEvents = (events) => {
        return events.reduce((acc, item) => {
            const { isAllDayEvent } = item;
            if (isAllDayEvent) {
                acc[0].push(item);
            } else {
                acc[1].push(item);
            }
            return acc;
        }, [[], []])
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
        const status = item.eventStatus;
        let backgroudColorClass;
        backgroudColorClass = status === constants.SCHEDULERSTATUS.PENDING ? 'color-blue' : createdByMe ? '' : 'color-grey';
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

    const boxBgColor = (type) => {
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

    const boxBgTagColor = (type) => {
        switch (type) {
            case constants.agendaType.EVENT: {
                return 'theme-green-bg'
            }
            case constants.agendaType.BUSY_SLOT:
            case constants.agendaType.BLOCKED: {
                return 'dark-orange-bg'
            }
            case constants.agendaType.APPOINTMENT: {
                return 'dark-grey-bg'
            }
            case constants.agendaType.LEAVE: {
                return 'dark-red-bg'
            }
            default: {
                return null;
            }
        }
    }

    const eventCardView = (type, item, index, childIndex, date, name, popup) => {

        let data = getUsefulInfo(item)
        let activeTab = (constants.PopUp.innerPopUp === popup) ? true : false
        let colorType = boxBgColor(type)

        const activePopup = () => {
            if (type === constants.agendaType.EVENT && item?.createdById === currentUserId) {
                history.push(constants.routes.scheduler.eventDetails.replace(':eventId', encodeId(item.id)))
            }

            if(!activeTab){
                setopenPopUp({})
            }

            setActivePopLast({
                id: item?.id,
                index: childIndex
            })
            setEventListActive({
                id: item?.id,
                index: index + childIndex,
                date: moment(date).format('DD-MM-YYYY'),
                data: data,
                type:popup
            })
        }
        if (type === constants.agendaType.EVENT) {
            return (
                <div className={`${styles["scheduler-event-box"]}  ${styles[data?.backgroudColorClass]}  ${(activeTab && activePopLast?.id === item.id &&
                    activePopLast?.index == childIndex
                ) && styles["active-card"]}`}
                    onClick={activePopup}
                >
                    <div className={styles["event-date"]}> {data.timeString} {data.timezoneCode ? ` (${data.timezoneCode})` : null}</div>
                    <div className={styles["event-office"]}>{data?.officeName} </div>
                    <div className={styles["event-user"]}>{data?.title}</div>

                    {name && <div className={styles["event-user"]}>{name}</div>}
                </div>
            )
        }


        return (
            <div className={` ${styles["scheduler-event-box"]}  ${styles[colorType]} ${styles[data?.backgroudColorClass]}  ${(activeTab && activePopLast?.id == item.id &&
                activePopLast?.index == childIndex) && styles["active-card"]}`} onClick={activePopup}>

                {
                    type == constants.agendaType.LEAVE ?
                        <div className={styles["event-date"]}>{t('scheduler.agenda.leaveTitle')}</div>
                        :
                        <div className={styles["event-date"]}> {data.timeString} {data.timezoneCode ? ` (${data.timezoneCode})` : null}</div>
                }

                <div className={styles["event-office"]}>{data?.officeName} </div>
                {
                    type == constants.agendaType.LEAVE &&
                    <div className={styles["event-user"]}>{t('scheduler.agenda.onLeave')}</div>

                }
                <div className={styles["event-user"]}>{data?.title}</div>
                {
                    type === constants.agendaType.APPOINTMENT &&
                    <div className={styles["event-type"]}>{t('scheduler.agenda.appointmentTitle')}</div>
                }

                {(name && type !== constants.agendaType.BLOCKED &&
                    type !== constants.agendaType.BUSY_SLOT
                ) && <div className={styles["event-user"]}>{name}</div>}


            </div>
        )

    }

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


    const getPopupData = (item, requestedDate) => {
        const data = {};
        data.title = item?.title || item?.reasonForBlock || null;
        data.officeName = item?.officeName || null;
        data.startTime = moment(item?.startTime).format('h:mm a')
        data.endTime = moment(item?.endTime).format('h:mm a')
        data.date = moment(requestedDate).format('MMM D, YYYY [-] ddd');
        const { agendaType } = item;
        switch (agendaType) {
            case constants.agendaType.EVENT: {
                data.tag = t('scheduler.agenda.eventTag');
                break;
            }
            case constants.agendaType.BUSY_SLOT: {
                data.tag = t('scheduler.agenda.busyTag');
                break;
            }
            case constants.agendaType.BLOCKED: {
                data.tag = t('scheduler.agenda.busyTag');
                break;
            }
            case constants.agendaType.APPOINTMENT: {
                data.tag = t('scheduler.agenda.appointmentTag');
                data.title = t('scheduler.agenda.appointmentPatientTitle', { name: item.patientFullName });
                data.isAppointment = true;
                const status = findKey(constants.appointmentStatus, s => s === item.appointmentStatus)
                data.appointmentStatus = t(`appointmentStatus.${status}`)
                break;
            }
            case constants.agendaType.LEAVE: {
                data.tag = t('scheduler.agenda.leaveTag');
                data.title = t('scheduler.agenda.leaveTitle');
                data.isLeave = true;
                break;
            }
            default: {
                break;
            }
        }
        return data;
    }

    const CardPopUp = ({ item, requestedDate, name }) => useMemo(() => {
        let data = getPopupData(item, requestedDate)
        let backgroudColor = boxBgColor(item.agendaType)
        let tagBackgroundColor = boxBgTagColor(item.agendaType)
        let colorDate = getUsefulInfo(item)
        if (constants.agendaType.EVENT === item.agendaType) {
            backgroudColor = colorDate.backgroudColorClass
        }

        return (
            <div className={styles["scheduler-popup-box"]}>
                <span className={styles["close-icon"]} onClick={() => {
                    setEventListActive({})
                    setActivePopLast(null)
                }}>&times;</span>
                <div className={styles["scheduler-event-box"] + " " + styles[backgroudColor]}>
                    <div className={styles["event-tag"] + " " + styles[tagBackgroundColor]}>{data.tag}</div>
                    <div className={styles["event-type"]}>{data.title}</div>
                    <Row className={styles.row} >
                        <Col sm="6">
                            <Text size='10px' marginBottom="0px" weight='400' color='#87928D' >
                            {constants.agendaType.APPOINTMENT === item.agendaType 
                            ? t("scheduler.agenda.doctorName") : t("scheduler.agenda.staffName")
                            }
                            </Text>
                            <Text size='12px' marginBottom="10px" weight='500' color='#2F3245' >
                                {name} 
                            </Text>
                        </Col>
                        <Col sm="6">
                            <Text size='10px' marginBottom="0px" weight='400' color='#87928D' >
                                {t("accountOwner.officeName")}
                            </Text>
                            <Text size='12px' marginBottom="10px" weight='500' color='#2F3245' >
                                {data.officeName}
                            </Text>
                        </Col>
                        <Col sm="6">
                            <Text size='10px' marginBottom="0px" weight='400' color='#87928D' >
                                {t("accountOwner.date")}
                            </Text>
                            <Text size='12px' marginBottom="10px" weight='500' color='#2F3245' >
                                {data.date}
                            </Text>
                        </Col>
                        {!data.isLeave && <Col sm="6">
                            <Text size='10px' marginBottom="0px" weight='400' color='#87928D' >
                                {data.isAppointment ? t("timeOfAppointment") : t("staff.startTime")}
                            </Text>
                            <Text size='12px' marginBottom="12px" weight='500' color='#2F3245' >
                                {data.startTime}
                            </Text>
                        </Col>}
                        {!data.isLeave && <Col sm="6">
                            <Text size='10px' marginBottom="0px" weight='400' color='#87928D' >
                                {data.isAppointment ? t("status") : t("staff.endTime")}
                            </Text>
                            <Text size='12px' marginBottom="12px" weight='500' color='#2F3245' >
                                {data.isAppointment ? data.appointmentStatus : data.endTime}
                            </Text>
                        </Col>}
                    </Row>
                </div>
            </div>
        )

    }, [isEventListActive])

    const PopEventListing = ({data,index,requestedDate, name}) =>{
            if(data?.length){
                data?.splice(0,2)
            }
            return(
                
                <>
                {
                    data?.map((item,childIndex) =>{
                        return(
                            <Fragment key={childIndex}>
                        {item?.agendaType && eventCardView(item?.agendaType, item, index, childIndex, requestedDate, name, constants.PopUp.innerPopUp)}
                        {
                            (isEventListActive?.index === (index + childIndex) && (isEventListActive?.id === item?.id) 
                            && (isEventListActive?.type === constants.PopUp.innerPopUp)) &&
                            <>
                            <CardPopUp item={item} requestedDate={requestedDate} name={name} />
                            </>
                        }
                    </Fragment>
                    )
                })
                }
            </>
        )
    }

    const seeMoreDate = (requestedDate) => {
        setopenPopUp({ date : requestedDate , type:constants.PopUp.outerPopUp})
        setActivePopLast('')
        setEventListActive({})
    }

    
    if (agenda?.data?.length) {

        tableData = agenda.data.map((_item, index) => {
            let { requestedDate, appointments, leaves, schedulerBusySlots, schedulerEvents, appointmentSlots } = _item;
            appointments = appointments || []; leaves = leaves || []; schedulerBusySlots = schedulerBusySlots || [];
            schedulerEvents = schedulerEvents || []; appointmentSlots = appointmentSlots || [];
            const [allDayEvents, allOtherEvents] = getDifferentEvents(schedulerEvents);
            let allItems = [appointments, schedulerBusySlots, allOtherEvents, appointmentSlots].flat().sort((a, b) => {
                if (moment(moment(b.startTime).format('HH:mm'), 'HH:mm').isAfter(moment(moment(a.startTime).format('HH:mm'), 'HH:mm'))) {
                    return -1
                } else {
                    return 1
                }
            });
            allItems = [...leaves, ...allDayEvents, ...allItems];
            let listed = JSON.parse(JSON.stringify(allItems))

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
            return (
                <>
                    <div className={`${styles['monthly-col']} ${styles["monthly-td"]} ${openPopUp?.date === requestedDate &&  styles["active-date"]} `}>
                    

                        {
                            allItems?.splice(0, 2)?.map((list, childIndex) => {
                                let name = `${list?.user?.firstName} ${list?.user?.lastName}`
                                return (
                                    <>
                                        {!childIndex && <div className={styles["date-box"]}>{moment(requestedDate).format('DD')}
                                            <span className={styles['day-box']}> ({getWeekDay(requestedDate)})</span></div>}
                                        {list?.agendaType && eventCardView(list?.agendaType, list, index, childIndex, requestedDate, name, constants.PopUp.outerPopUp)}
                                        <div className={styles["more-event-box"]}>
                                        {
                                            (listed?.length > 2 && childIndex === 1) &&
                                            <Fragment>
                                                <span className={"link-btn"} onClick={() => { seeMoreDate(requestedDate) }}> {t('SeeMore')} </span>
                                                { (openPopUp?.date === requestedDate) &&

                                                    <div className={styles["monthly-event-list"]}>
                                                        <span className={styles["close-icon-list"]} onClick={() => setopenPopUp({})}>
                                                            <img src={require('assets/images/close-grey.svg').default} alt="icon" />
                                                        </span>
                                                        <div className={styles['day-date-box']}>
                                                            <div className={styles['day-name']}>
                                                                {getWeekDay(requestedDate)}
                                                            </div>
                                                            {moment(requestedDate).format('D')}
                                                        </div>
                                                        <div className={styles["event-list-ul"]}>
                                                            <PopEventListing data={listed} index={index} requestedDate={requestedDate} name={name} />
                                                        </div>
                                                    </div>
                                                }
                                            </Fragment>

                                        }
                                        {(isEventListActive?.index === (index + childIndex) && isEventListActive?.date === moment(requestedDate).format('DD-MM-YYYY')) &&
                                        (isEventListActive?.type === constants.PopUp.outerPopUp) &&
                                            <CardPopUp item={list} requestedDate={requestedDate} name={name} />}
                                        </div>
                                    </>
                                )
                            })
                        }
                    </div>
                </>

            )

        })
    }

    
    return (
        <div className={styles['montly-calendar-wrapper']}>
            {(isLoading) && <Loader />}
            <div className={styles['monthly-tr']}>
                { weekDays?.map(item =>
                    <div className={styles['monthly-th'] + " " + styles['monthly-col'] + ' border-right-none'}>
                        {item.slice(0, 3)}
                    </div>
                )}
            </div>
            <div className={styles['monthly-tr']}>
                {tableData}
            </div>
        </div>
    );
}

export default withTranslation()(MonthlyViewNew);
