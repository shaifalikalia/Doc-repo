import React from 'react';
import LayoutVendor from '../../components/LayoutVendor';
import { withTranslation } from 'react-i18next';
import Page from 'components/Page';
import styles from "./ManageSaleRep.module.scss";
import { Col, Row } from 'reactstrap';
import Card from 'components/Card'
import Text from 'components/Text'
import ToggleSwitch from 'components/ToggleSwitch';
import SelectOfficeModal from './components/SelectOfficeModal';
import AssignedOfficeTable from './components/AssignedOfficeTable';
import { Link } from 'react-router-dom';
import useSalesRepDetail from './hooks/useSalesRepDetail';
import Loader from 'components/Loader';

const SalesRepDetail = ({ t }) => {

    const hookData = useSalesRepDetail({ t });
    const {state, methods, otherData } = hookData;
    const { details, currentSalesRepOffices, linkToEditDetails } = otherData;

    return (
        <LayoutVendor>
            <Page onBack={methods.onBack} 
                title={t('vendorManagement.salesRepresentativeDetails')}>
                {otherData.loading && <Loader/>}
                <div className={styles["sales-rep-detail-card"]}>
                    <Card className={styles["vendor-card"]}
                        radius='10px'
                        marginBottom='10px'
                        shadow='0 0 15px 0 rgba(0, 0, 0, 0.08)'
                        cursor="default"
                    >
                        <Row className='flex-row-reverse'>
                            <Col md="6">
                                <div className={styles["icon-box"]}>
                                    <div class={styles["switch-box"]}>
                                        <Text
                                            size='12px'
                                            marginBottom="0px"
                                            weight='400'
                                            className='mr-2'
                                            color='#6f7788' >
                                            {details.isActive ? t("active") : t('inactive')}
                                        </Text>
                                        <ToggleSwitch 
                                            value={details.isActive || false}
                                            onChange={methods.handleToggleSwitch}
                                            label="sales-rep-status" 
                                        /></div>
                                    <Link to={linkToEditDetails}>
                                        <span title={t('edit')}> <img src={require('assets/images/edit-icon.svg').default} alt="icon" /></span>
                                    </Link>
                                </div>
                            </Col>
                            <Col md="6">
                                <Row>
                                    <Col sm="6">
                                        <Text
                                            size='12px'
                                            marginBottom="5px"
                                            weight='400'
                                            color='#6f7788' >
                                            {t('name')}
                                        </Text>
                                        <Text
                                            className='text-break'
                                            size='14px'
                                            marginBottom="25px"
                                            weight='600'
                                            color='#102c42' >
                                            {`${details.firstName || '-'} ${details.lastName || ''}`}
                                        </Text>
                                    </Col>
                                    <Col sm="6">
                                        <Text
                                            size='12px'
                                            marginBottom="5px"
                                            weight='400'
                                            color='#6f7788' >
                                            {t('form.fields.phoneNumber')}
                                        </Text>
                                        <Text
                                            size='14px'
                                            marginBottom="25px"
                                            weight='600'
                                            color='#102c42' >
                                            {details.contactNumber || '-'}
                                        </Text>
                                    </Col>
                                    <Col sm="6">
                                        <Text
                                            size='12px'
                                            marginBottom="5px"
                                            weight='400'
                                            color='#6f7788' >
                                            {t('emailAddress')}
                                        </Text>
                                        <Text
                                            className='text-break'
                                            size='14px'
                                            marginBottom="25px"
                                            weight='600'
                                            color='#102c42' >
                                            {details.emailId || '-'}
                                        </Text>
                                    </Col>
                                    <Col sm="6">
                                        <Text
                                            size='12px'
                                            marginBottom="5px"
                                            weight='400'
                                            color='#6f7788' >
                                            {t('status')}
                                        </Text>
                                        <Text
                                            size='14px'
                                            marginBottom="25px"
                                            weight='600'
                                            color='#102c42' >
                                            {details.isActive ? t('active') : t('inactive')}
                                        </Text>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Card>
                    <div className={styles["search-assign-office"]}>
                        <div className={'search-box pb-0 ' + styles["search"]}>
                            <input
                                value={state.salesRepOfficeSearchTerm}
                                type='text'
                                placeholder={t('vendorManagement.searchByOfficeName')}
                                onChange={methods.handleSalesRepOfficeSearchTerm}
                            />
                            <span className='ico'>
                                <img src={require('assets/images/search-icon.svg').default} alt='icon' />
                            </span>
                        </div>
                        <button onClick={methods.openOfficeModal} type='button' className="button w-sm-100 button-round button-shadow"
                            title={t('vendorManagement.assignOffice')} >
                            {t('vendorManagement.assignOffice')}
                        </button>
                    </div>
                    {!!currentSalesRepOffices.length && <AssignedOfficeTable hookData={hookData}/>}
                    {!currentSalesRepOffices?.length && <div className={styles["empty-office"] + " " + styles["custom-empty-office"]}>
                        <div className="empty-block">
                            {<img src={require('assets/images/empty-icon.svg').default} alt="icon" />}
                            <h4>{t('vendorManagement.noOfficeFoundline1')}</h4>
                            <h4>{t('vendorManagement.noOfficeFoundline2')}</h4>
                        </div>
                    </div>}
                </div>
            </Page>
            {state.officeModal && (
                <SelectOfficeModal
                    hookData={hookData}
                />
            )}
        </LayoutVendor>
    );
};

export default withTranslation()(SalesRepDetail);