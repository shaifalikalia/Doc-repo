import React from 'react'
import { withTranslation } from 'react-i18next'
import 'rc-time-picker/assets/index.css'
import { Modal } from 'reactstrap'
import ModalBody from 'reactstrap/lib/ModalBody'
import Text from 'components/Text'
import { MsalAuthProvider } from 'react-aad-msal';
import { config, parameters, options } from 'services/authProvider'


function AdminAccept({ isOpen, t }) {

    const logout = () => {
        try {
            localStorage.clear();
            sessionStorage.clear();
            new MsalAuthProvider(config, parameters, options).logout()
        } catch (error) {
            console.warn(error)   
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            className={"modal-dialog-centered modal-width-660 vendor-delete-office-modal"}
            modalClassName='custom-modal'>
            <ModalBody className={"text-center px-md-4"}>
                <Text
                    size='25px'
                    marginBottom="10px"
                    weight='500'
                    color='#111b45' >
                    {t('accountUnderReview')}
                </Text>
                <Text
                    size='16px'
                    marginBottom="35px"
                    weight='300'
                    color='#535B5F' >
                    {t('accountUnderReviewContent')}
                </Text>
                <button className="button button-round button-shadow mr-md-3 w-sm-100 md-2" onClick={logout}>
                    {t('logout')}
                </button>
            </ModalBody>
        </Modal>
    )
}


export default withTranslation()(AdminAccept)
