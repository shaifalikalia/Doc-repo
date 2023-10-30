import React, { useEffect, useRef, useState } from 'react'
import { Wrapper, Status } from '@googlemaps/react-wrapper'
import styles from './DefineGeoFence.module.scss'
import { withTranslation } from 'react-i18next'

const DEFAULT_ZOOM = 14
const POLYGON_OPTIONS = {
    fillColor: "#ee4f4f",
    fillOpacity: 0.5,
    strokeWeight: 2,
    strokeColor: '#ee4f4f', 
    clickable: false,
    editable: false,
    zIndex: 1,
}

function Map({ centerLatLng, polygonCoords, onPolygonSet, t , children }) {
    const ref = useRef()
    const [map, setMap] = useState(null)
    const [drawingManager, setDrawingManager] = useState(null)
    const [polygon, setPolygon] = useState(null)

    // eslint-disable-next-line
    useEffect(() => {
        if (map === null) {
            const _map = initMap()
            const _drawingManager = initDrawingManager(_map)
            
            setDrawingManager(_drawingManager)
            setMap(_map)
        }
    })

    useEffect(() => {
        if (drawingManager !== null && drawingManager) {
            addEventListener(drawingManager)
        }
    // eslint-disable-next-line
    }, [drawingManager])

    useEffect(() => {
        if (polygonCoords !== null && polygon === null && map !== null) {
            const _polygon = new window.google.maps.Polygon({
                paths: polygonCoords,
                ...POLYGON_OPTIONS
            })
            setPolygon(_polygon)
            _polygon.setMap(map)
        }
    // eslint-disable-next-line
    }, [polygonCoords, map])

    useEffect(() => {
        if (centerLatLng && map !== null) {
            map.setCenter(centerLatLng)
        }
    }, [centerLatLng, map])

    useEffect(() => {
        if (polygon !== null && drawingManager !== null && drawingManager.drawingControl) {
            drawingManager.setOptions({
                drawingMode: null,
                drawingControl: false
            })
        }
    }, [polygon, drawingManager])

    const initMap = () => {
        return new window.google.maps.Map(ref.current, { 
            zoom: DEFAULT_ZOOM,
            streetViewControl: false,
            mapTypeControl: true,
            mapTypeControlOptions: {
              style: window.google.maps.MapTypeControlStyle.DROPDOWN_MENU
            }
        })
    }

    const initDrawingManager = (_map) => {
        if(window?.google?.maps?.drawing?.DrawingManager){
            const _drawingManager = new window.google.maps.drawing.DrawingManager({
                drawingControl: true,
                drawingControlOptions: {
                    position: window.google.maps.ControlPosition.TOP_CENTER,
                    drawingModes: [
                        window.google.maps.drawing.OverlayType.POLYGON,
                    ],
                },
                polygonOptions: POLYGON_OPTIONS,
            })
            
            _drawingManager.setMap(_map)
            return _drawingManager
        }
    }

    const addEventListener = (_drawingManager) => {
        window.google.maps.event.addListener(_drawingManager, 'overlaycomplete', onOverlayComplete)
    }

    const onOverlayComplete = (e) => {
        setPolygon(e.overlay)
        onPolygonSet(getPolygonCoordinates(e.overlay))
    }

    const getPolygonCoordinates = (_polygon) => {
        const coords = []
        const paths = _polygon.getPaths()
        paths.forEach(path => {
            path.forEach(latLng => {
                coords.push({ lat: latLng.lat(), lng: latLng.lng() })
            })
        })

        return coords
    }

    const reset = () => {
        drawingManager.setOptions({
            drawingControl: true
        })
        polygon.setMap(null)
        setPolygon(null)
        onPolygonSet(null)
    }

    const moveToCenter = () => {
        map.setCenter(centerLatLng)
        map.setZoom(DEFAULT_ZOOM)
    }

    return (
        <div className='d-flex flex-column h-100'>
            <div ref={ref} id='map' className={styles['map']} />
            {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
                return React.cloneElement(child, { map });
            }
            })}

            <div className='d-sm-flex text-center align-items-center my-1'>
                <button
                    className={"mr-2 " + styles['map-action-button']}
                    disabled={!map || !centerLatLng}
                    onClick={moveToCenter}>
                    {t('accountOwner.moveToOfficeLocation')}
                </button>
                <button
                    className={styles['map-action-button']}
                    disabled={polygon === null} 
                    onClick={reset}>
                    {t('accountOwner.clearGeoFencingArea')}
                </button>
            </div>
        </div>
    )
}

function MapWrapper(props) {
    return (
        <Wrapper
            apiKey={process.env.REACT_APP_GOOGLE_API_KEY}
            libraries={['drawing','places']}
            render={renderMapStatus}>
            <Map {...props} />
        </Wrapper>
    )
}

function renderMapStatus(status) {
    if (status === Status.LOADING) return 'Loading Map...'
    if (status === Status.FAILURE) return 'Error loading Map.'
    return null
}

export default withTranslation()(MapWrapper)