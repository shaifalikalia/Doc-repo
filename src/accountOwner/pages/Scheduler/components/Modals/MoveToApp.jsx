import React from 'react';
import { withTranslation } from 'react-i18next';
import 'rc-time-picker/assets/index.css';
import { Modal } from 'reactstrap';
import ModalBody from 'reactstrap/lib/ModalBody';
import crossIcon from './../../../../../assets/images/cross.svg';
import Text from 'components/Text';
import styles from './Modals.module.scss';
import constants from '../../../../../constants';

function MoveToAPP({ t, isModal, openModal  ,type }) {
  
  const handleClose = () => {
    openModal(false)
  };

  let title = ''
  let description = ''

  if(type === constants.agendaType.BLOCKED){
    title = t('scheduler.Slotblocked')
    description = t('scheduler.SlotblockedDescription')
  }

  if(type === constants.agendaType.LEAVE){
    title = t('scheduler.agendaLeave')
    description = t('scheduler.agendaLeaveDescription')
  }

  if(type === constants.agendaType.APPOINTMENT){
    title = t('scheduler.PatientAppointment')
    description = t('scheduler.PatientAppointmentCheckFromMobile')
  }



  return (
    <>
      <Modal
        isOpen={isModal}
        toggle={() => handleClose()}
        className={
          'modal-dialog-centered modal-width-660 ' +
          styles['confirem-accept-modal-dialog']
        }
        modalClassName='custom-modal'
      >
        <span className='close-btn' onClick={() => handleClose()}>
          <img src={crossIcon} alt='close' />
        </span>

        <ModalBody className='text-center'>
          <Text size='25px' marginBottom='10px' weight='500' color='#111b45'>
            {title}
          </Text>
          <Text
            size='16px'
            className={styles['desc-text']}
            weight='300'
            color='#535b5f'
          >
          
            {description}
            

          </Text>

 
          <button
            className='button button-round button-border button-dark '
            onClick={() => handleClose()}
            title={t('close')}
          >
            {t('close')}
          </button>
        </ModalBody>
      </Modal>
    </>
  );
}

export default withTranslation()(MoveToAPP);
