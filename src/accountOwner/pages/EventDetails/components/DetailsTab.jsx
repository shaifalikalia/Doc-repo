import React, { useMemo, useState } from 'react';
import styles from "../EventDetails.module.scss";
import Text from 'components/Text';
import { Col, Row } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import moment from 'moment';
import { getSchedulerStatusById } from '../../../../constants';
import { eventPublished, getEventIcsLink } from 'repositories/scheduler-repository';
import PublishEventModal from 'accountOwner/pages/Scheduler/components/Modals/PublishEvent';
import toast from 'react-hot-toast';
import CustomModal from 'components/CustomModal';
import AddToCalendar from 'accountOwner/pages/components/AddToCalendar';
import Loader from 'components/Loader';
import { addToCalenderText } from 'utils';


function DetailsTab({ t, eventDetails }) {

    const [isPublishEventModalOpen, setIsPublishEventModalOpen] = useState(false)
    const [eventId, seteventId] = useState('');
    const [eventDetail, seteventDetail] = useState(eventDetails);
    const [toolTipModal, setToolTipModal] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    const handleAddToCalendar = async () => {
        setIsDownloading(true);
        try {
            const url = await getEventIcsLink(eventDetail?.id);
            window?.open(url, "_self");
            toast.success(t('fileDownloaded'))
        } catch (error) {
            toast.error(error?.message);
        }
        setIsDownloading(false);
    }
    
    const publishedEventConfirm = async () => {
        const { id } = eventId
        setIsPublishEventModalOpen(false);
        try {
            let response = await eventPublished(id)
            if (response.statusCode === 200) {
                eventDetail.publishAsEvent = true
                seteventDetail({ ...eventDetails })
                toast.success(response.message)
            }
            else {
                toast.error(response.message)
            }
        } catch (e) {
            toast.error(e.message);
        }

    }
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


    const publishEvent = (id,) => {
        seteventId({ id })
        setIsPublishEventModalOpen(true)
    }


    return (
        <Row>
            {isDownloading && <Loader/>}
            <Col lg="12">
                <div className='d-flex justify-content-md-end mb-3'>
                    <div className={styles["status-tag"] + ' ' + (eventDetail?.publishAsEvent ? styles['dark-grey-bg'] : styles['theme-green-bg'])}>
                        {eventDetail?.publishAsEvent ? t("scheduler.publishedEvent") : t('scheduler.unPublishEvent')}
                    </div>

                 

                </div>
            </Col>
            <Col lg="6">
                <ul className={styles["white-col-list"]}>

                    <li>
                        <Text
                            size='12px'
                            marginBottom="5px"
                            weight='400'
                            color='#6f7788' >
                            {t('accountOwner.date')}
                        </Text>
                        <Text
                            size='14px'
                            marginBottom="0"
                            weight='600'
                            color='#102c42' >
                            {moment(eventDetail?.date, 'YYYY-MM-DDTHH:mm:ss').format('MMM DD, YYYY - ddd')}
                            {eventDetail?.isAllDayEvent ? ', ' + t('accountOwner.allDayEvent') : ''}
                            ({eventDetail?.office?.state?.timezoneCode})
                        </Text>
                    </li>
                    <li>
                        <Row>
                            <Col xs="6">
                                <Text
                                    size='12px'
                                    marginBottom="5px"
                                    weight='400'
                                    color='#6f7788' >
                                    {t('staff.startTime')}
                                </Text>
                                <Text
                                    size='14px'
                                    marginBottom="0"
                                    weight='600'
                                    color='#102c42' >
                                    {moment(eventDetail?.startTime, 'YYYY-MM-DDTHH:mm:ss').format('h:mm A')}
                                </Text>
                            </Col>
                            <Col xs="6">
                                <Text
                                    size='12px'
                                    marginBottom="5px"
                                    weight='400'
                                    color='#6f7788' >
                                    {t('staff.endTime')}
                                </Text>
                                <Text
                                    size='14px'
                                    marginBottom="0"
                                    weight='600'
                                    color='#102c42' >
                                    {moment(eventDetail?.endTime, 'YYYY-MM-DDTHH:mm:ss').format('h:mm A')}
                                </Text>
                            </Col>
                        </Row>

                    </li>

                    <li>
                        <Row>
                            <Col sm="6">
                                <Text
                                    size='12px'
                                    marginBottom="5px"
                                    weight='400'
                                    color='#6f7788' >
                                    {t('repeat')}
                                </Text>
                                <Text
                                    size='14px'
                                    marginBottom="0"
                                    weight='600'
                                    color='#102c42' >
                                    {eventDetail?.repeatedType === 2 ? `${t('scheduler.repeatForAll')} ${moment(eventDetail.date, 'YYYY-MM-DDTHH:mm:ss').format('dddd')}` : eventDetail?.repeatedType === 3 ? t('scheduler.repeatForAllFuture') : t('scheduler.never')}
                                </Text>
                            </Col>
                            {(eventDetail?.repeatedType !== 1 && eventDetail?.repeatedEndDate) && <Col sm="6">
                                <Text
                                    size='12px'
                                    marginBottom="5px"
                                    weight='400'
                                    color='#6f7788' >
                                    {t('accountOwner.endDateRepeatedEvents')}
                                </Text>
                                <Text
                                    size='14px'
                                    marginBottom="0"
                                    weight='600'
                                    color='#102c42' >
                                    {moment(eventDetail?.repeatedEndDate, 'YYYY-MM-DDTHH:mm:ss').format('MMM DD, YYYY - ddd')}  ({eventDetail?.office?.state?.timezoneCode})
                                </Text>
                            </Col>}

                        </Row>
                    </li>
                    <li>
                        <Text
                            size='12px'
                            marginBottom="5px"
                            weight='400'
                            color='#6f7788' >
                            {t('accountOwner.offices')}
                        </Text>
                        <Text
                            size='14px'
                            marginBottom="0"
                            weight='600'
                            color='#102c42' >
                            {eventDetail?.office?.name}
                        </Text>
                    </li>
                    <li>
                        <Text
                            size='12px'
                            marginBottom="5px"
                            weight='400'
                            color='#6f7788' >
                            {t('location')}
                        </Text>
                        <Text
                            size='14px'
                            marginBottom="0"
                            weight='600'
                            color='#102c42' >
                            {eventDetail?.location}
                        </Text>
                    </li>
                    <li>
                        <Text
                            size='12px'
                            marginBottom="5px"
                            weight='400'
                            color='#6f7788' >
                            {t('superAdmin.role')}
                        </Text>
                        {eventDetail?.eventRoles?.length > 0 && eventDetail?.eventRoles?.map((v, index) => (
                            <Text
                                size='14px'
                                marginBottom="5px"
                                weight='600'
                                color='#102c42'
                                key={index}
                            >
                                {v?.designations?.name}
                            </Text>
                        ))}
                    </li>
                    <li>
                        <Text
                            size='12px'
                            marginBottom="5px"
                            weight='400'
                            color='#6f7788' >
                            {t('accountOwner.employe')}
                        </Text>
                        <Text
                            size='14px'
                            marginBottom="0"
                            weight='600'
                            color='#102c42' >
                            {eventDetail?.eventEmployees?.length === 0 ? t("accountOwner.noEmployeesSelected") : (eventDetail?.eventEmployees?.length === 1 ? eventDetail?.eventEmployees?.[0]?.user?.firstName + ' ' + eventDetail?.eventEmployees?.[0]?.user?.lastName : eventDetail?.eventEmployees?.length + ' ' + t('Selected'))}
                        </Text>
                    </li>
                    <li>
                        <Text
                            size='12px'
                            marginBottom="5px"
                            weight='400'
                            color='#6f7788' >
                            {t('accountOwner.notes')}
                        </Text>
                        <Text
                            size='14px'
                            marginBottom="0"
                            weight='600'
                            color='#102c42' >
                            {eventDetail?.note}
                        </Text>
                    </li>
                    <li>
                        <Text
                            size='12px'
                            marginBottom="5px"
                            weight='400'
                            color='#6f7788' >
                            {t('accountOwner.tags')}
                        </Text>
                        <div className={styles["tag-list"]}>
                            {eventDetail?.eventTags?.length > 0 && eventDetail?.eventTags?.map((v, index) => (
                                <span key={index}>
                                    {v?.title}
                                </span>
                            ))}
                            {eventDetail?.eventTags?.length === 0 && <span>
                                -
                            </span>}
                        </div>
                    </li>
                    <li>
                        <AddToCalendar
                            firstIcon={require('assets/images/download-icon.svg').default}
                            middleText={t('accountOwner.addToCalendar')}
                            secondIcon={require('assets/images/alert-circle.svg').default}
                            handleAddToCalendar={handleAddToCalendar}
                            setToolTipModal={setToolTipModal}
                        />
                    </li>
                    {
                        !eventDetail.publishAsEvent && <li>
                            <button className="button button-round button-shadow mr-4" onClick={() => publishEvent(eventDetail.id)}
                                title={t("scheduler.PublishEvent")}>
                                {t("scheduler.publishEvent")}
                            </button>
                        </li>
                    }
                </ul>
            </Col>

            <Col lg="6">
                <ul className={styles["white-col-list"]}>
                    <div className={styles["invitation-status"]}>
                        <Text
                            size='20px'
                            marginBottom="10px"
                            weight='500'
                            color='#111b45' >
                            {t("accountOwner.employeesInvitationStatus")}
                        </Text>
                        <ul className={styles["invitation-list"]}>
                            {
                                eventDetail?.eventEmployees && eventDetail?.eventEmployees?.map((item, index) =>
                                    
                                        <li key={index}>
                                            <Text
                                                size='14px'
                                                marginBottom="0px"
                                                weight='500'
                                                color='#587e85'
                                                className="col-sm-4">
                                                {item.user?.firstName}
                                            </Text>
                                            <Text
                                                size='14px'
                                                marginBottom="0px"
                                                weight='400'
                                                color='#535b5f'
                                                className="col-sm-4" >
                                                {item?.user?.role?.systemRole === 2 ? '-' : item?.user?.designation?.name}
                                            </Text>
                                            <Text
                                                size='14px'
                                                marginBottom="0px"
                                                weight='400'
                                                color='#535b5f'
                                                className={ 'col-sm-4 ' + styles["pending_li"]}

                                                >

                                                {t(getSchedulerStatusById(item?.status))}
                                            </Text>

                                            {(item?.reasonForRejection || item?.reasonForCancel) &&
                                                (<Text
                                                    size='14px'
                                                    marginBottom="0"
                                                    weight='200'
                                                    color='#587e85'
                                                    margin="5px 0px" 
                                                    
                                                    className={styles["para_p"]}
                                                    >
                                                    <b> {item?.reasonForCancel ?
                                                     t("accountOwner.reasonOfCancellation") : t("accountOwner.reasonOfRejection")}:
                                                      </b>&nbsp;&nbsp;&nbsp;{item?.reasonForRejection || item?.reasonForCancel}
                                                </Text>
                                                )
                                            }
                                            {PublishModal}
                                        </li>
                            
                                    
                                )
                            }
                        </ul>
                    </div>
                </ul>
            </Col>
            <CustomModal
                isOpen={toolTipModal}
                setIsOpen={setToolTipModal}
                title={t('accountOwner.addToCalendar')}
                subTitle1={addToCalenderText()}
                calender={true}
            />
        </Row>
    );
}

export default withTranslation()(DetailsTab);