import React from 'react';
import styles from "./SchedularEvents.module.scss";
import { withTranslation } from 'react-i18next';
import { Row, Col } from 'reactstrap';
import Text from 'components/Text';
import moment from 'moment';
import constants, { getSchedulerStatusById } from '../../../../../constants';
import { useHistory } from "react-router-dom";
import { checkExpiredEvent, encodeId } from '../../../../../utils';
function EventDetail({ t, details, setIsRejectionModalOpen, checkEventSlot, setSelectedEvent }) {
    const history = useHistory();

    const isExpired = checkExpiredEvent(details);
    const repeatedType = details?.repeatedType === 2 ? `${t('scheduler.repeatForAll')} ${moment(details.date, 'YYYY-MM-DDTHH:mm:ss').format('dddd')}` : details?.repeatedType === 3 ? t('scheduler.repeatForAllFuture') : t('scheduler.never');


    const viewEventDetail = () => {
        history.push({
            pathname: constants.routes.scheduler.eventRequestDetails.replace(':eventId',encodeId(details.id)),
            state: {
                eventData: details
            }
        })
    }
    return (
        <>
            <div className={styles["event-card"] + " " + (isExpired ? styles["exipred-time-card"] : styles.pb5)}>
                <div className={styles["event-card-body"]} onClick={viewEventDetail}>
                    <div className={styles["event-header"]}>

                        <h4 className={styles.heading}>
                            {details?.title}
                        </h4>
                        <div className={styles["status-tag"] + ' ' + (details?.eventEmployees[0]?.status > 2 ? styles["bg-red"] : '')}>
                            {t(getSchedulerStatusById(details?.eventEmployees[0]?.status))}
                        </div>
                    </div>
                    <Row>
                        <Col sm="6">
                            <div className={styles["c-field"]}>
                                <Text
                                    size='12px'
                                    marginBottom="5px"
                                    weight='400'
                                    color='#6f7788' >
                                    {t("accountOwner.assigneddBy")}
                                </Text>
                                <Text
                                    size='14px'
                                    marginBottom="0"
                                    weight='600'
                                    color='#102c42' >
                                    {details?.createdBy?.firstName + ' ' + details?.createdBy?.lastName}
                                </Text>
                            </div>
                        </Col>
                        <Col sm="6">
                            <div className={styles["c-field"]}>
                                <Text
                                    size='12px'
                                    marginBottom="5px"
                                    weight='400'
                                    color='#6f7788' >
                                    {t("superAdmin.officeName")}
                                </Text>
                                <Text
                                    size='14px'
                                    marginBottom="0"
                                    weight='600'
                                    color='#102c42' >
                                    {details?.office?.name}
                                </Text>
                            </div>
                        </Col>

                        <Col sm="6">
                            <div className={styles["c-field"]}>
                                <Text
                                    size='12px'
                                    marginBottom="5px"
                                    weight='400'
                                    color='#6f7788' >
                                    {t("accountOwner.date")}
                                </Text>
                                <Text
                                    size='14px'
                                    marginBottom="0"
                                    weight='600'
                                    color='#102c42' >
                                    {moment(details?.date).format('MMM DD, YYYY')} - {moment(details?.startTime).format('h:mm A')} -  {moment(details?.endTime).format('h:mm A')} ({details?.office?.state?.timezoneCode})
                                </Text>
                            </div>
                        </Col>

                        {repeatedType && <Col sm="6">
                            <div className={styles["c-field"]}>
                                <Text
                                    size='12px'
                                    marginBottom="5px"
                                    weight='400'
                                    color='#6f7788' >
                                    {t("repeat")}
                                </Text>
                                <Text
                                    size='14px'
                                    marginBottom="0"
                                    weight='600'
                                    color='#102c42' >
                                    {repeatedType}
                                </Text>
                            </div>
                        </Col>
                        }
                        {(details?.eventEmployees[0]?.reasonForRejection || details?.eventEmployees[0]?.reasonForCancel) &&
                            (
                                <Col sm="12">
                                    <div className={styles["c-field"]}>
                                        <Text
                                            size='12px'
                                            marginBottom="5px"
                                            weight='400'
                                            color='#6f7788' >
                                            {t('staff.reason')}
                                        </Text>
                                        <Text
                                            size='14px'
                                            marginBottom="0"
                                            weight='600'
                                            color='#102c42' >
                                            {details?.eventEmployees[0]?.reasonForRejection || details?.eventEmployees[0]?.reasonForCancel}
                                        </Text>
                                    </div>
                                </Col>
                            )
                        }

                    </Row>
                </div>

                {!isExpired &&
                    <div className="d-flex mb-3">
                        {details?.eventEmployees[0]?.status === 1 &&
                            <>
                                <button className="button button-round button-border button-dark  mr-4"
                                    onClick={() => { setIsRejectionModalOpen(true); setSelectedEvent(details) }}
                                    title={t("decline")}>
                                    {t("decline")}
                                </button>
                                <button className="button button-round  button-shadow"
                                    title={t('accept')} onClick={() => { checkEventSlot(details); }}>
                                    {t('accept')}
                                </button>
                            </>
                        }
                        {details?.eventEmployees[0]?.status === 2 &&
                            <button className="button button-round button-border button-dark"
                                title={t('scheduler.cancelEvent')} onClick={() => { setIsRejectionModalOpen(true); setSelectedEvent(details) }}>
                                {t('scheduler.cancelEvent')}
                            </button>
                        }
                    </div>
                }
                {isExpired &&
                    <div className={styles["expire-status-box"]}>
                        {t('staff.timeExpired')}
                    </div>
                }
            </div>
        </>
    );
}


export default withTranslation()(EventDetail);