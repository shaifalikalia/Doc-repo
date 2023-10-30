import Page from 'components/Page';
import React, { Fragment} from 'react';
import LayoutVendor from '../../components/LayoutVendor';
import { withTranslation } from 'react-i18next';
import Card from 'components/Card';
import styles from "./Promotion.module.scss";
import Text from 'components/Text'
import Input from 'components/Input';
import SelectCustomerModal from './components/SelectedCustomerModal';
import {  Col, Form, Row } from 'reactstrap';
import ReactDatePicker from 'react-datepicker';
import { useAddPromotions } from './Hooks/useAddPromotions';
import CustomSelect from './components/CustomSelect';
import "./Promotion.scss";
import Loader from 'components/Loader';

const AddNewPromotion = ({ t }) => {
    const {
        formFields,
        errors,
        customersList,
        isSelectCustomerModalOpen,
        selectedUserCount,
        hasMore,
        isLoading,
        showNoRecord,
        promoCodesList,
        hasMorePromo,
        searchText,
        selectedUsers,
        setSearchtext,
        loadMore,
        handleInput,
        handleDatePicker,
        handleSubmit,
        handleSearchTerm,
        handleSelectCustomer,
        saveModal,
        setSelectCustomerModalOpen,
        closeModal,
        selectPromoCode,
        loadMoreData,
        handleRadio,
        promocodeHandler,
        goBack,
        isSelectedCustomer
    } = useAddPromotions({ t })

    const {
        heading,
        launchDate,
        expiryDate,
        description,
        isPromoCodeActive,
        promoCode,
        isForAllCustomer
    } = formFields


    return (
        <Fragment>
            <LayoutVendor>
                <Page onBack={goBack}
                    title={t('vendorManagement.addNewPromotion')}>
                    <Card className={"promotion-page " + styles["promotion-card"]}
                        radius='10px'
                        marginBottom='10px'
                        shadow='0 0 15px 0 rgba(0, 0, 0, 0.08)'
                        cursor="default"
                    >
                        {isLoading && <Loader />}
                        <Form>
                            <Row>
                                <Col lg={6}>
                                    <Input
                                        Title={t('vendorManagement.promotionHeading')}
                                        Type="text"
                                        Name={"heading"}
                                        Placeholder={t('form.placeholder1', { field: t('vendorManagement.promotionHeading') })}
                                        Value={heading}
                                        HandleChange={handleInput}
                                        MaxLength={120}
                                        Error={errors?.heading}
                                    />
                                    <Row>
                                        <Col md="6">
                                            <div className="c-field">
                                                <label>{t('vendorManagement.promotionLaunchDate')}</label>
                                                <div className="d-flex inputdate add-promotion-datepicker">
                                                    <ReactDatePicker
                                                        dateFormat="dd-MM-yyyy"
                                                        className="c-form-control"
                                                        selected={launchDate}
                                                        onSelect={(date) => handleDatePicker('launchDate', { launchDate: date })}
                                                        minDate={new Date()}
                                                        maxDate={expiryDate}

                                                    />
                                                </div>
                                            </div>

                                        </Col>
                                        <Col md="6">
                                            <div className="c-field">
                                                <label>{t('vendorManagement.promotionExpiryDate')}</label>
                                                <div className="d-flex inputdate add-promotion-datepicker">
                                                    <ReactDatePicker
                                                        dateFormat="dd-MM-yyyy"
                                                        className="c-form-control"
                                                        selected={expiryDate}
                                                        minDate={launchDate}
                                                        onSelect={(date) => handleDatePicker('expiryDate', { expiryDate: date })}
                                                    />
                                                    {errors?.expiryDate && <span className="error-msg">{errors?.expiryDate}</span>}

                                                </div>
                                            </div>

                                        </Col>
                                    </Row>
                                    <div className="c-field">
                                        <label>{t("vendorManagement.description")}</label>
                                        <textarea
                                            placeholder={t('form.placeholder1', { field: t('vendorManagement.description') })}
                                            className={"c-form-control " + styles["custom-textarea-control"]}
                                            name="description"
                                            maxLength="400"
                                            onChange={handleInput}
                                            value={description}
                                        ></textarea>
                                        {errors?.description && <span className="error-msg">{errors?.description}</span>}
                                    </div>
                                    <Text
                                        size='13px'
                                        marginBottom="5px"
                                        weight='400'
                                        color='#79869A' >
                                        {t("vendorManagement.sendPromoCodeTo")}
                                    </Text>
                                    <div className="ch-radio">
                                        <label className="mr-5" onClick={(e) => handleRadio(true)}>
                                            <input type="radio" name="sendPromoCodeTo" checked={isForAllCustomer} />
                                            <span> {t('vendorManagement.sendToAllCustomers')} </span>
                                        </label>
                                    </div>
                                    <div className='d-sm-flex justify-content-between mb-3'>
                                        <div>
                                            <div className="ch-radio">
                                                <label onClick={(e) => handleRadio(false)}>
                                                    <input type="radio" name="sendPromoCodeTo" checked={!isForAllCustomer} />
                                                    <span>{t('vendorManagement.sendtoSelectedCustomers')}
                                                        {(isForAllCustomer === false) && (
                                                            <Text
                                                                size='12px'
                                                                marginBottom="5px"
                                                                weight='400'
                                                                color='#6F7788' >
                                                                {selectedUserCount} {t("vendorManagement.selected")}
                                                            </Text>
                                                        )}
                                                    </span>
                                                </label>
                                            </div>
                                            {
                                            ((errors?.selectCustomer && selectedUserCount === 0) && (isForAllCustomer === false))

                                            && <span className="error-msg">{errors?.selectCustomer}</span>}
                                        </div>
                                        {!isForAllCustomer && (
                                            <span className='link-btn py-2 mb-3 d-inline-block' onClick={() => {
                                                setSelectCustomerModalOpen(true);
                                            }} > {t("vendorManagement.selectCustomers")}</span>
                                        )}
                                    </div>

                                    <div className="ch-checkbox">
                                        <label className='py-2 mb-0 mt-3 mt-md-0'>
                                            <input type="checkbox" checked={isPromoCodeActive} name="promocodes" onChange={(e) => promocodeHandler()} />
                                            <span> {t('vendorManagement.promocodes')} </span>
                                        </label>
                                    </div>
                                    <div>
                                        {
                                            isPromoCodeActive &&
                                            <div className='custom-select-promotion'>
                                                <CustomSelect
                                                    Title={t('vendorManagement.promocodes')}
                                                    options={promoCodesList}
                                                    id={"promoCode"}
                                                    hasMoreData={hasMorePromo}
                                                    selectedOption={promoCode}
                                                    selectOption={selectPromoCode}
                                                    loadMoreData={loadMoreData}
                                                />
                                                {(errors?.promoCode) && <span className="error-msg">{errors?.promoCode}</span>}
                                            </div>
                                        }
                                    </div>
                                </Col>
                            </Row>
                            <div className='d-md-flex my-4'>
                                <button className="button button-round button-shadow mr-md-4 w-sm-100"
                                    title={t('save')} onClick={handleSubmit} >
                                    {t('save')}
                                </button>
                                <button type='button' className="button button-round  button-dark   button-border btn-mobile-link"
                                    title={t('cancel')} onClick={goBack}>
                                    {t('cancel')}
                                </button>
                            </div>
                        </Form>
                    </Card>
                </Page>
            </LayoutVendor>
            {isSelectCustomerModalOpen && (
                <SelectCustomerModal
                searchText={searchText}
                selectedUsers={selectedUsers}
                setSearchtext={setSearchtext}
                    isOpen={isSelectCustomerModalOpen}
                    showNoRecord={showNoRecord}
                    closeModal={closeModal}
                    customersList={customersList}
                    hasMore={hasMore}
                    loadMore={loadMore}
                    handleSearchTerm={handleSearchTerm}
                    loading={isLoading}
                    saveModal={saveModal}
                    isSelectedCustomer={isSelectedCustomer}
                    handleSelectCustomer={handleSelectCustomer}
                />
            )}


        </Fragment>
    );
};

export default withTranslation()(AddNewPromotion);