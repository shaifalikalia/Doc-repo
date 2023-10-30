import React, { useState } from 'react'
import { withTranslation } from 'react-i18next'
import 'rc-time-picker/assets/index.css'
import { Modal } from 'reactstrap'
import ModalBody from 'reactstrap/lib/ModalBody'
import crossIcon from './../../../../../../../assets/images/cross.svg'
import styles from "./../EventsShiftsTab.module.scss";
import Text from 'components/Text'
import { addSchedularNotes, editSchedularNotes } from 'repositories/scheduler-repository'
import moment from 'moment'
import toast from 'react-hot-toast';

function AddNotesModal({ t, isAddNotesModal, setIsAddNotesModal, updateList, setIsLoading , getDetailsOwnerIfStaff}) {
    const [error, seterror] = useState('')

    const addNotes = async () => {
        if (!isAddNotesModal.value?.trim().length) {
            seterror(t('form.errors.emptyField', { field: t('note') }))
            return false
        }
        if (isAddNotesModal.value?.trim().length > 600) {
            seterror(t('form.errors.maxLimit', { limit: '600' }))
            return false
        }
        setIsLoading(true);

        let data = {
            OwnerId: getDetailsOwnerIfStaff,
            Text: isAddNotesModal.value,
            Date: moment(isAddNotesModal.data.date).format('YYYY-MM-DDTHH:mm')
        }
        closeModel();
        try {
            if (isAddNotesModal.type === 'ADD') {
                let response = await addSchedularNotes(data)
                response?.statusCode === 200 && updateList(response, 'ADD')
                setIsLoading(false);
                toast.success(t('message.addedSuccessfully', { field: t('accountOwner.note') }));
            } else {
                let response = await editSchedularNotes(isAddNotesModal.value, isAddNotesModal.data?.data.id)
                response?.statusCode === 200 && updateList(response, 'ADD')
                setIsLoading(false);
                toast.success(t('message.updatedSuccessfully', { field: t('accountOwner.note') }));
            }
        } catch (e) {
            setIsLoading(false);
            toast.error(e.message)
        }
    }




    const handleChange = e => {
        let value = e.target.value
        if (!value?.trim().length) {
            seterror(t('form.errors.emptyField', { field: t('note') }))
        }
        else if (value?.trim().length > 600) {
            seterror(t('form.errors.maxLimit', { limit: '600' }))
        } else {
            seterror('')
        }

        isAddNotesModal.value = e.target.value
        setIsAddNotesModal({ ...isAddNotesModal })
    }

    const closeModel = () => {
        setIsAddNotesModal({ visible: false })
        seterror('')
    }

    return (
        <>
            <Modal
                isOpen={isAddNotesModal?.visible}
                toggle={closeModel}
                className={"modal-dialog-centered modal-width-660 " + styles['notes-modal-dialog']}
                modalClassName='custom-modal'>
                <span className='close-btn' onClick={closeModel} >
                    <img src={crossIcon} alt='close' />
                </span>

                <ModalBody>
                    <Text
                        size='25px'
                        marginBottom="10px"
                        weight='500'
                        color='#111b45' >
                 <span className='modal-title-25'> 
                        {isAddNotesModal.data?.date ? moment(isAddNotesModal.data?.date).format('MMM DD, YYYY') : isAddNotesModal.data?.mDate}
                  </span>  </Text>
                    <div className={"c-field " + styles["add-notes-field"]}>
                        <label>
                            {
                                isAddNotesModal.type === 'ADD' ? t('accountOwner.addNote') : t('accountOwner.editNote')
                            }
                        </label>

                        <textarea
                            className={"c-form-control"}
                            placeholder={t('form.placeholder1', { field: t('accountOwner.note') })}
                            name="Notes"
                            maxLength="600"
                            value={isAddNotesModal.value}
                            onChange={e => handleChange(e)}
                        ></textarea>
                        {error && <span className="error-msg">{error}</span>}
                    </div>
                    <button className="button button-round button-shadow mr-md-4 mb-3 w-sm-100"
                        onClick={addNotes}
                        title={t("save")}>
                        {t("save")}
                    </button>
                    <button className="button button-round button-border button-dark btn-mobile-link"
                        onClick={closeModel}
                        title={t('cancel')}>
                        {t('cancel')}
                    </button>
                </ModalBody>
            </Modal>
        </>
    )
}

export default withTranslation()(AddNotesModal)