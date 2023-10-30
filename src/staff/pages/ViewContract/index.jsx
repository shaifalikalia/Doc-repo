import React, { useState, useEffect } from "react";
import { withTranslation } from "react-i18next";
import Text from "components/Text";
import Page from "components/Page";
import styles from "./ViewContract.module.scss";
import { useOfficeDetail } from "repositories/office-repository";
import {
  useContractTemplateById,
  getContractTemplatePdf,
} from "repositories/contract-repository";
import * as moment from "moment";
import PreviewPersonnelContract from "./components/PreviewPersonnelContract";
import PreviewAssociateContract from "./components/PreviewAssociateContract";
import Loader from "components/Loader";
import SignContractForm from "./components/SignContractForm";
import toast from "react-hot-toast";
import { isMobileTab } from "utils";
import FileSaver from "file-saver";
import { decodeId } from "utils";

function ViewContract({ history, match, location, t }) {
  let officeName = null;
  if (location.state && location.state.officeName) {
    officeName = location.state.officeName;
  }
  const officeId = match.params.officeId;
  const contractId = match.params.contractId;
  const [signContract, setSignContract] = useState(false);
  const [pdfLoader, setPdfLoader] = useState(false);
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
    getDisplayData();
    //eslint-disable-next-line
  }, [BasicDetails]);
  const { isLoading: isLoadingOfficeDetail, data: officeDetail } =
    useOfficeDetail(decodeId(officeId));

  const {
    isLoading: isLoadingTemplate,
    data: contractTemplateData,
    error: contractTemplateError,
  } = useContractTemplateById(contractId);
  if (!isLoadingTemplate && !contractTemplateData && contractTemplateError) {
    toast.error(contractTemplateError.message, {
      id: "error",
    });
    history.goBack();
  }
  if (
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

  const b64toBlob = (b64Data, contentType = "", sliceSize = 512) => {
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
  };

  const exportContract = async () => {
    setPdfLoader(true);
    try {
      const resp = await getContractTemplatePdf(contractId);
      if (resp) {
        const blob = b64toBlob(resp, "application/pdf");
        if (isMobileTab()) {
          FileSaver.saveAs(blob);
        } else {
          const blobUrl = URL.createObjectURL(blob);
          const pdfWindow = window.open("");
          pdfWindow.document.write(
            "<iframe width='100%' height='100%' src='" + blobUrl + "'></iframe>"
          );
          pdfWindow.document.close();
        }
      }
      setPdfLoader(false);
    } catch (e) {
      setPdfLoader(false);
    }
  };

  return (
    <Page onBack={goBack}>
      {(pdfLoader || isLoadingOfficeDetail || isLoadingTemplate) && <Loader />}

      <div className="container container-smd p-0">
        <h2 className="page-title">
          {officeDetail && officeDetail.name ? officeDetail.name : ""}
        </h2>
        <Text size="14px" color="#000" weight="300">
          {t("contracts.yourContract")}
        </Text>
        {!signContract && (
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

            <div className="prev-next-buttons">
              <div>
                <button
                  className="button button-round button-border button-dark"
                  style={{ display: "none" }}
                ></button>
              </div>

              {contractTemplateData && contractTemplateData.status === 2 ? (
                <div className="next-step-col">
                  <div
                    className="link-btn cancel-btn"
                    onClick={() => {
                      exportContract();
                    }}
                  >
                    {t("contracts.exportEmploymentContract")}
                  </div>
                  <button
                    className="button button-shadow button-round"
                    onClick={() => {
                      setSignContract(true);
                    }}
                  >
                    {t("contracts.signEmploymentContract")}
                  </button>
                </div>
              ) : (
                <div className="next-step-col">
                  <button
                    className="button button-round"
                    onClick={() => {
                      exportContract();
                    }}
                  >
                    {t("contracts.exportEmploymentContract")}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {signContract && (
          <div className={styles["contract-step-form"]}>
            <Text size="18px" color="#111b45" weight="600" marginBottom="30px">
              {t("contracts.agreeStaffTermsAndConditions")}
            </Text>
            <SignContractForm
              contractId={contractId}
              setSignContract={setSignContract}
            />
          </div>
        )}
      </div>
    </Page>
  );
}

export default withTranslation()(ViewContract);
