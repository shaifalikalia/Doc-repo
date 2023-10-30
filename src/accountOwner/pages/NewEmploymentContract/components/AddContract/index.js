import React, { useState, useEffect, Fragment, useRef } from 'react'
import { setup } from 'goober'
import "../MultiStep/MultiStep.scss";
import { withTranslation } from 'react-i18next';
import CancelContractModal from '../CancelContractModal';
import StepOne from '../MultiStep/StepOne';
import StepTwo from '../MultiStep/StepTwo';
import StepThree from '../MultiStep/StepThree';
import StepFour from '../MultiStep/StepFour';
import StepFive from '../MultiStep/StepFive';
import StepSix from '../MultiStep/StepSix';
import * as moment from 'moment';
import { useHistory } from "react-router-dom";

import "react-datepicker/dist/react-datepicker.css";
import { useGetContractTemplateMutation, useUploadContractMutation, getContractTemplatePdf, useEditContractMutation, useContractTemplateMutation } from 'repositories/contract-repository'
import toast from 'react-hot-toast'
import constants from '../../../../../constants'
import PreviewPersonnelContract from '../PreviewPersonnelContract'
import PreviewAssociateContract from '../PreviewAssociateContract'
import Loader from 'components/Loader';
import ConfirmContractModal from '../ConfirmContractModal';
import ExportContractModal from '../ExportContractModal';
import SaveTemplateModal from '../SaveTemplateModal';
import { cloneDeep } from 'lodash';
import { encodeId, isMobileTab } from 'utils';
import FileSaver from 'file-saver';

setup(React.createElement)
const getStep = (defaultIndex, newIndex, length) => {

	if (newIndex <= length) {
		return newIndex;
	}
	return defaultIndex;
}

const getTopNavStyles = (indx, length) => {
	const styles = []
	for (let i = 0; i < length; i++) {
		if (i < indx) {
			styles.push('done')
		} else if (i === indx) {
			styles.push('doing')
		} else {
			styles.push('todo')
		}
	}
	return styles
}

const getButtonsState = (indx, length) => {
	if (indx > 0 && indx < length - 1) {
		return {
			showPreviousBtn: true,
			showNextBtn: true,
			showCompleteBtn: false
		}
	} else if (indx === 0) {
		return {
			showPreviousBtn: false,
			showNextBtn: true,
			showCompleteBtn: false
		}
	} else {
		return {
			showPreviousBtn: true,
			showNextBtn: false,
			showCompleteBtn: true
		}
	}
}

function AddContract({ officeId, staffId, officeDetail, t, ...props }) {
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const [confirmSentModal, setConfirmSentModal] = useState(false);
	const [confirmExportModal, setConfirmExportModal] = useState(false);
	const [saveContractTemplateModal, setSaveContractTemplateModal] = useState(false);
	const staffName = localStorage.getItem('staffName') ? localStorage.getItem('staffName') : '';
	const designationType = localStorage.getItem('designation') ? +localStorage.getItem('designation') : 2;
	const steps = designationType !== 1 ? [1, 2, 3, 4, 5, 6] : [1, 2, 3, 4];
	const [fieldList, setfieldList] = useState([]);
	const [previewContract, setPreviewContract] = useState(false);
	const [showPrompt, setShowPrompt] = useState(true);
	const stateRef = useRef();

	const [pdfLoader, setPdfLoader] = useState(false);
	const [contractId, setContractId] = useState(0);
	const [BasicDetails, setBasicDetails] = useState({
		staffId,
		IsSubmitted: false,
		Type: 2,
		Date: moment().toDate(),
		BusinessLegalName: officeDetail ? officeDetail.name : '',
		Position: '',
		OfficeAddress: "",
		LengthOfEmployment: "",
		StartOfWorkDate: moment().toDate(),
		EndOfWorkDate: moment().add(1, 'd').toDate(),
		EmployeeName: staffName,
		EmployeeAddress: "",
		Salary: "",
		ContractDetails: []
	})
	stateRef.current = BasicDetails;

	const [isSavedTemplate, setisSavedTemplate] = useState('false')
	const [contractTemplateData, setcontractTemplateData] = useState([]);
	const getContractTemplateMutation = useGetContractTemplateMutation();

	
	useEffect(() =>{
		if(officeDetail){
			setBasicDetails( e => ({...e , BusinessLegalName : officeDetail ? officeDetail.name : ''}))
		}
	},[officeDetail]) 


	useEffect(() => {
		fetchTemplateData();
	
		// eslint-disable-next-line
	}, [isSavedTemplate]);


	const fetchTemplateData = async () => {
		setPdfLoader(true);
		try {
			const resp = await getContractTemplateMutation.mutateAsync({ officeId, isSavedTemplate, designationType });
			if (resp && resp.length) {
				setcontractTemplateData(resp);
				let tempData = JSON.parse(JSON.stringify(resp));
			
				tempData = tempData.map((e) => {
					if (e.title === 'Account Owner Name Inc.') {
						e.text = officeDetail ? officeDetail.owner.firstName + ' ' + officeDetail.owner.lastName : '';
					}
					if (e.title === 'Date') {
						e.text = moment().toDate();
					}
					if (e.title === 'Authorised Signature' && !!e.text && e.text.split(`${constants.containerName.CONTAINER_NAME_CONTRACTS_SIGNATURE}/`)[1]) {
						e.text = `${constants.containerName.CONTAINER_NAME_CONTRACTS_SIGNATURE}/` + e.text.split(`${constants.containerName.CONTAINER_NAME_CONTRACTS_SIGNATURE}/`)[1]
					}
					return e;
				})
				
				setBasicDetails(e => ({ ...e, ContractDetails: tempData }))
				setPdfLoader(false);
			} else {
				setPdfLoader(false);
				toast.error(t('contracts.noRecentTemplate'));
				setisSavedTemplate('false');
			}
		} catch (e) {
			console.log(e.message)
			setPdfLoader(false);
			toast.error(t('contracts.noRecentTemplate'));
			setisSavedTemplate('false');
		}
	}

	// if (officeDetail && !BasicDetails.BusinessLegalName) {setisSavedTemplate
	// 	setBasicDetails({ ...BasicDetails, BusinessLegalName: officeDetail ? officeDetail.name : '' })
	// }

	const showNav =
		typeof props.showNavigation === 'undefined' ? true : props.showNavigation

	const [activeStep] = useState(getStep(0, props.activeStep, steps.length));
	const [stylesState, setStyles] = useState(getTopNavStyles(activeStep, steps.length))
	const [compState, setComp] = useState(activeStep)
	const [buttonsState, setButtons] = useState(getButtonsState(activeStep, steps.length))
	const uploadContractMutation = useUploadContractMutation();
	const editContractMutation = useEditContractMutation();
	const contractTemplateMutation = useContractTemplateMutation();

	const [errors, seterrors] = useState({});
	const replaceableValue = [
		{ key: 'BusinessLegalName', text: '[Office Name]' },
		{ key: 'BusinessLegalName', text: '[OfficeName]' },
		{ key: 'Date', text: '[Date of Contract]' },
		{ key: 'StartOfWorkDate', text: '[Start Date]' },
		{ key: 'EndOfWorkDate', text: '[End Date]' },
		{ key: 'LengthOfEmployment', text: '[Length Of Employment]' },
		{ key: 'Position', text: '[Position]' },
		{ key: 'OfficeAddress', text: '[Office Address]' },
		{ key: 'EmployeeName', text: '[Employee Name]' },
		{ key: 'Salary', text: '[Salary/Fee/Wage]' }
	]
	const history = useHistory();

	const [contractFormDisplayData, setDisplayData] = useState([]);
	useEffect(() => {
		getContractList();
		getDisplayData();
		if (showPrompt) {
			history.block(() => {
				setModalIsOpen(true);
				return false;
			});
		} else {
			history.block(() => { });
		}

		return () => {
			history.block(() => { });
		};
		// eslint-disable-next-line
	}, [BasicDetails, history, showPrompt]);
	const escapeRegExp = (string) => {
		return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
	}

	const replaceAll = (str, find, replace) => {
		return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
	}
	const getDisplayData = () => {
		const contractData = JSON.parse(JSON.stringify(BasicDetails.ContractDetails));
		if (contractData) {
			const displayData = contractData.map((e) => {
				replaceableValue.forEach((val) => {
					if (e.text != '' && e.text != null && BasicDetails[val.key]) {
						if (val.key.includes('Date')) {
							e.text = replaceAll(e.text, val.text, moment(BasicDetails[val.key]).format('DD-MM-YYYY'))
						} else {
							e.text = replaceAll(e.text, val.text, BasicDetails[val.key])
						}
					}
				})
				if (e.text != '' && e.text != null && e.text.includes('[Account Owner Name]')) {
					let name = officeDetail ? officeDetail.owner.firstName + ' ' + officeDetail.owner.lastName : '';
					e.text = replaceAll(e.text, '[Account Owner Name]', name)
				}
				return e;
			})
			setDisplayData(displayData)
		}
	}

	const setStepState = (indx) => {
		setStyles(getTopNavStyles(indx, steps.length))
		setComp(indx < steps.length ? indx : compState)
		setButtons(getButtonsState(indx, steps.length))
	}
	const scrollToError = () => {
		setTimeout(() => {
			const error = document.getElementsByClassName('error-msg');
			if (error && error.length) {
				error[0].scrollIntoView({
					behavior: 'smooth',
					block: 'center',
					inline: 'start',
				});
			}
		}, 1000);
	}

	const next = () => {

		if (compState === 0) {
			if (isValidStepOne()) {
				setStepState(compState + 1)
				window.scrollTo(0, 0)
			} else {
				scrollToError();
			}
		} else if (compState === 1) {
			if (isValidStep(2)) {
				setStepState(compState + 1)
				window.scrollTo(0, 0)
			} else {
				scrollToError();
			}
		} else if (compState === 2) {
			if (isValidStep(3)) {
				setStepState(compState + 1)
				window.scrollTo(0, 0)
			} else {
				scrollToError();
			}
		} else if (compState === 3) {
			if (isValidStep(4)) {
				setStepState(compState + 1)
				if (designationType === 1) { setPreviewContract(true) }
				window.scrollTo(0, 0)
			} else {
				scrollToError();
			}
		} else if (compState === 4) {
			if (isValidStep(5)) {
				setStepState(compState + 1)
				window.scrollTo(0, 0)
			} else {
				scrollToError();
			}
		} else if (compState === 5) {
			if (isValidStep(6)) {
				setStepState(compState + 1)
				setPreviewContract(true)
				window.scrollTo(0, 0)
			} else {
				scrollToError();
			}
		} else {
			setStepState(compState + 1)
		}
	}
	const previous = () => {
		if (previewContract) { setPreviewContract(false) } else {
			setStepState(compState > 0 ? compState - 1 : compState);
		}
	}

	const renderSteps = () =>
		steps.map((s, i) => {
			if (stylesState[i] === 'todo') {
				return (
					<li
						className={"todo-list "}
						key={i}
						value={i}
					>
						<span>{i + 1}</span>
					</li>
				)
			} else if (stylesState[i] === 'doing') {
				return (
					<li
						className={"doing-list "}
						key={i}
						value={i}
					>
						<span>{i + 1}</span>
					</li>
				)
			} else {
				return (
					<li
						className={"done-list "}
						key={i}
						value={i}
					>
						<span>{i + 1}</span>
					</li>
				)
			}
		})

		const isValidStep = (step) => {
			const newArr = cloneDeep(stateRef.current.ContractDetails);
			const isValid = !newArr.filter(e => e.isActive && e.stepNumber === step).some((e) => {
				if(e.isHtmlContent){
					if(!removeHtmlChar(e.text)){
						e.error = t('form.errors.emptyField', { field: e.title });
						return true
					} else if (removeHtmlChar(e.text).length > 4000) {
						e.error = t('form.errors.maxLimit', { limit: '4000' });
						return true;
					} else {
						return false;
					}
				} else {
					if ((e.text == '' || e.text == null)) {
						if (e.title == "Authorised Signature") {
							e.error = t('form.errors.imageUpload')
						} else {
							e.error = t('form.errors.emptyField', { field: e.title })
						}
					}
				}
				return e.text == '' || e.text == null;
			});
			
			setBasicDetails(prevState => ({ ...prevState, ContractDetails: newArr }));
			return isValid;
		}

		const isValidStepOne = () => {
			let isValid = true;
			const errorsCopy = cloneDeep(errors);
			let BasicDetailsCopy =  stateRef.current
			isValid = isValidStep(1);
			if (!BasicDetailsCopy.Date) {
				errorsCopy.Date = t('form.errors.emptyField', { field: t('contracts.dateContract') })
				isValid = false;
			} else if (!moment(BasicDetailsCopy.Date).isSameOrAfter(moment(new Date()), 'day')) {
				errorsCopy.Date = t('form.errors.pastDate')
				isValid = false;
			} else {
				delete errorsCopy['Date'];
			}
	
			if (!BasicDetailsCopy.BusinessLegalName) {
				errorsCopy.BusinessLegalName = t('form.errors.emptyField', { field: t('contracts.businessLegalName') })
				isValid = false;
			} else if (BasicDetailsCopy.BusinessLegalName && BasicDetailsCopy.BusinessLegalName.length > 80) {
				errorsCopy.BusinessLegalName = t('form.errors.maxLimit', { limit: '80' })
				isValid = false;
			} else {
				delete errorsCopy['BusinessLegalName'];
			}
	
			if (!BasicDetailsCopy.Position) {
				errorsCopy.Position = t('form.errors.emptyField', { field: t('contracts.position') })
				isValid = false;
			} else if (BasicDetailsCopy.Position && BasicDetailsCopy.Position.length > 36) {
				errorsCopy.Position = t('form.errors.maxLimit', { limit: '36' })
				isValid = false;
			} else {
				delete errorsCopy['Position'];
			}
	
			if (!BasicDetailsCopy.OfficeAddress) {
				errorsCopy.OfficeAddress = t('form.errors.emptyField', { field: t('form.fields.officeAddress') })
				isValid = false;
			} else if (BasicDetailsCopy.OfficeAddress.length > 80) {
				errorsCopy.OfficeAddress = t('form.errors.maxLimit', { limit: '80' })
				isValid = false;
			} else {
				delete errorsCopy['OfficeAddress'];
			}
	
			if (!BasicDetailsCopy.LengthOfEmployment) {
				errorsCopy.LengthOfEmployment = t('form.errors.emptyField', { field: t('contracts.lengthEmployment') })
				isValid = false;
			} else if (BasicDetailsCopy.LengthOfEmployment.length > 36) {
				errorsCopy.LengthOfEmployment = t('form.errors.maxLimit', { limit: '36' })
				isValid = false;
			} else {
				delete errorsCopy['LengthOfEmployment'];
			}
	
			if (!BasicDetailsCopy.StartOfWorkDate) {
				errorsCopy.StartOfWorkDate = t('form.errors.emptyField', { field: t('contracts.startWork') })
				isValid = false;
			} else {
				delete errorsCopy['StartOfWorkDate'];
			}
	
			if (!BasicDetailsCopy.EndOfWorkDate) {
				errorsCopy.EndOfWorkDate = t('form.errors.emptyField', { field: t('contracts.endWork') })
				isValid = false;
			} else if (moment(BasicDetailsCopy.EndOfWorkDate).isBefore(moment(BasicDetailsCopy.StartOfWorkDate))) {
				errorsCopy.EndOfWorkDate = t('form.errors.endDate')
				isValid = false;
			} else {
				delete errorsCopy['EndOfWorkDate'];
			}
	
			if (!BasicDetailsCopy.EmployeeName) {
				errorsCopy.EmployeeName = t('form.errors.emptyField', { field: t('contracts.employeeName') })
				isValid = false;
			} else {
				delete errorsCopy['EmployeeName'];
			}
	
			if (!BasicDetailsCopy.EmployeeAddress) {
				errorsCopy.EmployeeAddress = t('form.errors.emptyField', { field: t('contracts.employeeAddress') })
				isValid = false;
			} else if (BasicDetailsCopy.EmployeeAddress.length > 80) {
				errorsCopy.EmployeeAddress = t('form.errors.maxLimit', { limit: '80' })
				isValid = false;
			} else {
				delete errorsCopy['EmployeeAddress'];
			}
	
			if (!BasicDetailsCopy.Salary) {
				errorsCopy.Salary = t('form.errors.emptyField', { field: t('contracts.salaryFeeWage') })
				isValid = false;
			} else if (BasicDetailsCopy.Salary.length > 12) {
				errorsCopy.Salary = t('form.errors.maxLimit', { limit: '12' })
				isValid = false;
			} else {
				delete errorsCopy['Salary'];
			}
			seterrors(errorsCopy)
			return isValid;
		}

	const renderForm = (step) => {
		switch (step) {
			case 0:
				return (
					<StepOne contractFormDisplayData={contractFormDisplayData} contractData={BasicDetails} setBasicDetails={(e) => { setBasicDetails(e) }} errors={errors} setFormDetails={setFormDetails} setisSavedTemplate={setisSavedTemplate} handleSwitch={handleSwitch} savedTemplate={isSavedTemplate} />
				)
			case 1:
				return (
					<StepTwo contractFormDisplayData={contractFormDisplayData} contractData={BasicDetails} setBasicDetails={(e) => { setBasicDetails(e) }} setFormDetails={setFormDetails} handleSwitch={handleSwitch} />
				)
			case 2:
				return (
					<StepThree contractFormDisplayData={contractFormDisplayData} contractData={BasicDetails} setBasicDetails={(e) => { setBasicDetails(e) }} setFormDetails={setFormDetails} handleSwitch={handleSwitch} />
				)
			case 3:
				return (
					<StepFour contractFormDisplayData={contractFormDisplayData} contractData={BasicDetails} setBasicDetails={(e) => { setBasicDetails(e) }} fieldList={fieldList} setFormDetails={setFormDetails} handleSwitch={handleSwitch} />)
			case 4:
				return (
					<StepFive contractFormDisplayData={contractFormDisplayData} contractData={BasicDetails} setBasicDetails={(e) => { setBasicDetails(e) }} setFormDetails={setFormDetails} handleSwitch={handleSwitch} />)
			case 5:
				return (
					<StepSix contractFormDisplayData={contractFormDisplayData} contractData={BasicDetails} setBasicDetails={(e) => { setBasicDetails(e) }} fieldList={fieldList} setFormDetails={setFormDetails} handleSwitch={handleSwitch} />)
			default:
			// do nothing
		}
	}
	const renderNav = (show) =>
		show && (
			<>
				<div>
					<button className="button button-round button-border button-dark"
						style={buttonsState.showPreviousBtn ? props.prevStyle : { display: 'none' }}
						onClick={previous}
					>
						{t("contracts.previousStep")}
					</button>
				</div>

				<div className="next-step-col">
					<div className="link-btn cancel-btn"
						onClick={() => { setModalIsOpen(true); }}>
						{t("cancel")}
					</div>
					<button className="button button-round button-shadow"
						style={!previewContract && buttonsState.showNextBtn ? props.nextStyle : { display: 'none' }}
						onClick={next}>
						{t("contracts.nextStep")}
					</button>

					<button className="button button-round button-shadow"
						style={!previewContract && buttonsState.showCompleteBtn ? props.completeStyle : { display: 'none' }}
						onClick={next}>
						{t("contracts.reviewEmploymentContract")}
					</button>
					<button className="button button-round button-shadow mr-4"
						style={previewContract ? props.completeStyle : { display: 'none' }}
						onClick={() => { setConfirmExportModal(true) }}>
						{t("contracts.exportEmploymentContract")}
					</button>
					<button className="button button-round button-shadow"
						style={previewContract ? props.completeStyle : { display: 'none' }}
						onClick={() => { setConfirmSentModal(true) }}>
						{t("contracts.sendEmploymentContract")}
					</button>
				</div>

			</>
		)
	const saveDraftContract = async (submit) => {
		setConfirmSentModal(false);
		try {
			let formData = { ...BasicDetails };
			formData.IsSubmitted = !submit;
			if (contractId !== 0) {
				delete formData['staffId'];
				formData['contractId'] = contractId;
				await editContractMutation.mutateAsync(formData);
			} else {
				const resp = await uploadContractMutation.mutateAsync(formData);
				setContractId(resp.id);
			}
			setModalIsOpen(false);
			toast.success(t('contracts.contractUploadedSuccessfully'));
			setShowPrompt(false);
			if (submit) {
				exitForm();
			} else {
				setSaveContractTemplateModal(true);
			}
		} catch (e) {
			toast.error(e.message);
			setModalIsOpen(false);
		}
	}

	const getContractList = () => {
		let fields = [];
		if (contractTemplateData) {
			if (designationType === 1) {
				contractTemplateData.forEach((e, key) => {
					if (e.isMainSection) {
						fields.push(e);
						setfieldList(fields)
					}
				})
			} else {
				let contractData = [...contractTemplateData];
				contractData.reverse();
				const lastElemStepOne = contractData.find(x => x.stepNumber === 1 && x.isMainSection);
				const lastElemStepTwo = contractData.find(x => x.stepNumber === 2);
				const lastElemStepThree = contractData.find(x => x.stepNumber === 5);
				const lastElemStepFour = contractData.find(x => x.stepNumber === 6 && x.isHtmlContent);
				if (lastElemStepOne) lastElemStepOne.title = t("contracts.ownerAndTheAssociateAgree");
				if (lastElemStepTwo) lastElemStepTwo.title = t("contracts.theOwnerAgree");
				if (lastElemStepThree) lastElemStepThree.title = t("contracts.theAssociateAgree");
				if (lastElemStepFour) lastElemStepFour.title = t("contracts.general");
				setfieldList([lastElemStepOne, lastElemStepTwo, lastElemStepThree, lastElemStepFour])
			}
		}
	}

	const exitForm = () => {
		setShowPrompt(false);
		setTimeout(() => {
			
			history.push(constants.routes.accountOwner.staffContracts
				.replace(':officeId', encodeId(officeId))
				.replace(':staffId', encodeId(staffId)));
		}, 30)
	}

	const removeHtmlChar = (html) => {
		let tmp = document.createElement("DIV");
		tmp.innerHTML = html;
		return tmp.textContent || tmp.innerText || "";
	}

	let timeout = null;

	const setFormDetails = (index, value, debounce = false) => {
		let newArr = cloneDeep(stateRef.current.ContractDetails);	
		let item = cloneDeep(newArr[index])
		if (item) {
			if (removeHtmlChar(value)?.length == 0 || removeHtmlChar(value).length > 4000) {
				if (removeHtmlChar(value).length > 4000 && item.isHtmlContent) {
					item.error = t('form.errors.maxLimit', { limit: '4000' })
				} else if (removeHtmlChar(value)?.length == 0) {
					item.error = t('form.errors.emptyField', { field: item.title })
				}
			} else {
				
				delete item['error'];
			}
			item.text = value;
			newArr[index] = item;
			stateRef.current = { ...stateRef.current, ContractDetails: newArr }
 			if (debounce) {
			
				clearTimeout(timeout);
				timeout = setTimeout(() => {
					setBasicDetails({ ...stateRef.current, ContractDetails: newArr });
				}, 2000);
			} else {
				setBasicDetails({ ...stateRef.current, ContractDetails: newArr });
			}
		}

	}



	const handleSwitch = (index, status) => {
		let newArr = [...stateRef.current.ContractDetails];
		if (newArr[index]) {
			newArr[index].isActive = status;
			newArr[index].text = newArr[index].text.substring(0, 995);
			delete newArr[index]['error'];
			setBasicDetails({ ...stateRef.current, ContractDetails: newArr });
			getContractList();
		}
	}
	const exportContract = async () => {
		setConfirmExportModal(false)
		setPdfLoader(true);
		if (contractId) {
			downloadPdf(contractId);
		} else {
			try {
				let formData = { ...BasicDetails };
				formData.IsSubmitted = false;
				const resp = await uploadContractMutation.mutateAsync(formData);
				if (resp) {
					downloadPdf(resp.id);
					setContractId(resp.id)
					let newArr = [...resp.contractDetails];
					newArr = newArr.map((e) => {
						if (e.title === 'Authorised Signature' && !!e.text && e.text.split(`${constants.containerName.CONTAINER_NAME_CONTRACTS_SIGNATURE}/`)[1]) {
							e.text = `${constants.containerName.CONTAINER_NAME_CONTRACTS_SIGNATURE}/` + e.text.split(`${constants.containerName.CONTAINER_NAME_CONTRACTS_SIGNATURE}/`)[1]
						}
						return e;
					})
					setBasicDetails({ ...BasicDetails, ContractDetails: newArr })
				}
			} catch (e) {
				toast.error(e.message);
				setPdfLoader(false);

			}
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
	const saveContractTemplate = async () => {
		try {
			const formData = {
				contractId,
				officeId
			};
			await contractTemplateMutation.mutateAsync(formData);
			setSaveContractTemplateModal(false);
			toast.success(t('contracts.templateSavedSuccessfully'));
			exitForm();
		} catch (e) {
			toast.error(e.message);
			setSaveContractTemplateModal(false);
		}
	}
	return (
		<Fragment>
			{(pdfLoader) && <Loader />}

			{previewContract ? (
				designationType === 1 ? (<PreviewPersonnelContract officeDetail={officeDetail} contractData={BasicDetails} contractFormDisplayData={contractFormDisplayData} isEdit={false} />) : (<PreviewAssociateContract officeDetail={officeDetail} contractData={BasicDetails} contractFormDisplayData={contractFormDisplayData} isEdit={false} />))
				: (<div className="multi-step-form "><ol className="steps-tracker">{renderSteps()}</ol>
					<div className="form-body">{renderForm(compState)}</div></div>)}
			<div className="prev-next-buttons">{renderNav(showNav)}</div>

			{modalIsOpen && (
				<CancelContractModal isModalOpen={modalIsOpen} saveDraft={() => saveDraftContract(true)}
					closeModal={() => { setModalIsOpen(false) }} exitForm={exitForm} />
			)}
			{confirmSentModal && (
				<ConfirmContractModal isModalOpen={confirmSentModal} sendContract={() => saveDraftContract(false)}
					closeModal={() => { setConfirmSentModal(false) }} />
			)}
			{confirmExportModal && (
				<ExportContractModal isModalOpen={confirmExportModal} saveDraft={() => exportContract()}
					closeModal={() => { setConfirmExportModal(false) }} />
			)}

			{saveContractTemplateModal && (
				<SaveTemplateModal isModalOpen={saveContractTemplateModal} saveContractTemplate={() => saveContractTemplate()}
					closeModal={() => { exitForm() }} />
			)}
		</Fragment>
	)
}
export default withTranslation()(AddContract);
