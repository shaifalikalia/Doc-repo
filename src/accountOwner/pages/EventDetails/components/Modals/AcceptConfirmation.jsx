import React from 'react'
import { withTranslation } from 'react-i18next'
import 'rc-time-picker/assets/index.css'
import { Modal } from 'reactstrap'
import ModalBody from 'reactstrap/lib/ModalBody'
import crossIcon from '../../../../../assets/images/cross.svg'
import Text from 'components/Text'
import styles from "../../EventDetails.module.scss";


function SpecficDatesModal({ t,setIsRejectionModalOpen,acceptEvent }) {


    return (
        <>
            <Modal
                isOpen={true}
                toggle={() => setIsRejectionModalOpen({})}
                className={"modal-dialog-centered " + styles['specific-date-modal-dialog']}
                modalClassName='custom-modal'>
                <span className='close-btn' onClick={() => setIsRejectionModalOpen({})}>
                    <img src={crossIcon} alt='close' />
                </span>

                <ModalBody className='text-center'>
                    <Text
                        size='25px'
                        marginBottom="10px"
                        weight='500'
                        color='#111b45' >
                     <span className='modal-title-25'> 
                        {t("scheduler.acceptRequest")}</span>
                    </Text>

                    <Text
                       size='16px'
                       weight='300'
                       color='#535b5f'
                       marginBottom="10px"
                        >
                        {t("scheduler.acceptRequestContent")}
                    </Text>
                    
                    <button className="button button-round button-shadow mr-md-4 mb-3 w-sm-100" title={t("accept")} onClick={()=>acceptEvent()}>  {t("accept")}
                    </button>
                    <button className="button btn-mobile-link button-round button-border button-dark "
                        onClick={() => setIsRejectionModalOpen({})}
                        title={t('cancel')}>
                        {t('cancel')}
                    </button>
                </ModalBody>
            </Modal>
        </>
    )
}

export default withTranslation()(SpecficDatesModal)