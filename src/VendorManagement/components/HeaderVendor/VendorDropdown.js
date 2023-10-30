import React, { useState } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import constants from '../../../constants';
import { MsalAuthProvider } from 'react-aad-msal';
import { config , parameters, options } from '../../../services/authProvider';
import { useSelector } from 'react-redux';
import { getFullName } from 'Messenger/pages/TeamConversation/utils';
import { addDefaultSrc } from 'utils';

const VendorDropdown = ({ t, simple }) => {
    const [dropdownVendorOpen, setDropdownVendorOpen] = useState(false);

    const toggle = () => setDropdownVendorOpen(prevState => !prevState);

    const profile = useSelector(state => state.userProfile.profile) || {};

    const logout = () => {
        localStorage.clear();
        sessionStorage.clear();
        new MsalAuthProvider(config, parameters, options).logout()
    }
    
    return (
        <>
            <Dropdown isOpen={dropdownVendorOpen} toggle={toggle}>
                <DropdownToggle caret={false} className="user-dropdown" tag="div">
                    <div className="usr-info vendor-profile-info">
                        <div className="media">
                         <img 
                            className="user-img" 
                            src={profile?.businessImage || require('assets/images/staff-default.svg').default} 
                            alt="usr"
                            onError={(e) => addDefaultSrc(e, require('assets/images/staff-default.svg').default)} 
                        />
                            <div className="media-body align-self-center d-none d-md-block">
                            <span>{profile?.businessName || getFullName(profile)}</span>
                                <img src={require('assets/images/caret.svg').default} alt="caret" />
                            </div>
                        </div>
                    </div>
                </DropdownToggle>
                <DropdownMenu right>
                    <DropdownItem>
                        <Link to={constants.routes.vendor.manageSubscription}>
                            <span>{t('vendorManagement.manageSubscription')}</span>
                        </Link>
                    </DropdownItem>
                    {!simple && <DropdownItem>
                        <Link to={constants.routes.vendor.vendorProfile}>
                            <span>{t('navbar.viewProfile')}</span>
                        </Link>
                    </DropdownItem>}
                    <DropdownItem>
                        <span onClick={logout}>{t('navbar.logout')}</span>
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </>
    );
};

export default withTranslation()(VendorDropdown);