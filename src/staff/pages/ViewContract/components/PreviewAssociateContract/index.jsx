import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import Text from "components/Text";
import "./PreviewAssociateContract.scss";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import "react-accessible-accordion/dist/fancy-example.css";
import Card from "components/Card";
import * as moment from "moment";

function PreviewAssociateContract({
  contractData,
  contractDetails,
  contractFormDisplayData,
  t,
}) {
  const [expandArray, setExpandArray] = useState([]);
  const toggleItem = (id) => {
    let temp = [...expandArray];
    const index = temp.indexOf(id);
    if (index > -1) {
      temp.splice(index, 1);
    } else {
      temp.push(id);
    }
    setExpandArray(temp);
  };
  const collapseAll = (collpase) => {
    if (collpase) {
      setExpandArray([0, 1, 2, 3, 4]);
    } else {
      setExpandArray([]);
    }
  };
  let serialNo = 0;
  let signatureData = contractFormDisplayData.filter(
    (data) =>
      data.inputType == 3 && data.typeOrder != null && data.stepNumber == 6
  );
  return (
    <div className="container container-smd p-0">
      <Card
        radius="10px"
        marginBottom="10px"
        padding="30px"
        shadow="0 0 15px 0 rgba(0, 0, 0, 0.08)"
        className={["into-card"]}
      >
        <Text size="14px" color="#102c42" weight="600" marginBottom="0px">
          {contractFormDisplayData.map(
            (data, key) =>
              !data.isMainSection &&
              data.stepNumber == 1 && (
                <span key={key}>
                  {data.text}
                  <br />
                </span>
              )
          )}
        </Text>
      </Card>
      <div className={["expand-collapse-wraper"]}>
        <div className="link-btn mr-4" onClick={() => collapseAll(true)}>
          Expand All
        </div>
        <div className="link-btn" onClick={() => collapseAll(false)}>
          Collapse All
        </div>
      </div>
      <Accordion
        className={["contract-detail-accordion associate-accordion"]}
        allowMultipleExpanded
        allowZeroExpanded
      >
        <AccordionItem
          dangerouslySetExpanded={expandArray.includes(0)}
          onClick={() => toggleItem(0)}
        >
          <AccordionItemHeading>
            <AccordionItemButton>{t("contracts.summary")}</AccordionItemButton>
          </AccordionItemHeading>
          {contractData && (
            <AccordionItemPanel>
              <div className="c-field">
                <label> {t("contracts.dateContract")}</label>
                <p>{moment(contractData.Date).format("DD-MM-YYYY")}</p>
              </div>
              <div className="c-field">
                <label> {t("contracts.businessLegalName")}</label>
                <p>{contractData.BusinessLegalName}</p>
              </div>
              <div className="c-field">
                <label> {t("contracts.position")}</label>
                <p>{contractData.Position}</p>
              </div>
              <div className="c-field">
                <label> {t("form.fields.officeAddress")}</label>
                <p>{contractData.OfficeAddress}</p>
              </div>
              <div className="c-field">
                <label> {t("contracts.lengthEmployment")}</label>
                <p>{contractData.LengthOfEmployment}</p>
              </div>
              <div className="c-field">
                <label> {t("contracts.startWork")}</label>
                <p>
                  {moment(contractData.StartOfWorkDate).format("DD-MM-YYYY")}
                </p>
              </div>
              <div className="c-field">
                <label> {t("contracts.endWork")}</label>
                <p>{moment(contractData.EndOfWorkDate).format("DD-MM-YYYY")}</p>
              </div>
              <div className="c-field">
                <label> {t("contracts.employeeName")}</label>
                <p>{contractData.EmployeeName}</p>
              </div>
              <div className="c-field">
                <label> {t("contracts.employeeAddress")}</label>
                <p>{contractData.EmployeeAddress}</p>
              </div>
              <div className="c-field">
                <label> {t("contracts.salaryFeeWage")}</label>
                <p>{contractData.Salary}</p>
              </div>
            </AccordionItemPanel>
          )}
        </AccordionItem>
        <AccordionItem
          dangerouslySetExpanded={expandArray.includes(1)}
          onClick={() => toggleItem(1)}
        >
          <AccordionItemHeading>
            <AccordionItemButton>
              {t("contracts.ownerAndTheAssociateAgree")}
            </AccordionItemButton>
          </AccordionItemHeading>
          {contractFormDisplayData.map(
            (data, key) =>
              data.isActive &&
              data.isHtmlContent &&
              data.isMainSection &&
              data.stepNumber == 1 && (
                <AccordionItemPanel key={key}>
                  <div className="panel-body">
                    <label>
                      {++serialNo}. {data.title}
                    </label>
                    <div dangerouslySetInnerHTML={{ __html: data.text }}></div>
                  </div>
                </AccordionItemPanel>
              )
          )}
        </AccordionItem>
        <AccordionItem
          dangerouslySetExpanded={expandArray.includes(2)}
          onClick={() => toggleItem(2)}
        >
          <AccordionItemHeading>
            <AccordionItemButton>
              {t("contracts.theOwnerAgree")}
            </AccordionItemButton>
          </AccordionItemHeading>
          {contractFormDisplayData.map(
            (data, key) =>
              data.isActive &&
              data.isHtmlContent &&
              data.isMainSection &&
              data.stepNumber == 2 && (
                <AccordionItemPanel key={key}>
                  <div className="panel-body">
                    <label>
                      {++serialNo}. {data.title}
                    </label>
                    <div dangerouslySetInnerHTML={{ __html: data.text }}></div>
                  </div>
                </AccordionItemPanel>
              )
          )}
        </AccordionItem>
        <AccordionItem
          dangerouslySetExpanded={expandArray.includes(3)}
          onClick={() => toggleItem(3)}
        >
          <AccordionItemHeading>
            <AccordionItemButton>
              {t("contracts.theAssociateAgree")}
            </AccordionItemButton>
          </AccordionItemHeading>
          {contractFormDisplayData.map(
            (data, key) =>
              data.isActive &&
              data.isHtmlContent &&
              data.isMainSection &&
              (data.stepNumber == 3 ||
                data.stepNumber == 4 ||
                data.stepNumber == 5) && (
                <AccordionItemPanel key={key}>
                  <div className="panel-body">
                    <label>
                      {++serialNo}. {data.title}
                    </label>
                    <div dangerouslySetInnerHTML={{ __html: data.text }}></div>
                  </div>
                </AccordionItemPanel>
              )
          )}
        </AccordionItem>
        <AccordionItem
          dangerouslySetExpanded={expandArray.includes(4)}
          onClick={() => toggleItem(4)}
        >
          <AccordionItemHeading>
            <AccordionItemButton>{t("contracts.general")}</AccordionItemButton>
          </AccordionItemHeading>
          {contractFormDisplayData.map(
            (data, key) =>
              data.isActive &&
              data.isHtmlContent &&
              data.isMainSection &&
              data.stepNumber == 6 && (
                <AccordionItemPanel key={key}>
                  <div className="panel-body">
                    <label>
                      {++serialNo}. {data.title}
                    </label>
                    <div dangerouslySetInnerHTML={{ __html: data.text }}></div>
                  </div>
                </AccordionItemPanel>
              )
          )}
        </AccordionItem>
      </Accordion>
      {signatureData.map(
        (data, key) =>
          data.inputType == 3 &&
          data.typeOrder == 1 &&
          data.stepNumber == 6 && (
            <div key={key}>
              <Card
                radius="10px"
                marginBottom="10px"
                padding="30px"
                shadow="0 0 15px 0 rgba(0, 0, 0, 0.08)"
                className={["review-card-container"]}
              >
                {data.text}
              </Card>
              <Card
                radius="10px"
                marginBottom="10px"
                padding="30px"
                shadow="0 0 15px 0 rgba(0, 0, 0, 0.08)"
                className={["review-card-container"]}
              >
                <div className="c-field">
                  <label> {signatureData[key + 1].title}</label>
                  <p>{signatureData[key + 2].text} </p>
                </div>
                <div className="sign-img">
                  <img src={signatureData[key + 3].text} alt="signature" />
                </div>
                <div className="c-field">
                  {moment(signatureData[key + 4].text).format("DD-MM-YYYY")}
                </div>
                {contractDetails.status === 3 && (
                  <div>
                    <div className="c-field">
                      <label>
                        {" "}
                        {t("contracts.agreeStaffTermsAndConditions")}
                      </label>
                      <p>{contractDetails.staffName} </p>
                    </div>
                    <div className="sign-img">
                      <img
                        src={contractDetails.staffSignature}
                        alt="signature"
                      />
                    </div>
                    {moment(contractDetails.staffAcceptedDate).format(
                      "DD-MM-YYYY"
                    )}
                  </div>
                )}
              </Card>
            </div>
          )
      )}
    </div>
  );
}

export default withTranslation()(PreviewAssociateContract);
