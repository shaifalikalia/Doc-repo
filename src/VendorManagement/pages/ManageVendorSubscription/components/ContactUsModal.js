
import React from 'react'
import { withTranslation } from 'react-i18next'
import 'rc-time-picker/assets/index.css'
import './../../ManageVendorSubscription/VendorSubscription.scss'
import crossIcon from '../../../../assets/images/cross.svg'
import Text from 'components/Text';
import { Col, Modal, ModalBody, Row } from 'reactstrap';

const ContactUsModal = ({ t, isContactUsModalOpen, setIsContactUsModalOpen }) => {
    const closeContactUsModal = () => setIsContactUsModalOpen(false);
    return (
        <Modal
            isOpen={isContactUsModalOpen}
            toggle={closeContactUsModal}
            className="modal-dialog-centered contact-us-modal terminate-modal modal-width-660" modalClassName='custom-modal' >
            <span className='close-btn' onClick={closeContactUsModal}  >
                <img src={crossIcon} alt='close' />
            </span>
            <ModalBody>
                <div className='modal-custom-title title-location-center mw-100 '>
                    <Text
                        size='25px'
                        weight='500'
                        color='#111b45' >
                        <span className='modal-title-25'>
                            {t('vendorManagement.enterprisePlan')}</span>
                    </Text>
                </div>
                <Text
                    size='16px'

                    weight='300'
                    color=' #535b5f' >
                    {t('vendorManagement.pleaseContactSales')}
                </Text>

                <Row>
                    <Col md="5">
                        <div className='d-flex '>
                            <span className='image-container1'><img src={require('assets/images/round-email.svg').default} alt="img" /></span>
                            <div className='text-left'><div className='heading'> {t('vendorManagement.emailAddress')}</div>
                                <div className='information'>{t('vendorManagement.emailAddressDetail')}</div></div>
                        </div>
                    </Col>
                    <Col md="7">
                        <div className='d-flex'>
                            <span className='image-container2'><img src={require('assets/images/round-phone.svg').default} alt="img" /></span>
                            <div className='text-left'><div className='heading'> {t('vendorManagement.phoneNumber')}</div>
                                <div className='information'>1 (877) 747-3615</div></div>
                        </div>
                    </Col>
                </Row>
                <div className='btn-box'>
                    <button className="button button-round button-border btn-mobile-link button-dark contact-btn"
                        title={t('vendorManagement.close')} onClick={closeContactUsModal} >
                        {t('vendorManagement.close')}
                    </button>
                </div>
            </ModalBody>
        </Modal>

    );
};

export default withTranslation()(ContactUsModal);