import Page from 'components/Page';
import React, { useState, useEffect, Suspense } from 'react';
import { withTranslation } from 'react-i18next';
import styles from "./Scheduler.module.scss";
import "./Scheduler.scss";
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
import Card from 'components/Card';

import SwitchOwnerModal from './components/Modals/SwitchOwnerModal';
import { useAccountOwners } from 'repositories/scheduler-repository';
import Loader from 'components/Loader';
import { useSelector } from 'react-redux';
import constants from '../../../constants';
import { sortBy } from 'lodash';
import useAgendaFilter from 'hooks/useAgendaFilter';
import useSubscriptionAccess from 'hooks/useSubscriptionAccess'
import useStaffAvailabilityFilter from 'hooks/useStaffAvailabilityFilter';

const YourScheduleTab = React.lazy(() => import('././YourScheduleTab'));
const OfficeSchedulerTab = React.lazy(() => import('./OfficeSchedulerTab'));

const Scheduler = ({ t }) => {
    const selectTabs = localStorage.getItem('selectTabs') ? JSON.parse(localStorage.getItem('selectTabs')) : { tab: '1', subTab: '1' };
    const [subTabs, setSubTabs] = useState(selectTabs)
    const modulesAccess = useSelector(prev => prev)
    const { isModuleDisabledClass, isModuleDisabledClassForStaff } = useSubscriptionAccess()


    useEffect(() => {
        localStorage.setItem('selectTabs', JSON.stringify(subTabs))
    }, [subTabs, selectTabs])


    const profile = useSelector(state => state.userProfile.profile)
    let isStaff = false;
    if (profile && profile.role) {
        isStaff = profile.role.systemRole === constants.systemRoles.staff
        if (!isStaff) localStorage.removeItem('selectedOwner')
    }



    const [activeTab, setActiveTab] = useState(selectTabs.tab);
    const agendaFiltersData = useAgendaFilter();
    const staffAvailFiltersData = useStaffAvailabilityFilter();



    useEffect(() => {
        let subTab = selectTabs.subTab;
        if (activeTab !== selectTabs.tab) subTab = '1';
        if (subTab == '3' && activeTab == '1') subTab = '1';
        setSubTabs({ tab: activeTab, subTab })
        // eslint-disable-next-line
    }, [activeTab])


    const sortedOwnerList = (ownerList) => {
        return sortBy(ownerList, [owner => owner.firstName?.toLowerCase()]);
    }

    const [showSwitchOwnerModal, setShowSwitchOwnerModal] = useState(false);
    const [selectedOwner, setSelectedOwner] = useState(null);
    const { isLoading: loadinOwnerData, data: ownerData } = useAccountOwners();
   
    useEffect(() => {

        if (modulesAccess && ownerData) {
            
            if (isStaff) {
                getStaffHaveModuleAccess();
            }else {
                if (isModuleDisabledClass(constants.moduleNameWithId.scheduler)) {
                    window.location.href = "/"
                }
            }
        }
    }, [modulesAccess])

    const getStaffHaveModuleAccess = () => {

        try {
            const subscription = modulesAccess?.Subscription;
            let accessibleModule;
            if (subscription?.length) {
                for (let i = 0; i < subscription.length; i++) {
                    const val = subscription[i];

                    if (val.planFeature) {
                        accessibleModule = val?.planFeature?.find((plan) => (plan?.id === constants.moduleNameWithId.teamLiveChat) && plan?.isAvailable)
                    } else {
                        accessibleModule = val;
                    }
                    
                    if (accessibleModule) {
                        accessibleModule.ownerId = val?.ownerId; 
                        break; // Break out of the loop
                    }
                }
               
                if (isModuleDisabledClassForStaff(constants.moduleNameWithId.scheduler)) {
                    window.location.href = "/"
                    return
                }
                
                let _selectedOwner = JSON.parse(localStorage.getItem('selectedOwner'));
                const selectedOwnerData = ownerData?.find((owner) => owner.id === accessibleModule?.ownerId) 
                if(!_selectedOwner && selectedOwnerData){
                    setSelectedOwner(selectedOwnerData);  
                    localStorage.setItem('selectedOwner', JSON.stringify(selectedOwnerData));
                }
            }
            
        } catch (error) {
            console.log(error);
        }
    };
   
    const switchNewAccountOwner = (owner) => {
        if (owner) {
            setSelectedOwner(owner);
            localStorage.setItem('selectedOwner', JSON.stringify(owner));
        }
    }

    // if(!loadinOwnerData && isStaff && ownerData && !ownerData.length && localStorage.getItem('selectedOwner')){
    //     localStorage.removeItem('selectedOwner');
    // }
    
    if (!loadinOwnerData && isStaff && ownerData && ownerData[0] && selectedOwner === null) {
        if (localStorage.getItem('selectedOwner')) {
            let _selectedOwner = JSON.parse(localStorage.getItem('selectedOwner'));
            
            let ownerExist = ownerData.find(v => (v.id === _selectedOwner.id));
            if (ownerExist) {
                switchNewAccountOwner(ownerExist);
            } else {
                switchNewAccountOwner(sortedOwnerList(ownerData)[0])
            }
        } else {
            switchNewAccountOwner(sortedOwnerList(ownerData)[0]);
        }
    }

    return (
        <Page className="scheduler-page">
            {(loadinOwnerData) && <Loader />}

            <div className="d-md-flex justify-content-between mb-4">
                <h2 className="page-title">{t("accountOwner.scheduler")}</h2>
                {isStaff && <div className="top-right-text">
                    {selectedOwner && <div className="show-text">{t('staff.showingSchedule')} <b>'{selectedOwner.firstName} {selectedOwner.lastName}'</b></div>}
                    {selectedOwner && <span className="link-btn" onClick={() => { setShowSwitchOwnerModal(true) }}>Change</span>}
                </div>}
            </div>
            <Card className={styles["scheduler-card"]}>
                <div className='common-tabs scheduler-tabs'>
                    <Nav tabs>
                        <NavItem>
                            <NavLink className={activeTab == '1' ? 'active' : ''} onClick={() => setActiveTab('1')}>
                                {t('accountOwner.officeScheduler')}
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink className={activeTab == '2' ? 'active' : ''} onClick={() => setActiveTab('2')}>
                                {t('accountOwner.yourSchedule')}
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <TabContent activeTab={activeTab}>
                        <Suspense fallback={<Loader />} >
                            <TabPane tabId='1'>
                                {activeTab === '1' && 
                                    <OfficeSchedulerTab 
                                        subTabed={subTabs} 
                                        setSubTabed={setSubTabs}
                                        staffAvailFiltersData={staffAvailFiltersData} 
                                    />
                                }
                            </TabPane>
                            <TabPane tabId='2'>
                                {activeTab === '2' && 
                                    <YourScheduleTab 
                                        subTabed={subTabs} 
                                        setSubTabed={setSubTabs}
                                        agendaFiltersData={agendaFiltersData}
                                    />
                                }


                            </TabPane>
                        </Suspense>
                    </TabContent>
                </div>
            </Card>

            {SwitchOwnerModal && (
                <SwitchOwnerModal
                    subTitle={t("accountOwner.scheduler")} 
                    showSwitchOwnerModal={showSwitchOwnerModal}
                    setShowSwitchOwnerModal={setShowSwitchOwnerModal} 
                    ownerList={sortedOwnerList(ownerData || [])} 
                    selectedOwner={selectedOwner} 
                    setSelectedOwner={switchNewAccountOwner}
                    resetAgendaFilters= {agendaFiltersData.resetFilters}
                    resetStaffAvailFilters={staffAvailFiltersData.resetFilters} 
                />
            )}
        </Page>
    );
};

export default withTranslation()(Scheduler);