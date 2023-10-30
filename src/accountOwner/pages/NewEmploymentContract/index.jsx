import React from 'react';
import { withTranslation } from 'react-i18next';
import Text from 'components/Text';
import Page from 'components/Page';
import AddContract from './components/AddContract'
import styles from './NewEmploymentContract.module.scss';
import { useOfficeDetail } from 'repositories/office-repository';
import EditContract from './components/EditContract';
import { decodeId } from 'utils';

function NewEmploymentContract({ history, match, t }) {

    const officeId = decodeId(match.params.officeId);
    const staffId = decodeId(match.params.staffId);
    const contractId = decodeId(match.params.contractId);
    const { data: officeDetail } = useOfficeDetail(officeId)

    return (
        <Page
        >
            <div className="container container-smd p-0">
                <h2 className="page-title">
                    {officeDetail && officeDetail.name ? officeDetail.name : ''}
                </h2>
                <Text size="14px" color="#000" weight="300" >
                    {t("contracts.newEmploymentContract")}
                </Text>
                <div className={styles['contract-step-form']}>
                    {
                        contractId ?
                            (<EditContract officeDetail={officeDetail} activeStep={0} showNavigation={true} officeId={officeId} staffId={staffId} contractId={contractId} />) : (<AddContract officeDetail={officeDetail} activeStep={0} showNavigation={true} officeId={officeId} staffId={staffId} />)

                    }
                </div>

            </div>

        </Page>


    )
}

export default withTranslation()(NewEmploymentContract);
