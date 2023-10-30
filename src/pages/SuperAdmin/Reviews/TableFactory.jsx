import React from 'react'
import AllReviews from './Tables/AllReviews'
import Doctors from './Tables/Doctors'
import Patients from './Tables/Patients'
import useTabIndex from './useTabIndex'

export default function TableFactory() {
    const tab = useTabIndex()

    switch (tab) {
        case 1:
            return <AllReviews />
        case 2:
            return <Patients />
        case 3:
            return <Doctors />
        default:
            return null
    }
}