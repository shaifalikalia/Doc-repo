import React from 'react';
import { Modal, ModalBody } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import crossIcon from './../../../../../assets/images/cross.svg';
import Text from 'components/Text'
import "./SaveTemplateModal.scss"

function SaveTemplateModal({ isModalOpen, closeModal, saveContractTemplate, t }) {

  return (
    <Modal isOpen={isModalOpen}
      toggle={closeModal}
      className="modal-dialog-centered  delete-modal" modalClassName="custom-modal" >
      <span className='close-btn' onClick={closeModal}>
        <img src={crossIcon} alt='close' />
      </span>
      <ModalBody>
        <Text
          size='25px'
          marginBottom="10px"
          weight='500'
          color='#111b45' >
        <span className='modal-title-25'>   {t('contracts.saveTemplate')}</span>
        </Text>
        <Text
          size='16px'
          marginBottom="35px"
          weight='300'
          color=' #535b5f' >
          {t('contracts.saveTemplateDesc')}
        </Text>

        <div className="btn-box d-md-flex">
          <button className="button button-round button-shadow mr-md-4 mb-3 w-sm-100"
            title={t('save')} onClick={saveContractTemplate}>
            {t('save')}
          </button>
          <button className="mb-md-3 button button-round button-border button-dark btn-mobile-link"
            title={t('cancel')} onClick={closeModal}>
            {t('cancel')}
          </button>
        </div>
      </ModalBody>
    </Modal>

  )
}

export default withTranslation()(SaveTemplateModal);
