import Card from 'components/Card';
import Page from 'components/Page';
import React from 'react';
import styles from "./Notification.module.scss";
import { withTranslation } from 'react-i18next';

function Notification({ t }) {
    return (
        <Page onBack={() => { }}
            title={t("accountOwner.notification")}>
            <Card className={styles["notification-card"]}
                radius='10px'
                marginBottom='18px'
                shadow='0 0 15px 0 rgba(0, 0, 0, 0.08)'>
                <ul className={styles["notification-list"]}>
                    <li>
                        <div className={styles["notify-icon"]} >
                            <img src={require('assets/images/Notification-icon.svg').default} alt="icon" />
                        </div>
                        <div className={styles["content-box"]}>
                            <div className={styles["notify-text"]}>
                                <strong>Sarah Water </strong> wants to join the event  <strong>‘Vaccination Drive’ </strong>
                            </div>
                            <div className={styles["notify-date"]}>Feb 21, 2022</div>
                            <span className="link-btn">{t("superAdmin.viewDetails")}</span>
                        </div>
                    </li>
                    <li>
                        <div className={styles["notify-icon"]} >
                            <img src={require('assets/images/Notification-icon.svg').default} alt="icon" />
                        </div>
                        <div className={styles["content-box"]}>
                            <div className={styles["notify-text"]}> <strong>Sarah Water </strong> wants to join the event  <strong>‘Vaccination Drive’ </strong></div>
                            <div className={styles["notify-date"]}>Feb 21, 2022</div>
                            <span className="link-btn">{t("superAdmin.viewDetails")}</span>
                        </div>
                    </li>
                    <li>
                        <div className={styles["notify-icon"]} >
                            <img src={require('assets/images/Notification-icon.svg').default} alt="icon" />
                        </div>
                        <div className={styles["content-box"]}>
                            <div className={styles["notify-text"]}> <strong>Sarah Water </strong> wants to join the event  <strong>‘Vaccination Drive’ </strong></div>
                            <div className={styles["notify-date"]}>Feb 21, 2022</div>
                            <span className="link-btn">{t("superAdmin.viewDetails")}</span>
                        </div>
                    </li>
                    <li>
                        <div className={styles["notify-icon"]} >
                            <img src={require('assets/images/Notification-icon.svg').default} alt="icon" />
                        </div>
                        <div className={styles["content-box"]}>
                            <div className={styles["notify-text"]}> <strong>Sarah Water </strong> wants to join the event  <strong>‘Vaccination Drive’ </strong></div>
                            <div className={styles["notify-date"]}>Feb 21, 2022</div>
                            <span className="link-btn">{t("superAdmin.viewDetails")}</span>
                        </div>
                    </li>
                </ul>



            </Card>
            <div className="text-center mb-5">
                <button className="button button-round button-dark button-border"
                    title={t('loadMore')} >
                    {t('loadMore')}
                </button>
            </div>
        </Page>
    );
}

export default withTranslation()(Notification);