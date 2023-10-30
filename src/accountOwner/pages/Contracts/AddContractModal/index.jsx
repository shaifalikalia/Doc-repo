import React, { useState } from 'react'
import { Modal, ModalBody } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import crossIcon from './../../../../assets/images/cross.svg';
import trashIcon from './../../../../assets/images/delete-red.svg';
import Select from 'components/Select'
import Text from 'components/Text'
import "./ContractModal.scss"
import { v4 as uuidv4 } from 'uuid';
import { BlobServiceClient, AnonymousCredential, newPipeline } from '@azure/storage-blob';
import { useSastoken, useUploadContractMutation, useTermsAndConditions } from 'repositories/contract-repository'
import Loader from 'components/Loader';
import toast from 'react-hot-toast'
import * as moment from 'moment'
import constants from './../../../../constants'

function AddContractModal({ isModalOpen, closeModal, staffId, setPageNumber, openNewContract, t }) {

  const desginationOptions = [
    { id: '0', name: 'Select' },
    { id: '1', name: 'Personnel' },
    { id: '2', name: 'Associate' },
  ]
  const staffName = localStorage.getItem('staffName') ? localStorage.getItem('staffName') : '';
  const inputRef = React.useRef(null);
  const termsboxRef = React.useRef(null);
  const [contractError, setContractError] = useState(null);
  const [enableTemplate, setenableTemplate] = useState(false);
  const [enableTerms, setenableTerms] = useState(false);
  const [errorTerms, seterrorTerms] = useState(null);
  const [loader, setloader] = useState(false);
  const [selectDesignation, setselectDesignation] = useState('0');
  const [staticContract, setstaticContract] = useState(null);
  const [contractName, setcontractName] = useState(null);
  const { data: sasString } = useSastoken();
  const uploadContractMutation = useUploadContractMutation();
  const { data: termsData } = useTermsAndConditions(constants.cmsPageKey.TermsAndConditionForContractTemplate)


  const upload = (file) => {
    const accountName = `${process.env.REACT_APP_AZURE_STORAGE_ACCOUNT}`;
    const pipeline = newPipeline(new AnonymousCredential());
    const containerName = `${constants.containerName.CONTAINER_NAME_CONTRACTS}`
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
  
            setstaticContract('contracts/' + fileName[0].split('contracts/')[1]);
            setcontractName(`${staffName.replace(' ', '_')}_Contract_${new Date().getTime()}.${fileExtenstion}`);
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
  const fileChange = (event) => {
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
        setContractError(`${t('form.errors.fileSize')}`);
        fileSizeLimit = false;
        setloader(false);
      }
      if (extFile != '' && fileSizeLimit) {
        if (extFile == "image/jpeg" || extFile == "image/jpg" || extFile == "image/png" || extFile == "application/pdf" || extFile == "application/msword" || extFile == "application/vnd.ms-word.template.macroEnabled.12" || extFile == "application/vnd.ms-word.document.macroEnabled.12" || extFile == "application/vnd.openxmlformats-officedocument.wordprocessingml.template" || extFile == "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
          upload(files[0]);
          setContractError(null);
        } else {
          setContractError(`${t('form.errors.invalidFile')}`);
          setloader(false);
        }
      }
    }
  };
  const uploadContract = async () => {
    try {
      
      setloader(true);
      await uploadContractMutation.mutateAsync({ staffId, documentLink: staticContract, IsSubmitted: true, Type: 1, Date: moment().toISOString() })
      toast.success(t('contracts.contractUploadedSuccessfully'))
      setContractError(null);
      setPageNumber(0)
      closeModal(true)
    } catch (e) {
      setContractError(e.message)
    }
    setloader(false);
  };
  const designationChange = (event) => {
    setselectDesignation(event.target.value)
    if (event.target.value != '0') {
      localStorage.setItem('designation', event.target.value);
      setenableTemplate(true);
    } else {
      localStorage.removeItem('designation');
      setenableTemplate(false);
    }
  }
  const checkTerms = () => {
    if (!termsboxRef.current.checked) {
      seterrorTerms(`${t('form.errors.acceptTerms')}`);
    } else {
      seterrorTerms(null);
      openNewContract();
      closeModal();
    }
  }
  return (
    <Modal
      isOpen={isModalOpen}
      toggle={closeModal}
      className='modal-dialog-centered add-contract-modal'
      modalClassName='custom-modal'>
      <span className='close-btn' onClick={closeModal}>
        <img src={crossIcon} alt='close' />
      </span>

      {loader && <Loader />}
      {/* Pop-up for Static/Template Contract */}
      {!enableTerms && !staticContract && <ModalBody>
        <Text
          size='25px'
          marginBottom="30px"
          weight='500'
          color='#111b45' >
            <span className='modal-title-25'> 
          {t('contracts.newContract')}</span>
        </Text>
        <Select
          Title={t('contracts.selectDesignation')}
          Options={desginationOptions}
          Name={"designation"}
          selectedOption={selectDesignation}
          HandleChange={designationChange}
          Error={contractError}
        />

        <div className="btn-box d-flex">
          <button className="button button-round button-shadow"
            title={t('contracts.attachContract')} onClick={() => inputRef.current.click()
            }>
            {t('contracts.attachContract')}
          </button>
          <input className='contract-input' type='file' name="contract" ref={inputRef} onChange={fileChange} />
          <Text
            size='14px'
            weight='500'
            color='#23383b' >
            or
          </Text>  <button className={`button button-round button-border button-dark ${enableTemplate ? '' : 'disabled'}`}
            title={t('contracts.contractTemplate')} onClick={() => enableTemplate && setenableTerms(true)}>
            {t('contracts.contractTemplate')}
          </button>
        </div>
      </ModalBody>}
      {/* Pop-up for Static/Template Contract */}
      {!enableTerms && staticContract && <ModalBody>
        <Text
          size='25px'
          marginBottom="30px"
          weight='500'
          color='#111b45' >
          {t('contracts.newContract')}
        </Text>
        <div className="c-field new-contract-field">
          <label>{t('contracts.formsAndContract')}</label>
          <div className='d-flex '>
            <input className="c-form-control contract-name-wrapper" name="contract-name"
              value={contractName}
            />
          </div>
          {contractError && <span className="error-msg">{contractError}</span>}
          <div className="trash-icon" onClick={() => setstaticContract('')} >
            <img src={trashIcon} alt='trash' />
          </div>
        </div>

        <div className="d-md-flex">
          <button className="button button-round button-shadow mb-3 w-sm-100 mr-sm-4"
            title={t('save')} onClick={uploadContract}>
            {t('save')}
          </button>
          <button className="button button-round button-border btn-mobile-link mb-md-3 button-dark"
            title={t('cancel')} onClick={() => setstaticContract('')} >
            {t('cancel')}
          </button>
        </div>
      </ModalBody>}
      {/* Terms and Conditions Pop-up*/}
      {enableTerms && (
        <ModalBody>
          <Text
            size='25px'
            marginBottom="10px"
            weight='500'
            color='#111b45' >
            {t('contracts.termsOfUseForContractTemplate')}
          </Text>
          <Text
            size='16px'
            marginBottom="25px"
            weight='300'
            color='#535b5f' >
            {termsData && termsData.content ? termsData.content : null}

            {/* {termsData && termsData.content ? termsData.content : } */}
            {/* {t("contracts.termsOfUseForContractTemplateDesc")} */}

          </Text>
          <div className={`ch-checkbox`}>
            <label>
              <input
                ref={termsboxRef}
                type='checkbox'
              />
              <span>
                {t("contracts.IAgreeTermsUseContractTemplate")}
              </span>
            </label>
          </div>
          {errorTerms && <span className="error-msg">{errorTerms}</span>}
          <div className="d-md-flex mt-4">
            <button className="button button-round button-shadow mr-sm-4 mb-3 w-sm-100"
              title={t('contracts.useTemplate')} onClick={checkTerms}>
              {t('contracts.useTemplate')}
            </button>
            <button className="mb-md-3 button button-round button-border btn-mobile-link button-dark "
              title={t('cancel')} onClick={closeModal} >
              {t('cancel')}
            </button>
          </div>
        </ModalBody>)}
    </Modal>
  )
}

export default withTranslation()(AddContractModal);
