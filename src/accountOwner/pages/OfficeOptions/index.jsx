import React from 'react'
import Page from 'components/Page'
import { Col, Row } from 'reactstrap'
import styles from './OfficeOptions.module.scss'
import staffMembersIcon from './../../../assets/images/staff-members.svg'
import contractsIcon from './../../../assets/images/contracts.svg'
import preferenceIcon from './../../../assets/images/preferences.svg'
import timesheetIcon from './../../../assets/images/timesheet-icon.svg'
import { withTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import constants from './../../../constants'
import { motion } from 'framer-motion'
import { useOfficeDetail } from 'repositories/office-repository'
import useSubscriptionAccess from 'hooks/useSubscriptionAccess'
import { decodeId } from 'utils'


function OfficeOptions({ history, location, match, t }) {
    const { redirectWithCheck , isModuleDisabledClass } = useSubscriptionAccess()

    const goBack = () => history.push(constants.routes.accountOwner.offices)
    let officeName = null
    if (location?.state?.officeName) {
        officeName = location.state.officeName
    }
    
    const { isLoading, data } = useOfficeDetail(decodeId(match.params.officeId))
    
    
   

    return (
        <Page
            onBack={goBack}
            isTitleLoading={!officeName && isLoading}
            title={officeName || (data && data.name)}
            className={styles['page']}>

            <Row>
                <Col lg='4'>
                    <Card
                        to={constants.routes.accountOwner.staffGrid.replace(':officeId', match.params.officeId)}
                        icon={staffMembersIcon}
                        
                        title={t('accountOwner.staffMembers')}
                        officeName={officeName} />
                </Col>
                <Col lg='4'>
                    <Card
                        to={constants.routes.accountOwner.timesheet.replace(':officeId', match.params.officeId)}
                        icon={timesheetIcon}
                        title={t('contracts.timesheet')}
                        />
                </Col>
                <Col lg='4'>
                    <Card
                        to={constants.routes.accountOwner.leaves.replace(':officeId', match.params.officeId)}
                        icon={timesheetIcon}
                        title={t('contracts.leaves')}
                        />
                </Col>
                <Col lg='4' className={isModuleDisabledClass(constants.moduleNameWithId.formAndContracts)}>
                    <Card
                        to={constants.routes.accountOwner.contracts.replace(':officeId', match.params.officeId)}
                        icon={contractsIcon}
                        title={t('contracts.formsAndContract')}
                        redirectTo={
                            () => redirectWithCheck( {
                                pathname: constants.routes.accountOwner.contracts.replace(':officeId', match.params.officeId),
                                state: { officeName }
                            }, !!isModuleDisabledClass(constants.moduleNameWithId.formAndContracts))
                        }
                        officeName={officeName} />
                </Col>
                <Col lg='4'>
                    <Card
                        to={constants.routes.accountOwner.preferences.replace(':officeId', match.params.officeId)}
                        icon={preferenceIcon}
                        title={t('accountOwner.preferences')}
                        officeName={officeName} />
                </Col>
            </Row>
        </Page>
    )
}

function Card({ to, icon, title, officeName , redirectTo  }) {
    if(redirectTo){
        return (
            <motion.div
                        whileHover={{ scale: constants.animation.hoverScale }}
                        whileTap={{ scale: constants.animation.hoverScale }}>
                        <span onClick={redirectTo} className='pointer'>
                            <div className={styles['card']}>
                                <img className={`${styles['icon']} mr-2`} src={icon} alt='icon' />
                                <h4>{title}</h4>
                            </div>
                        </span>
        </motion.div>
        )
    }
    return (
        <motion.div
            whileHover={{ scale: constants.animation.hoverScale }}
            whileTap={{ scale: constants.animation.hoverScale }}>
            <Link to={{
                pathname: to,
                state: { officeName }
            }}>
         
                <div className={styles['card']}>
                    <img className={`${styles['icon']} mr-2`} src={icon} alt='icon' />
                    <h4>{title}</h4>
                </div>
     
            </Link>
        </motion.div>
    )
}

export default withTranslation()(OfficeOptions)

