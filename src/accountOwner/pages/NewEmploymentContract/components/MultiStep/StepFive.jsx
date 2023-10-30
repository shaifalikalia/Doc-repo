import React from 'react'
import { withTranslation } from 'react-i18next';
import Card from 'components/Card'
import Text from 'components/Text'
import styles from './../../NewEmploymentContract.module.scss';
import './MultiStep.scss';
import ToggleSwitch from 'components/ToggleSwitch';
import Editor from 'react-pell';
import colorPicker from "./../../../../../assets/images/color-picker.svg"

function StepFive({ contractData, setBasicDetails, contractFormDisplayData, setFormDetails, handleSwitch, t }) {
  const designationType = localStorage.getItem('designation') ? +localStorage.getItem('designation') : 2;

  let countFields = 0;
  if (contractData) {
    contractFormDisplayData.forEach(v => {
      if ((v.stepNumber == 1 || v.stepNumber == 2 || v.stepNumber == 3 || v.stepNumber == 4) && v.isMainSection) {
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
            {t("contracts.theAssociateAgreeContd")}
          </span>
        </div>}
      {
        contractFormDisplayData.map((data, key) => (
          data.isHtmlContent && data.stepNumber == 5 && (data.inputType == null || data.inputType == 4) && (<Card
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
    </div>
  )
}
export default withTranslation()(StepFive);