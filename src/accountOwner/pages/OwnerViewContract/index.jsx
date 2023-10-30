import React, { useState, useEffect } from "react";
import { withTranslation } from "react-i18next";
import Text from "components/Text";
import Page from "components/Page";
import styles from "./OwnerViewContract.module.scss";
import { useOfficeDetail } from "repositories/office-repository";
import { useContractTemplateById } from "repositories/contract-repository";
import * as moment from "moment";
import PreviewPersonnelContract from "./components/PreviewPersonnelContract";
import PreviewAssociateContract from "./components/PreviewAssociateContract";
import Loader from "components/Loader";
import toast from "react-hot-toast";
import { decodeId } from "utils";

function OwnerViewContract({ history, match, location, t }) {
  let officeName = null;
  if (location.state && location.state.officeName) {
    officeName = location.state.officeName;
  }
  const officeId = match.params.officeId;
  const contractId = match.params.contractId;
  const [designationType, setDesignationType] = useState(2);
  const [contractFormDisplayData, setDisplayData] = useState([]);
  const replaceableValue = [
    { key: "BusinessLegalName", text: "[Office Name]" },
    { key: "Date", text: "[Date of Contract]" },
    { key: "StartOfWorkDate", text: "[Start Date]" },
    { key: "EndOfWorkDate", text: "[End Date]" },
    { key: "LengthOfEmployment", text: "[Length Of Employment]" },
    { key: "Position", text: "[Position]" },
    { key: "OfficeAddress", text: "[Office Address]" },
    { key: "EmployeeName", text: "[Employee Name]" },
    { key: "Salary", text: "[Salary/Fee/Wage]" },
  ];
  const [BasicDetails, setBasicDetails] = useState({
    contractId,
    IsSubmitted: false,
    Type: 2,
    Date: moment().toDate(),
    BusinessLegalName: officeName,
    Position: "",
    OfficeAddress: "",
    LengthOfEmployment: "",
    StartOfWorkDate: moment().toDate(),
    EndOfWorkDate: moment().add(1, "d").toDate(),
    EmployeeName: "",
    EmployeeAddress: "",
    Salary: "",
    ContractDetails: [],
  });

  useEffect(() => {
    if (location?.state?.contract) {
      let tempData = { ...BasicDetails };
      let contractTemplateData = location.state.contract;
      tempData["Date"] = moment(contractTemplateData.date).toDate();
      tempData["BusinessLegalName"] = contractTemplateData.businessLegalName;
      tempData["Position"] = contractTemplateData.position;
      tempData["OfficeAddress"] = contractTemplateData.officeAddress;
      tempData["LengthOfEmployment"] = contractTemplateData.lengthOfEmployment;
      tempData["StartOfWorkDate"] = moment(
        contractTemplateData.startOfWorkDate
      ).toDate();
      tempData["EndOfWorkDate"] = moment(
        contractTemplateData.endOfWorkDate
      ).toDate();
      tempData["EmployeeName"] = contractTemplateData.employeeName;
      tempData["EmployeeAddress"] = contractTemplateData.employeeAddress;
      tempData["Salary"] = contractTemplateData.salary;
      tempData["ContractDetails"] = contractTemplateData.contractDetails;
      if (
        contractTemplateData.contractDetails[0] &&
        contractTemplateData.contractDetails[0].templateType
      ) {
        setDesignationType(
          contractTemplateData.contractDetails[0].templateType
        );
      }
      setBasicDetails(tempData);
    }
  }, []);

  useEffect(() => {
    getDisplayData();
    // eslint-disable-next-line
  }, [BasicDetails]);
  const { isLoading: isLoadingOfficeDetail, data: officeDetail } =
    useOfficeDetail(decodeId(officeId));

  const isDataInLocationObject = !!location?.state?.contract;
  let {
    isLoading: isLoadingTemplate,
    data: contractTemplateData,
    error: contractTemplateError,
  } = useContractTemplateById(contractId, { enabled: !isDataInLocationObject });
  if (
    !isDataInLocationObject &&
    !isLoadingTemplate &&
    !contractTemplateData &&
    contractTemplateError
  ) {
    toast.error(contractTemplateError.message, {
      id: "error",
    });
    history.goBack();
  }
  if (
    !isDataInLocationObject &&
    !isLoadingTemplate &&
    contractTemplateData &&
    BasicDetails.ContractDetails.length === 0
  ) {
    let tempData = { ...BasicDetails };
    tempData["Date"] = moment(contractTemplateData.date).toDate();
    tempData["BusinessLegalName"] = contractTemplateData.businessLegalName;
    tempData["Position"] = contractTemplateData.position;
    tempData["OfficeAddress"] = contractTemplateData.officeAddress;
    tempData["LengthOfEmployment"] = contractTemplateData.lengthOfEmployment;
    tempData["StartOfWorkDate"] = moment(
      contractTemplateData.startOfWorkDate
    ).toDate();
    tempData["EndOfWorkDate"] = moment(
      contractTemplateData.endOfWorkDate
    ).toDate();
    tempData["EmployeeName"] = contractTemplateData.employeeName;
    tempData["EmployeeAddress"] = contractTemplateData.employeeAddress;
    tempData["Salary"] = contractTemplateData.salary;
    tempData["ContractDetails"] = contractTemplateData.contractDetails;
    if (
      contractTemplateData.contractDetails[0] &&
      contractTemplateData.contractDetails[0].templateType
    ) {
      setDesignationType(contractTemplateData.contractDetails[0].templateType);
    }
    setBasicDetails(tempData);
  }
  if (isDataInLocationObject) {
    contractTemplateData = location?.state?.contract;
  }
  const goBack = () => history.goBack();

  const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
  };

  const replaceAll = (str, find, replace) => {
    return str.replace(new RegExp(escapeRegExp(find), "g"), replace);
  };

  const getDisplayData = () => {
    const contractData = JSON.parse(
      JSON.stringify(BasicDetails.ContractDetails)
    );
    if (contractData) {
      const displayData = contractData.map((e) => {
        replaceableValue.forEach((val) => {
          if (e.text != "" && e.text != null && BasicDetails[val.key]) {
            if (val.key.includes("Date")) {
              e.text = replaceAll(
                e.text,
                val.text,
                moment(BasicDetails[val.key]).format("DD-MM-YYYY")
              );
            } else {
              e.text = replaceAll(e.text, val.text, BasicDetails[val.key]);
            }
          }
        });
        if (
          e.text != "" &&
          e.text != null &&
          e.text.includes("[Account Owner Name]")
        ) {
          let name = officeDetail
            ? officeDetail.owner.firstName + " " + officeDetail.owner.lastName
            : "";
          e.text = replaceAll(e.text, "[Account Owner Name]", name);
        }
        return e;
      });
      setDisplayData(displayData);
    }
  };

  return (
    <Page onBack={goBack}>
      {(isLoadingOfficeDetail || isLoadingTemplate) && <Loader />}

      <div className="container container-smd p-0">
        <h2 className="page-title">
          {officeDetail && officeDetail.name ? officeDetail.name : ""}
        </h2>
        <Text size="14px" color="#000" weight="300">
          {t("contracts.yourContract")}
        </Text>
        <div>
          <div className={styles["contract-step-form"]}>
            {designationType === 1 ? (
              <PreviewPersonnelContract
                officeDetail={officeDetail}
                contractData={BasicDetails}
                contractFormDisplayData={contractFormDisplayData}
                contractDetails={contractTemplateData}
              />
            ) : (
              <PreviewAssociateContract
                officeDetail={officeDetail}
                contractData={BasicDetails}
                contractFormDisplayData={contractFormDisplayData}
                contractDetails={contractTemplateData}
              />
            )}
          </div>
        </div>
      </div>
    </Page>
  );
}

export default withTranslation()(OwnerViewContract);
