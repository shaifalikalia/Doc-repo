import React, { useState, useEffect, createRef } from 'react';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import styles from "./../../../../Scheduler.module.scss";
import Text from 'components/Text';
import { withTranslation } from 'react-i18next';
import { encodeId, generateMonth, generateWeek, isMobileTab } from 'utils';
import * as moment from 'moment';
import { useGetOfficeAgenda } from 'repositories/scheduler-repository';
import { cloneDeep, findKey } from 'lodash';
import constants from '../../../../../../../constants.js';
import { useHistory } from 'react-router-dom';
import defautUserImage from '../../../../../../../assets/images/staff-default.svg';
import Loader from 'components/Loader';
import toast from 'react-hot-toast';

function StaffAvailabilityWeeklyView({ t, currentDate, selectedOwnerId, currentUserId, onDateChange, apiOffices, apiEmps, isSidebarActive, isWeekly }) {
    const history = useHistory();
    const calendarRef = createRef(null);

    const [weekData, setWeekData] = useState([]);
    const [monthData, setMonthData] = useState([]);
    const [dateRange, setDateRange] = useState(null);
    const [seeMoreUsers, setSeeMoreUsers] = useState([]);
    const [seeMoreOnCalender, setSeeMoreOnCalender] = useState('');
    const [hoverKey, setHoverKey] = useState('');



    useEffect(() => {
        if(isWeekly){
            getWeeksDates(currentDate);
        } else {
            getMonthDates(currentDate);
        }
        if(isMobileTab() && isSidebarActive ){
            toast.success(t('accountOwner.dateApply'))
        }
        //eslint-disable-next-line
    }, [currentDate, isWeekly]);

    const getWeeksDates = (_currentDate) => {
        const selectedStartWeek = moment(_currentDate).startOf('isoWeek');
        const selectedEndWeek = moment(_currentDate).endOf('isoWeek');
        const currentweekData = generateWeek(selectedStartWeek, selectedEndWeek);
        setDateRange({
            startDate: moment(selectedStartWeek).format('YYYY-MM-DD'),
            endDate: moment(selectedEndWeek).format('YYYY-MM-DD')
        })
        setWeekData(currentweekData);
    }

    const getMonthDates = (_currentDate) => {
        const monthDates = generateMonth(_currentDate);
        const monthLength = monthDates.length;
        setDateRange({
            startDate: moment(monthDates[0].date).format('YYYY-MM-DD'),
            endDate: moment(monthDates[monthLength - 1].date).format('YYYY-MM-DD')
        })
        setMonthData(monthDates);
    }

    const enableFetch = (selectedOwnerId && dateRange) ? true : false;
    const { isLoading, isFetching, data: agenda, error } = useGetOfficeAgenda(selectedOwnerId, dateRange?.startDate, dateRange?.endDate, apiOffices, apiEmps, { enabled: enableFetch });

    useEffect(() => {
        if(!isLoading && !isFetching && error?.message){
            toast.error(error.message)
        }
        //eslint-disable-next-line
    }, [error])

    let tableDates;
    if (isWeekly) {
        tableDates = weekData.map((v, i) => (
            <th key={i} className='th-height-60'>
                {v.mDate}
            </th>
        ))
    } else {
        tableDates = monthData.map((v, i) => (
            <th key={i} className='th-height-60'>
                {v.mDate}
            </th>
        ))
    }

    
    const resetHoverKey = (e) => {
        e.stopPropagation();
        setHoverKey('');
    };
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
                const status = findKey(constants.appointmentStatus, s => s === item.appointmentStatus )
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
    const getPopupView = (item, backgroudColor, tagBackgroundColor, requestedDate, staffName) => {
        const data = getPopupData(item, requestedDate);
        return (
            <div className={styles["scheduler-popup-box"]}>
                <span className={styles["close-icon"]} onClick={resetHoverKey}>&times;</span>
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
                                {staffName}
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
    }
    const goToDetails = (id, type, createdByMe) => {
        if(!id || !type) return;
        switch(type){
            case constants.agendaType.EVENT: {
                let pathname = '/';
                pathname = createdByMe ? 
                            constants.routes.scheduler.eventDetails.replace(':eventId', encodeId(id)) :
                            constants.routes.scheduler.eventDetailsOnly.replace(':eventId', encodeId(id))
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
    const getAppointmentsView = (item, index, searchKey, requestedDate, staffName) => {
        const thisHoverKey = `${searchKey}_${index}`;
        const data = getUsefulInfo(item);
        return (
            <div 
                key={index} 
                className={styles["scheduler-event-box"] + " " + styles['light-purple-bg']}
                onClick={() => setHoverKey(thisHoverKey)}
            >
                <div className={styles["event-tag"] + " " + styles['dark-grey-bg']}>{t('scheduler.agenda.appointmentTag')}</div>
                <div className={styles["event-date"]}>
                    {data.timeString}
                    {data.timezoneCode ? ` (${data.timezoneCode})` : null}
                </div>
                <div className={styles["event-office"]}>{data.officeName}</div>
                <div className={styles["event-type"]}>{t('scheduler.agenda.appointmentTitle')}</div>
                {thisHoverKey === hoverKey && getPopupView(item, 'light-purple-bg', 'dark-grey-bg', requestedDate, staffName)}
            </div>
        )
    }
    const getSchedulerEventsView = (item, index, searchKey, requestedDate, staffName) => {
        const thisHoverKey = `${searchKey}_${index}`;
        const data = getUsefulInfo(item);
        return (

            <div
                key={index}
                className={styles["scheduler-event-box"] + " " + styles[data.backgroudColorClass] + " cursor-pointer "}
                onClick={() => {
                    if (data.createdByMe) {
                        goToDetails(data.id, constants.agendaType.EVENT, data.createdByMe)
                    } else {
                        setHoverKey(thisHoverKey)
                    }
                }}
            >
                <div className={styles["event-tag"] + " " + styles['theme-green-bg']}>{t('scheduler.agenda.eventTag')}</div>
                <div className={styles["event-date"]}>
                    {data.timeString}
                    {data.timezoneCode ? ` (${data.timezoneCode})` : null}
                </div>
                <div className={styles["event-office"]}>{data.officeName}</div>
                <div className={styles["event-type"]}> {data.title} </div>
                {thisHoverKey === hoverKey && getPopupView(item, data.backgroudColorClass, 'theme-green-bg', requestedDate, staffName)}
            </div>
        )
    }
    const getSchedulerBusySlotsView = (item, index, isSchedulerBusySlot, searchKey, requestedDate, staffName) => {
        const thisHoverKey = `${searchKey}_${index}`;
        const data = getUsefulInfo(item);
        return (
            <div 
                key={index} 
                className={styles["scheduler-event-box"] + " " + styles['light-orange-bg'] + " cursor-pointer " } 
                onClick={() => setHoverKey(thisHoverKey)}
            >
                <div className={styles["event-tag"] + " " + styles['dark-orange-bg']}>{t('scheduler.agenda.busyTag')}</div>
                <div className={styles["event-date"]}>
                    {data.timeString}
                    {data.timezoneCode ? ` (${data.timezoneCode})` : null}
                </div>
                <div className={styles["event-office"]}>{data.officeName} </div>
                <div className={styles["event-type"]}> {data.title} </div>
                {thisHoverKey === hoverKey && getPopupView(item, 'light-orange-bg', 'dark-orange-bg', requestedDate, staffName)}
            </div>
        )
    }
    const getLeavesView = (item, index, searchKey, requestedDate, staffName) => {
        const thisHoverKey = `${searchKey}_${index}`;
        const data = getUsefulInfo(item);
        return (
            <div 
                key={index} 
                className={styles["scheduler-event-box"] + " " + styles['light-red-bg']}
                onClick={() => setHoverKey(thisHoverKey)}
            >
                <div className={styles["event-tag"] + " " + styles['dark-red-bg']}>{t('scheduler.agenda.leaveTag')}</div>
                <div className={styles["event-date"]}>{t('scheduler.agenda.leaveTitle')}</div>
                <div className={styles["event-office"]}>{data.officeName}</div>
                <div className={styles["event-type"]}>{t('scheduler.agenda.onLeave')}</div>
                {thisHoverKey === hoverKey && getPopupView(item, 'light-red-bg', 'dark-red-bg', requestedDate, staffName)}
            </div>
        )
    }
    const shouldShowUserSeeMore = (data) => {
        return data.some(item => {
            let { appointments, leaves, schedulerBusySlots, schedulerEvents, appointmentSlots } = item;
            appointments = appointments || []; leaves = leaves || []; schedulerBusySlots = schedulerBusySlots || [];
            schedulerEvents = schedulerEvents || []; appointmentSlots = appointmentSlots || [];
            return [appointments, leaves, schedulerBusySlots, schedulerEvents, appointmentSlots].flat().length > 2;
        })
    }
    const toggleSeeMoreForUser = (userId) => {
        if(seeMoreUsers.includes(userId)){
            setSeeMoreUsers(state => state.filter(id => id !== userId))
        } else {
            setSeeMoreUsers(state => [...state, userId])
        }
        setSeeMoreOnCalender('')
    }
    const toggleSeeMoreOnCalender = (searchKey) => {
        if(seeMoreOnCalender === searchKey){
            setSeeMoreOnCalender('')
        } else {
            setSeeMoreOnCalender(searchKey)
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
    let userData = [];
    let tableJsx = null;
    if (agenda?.data?.length) {
        userData = cloneDeep(agenda.data[0].officeSchedulerList).map(item => ({ user: item.user, data: [] }));
        agenda.data.forEach(date => {
            const { requestedDate, officeSchedulerList } = date;
            officeSchedulerList.forEach((data, userIndex) => {
                const { user, ...rest } = data;
                userData[userIndex].data.push({ requestedDate, ...rest })
            })

        });

        tableJsx = userData.map((ud, ui) => {
            const { user, data } = ud;
            const { fullName, profilePic, id: userId } = user;
            const isSeeLessVisible = seeMoreUsers.includes(userId);
            return (
                <tr key={ui}>
                    <th >
                        <div className={styles["scheduler-client-box"]}>
                            <div className={styles["client-img"]}> <img src={profilePic || defautUserImage} alt="icon" /> </div>
                            <div className={styles["client-name"]}>{fullName}</div>
                            { 
                                shouldShowUserSeeMore(data) && 
                                <div className={styles["see-btn"]} onClick={() => toggleSeeMoreForUser(userId)}><span>{isSeeLessVisible ? t('scheduler.agenda.seeLess') : t('scheduler.agenda.seeMore')}</span>
                                    <img className={isSeeLessVisible ? styles['rotate-caret-icon'] : ''} src={require('assets/images/caret-587E85.svg').default} alt="caret" />
                                </div> 
                            }
                        </div>
                    </th>
                    {
                        data.map(_item => {
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
                            let slicedItems = [...allItems];
                            const showSeeMore = allItems.length > 2;
                            const searchKey = `${userId}_${requestedDate}`;
                            if(!seeMoreUsers.includes(userId)){
                                slicedItems = allItems.slice(0, 2);
                            }
                            if(!seeMoreUsers.includes(userId) && seeMoreOnCalender.includes(searchKey)){
                                slicedItems = [...allItems];
                            }
                            return (
                                <td key={requestedDate}>
                                    {
                                        slicedItems.map((item, index) => {
                                            const { agendaType } = item;
                                            switch (agendaType) {
                                                case constants.agendaType.EVENT: {
                                                    return getSchedulerEventsView(item, index, searchKey, requestedDate, fullName);
                                                }
                                                case constants.agendaType.BUSY_SLOT:
                                                case constants.agendaType.BLOCKED: {
                                                    return getSchedulerBusySlotsView(item, index , agendaType === constants.agendaType.BUSY_SLOT, searchKey, requestedDate, fullName);
                                                }
                                                case constants.agendaType.APPOINTMENT: {
                                                    return getAppointmentsView(item, index, searchKey, requestedDate, fullName);
                                                }
                                                case constants.agendaType.LEAVE: {
                                                    return getLeavesView(item, index, searchKey, requestedDate, fullName);
                                                }
                                                default: {
                                                    return null;
                                                }
                                            }
                                        })
                                    }
                                    {
                                        !seeMoreUsers.includes(userId) && showSeeMore &&
                                        (
                                            <div className={styles["more-event-box"]}>
                                                <span
                                                    className={styles["more-event-btn"]}
                                                    onClick={() => toggleSeeMoreOnCalender(searchKey)}
                                                >
                                                    {seeMoreOnCalender.includes(searchKey) ?
                                                        t('scheduler.agenda.seeLess') :
                                                        t('scheduler.agenda.seeMoreWithCount', { count: allItems.length - 2 })
                                                    }
                                                </span>
                                            </div>
                                        )
                                    }
                                </td>
                            )
                        })
                    }

                </tr>
            )
        })

    }

    

    return (
        <div className={"table-card-border "}>
            {isLoading && <Loader/>}
            <div className={styles["scheduler-table-wrapper"]}>
                <div ref={calendarRef} className={styles["scheduler-fixed-table"]}>
                    <table className={"table table-bordered " + styles["schedular-table"] + " " + styles["staff-weekly-table"]}>
                        <thead>
                            <tr>
                                <th className='th-height-60'>
                                </th>
                                {tableDates}
                            </tr>
                        </thead>
                        <tbody>{tableJsx}</tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default withTranslation()(StaffAvailabilityWeeklyView);