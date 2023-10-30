import React, { Fragment } from 'react'
import { withTranslation } from 'react-i18next'
import 'rc-time-picker/assets/index.css'
import { Modal } from 'reactstrap'
import ModalBody from 'reactstrap/lib/ModalBody'
import crossIcon from '../../../../../assets/images/cross.svg'
import Text from 'components/Text'
import styles from "../../EventDetails.module.scss";
import moment from 'moment'
import constants from '../../../../../constants'



          
function DeleteEventModal({ t, specficTimeList, setSpecficDates, acceptEvent , isSelectedRequestedEvent  }) {
    return (
        <>
            <Modal
                isOpen={true}
                toggle={() => setSpecficDates({})}
                className={"modal-dialog-centered modal-width-660"}
                modalClassName='custom-modal'>
                <span className='close-btn' onClick={() => setSpecficDates({})}>
                    <img src={crossIcon} alt='close' />
                </span>

                <ModalBody className="text-left">
                    <Text
                        size='25px'
                        marginBottom="10px"
                        weight='500'
                        color='#111b45' >
                  <span className='modal-title-25'> 
                        {t("accountOwner.specificDates")}</span>
                    </Text>
                  <ul className={styles["modal-employee-list_ul"]} >
                    {
                        specficTimeList?.eventRequestToJoinSpecificDates?.map((item,index) =>
                            <li key={index}>{moment(item.selectedDate).format("Do MMMM, YYYY")}</li>

                        )
                    }
                  </ul>
                  {
                    specficTimeList.status === constants.SCHEDULERSTATUS.PENDING &&
                    <Fragment>
                    <button className="button button-round button-shadow mr-md-4 mb-3 w-sm-100" title={t("accept")} onClick={()=>acceptEvent()}>
                         {t('accept')}
                    </button>
                    <button className="button button-round button-border btn-mobile-link button-dark "
                        onClick={() => setSpecficDates({
                                ...specficTimeList,
                                type: constants.SCHEDULEREVENTTYPE.REJECT,
                        })}
                        title={t('decline')}>
                             {t('decline')}
                    </button>
                    </Fragment>
                  }
                </ModalBody>
            </Modal>
        </>
    )
}

export default withTranslation()(DeleteEventModal)