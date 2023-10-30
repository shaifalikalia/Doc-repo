import React from 'react';
import "./SchedulerFilters.scss";
import { withTranslation } from 'react-i18next';

function EmployeesFilter({ employeeList, selectedEmpFilter, setEmpFilter }) {

    const handleChange = (e, id) => {
        const checked = e.target.checked;
        if(checked){
            setEmpFilter(state => [...state, id])
        } else {
            setEmpFilter(state => state.filter(thisId => thisId !== id))
        }
    }
    return (
        <ul className="filter-list employees-list">
            {employeeList.map((emp) => {
                const { id, firstName, lastName } = emp;
                return (
                    <li key={id}>
                        <div className="ch-checkbox">
                            <label> 
                                <input type="checkbox" checked={selectedEmpFilter.includes(id)} onChange={(e) => handleChange(e, id)}/>
                                <span>{`${firstName} ${lastName}`}</span>
                            </label>
                        </div>
                    </li>
                )
            })}
        </ul>
    );
}

export default withTranslation()(EmployeesFilter);