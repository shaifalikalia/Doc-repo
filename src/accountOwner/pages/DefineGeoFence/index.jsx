import React, { useEffect, useState } from 'react'
import Page from 'components/Page'
import styles from './DefineGeoFence.module.scss'
import { withTranslation } from 'react-i18next'
import constants from './../../../constants'
import Button from 'components/Button'
import CustomMap from './Map'
import Marker from './Marker'
import { useOfficeDetail } from 'repositories/office-repository'
import Toast from 'components/Toast/Alert'
import { useAddGeocoordinateMutation, useGeocoordinate, useUpdateGeocoordinateMutation } from 'repositories/geo-fence-repository'
import toast from 'react-hot-toast'
import { useLatLng } from 'repositories/geocode-repository'
import { decodeId, encodeId } from 'utils'

function DefineGeoFence({ match, history, t }) {
    const officeId = decodeId(match.params.officeId)
    const goBack = () => history.push(constants.routes.accountOwner.preferences.replace(':officeId', encodeId(officeId)))

    const [polygonCoords, setPolygonCoords] = useState(null)
    const [centerLatLng, setCenterLatLng] = useState(null)

    const { isLoading: isLoadingOfficeDetail, data: officeDetail, error: officeDetailError } = useOfficeDetail(officeId)
    const { isLoading: isLoadingGeocoordinates, data: geocoordinates } = useGeocoordinate(officeId)
    const { data: latLng } = useLatLng((officeDetail && officeDetail.address) || '')
    
    useEffect(() => {
        if (officeDetail && centerLatLng === null && !isLoadingGeocoordinates) {

                setCenterLatLng({ lat: officeDetail.state.latitude, lng: officeDetail.state.longitude })
        }
        // eslint-disable-next-line
    }, [officeDetail, isLoadingGeocoordinates])

    useEffect(() => {
        if (latLng && !isLoadingGeocoordinates && !geocoordinates) {
            setCenterLatLng(latLng)
        }
        // eslint-disable-next-line
    }, [latLng, isLoadingGeocoordinates])

    useEffect(() => {
        if (geocoordinates) {
            setPolygonCoords(JSON.parse(geocoordinates.geocoordinate))
        }
    }, [geocoordinates])

    const addGeocoordinateMutation = useAddGeocoordinateMutation()
    const updateGeocoordinateMutation = useUpdateGeocoordinateMutation()

    const onSave = async () => {
        const coords = JSON.stringify(polygonCoords)
        try {
            if (geocoordinates) {
                await updateGeocoordinateMutation.mutateAsync({ officeId, geocoordinateId: geocoordinates.id, geocoordinate: coords })
            } else {
                await addGeocoordinateMutation.mutateAsync({ officeId, geocoordinate: coords })
            }
            // setCenterLatLng(polygonCoords[0])
            toast.success(t('accountOwner.geoFenceAreaUpdateSuccessfully'))
        } catch (e) {
            toast.error(e.message)
        }
    }

    return (
        <Page
            onBack={goBack}
            isTitleLoading={isLoadingOfficeDetail}
            title={officeDetail && officeDetail.name}>

            {officeDetailError && <Toast errorToast message={officeDetailError.message} />}

            <div>
            <ul className={styles['instructions']}>
                <li>{t('accountOwner.geoFenceInstructionStep1')}</li>
                <li>{t('accountOwner.geoFenceInstructionStep2')}</li>
                <li>{t('accountOwner.geoFenceInstructionStep3')}</li>
                <li>{t('accountOwner.geoFenceInstructionStep4')}</li>
            </ul>
            </div>

            <div className={styles['card']}>

                <div className={styles['map-container']}>
                <CustomMap
                        centerLatLng={centerLatLng}
                        polygonCoords={polygonCoords}
                        onPolygonSet={setPolygonCoords} >                  

                        <Marker position={centerLatLng} />

                    </CustomMap>              
                </div>

                <div className={styles['button-container']}>
                    <Button 
                        disabled={polygonCoords === null || addGeocoordinateMutation.isLoading || updateGeocoordinateMutation.isLoading}
                        className={styles['save-button']}
                        onClick={onSave}>
                        {t('UpdateGeofencing')}
                    </Button>
                    <Button 
                        onClick={goBack}
                        borderedSecondary>
                        {t('close')}
                    </Button>
                </div>
            </div>
        </Page>
    )
}

export default  withTranslation()(DefineGeoFence)

