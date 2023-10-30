import React from 'react';
import styles from "./SchedularEvents.module.scss";
import { withTranslation } from 'react-i18next';
import { Row, Col } from 'reactstrap';
import Text from 'components/Text';
import { useState } from 'react';
import RepeatEventModal from './../Modals/RepeatEventModal';
import RejectionModal from './../Modals/RejectionModal';
import ConfirmAcceptModal from '../Modals/ConfirmAcceptModal';

function PendingEvents({ t, setExpiredTimePeriod, repeatedDaysEvent, requestTabEvent }) {
    const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
    const [isRepeatEventModalOpen, setIsRepeatEventModalOpen] = useState(false);
    const [isConfirmAcceptModalOpen, setIsConfirmAcceptModalOpen] = useState(false);

    return (
        <>
            {repeatedDaysEvent &&
                <div className={styles["event-card"]}>
                    <div className={styles["event-header"]}>
                        <h4 className={styles.heading}>
                            Check ICU Ward
                </h4>
                        <div className={styles["status-tag"]}>
                            {t("contracts.pending")}
                        </div>
                    </div>
                    <Row>
                        <Col sm="5">
                            <div className={styles["c-field"]}>
                                <Text
                                    size='12px'
                                    marginBottom="5px"
                                    weight='400'
                                    color='#6f7788' >
                                    {t("accountOwner.eventCreatedBy")}
                                </Text>
                                <Text
                                    size='14px'
                                    marginBottom="0"
                                    weight='600'
                                    color='#102c42' >
                                    Sarah Waters
                        </Text>
                            </div>
                        </Col>
                        <Col sm="7">
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
                                    Mar 4, 2022 - 10:30 AM - 11:00 AM (PST)
                        </Text>
                            </div>
                        </Col>
                        <Col sm="5">
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
                                    Repeats Every Wednesday
                        </Text>
                            </div>
                        </Col>
                    </Row>
                    <div className="d-flex">
                        <button className="button button-round button-border button-dark  mr-4"

                            title={t("decline")}>
                            {t("decline")}
                        </button>
                        <button className="button button-round  button-shadow"

                            onClick={() => { setIsRepeatEventModalOpen(true) }}
                            title={t('accept')}>
                            {t('accept')}
                        </button>
                    </div>
                </div>}
            <div className={styles["event-card"]}>
                <div className={styles["event-header"]}>
                    <h4 className={styles.heading}>
                        Give injections to patient
</h4>
                    <div className={styles["status-tag"]}>
                        {t("contracts.pending")}
                    </div>
                </div>
                <Row>
                    <Col sm="5">
                        <div className={styles["c-field"]}>
                            <Text
                                size='12px'
                                marginBottom="5px"
                                weight='400'
                                color='#6f7788' >
                                {t("accountOwner.eventCreatedBy")}
                            </Text>
                            <Text
                                size='14px'
                                marginBottom="0"
                                weight='600'
                                color='#102c42' >
                                Sarah Waters
</Text>
                        </div>
                    </Col>
                    <Col sm="7">
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
                                Mar 4, 2022 - 10:30 AM - 11:00 AM (PST)
</Text>
                        </div>
                    </Col>
                </Row>
                <div className="d-flex">
                    <button className="button button-round  button-shadow"
                        title={t('accountOwner.withdrawRequest')}>
                        {t('accountOwner.withdrawRequest')}
                    </button>
                </div>
            </div>
            {requestTabEvent && (
                <div className={styles["event-card"]}>
                    <div className={styles["event-header"]}>
                        <h4 className={styles.heading}>
                            Check ICU Ward
                 </h4>
                        <div className={styles["status-tag"]}>
                            {t("contracts.pending")}
                        </div>
                    </div>
                    <Row>
                        <Col sm="5">
                            <div className={styles["c-field"]}>
                                <Text
                                    size='12px'
                                    marginBottom="5px"
                                    weight='400'
                                    color='#6f7788' >
                                    {t("accountOwner.eventCreatedBy")}
                                </Text>
                                <Text
                                    size='14px'
                                    marginBottom="0"
                                    weight='600'
                                    color='#102c42' >
                                    Sarah Waters
                         </Text>
                            </div>
                        </Col>
                       
                        <Col sm="7">
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
                                    Mar 4, 2022 - 10:30 AM - 11:00 AM (PST)
                         </Text>
                            </div>
                        </Col>
                        <Col sm="5">
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
                                    Urban Dental
</Text>
                            </div>
                        </Col>
                    </Row>
                    <div className="d-flex">
                        <button className="button button-round button-border button-dark  mr-4"
                            onClick={() => { setIsRejectionModalOpen(true) }}
                            title={t("decline")}>
                            {t("decline")}
                        </button>
                        <button className="button button-round  button-shadow"

                            onClick={() => { setIsConfirmAcceptModalOpen(true) }}
                            title={t('accept')}>
                            {t('accept')}
                        </button>
                    </div>
                </div>

            )}
            {setExpiredTimePeriod && (
                <div className={styles["event-card"] + " " + styles["exipred-time-card"]}>
                    <div className={styles["event-header"]}>
                        <h4 className={styles.heading}>
                            Give injections to patient
</h4>
                        <div className={styles["status-tag"]}>
                            {t("contracts.pending")}
                        </div>
                    </div>
                    <Row>
                        <Col sm="5">
                            <div className={styles["c-field"]}>
                                <Text
                                    size='12px'
                                    marginBottom="5px"
                                    weight='400'
                                    color='#6f7788' >
                                    {t("accountOwner.eventCreatedBy")}
                                </Text>
                                <Text
                                    size='14px'
                                    marginBottom="0"
                                    weight='600'
                                    color='#102c42' >
                                    Sarah Waters
</Text>
                            </div>
                        </Col>
                        <Col sm="7">
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
                                    Mar 4, 2022 - 10:30 AM - 11:00 AM (PST)
                        </Text>
                            </div>
                        </Col>
                        <Col sm="5">
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
                                    Urban Dental
</Text>
                            </div>
                        </Col>
                      
                        <Col sm="7">
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
                                    Repeats Every Wednesday
</Text>
                            </div>
                        </Col>
                    </Row>
                    <div className={styles["expire-status-box"]}>
                        Time period for accepting or rejecting this request has been expired.
                    </div>
                </div>
            )}

            {isRejectionModalOpen && <RejectionModal isRejectionModalOpen={isRejectionModalOpen}
                setIsRejectionModalOpen={setIsRejectionModalOpen}
            />}
            {isRepeatEventModalOpen && <RepeatEventModal isRepeatEventModalOpen={isRepeatEventModalOpen}
                setIsRepeatEventModalOpen={setIsRepeatEventModalOpen}
            />}
            {isConfirmAcceptModalOpen && <ConfirmAcceptModal isConfirmAcceptModalOpen={isConfirmAcceptModalOpen}
                setIsConfirmAcceptModalOpen={setIsConfirmAcceptModalOpen}
            />}
        </>
    );
}

export default withTranslation()(PendingEvents);