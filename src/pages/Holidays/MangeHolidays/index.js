import React, { Component, Fragment } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import { connect } from "react-redux";
import { DropdownToggle, DropdownMenu, DropdownItem, UncontrolledDropdown } from 'reactstrap';

import { getHolidayList, DeleteHoliday } from 'actions/index';
import AddEditHoliday from './components/AddEditHoliday';
import _isLoading from 'hoc/isLoading';
import Toast from 'components/Toast';
import { Scrollbars } from 'react-custom-scrollbars';
import { withTranslation, Trans } from 'react-i18next';
import constants from './../../../constants'


const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
]

class MangeHolidays extends Component {

    state = {
        ninDataYear: new Date().getFullYear() - 4,
        maxDataYear: new Date().getFullYear() + 1,
        addModal: false,
        isToastView: false,
        holidayDataList: null,
        currentMonth: monthNames[new Date().getMonth()],
        holidays: null,
        isProps: true,
        yearview: false,
        monthlyview: true,
        currentDate: null,
        currentYear: new Date().getFullYear(),
        currentMonthIndex: new Date().getMonth() + 1,
        yearDataList: [
            new Date().getFullYear() - 4,
            new Date().getFullYear() - 3,
            new Date().getFullYear() - 2,
            new Date().getFullYear() - 1,
            new Date().getFullYear(),
            new Date().getFullYear() + 1
        ],
        holidayDetail: null,
        dropdownOpen: false,
        CalendarDate: null
    }

    componentDidMount() {
        const payload = {
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1
        }
        this.props.getHolidayList({ ...payload });
    }

    static getDerivedStateFromProps(props, state) {
        if (state.isProps) {
            if (props.holidayList) {
                let days = [...props.holidayList].map((item) => moment(item.date).format("YYYY-MM-DD"))
                return {
                    holidayDataList: props.holidayList,
                    holidays: days
                }
            }
            return {
                holidayDataList: props.holidayList
            };
        }

        return null
    }


    componentDidUpdate(prevProps) {
        if (prevProps.statusMessage !== this.props.statusMessage || prevProps.holiayRemoveMessage !== this.props.holiayRemoveMessage) {
            window.scrollTo(0, 0)
            this.setState({ isToastView: true });
            setTimeout(() => {
                if (!this.props.isLoadError && !this.props.isRemove) {
                    this.setState({ isToastView: false });
                }

            }, 2000);

        }
    }

    showModal = () => {
        this.setState({ addModal: true, holidayDetail: null });
    }

    closeModal = () => {
        this.setState({ addModal: false });
    }


    toastHide = () => {
        this.setState({ isToastView: false })
    }

    handleHoldiay = (value) => {
        this.setState({ isProps: true, currentDate: null });
        let monthvalue = moment(value).format('MM');
        this.setState({ currentMonth: monthNames[parseInt(monthvalue) - 1], currentYear: parseInt(moment(value).format('YYYY')), currentMonthIndex: (monthvalue) })
        const payload = {
            year: moment(value).format('YYYY'),
            month: moment(value).format('MM')
        }
        this.props.getHolidayList({ ...payload });



    }
    handleClickday = (data) => {
        let currentDay = moment(data).format("YYYY-MM-DD");
        let days = [...this.props.holidayList];
        for (let value of days) {
            value.date = moment(value.date).format("YYYY-MM-DD");
        }
        let newHolidayList = days.filter((item) => item.date === currentDay);
        this.setState({ isProps: false, holidayDataList: newHolidayList, currentDate: data, CalendarDate: null })

    }

    handleYearview = () => {
        if (!this.state.yearview) {
            this.setState({ yearview: true, currentDate: null, CalendarDate: null, monthlyview: false, isProps: true, currentYear: new Date().getFullYear() });
            const payload = {
                year: new Date().getFullYear(),
                month: null
            }
            this.props.getHolidayList({ ...payload });
        }

    }

    handleMonthlyview = () => {

        if (!this.state.monthlyview) {
            this.setState({
                yearview: false, monthlyview: true, CalendarDate: null, currentMonth: monthNames[new Date().getMonth()], currentYear: new Date().getFullYear(),
                currentMonthIndex: new Date().getMonth() + 1,
            });
            const payload = {
                year: new Date().getFullYear(),
                month: new Date().getMonth() + 1
            }
            this.props.getHolidayList({ ...payload });
        }

    }

    haneleYearchange = (item) => {
        this.setState({ currentYear: item, currentDate: null });
        const payload = {
            year: item,
            month: null
        }
        this.props.getHolidayList({ ...payload });
    }

    handlerDeleteHoldiay = (id) => {
        this.setState({ holidayDataList: this.props.holidayList, isProps: true })
        const payload = {
            id,
            year: this.state.currentYear,
            month: this.state.monthlyview ? this.state.currentMonthIndex : null
        }

        this.props.DeleteHoliday({ ...payload });
    }

    handlerEditHoliday = (data) => {
        this.setState({ addModal: true, holidayDetail: data });
    }

    handelAddHoliday = () => {
        this.setState({ isProps: true });
    }

    handleSetDatepickerDate = (date) => {
        this.setState({ CalendarDate: date });
    }


    render() {
        const { ninDataYear, addModal, isToastView, holidayDataList, holidays } = this.state;
        const { isLoadError, statusMessage, holidayList, holiayRemoveMessage, isRemove, t } = this.props;

        let holidayData = null;
        let dropdown = (item) => <UncontrolledDropdown>
            <DropdownToggle caret={false} tag="div">
                <span className="ico">
                    <img src={require('assets/images/dots-icon.svg').default} alt="icon" />
                </span></DropdownToggle>
            <DropdownMenu right>
                <Fragment>
                    <DropdownItem onClick={() => this.handlerEditHoliday(item)} >
                        <span> <img src={require('assets/images/edit-icon.svg').default} alt="icon" />{t('edit')}</span>
                    </DropdownItem>
                    <DropdownItem onClick={() => this.handlerDeleteHoldiay(item.id)}>
                        <span> <img src={require('assets/images/delete-icon.svg').default} alt="icon" />{t('delete')}</span>
                    </DropdownItem>
                </Fragment>
            </DropdownMenu>

        </UncontrolledDropdown>




        if (holidayDataList && holidayDataList.length > 0) {
            holidayData = (
                holidayDataList.map((item, index) => <tr key={item.id}>
                    <td>
                        <span>{moment(item.date).format('MMMM DD')}</span>
                    </td>
                    <td width="50%"><strong>{item.title}</strong></td>
                    <td>
                        {this.props.profile && this.props.profile.role.systemRole === constants.systemRoles.accountOwner && item.type === 2 &&
                            <Fragment>
                                <div className="action-links">
                                    <ul>
                                        <li>
                                            <span title={t('edit')} onClick={() => this.handlerEditHoliday(item)}>
                                                <img src={require('assets/images/edit-icon.svg').default} alt="icon" />
                                            </span>
                                        </li>
                                        <li>
                                            <span title={t('delete')} onClick={() => this.handlerDeleteHoldiay(item.id)}>
                                                <img src={require('assets/images/delete-icon.svg').default} alt="icon" />
                                            </span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="action-dropdown">
                                    {dropdown(item)}
                                </div>
                            </Fragment>
                        }

                        {this.props.profile && this.props.profile.role.systemRole === constants.systemRoles.superAdmin && item.type === 1 &&
                            <Fragment>
                                <div className="action-links">
                                    <ul>
                                        <li>
                                            <span title={t('edit')} onClick={() => this.handlerEditHoliday(item)}>
                                                <img src={require('assets/images/edit-icon.svg').default} alt="icon" />
                                            </span>
                                        </li>
                                        <li>
                                            <span title={t('delete')} onClick={() => this.handlerDeleteHoldiay(item.id)}>
                                                <img src={require('assets/images/delete-icon.svg').default} alt="icon" />
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="action-dropdown">
                                    {dropdown(item)}
                                </div>
                            </Fragment>

                        }

                    </td>
                </tr >)
            )
        }

        return (

            <div className="manage-holiday-block">

                {isToastView && statusMessage && <Toast message={statusMessage} handleClose={this.toastHide} errorToast={isLoadError ? true : false} />}

                {isToastView && !statusMessage && holiayRemoveMessage && <Toast message={holiayRemoveMessage} handleClose={this.toastHide} errorToast={isRemove ? true : false} />}

                <div className="container">
                    <div className="row no-gutters align-items-center">
                        <div className="col-md-7"><h2 className="title">{t('accountOwner.manageHolidays')}</h2></div>
                        <div className="col-md-5 text-md-right">
                            <button className="button button-round button-width-large add-button" title={t('accountOwner.addHoliday')} onClick={this.showModal}>{t('accountOwner.addHoliday')}</button>
                        </div>
                    </div>

                    <div className="holiday-data-block">
                        <div className="tab_header">
                            <ul>
                                <li>
                                    <span className={this.state.monthlyview && 'active'} onClick={this.handleMonthlyview}>{t('accountOwner.monthly')}</span>
                                </li>
                                <li>
                                    <span className={this.state.yearview && 'active'} onClick={this.handleYearview}>{t('accountOwner.yearly')}</span>
                                </li>
                            </ul>
                        </div>

                        <div className="holiday-list-block">
                            <div className="row no-gutters">
                                <div className="col-lg-6 col-xl-5 ">
                                    <div className="holiday-calendar">
                                        {this.state.monthlyview &&
                                            <Calendar minDate={new Date(ninDataYear, 0, 1)} 
                                                tileClassName={({ date}) => {
                                                    if (holidays && holidays.find(x => x === moment(date).format("YYYY-MM-DD"))) {
                                                        return 'highlight-date'
                                                    }
                                                }}
                                                onClickDay={(value) => this.handleClickday(value)}
                                                onActiveStartDateChange={({ activeStartDate }) => (this.handleHoldiay(activeStartDate))}
                                            >
                                            </Calendar>}

                                        {this.state.yearview &&
                                            <div className="year-data-list">
                                                {this.state.yearDataList.map((item, index) => <span className={item === this.state.currentYear && 'active'} key={index} onClick={() => this.haneleYearchange(item)}>{item}</span>)}
                                            </div>

                                        }

                                    </div>
                                </div>
                                <div className="col-lg-6 col-xl-7">
                                    <div className="data-list-container">

                                        {holidayData &&
                                            <Fragment>
                                                <h4>{t('accountOwner.holidaysIn')} {this.state.yearview ? this.state.currentYear : this.state.currentMonth} </h4>
                                                <Scrollbars autoHeight autoHeightMax={320}>
                                                    <div className="data-list">
                                                        <table>
                                                            <tbody>
                                                                {holidayData}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </Scrollbars>

                                            </Fragment>
                                        }
                                        {
                                            holidayList && holidayDataList.length === 0 && holidayDataList.length === 0 &&

                                            <Fragment>
                                                {this.state.monthlyview &&
                                                    <div className="empty-holiday-list">
                                                        <h5>{t('accountOwner.emptyHolidaysMessage')} {this.state.currentMonth} {this.state.currentDate && moment(this.state.currentDate).format('DD')}</h5>
                                                        <p><Trans i18nKey='accountOwner.addHolidayMessage'>Please click on <strong>Add Holiday</strong> to add a <br /> holiday for this</Trans>  {this.state.currentDate ? t('accountOwner.date') : t('accountOwner.month')} </p>
                                                    </div>
                                                }

                                                {this.state.yearview &&
                                                    <div className="empty-holiday-list">
                                                        <h5>{t('accountOwner.emptyHolidaysMessage')} {this.state.currentYear} </h5>
                                                        <p><Trans i18nKey='accountOwner.addHolidayMessage'>Please click on <strong>Add Holiday</strong> to add a <br /> holiday for this</Trans>  {t('accountOwner.year')}. </p>
                                                    </div>
                                                }
                                            </Fragment>


                                        }
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                {addModal && <AddEditHoliday CalendarDate={this.state.CalendarDate} handleSetDatepickerDate={this.handleSetDatepickerDate} handelAddHoliday={this.handelAddHoliday} currentDate={this.state.currentDate} YearView={this.state.yearview} HolidayDetail={this.state.holidayDetail} Month={this.state.currentMonthIndex} Year={this.state.currentYear} show={addModal} closeModal={this.closeModal} />}
            </div>

        )
    }

}

const mapStateToProps = ({
    userProfile: { profile },
    holiday: { statusMessage, isLoading, holidayList, isLoadError, holiayRemoveMessage, isRemove },
    errors: { isError }
}) => ({
    statusMessage, isLoading, holidayList, profile, isError, isLoadError, holiayRemoveMessage, isRemove
});

export default connect(mapStateToProps, { getHolidayList, DeleteHoliday })(_isLoading(withTranslation()(MangeHolidays)))

