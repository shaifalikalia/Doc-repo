import React, { Fragment } from 'react';
import { withTranslation } from 'react-i18next';
import 'rc-time-picker/assets/index.css';
import { Modal } from 'reactstrap';
import ModalBody from 'reactstrap/lib/ModalBody';
import crossIcon from './../../../../../assets/images/cross.svg';
import Text from 'components/Text';
import styles from './Modals.module.scss';
import { getDay } from 'utils';
import Calendar from 'react-calendar';
import moment from 'moment';
import constants from '../../../../../constants';

function RepeatEventModal({
  t,
  eventDetailModal,
  seteventDetailModal,
  requestToJoin,
  selectedDate,
  selectMultipleDates,
  selectedRepeatEvent,
  setSelectedRepeatEvent,
  setselectedDate
}) {
  const StartDay = getDay(new Date(eventDetailModal.date));
  const disabledDates = ({ date }) => {
    return date.getDay() !== StartDay?.index;
  };


  const addClassDate = ({ date }) => {
    return selectedDate?.includes(moment(date).format('YYYY-MM-DD'))
      ? 'cus_class'
      : 'cus_class_remove';
  };
  
  const handleSelectRepeatChange = (e) => {
    setSelectedRepeatEvent(e.target.value);
  };
  const handleClose = () => {
    seteventDetailModal({});
    setselectedDate([])
  };

  const getMinDate = () =>{
    if(moment(eventDetailModal.date).isAfter(moment())){
        return moment(eventDetailModal.date).toDate()
    }
    return moment().toDate()
  }


  return (
    <Modal
      isOpen={true}
      toggle={() => handleClose()}
      className={
        'modal-dialog-centered modal-width-660 ' +
        styles['repeat-event-modal-dialog']
      }
      modalClassName='custom-modal'
    >
      <span className='close-btn' onClick={() => handleClose()}>
        <img src={crossIcon} alt='close' />
      </span>
      
      <ModalBody
      className={eventDetailModal?.repeatedType === 1 ? 'text-center' : ''}
      >
        {eventDetailModal?.repeatedType !== 1 && (
          <div>
            <Text size='25px' marginBottom='20px' weight='500' color='#111b45'>
            <span className='modal-title-25'> 
              {
              eventDetailModal?.repeatedType === 2 ?
              <Fragment>
               {t(`scheduler.eventrepeatsevery`)} {`${StartDay?.day}s`}
              </Fragment>
              :
              <Fragment>
              {t(`scheduler.RequesttojoineventFutureDay`)} 
              </Fragment>
              }
              </span>

            </Text>

            <ul>
              <li>
                <div className='ch-radio'>
                  <label className='mr-5'>
                    <input
                      type='radio'
                      name='eventRepeat'
                      value={constants.SCHEDULEREVENTTYPE.All}
                      checked={
                        selectedRepeatEvent === constants.SCHEDULEREVENTTYPE.All
                      }
                      onChange={handleSelectRepeatChange}
                    />
                    {eventDetailModal?.repeatedType === 2 ? (
                      <span>
                        {' '}
                        {t(`scheduler.RequesttojoineventAllDay`)}{' '}
                        {`${StartDay?.day}s`}
                      </span>
                    ) : (
                      <span>
                        {' '}
                        {t(`scheduler.RequesttojoineventFutureDay`)}{' '}
                      </span>
                    )}
                  </label>
                </div>
              </li>
              <li>
                <div className='ch-radio'>
                  <label className='mr-5'>
                    <input
                      type='radio'
                      name='eventRepeat'
                      value={constants.SCHEDULEREVENTTYPE.SPECFIC}
                      checked={
                        selectedRepeatEvent ===
                        constants.SCHEDULEREVENTTYPE.SPECFIC
                      }
                      onChange={handleSelectRepeatChange}
                    />
                    <span>{t(`scheduler.JoinSpecificDates`)}</span>
                  </label>
                </div>
              </li>
            </ul>

            {selectedRepeatEvent === constants.SCHEDULEREVENTTYPE.SPECFIC && (
              <>
                {eventDetailModal?.repeatedType === 2 ? (
                  <Calendar
                    minDate={getMinDate()}
                    className='scheduler-calendar'
                    tileClassName={addClassDate}
                    tileDisabled={disabledDates}
                    maxDate={new Date(moment(eventDetailModal?.repeatedEndDate, 'YYYY-MM-DDTHH:mm:ss'))}

                    onClickDay={selectMultipleDates}
                  />
                ) : (
                  <Calendar
                    minDate={getMinDate()}
                    tileClassName={addClassDate}
                    onClickDay={selectMultipleDates}
                    maxDate={new Date(moment(eventDetailModal?.repeatedEndDate, 'YYYY-MM-DDTHH:mm:ss'))}
                    className='scheduler-calendar'
                 
                  />
                )}
              </>
            )}
          </div>
        )}

        {eventDetailModal?.repeatedType === 1 && (
          <div  >
            <Text size='25px' marginBottom='10px' weight='500' color='#111b45'>
              {t('scheduler.joinEvent')}
            </Text>
            <Text
              size='16px'
              className={styles['desc-text']}
              weight='300'
              color='#535b5f'
            >
              {t('scheduler.joinSingleEventDesc')}
            </Text>
            <Text
              size='16px'
              marginBottom='40px'
              className={styles['desc-text']}
              weight='300'
              color='#535b5f'
            >
              {t('scheduler.joinSingleEventConfirm')}
            </Text>
          </div>
        )}
        <button
          className='button button-round button-shadow mr-md-4 mb-3 w-sm-100'
          title={t('accountOwner.requestToJoin')}
          onClick={() => requestToJoin()}
        >
          {t('accountOwner.requestToJoin')}
        </button>
        <button
          className='button button-round button-border button-dark btn-mobile-link'
          onClick={() => handleClose()}
          title={t('accountOwner.goBack')}
        >
          {t('accountOwner.goBack')}
        </button>
      </ModalBody>
    </Modal>
  );
}

export default withTranslation()(RepeatEventModal);
