import React, { useEffect, useState } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
import { withTranslation } from 'react-i18next';
import AgendaTab from './SubTabs/AgendaTab/index';
import WorkingEventsShiftsTab from './SubTabs/WorkingEventsShiftsTab';
import RequestTab from './SubTabs/RequestTab';



function YourScheduleTab({ t, subTabed, setSubTabed, agendaFiltersData }) {

    const [activeTab, setActiveTab] = useState(subTabed.tab == '2' ? subTabed.subTab : '1');

    useEffect(() => {
        if (activeTab) {
            let data = {
                tab: '2', subTab: activeTab
            }
            setSubTabed({ ...data })
        }
        // eslint-disable-next-line
    }, [activeTab])

    return (
        <div className='common-tabs'>
            <Nav tabs>
                <NavItem>
                    <NavLink className={activeTab == '1' ? 'active' : ''} onClick={() => setActiveTab('1')}>
                        {t('accountOwner.agenda')}
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink className={activeTab == '2' ? 'active' : ''} onClick={() => setActiveTab('2')}>
                        {t('accountOwner.requests')}
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink className={activeTab == '3' ? 'active' : ''} onClick={() => setActiveTab('3')}>
                        {t('accountOwner.workingEventsShifts')}
                    </NavLink>
                </NavItem>
            </Nav>
            <TabContent activeTab={activeTab}>
                <TabPane tabId='1'> { activeTab === '1' && <AgendaTab agendaFiltersData={agendaFiltersData}/>} </TabPane>
                <TabPane tabId='2'> {activeTab === '2' && <RequestTab /> } </TabPane>
                <TabPane tabId='3'> { activeTab === '3' && <WorkingEventsShiftsTab /> }</TabPane>
            </TabContent>
        </div>
    );
}

export default withTranslation()(YourScheduleTab);