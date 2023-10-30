import React from 'react';
import { withTranslation } from 'react-i18next';

function EmptyNotification({t}) {
    return (
        <div className="empty-notify-wrapper">
             <img src={require('assets/images/empty-notification.svg').default} alt="icon" /> 
             <h3 className="notify-heading">{t("navbar.noNotificationsRightNow")}</h3>
             
             <p>{t("navbar.notificationsDesc")}</p>
        </div>
    );
}

export default withTranslation() (EmptyNotification);