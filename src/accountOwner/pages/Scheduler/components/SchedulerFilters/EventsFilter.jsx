import React, { useState } from 'react';
import "./SchedulerFilters.scss";
import { withTranslation } from 'react-i18next';
import constants from '../../../../../constants';

function EventsFilter({ t, setStatusFilter, selectedStatus }) {

    const [, setSelectAll] = useState(false);
    const checkAllSelected = () => selectedStatus?.length === constants.SchedulerStatuseWorkingEvents.length ? true : false

    const handleChange = (e, item) => {
        const offices = [...selectedStatus];
        const oIndex = offices.findIndex(v => +item.id === +v);
        if (e.target.checked) {
            offices.push(item.id);
        } else {
            if (oIndex > -1) offices.splice(oIndex, 1);
        }
        setStatusFilter(offices);
        setSelectAll(offices.length === constants.SchedulerStatuseWorkingEvents.length);
    }
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const _selectedStatus = constants.SchedulerStatuseWorkingEvents.map(v => v.id);
            setStatusFilter(_selectedStatus);
        } else {
            setStatusFilter([]);
        }
        setSelectAll(e.target.checked);
    }
    return (
        <ul className={["filter-list"]}>
            <li>
                <div className="ch-checkbox">
                    <label>
                        <input
                            type='checkbox'
                            name='eventfilter'
                            onChange={(e) => handleSelectAll(e)} checked={checkAllSelected()}
                        />

                        <span> {t('allEvents')} </span>
                    </label>
                </div>
            </li>
            {constants.SchedulerStatuseWorkingEvents.map((v, key) => (
                <li key={key}>
                    <div className="ch-checkbox">
                        <label>
                            <input
                                type='checkbox'
                                name='eventfilter'
                                onChange={(e) => handleChange(e, v)} checked={selectedStatus && selectedStatus.length && selectedStatus.includes(v.id)}
                            />
                            <span> {t(v.title)} </span>
                        </label>
                    </div>
                </li>
            ))}
        </ul>
    );
}
export default withTranslation()(EventsFilter);