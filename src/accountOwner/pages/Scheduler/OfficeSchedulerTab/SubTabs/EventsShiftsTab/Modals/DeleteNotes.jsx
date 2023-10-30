import React from 'react'
import { withTranslation } from 'react-i18next'
import 'rc-time-picker/assets/index.css'
import { Modal } from 'reactstrap'
import ModalBody from 'reactstrap/lib/ModalBody'
import Text from 'components/Text'
import crossIcon from './../../../../../../../assets/images/cross.svg'
import styles from "./../EventsShiftsTab.module.scss";



function DeleteEventModal({ t, isDeleteEventModalOpen, setIsDeleteEventModalOpen, deleteNotesConfirm }) {

    return (
        <>
            <Modal
                isOpen={isDeleteEventModalOpen}
                toggle={() => setIsDeleteEventModalOpen(false)}
                className={"modal-dialog-centered " + styles['delete-event-modal-dialog']}
                modalClassName='custom-modal'>
                <span className='close-btn' onClick={() => setIsDeleteEventModalOpen(false)}>
                    <img src={crossIcon} alt='close' />
                </span>

                <ModalBody className="text-center">
                    <Text
                        size='25px'
                        marginBottom="10px"
                        weight='500'
                        color='#111b45' >
                   <span className='modal-title-25'>      {t("accountOwner.deleteNote")}
                  </span>  </Text>
                    <Text
                        size='16px'
                        marginBottom="40px"
                        weight='300'
                        color='#535b5f' >
                        {t("accountOwner.areYouSureYouWantToDeleteTheNote")}
                    </Text>

                    <button className="button button-round button-shadow mr-md-4 mb-3 w-sm-100"
                        onClick={deleteNotesConfirm}
                        title={t("accountOwner.deleteNotes")}>
                        {t("accountOwner.deleteNote")}
                    </button>
                    <button className="button button-round button-border button-dark btn-mobile-link"
                        onClick={() => setIsDeleteEventModalOpen(false)}
                        title={t('cancel')}>
                        {t('cancel')}
                    </button>
                </ModalBody>
            </Modal>
        </>
    )
}

export default withTranslation()(DeleteEventModal)