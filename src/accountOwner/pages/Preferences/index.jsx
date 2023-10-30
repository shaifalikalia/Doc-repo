import React, { useEffect, useState } from 'react';
import Page from 'components/Page';
import styles from './Preferences.module.scss';
import { withTranslation } from 'react-i18next';
import constants from './../../../constants'
import Accordion from './Accordion';
import StaticIPPreference from './StaticIPPreference';
import { useIPs } from 'repositories/static-ip-repository';
import GeoFencePreference from './GeoFencePreference';
import { useGeocoordinate } from 'repositories/geo-fence-repository';
import { useOfficeDetail, useUpdateTimesheetAndNotificationPreferenceMutation, useUpdateClockInClockOutPreferenceMutation } from 'repositories/office-repository';
import toast from 'react-hot-toast';
import IsTimesheetFromMobileStaticIP from './IsTimesheetFromMobileStaticIP';
import IsClockInClockOut from './IsClockInClockOut';
import { decodeId, encodeId } from 'utils';

function TimesheetPreferences({ history, match, t }) {
    const officeId = decodeId(match.params.officeId)
    const [preferenceSelected, setPreferenceSelected] = useState(timesheetPreferences.none)
    const [isStaticIPPreferenceChecked, setIsStaticIPPreferenceChecked] = useState(false)
    const [isGeoFencePreferenceChecked, setIsGeoFencePreferenceChecked] = useState(false)
    const [isTimesheetFromMobileChecked, setIsTimesheetFromMobileChecked] = useState(false)
    const [isClockInClockOutChecked, setIsClockInClockOutChecked] = useState(false)
    const [shouldUpdatePreferences, setShouldUpdatePreferences] = useState(false)
    const [staticIPErrorMessage, setStaticIPErrorMessage] = useState('')
    const [geoFenceErrorMessage, setGeoFenceErrorMessage] = useState('')
    const [fromMobileErrorMessage, setFromMobileErrorMessage] = useState('')
    const [clockInclockOutErrorMessage, setClockInclockOutErrorMessage] = useState('')

    const { isLoading: isLoadingOfficeDetail, isFetching: isFetchingOfficeDetail, data: officeDetail } = useOfficeDetail(officeId)
    const { isLoading: isLoadingIPs, isFetching: isFetchingIPs, data: IPs } = useIPs(officeId)
    const { isLoading: isLoadingGeocoordinate, isFetching: isFetchingGeocoordinate, data: geocoordinate } = useGeocoordinate(officeId)

    const updateTimesheetPreferenceMutation = useUpdateTimesheetAndNotificationPreferenceMutation()
    const updateClockInClockOutPreferenceMutation = useUpdateClockInClockOutPreferenceMutation()

    useEffect(() => {
        if (officeDetail) {
            setPreferenceSelected(officeDetail.isTimesheetPreferenceTypeOnPremises ? timesheetPreferences.onPremise : timesheetPreferences.basic)
            setIsGeoFencePreferenceChecked(officeDetail.isTypeGeocoordinate)
            setIsStaticIPPreferenceChecked(officeDetail.isTypeStaticIP)
            setIsTimesheetFromMobileChecked(officeDetail.isTimesheetFromMobileStaticIPAllowed)
            setIsClockInClockOutChecked(officeDetail.isClockInOutOn ? officeDetail.isClockInOutOn : false)
        }
    }, [officeDetail])

    useEffect(() => {
        if (shouldUpdatePreferences) {
            updateTimesheetPreference()
            setShouldUpdatePreferences(false)
        }
        // eslint-disable-next-line
    }, [shouldUpdatePreferences])

    const updateTimesheetPreference = async () => {
        let payload = {
            officeId,
            isCovidFormFillNotificationOn: officeDetail.isCovidFormFillNotificationOn,
            isTimesheetFillNotificationOn: officeDetail.isTimesheetFillNotificationOn,
        }
        try {
            if (preferenceSelected === timesheetPreferences.basic && officeDetail.isTimesheetPreferenceTypeOnPremises) {
                payload = {
                    ...payload,
                    isTimesheetPreferenceTypeOnPremises: false,
                    isTypeStaticIP: false,
                    isTypeGeocoordinate: false,
                    isTimesheetFromMobileStaticIPAllowed: false
                }
            } else if (isStaticIPPreferenceChecked !== officeDetail.isTypeStaticIP) {
                payload = {
                    ...payload,
                    isTimesheetPreferenceTypeOnPremises: (isStaticIPPreferenceChecked || officeDetail.isTimesheetFromMobileStaticIPAllowed || officeDetail.isTypeGeocoordinate) ? true : false,
                    isTypeStaticIP: isStaticIPPreferenceChecked,
                    isTypeGeocoordinate: officeDetail.isTypeGeocoordinate,
                    isTimesheetFromMobileStaticIPAllowed: officeDetail.isTimesheetFromMobileStaticIPAllowed

                }
            } else if (isGeoFencePreferenceChecked !== officeDetail.isTypeGeocoordinate) {
                payload = {
                    ...payload,
                    isTimesheetPreferenceTypeOnPremises: (officeDetail.isTypeStaticIP || officeDetail.isTimesheetFromMobileStaticIPAllowed || isGeoFencePreferenceChecked) ? true : false,
                    isTypeStaticIP: officeDetail.isTypeStaticIP,
                    isTypeGeocoordinate: isGeoFencePreferenceChecked,
                    isTimesheetFromMobileStaticIPAllowed: officeDetail.isTimesheetFromMobileStaticIPAllowed

                }
            } else if (isTimesheetFromMobileChecked !== officeDetail.isTimesheetFromMobileStaticIPAllowed) {
                payload = {
                    ...payload,
                    isTimesheetPreferenceTypeOnPremises: (officeDetail.isTypeStaticIP || officeDetail.isTypeGeocoordinate || isTimesheetFromMobileChecked) ? true : false,
                    isTypeGeocoordinate: officeDetail.isTypeGeocoordinate,
                    isTypeStaticIP: officeDetail.isTypeStaticIP,
                    isTimesheetFromMobileStaticIPAllowed: isTimesheetFromMobileChecked
                }
            } else {
                return
            }
            if (!payload.isTypeStaticIP && !payload.isTypeGeocoordinate) {
                updateClockInClockOutPreferences(false);
            }
            await updateTimesheetPreferenceMutation.mutateAsync(payload)
            toast.success(t('accountOwner.preferencesUpdatedSuccessfully'))
        } catch (e) {
            toast.error(e.message)
        }
    }

    const onGeoFenceCheckChange = (value) => {
        if (value && !geocoordinate) {
            setGeoFenceErrorMessage(t('accountOwner.geoFenceNotDefinedErrorMessage'))
            return
        }
        setIsGeoFencePreferenceChecked(value)
        setGeoFenceErrorMessage('')
        setShouldUpdatePreferences(true)
    }

    const onFromMobileCheckChange = (value) => {
        if (value && !IPs?.find(it => it.isActive)) {
            setFromMobileErrorMessage(t('accountOwner.staticIPMobileNotAddedErrorMessage'))
            return
        }
        setIsTimesheetFromMobileChecked(value)
        setFromMobileErrorMessage('')
        setShouldUpdatePreferences(true)
    }
    const onClockCheckChange = (value) => {
        if (value && !(isStaticIPPreferenceChecked || isGeoFencePreferenceChecked)) {
            setClockInclockOutErrorMessage(t('accountOwner.clockInclockOutErrorMessage'))
            return
        }
        setIsClockInClockOutChecked(value)
        setClockInclockOutErrorMessage('')
        updateClockInClockOutPreferences(value, true);
    }

    const updateClockInClockOutPreferences = async (value, showToast = false) => {
        let payload = {
            officeId,
            isClockInOutOn: value
        }

        await updateClockInClockOutPreferenceMutation.mutateAsync(payload)
        if (showToast) { toast.success(t('accountOwner.clockInpreferencesUpdatedSuccessfully')); }
    }

    const onStaticIPCheckChange = (value) => {
        if (value && !IPs?.find(it => it.isActive)) {
            setStaticIPErrorMessage(t('accountOwner.staticIPNotAddedErrorMessage'))
            return
        }
        setIsStaticIPPreferenceChecked(value)
        setStaticIPErrorMessage('')
        setShouldUpdatePreferences(true)
    }

    const isGeoCoordinateDefined = () => {
        if (isLoadingGeocoordinate || isFetchingGeocoordinate) {
            return false
        }

        if (geocoordinate) {
            return true
        }

        return false
    }

    const shouldRenderLoader = () => (
        isLoadingOfficeDetail || isFetchingOfficeDetail ||
        isLoadingIPs || isFetchingIPs ||
        isLoadingGeocoordinate || isFetchingGeocoordinate ||
        updateTimesheetPreferenceMutation.isLoading
    )

    const isAccordionDisabled = () => (
        isLoadingOfficeDetail || isLoadingIPs || isLoadingGeocoordinate || preferenceSelected !== timesheetPreferences.onPremise
    )

    return (
        <Page
            onBack={() => history.push(constants.routes.accountOwner.officeOptions.replace(':officeId', encodeId(officeId)))}
            isTitleLoading={isLoadingOfficeDetail}
            title={officeDetail && officeDetail.name}>
            <div className={styles['page-subheading']}>{t('accountOwner.timesheetSubmissionPreferences')}</div>

            {officeDetail && (!officeDetail.isActive || officeDetail.isForcedDisabled) && (
                <div className={`alert alert-warning ${styles['warning-alert']}`}>
                    {t('accountOwner.deactivatedOfficePreferenceMessage')}
                </div>
            )}

            <div className={styles['card']}>

                {shouldRenderLoader() && <div className={`${styles['loader-position']} loader`} />}

                <div className='ch-radio'>
                    <label >
                        <input
                            type='radio'
                            name='timesheetPreference'
                            disabled={shouldRenderLoader()}
                            checked={preferenceSelected === timesheetPreferences.basic}
                            onClick={() => {
                                setPreferenceSelected(timesheetPreferences.basic)
                                setShouldUpdatePreferences(true)
                            }} />
                        <span className={styles['title']}>
                            <strong className='d-block'>{t('accountOwner.basic')}</strong>
                            {t('accountOwner.basicDescription')}
                        </span>
                    </label>
                </div>

                <div className='ch-radio'>
                    <label>
                        <input
                            type='radio'
                            name='timesheetPreference'
                            disabled={shouldRenderLoader()}
                            checked={preferenceSelected === timesheetPreferences.onPremise}
                            onClick={() => setPreferenceSelected(timesheetPreferences.onPremise)} />
                        <span className={styles['title']}>
                            <strong className='d-block'>{t('accountOwner.onPremise')}</strong>
                            {t('accountOwner.onPremiseDescription')}
                        </span>
                    </label>
                </div>

                <div className='mb-2'>
                    <Accordion
                        isDisabled={isAccordionDisabled()}
                        isCheckboxDisabled={shouldRenderLoader()}
                        isChecked={isGeoFencePreferenceChecked}
                        title={t('accountOwner.geoFencing')}
                        errorMessage={geoFenceErrorMessage}
                        onCheckChange={onGeoFenceCheckChange}>

                         <GeoFencePreference
                            isDisabled={isAccordionDisabled()}
                            isLoadingGeocoordinate={isLoadingGeocoordinate || isFetchingGeocoordinate}
                            isGeoFenceDefined={isGeoCoordinateDefined()}
                            onDefineGeoFence={() => history.push(constants.routes.accountOwner.geoFence.replace(':officeId', encodeId(officeId)))}
                            t={t} />

                    </Accordion>
                </div>

                <div>
                    <Accordion
                        isDisabled={isAccordionDisabled()}
                        isAccordionDisabled={isAccordionDisabled()}
                        isCheckboxDisabled={shouldRenderLoader()}
                        isChecked={isStaticIPPreferenceChecked}
                        title={t('accountOwner.staticIP')}
                        errorMessage={staticIPErrorMessage}
                        onCheckChange={onStaticIPCheckChange}>

                        <StaticIPPreference
                            isDisabled={isAccordionDisabled()}
                            officeId={officeId}
                            IPs={IPs || []}
                            t={t} />

                    </Accordion>
                </div>

                <div className='mb-2'>
                    <Accordion
                        isDisabled={isAccordionDisabled()}
                        isAccordionDisabled={isAccordionDisabled()}
                        isCheckboxDisabled={shouldRenderLoader()}
                        isChecked={isTimesheetFromMobileChecked}
                        title={t('accountOwner.staticIPonMobile')}
                        errorMessage={fromMobileErrorMessage}
                        onCheckChange={onFromMobileCheckChange}>
                        <IsTimesheetFromMobileStaticIP
                            t={t} />

                    </Accordion>
                </div>
                <div>
                    <Accordion
                        isDisabled={isAccordionDisabled()}
                        isAccordionDisabled={isAccordionDisabled()}
                        isCheckboxDisabled={shouldRenderLoader()}
                        isChecked={isClockInClockOutChecked}
                        errorMessage={clockInclockOutErrorMessage}
                        title={t('accountOwner.clockInClockOut')}
                        onCheckChange={onClockCheckChange}>
                        <IsClockInClockOut
                            t={t} />

                    </Accordion>
                </div>
            </div>
        </Page>
    )
}

const timesheetPreferences = {
    // Just for loading state, so no option is shown as selected when data is loading
    none: 'none',

    basic: 'basic',
    onPremise: 'on-premise'
}

export default withTranslation()(TimesheetPreferences)

