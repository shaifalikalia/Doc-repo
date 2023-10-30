import React from 'react'
import { withTranslation } from 'react-i18next';
import Card from 'components/Card'
import Text from 'components/Text'
import Input from 'components/Input'
import styles from './../../NewEmploymentContract.module.scss';
import './MultiStep.scss';
import ToggleSwitch from 'components/ToggleSwitch';
import Editor from 'react-pell';
import colorPicker from "./../../../../../assets/images/color-picker.svg"
import DatePicker from "react-datepicker";

function StepOne({ contractData, setBasicDetails, errors, contractFormDisplayData, setFormDetails, setisSavedTemplate, savedTemplate, handleSwitch, t , hideRadio }) {
  const designationType = localStorage.getItem('designation') ? +localStorage.getItem('designation') : 2;
  const onchangeTemplate = (event) => {
    setisSavedTemplate(event.currentTarget.value);
  }
  return (
    <div className={styles['step-form-wrapper']}>
      { !hideRadio && <Card
        radius='10px'
        marginBottom='10px'
        padding="30px"
        shadow='0 0 15px 0 rgba(0, 0, 0, 0.08)'
        className={styles['card-container']}>
        <Text size="16px" secondary weight="600" marginBottom="20px">
          {t("contracts.templateYouWantToUse")}
        </Text>
        <div className="d-md-flex">
          <div className='ch-radio mr-5'>
            <label>
              <input type='radio' name='template' value="false" onChange={onchangeTemplate} checked={savedTemplate == 'false'} />
              <span> {t("contracts.defaultTemplate")} </span>
            </label>
          </div>
          <div className='ch-radio'>
            <label>
              <input type='radio' name='template' value="true" onChange={onchangeTemplate} checked={savedTemplate == 'true'} />
              <span> {t("contracts.recentlySavedTemplate")}</span>
            </label>
          </div>
        </div>
      </Card>}
      <Card
        radius='10px'
        marginBottom='10px'
        padding="30px"
        shadow='0 0 15px 0 rgba(0, 0, 0, 0.08)'
        className={"pb-1 " + styles['card-container']}>
        <Text size="16px" secondary weight="600" marginBottom="20px">
          {t("contracts.basicInfo")}
        </Text>
        <div className="c-field">
          <label>{t('contracts.dateContract')}</label>
          <div className="d-flex inputdate">
            <DatePicker
              selected={contractData.Date}
              onChange={(e) => { setBasicDetails({ ...contractData, Date: e }) }}

              dateFormat="dd-MM-yyyy"
              className="c-form-control"
            />
            {errors.Date && <span className="error-msg">{errors.Date}</span>}

          </div>
        </div>
        <Input
          Title={t('contracts.businessLegalName')}
          Type="text"
          Placeholder={t('form.placeholder1', { field: t('contracts.businessLegalName') })}
          Name={"BusinessLegalName"}
          HandleChange={(e) => { setBasicDetails({ ...contractData, BusinessLegalName: e.currentTarget.value }) }}
          Value={contractData.BusinessLegalName}
          Error={errors.BusinessLegalName ? errors.BusinessLegalName : ''}
        />
        <Input
          Title={t('contracts.position')}
          Type="text"
          Placeholder={t('form.placeholder1', { field: t('contracts.position') })}
          Name={"Position"}
          HandleChange={(e) => { setBasicDetails({ ...contractData, Position: e.currentTarget.value }) }}
          Value={contractData.Position}
          Error={errors.Position ? errors.Position : ''}
        />
        <Input
          Title={t('form.fields.officeAddress')}
          Type="text"
          Placeholder={t('form.placeholder1', { field: t('form.fields.officeAddress') })}
          Name={"OfficeAddress"}
          HandleChange={(e) => { setBasicDetails({ ...contractData, OfficeAddress: e.currentTarget.value }) }}
          Value={contractData.OfficeAddress}
          Error={errors.OfficeAddress ? errors.OfficeAddress : ''}
        />
        <Input
          Title={t('contracts.lengthEmployment')}
          Type="text"
          Placeholder={t('form.placeholder1', { field: t('contracts.lengthEmployment') })}
          Name={"LengthOfEmployment"}
          HandleChange={(e) => { setBasicDetails({ ...contractData, LengthOfEmployment: e.currentTarget.value }) }}
          Value={contractData.LengthOfEmployment}
          Error={errors.LengthOfEmployment ? errors.LengthOfEmployment : ''}
        />
        <div className="c-field">
          <label>{t('contracts.startWork')}</label>
          <div className="d-flex inputdate">
            <DatePicker
              selected={contractData.StartOfWorkDate}
              onChange={(e) => { setBasicDetails({ ...contractData, StartOfWorkDate: e }) }}

              dateFormat="dd-MM-yyyy"
              className="c-form-control"
            />
            {errors.StartOfWorkDate && <span className="error-msg">{errors.StartOfWorkDate}</span>}
          </div>
        </div>
        <div className="c-field">
          <label>{t('contracts.endWork')}</label>
          <div className="d-flex inputdate">
            <DatePicker
              selected={contractData.EndOfWorkDate}
              onChange={(e) => { setBasicDetails({ ...contractData, EndOfWorkDate: e }) }}

              dateFormat="dd-MM-yyyy"
              className="c-form-control"
            />
            {errors.EndOfWorkDate && <span className="error-msg">{errors.EndOfWorkDate}</span>}
          </div>
        </div>

        <Input
          Title={t('contracts.employeeName')}
          Type="text"
          Placeholder={t('form.placeholder1', { field: t('contracts.employeeName') })}
          Name={"EmployeeName"}
          HandleChange={(e) => { setBasicDetails({ ...contractData, EmployeeName: e.currentTarget.value }) }}
          Value={contractData.EmployeeName}
          Error={errors.EmployeeName ? errors.EmployeeName : ''}
        />
        <Input
          Title={t('contracts.employeeAddress')}
          Type="text"
          Placeholder={t('form.placeholder1', { field: t('contracts.employeeAddress') })}
          Name={"EmployeeAddress"}
          HandleChange={(e) => { setBasicDetails({ ...contractData, EmployeeAddress: e.currentTarget.value }) }}
          Value={contractData.EmployeeAddress}
          Error={errors.EmployeeAddress ? errors.EmployeeAddress : ''}
        />
        <Input
          Title={t('contracts.salaryFeeWage')}
          Type="text"
          Placeholder={t('form.placeholder1', { field: t('contracts.salaryFeeWage') })}
          Name={"Salary"}
          HandleChange={(e) => { setBasicDetails({ ...contractData, Salary: e.currentTarget.value }) }}
          Value={contractData.Salary}
          Error={errors.Salary ? errors.Salary : ''}
        />
      </Card>
      <Card
        radius='10px'
        marginBottom='10px'
        padding="30px"
        shadow='0 0 15px 0 rgba(0, 0, 0, 0.08)'
        className={"pb-1 " + styles['card-container']}>
        {
          contractFormDisplayData.map((data, key) => (
            !data.isMainSection && data.stepNumber == 1 && (
              <Input key={key}
                Title={data.title}
                Type="text"
                Placeholder={t('form.placeholder1', { field: t('contracts.salutation') })}
                Name={data.title}
                Value={data.text}
                HandleChange={(e) => setFormDetails(key, e.currentTarget.value)}
                Error={data.error ? data.error : ''}
              />
            )
          ))
        }
      </Card>
      {designationType === 2 &&
        <div class="new_contract_step1_associate_CF">
          <div class="Rectangle">
          </div>
          <span class="Job-Title">
            {t("contracts.ownerAndTheAssociateAgree")}
          </span>
        </div>}
      {
        contractFormDisplayData.map((data, key) => (
          data.isMainSection && data.stepNumber == 1 && (<Card
            radius='10px'
            marginBottom='10px'
            padding="30px"
            shadow='0 0 15px 0 rgba(0, 0, 0, 0.08)'
            className={"pb-1 " + styles['card-container']} key={key}>
            <div className="d-flex justify-content-between">
              <Text size="16px" secondary weight="600" marginBottom="20px">
                {data.overallOrder - 3}. {data.title}
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
export default withTranslation()(StepOne);