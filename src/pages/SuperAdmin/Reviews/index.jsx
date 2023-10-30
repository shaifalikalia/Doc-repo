import Page from 'components/Page'
import constants from './../../../constants'
import React from 'react'
import { Link } from 'react-router-dom'
import useTabIndex from './useTabIndex'
import qs from 'query-string'
import FilterFactory from './FilterFactory'
import TableFactory from './TableFactory'
import styles from './Reviews.module.scss'
import { withTranslation } from 'react-i18next'

const tabs = [
    {
        titleKey: 'superAdmin.recentlyAdded',
        index: 1,
    },
    {
        titleKey: 'superAdmin.patients',
        index: 2,
    },
    {
        titleKey: 'superAdmin.doctors',
        index: 3,
    }
]

function Reviews({ t }) {
    const tab = useTabIndex()

    return (
        <Page
            titleKey='superAdmin.manageReviewsAndRatings'>
                
            <div className='d-flex flex-row justify-content-between align-items-end'>

                <div className='d-flex flex-row'>
                    {tabs.map(it => {
                        const isActive = it.index === tab
                        return (
                            <div className={styles['tab-link-container']}>
                                <Link to={{
                                        pathname: constants.routes.superAdmin.reviews,
                                        search: qs.stringify({ tab: it.index })
                                    }}
                                    className={styles['tab-link'] + (isActive ? ` ${styles['tab-link-active']}` : '')}>
                                    {t(it.titleKey)}
                                </Link>

                                {isActive && (
                                    <div className='d-flex justify-content-center mt-2'>
                                        <div className={styles['tab-link-active-border']}></div>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>

                <div>
                    <FilterFactory />
                </div>

            </div>
            
            <div className={styles['tab-content']}>
                <TableFactory />
            </div>

        </Page>
    )
}

export default withTranslation()(Reviews)