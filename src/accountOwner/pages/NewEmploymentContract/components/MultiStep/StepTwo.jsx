import React from 'react'
import { withTranslation } from 'react-i18next';
import Card from 'components/Card'
import Text from 'components/Text'
import Input from 'components/Input'
import styles from './../../NewEmploymentContract.module.scss';
import './MultiStep.scss';
import ToggleSwitch from 'components/ToggleSwitch';
import { Col, Row } from 'reactstrap';
import Editor from 'react-pell';
import colorPicker from "./../../../../../assets/images/color-picker.svg"

function StepTwo({ contractData, setBasicDetails, contractFormDisplayData, setFormDetails, handleSwitch, t }) {
  const designationType = localStorage.getItem('designation') ? +localStorage.getItem('designation') : 2;

  let countFields = 0;
  if (contractData) {
    contractFormDisplayData.forEach(v => {
      if (v.stepNumber == 1 && v.isMainSection) {
        countFields++;
      }
    });
  }
  return (
    <div className={styles['step-form-wrapper']}>

      {designationType === 2 &&
        <div class="new_contract_step1_associate_CF">
          <div class="Rectangle">
          </div>
          <span class="Job-Title">
            {t("contracts.theOwnerAgree")}
          </span>
        </div>}  {
        contractFormDisplayData.map((data, key) => (
          data.stepNumber == 2 && data.inputType === 1 && data.typeOrder == 1 ? (
            <Card
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
                <div className="vacation-editor1">
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
                <Row className="completed-services-row">
                  <Col xs="4">
                    <div className="c-field mb-0">
                      <label>{contractData.ContractDetails[key + 1].title}</label>
                    </div>
                    <Input
                      Type="text"
                      Placeholder={contractData.ContractDetails[key + 1].title}
                      Name={contractData.ContractDetails[key + 1].title}
                      Value={contractFormDisplayData[key + 1].text}
                      HandleChange={(e) => setFormDetails([key + 1], e.currentTarget.value)}
                      Error={contractData.ContractDetails[key + 1].error ? contractData.ContractDetails[key + 1].error : ''}
                    />
                    <div className={styles["-mt-30"]}>
                      <Input
                        Type="text"
                        Placeholder={contractData.ContractDetails[key + 4].title}
                        Name={contractData.ContractDetails[key + 4].title}
                        Value={contractFormDisplayData[key + 4].text}
                        HandleChange={(e) => setFormDetails([key + 4], e.currentTarget.value)}
                        Error={contractData.ContractDetails[key + 4].error ? contractData.ContractDetails[key + 4].error : ''}
                      />
                    </div>
                  </Col>
                  <Col xs="4">
                    <div className="c-field mb-0">
                      <label>{contractData.ContractDetails[key + 2].title}</label>
                    </div>
                    <Input

                      Type="text"
                      Placeholder={contractData.ContractDetails[key + 2].title}
                      Name={contractData.ContractDetails[key + 2].title}
                      Value={contractFormDisplayData[key + 2].text}
                      HandleChange={(e) => setFormDetails([key + 2], e.currentTarget.value)}
                      Error={contractData.ContractDetails[key + 2].error ? contractData.ContractDetails[key + 2].error : ''}
                    />
                    <div className={styles["-mt-30"]}>
                      <Input
                        Type="text"
                        Placeholder={contractData.ContractDetails[key + 5].title}
                        Name={contractData.ContractDetails[key + 5].title}
                        Value={contractFormDisplayData[key + 5].text}
                        HandleChange={(e) => setFormDetails([key + 5], e.currentTarget.value)}
                        Error={contractData.ContractDetails[key + 5].error ? contractData.ContractDetails[key + 5].error : ''}
                      />
                    </div>
                  </Col>
                  <Col xs="4">
                    <div className="c-field mb-0">
                      <label>{contractData.ContractDetails[key + 3].title} </label>
                    </div>
                    <Input

                      Type="text"
                      Placeholder={contractData.ContractDetails[key + 3].title}
                      Name={contractData.ContractDetails[key + 3].title}
                      Value={contractFormDisplayData[key + 3].text}
                      HandleChange={(e) => setFormDetails([key + 3], e.currentTarget.value)}
                      Error={contractData.ContractDetails[key + 3].error ? contractData.ContractDetails[key + 3].error : ''}
                    />
                    <div className={styles["-mt-30"]}>
                      <Input
                        Type="text"
                        Placeholder={contractData.ContractDetails[key + 6].title}
                        Name={contractData.ContractDetails[key + 6].title}
                        Value={contractFormDisplayData[key + 6].text}
                        HandleChange={(e) => setFormDetails([key + 6], e.currentTarget.value)}
                        Error={contractData.ContractDetails[key + 6].error ? contractData.ContractDetails[key + 6].error : ''}
                      />
                    </div>
                  </Col>
                </Row>
                <Editor
                  defaultContent={contractFormDisplayData[key + 7].text}
                  actions={['bold', 'italic', 'underline', {
                    icon: `<span> <img src=${colorPicker} alt= "picker" /> <input type="color" class="color-picker-input" oninput="document.execCommand('styleWithCSS', true, null);document.execCommand('foreColor', false, this.value); " /></span>`,
                    title: 'Change Text Color',
                    result: () => true
                  },]}
                  actionBarClass="my-custom-class"
                  onChange={(e) => { setFormDetails(key + 7, e, true) }}
                />

                {contractData.ContractDetails[key + 7].error && <span className="error-msg">{contractData.ContractDetails[key + 7].error}</span>}
              </div>
            </Card>
          ) : (data.isHtmlContent && data.stepNumber == 2 && (data.inputType == null || data.inputType == 4) && (<Card
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
          </Card>))
        ))}
    </div>
  )
}
export default withTranslation()(StepTwo);