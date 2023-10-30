import React from 'react'
import { withTranslation } from 'react-i18next'
import Text from 'components/Text'
import styles from '../DoctorDetail.module.scss'
import appointmentIcon from './../../../../assets/images/appointment-booked-icon.svg'
import googlePlay from './../../../../assets/images/google-play.svg'
import appStore from './../../../../assets/images/apple.svg'
import constants from '../../../../constants'
function AppointmemtBooked({ t }) {
    return (
        <div className={styles['appointment-booked']}>
            <Text
                secondary
                size='16px'
                weight='600'
                marginBottom='30px'>
                {t('patient.appointmentBooked')}
            </Text>

            <img src={appointmentIcon} alt='appointmentIcon' />

            <Text
                color='#6f7788'
                size='12px'
                weight='400'
                marginTop='20px'
                marginBottom='20px'>
                {t('patient.appointmentBookedDesc')}
            </Text>

            <div className={'d-sm-flex justify-content-between ' + styles['download-app']}>
                <div className={styles['img-box']}>
                    <a href={constants.appLinks.patientAndroidAppStoreLink} target='_blank' rel="noreferrer">
                        <img src={googlePlay} alt='googlePlay' rel="noopener noreferrer" />
                    </a>
                </div>
                <div className={styles['img-box']}>
                    <a href={constants.appLinks.patientIosAppStoreLink} target='_blank' rel="noopener noreferrer">
                        <img src={appStore} alt='appStore' />
                    </a>
                </div>
            </div>
        </div>
    )
}

export default withTranslation()(AppointmemtBooked)