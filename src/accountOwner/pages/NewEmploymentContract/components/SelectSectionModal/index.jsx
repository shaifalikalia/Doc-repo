import React from 'react';
import { Modal, ModalBody } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import crossIcon from './../../../../../assets/images/cross.svg';
import Text from 'components/Text'
import "./SelectSectionModal.scss"

function SelectSectionModal({ isModalOpen, closeModal, fieldList, setSelectedVal, saveSelection, t }) {
  return (
    <Modal
      isOpen={isModalOpen}
      toggle={closeModal}
      className='modal-dialog-centered select-sec-modal'
      modalClassName='custom-modal'>
      <span className='close-btn' onClick={closeModal}>
        <img src={crossIcon} alt='close' />
      </span>
      <ModalBody>
        <Text
          size='25px'
          marginBottom="10px"
          weight='500'
          color='#111b45' >
     <span className='modal-title-25'>      {t('contracts.selectSection')}</span>
        </Text>
        <ul className="section-list">
          {fieldList.map((data, key) => (
            <li key={key}>
              <div className='ch-radio'>
                <label>
                  <input type='radio' name="selectLabel" onClick={() => setSelectedVal(data)} />
                  <span> {data.title}</span>
                </label>
              </div>
            </li>
          ))}
        </ul>

        <div className="btn-box d-md-flex">
          <button className="button button-round button-shadow mr-md-4 mb-3 w-sm-100"
            title={t('save')} onClick={saveSelection}>
            {t('save')}
          </button>
          <button className="mb-md-3 button button-round button-border btn-mobile-link button-dark "
            title={t('cancel')} onClick={closeModal}>
            {t('cancel')}
          </button>
        </div>
      </ModalBody>
    </Modal>

  )
}

export default withTranslation()(SelectSectionModal);
