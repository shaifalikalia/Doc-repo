import React, { useState } from 'react'
import { withTranslation } from 'react-i18next'
import 'rc-time-picker/assets/index.css'
import { Modal } from 'reactstrap'
import ModalBody from 'reactstrap/lib/ModalBody'
import crossIcon from './../../../../../assets/images/cross.svg'
import Text from 'components/Text'
import styles from "./Modals.module.scss";


function RejectionModal({ t, isRejectionModalOpen, setIsRejectionModalOpen, confirmReject, isCancel }) {

    const [reason, setReason] = useState('');
    const [reasonError, setReasonError] = useState('');

    const handleChange = (val) => {
        if (val && val.trim().length && val.trim().length > 400) {
            val = val.trim().substring(0, 400);
        }
        setReason(val);
        setReasonError('');
    }
    const submitReason = () => {
        if (reason && reason.trim().length > 1) {
            confirmReject(reason);
        } else {
            setReasonError(`${t('form.errors.emptyField', { field: t('staff.reason') })}`);
        }
    }
    return (
        <>
            <Modal
                isOpen={isRejectionModalOpen}
                toggle={() => setIsRejectionModalOpen(false)}
                className={"modal-dialog-centered " + styles['rejection-modal-dialog']}
                modalClassName='custom-modal'>
                <span className='close-btn' onClick={() => setIsRejectionModalOpen(false)}>
                    <img src={crossIcon} alt='close' />
                </span>

                <ModalBody>
                    <Text
                        size='25px'
                        marginBottom="15px"
                        weight='500'
                        color='#111b45' >
                            <span className='modal-title-25'> 
                        {isCancel ? t("accountOwner.reasonOfCancellation") : t("accountOwner.reasonOfRejection")}
             </span>       </Text>

                    <div className="c-field">
                        <label>{t("accountOwner.writeReason")}</label>
                        <textarea
                            placeholder={t('form.placeholder1', { field: t('accountOwner.writeReason') })}
                            className={"c-form-control " + styles["custom-textarea-control"]}
                            name="reason"
                            maxLength="400"
                            onChange={(e) => handleChange(e.currentTarget.value)}
                            value={reason}
                        ></textarea>
                        {(!reason || !reason.trim().length) && reasonError && <span className="error-msg">{reasonError}</span>}
                    </div>


                    <button className="button button-round button-shadow mr-md-4 mb-3 w-sm-100"
                        onClick={() => submitReason()}
                        title={t("accountOwner.cancelSchedule")}>
                        {t('submit')}
                    </button>
                    <button className="button button-round button-border button-dark btn-mobile-link"
                        title={t('accountOwner.goBack')} onClick={() => setIsRejectionModalOpen(false)}>
                        {t('accountOwner.goBack')}
                    </button>
                </ModalBody>
            </Modal>
        </>
    )
}

export default withTranslation()(RejectionModal)