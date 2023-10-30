import React from 'react'
import { withTranslation } from 'react-i18next'
import { Modal } from 'reactstrap'
import ModalBody from 'reactstrap/lib/ModalBody'
import crossIcon from '../../../../../assets/images/cross.svg'
import Text from 'components/Text'
import styles from "../../EventDetails.module.scss";


function ReasonOfRejection({ t,setIsSelectedRequestedEvent, isSelectedRequestedEvent }) {
    const closeModal = () =>{
         setIsSelectedRequestedEvent({})
        }
    return (
            <Modal
                isOpen={true}
                toggle={() => closeModal()}
                className={"modal-dialog-centered " + styles['specific-date-modal-dialog']}
                modalClassName='custom-modal'>
                <span className='close-btn' onClick={() => closeModal()}>
                    <img src={crossIcon} alt='close' />
                </span>
                <ModalBody className='text-center'>
                    <Text
                        size='25px'
                        marginBottom="10px"
                        weight='500'
                        color='#111b45' >
                   <span className='modal-title-25'> 
                        {t("accountOwner.reasonOfRejection")}</span>
                    </Text>
                    <Text
                       size='16px'
                       weight='300'
                       color='#535b5f'
                       marginBottom="10px"
                        >
                       {isSelectedRequestedEvent?.reasonForRejection}
                       
                    </Text>
                </ModalBody>
            </Modal>
    )
}

export default withTranslation()(ReasonOfRejection)