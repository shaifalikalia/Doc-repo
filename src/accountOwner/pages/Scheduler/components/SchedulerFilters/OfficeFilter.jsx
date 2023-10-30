import React from 'react';
import "./SchedulerFilters.scss";
import { useAllActiveOffices } from 'repositories/scheduler-repository';

function OfficeFilter({ getEmployeeList, setOfficeFilter, selectedOffice, selectedOwnerId }) {
    
    const { data } = useAllActiveOffices(1, 100, selectedOwnerId)
    const handleChange = (e, item) => {
        const offices = [...selectedOffice];
        
       
        const oIndex = offices.findIndex(v => +item.id === +v);
        if (e.target.checked) {
            offices.push(item.id);
        } else {
            if (oIndex > -1) offices.splice(oIndex, 1);
        }
        setOfficeFilter(offices);

        if (getEmployeeList) {
            getEmployeeList(offices)
        }

    }
    return (
        <ul className={["filter-list"]}>

            {
                data && data.data.map((item, key) =>
                    <li key={key}>
                        <div className="ch-checkbox">
                            <label>
                                <input type="checkbox" onChange={(e) => handleChange(e, item)} checked={selectedOffice.includes(item.id)} /> <span> {item.name}</span>
                            </label>
                        </div>
                    </li>
                )
            }

        </ul>
    );
}

export default OfficeFilter;