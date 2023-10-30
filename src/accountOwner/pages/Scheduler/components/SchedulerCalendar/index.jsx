import React from 'react'
import { withTranslation } from 'react-i18next'
import "./scheduler-calendar.scss";
import Calendar from 'react-calendar';
import moment from 'moment';


function SchedulerCalendar({ t ,value, onChange , onActiveStartDateChange }) {

     return (
        <>
             <Calendar 
               onChange={onChange} 
               value={value} 
               className="scheduler-calendar"
               formatMonth={(locale, date) => moment(date).format('MMM')} 
               formatMonthYear={(locale, date) => moment(date).format('MMM YYYY')}
               onActiveStartDateChange={onActiveStartDateChange }
           
          />
        </>
    )
}

export default withTranslation()(SchedulerCalendar)