import React from 'react'
import { withTranslation } from 'react-i18next'
import 'rc-time-picker/assets/index.css'
import { Modal } from 'reactstrap'
import ModalBody from 'reactstrap/lib/ModalBody'
import crossIcon from '../../../../../assets/images/cross.svg'
import Text from 'components/Text'
import styles from "../../EventDetails.module.scss";
import constants from '../../../../../constants'

function RejectionModal({ t, isRejectionModalOpen, setIsRejectionModalOpen , 
    rejectEvent ,
     rejectedTest,SetRejectedTest ,isSelectedRequestedEvent , isError}) {



    return (
        <>
            <Modal
                isOpen={isRejectionModalOpen}
                toggle={() => setIsRejectionModalOpen({})}
                className={"modal-dialog-centered " + styles['rejection-modal-dialog']}
                modalClassName='custom-modal'>
                <span className='close-btn' onClick={() => setIsRejectionModalOpen({})}>
                    <img src={crossIcon} alt='close' />
                </span>
              
                <ModalBody>
                    <Text
                        size='25px'
                        marginBottom="15px"
                        weight='500'
                        color='#111b45' >
                     <span className='modal-title-25'>     {t("accountOwner.reasonOfRejection")}
                       </span>
                    </Text>
                    <Text
                        size='16px'
                        marginBottom="40px"
                        weight='500'
                        color='#111b45' >
                        {`${isSelectedRequestedEvent?.requestedBy?.firstName} ${isSelectedRequestedEvent?.requestedBy?.lastName}`}
                    </Text>
                   <div className="c-field">
                        <label>  {t("accountOwner.writeReason")}</label>
                        <textarea 
                        maxlength={constants.wordLimits.REJECTOINREQUESTJOIN}
                        className="c-form-control" placeholder={t("accountOwner.writeReason")} value={rejectedTest}
                         onChange={e => SetRejectedTest(e.target.value)}>
                        </textarea>


                        {
                            isError?.reasonForRejection && 
                            <div className='error-msg'>
                            {isError?.reasonForRejection}
                            </div>
                        }
                   </div>
                   
                   
                  
                    <button className="button button-round button-shadow mr-md-4 mb-3 w-sm-100"
                    onClick={()=>rejectEvent()}
                        title={t("reject")}>
                        {t("reject")}
                    </button>
                    <button className="button button-round button-border btn-mobile-link button-dark "
                     onClick={() => setIsRejectionModalOpen({})}
                        title={t('cancel')}>
                        {t('cancel')}
                    </button>
                </ModalBody>
            </Modal>
        </>
    )
}

export default withTranslation()(RejectionModal)