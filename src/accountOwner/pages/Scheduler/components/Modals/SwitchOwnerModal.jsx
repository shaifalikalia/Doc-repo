import React, { useState , useContext, useEffect } from 'react'
import { Store } from 'containers/routes'
import { useSelector } from "react-redux";
import { withTranslation } from 'react-i18next'
import 'rc-time-picker/assets/index.css'
import { Modal } from 'reactstrap'
import ModalBody from 'reactstrap/lib/ModalBody'
import Text from 'components/Text'
import styles from "./Modals.module.scss";
import crossIcon from './../../../../../assets/images/cross.svg'
import { isEqual } from 'lodash'
import constants from '../../../../../constants';


function SwitchOwnerModal({ subTitle, t, showSwitchOwnerModal, setShowSwitchOwnerModal, ownerList, selectedOwner, setSelectedOwner, resetAgendaFilters, resetStaffAvailFilters }) {
    const [selectedVal, setSelectedVal] = useState(selectedOwner);
    const { setIsSubscriptionModel } = useContext(Store)
    const modulesAccess = useSelector(prev => prev)

    useEffect(() => {
        if (selectedOwner?.id) {
            setSelectedVal(selectedOwner)
        }
    }, [selectedOwner])
    

    return (
        <>
            <Modal
                isOpen={showSwitchOwnerModal}
                toggle={() => setShowSwitchOwnerModal(false)}
                className={'modal-dialog-centered modal-width-660 ' + styles['change-schedule-modal-dialog']}
                modalClassName='custom-modal'>
                <span className='close-btn' onClick={() => setShowSwitchOwnerModal(false)}>
                    <img src={crossIcon} alt='close' />
                </span>
                <ModalBody>
                    <Text
                        size='25px'
                        marginBottom="10px"
                        weight='500'
                        color='#111b45' >
                  <span className='modal-title-25'> 
                        {t("staff.selectAccountOwner")}</span>
                    </Text>
                    {subTitle && <Text
                        size='16px'
                        marginTop="-10px"
                        marginBottom="10px"
                        weight='400'
                        color='#111b45' >
                        {subTitle}
                    </Text>}
                    <ul className={styles["change-list"]}>
                        {ownerList && ownerList.length > 0 && ownerList.map((item, key) => (
                            <li key={key}>
                                <div className='ch-radio'>
                                    <label className="mr-5">
                                        <input 
                                            type='radio' 
                                            readOnly 
                                            onClick={() => setSelectedVal(item)} 
                                            checked={selectedVal ? item?.id === selectedVal?.id : item?.id === selectedOwner?.id} 
                                            name='blockTimeslotAallDoctors' />
                                        <span>{item.firstName} {item.lastName} </span>
                                    </label>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <button className="button button-round button-shadow mr-md-4 mb-3 w-sm-100"
                        title={t("apply")}
                        onClick={() => {

                            const selectedOwnerSubscription = modulesAccess?.Subscription.find((subscription) => subscription.ownerId === selectedVal.id)
                            let canAccessModule;
                    
                            if (selectedOwnerSubscription && selectedOwnerSubscription.planFeature) {
                                canAccessModule = selectedOwnerSubscription?.planFeature?.find((plan) => (plan?.id === constants.moduleNameWithId.teamLiveChat) && plan?.isAvailable)
                            } else {
                                canAccessModule = true
                            }

                            if (!canAccessModule) {
                                setIsSubscriptionModel(true)
                                return;
                            }

                            if(selectedVal && !isEqual(selectedOwner, selectedVal)){
                                resetAgendaFilters?.();
                                resetStaffAvailFilters?.();
                            }
                            setSelectedOwner(selectedVal);
                            setShowSwitchOwnerModal(false);
                            setSelectedVal(null);
                        }}>
                        {t("apply")}
                    </button>
                    <button className="button button-round button-border button-dark btn-mobile-link "
                        onClick={() => {
                            setShowSwitchOwnerModal(false);
                            setSelectedVal(null);
                        }}
                        title={t('cancel')}>
                        {t('cancel')}
                    </button>
                </ModalBody>
            </Modal>
        </>
    )
}

export default withTranslation()(SwitchOwnerModal)