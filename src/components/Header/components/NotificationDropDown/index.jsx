import React from 'react';
import { useHistory } from 'react-router-dom';
import constants from '../../../../constants.js';
import { withTranslation } from "react-i18next";


function NotificationDropDown({toggleNotificafation , t}) {
  
  const history = useHistory();
  const handleSeeAll = () => {
    history.push(constants.routes.notification.notificationDetail);
    toggleNotificafation();
  };
  return (
    <div className='header-notification'>
      {/* <ul>
               <li>
                   <img src={require('assets/images/Notification-icon.svg').default} alt="icon" />
                   <div className="content-box">
                       <div className="notify-text"> <strong>Sarah Water </strong> wants to join the event  <strong>‘Vaccination Drive’ </strong></div>
                       <div className="notify-date">Feb 21, 2022</div>
                   </div>
                </li>
                <li>
                   <img src={require('assets/images/Notification-icon.svg').default} alt="icon" />
                   <div className="content-box">
                       <div className="notify-text"> <strong>Sarah Water </strong> wants to join the event  <strong>‘Vaccination Drive’ </strong></div>
                       <div className="notify-date">Feb 21, 2022</div>
                   </div>
                </li>
                <li>
                   <img src={require('assets/images/Notification-icon.svg').default} alt="icon" />
                   <div className="content-box">
                       <div className="notify-text"> <strong>Sarah Water </strong> wants to join the event  <strong>‘Vaccination Drive’ </strong></div>
                       <div className="notify-date">Feb 21, 2022</div>
                   </div>
                </li>
                <li>
                   <img src={require('assets/images/Notification-icon.svg').default} alt="icon" />
                   <div className="content-box">
                       <div className="notify-text"> <strong>Sarah Water </strong> wants to join the event  <strong>‘Vaccination Drive’ </strong></div>
                       <div className="notify-date">Feb 21, 2022</div>
                   </div>
                </li>
            </ul> */}
      <div className='see-notification text-center' onClick={handleSeeAll}>
        <span className='link-btn'>{t('notificationsPage.allNotification')} </span>
      </div>
    </div>
  );
}


export default withTranslation()(NotificationDropDown);
