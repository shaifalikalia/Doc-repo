import React, { Fragment, useState } from 'react'
import { withTranslation } from 'react-i18next';
import Card from 'components/Card'
import Text from 'components/Text'
import styles from './../../NewEmploymentContract.module.scss';
import './MultiStep.scss';
import ToggleSwitch from 'components/ToggleSwitch';
import Input from 'components/Input'
import deleteIcon from "./../../../../../assets/images/delete-red.svg"
import SelectSectionModal from '../SelectSectionModal';
import { BlobServiceClient, AnonymousCredential, newPipeline } from '@azure/storage-blob';
import { useSastoken } from 'repositories/contract-repository'
import { v4 as uuidv4 } from 'uuid';
import Loader from 'components/Loader';
import Editor from 'react-pell';
import colorPicker from "./../../../../../assets/images/color-picker.svg"
import DatePicker from "react-datepicker";
import DeleteSectionModal from '../DeleteSectionModal';
import constants from '../../../../../constants';
import toast from 'react-hot-toast';

function StepSix({ contractData, setBasicDetails, fieldList, contractFormDisplayData, setFormDetails, handleSwitch, t }) {

    const [addNewSection, setAddNewSection] = useState([]);
    const [selectionModal, setSelectionModal] = useState(false);
    const [deleteSectionModal, setDeleteSectionModal] = useState(false);
    const [loader, setloader] = useState(false);
    const additional = 4

    const AddSecBtnClick = () => {
        let newSection = [...addNewSection];
        const totalFields = contractFormDisplayData.filter((v) => v?.inputType === additional && v?.isActive )?.length;
        
        const section = {
            id: 0,
            inputType: additional ,
            isActive: true,
            isDeleted: false,
            isHtmlContent: true,
            isMainSection: true,
            isSignatureType: false,
            officeId: null,
            overallOrder: 0,
            stepNumber: 4,
            templateType: 1,
            text: "",
            title: "",
            typeOrder: null,
            userId: null,
        };
        if (totalFields < 3) {
            newSection.push(section);
            setAddNewSection(newSection);
        } else {
            toast.error(t('contracts.canNotAddMoreFields'))
        }
    }
    const [selectedVal, setSelectedVal] = useState(null);
    const [selectedValError, setSelectedValError] = useState('');
    const [selectedField, setSelectedField] = useState(null);
    const accountName = `${process.env.REACT_APP_AZURE_STORAGE_ACCOUNT}`;

    const setNewDetails = (index, key, value) => {
        let newArr = [...addNewSection];
        let item = { ...newArr[index] };

        if (item) {
            item[key] = value;
            newArr[index] = item;
            setAddNewSection(newArr);
        }
    }

    const saveDetails = (key) => {
        let newArr = [...contractData.ContractDetails];
        let addNewSectionData = [...addNewSection];
        let item = { ...addNewSectionData[key] };
        if (!selectedVal) {
            setSelectedValError(t('form.errors.emptySelection', { field: 'section' }));
            return;
        } else {
            setSelectedValError('');
        }
        if (item.title === '' || item.text === '') {
            if (item.title === '') {
                item.titleError = t('form.errors.emptyField', { field: 'Title' });
                item.bodyError = '';
            } else {
                item.bodyError = t('form.errors.emptyField', { field: 'Text' });
                item.titleError = '';
            }
            addNewSectionData[key] = item;
            setAddNewSection(addNewSectionData);
            return;
        } else {
            delete item['titleError']
            delete item['bodyError']
        }
        const fieldIndex = newArr.findIndex((val) =>
            item.overallOrder === val.overallOrder
        )
        if (fieldIndex > -1) {
            newArr.splice(fieldIndex, 0, item);
            newArr.forEach((val, i) => {
                if (fieldIndex < i) {
                    newArr[i].overallOrder = newArr[i].overallOrder + 1;
                }
            });
        }
        setBasicDetails({ ...contractData, ContractDetails: newArr });

        addNewSectionData.splice(key, 1);
        setAddNewSection(addNewSectionData);
        setSelectedVal(null);
        setSelectedField(null);
    }

    const saveSelection = () => {
        if (selectedVal !== null && selectedField !== null) {
            const newArr = [...addNewSection];
            const item = { ...newArr[selectedField] };
            item.overallOrder = selectedVal.overallOrder + 1;
            item.stepNumber = selectedVal.stepNumber;
            newArr[selectedField] = item;
            setAddNewSection(newArr);
        }
        setSelectionModal(false);
    }

    const removeField = () => {
        if (selectedField !== null) {
            let newArr = [...addNewSection];
            newArr.splice(selectedField, 1);
            setAddNewSection(newArr);
            setSelectedVal(null);
        }
        setDeleteSectionModal(false);
    }
    const { data: sasString } = useSastoken();

    const upload = (file, key) => {
        let newArr = [...contractData.ContractDetails];

        const pipeline = newPipeline(new AnonymousCredential());
        const containerName = `${constants.containerName.CONTAINER_NAME_CONTRACTS_SIGNATURE}`
        const fileExtenstion = file.name.split('.').pop();
        const blobServiceClient = new BlobServiceClient(
            `https://${accountName}.blob.core.windows.net?${sasString}`,
            pipeline
        );
        async function main() {
            const containerClient = blobServiceClient.getContainerClient(containerName);
            const blobName = `${uuidv4()}.${fileExtenstion}`;
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);
            const blobOptions = {
                blobHTTPHeaders: { blobContentType: file.type },
            };
            try {
                const uploadBlobResponse = await blockBlobClient.uploadBrowserData(file, blobOptions);
                if (uploadBlobResponse._response.status === 201 || uploadBlobResponse._response.status === 200) {
                    setloader(false);
                    const fileName = uploadBlobResponse._response.request.url.split('?');
                    newArr[key].text = `${constants.containerName.CONTAINER_NAME_CONTRACTS_SIGNATURE}/` + fileName[0].split(`${constants.containerName.CONTAINER_NAME_CONTRACTS_SIGNATURE}/`)[1]
                    setBasicDetails({ ...contractData, ContractDetails: newArr });
                }
                else {
                    setloader(false);
                }
            } catch (e) {
                setloader(false);
            }
        }
        main();
    }
    const fileChange = (event, key) => {
        let newArr = [...contractData.ContractDetails];

        setloader(true);
        event.preventDefault();
        let files;
        if (event.dataTransfer) {
            files = event.dataTransfer.files;
        } else if (event.target) {
            files = event.target.files;
        }
        if (files) {
            const fsize = files[0].size;
            const fileLimit = Math.round((fsize / 1024));
            let fileSizeLimit = true;
            const extFile = files.length ? files[0].type : '';

            if (fileLimit >= 5120) {
                newArr[key].error = `${t('form.errors.fileSize')}`;
                fileSizeLimit = false;
                setloader(false);
            }
            if (extFile != '' && fileSizeLimit) {
                if (extFile == "image/jpeg" || extFile == "image/jpg" || extFile == "image/png") {
                    try {
                        upload(files[0], key);
                        delete newArr[key]['error']
                    } catch (e) {
                        newArr[key].error = `${t('form.errors.imageUpload')}`;
                        setloader(false);
                    }
                } else {
                    newArr[key].error = `${t('form.errors.invalidFile')}`;
                    setloader(false);
                }
            }
            setBasicDetails({ ...contractData, ContractDetails: newArr });

        }
    };
    let countFields = 0;
    if (contractData) {
        contractFormDisplayData.forEach(v => {
            if ((v.stepNumber == 1 || v.stepNumber == 2 || v.stepNumber == 3 || v.stepNumber == 4 || v.stepNumber == 5) && v.isMainSection) {
                countFields++;
            }
        });
    }
    return (
        <Fragment>
            {loader && <Loader />}

            <div className={styles['step-form-wrapper']}>
                <div class="new_contract_step1_associate_CF">
                    <div class="Rectangle">
                    </div>
                    <span class="Job-Title">
                        {t("contracts.general")}
                    </span>
                </div>
                {
                    contractFormDisplayData.map((data, key) => (
                        data.isHtmlContent && data.stepNumber == 6 && (data.inputType == null || data.inputType == 4) && (<Card
                            radius='10px'
                            marginBottom='10px'
                            padding="30px"
                            shadow='0 0 15px 0 rgba(0, 0, 0, 0.08)'
                            className={"pb-1 " + styles['card-container']} key={key}>
                            <div className="d-flex justify-content-between">
                                <Text size="16px" secondary weight="600" marginBottom="20px">
                                    {++countFields}. {data.title}
                                </Text>
                                <ToggleSwitch label={data.title} onChange={(e) => { handleSwitch(key, e.currentTarget.checked) }} value={data.isActive} />
                            </div>
                            <div style={{ 'display': (data.isActive ? 'block' : 'none') }}>
                                <Editor
                                    defaultContent={data.text}
                                    actions={['bold', 'italic', 'underline', {
                                        icon: `<span> <img src=${colorPicker} alt= "picker" /> <input type="color" class="color-picker-input" oninput="document.execCommand('styleWithCSS', true, null);document.execCommand('foreColor', false, this.value); " /></span>`,
                                        title: 'Change Text Color',
                                        result: () => true
                                    },]}
                                    actionBarClass="my-custom-class"
                                    onChange={(e) => { setFormDetails(key, e, true) }}
                                />
                                {data.error && <span className="error-msg">{data.error}</span>}

                            </div>
                        </Card>)
                    )
                    )}

                {addNewSection.map((data, key) => (
                    <Card key={key}
                        radius='10px'
                        marginBottom='10px'
                        padding="30px"
                        shadow='0 0 15px 0 rgba(0, 0, 0, 0.08)'
                        className={"select-sec-card " + styles['card-container']}>

                        <div className="d-flex justify-content-between">
                            <Text size="16px" secondary weight="600" marginBottom="20px">
                                {t("contracts.addNewDetailsInThisSection")}
                            </Text>
                            <div className="delet-btn">
                                <img src={deleteIcon} alt="delete" onClick={() => { setDeleteSectionModal(true); setSelectedField(key) }} />
                            </div>
                        </div>
                        <div className="select-sec-input">
                            <Text size="14px" color="#102c42" weight="600" >
                                {selectedVal ? selectedVal.title : t("contracts.noSectionSelected")}
                                <br />
                                {!selectedVal && selectedValError && <span className="error-msg">{selectedValError}</span>}
                            </Text>
                            <div className="link-btn" onClick={() => { setSelectionModal(true); setSelectedField(key) }}>Select</div>
                        </div>
                        <Input
                            Title={t('contracts.section1Heading')}
                            Type="text"
                            Placeholder={t('form.placeholder1', { field: t('contracts.section1Heading') })}
                            Name={"section1Heading"}
                            HandleChange={(e) => setNewDetails(key, 'title', e.currentTarget.value)}
                            Error={data.titleError}
                        />
                        <Input
                            Title={t('contracts.section1Body')}
                            Type="text"
                            Placeholder={t('form.placeholder1', { field: t('contracts.section1Body') })}
                            Name={"section1Body"}
                            HandleChange={(e) => setNewDetails(key, 'text', e.currentTarget.value)}
                            Error={data.bodyError}
                        />
                        <button className="button button-round button-border button-dark section-save-btn"
                            title={t('save')} onClick={() => saveDetails(key)}>
                            {t('save')}
                        </button>
                    </Card>))}
                {!addNewSection.length  &&
                    <div className="text-center">
                        <span className={"link-btn " + styles["more-detail-link"]} onClick={() => AddSecBtnClick()}>
                        <img src={require('assets/images/plus-icon-outline.svg').default} alt="icon" />
                       {t('contracts.addMoreDetails')}</span>
                    </div>
                }
                {
                    contractFormDisplayData.map((data, key) => (
                        data.inputType == 3 && data.typeOrder == 1 && data.stepNumber == 6 && (
                            <div key={key}>
                                <Card
                                    radius='10px'
                                    marginBottom='10px'
                                    padding="30px"
                                    shadow='0 0 15px 0 rgba(0, 0, 0, 0.08)'
                                    className={"pb-1 " + styles['card-container']}>
                                    <Editor
                                        defaultContent={data.text}
                                        actions={[]}
                                        actionBarClass="my-custom-class no-toolbar"
                                        onChange={(e) => { setFormDetails(key, e, true) }}
                                    />
                                </Card>
                                <Card
                                    radius='10px'
                                    marginBottom='10px'
                                    padding="30px"
                                    shadow='0 0 15px 0 rgba(0, 0, 0, 0.08)'
                                    className={"pb-1 " + styles['card-container']}>
                                    <Input
                                        Type="text"
                                        Name={"truly"}
                                        Placeholder={contractData.ContractDetails[key + 1].title}
                                        Value={contractFormDisplayData[key + 1].text}
                                        HandleChange={(e) => setFormDetails([key + 1], e.currentTarget.value)}
                                        Error={contractData.ContractDetails[key + 1].error ? contractData.ContractDetails[key + 1].error : ''}
                                    />
                                    <div className={styles["-mt-30"]}>
                                        <Input
                                            Type="text"
                                            Placeholder={contractData.ContractDetails[key + 2].title}
                                            Name={"accountOwnerName"}
                                            Value={contractFormDisplayData[key + 2].text}
                                            HandleChange={(e) => setFormDetails([key + 2], e.currentTarget.value)}
                                            Error={contractData.ContractDetails[key + 2].error ? contractData.ContractDetails[key + 2].error : ''}
                                        />
                                    </div>
                                    <div className={styles['auth-signbox']}>
                                        <Text size="13px" marginBottom="5px" color="#79869a">
                                            {t("contracts.authorisedSignature")}
                                        </Text>
                                        <Text size="10px" marginBottom="12px" weight="500" color="#79869a">
                                            {t("contracts.pleaseUploadImageSignature")}
                                        </Text>
                                        {(contractData.ContractDetails[key + 3].text != '' && contractData.ContractDetails[key + 3].text != null) && <span className="sign-img"><img src={`https://${accountName}.blob.core.windows.net/` + contractData.ContractDetails[key + 3].text} alt="signature" /></span>}

                                        <div className={styles["upload-border"]}>
                                            <div className={styles["upload-btn-wrapper"]}>
                                                <div className={styles["upload-btn"]}>Upload Signature</div>
                                                <input type="file" name="signature" onChange={(e) => fileChange(e, key + 3)} />
                                                {contractData.ContractDetails[key + 3].error && <span className="error-msg">{contractData.ContractDetails[key + 3].error}</span>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="c-field">
                                        <label>{t('accountOwner.date')}</label>
                                        <div className="d-flex inputdate">
                                            <DatePicker
                                                selected={new Date(contractFormDisplayData[key + 4].text)}
                                                onChange={(e) => setFormDetails([key + 4], e)}
                                                dateFormat="dd-MM-yyyy"
                                                className="c-form-control"
                                            />
                                        </div>
                                    </div>
                                    {contractData.ContractDetails[key + 4].error && <span className="error-msg">{contractData.ContractDetails[key + 4].error}</span>}
                                </Card>
                            </div>)
                    ))}
            </div>

            {selectionModal && (
                <SelectSectionModal isModalOpen={selectionModal}
                    closeModal={() => { setSelectionModal(false) }} fieldList={fieldList} setSelectedVal={setSelectedVal} saveSelection={saveSelection} />
            )}
            {deleteSectionModal && (
                <DeleteSectionModal isModalOpen={deleteSectionModal} confirmDelete={() => removeField()}
                    closeModal={() => { setDeleteSectionModal(false) }} />
            )}
        </Fragment>
    )
}
export default withTranslation()(StepSix);