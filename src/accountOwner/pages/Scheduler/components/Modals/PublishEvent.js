import React from 'react'
import { withTranslation } from 'react-i18next'
import 'rc-time-picker/assets/index.css'
import { Modal } from 'reactstrap'
import ModalBody from 'reactstrap/lib/ModalBody'
import crossIcon from '../../../../../assets/images/cross.svg'
import Text from 'components/Text'

function PublishEvent({ t, isPublishEventModalOpen, setIsPublishEventModalOpen, publishedEventConfirm }) {

    return (
        <>
            <Modal
                isOpen={isPublishEventModalOpen}
                toggle={() => setIsPublishEventModalOpen(false)}
                className={"modal-dialog-centered "}
                modalClassName='custom-modal'>
                <span className='close-btn' onClick={() => setIsPublishEventModalOpen(false)}>
                    <img src={crossIcon} alt='close' />
                </span>

                <ModalBody className="text-center">
                    <Text
                        size='25px'
                        marginBottom="10px"
                        weight='500'
                        color='#111b45' >
                <span className='modal-title-25'> 
                        {t("scheduler.publishEvent")}</span>
                    </Text>
                    <Text
                        size='16px'
                        weight='300'
                        color='#535b5f'
                    >
                        {t("scheduler.publishTheEventDesc")}
                    </Text>
                    <Text
                        size='16px'
                        marginBottom="40px"
                        weight='300'
                        color='#535b5f'
                    >
                        {t("scheduler.areYouSureYouWantToPublishTheEvent")}
                    </Text>
                    <button className="button button-round button-shadow mr-md-4 mb-3 w-sm-100"
                        onClick={publishedEventConfirm}
                        title={t("scheduler.publishEvent")}>
                        {t("scheduler.publish")}
                    </button>
                    <button className="button btn-mobile-link button-round button-border button-dark "
                        onClick={() => setIsPublishEventModalOpen(false)}
                        title={t('cancel')}>
                        {t('cancel')}
                    </button>
                </ModalBody>
            </Modal>
        </>
    )
}

export default withTranslation()(PublishEvent)