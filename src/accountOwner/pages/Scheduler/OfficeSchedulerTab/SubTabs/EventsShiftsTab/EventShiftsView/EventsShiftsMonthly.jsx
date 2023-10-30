import React, { Fragment, useEffect, useState, useMemo } from 'react'
import { encodeId, generateCalanderMonthViewEvent } from 'utils';
import moment from 'moment';
import constants from '../../../../../../../constants'
import styles from "./../../../../Scheduler.module.scss";
import { Col, Row } from 'reactstrap';
import Text from 'components/Text';
import { withTranslation } from 'react-i18next';
import { useGetOfficeEventMonthly, useGetNotesEventMonthly , deleteSchedularNote , eventPublished} from 'repositories/scheduler-repository';
import AddNotesModal from '../Modals/AddNotesModal';
import EditNotesModal from '../Modals/EditNotesModal';
import DeleteNotes from '../Modals/DeleteNotes';
import Loader from 'components/Loader';
import { getSchedulerStatusById } from '../../../../../../../constants';
import { getWeekDay , titleWordLimit } from 'utils';
import toast from 'react-hot-toast';
import PublishEventModal from 'accountOwner/pages/Scheduler/components/Modals/PublishEvent';
import { useHistory } from 'react-router-dom';
import uniq from 'lodash/uniq';


function EventsShiftsMonthly({ t, settotalEvents,
    getDetailsOwnerIfStaff, currentDate, setcurrentDate, calendarView, selectedOfficeFilter, searchValue, upDateListonApply, handleSidebarToggle, isSidebarActive }) {
    const [monthDates, setmonthDates] = useState([]);
    const [dateRange, setDateRange] = useState(null);
    const [noteEventListing, setEventListing] = useState([]);
    const [noteEventListingFilter, setEventListingFilter] = useState([]);
    const [eventCardListing, setEventCardListing] = useState({});
    const [
        //remaningEvent
        , 
        setRemaningEvent
    ] = useState([]);

    const [assignEmpModel, setAssignEmpModel] = useState({});
    const [isLoader, setIsLoading] = useState(false);
    const [isPublishEventModalOpen, setIsPublishEventModalOpen] = useState(false)
    const [notesIndex, setNotesIndex] = useState()
    const [eventId, seteventId] = useState('');
    const history = useHistory()
    const [isAddNotesModal, setIsAddNotesModal] = useState({
        visible: false,
        date: '',
        value: ''
    });
    const [isEditNotesModal, setIsEditNotesModal] = useState({ visible: false });
    const [deleteConfirmation, setdeleteConfirmation] = useState({ visible: false,id: ''})
    const [totalEventCount, settotalEventCount] = useState(0)


    let isTrue = (dateRange?.startDate) ? true : false
    const { isLoading, data: eventListing, error, refetch , isFetching } = useGetOfficeEventMonthly(getDetailsOwnerIfStaff, dateRange?.startDate, dateRange?.endDate, selectedOfficeFilter,{enabled: isTrue});
    const { isLoading: notesLoad, data: notesListing, error: isError, refetch: fetchNotes } = useGetNotesEventMonthly(getDetailsOwnerIfStaff, dateRange?.startDate, dateRange?.endDate,{enabled: isTrue});
    let weekDays = constants.weekday


    // Handle error for notes and events listing
    useEffect(() => {
        if (error || isError) {
            toast.error(error || isError)
        }
    }, [error, isError])

    useEffect(() => {
    // let isTrue = (dateRange?.startDate) ? true : false
    if(dateRange?.startDate){

        refetch()
        fetchNotes()
    }
    }, [upDateListonApply])
    


    useEffect(() => {
        if (currentDate) {
            calanderDates(currentDate)
            setDateRange({
                startDate: moment(currentDate).startOf('month').startOf('isoweek').format('YYYY-MM-DD'),
                endDate: moment(currentDate).endOf('month').format('YYYY-MM-DD')
            })
        }
    }, [currentDate])


    
    

    useEffect(() => {
        let count = 0

        setEventListing([])
        if (notesListing) {
            let combineData = JSON.parse(JSON.stringify(monthDates))
            if (notesListing?.data?.length) {
                combineData = monthDates.map(date => {
                    notesListing?.data?.forEach(note => {
                        if (dateFormater(date.date) === dateFormater(note.date)) {
                            date.note = true;
                            date.data = note;
                        }
                    });
                    return date
                })
            }    
            
            if (eventListing?.data?.length) {
                let newArray = JSON.parse(JSON.stringify(combineData)) 
                combineData = newArray.map(detail => {
                    eventListing?.data?.forEach(item => {
                        if (!detail.events) detail.events = [];
                        if (dateFormater(detail.date) === dateFormater(item.date)) {
                            count = (count + 1)
                            detail.item = true;
                            detail.events = [...detail.events, item];
                        }
                    })
                    detail.events = detail.events.length ?  uniq(detail.events, 'id') : []  
                    return detail
                })
            }
       
            settotalEvents(count)
            settotalEventCount(count)
            let uniqCombineData  = uniq(combineData, 'id')
            setEventListing([...uniqCombineData]);
            setEventListingFilter(uniqCombineData)
        }

    }, [eventListing, notesListing])



    useEffect(()=>{
        const allEventData = JSON.parse(JSON.stringify(noteEventListingFilter));
        let filterCount = 0
        if(searchValue && allEventData?.length){
                let filterList = allEventData?.map(item => {
                let titleList = (item?.events && item?.events?.length) && item.events?.filter(data => {
                    if ((data.title.toLowerCase().includes(searchValue.toLowerCase())) || (data.eventTags?.length && data?.eventTags.filter(e => e?.title?.toLowerCase()?.includes(searchValue?.toLowerCase()))?.length)) {
                        return data;
                    }
                })
                item.events = titleList;
                filterCount = filterCount + (item?.events?.length ? item?.events?.length : 0)
                if(!titleList?.length){
                item.events = [];   
                }

                return  item

            })
            setEventListing(filterList)
            settotalEvents(filterCount)

        }else{
            settotalEvents(totalEventCount)
            setEventListing(allEventData)

        }

    },[searchValue])

    const dateFormater = (date) => {
        return moment(date).format("YYYY-MM-DD");
    }

    const calanderDates = (dateCurrent) => {
        let dates = generateCalanderMonthViewEvent(dateCurrent)
        dates && setmonthDates([...dates])
    }

    const handleEventList = (list, index, date) => {
        let dataList = JSON.parse(JSON.stringify(list))
        dataList.splice(0, 1)
        setAssignEmpModel({})
        setRemaningEvent(uniq(dataList, 'id'))
        setEventCardListing({
            list:uniq(dataList, 'id'),
            index,
            date
        })
    };

    const twoDigit = (number) => {
        return number >= 10 ? number : "0" + number.toString();
    }


    const EventEmployee = () => {
        return (
            <div className={`${styles["scheduler-popup-box"]} ${styles["employee-popup-box"]} }`}>
                <span className={styles["close-icon"]} onClick={() => setAssignEmpModel({})}>&times;</span>
                <div className={styles["emp-data-list"]}>
                {
                    assignEmpModel?.list?.map((e, _index) =>
                        <div className={styles["emp-data"]}>
                            <Row key={_index} className={styles["row-box"]}>
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
                }
                </div>

            </div>
        )
    }

    const EventCard = ({parentIndex,list}) => {
        let listing = JSON.parse(JSON.stringify(list))
        if(listing?.length === 1){
            setEventCardListing({})
        }
        
        return (
            <>
                <div className={styles["monthly-event-list"]}>
                    <span className={styles["close-icon-list"]}
                        onClick={() =>{
                             setEventCardListing({})
                             setRemaningEvent([])
                            }}>
                        <img src={require('assets/images/close-grey.svg').default} alt="icon" />
                    </span>
                    <div className={styles['day-date-box']}>
                        <div className={styles['day-name']}>{getWeekDay(eventCardListing?.date)}</div>
                        <div className={styles['date-name']}>{moment(eventCardListing?.date).format('DD')} </div>
                    </div>
                    <div className={styles["event-list-ul"]}>
                        {
                            listing?.map((item, cardIndex) =>{

                            if(!cardIndex) return null
                            return(
                                    <Fragment key={cardIndex}>
                                    <EventBox
                                     item={item}
                                     index={cardIndex}
                                     date={eventCardListing?.date}
                                     parentIndex={parentIndex}
                                     type={constants.PopUp.innerPopUp} scrollClass={item?.activeClass} />
                                    {(constants.PopUp.innerPopUp === assignEmpModel?.type && assignEmpModel?.index === cardIndex &&
                                        assignEmpModel?.date === eventCardListing?.date) && <EventEmployee />}
                                </Fragment>
                                )
                            }
                            )
                        }
                    </div>
                </div>
            </>
        )

    }

    const SeeMoreButton = ({ list, index, date }) => {
        if (list?.events?.length > 1) {
            return (<span className={"link-btn"} onClick={() => handleEventList(list.events, index, date)}> See more</span>)
        }
        return null
    }

    const assignedEmployeesToggle = (list, index, date, type) => {
        if (list && list?.length) {
            setAssignEmpModel({
                list: list,
                index: index,
                date: date,
                type: type
            })
        }
    }
    
    const scrollToEvent = () => {
        setTimeout(() => {
          const err = document.getElementsByClassName("activeClass");
          if (err && err?.length) {
            err[err?.length - 1].scrollIntoView({
              behavior: "smooth",
              block: "center",
              inline: "start",
            });
          }
        }, 100);
      };
    

    const EventBox = ({ item, index, date, type , parentIndex , scrollClass}) => {
        let activeClass = (type === constants.PopUp.innerPopUp && assignEmpModel?.index === index) ? 'active-event' : '';
        scrollClass = scrollClass ? scrollClass : ''
        return (
            <div
                className={`${styles["scheduler-event-box"]} ${styles[activeClass]} ${scrollClass}`}>
                <div className={styles["event-tag"] + ' ' + (item?.publishAsEvent ? styles['dark-grey-bg'] : styles['theme-green-bg'])}>
                    {!item?.publishAsEvent ? t('scheduler.unPublishEvent') : t("scheduler.publishedEvent")}
                </div>
                <div className={styles["event-date"]}>
                    {item?.isAllDayEvent ? t('accountOwner.allDayEvent') : (
                        moment(item?.startTime).format('h:mm A') + " - " +
                        moment(item?.endTime).format('h:mm A'))}
                    ({item?.office?.state?.timezoneCode})

                </div>
                <div className={styles["event-office"]}
                  onClick={() => moveToDetailPage(item.id)}
                >{item?.office?.name} </div>
                <div className={styles["event-type"]}
                  onClick={() => moveToDetailPage(item.id)}
                > {titleWordLimit(item?.title)} </div>
                <div >
                    <div>
                        <span className="link-btn" onClick={() => {
                            assignedEmployeesToggle(item.eventEmployees, index, date, type);

                        }}  >
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
                        <div className="mt-2 pt-1" onClick={()=> publishEvent(item?.id,type,index,parentIndex)}>
                            <span className="link-btn" >
                                {t("scheduler.publishEvent")} </span>
                        </div>
                    }
                </div>
            </div>
        )
    }

    const editNotesModelShow = (data) => {
        isEditNotesModal.visible = true;
        isEditNotesModal.data = data;
        setIsEditNotesModal({ ...isEditNotesModal });
    }

    const noteImage = (list, index) => {
        if (!list?.note) {
            return (
                <img
                    src={require("assets/images/add-notes.svg").default}
                    alt="icon"
                    title={t('accountOwner.addNote')}
                    className={`${styles["notes-icon"]} pointer`}
                    onClick={() => {
                        setNotesIndex(index)
                        addNotesModelShow(list, "ADD")
                    }}
                    
                />
            )

        } else {
            return (
                <img
                    src={require("assets/images/edit-notes.svg").default}
                    alt="icon"
                    title={t('accountOwner.viewNote')}
                    className={`${styles["notes-icon"]} pointer`}
                    onClick={() =>{
                        setNotesIndex(index)
                        editNotesModelShow(list)
                    }}
                />
            )
        }
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

    const updateList = (data, type) => {
        if (data && (type === 'ADD' || type === 'EDIT')) {
            noteEventListing[notesIndex].note = true;
            noteEventListing[notesIndex].data = data.data;
        }
        if (type === 'DELETE') {
            noteEventListing[notesIndex].note = false;
            delete noteEventListing[notesIndex].data;
        }
        setEventListing([...noteEventListing]);
        setEventListingFilter([...noteEventListing])

    }

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

    const publishEvent = (id, type, index , parentIndex) => {
        setIsPublishEventModalOpen(true)
        seteventId({ id, type, index , parentIndex })
    }

    const publishedEventConfirm = async () => {
        try {
            setIsLoading(true);
            const {id, type, parentIndex } = eventId
            let response = await eventPublished(id);
            if (response.statusCode === 200) {
                if(constants.PopUp.outerPopUp === type){
                    noteEventListing[parentIndex].events[0].publishAsEvent = true
                    setEventListing([...noteEventListing])
                }

                if(constants.PopUp.innerPopUp === type){
                    let childEventIndex = noteEventListing[parentIndex]?.events?.findIndex(e => e.id === id)
                    let updateEventes = []
                    updateEventes= noteEventListing[parentIndex]?.events?.map((item,index) =>{
                        if(index === childEventIndex){
                            item.publishAsEvent = true
                            item.activeClass = 'activeClass'                  
                        }else{
                            delete  item.activeClass              
                        }
                        return item
                    })  
                    noteEventListing[parentIndex].events =  [...updateEventes]
                    setEventListing([...noteEventListing])             
                    scrollToEvent()
                    
                }
                toast.success(response.message)
                setIsPublishEventModalOpen(false);
                setIsLoading(false);
            } else {
                toast.error(response.message)
                setIsLoading(false);

            }
        } catch (e) {
            setIsLoading(false);
            toast.error(e.message);
        }
    }    

    const moveToDetailPage = (id) => {
        history.push(constants.routes.scheduler.eventDetails.replace(':eventId', encodeId(id)));
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



    
    const MonthlyViewTable = useMemo(() =>{
        return(
            <div className={styles['monthly-tr']}>
            {noteEventListing?.map((list, index) =>
                <>
                    {list?.events?.length ?
                        <>
                            <div className={`${styles['monthly-col']} ${styles["monthly-td"]} 
                            ${(eventCardListing?.date === list?.date || assignEmpModel?.date === list?.date ) && styles["active-date"]}`}>
                                <div className={styles["date-box"]}>
                                    {moment(list.date).format('DD')}
                                    <span  className={styles["mobile-week-days"]}>
                                    ({getWeekDay(list?.date)}) 
                                </span>
                                    
                                    {noteImage(list, index)}
                                </div>
                                {
                                    list.events.sort((a, b) => {
                                        if (moment(moment(b?.startTime).format('HH:mm'), 'HH:mm').isAfter(moment(moment(a?.startTime).format('HH:mm'), 'HH:mm'))) {
                                            return -1
                                        } else {
                                            return 1
                                        }
                                    }).slice(0, 1).map((item, eventIndex) =>
                                    {

                                        return(
                                            <>
    
                                            <EventBox
                                                item={item}
                                                index={eventIndex}
                                                date={list.date}
                                                type={constants.PopUp.outerPopUp}
                                                parentIndex={index}
                                            />
    
                                            <div className={styles["more-event-box"]}>
                                                <SeeMoreButton list={list} index={eventIndex} date={list.date} />
                                                {
                                                    (eventCardListing?.index === eventIndex && eventCardListing?.date === list?.date) &&
                                                    (<EventCard index={index} 
                                                        parentIndex={index}
                                                 list={list?.events} date={moment(list.date).format('DD')} />)
                                                }
    
                                               
                                            {(constants.PopUp.outerPopUp === assignEmpModel?.type && assignEmpModel?.index === eventIndex && assignEmpModel?.date === list?.date)
                                                && <EventEmployee />}
                                            </div>
                                         
                                        </>
                                        )
                                    }
    
    
                                    )
    
                                }
                            </div>
                        </>
                        :
                        <div className={styles['monthly-col'] + ' ' + styles["monthly-td"]}>
                            <div className={styles["date-box"]}>
                                {moment(list.date).format('DD')}
                                <span  className={styles["mobile-week-days"]}>
                                    ({getWeekDay(list?.date)}) 
                                </span>
                                {noteImage(list,index   )}
    
                            </div>
                            <div className={styles['empty-event']}> {t("scheduler.noEvent")} </div>
                        </div>
                    }
                </>
            )}
             </div>
        )
    },
    [monthDates,noteEventListing,eventCardListing,assignEmpModel])






    return (
        <div className={styles['montly-calendar-wrapper']}>
            {(isLoading || notesLoad || isLoader || isFetching) && <Loader />}
            <div className={styles['monthly-tr']}>
                {weekDays?.map(item =>
                    <div className={styles['monthly-th'] + " " + styles['monthly-col']}>
                        {item.slice(0, 3)}
                    </div>
                )}
            </div>
            {MonthlyViewTable}

          

            {addModal}
            {editModal}
            {deleteModal}
             <PublishEventModal isPublishEventModalOpen={isPublishEventModalOpen} setIsPublishEventModalOpen={setIsPublishEventModalOpen} publishedEventConfirm={publishedEventConfirm} />
          

        </div>
    );
}

export default withTranslation()(EventsShiftsMonthly);
