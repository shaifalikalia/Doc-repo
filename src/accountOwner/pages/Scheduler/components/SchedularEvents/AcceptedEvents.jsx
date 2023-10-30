import React from 'react';
import styles from "./SchedularEvents.module.scss";
import { withTranslation } from 'react-i18next';
import {Row, Col} from 'reactstrap';
import Text from 'components/Text';

function AcceptedEvents({t}) {
    return (
        <div className={styles["event-card"] + " " + styles.pb5}>
            <div className={styles["event-header"]}>
                <h4 className={styles.heading}>
                Patient’s Appointment
                </h4>
                <div className={styles["status-tag"]}>
                {t("contracts.accepted")}
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
           
        </div>
    );
}

export default withTranslation() (AcceptedEvents);