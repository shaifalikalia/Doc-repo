import Button from 'components/Button'
import Text from 'components/Text'
import React, { useState } from 'react'
import { Modal, ModalBody } from 'reactstrap'
import crossIcon from './../../../assets/images/cross.svg'
import styles from './Preferences.module.scss'


function GeoFencePreference({ isDisabled, isLoadingGeocoordinate, isGeoFenceDefined, onDefineGeoFence, t }) {
    const [isModalOpen, setIsModalOpen] = useState(false)

    return (
        <>
        <div className='d-flex flex-column'>
            <Text color='#2f3245' size='12px' weight='500'>{t('accountOwner.geoFenceDescription')}</Text>

            <div className={styles['geofence-define-button-container']}>
                <Button
                    disabled={isLoadingGeocoordinate || isDisabled}
                    boxShadow='4px 5px 14px 0 #e4e9dd' 
                    onClick={() => {
                        if (isGeoFenceDefined) {
                            setIsModalOpen(true)
                            return
                        }

                        onDefineGeoFence()
                    }}>
                    {t(isGeoFenceDefined ? 'accountOwner.editGeoFencingArea' : 'accountOwner.defineGeoFencingArea')}
                </Button>
            </div>
        </div>

        {/* Modal */}
        <Modal 
            isOpen={isModalOpen}
            toggle={() => setIsModalOpen(false)}
            className='modal-dialog-centered' 
            modalClassName='custom-modal'>
            <span className='close-btn' onClick={() => setIsModalOpen(false)}>
                <img src={crossIcon} alt='close' />
            </span>
            <ModalBody>
                <div className='d-flex flex-column align-items-center'>
                    <Text 
                        size='25px' 
                        weight='500' 
                        color='#111b45' >
                 <span className='modal-title-25'> 
                        {t('accountOwner.editGeoFencingArea')}</span>
                    </Text>
                    <Text
                        size='16px'
                        color='#535b5f'
                        marginTop='10px'  
                        marginBottom='40px'>
                        {t('accountOwner.editGeoFencingAreaConfirmationText')}
                    </Text>
                    <div className={styles['modal-buttons-container']}>
                        <Button  
                            className={"mr-md-4 mb-3 w-sm-100 " + styles['action-btn']}
                            boxShadow='4px 5px 14px 0 #e4e9dd;'
                            onClick={onDefineGeoFence}>
                            {t('yes')}, {t('continue')}
                        </Button>
                        <Button 
                            borderedSecondary
                            onClick={() => setIsModalOpen(false)}
                            className={"btn-mobile-link " + styles['cancel-btn']}>
                            {t('cancel')}
                        </Button>
                    </div>
                </div>
            </ModalBody>
        </Modal>
        {/* Modal */}
        </>
    )
}

export default GeoFencePreference