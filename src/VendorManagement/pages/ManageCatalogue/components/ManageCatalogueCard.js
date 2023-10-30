import React, { useState } from 'react';
import { Col, Row } from 'reactstrap';
import Card from 'components/Card'
import Text from 'components/Text'
import { withTranslation } from 'react-i18next';
import ToggleSwitch from 'components/ToggleSwitch';
import styles from "./../ManageCatalogue.module.scss";
import { useHistory } from 'react-router-dom';
import { addDefaultSrc, encodeId, handleError, handleSuccess } from 'utils';
import qs from 'query-string';
import constants from '../../../../constants';
import ProgressiveImage from 'components/ProgressiveImage';
import Loader from 'components/Loader';
import { useDeleteProduct, useUpdateProductAvailability } from 'repositories/vendor-repository';
import CustomModal from 'components/CustomModal';

const ManageCatalogueCard = ({ t, product, from, refetch = e => e }) => {

    const history = useHistory();

    const {
        id,
        productId,
        productName,
        vendorCatalogueCategory,
        minimumQuantity,
        maximumQuantity,
        vendorTax,
        isAvailable,
        image,
        totalQuantity,
        quantityShortageReminder
    } = product || {};

    const [deleteModal, setDeleteModal] = useState(false);

    const updateProductAvailabilityMutation = useUpdateProductAvailability();
    const { isLoading: updatingProductAvailability } = updateProductAvailabilityMutation;

    const deleteProductMutation = useDeleteProduct();
    const { isLoading: deletingProduct } = deleteProductMutation;

    const handleToggleSwitch = async (CatalogueId, IsAvailable) => {
        try {
            await updateProductAvailabilityMutation.mutateAsync({ CatalogueId, IsAvailable });
            refetch();
        } catch (err) {
            handleError(err);
        } 
    }

    const handleDeleteProduct = async (CatalogueId) => {
        try {
            await deleteProductMutation.mutateAsync({ CatalogueId });
            handleSuccess(t('vendorManagement.productDelSuc'));
            if (fromDetails){
                history.push(constants.routes.vendor.manageCatalogue);
            } else {
                refetch();
            }
            setDeleteModal(false);
        } catch (err) {
            handleError(err);
        }
    }

    const fromDetails = from === constants.vendor.productDetails;
    const rowClass = fromDetails ? '' : 'cursor-pointer';

    const handleViewDetails = () => {
        if (!fromDetails)
            history.push({
                pathname: constants.routes.vendor.catalogueDetail,
                search: qs.stringify({
                    id: encodeId(id)
                })
            });
    }

    const handleEditClick = (e) => {
        e.stopPropagation();
        history.push({
            pathname: constants.routes.vendor.addNewItem,
            search: qs.stringify({
                isEdit: true,
                id: encodeId(id)
            })
        })
    }
    
    const handleDeleteClick = (e) => {
        e.stopPropagation();
        setDeleteModal(true);
    }

    return (<>
        {(updatingProductAvailability) && <Loader/>}
        <Card className={styles["catalogue-card"]}
            radius='15px'
            marginBottom='10px'
            shadow='0 0 15px 0 rgba(0, 0, 0, 0.08)'
            cursor="default"
        >
            <Row className={rowClass} onClick={handleViewDetails}>
                <Col md="2" xl="3" className={styles["img-col"] + " " + "d-md-flex align-items-center"}>
                    <ProgressiveImage
                        src={image || require('assets/images/vendor-dummy-profile.jpg').default}
                        alt="product-pic"
                        onError={(e) => addDefaultSrc(e, require('assets/images/vendor-dummy-profile.jpg').default)}
                    />
                </Col>
                <Col md="6" className={styles["text-col"]}>
                    <div className={styles["content-box"]}>
                        <Row>
                            <Col sm="6">
                                <div className='text-break'>
                                    <Text
                                        size='12px'
                                        marginBottom="5px"
                                        weight='400'
                                        color='#6f7788' >
                                        {t('vendorManagement.sKUProductID')}
                                    </Text>
                                    <Text
                                        size='14px'
                                        marginBottom="25px"
                                        weight='600'
                                        color='#102c42' >
                                        {productId}
                                    </Text>
                                </div>
                                <div className='text-break'>
                                    <Text
                                        size='12px'
                                        marginBottom="5px"
                                        weight='400'
                                        color='#6f7788'
                                    >
                                        {t('vendorManagement.productName')}
                                    </Text>
                                    <Text
                                        size='14px'
                                        marginBottom="25px"
                                        weight='600'
                                        color='#102c42'
                                    >
                                        {productName}
                                    </Text>
                                </div>
                                <div className='text-break'>
                                    <Text
                                        size='12px'
                                        marginBottom="5px"
                                        weight='400'
                                        color='#6f7788'
                                    >
                                        {t('vendorManagement.productType')}
                                    </Text>
                                    <Text
                                        size='14px'
                                        marginBottom="25px"
                                        weight='600'
                                        color='#102c42'
                                    >
                                        {vendorCatalogueCategory?.name}
                                    </Text>
                                </div>
                                {fromDetails && <div>
                                    <Text
                                        size='12px'
                                        marginBottom="5px"
                                        weight='400'
                                        color='#6f7788'
                                    >
                                        {t('vendorManagement.totalQuantityInInventory')}
                                    </Text>
                                    <Text
                                        size='14px'
                                        marginBottom="25px"
                                        weight='600'
                                        color='#102c42'
                                    >
                                        {totalQuantity}
                                    </Text>
                                </div>}
                            </Col>
                            <Col sm="6">
                                <div>
                                    <Text
                                        size='12px'
                                        marginBottom="5px"
                                        weight='400'
                                        color='#6f7788' >
                                        {t('vendorManagement.minQuantityOrder')}
                                    </Text>
                                    <Text
                                        size='14px'
                                        marginBottom="25px"
                                        weight='600'
                                        color='#102c42' >
                                        {minimumQuantity}
                                    </Text>
                                </div>
                                <div>
                                    <Text
                                        size='12px'
                                        marginBottom="5px"
                                        weight='400'
                                        color='#6f7788'
                                    >
                                        {t('vendorManagement.maxQuantityOrder')}
                                    </Text>
                                    <Text
                                        size='14px'
                                        marginBottom="25px"
                                        weight='600'
                                        color='#102c42'
                                    >
                                        {maximumQuantity}
                                    </Text>
                                </div>
                                <div className='text-break' >
                                    <Text
                                        size='12px'
                                        marginBottom="5px"
                                        weight='400'
                                        color='#6f7788' >
                                        {t('vendorManagement.taxApplied')}
                                    </Text>
                                    <Text
                                        size='14px'
                                        marginBottom="25px"
                                        weight='600'
                                        color='#102c42' >
                                        {vendorTax?.name}
                                    </Text>
                                </div>
                                {fromDetails && <div>
                                    <Text
                                        size='12px'
                                        marginBottom="5px"
                                        weight='400'
                                        color='#6f7788'
                                    >
                                        {t('vendorManagement.quantityShortageReminder')}
                                    </Text>
                                    <Text
                                        size='14px'
                                        marginBottom="25px"
                                        weight='600'
                                        color='#102c42'
                                    >
                                        {quantityShortageReminder}
                                    </Text>
                                </div>}
                            </Col>
                        </Row>
                    </div>
                </Col>
                <Col md="4" xl="3" className={styles["btn-col"]}>

                    <div className={styles["icon-box"]}>
                        <div class={styles["switch-box"]}>
                            <Text
                                size='12px'
                                marginBottom="0px"
                                weight='400'
                                className='mr-2'
                                color='#6f7788' >
                                {isAvailable ? t("vendorManagement.available") : t("vendorManagement.notAvailable")}
                            </Text>
                            <ToggleSwitch
                                value={isAvailable}
                                onChange={() => handleToggleSwitch(id, !isAvailable)}
                                label={`product-availability-toggle-${id}`}
                            />
                        </div>
                        <div className={styles['action-btn']}>
                            <span
                                title={t('edit')}
                                onClick={handleEditClick}
                                className='pointer'
                            >
                                <img src={require('assets/images/edit-icon.svg').default} alt="icon" />
                            </span>

                            <span
                                title={t('delete')}
                                onClick={handleDeleteClick}
                                className='pointer'
                            >
                                <img src={require('assets/images/delete-icon.svg').default} alt="icon" />
                            </span>
                        </div>
                    </div>
                </Col>
            </Row>
        </Card>
        <CustomModal
            isOpen={deleteModal}
            setIsOpen={setDeleteModal}
            actionInProgress={deletingProduct}
            leftBtnText={t('delete')}
            rightBtnText={t('cancel')}
            title={t('vendorManagement.deleteProdTitle')}
            subTitle1={t('vendorManagement.deleteProdDesc')}
            onConfirm={() => handleDeleteProduct(id)}
        />
    </>
    );
};

export default withTranslation()(ManageCatalogueCard);