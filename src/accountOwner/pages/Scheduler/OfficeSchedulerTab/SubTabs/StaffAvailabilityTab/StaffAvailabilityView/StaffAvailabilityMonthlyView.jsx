import React from 'react';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import styles from "./../../../../Scheduler.module.scss";
import Text from 'components/Text';
import { withTranslation } from 'react-i18next';
import { useState } from 'react';

function StaffAvailabilityMonthlyView({ t }) {
    const [isEventPopActive1, setEventPopupActive1] = useState(false);
    const [isEventPopActive2, setEventPopupActive2] = useState(false);
    const [isEventPopActive3, setEventPopupActive3] = useState(false);
    const [isEventPopActive4, setEventPopupActive4] = useState(false);
    const [isEventPopActive5, setEventPopupActive5] = useState(false);
    const [isEventPopActive6, setEventPopupActive6] = useState(false);
    const togglePopClass1 = () => {
        setEventPopupActive1(!isEventPopActive1);
    };
    const togglePopClass2 = () => {
        setEventPopupActive2(!isEventPopActive2);
    }; const togglePopClass3 = () => {
        setEventPopupActive3(!isEventPopActive3);
    }; const togglePopClass4 = () => {
        setEventPopupActive4(!isEventPopActive4);
    }; const togglePopClass5 = () => {
        setEventPopupActive5(!isEventPopActive5);
    }; const togglePopClass6 = () => {
        setEventPopupActive6(!isEventPopActive6);
    };
   
    return (
        <div className={"table-card-border "}>
            <div className={styles["scheduler-table-wrapper"]}>
                <div className={styles["arrow-btn"] + " " + styles["prev-btn"]}>
                <img src={require('assets/images/scheduler-table-arrow-left.svg').default} alt="icon" />
                   
                </div>
                <div className={styles["arrow-btn"] + " " + styles["next-btn"]}>
                <img src={require('assets/images/scheduler-table-arrow-right.svg').default} alt="icon" />
                   
                </div>
                <div className={styles["scheduler-fixed-table"]}>
                    <table className={"table table-bordered " + styles["schedular-table"]}>
                        <thead>
                            <tr>
                                <th></th>
                                <th>Mar 3, Mon</th>
                                <th>Mar 4, Mon</th>
                                <th>Mar 5, Mon</th>
                                <th>Mar 6, Mon</th>
                                <th>Mar 7, Mon</th>
                                <th>Mar 8, Mon</th>
                                <th>Mar 8, Mon</th>
                            </tr>
                        </thead>
                        <tbody>
                        <tr>
                                <th>
                                    <div className={styles["scheduler-client-box"]}>
                                        <div className={styles["client-img"]}> <img src={require('assets/images/dummy.jpg').default} alt="icon" /> </div>
                                        <div className={styles["client-name"]}>Mariano Rasgado</div>
                                        <div className={styles["see-btn"]}><span>See More</span>
                                            <img src={require('assets/images/caret-587E85.svg').default} alt="caret" />
                                        </div>
                                    </div>
                                    
                                </th>
                                <td>
                                    <div className={styles["scheduler-event-box"] + " " + styles['light-red-bg']}>
                                        <div className={styles["event-tag"] + " " + styles['dark-red-bg']}>Leave </div>
                                        <div className={styles["event-date"]}>All Day  (PST)</div>
                                        <div className={styles["event-office"]}>Lifeline Hospital </div>
                                        <div className={styles["event-type"]}>On Leave  </div>
                                    </div>
                                    <div className={styles["scheduler-event-box"]}>
                                        <div className={styles["event-tag"] + " " + styles['dark-grey-bg']}>Appointment </div>
                                        <div className={styles["event-date"]}>10:00 AM - 11:00 AM (PST) </div>
                                        <div className={styles["event-office"]}>Lifeline Hospital </div>
                                        <div className={styles["event-type"]}>Patient Appointment </div>
                                    </div>
                                    <div className={styles["more-event-box"]}>
                                        <span className={styles["more-event-btn"]} onClick={togglePopClass6}> +3 more</span>
                                        {isEventPopActive6 && (
                                            <div className={styles["scheduler-popup-box"]}>
                                                <span className={styles["close-icon"]} onClick={togglePopClass6}>&times;</span>
                                                <div className={styles["scheduler-event-box"] + " " + styles['light-red-bg']}>
                                                    <div className={styles["event-tag"] + " " + styles['dark-red-bg']}>Leave </div>
                                                    <div className={styles["event-type"]}>On Leave  </div>
                                                    <Row className={styles.row} >
                                                        <Col sm="6">
                                                            <Text size='10px' marginBottom="0px" weight='400' color='#87928D' >
                                                                {t("accountOwner.officeName")}
                                                            </Text>
                                                            <Text size='12px' marginBottom="10px" weight='500' color='#2F3245' >
                                                                Urban Dental
                                                    </Text>
                                                        </Col>
                                                        <Col sm="6">
                                                            <Text size='10px' marginBottom="0px" weight='400' color='#87928D' >
                                                                {t("accountOwner.officeName")}
                                                            </Text>
                                                            <Text size='12px' marginBottom="10px" weight='500' color='#2F3245' >
                                                                Urban Dental
                                                    </Text>
                                                        </Col>
                                                        <Col sm="6">
                                                            <Text size='10px' marginBottom="0px" weight='400' color='#87928D' >
                                                                {t("accountOwner.officeName")}
                                                            </Text>
                                                            <Text size='12px' marginBottom="12px" weight='500' color='#2F3245' >
                                                                Urban Dental
                                                    </Text>
                                                        </Col>
                                                        <Col sm="6">
                                                            <Text size='10px' marginBottom="0px" weight='400' color='#87928D' >
                                                                {t("accountOwner.officeName")}
                                                            </Text>
                                                            <Text size='12px' marginBottom="12px" weight='500' color='#2F3245' >
                                                                Urban Dental
                                                    </Text>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                              
                                </td>
                                <td>
                                    <div className={styles["scheduler-event-box"] + " " + styles['light-grey-bg']}>
                                        <div className={styles["event-tag"] + " " + styles['theme-green-bg']}>Event </div>
                                        <div className={styles["event-date"]}>All Day  (PST)</div>
                                        <div className={styles["event-office"]}>Lifeline Hospital </div>
                                        <div className={styles["event-type"]}>Vaccination Event  </div>

                                    </div>
                                 
                                </td>
                                <td>
                                    <div className={styles["scheduler-event-box"] + " " + styles['light-red-bg']}>
                                        <div className={styles["event-tag"] + " " + styles['dark-red-bg']}>Leave </div>
                                        <div className={styles["event-date"]}>All Day  (PST)</div>
                                        <div className={styles["event-office"]}>Lifeline Hospital </div>
                                        <div className={styles["event-type"]}>On Leave  </div>
                                    </div>
                                    <div className={styles["scheduler-event-box"]}>
                                        <div className={styles["event-tag"] + " " + styles['dark-grey-bg']}>Appointment </div>
                                        <div className={styles["event-date"]}>10:00 AM - 11:00 AM (PST) </div>
                                        <div className={styles["event-office"]}>Lifeline Hospital </div>
                                        <div className={styles["event-type"]}>Patient Appointment </div>
                                    </div>

                                </td>
                                <td>

                                    <div className={styles["scheduler-event-box"] + " " + styles['light-orange-bg']}>
                                        <div className={styles["event-tag"] + " " + styles['dark-orange-bg']}>Busy </div>
                                        <div className={styles["event-date"]}>10:00 AM - 11:00 AM (PST) </div>
                                        <div className={styles["event-office"]}>Lifeline Hospital </div>
                                        <div className={styles["event-type"]}>Patient Appointment </div>
                                    </div>
                                    <div className={styles["scheduler-event-box"]}>
                                        <div className={styles["event-tag"] + " " + styles['dark-grey-bg']}>Appointment </div>
                                        <div className={styles["event-date"]}>10:00 AM - 11:00 AM (PST) </div>
                                        <div className={styles["event-office"]}>Lifeline Hospital </div>
                                        <div className={styles["event-type"]}>Patient Appointment </div>
                                    </div>
                                </td>

                                <td>

                                    <div className={styles["scheduler-event-box"]}>
                                        <div className={styles["event-tag"] + " " + styles['dark-grey-bg']}>Appointment </div>
                                        <div className={styles["event-date"]}>10:00 AM - 11:00 AM (PST) </div>
                                        <div className={styles["event-office"]}>Lifeline Hospital </div>
                                        <div className={styles["event-type"]}>Patient Appointment </div>
                                    </div>
                                    <div className={styles["more-event-box"]}>
                                        <span className={styles["more-event-btn"]} onClick={togglePopClass2}> +3 more</span>
                                        {isEventPopActive2 && (
                                            <div className={styles["scheduler-popup-box"]}>
                                                <span className={styles["close-icon"]} onClick={togglePopClass2}>&times;</span>
                                                <div className={styles["scheduler-event-box"] + " " + styles['light-red-bg']}>
                                                    <div className={styles["event-tag"] + " " + styles['dark-red-bg']}>Leave </div>
                                                    <div className={styles["event-type"]}>On Leave  </div>
                                                     <Row className={styles.row} >
                                                        <Col sm="6">
                                                            <Text size='10px' marginBottom="0px" weight='400' color='#87928D' >
                                                                {t("accountOwner.officeName")}
                                                            </Text>
                                                            <Text size='12px' marginBottom="10px" weight='500' color='#2F3245' >
                                                                Urban Dental
                                                    </Text>
                                                        </Col>
                                                        <Col sm="6">
                                                            <Text size='10px' marginBottom="0px" weight='400' color='#87928D' >
                                                                {t("accountOwner.officeName")}
                                                            </Text>
                                                            <Text size='12px' marginBottom="10px" weight='500' color='#2F3245' >
                                                                Urban Dental
                                                    </Text>
                                                        </Col>
                                                        <Col sm="6">
                                                            <Text size='10px' marginBottom="0px" weight='400' color='#87928D' >
                                                                {t("accountOwner.officeName")}
                                                            </Text>
                                                            <Text size='12px' marginBottom="12px" weight='500' color='#2F3245' >
                                                                Urban Dental
                                                    </Text>
                                                        </Col>
                                                        <Col sm="6">
                                                            <Text size='10px' marginBottom="0px" weight='400' color='#87928D' >
                                                                {t("accountOwner.officeName")}
                                                            </Text>
                                                            <Text size='12px' marginBottom="12px" weight='500' color='#2F3245' >
                                                                Urban Dental
                                                    </Text>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                              
                                </td>
                                <td>
                                    <div className={styles["scheduler-event-box"] + " " + styles['light-grey-bg'] + " " + styles['event-height-full']}>
                                        <div className={styles["event-tag"] + " " + styles['theme-green-bg']}>Event </div>
                                        <div className={styles["event-date"]}>All Day  (PST)</div>
                                        <div className={styles["event-office"]}>Lifeline Hospital </div>
                                        <div className={styles["event-type"]}>Vaccination Event  </div>
                                    </div>
                                </td>
                                <td>
                                    <div className={styles["scheduler-event-box"] + " " + styles['light-red-bg']}>
                                        <div className={styles["event-tag"] + " " + styles['dark-red-bg']}>Leave </div>
                                        <div className={styles["event-date"]}>All Day  (PST)</div>
                                        <div className={styles["event-office"]}>Lifeline Hospital </div>
                                        <div className={styles["event-type"]}>On Leave  </div>
                                    </div>
                                    <div className={styles["scheduler-event-box"]}>
                                        <div className={styles["event-tag"] + " " + styles['dark-grey-bg']}>Appointment </div>
                                        <div className={styles["event-date"]}>10:00 AM - 11:00 AM (PST) </div>
                                        <div className={styles["event-office"]}>Lifeline Hospital </div>
                                        <div className={styles["event-type"]}>Patient Appointment </div>
                                    </div>
                                    <div className={styles["more-event-box"]}>
                                        <span className={styles["more-event-btn"]} onClick={togglePopClass3}> +3 more</span>
                                        {isEventPopActive3 && (
                                            <div className={styles["scheduler-popup-box"]}>
                                                <span className={styles["close-icon"]} onClick={togglePopClass3}>&times;</span>
                                                <div className={styles["scheduler-event-box"] + " " + styles['light-red-bg']}>
                                                    <div className={styles["event-tag"] + " " + styles['dark-red-bg']}>Leave </div>
                                                    <div className={styles["event-type"]}>On Leave  </div>
                                                     <Row className={styles.row} >
                                                        <Col sm="6">
                                                            <Text size='10px' marginBottom="0px" weight='400' color='#87928D' >
                                                                {t("accountOwner.officeName")}
                                                            </Text>
                                                            <Text size='12px' marginBottom="10px" weight='500' color='#2F3245' >
                                                                Urban Dental
                                                    </Text>
                                                        </Col>
                                                        <Col sm="6">
                                                            <Text size='10px' marginBottom="0px" weight='400' color='#87928D' >
                                                                {t("accountOwner.officeName")}
                                                            </Text>
                                                            <Text size='12px' marginBottom="10px" weight='500' color='#2F3245' >
                                                                Urban Dental
                                                    </Text>
                                                        </Col>
                                                        <Col sm="6">
                                                            <Text size='10px' marginBottom="0px" weight='400' color='#87928D' >
                                                                {t("accountOwner.officeName")}
                                                            </Text>
                                                            <Text size='12px' marginBottom="12px" weight='500' color='#2F3245' >
                                                                Urban Dental
                                                    </Text>
                                                        </Col>
                                                        <Col sm="6">
                                                            <Text size='10px' marginBottom="0px" weight='400' color='#87928D' >
                                                                {t("accountOwner.officeName")}
                                                            </Text>
                                                            <Text size='12px' marginBottom="12px" weight='500' color='#2F3245' >
                                                                Urban Dental
                                                    </Text>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                              
                                </td>
                            </tr>
                          
                            <tr>
                                <th>
                                    <div className={styles["scheduler-client-box"]}>
                                        <div className={styles["client-img"]}> <img src={require('assets/images/dummy.jpg').default} alt="icon" /> </div>
                                        <div className={styles["client-name"]}>Mariano Rasgado</div>
                                        <div className={styles["see-btn"]}><span>See More</span>
                                            <img src={require('assets/images/caret-587E85.svg').default} alt="caret" />
                                        </div>
                                    </div>
                                </th>
                                <td>
                                    <div className={styles["scheduler-event-box"] + " " + styles['light-red-bg']}>
                                        <div className={styles["event-tag"] + " " + styles['dark-red-bg']}>Leave </div>
                                        <div className={styles["event-date"]}>All Day  (PST)</div>
                                        <div className={styles["event-office"]}>Lifeline Hospital </div>
                                        <div className={styles["event-type"]}>On Leave  </div>
                                    </div>
                                    <div className={styles["scheduler-event-box"]}>
                                        <div className={styles["event-tag"] + " " + styles['dark-grey-bg']}>Appointment </div>
                                        <div className={styles["event-date"]}>10:00 AM - 11:00 AM (PST) </div>
                                        <div className={styles["event-office"]}>Lifeline Hospital </div>
                                        <div className={styles["event-type"]}>Patient Appointment </div>
                                    </div>
                                    
                                </td>
                                <td>
                                    <div className={styles["scheduler-event-box"] + " " + styles['light-grey-bg']}>
                                        <div className={styles["event-tag"] + " " + styles['theme-green-bg']}>Event </div>
                                        <div className={styles["event-date"]}>All Day  (PST)</div>
                                        <div className={styles["event-office"]}>Lifeline Hospital </div>
                                        <div className={styles["event-type"]}>Vaccination Event  </div>

                                    </div>
                                    <div className={styles["more-event-box"]}>
                                        <span className={styles["more-event-btn"]} onClick={togglePopClass1}> +3 more</span>
                                        {isEventPopActive1 && (
                                            <div className={styles["scheduler-popup-box"]}>
                                                <span className={styles["close-icon"]} onClick={togglePopClass1}>&times;</span>
                                                <div className={styles["scheduler-event-box"] + " " + styles['light-red-bg']}>
                                                    <div className={styles["event-tag"] + " " + styles['dark-red-bg']}>Leave </div>
                                                    <div className={styles["event-type"]}>On Leave  </div>
                                                     <Row className={styles.row} >
                                                        <Col sm="6">
                                                            <Text size='10px' marginBottom="0px" weight='400' color='#87928D' >
                                                                {t("accountOwner.officeName")}
                                                            </Text>
                                                            <Text size='12px' marginBottom="10px" weight='500' color='#2F3245' >
                                                                Urban Dental
                                                    </Text>
                                                        </Col>
                                                        <Col sm="6">
                                                            <Text size='10px' marginBottom="0px" weight='400' color='#87928D' >
                                                                {t("accountOwner.officeName")}
                                                            </Text>
                                                            <Text size='12px' marginBottom="10px" weight='500' color='#2F3245' >
                                                                Urban Dental
                                                    </Text>
                                                        </Col>
                                                        <Col sm="6">
                                                            <Text size='10px' marginBottom="0px" weight='400' color='#87928D' >
                                                                {t("accountOwner.officeName")}
                                                            </Text>
                                                            <Text size='12px' marginBottom="12px" weight='500' color='#2F3245' >
                                                                Urban Dental
                                                    </Text>
                                                        </Col>
                                                        <Col sm="6">
                                                            <Text size='10px' marginBottom="0px" weight='400' color='#87928D' >
                                                                {t("accountOwner.officeName")}
                                                            </Text>
                                                            <Text size='12px' marginBottom="12px" weight='500' color='#2F3245' >
                                                                Urban Dental
                                                    </Text>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                              
                                </td>
                                <td>
                                    <div className={styles["scheduler-event-box"] + " " + styles['light-red-bg']}>
                                        <div className={styles["event-tag"] + " " + styles['dark-red-bg']}>Leave </div>
                                        <div className={styles["event-date"]}>All Day  (PST)</div>
                                        <div className={styles["event-office"]}>Lifeline Hospital </div>
                                        <div className={styles["event-type"]}>On Leave  </div>
                                    </div>
                                    <div className={styles["scheduler-event-box"]}>
                                        <div className={styles["event-tag"] + " " + styles['dark-grey-bg']}>Appointment </div>
                                        <div className={styles["event-date"]}>10:00 AM - 11:00 AM (PST) </div>
                                        <div className={styles["event-office"]}>Lifeline Hospital </div>
                                        <div className={styles["event-type"]}>Patient Appointment </div>
                                    </div>

                                </td>
                                <td>

                                    <div className={styles["scheduler-event-box"] + " " + styles['light-orange-bg']}>
                                        <div className={styles["event-tag"] + " " + styles['dark-orange-bg']}>Busy </div>
                                        <div className={styles["event-date"]}>10:00 AM - 11:00 AM (PST) </div>
                                        <div className={styles["event-office"]}>Lifeline Hospital </div>
                                        <div className={styles["event-type"]}>Patient Appointment </div>
                                    </div>
                                    <div className={styles["scheduler-event-box"]}>
                                        <div className={styles["event-tag"] + " " + styles['dark-grey-bg']}>Appointment </div>
                                        <div className={styles["event-date"]}>10:00 AM - 11:00 AM (PST) </div>
                                        <div className={styles["event-office"]}>Lifeline Hospital </div>
                                        <div className={styles["event-type"]}>Patient Appointment </div>
                                    </div>
                                </td>

                                <td>

                                    <div className={styles["scheduler-event-box"]}>
                                        <div className={styles["event-tag"] + " " + styles['dark-grey-bg']}>Appointment </div>
                                        <div className={styles["event-date"]}>10:00 AM - 11:00 AM (PST) </div>
                                        <div className={styles["event-office"]}>Lifeline Hospital </div>
                                        <div className={styles["event-type"]}>Patient Appointment </div>
                                    </div>
                                    <div className={styles["more-event-box"]}>
                                        <span className={styles["more-event-btn"]} onClick={togglePopClass2}> +3 more</span>
                                        {isEventPopActive2 && (
                                            <div className={styles["scheduler-popup-box"]}>
                                                <span className={styles["close-icon"]} onClick={togglePopClass2}>&times;</span>
                                                <div className={styles["scheduler-event-box"] + " " + styles['light-red-bg']}>
                                                    <div className={styles["event-tag"] + " " + styles['dark-red-bg']}>Leave </div>
                                                    <div className={styles["event-type"]}>On Leave  </div>
                                                     <Row className={styles.row} >
                                                        <Col sm="6">
                                                            <Text size='10px' marginBottom="0px" weight='400' color='#87928D' >
                                                                {t("accountOwner.officeName")}
                                                            </Text>
                                                            <Text size='12px' marginBottom="10px" weight='500' color='#2F3245' >
                                                                Urban Dental
                                                    </Text>
                                                        </Col>
                                                        <Col sm="6">
                                                            <Text size='10px' marginBottom="0px" weight='400' color='#87928D' >
                                                                {t("accountOwner.officeName")}
                                                            </Text>
                                                            <Text size='12px' marginBottom="10px" weight='500' color='#2F3245' >
                                                                Urban Dental
                                                    </Text>
                                                        </Col>
                                                        <Col sm="6">
                                                            <Text size='10px' marginBottom="0px" weight='400' color='#87928D' >
                                                                {t("accountOwner.officeName")}
                                                            </Text>
                                                            <Text size='12px' marginBottom="12px" weight='500' color='#2F3245' >
                                                                Urban Dental
                                                    </Text>
                                                        </Col>
                                                        <Col sm="6">
                                                            <Text size='10px' marginBottom="0px" weight='400' color='#87928D' >
                                                                {t("accountOwner.officeName")}
                                                            </Text>
                                                            <Text size='12px' marginBottom="12px" weight='500' color='#2F3245' >
                                                                Urban Dental
                                                    </Text>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                              
                                </td>
                                <td>
                                    <div className={styles["scheduler-event-box"] + " " + styles['light-grey-bg'] + " " + styles['event-height-full']}>
                                        <div className={styles["event-tag"] + " " + styles['theme-green-bg']}>Event </div>
                                        <div className={styles["event-date"]}>All Day  (PST)</div>
                                        <div className={styles["event-office"]}>Lifeline Hospital </div>
                                        <div className={styles["event-type"]}>Vaccination Event  </div>
                                    </div>
                                </td>
                                <td>
                                    <div className={styles["scheduler-event-box"] + " " + styles['light-red-bg']}>
                                        <div className={styles["event-tag"] + " " + styles['dark-red-bg']}>Leave </div>
                                        <div className={styles["event-date"]}>All Day  (PST)</div>
                                        <div className={styles["event-office"]}>Lifeline Hospital </div>
                                        <div className={styles["event-type"]}>On Leave  </div>
                                    </div>
                                    <div className={styles["scheduler-event-box"]}>
                                        <div className={styles["event-tag"] + " " + styles['dark-grey-bg']}>Appointment </div>
                                        <div className={styles["event-date"]}>10:00 AM - 11:00 AM (PST) </div>
                                        <div className={styles["event-office"]}>Lifeline Hospital </div>
                                        <div className={styles["event-type"]}>Patient Appointment </div>
                                    </div>
                                    <div className={styles["more-event-box"]}>
                                        <span className={styles["more-event-btn"]} onClick={togglePopClass3}> +3 more</span>
                                        {isEventPopActive3 && (
                                            <div className={styles["scheduler-popup-box"]}>
                                                <span className={styles["close-icon"]} onClick={togglePopClass3}>&times;</span>
                                                <div className={styles["scheduler-event-box"] + " " + styles['light-red-bg']}>
                                                    <div className={styles["event-tag"] + " " + styles['dark-red-bg']}>Leave </div>
                                                    <div className={styles["event-type"]}>On Leave  </div>
                                                     <Row className={styles.row} >
                                                        <Col sm="6">
                                                            <Text size='10px' marginBottom="0px" weight='400' color='#87928D' >
                                                                {t("accountOwner.officeName")}
                                                            </Text>
                                                            <Text size='12px' marginBottom="10px" weight='500' color='#2F3245' >
                                                                Urban Dental
                                                    </Text>
                                                        </Col>
                                                        <Col sm="6">
                                                            <Text size='10px' marginBottom="0px" weight='400' color='#87928D' >
                                                                {t("accountOwner.officeName")}
                                                            </Text>
                                                            <Text size='12px' marginBottom="10px" weight='500' color='#2F3245' >
                                                                Urban Dental
                                                    </Text>
                                                        </Col>
                                                        <Col sm="6">
                                                            <Text size='10px' marginBottom="0px" weight='400' color='#87928D' >
                                                                {t("accountOwner.officeName")}
                                                            </Text>
                                                            <Text size='12px' marginBottom="12px" weight='500' color='#2F3245' >
                                                                Urban Dental
                                                    </Text>
                                                        </Col>
                                                        <Col sm="6">
                                                            <Text size='10px' marginBottom="0px" weight='400' color='#87928D' >
                                                                {t("accountOwner.officeName")}
                                                            </Text>
                                                            <Text size='12px' marginBottom="12px" weight='500' color='#2F3245' >
                                                                Urban Dental
                                                    </Text>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                              
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    <div className={styles["scheduler-client-box"]}>
                                        <div className={styles["client-img"]}> <img src={require('assets/images/dummy.jpg').default} alt="icon" /> </div>
                                        <div className={styles["client-name"]}>Mariano Rasgado</div>
                                        <div className={styles["see-btn"]}><span>See More</span>
                                            <img src={require('assets/images/caret-587E85.svg').default} alt="caret" />
                                        </div>

                                    </div>
                                </th>
                                <td>
                                    <div className={styles["scheduler-event-box"] + " " + styles['light-red-bg']}>
                                        <div className={styles["event-tag"] + " " + styles['dark-red-bg']}>Leave </div>
                                        <div className={styles["event-date"]}>All Day  (PST)</div>
                                        <div className={styles["event-office"]}>Lifeline Hospital </div>
                                        <div className={styles["event-type"]}>On Leave  </div>
                                    </div>
                                    <div className={styles["scheduler-event-box"]}>
                                        <div className={styles["event-tag"] + " " + styles['dark-grey-bg']}>Appointment </div>
                                        <div className={styles["event-date"]}>10:00 AM - 11:00 AM (PST) </div>
                                        <div className={styles["event-office"]}>Lifeline Hospital </div>
                                        <div className={styles["event-type"]}>Patient Appointment </div>
                                    </div>
                                    <div className={styles["more-event-box"]}>
                                        <span className={styles["more-event-btn"]} onClick={togglePopClass4}> +3 more</span>
                                        {isEventPopActive4 && (
                                            <div className={styles["scheduler-popup-box"]}>
                                                <span className={styles["close-icon"]} onClick={togglePopClass4}>&times;</span>
                                                <div className={styles["scheduler-event-box"] + " " + styles['light-red-bg']}>
                                                    <div className={styles["event-tag"] + " " + styles['dark-red-bg']}>Leave </div>
                                                    <div className={styles["event-type"]}>On Leave  </div>
                                                     <Row className={styles.row} >
                                                        <Col sm="6">
                                                            <Text size='10px' marginBottom="0px" weight='400' color='#87928D' >
                                                                {t("accountOwner.officeName")}
                                                            </Text>
                                                            <Text size='12px' marginBottom="10px" weight='500' color='#2F3245' >
                                                                Urban Dental
                                                    </Text>
                                                        </Col>
                                                        <Col sm="6">
                                                            <Text size='10px' marginBottom="0px" weight='400' color='#87928D' >
                                                                {t("accountOwner.officeName")}
                                                            </Text>
                                                            <Text size='12px' marginBottom="10px" weight='500' color='#2F3245' >
                                                                Urban Dental
                                                    </Text>
                                                        </Col>
                                                        <Col sm="6">
                                                            <Text size='10px' marginBottom="0px" weight='400' color='#87928D' >
                                                                {t("accountOwner.officeName")}
                                                            </Text>
                                                            <Text size='12px' marginBottom="12px" weight='500' color='#2F3245' >
                                                                Urban Dental
                                                    </Text>
                                                        </Col>
                                                        <Col sm="6">
                                                            <Text size='10px' marginBottom="0px" weight='400' color='#87928D' >
                                                                {t("accountOwner.officeName")}
                                                            </Text>
                                                            <Text size='12px' marginBottom="12px" weight='500' color='#2F3245' >
                                                                Urban Dental
                                                    </Text>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td>
                                    <div className={styles["scheduler-event-box"] + " " + styles['light-grey-bg'] + " " + styles['event-height-full']}>
                                        <div className={styles["event-tag"] + " " + styles['theme-green-bg']}>Event </div>
                                        <div className={styles["event-date"]}>All Day  (PST)</div>
                                        <div className={styles["event-office"]}>Lifeline Hospital </div>
                                        <div className={styles["event-type"]}>Vaccination Event  </div>
                                    </div>
                                </td>
                                <td>
                                    <div className={styles["scheduler-event-box"] + " " + styles['light-red-bg']}>
                                        <div className={styles["event-tag"] + " " + styles['dark-red-bg']}>Leave </div>
                                        <div className={styles["event-date"]}>All Day  (PST)</div>
                                        <div className={styles["event-office"]}>Lifeline Hospital </div>
                                        <div className={styles["event-type"]}>On Leave  </div>
                                    </div>
                                    <div className={styles["scheduler-event-box"]}>
                                        <div className={styles["event-tag"] + " " + styles['dark-grey-bg']}>Appointment </div>
                                        <div className={styles["event-date"]}>10:00 AM - 11:00 AM (PST) </div>
                                        <div className={styles["event-office"]}>Lifeline Hospital </div>
                                        <div className={styles["event-type"]}>Patient Appointment </div>
                                    </div>

                                </td>
                                <td>

                                    <div className={styles["scheduler-event-box"] + " " + styles['light-orange-bg']}>
                                        <div className={styles["event-tag"] + " " + styles['dark-orange-bg']}>Busy </div>
                                        <div className={styles["event-date"]}>10:00 AM - 11:00 AM (PST) </div>
                                        <div className={styles["event-office"]}>Lifeline Hospital </div>
                                        <div className={styles["event-type"]}>Patient Appointment </div>
                                    </div>
                                    <div className={styles["scheduler-event-box"]}>
                                        <div className={styles["event-tag"] + " " + styles['dark-grey-bg']}>Appointment </div>
                                        <div className={styles["event-date"]}>10:00 AM - 11:00 AM (PST) </div>
                                        <div className={styles["event-office"]}>Lifeline Hospital </div>
                                        <div className={styles["event-type"]}>Patient Appointment </div>
                                    </div>
                                    <div className={styles["more-event-box"]}>
                                        <span className={styles["more-event-btn"]} onClick={togglePopClass5}> +3 more</span>
                                        {isEventPopActive5 && (
                                            <div className={styles["scheduler-popup-box"]}>
                                                <span className={styles["close-icon"]} onClick={togglePopClass5}>&times;</span>
                                                <div className={styles["scheduler-event-box"] + " " + styles['light-red-bg']}>
                                                    <div className={styles["event-tag"] + " " + styles['dark-red-bg']}>Leave </div>
                                                    <div className={styles["event-type"]}>On Leave  </div>
                                                     <Row className={styles.row} >
                                                        <Col sm="6">
                                                            <Text size='10px' marginBottom="0px" weight='400' color='#87928D' >
                                                                {t("accountOwner.officeName")}
                                                            </Text>
                                                            <Text size='12px' marginBottom="10px" weight='500' color='#2F3245' >
                                                                Urban Dental
                                                    </Text>
                                                        </Col>
                                                        <Col sm="6">
                                                            <Text size='10px' marginBottom="0px" weight='400' color='#87928D' >
                                                                {t("accountOwner.officeName")}
                                                            </Text>
                                                            <Text size='12px' marginBottom="10px" weight='500' color='#2F3245' >
                                                                Urban Dental
                                                    </Text>
                                                        </Col>
                                                        <Col sm="6">
                                                            <Text size='10px' marginBottom="0px" weight='400' color='#87928D' >
                                                                {t("accountOwner.officeName")}
                                                            </Text>
                                                            <Text size='12px' marginBottom="12px" weight='500' color='#2F3245' >
                                                                Urban Dental
                                                    </Text>
                                                        </Col>
                                                        <Col sm="6">
                                                            <Text size='10px' marginBottom="0px" weight='400' color='#87928D' >
                                                                {t("accountOwner.officeName")}
                                                            </Text>
                                                            <Text size='12px' marginBottom="12px" weight='500' color='#2F3245' >
                                                                Urban Dental
                                                    </Text>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                           
                                </td>

                                <td>

                                    <div className={styles["scheduler-event-box"]}>
                                        <div className={styles["event-tag"] + " " + styles['dark-grey-bg']}>Appointment </div>
                                        <div className={styles["event-date"]}>10:00 AM - 11:00 AM (PST) </div>
                                        <div className={styles["event-office"]}>Lifeline Hospital </div>
                                        <div className={styles["event-type"]}>Patient Appointment </div>
                                    </div>
                                </td>
                                <td>
                                    <div className={styles["scheduler-event-box"] + " " + styles['light-grey-bg'] + " " + styles['event-height-full']}>
                                        <div className={styles["event-tag"] + " " + styles['theme-green-bg']}>Event </div>
                                        <div className={styles["event-date"]}>All Day  (PST)</div>
                                        <div className={styles["event-office"]}>Lifeline Hospital </div>
                                        <div className={styles["event-type"]}>Vaccination Event  </div>
                                    </div>
                                </td>
                                <td>
                                    <div className={styles["scheduler-event-box"] + " " + styles['light-red-bg']}>
                                        <div className={styles["event-tag"] + " " + styles['dark-red-bg']}>Leave </div>
                                        <div className={styles["event-date"]}>All Day  (PST)</div>
                                        <div className={styles["event-office"]}>Lifeline Hospital </div>
                                        <div className={styles["event-type"]}>On Leave  </div>
                                    </div>
                                    <div className={styles["scheduler-event-box"]}>
                                        <div className={styles["event-tag"] + " " + styles['dark-grey-bg']}>Appointment </div>
                                        <div className={styles["event-date"]}>10:00 AM - 11:00 AM (PST) </div>
                                        <div className={styles["event-office"]}>Lifeline Hospital </div>
                                        <div className={styles["event-type"]}>Patient Appointment </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default withTranslation()(StaffAvailabilityMonthlyView);