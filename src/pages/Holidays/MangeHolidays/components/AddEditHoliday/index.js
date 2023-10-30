import React, { useState, useEffect } from 'react';
import { Modal, ModalBody } from 'reactstrap';
import { Link } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { connect } from "react-redux";
import { addHoliday, updateHoliday } from 'actions/index';
import moment from 'moment';
/*components*/
import Input from 'components/Input';
import { withTranslation } from 'react-i18next';
import { testRegexCheck  } from "utils";


const AddEditHoliday = (props) => {
    const [startDate, setStartDate] = useState(new Date());
    const [ninDataYear] = useState(new Date().getFullYear());
    const [maxDataYear] = useState(new Date().getFullYear() + 1);
    const [errors, setErrors] = useState({});
    const [holidayName, setHolidayName] = useState('');

    const {t} = props;

    useEffect(() => {
        if (props.HolidayDetail) {
            setHolidayName(props.HolidayDetail.title)
            setStartDate(new Date(props.HolidayDetail.date))
        }
        if(props.CalendarDate)
        {
            setStartDate(new Date(props.CalendarDate))
        }

        if (props.currentDate) {
            setStartDate(new Date(props.currentDate))
        }
        
    // eslint-disable-next-line
    }, []);
    const isValid = () => {
        const _errors = {};
        let _isValid = true;
        if (!holidayName) {
            _errors.holidayName = t('form.errors.emptyField', {field: t('form.fields.holidayName')})
            _isValid = false;
        }
        if (!startDate) {
            _errors.startDate = t('form.errors.emptyField', {field: t('form.fields.holidayDate')})
            _isValid = false;
        }
        setErrors(_errors)
        return _isValid;
    }
    const InputChange = (event) => {
        const {
            value,
        } = event.target;
        testRegexCheck(value) && setHolidayName(value);
    }
    const handlerAddHoliday = () => {
        const isValidField = isValid();
        if (isValidField) {
            const payload = {
                title: holidayName,
                date: moment(startDate).format("YYYY-MM-DD"),
                month: props.YearView ? null : props.Month,
                year: props.Year
            }
            if (props.HolidayDetail) {
                const _payload = {
                    holidayId: props.HolidayDetail.id,
                    title: holidayName,
                    date: moment(startDate).format("YYYY-MM-DD"),
                    month: props.YearView ? null : props.Month,
                    year: props.Year
                }
                props.updateHoliday({ ..._payload })
            }
            else {
                props.handelAddHoliday();
                props.addHoliday({ ...payload });
                
            }
            props.closeModal();
        }
    }

     const handleChandDate = (date) => {
        setStartDate(date)
        props.handleSetDatepickerDate(date);
      }

    return (
        <Modal isOpen={props.show} className="modal-dialog-centered modal-lg add-holiday-modal" modalClassName="custom-modal" toggle={props.closeModal}>
            <span className="close-btn" onClick={props.closeModal}><img src={require('assets/images/cross.svg').default} alt="close" /></span>
            <ModalBody>
                <h2 className="title"> {props.HolidayDetail ? t('accountOwner.updateHoliday') : t('accountOwner.addHoliday')}</h2>
                <div className="add-holiday-block">
                    <div className="c-field">
                        <label>{t('accountOwner.date')}</label>
                        <div className="date-input-picker">
                            <DatePicker selected={startDate}  onChange={date => handleChandDate(date)} 
                            showMonthDropdown showYearDropdown  dropdownMode="select" className="c-form-control"  
                            minDate={new Date(ninDataYear, 0, 1)} maxDate={new Date(maxDataYear, 11, 31)}
                            />
                            <span className="ico"> <img src={require('assets/images/calendar.svg').default} alt="img" /> </span>
                        </div>
                        {errors && errors.startDate && <span class="error-msg">{errors.startDate}</span>}
                    </div>
                    <Input Title="Holiday Name" Type="text" Placeholder="Enter Holiday Name" Name={"holidayName"} HandleChange={InputChange} Error={errors.holidayName} Value={holidayName} />
                    <div className="btn-field">
                        <div className="row gutters-12">
                            <div className="col-md-auto">
                                <button className="button button-round button-shadow button-width-large" title={props.HolidayDetail ? t('accountOwner.updateHoliday') : t('accountOwner.addHoliday')} onClick={handlerAddHoliday}> {props.HolidayDetail ? t('accountOwner.updateHoliday') : t('accountOwner.addHoliday')}
                                </button>
                            </div>
                            <div className="col-md-auto"> <Link to="/"><button className="button button-round button-border button-dark" title="Cancel">{t('cancel')}</button></Link></div>
                        </div>
                    </div>
                </div>
            </ModalBody>
        </Modal>
    )
}
const mapStateToProps = ({
    holiday: { holidayList }
}) => ({
    holidayList
});
export default connect(mapStateToProps, { addHoliday, updateHoliday })(withTranslation()(AddEditHoliday))

