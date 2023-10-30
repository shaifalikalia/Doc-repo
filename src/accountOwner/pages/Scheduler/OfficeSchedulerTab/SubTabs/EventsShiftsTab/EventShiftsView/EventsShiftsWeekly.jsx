import React, { useState, useEffect, useMemo, createRef } from 'react';
import styles from "./../../../../Scheduler.module.scss";
import { withTranslation } from 'react-i18next';
import AddNotesModal from '../Modals/AddNotesModal';
import EditNotesModal from '../Modals/EditNotesModal';
import DeleteNotes from '../Modals/DeleteNotes';
import { generateWeek, generateMonth, encodeId , isMobileTab , titleWordLimit } from 'utils';
import * as moment from 'moment';
import { getSchedularNotes, deleteSchedularNote, getEventListForAssigner, eventPublished } from 'repositories/scheduler-repository';
import toast from 'react-hot-toast';
import Loader from 'components/Loader';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Text from 'components/Text'
import { useHistory } from 'react-router-dom';
import constants, { getSchedulerStatusById } from '../../../../../../../constants'
import PublishEventModal from 'accountOwner/pages/Scheduler/components/Modals/PublishEvent';

function EventsShiftsWeekly({ t, settotalEvents,
    getDetailsOwnerIfStaff, currentDate, setcurrentDate, calendarView, selectedOfficeFilter, searchValue, upDateListonApply, handleSidebarToggle, isSidebarActive }) {
    const calendarRef = createRef(null);

    const history = useHistory()

    const [isAddNotesModal, setIsAddNotesModal] = useState({
        visible: false,
        date: '',
        value: ''
    });
    const [deleteConfirmation, setdeleteConfirmation] = useState({
        visible: false,
        id: ''
    })
    const [isLoading, setIsLoading] = useState(false);
    const [isPublishEventModalOpen, setIsPublishEventModalOpen] = useState(false)

    const [isEditNotesModal, setIsEditNotesModal] = useState({ visible: false });
    const [weekData, setWeekData] = useState([]);
    const [index, setindex] = useState('');
    const [eventListData, setEventListData] = useState([]);
    //const profile = useSelector(state => state.userProfile.profile)
    const [isEmpPopActive, setEmpPopupActive] = useState("");
    const [
        //isEvent
        , 
        setIsEvent
    ] = useState(false);

    const eventShiftsView = [
        { id: '1', name: 'Weekly' },
        { id: '2', name: 'Monthly ' },
    ]


    const [eventId, seteventId] = useState('');

    const toggleEmpPopup = (event, id) => {
        event.stopPropagation();
        setEmpPopupActive(id);

    };
    


    useEffect(() => {
        if (calendarView === eventShiftsView[1].id && calendarRef.current) {
            calendarRef.current.scrollLeft = 0
        }

        getNotes(currentDate)
        // eslint-disable-next-line
    }, [currentDate, getDetailsOwnerIfStaff, calendarView, upDateListonApply]);



    useEffect(() => {
        if (isMobileTab() && isSidebarActive) {
            toast.success(t('accountOwner.dateApply'));
        }
        // eslint-disable-next-line
    }, [currentDate]);

    useEffect(() => {
        scrollToError();
        // eslint-disable-next-line
    }, [eventListData]);

    useEffect(() => {
        const allEventData = JSON.parse(JSON.stringify(eventListData));
        let filterCount = 0
        if (searchValue && allEventData?.length > 0) {
            let filterList = allEventData?.filter(item => {
                let titleList = item.events?.filter(data => {
                    if ((data.title.toLowerCase().includes(searchValue.toLowerCase())) || (data.eventTags?.length && data.eventTags.filter(e => e.title.toLowerCase().includes(searchValue.toLowerCase()))?.length)) {
                        return data;
                    }
                })
                item.events = titleList;
                filterCount = filterCount + item?.events?.length
                return titleList?.length ? item : ''
            })

            setWeekData(filterList)
            settotalEvents(filterCount)
        }
        if (!searchValue) {
            setWeekData([...allEventData])
            allEventData?.filter(item => {
                let titleList = item.events;
                filterCount = filterCount + item?.events?.length
                return titleList?.length ? item : ''
            });
            settotalEvents(filterCount)
        }
    }, [searchValue, eventListData])

    const getNotes = async (_currentDate) => {
        setIsLoading(true);
        const selectedStartWeek = moment(_currentDate).startOf('isoWeek');
        const selectedEndWeek = moment(_currentDate).endOf('isoWeek');
        try {
            let currentweekData = calendarView === '1' ? generateWeek(selectedStartWeek, selectedEndWeek) : generateMonth(_currentDate)
            let response = ''
            if (calendarView === '1') {
                response = await getSchedularNotes(selectedStartWeek.format('YYYY-MM-DDTHH:mm'), selectedEndWeek.format('YYYY-MM-DDTHH:mm'), getDetailsOwnerIfStaff)
            } else {
                let startDate = moment(_currentDate).startOf('month')
                let endDate = moment(_currentDate).endOf('month')
                response = await getSchedularNotes(startDate.format('YYYY-MM-DDTHH:mm'), endDate.format('YYYY-MM-DDTHH:mm'), getDetailsOwnerIfStaff)
            }
            if (response.statusCode === 200 && response?.data?.length) {
                currentweekData = currentweekData.map(date => {
                    response.data.forEach(note => {
                        if (dateFormater(date.date) === dateFormater(note.date)) {
                            date.note = true;
                            date.data = note;
                        }
                    })
                    return date;
                })
            }


            getEventListingForAssigner(_currentDate, currentweekData)
            setIsLoading(false);
        } catch (e) {
            setIsLoading(false);
            toast.error(e.message);
        }
    }


    const getEventListingForAssigner = async (_currentDate, array) => {
        setIsLoading(true);
        const selectedStartDate = moment(_currentDate).startOf('isoWeek');
        const selectedEndDate = moment(_currentDate).endOf('isoWeek');
        try {
            let currentweekInfo = calendarView === '1' ? generateWeek(selectedStartDate, selectedEndDate) : generateMonth(_currentDate)

            let response = ''
            if (calendarView === '1') {
                response = await getEventListForAssigner(getDetailsOwnerIfStaff, selectedStartDate.format('YYYY-MM-DDTHH:mm'), selectedEndDate.format('YYYY-MM-DDTHH:mm'), selectedOfficeFilter)
            } else {
                let startDate = moment(_currentDate).startOf('month')
                let endDate = moment(_currentDate).endOf('month')
                response = await getEventListForAssigner(getDetailsOwnerIfStaff, startDate.format('YYYY-MM-DDTHH:mm'), endDate.format('YYYY-MM-DDTHH:mm'), selectedOfficeFilter)
            }

            if (response.statusCode === 200 && response?.data?.length) {
                setIsEvent(true)
                settotalEvents(response?.data?.length)
                currentweekInfo = array.map(detail => {
                    response.data.forEach(item => {
                        if (!detail.events) detail.events = [];
                        if (dateFormater(detail.date) === dateFormater(item.date)) {
                            detail.item = true;
                            detail.events = [...detail.events, item];
                        }
                    })
                    return detail

                })
            } else {
                settotalEvents(0)
                setIsEvent(false)

            }

            setWeekData(currentweekInfo);
            setEventListData(currentweekInfo)
            setIsLoading(false);



            if (isMobileTab() && isSidebarActive && selectedOfficeFilter?.length) {
                handleSidebarToggle()
            }


        } catch (e) {
            setIsLoading(false);
            toast.error(e.message);
        }
    }

    const updateList = (data, type) => {
        if (data && (type === 'ADD' || type === 'EDIT')) {
            weekData[index].note = true;
            weekData[index].data = data.data;
        }

        if (type === 'DELETE') {
            weekData[index].note = false;
            delete weekData[index].data;
        }
        setWeekData([...weekData]);

    }

    const deleteNotesConfirm = async () => {

        setdeleteConfirmation({
            visible: false,
            id: ''
        });
        setIsLoading(true);

        try {
            let res = await deleteSchedularNote(deleteConfirmation.id);
            if (res.statusCode === 200) {
                updateList('', 'DELETE');
                toast.success(res?.message);

            }
            setIsLoading(false);
        } catch (e) {
            setIsLoading(false);
            toast.error(e.message);
        }
    }

    const twoDigit = (number) => {
        return number >= 10 ? number : "0" + number.toString();
    }

    const dateFormater = (date) => {
        return moment(date).format("YYYY-MM-DD");
    }

    const addNotesModelShow = (data, type) => {
        isAddNotesModal.visible = true;
        isAddNotesModal.data = data;
        isAddNotesModal.type = type;
        if (type === 'EDIT') {
            isAddNotesModal.value = data.data.text;
        }
        setIsAddNotesModal({ ...isAddNotesModal });
    }

    const editNotesModelShow = (data) => {
        isEditNotesModal.visible = true;
        isEditNotesModal.data = data;
        setIsEditNotesModal({ ...isEditNotesModal });
    }

    const moveToDetailPage = (id) => {
        history.push(constants.routes.scheduler.eventDetails.replace(':eventId', encodeId(id)));
    }

    const scrollToError = () => {
        setTimeout(() => {
            const error = document.getElementsByClassName('moveToday');
            if (error && error.length) {
                error[0].scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                    inline: 'start',
                });
            }
        }, 1000);
    }


    const classForMoveToScrool = (v, _index) => {
        if (moment(v.date).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) {
            return 'moveToday'
        }
        else if (_index === 0) {
            return 'startUp'
        }
        else return ''
    }
    const tableDates = weekData?.map((v, _index) => (
        <th key={_index} className={classForMoveToScrool(v, _index)}>
            {v?.mDate}
            {v.note ? (
                <img
                    src={require("assets/images/edit-notes.svg").default}
                    alt="icon"
                    title={t('accountOwner.viewNote')}
                    onClick={() => {
                        setindex(_index);
                        editNotesModelShow(v);
                    }}
                    className={styles["notes-icon"]}
                />
            ) : (
                <img
                    src={require("assets/images/add-notes.svg").default}
                    alt="icon"
                    title={t('accountOwner.addNote')}
                    onClick={() => {
                        setindex(_index);
                        addNotesModelShow(v, "ADD");
                    }}
                    className={styles["notes-icon"]}
                />
            )}
        </th>
    ));


    const publishEvent = (id, parentIndex, subIndex) => {
        seteventId({ id, parentIndex, subIndex })
        setIsPublishEventModalOpen(true)
    }

    const publishedEventConfirm = async () => {
        const { id } = eventId;
        setIsPublishEventModalOpen(false);
        try {
            let response = await eventPublished(id);
            if (response.statusCode === 200) {
                getNotes(currentDate)
                toast.success(response.message)
            } else {
                toast.error(response.message)
            }
        } catch (e) {
            setIsLoading(false);
            toast.error(e.message);
        }
    }



    const tableEventData = weekData?.map((event, _index) => (
        <td key={_index}>
            {(event?.events && event?.events.length > 0) ?
                event.events?.sort((a, b) => {
                    if (moment(moment(b?.startTime).format('HH:mm'), 'HH:mm').isAfter(moment(moment(a?.startTime).format('HH:mm'), 'HH:mm'))) {
                        return -1
                    } else {
                        return 1
                    }
                })?.map((item, key) => (
                    <div key={key} className={styles["scheduler-event-box"]}>
                        
                        <div className="cursor-pointer" onClick={() => moveToDetailPage(item?.id)}>
                            <div className={styles["event-tag"] + ' ' + (item?.publishAsEvent ? styles['dark-grey-bg'] : styles['theme-green-bg'])}>
                                {!item?.publishAsEvent ? t('scheduler.unPublishEvent') : t("scheduler.publishedEvent")}
                            </div>
                            <div className={styles["event-date"]}>
                                {item?.isAllDayEvent ? t('accountOwner.allDayEvent') : (
                                    moment(item?.startTime).format('h:mm A') + " - " +
                                    moment(item?.endTime).format('h:mm A'))}
                                ({item?.office?.state?.timezoneCode})

                            </div>
                            <div className={styles["event-office"]}>{item?.office?.name} </div>
                            <div className={styles["event-type"]}> {titleWordLimit(item?.title)} </div>
                        </div>
                        <div className="ml-2">
                            <div onClick={(e) => toggleEmpPopup(e, item?.id)}>
                                <span className="link-btn"  >
                                    {t("accountOwner.assignedEmployees")}
                                    {item?.eventEmployees.length > 0 ?
                                        twoDigit(item?.eventEmployees.length) : item?.eventEmployees.length}
                                </span>
                            </div>
                            <div>
                                <span className="link-btn">{t('scheduler.reqToJoin')}:
                                    {item?.eventRequestToJoins?.length > 0 ? twoDigit(item?.eventRequestToJoins?.length) : 0}
                                </span>
                            </div>
                            {item?.eventTags?.length > 0 &&
                                (<div className={styles["event-meta-list"]}>
                                    {item?.eventTags?.map((name, __index) => {
                                        return (<span key={__index}> {name?.title}</span>)
                                    })}
                                </div>
                                )
                            }

                            {!item?.publishAsEvent &&
                                <div className="mt-2 pt-1">
                                    <span className="link-btn" onClick={() => publishEvent(item?.id, _index, key)}>
                                        {t("scheduler.publishEvent")} </span>
                                </div>
                            }
                        </div>

                        {isEmpPopActive === item?.id && (
                            <div className={styles["employee-popup-box"]}>
                                <span className={styles["close-icon"]} onClick={() => setEmpPopupActive("")}>&times;</span>
                                <div className={styles["emp-data-list"]}>
                                {item?.eventEmployees?.map((e, __index) => {
                                    return (
                                        <div className={styles["emp-data"]} key={__index}>
                                            <Row key={__index} className={styles["row-box"]}>
                                                <Col lg={4}>
                                                    <Text size="14px" color="#587E85"
                                                        weight="500"> {e?.user?.firstName}  {e?.user?.lastName} </Text>
                                                </Col>
                                                <Col lg={5}>
                                                    <Text size="14px" color="#535B5F"
                                                        weight="400"> {e?.user?.role?.systemRole === 2 ? e?.user?.role?.name : e?.user?.designation?.name}</Text>
                                                </Col>
                                                <Col lg={3}>
                                                    <Text size="14px" color="#535B5F"
                                                        weight="400"> {t(getSchedulerStatusById(e?.status))}</Text>
                                                </Col>
                                            </Row>
                                        </div>
                                    )
                                })}
                                </div>
                            </div>
                        )}
                    </div>
                )): 
              ( 
                <div className='center'>
                    <div className={styles['empty-event']}> {t("scheduler.noEvent")} </div>
                </div>

                )
            }

        </td>
    ));

    const addModal = useMemo(() => {
        return (
            <AddNotesModal
                isAddNotesModal={isAddNotesModal}
                setIsAddNotesModal={setIsAddNotesModal}
                updateList={updateList}
                setIsLoading={setIsLoading}
                getDetailsOwnerIfStaff={getDetailsOwnerIfStaff}
            />
        );
        // eslint-disable-next-line
    }, [isAddNotesModal]);

    const editModal = useMemo(() => {
        return (
            <EditNotesModal
                isEditNotesModal={isEditNotesModal}
                setIsEditNotesModal={setIsEditNotesModal}
                addNotesModelShow={addNotesModelShow}
                setdeleteConfirmation={setdeleteConfirmation}
            />
        );
        // eslint-disable-next-line
    }, [isEditNotesModal]);

    const deleteModal = useMemo(() => {
        return (
            <DeleteNotes
                isDeleteEventModalOpen={deleteConfirmation.visible}
                setIsDeleteEventModalOpen={setdeleteConfirmation}
                deleteNotesConfirm={deleteNotesConfirm}
                updateList={updateList}
            />
        );
        // eslint-disable-next-line
    }, [deleteConfirmation]);



    const PublishModal = useMemo(() => {
        return (
            <PublishEventModal
                isPublishEventModalOpen={isPublishEventModalOpen}
                setIsPublishEventModalOpen={setIsPublishEventModalOpen}
                publishedEventConfirm={publishedEventConfirm}
            />
        );
        // eslint-disable-next-line
    }, [isPublishEventModalOpen]);

    const schedularView = useMemo(() => {
        return (
            <>

                {
                    (weekData.length > 0 ) &&
                        <div className={styles["scheduler-table-wrapper"] + " " + styles["fixed-header-table-wrapper"]} onClick={() => setEmpPopupActive("")}>
                            <div ref={calendarRef} className={styles["scheduler-fixed-table"] + " " + styles["event-shift-table"]}>
                                <table className={"table table-bordered " + styles["schedular-table"] + " " + styles["agenda-weekly-table"] + " " + styles["fixed-header-table"]}>
                                    <thead>
                                        <tr>
                                            {tableDates}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            {tableEventData}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        // :
                        // <div className="scheduler-empty-box">
                        //     {/* <p><img src={require("assets/images/request-calendar.svg").default} alt="icon" /> </p> */}
                        //     <Text
                        //         size='25px'
                        //         marginBottom="0"
                        //         weight='500'
                        //         color='#111B45' >
                        //         {t("scheduler.noEventsFound")}
                        //     </Text>
                        // </div>

                }
            </>
        );
        // eslint-disable-next-line
    }, [weekData, isEmpPopActive]);




    return (
        <>
            {(isLoading) && <Loader />}
            <div className={"table-card-border "}>
                {schedularView}
            </div>

            {addModal}
            {editModal}
            {deleteModal}
            {PublishModal}

        </>);
}

export default withTranslation()(EventsShiftsWeekly);