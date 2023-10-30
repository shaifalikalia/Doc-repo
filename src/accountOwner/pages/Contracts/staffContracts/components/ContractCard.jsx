import Card from 'components/Card'
import Text from 'components/Text'
import React from 'react'
import styles from './../StaffContracts.module.scss'
import { withTranslation } from 'react-i18next';
import { Col, Row } from 'reactstrap';
import downloadIcon from "./../../../../../assets/images/download-icon.svg";
import editIcon from "./../../../../../assets/images/edit-icon.svg";
import deleteIcon from "./../../../../../assets/images/delete-icon.svg";
import { formatDate, isMobileTab } from './../../../../../utils'
import { getContractTemplatePdf } from 'repositories/contract-repository'
import FileSaver from 'file-saver';
import { useSelector } from 'react-redux';

function ContractCard({ t, contractData, editContract, deleteContract, setPdfLoader, viewContract }) {
    const profile = useSelector(state => state?.userProfile?.profile);
    const listStatus = (status) => {
        switch (status) {
            case 1:
                return <div className={styles["status-box"] + " " + styles.draft}>{t('contracts.draft')}</div>;
            case 2:
                return <div className={styles["status-box"] + " " + styles.sent}>{t('contracts.sent')}</div>;
            default:
                return <div className={styles["status-box"] + " " + styles.accepted}>{t('contracts.accepted')}</div>;
        }
    }
    const listAction = (data) => {
        switch (data.status) {
            case 1:
                return <div className={styles["btn-box"]}>
                    <div className={styles["btn-link"]} onClick={() => editContract(data.id)}>   <img src={editIcon} alt="edit" /> </div>
                    <div className={styles["btn-link"]} onClick={() => deleteContract(data.id)} >   <img src={deleteIcon} alt="delete" /> </div>
                    <div className={styles["btn-link"]}>   <img onClick={() => { downloadPdf(data.id) }} src={downloadIcon} alt="download" /> </div>
                </div>;
            case 2:
                return <div className={styles["btn-box"]}>
                    {data.type === 2 && (
                        <div>
                            {data?.uploaderId == profile?.id && <div className={styles["btn-link"]}>   <img src={editIcon} alt="download" onClick={() => editContract(data.id)} /> </div>}
                            <div className={styles["btn-link"]}>   <img onClick={() => { downloadPdf(data.id) }} src={downloadIcon} alt="download" /> </div>
                        </div>)}
                    {data.type === 1 && (
                        <div className={styles["btn-box"]}>
                            <div className={styles["btn-link"]}> <a href={data.documentLink} download target='_blank' rel="noopener noreferrer"><img src={downloadIcon} alt="edit" /> </a>  </div>
                        </div>)}
                </div>;
            default:
                return <div className={styles["btn-box"]}>
                    <div className={styles["btn-link"]}>   <img onClick={() => { downloadPdf(data.id) }} src={downloadIcon} alt="download" /> </div>
                </div>;
        }
    }

    const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
        const byteCharacters = atob(b64Data);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);

            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        const blob = new Blob(byteArrays, { type: contentType });
        return blob;
    }

    const downloadPdf = async (id) => {
        setPdfLoader(true);
        try {
            const resp = await getContractTemplatePdf(id);
            if (resp) {
                const blob = b64toBlob(resp, 'application/pdf');
                if(isMobileTab()){
                    FileSaver.saveAs(blob);
                } else {
                    const blobUrl = URL.createObjectURL(blob);
                    const pdfWindow = window.open("");
                    pdfWindow.document.write("<iframe width='100%' height='100%' src='" + blobUrl + "'></iframe>")
                    pdfWindow.document.close();
                }
            }
            setPdfLoader(false);

        } catch (e) {
            setPdfLoader(false);

        }
    }
    return (
        <Card
            radius='10px'
            marginBottom='18px'
            shadow='0 0 15px 0 rgba(0, 0, 0, 0.08)'
            className={styles['card-container']}>
            <div className={styles['staff-inner']}>
                {listAction(contractData)}
                <Row onClick={() => { viewContract(contractData) }}>
                    <Col lg="3" md="5" sm="4" xs="9">
                        {contractData.type === 1 ? (
                            <div className={styles["status-box"] + " " + styles.draft}>{t('contracts.staticContract')}</div>
                        )
                            :
                            (listStatus(contractData.status))
                        }
                        <Text
                            color="#6f7788"
                            size='12px'
                            weight='400'
                        >
                            {t('contracts.contractDate')}
                        </Text>
                        <Text
                            color="#102c42"
                            weight="600"
                            size='14px'
                        >
                            {formatDate(contractData.uploadedAt, 'll')} <span className="ml-3">{formatDate(contractData.uploadedAt, 'h:mm a')}</span>
                        </Text>
                    </Col>
                    <Col lg="6" md="5" sm="4" xs="12">
                        <div className={styles["added-col"]}>
                            <Text
                                color="#6f7788"
                                size='12px'
                                weight='400'
                            >
                                {t('contracts.addedBy')}
                            </Text>
                            <Text
                                color="#102c42"
                                weight="600"
                                size='14px'
                            >
                                {contractData.uploader.firstName} {contractData.uploader.lastName}
                            </Text>
                        </div>
                    </Col>

                </Row>
            </div>
        </Card>
    )
}

export default withTranslation()(ContractCard)