import React from 'react'
import { withTranslation } from 'react-i18next'
import { Modal } from 'reactstrap'
import ModalBody from 'reactstrap/lib/ModalBody'
import crossIcon from '../../../../../../assets/images/cross.svg';
import Text from 'components/Text'
import styles from "./SyncModal.module.scss";
import toast from 'react-hot-toast';


function CompleteAppointmentModal(props) {
  const {
    t, 
    isOpen, 
    setIsOpen, 
    title,
    syncUrl,
  } = props;
  const closeModal = () => {
    setIsOpen(false);
  };

  const handleCopy = () => {
    if(navigator){
      navigator.clipboard.writeText(syncUrl);
      toast.success(t('accountOwner.syncUrlCopied'));
    }
  }
  
  return (
    <>
      <Modal
        isOpen={isOpen}
        toggle={closeModal}
        className={"modal-dialog-centered " + styles['custom-modal-dialog']}
        modalClassName='custom-modal'>
        <span className='close-btn' onClick={closeModal}>
          <img src={crossIcon} alt='close' />
        </span>

        <ModalBody className={styles['calender-modal']}>
          <Text
            size='25px'
            marginBottom="10px"
            weight='500'
            color='#111b45' 
          >
            {title}
          </Text>
          <p>To sync the Agenda events with the calendar, copy the link shared below and follow the mentioned steps:</p>
          <div className={styles['sync-link-div']} onClick={handleCopy}>
            <span className='link-btn text-break' title={t('accountOwner.syncUrlToolTip')}>{syncUrl}</span>
            <span className='cursor-pointer'><img src={require("assets/images/icon-copy.svg").default} alt="copy-icon" /></span>
          </div>
          <p>You can sync the Scheduler with your personal calendar by following the below-mentioned steps:</p>
          <div>
            <ol>
              <li>Open Google Calendar or any other calendar where you want to sync the Agenda events.</li>
              <li>Click on Add Calendar + icon.</li>
              <li>Select “From URL” from the available options.</li>
              <li>Paste the URL that you copied from Agenda.</li>
              <li>Click on the button for “Add Calendar”.</li>
            </ol>
          </div>
        </ModalBody>
      </Modal>
    </>
  )
}

export default withTranslation()(CompleteAppointmentModal)