import React, { useState } from 'react'
import { withTranslation } from 'react-i18next'
import 'rc-time-picker/assets/index.css'
import { Modal } from 'reactstrap'
import ModalBody from 'reactstrap/lib/ModalBody'
import crossIcon from './../../../../../../../assets/images/cross.svg'
import Text from 'components/Text'
import styles from "./../EventsShiftsTab.module.scss";
import Tooltip from 'reactstrap/lib/Tooltip';
import moment from 'moment'
import { isMobileTab } from 'utils'

function EditNotesModal({ t, isEditNotesModal, setIsEditNotesModal, addNotesModelShow, setdeleteConfirmation }) {
    const [tooltipEditOpen, setTooltipEditOpen] = useState(false);
    const [tooltipDeleteOpen, setTooltipDeleteOpen] = useState(false);
    const editNotes = () => {
        setIsEditNotesModal({ visible: false });
        addNotesModelShow(isEditNotesModal.data, 'EDIT');
    }

    const deleteNotes = () => {
        setdeleteConfirmation({
            visible: true,
            id: isEditNotesModal.data?.data.id

        });
        setIsEditNotesModal({ visible: false });
    }

    


    return (
        <>
            <Modal
                isOpen={isEditNotesModal.visible}
                toggle={() => setIsEditNotesModal({ visible: false })}
                className={"modal-dialog-centered modal-width-660 " + styles['notes-modal-dialog']}
                modalClassName='custom-modal'>
                <span className='close-btn' onClick={() => setIsEditNotesModal({ visible: false })}>
                    <img src={crossIcon} alt='close' />
                </span>
                <div className={"d-flex " + styles["top-icons"]}>
                
                    <span id="TooltipEditBtn">
                        <img src={require('assets/images/edit-icon.svg').default} alt="icon" onClick={editNotes} />
                    </span>

                    {
                        !isMobileTab() &&
                    <Tooltip
                            isOpen={tooltipEditOpen}
                            placement="bottom"
                            target="TooltipEditBtn"
                            toggle={() => { setTooltipEditOpen(!tooltipEditOpen) }}
                            >
                            Edit 
                        </Tooltip>
                    }
                    <span id="TooltipDeleteBtn">
                        <img src={require('assets/images/delete-icon.svg').default} alt="icon"
                         onClick={deleteNotes} />
                    </span>
                    { 
                    !isMobileTab() &&
                    <Tooltip

                            isOpen={tooltipDeleteOpen}
                            placement="bottom"
                            target="TooltipDeleteBtn"
                            toggle={() => { setTooltipDeleteOpen(!tooltipDeleteOpen) }}
                            >
                            Delete
                        </Tooltip>}
                </div>
                <ModalBody className={styles['modal-body']}>
                    <Text
                        size='25px'
                        marginBottom="10px"
                        weight='500'
                        color='#111b45' >
                 <span className='modal-title-25'>        {t('accountOwner.note')} - {isEditNotesModal.data?.date ? moment(isEditNotesModal.data?.date).format('MMM DD, YYYY') : isEditNotesModal.data?.mDate}
               </span>     </Text>
                    <Text
                        size='16px'
                        marginBottom="0px"
                        weight='300'
                        color='#535B5F' >
                        {isEditNotesModal.data?.data?.text}
                    </Text>
                </ModalBody>
            </Modal>

        </>
    )
}

export default withTranslation()(EditNotesModal)