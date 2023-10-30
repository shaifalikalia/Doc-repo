import React, { useEffect, useState } from 'react'
import { generateCalanderMonthView } from 'utils';
import moment from 'moment';
import constants from '../../../../../../../constants'
import styles from "./../../../../Scheduler.module.scss";
import { Col, Row } from 'reactstrap';
import Text from 'components/Text';
import { withTranslation } from 'react-i18next';


function EventsShiftsMonthly({ t, currentDate }) {

    const [monthDates, setmonthDates] = useState([]);
    const [isEventListActive, setEventListActive] = useState();
    const [activePopLast, SetActivePopLast] = useState()
    const startDate = moment(currentDate).startOf('month').startOf('isoweek').format('YYYY-MM-DD')
    let weekDays = constants.weekday

    useEffect(() => {
        calanderDates(currentDate)

    }, [startDate])


    const calanderDates = (dateCurrent) => {
        let dates = generateCalanderMonthView(dateCurrent)
        if (dates) {
            dates[1].isData = false
            dates[2].isData = false
            dates[4].isData = false
            dates[10].isData = false
            setmonthDates([...dates])
        }

    }
    const handleEventList = (index) => {
        setEventListActive(index)
        if ((isEventListActive || isEventListActive === 0) && monthDates[isEventListActive].handleEventList) {
            monthDates[isEventListActive].handleEventList = false
        }
        monthDates[index].handleEventList = true
        setmonthDates([...monthDates])
    };
    const handleEventListClose = index => {
        setEventListActive();
        monthDates[index].handleEventList = false
        setmonthDates([...monthDates])
    }
    const openModal = (index) => {
        SetActivePopLast(index)
        if ((activePopLast || activePopLast === 0) && monthDates[activePopLast].openModel) {
            monthDates[activePopLast].openModel = false
        }
        monthDates[index].openModel = true
        setmonthDates([...monthDates])
    };

    const closeModal = index => {
        SetActivePopLast();
        monthDates[index].openModel = false
        setmonthDates([...monthDates])
    }


    return (
        <div className={styles['montly-calendar-wrapper']}>
            <div className={styles['monthly-tr']}>
                {weekDays?.map((item, key) =>
                    <div
                        key={key} 
                        className={styles['monthly-th'] + " " + styles['monthly-col']}>
                        {item.slice(0, 3)}
                    </div>
                )}
            </div>

            <div className={styles['monthly-tr']}>
                {monthDates?.map((item, index) =>
                    <>
                        {item.isData ?
                            <div
                                key={index} 
                                className={`${styles['monthly-col']} ${styles["monthly-td"]} ${item.handleEventList && styles["active-date"]}`}>
                                <div className={styles["date-box"]}>
                                    {moment(item.date).format('DD')}
                                </div>
                                <div
                                    className={`${styles["scheduler-event-box"]}`}>
                                    <div className={styles["event-tag"]}>{t("scheduler.publishedEvent")} </div>
                                    <div className={styles["event-date"]}>All Day  (PST)</div>
                                    <div className={styles["event-office"]}>Lifeline Hospital </div>
                                    <div className={styles["event-type"]}>Patient Appointments </div>
                                    <div>
                                        <span className="link-btn"  >
                                            {t("accountOwner.assignedEmployees")} 09
                                        </span>
                                    </div>
                                    <div>
                                        <span className="link-btn">{t('scheduler.reqToJoin')}: 11
                                        </span>
                                    </div>
                                    <div className={styles["event-meta-list"]}>
                                        <span>Test </span> <span>Test </span> <span>Test </span>
                                    </div>
                                </div>

                                <div className={styles["more-event-box"]}>
                                    <span className={"link-btn"} onClick={() => handleEventList(index)}> See more</span>
                                    {item.handleEventList && (
                                        <div className={styles["monthly-event-list"]}>
                                            <span className={styles["close-icon-list"]}
                                                onClick={() => handleEventListClose(index)}>
                                                <img src={require('assets/images/close-grey.svg').default} alt="icon" />
                                            </span>
                                            <div className={styles['day-date-box']}>
                                                <div className={styles['day-name']}>Wed</div>
                                                <div className={styles['date-name']}>29</div>
                                            </div>
                                            <div className={styles["event-list-ul"]}>
                                                <div
                                                    className={` ${styles["scheduler-event-box"]} ${activePopLast && styles["active-card"]}`}>
                                                    <div className={styles["event-tag"] + " " + styles['theme-green-bg']}>{t("scheduler.unPublishEvent")} </div>
                                                    <div className={styles["event-date"]}>All Day  (PST) <span className='ml-1'>Lifeline Hospital</span></div>
                                                    <div className={styles["event-type"]}>Leave </div>
                                                    <div>
                                                        <span className="link-btn"  onClick={() => openModal(index)} >
                                                            {t("accountOwner.assignedEmployees")} 09
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="link-btn">{t('scheduler.reqToJoin')}: 11
                                                        </span>
                                                    </div>
                                                    <div className={styles["event-meta-list"]}>
                                                        <span>Test </span> <span>Test </span> <span>Test </span>
                                                    </div>
                                                </div>
                                                <div className={styles["scheduler-event-box"]}>
                                                    <div className={styles["event-tag"]}>{t("scheduler.publishedEvent")} </div>
                                                    <div className={styles["event-date"]}>All Day  (PST) <span className='ml-1'>Lifeline Hospital</span></div>
                                                    <div className={styles["event-type"]}>Patient Appointments </div>
                                                    <div>
                                                        <span className="link-btn"  >
                                                            {t("accountOwner.assignedEmployees")} 09
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="link-btn">{t('scheduler.reqToJoin')}: 11
                                                        </span>
                                                    </div>
                                                    <div className={styles["event-meta-list"]}>
                                                        <span>Test </span> <span>Test </span> <span>Test </span>
                                                    </div>
                                                </div>
                                                <div className={styles["scheduler-event-box"]}>
                                                    <div className={styles["event-tag"]}>{t("scheduler.publishedEvent")} </div>
                                                    <div className={styles["event-date"]}>All Day  (PST) <span className='ml-1'>Lifeline Hospital</span></div>
                                                    <div className={styles["event-type"]}>Patient Appointments </div>
                                                    <div>
                                                        <span className="link-btn"  >
                                                            {t("accountOwner.assignedEmployees")} 09
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="link-btn">{t('scheduler.reqToJoin')}: 11
                                                        </span>
                                                    </div>
                                                    <div className={styles["event-meta-list"]}>
                                                        <span>Test </span> <span>Test </span> <span>Test </span>
                                                    </div>
                                                </div>
                                            </div>
                                            {item.openModel && (
                                                <div className={`${styles["scheduler-popup-box"]} ${styles["employee-popup-box"]}`}>
                                                    <span className={styles["close-icon"]} onClick={() => closeModal(index)}>&times;</span>
                                                    <div className={styles["emp-data"]}>
                                                        <Row className={styles["row-box"]}>
                                                            <Col xl={4}>
                                                                <Text size="14px" color="#587E85"
                                                                    weight="500">Igor Antonovich </Text>
                                                            </Col>
                                                            <Col xl={5}>
                                                                <Text size="14px" color="#535B5F"
                                                                    weight="400">Associate Doctors</Text>
                                                            </Col>
                                                            <Col xl={3}>
                                                                <Text size="14px" color="#535B5F"
                                                                    weight="400"> Accepted</Text>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                    <div className={styles["emp-data"]}>
                                                        <Row className={styles["row-box"]}>
                                                            <Col xl={4}>
                                                                <Text size="14px" color="#587E85"
                                                                    weight="500">Igor Antonovich </Text>
                                                            </Col>
                                                            <Col xl={5}>
                                                                <Text size="14px" color="#535B5F"
                                                                    weight="400">Associate Doctors</Text>
                                                            </Col>
                                                            <Col xl={3}>
                                                                <Text size="14px" color="#535B5F"
                                                                    weight="400"> Accepted</Text>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                </div>
                            </div>
                            :
                            <div className={styles['monthly-col'] + ' ' + styles["monthly-td"]}>
                                <div className={styles["date-box"]}>
                                    {moment(item.date).format('DD')}
                                </div>
                                <div className={styles['empty-event']}> {t("scheduler.noEvent")} </div>
                            </div>
                        }
                    </>
                )}
            </div>
        </div>
    );
}

export default withTranslation()(EventsShiftsMonthly);
