import React, { useEffect, useState } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
import { withTranslation } from 'react-i18next';


const EventsShiftsTab = React.lazy(() => import('./SubTabs/EventsShiftsTab'));
const StaffAvailabilityTab = React.lazy(() => import('./SubTabs/StaffAvailabilityTab'));


function OfficeSchedulerTab({ t, subTabed, setSubTabed, staffAvailFiltersData }) {

    const [activeTab, setActiveTab] = useState(subTabed.tab == '1' ? subTabed.subTab : '1');

    useEffect(() => {
        if (activeTab) {
            let data = {
                tab: '1', subTab: activeTab
            }
            setSubTabed({ ...data })
        }
        // eslint-disable-next-line
    }, [activeTab])

    return (
        <div className='common-tabs position-relative'>
            <Nav tabs>
                <NavItem>
                    <NavLink className={activeTab == '1' ? 'active' : ''}
                        onClick={() => setActiveTab('1')}>
                        {t('accountOwner.staffAvailability')}
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink className={activeTab == '2' ? 'active' : ''}
                        onClick={() => setActiveTab('2')}>
                        {t('accountOwner.workingEventsShifts')}
                    </NavLink>
                </NavItem>

            </Nav>
            <TabContent activeTab={activeTab}>
                <TabPane tabId='1'>
                    { activeTab === '1' && <StaffAvailabilityTab staffAvailFiltersData={staffAvailFiltersData}/>}
                </TabPane>
                <TabPane tabId='2'> { activeTab === '2' && <EventsShiftsTab />}</TabPane>

            </TabContent>
        </div>
    );
}

export default withTranslation()(OfficeSchedulerTab);