import React, { Fragment, useMemo } from 'react';
import Text from 'components/Text'
import styles from "./../../ManageCatalogue.module.scss";
import { withTranslation } from 'react-i18next';

const UnitPriceTab = ({ t, product, handleEditClick }) => {

    const tableData = useMemo(() => {
        const { isPriceSameForAllState, cataloguePriceForState } = product;
        if(isPriceSameForAllState){
            return (
                <tr>
                    <td>{t('vendorManagement.samePriceForAll')}</td>
                    <td>{`CAD ${cataloguePriceForState?.[0]?.price}`}</td>
                </tr>
            )
        } else {
            return cataloguePriceForState?.map(item => {
                const { price, stateId, state } = item;
                return (
                    <tr key={stateId}>
                        <td>{state?.name}</td>
                        <td>{`CAD ${price}`}</td>
                    </tr>
                )
            })
        }
    }, [product]);
    
    return (
        <Fragment>
            <div className='d-flex justify-content-between mb-3'>
                <Text
                    size='20px'
                    marginBottom="0px"
                    weight='500'
                    className='mr-2'
                    color=' #111B45' >
                    {t('vendorManagement.unitPrice')}
                </Text>
                <div onClick={(e) => handleEditClick(e, 'price')} className='pointer'> <img title={t('edit')} src={require('assets/images/edit-icon.svg').default} alt="edit" /></div>
            </div>
            <div className={styles["tab-table-list"]}>
            <table class="table custom-table">
                    <thead>
                        <tr>
                            <th>{t('vendorManagement.location')}</th>
                            <th>{t('vendorManagement.price')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData}
                    </tbody>
                </table>
            </div>
        </Fragment>
    );
};

export default withTranslation()(UnitPriceTab);