import React, { Fragment, useState } from "react";
import { withTranslation } from "react-i18next";
import Card from "components/Card";
import Text from "components/Text";
import styles from "./SignContractForm.module.scss";
import Input from "components/Input";
import {
  BlobServiceClient,
  AnonymousCredential,
  newPipeline,
} from "@azure/storage-blob";
import {
  useSastoken,
  useAcceptContractMutation,
} from "repositories/contract-repository";
import { v4 as uuidv4 } from "uuid";
import Loader from "components/Loader";
import DatePicker from "react-datepicker";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import ConfirmContractModal from "../ConfirmContractModal";
import moment from "moment";
import constants from "../../../../../constants";
function SignContractForm({ contractId, setSignContract, t }) {
  const [confirmSentModal, setConfirmSentModal] = useState(false);
  const [loader, setloader] = useState(false);
  const [staffYoursTruly, setStaffYoursTruly] = useState("Your's truly,");
  const [yoursTrulyError, setYoursTrulyError] = useState("");
  const [staffName, setStaffName] = useState(null);
  const [staffNameError, setStaffNameError] = useState("");
  const [signature, setSignature] = useState("");
  const [signatureError, setSignatureError] = useState("");
  const [acceptedDate, setAcceptedDate] = useState(new Date());
  const accountName = `${process.env.REACT_APP_AZURE_STORAGE_ACCOUNT}`;
  const profile = useSelector((state) => state.userProfile.profile);
  const acceptContractMutation = useAcceptContractMutation();
  if (profile.firstName && staffName === null) {
    setStaffName(profile.firstName + " " + profile.lastName);
  }
  const { data: sasString } = useSastoken();
  const upload = (file) => {
    const pipeline = newPipeline(new AnonymousCredential());
    const containerName = `${constants.containerName.CONTAINER_NAME_CONTRACTS_SIGNATURE}`;
    const fileExtenstion = file.name.split(".").pop();
    const blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net?${sasString}`,
      pipeline
    );
    async function main() {
      const containerClient =
        blobServiceClient.getContainerClient(containerName);
      const blobName = `${uuidv4()}.${fileExtenstion}`;
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);
      const blobOptions = {
        blobHTTPHeaders: { blobContentType: file.type },
      };
      try {
        const uploadBlobResponse = await blockBlobClient.uploadBrowserData(
          file,
          blobOptions
        );
        if (
          uploadBlobResponse._response.status === 201 ||
          uploadBlobResponse._response.status === 200
        ) {
          setloader(false);
          const fileName = uploadBlobResponse._response.request.url.split("?");
          const newSignature =
            `${constants.containerName.CONTAINER_NAME_CONTRACTS_SIGNATURE}/` +
            fileName[0].split(
              `${constants.containerName.CONTAINER_NAME_CONTRACTS_SIGNATURE}/`
            )[1];
          setSignature(newSignature);
        } else {
          setloader(false);
        }
      } catch (e) {
        setloader(false);
      }
    }
    main();
  };

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
      const fileLimit = Math.round(fsize / 1024);
      let fileSizeLimit = true;
      const extFile = files.length ? files[0].type : "";

      if (fileLimit >= 5120) {
        setSignatureError(`${t("form.errors.fileSize")}`);
        fileSizeLimit = false;
        setloader(false);
      }
      if (extFile != "" && fileSizeLimit) {
        if (
          extFile == "image/jpeg" ||
          extFile == "image/jpg" ||
          extFile == "image/png"
        ) {
          try {
            setSignature(null);
            upload(files[0]);
            setSignatureError("");
          } catch (e) {
            setSignatureError(`${t("form.errors.imageUpload")}`);
            setloader(false);
          }
        } else {
          setSignatureError(`${t("form.errors.invalidFile")}`);
          setloader(false);
        }
      }
    }
  };
  const acceptOffer = () => {
    if (!staffYoursTruly) {
      setYoursTrulyError(
        t("form.errors.emptyField", { field: t("contracts.yourTruly") })
      );
      return;
    }
    if (!staffName) {
      setStaffNameError(
        t("form.errors.emptyField", { field: t("superAdmin.staffName") })
      );
      return;
    }
    if (!signature) {
      setSignatureError(t("contracts.pleaseUploadImageSignature"));
      return;
    }
    if (staffYoursTruly && staffYoursTruly.length > 52) {
      setYoursTrulyError(t("form.errors.maxLimit", { limit: "52" }));
      return;
    }
    if (staffName && staffName.length > 52) {
      setStaffNameError(t("form.errors.maxLimit", { limit: "52" }));
      return;
    }

    setConfirmSentModal(true);
  };
  const acceptContract = async () => {
    setloader(true);

    const data = {
      contractId,
      staffYoursTruly,
      staffName,
      signature,
      acceptedDate: moment(acceptedDate).format("YYYY-MM-DDTHH:mm"),
    };
    try {
      await acceptContractMutation.mutateAsync(data);
      toast.success(t("contracts.contractUploadedSuccessfully"));
      setloader(false);
      window.location.reload();
    } catch (e) {
      setloader(false);
      toast.error(e.message);
    }
  };
  return (
    <Fragment>
      {loader && <Loader />}

      <div className={styles["step-form-wrapper"]}>
        <div>
          <Card
            radius="10px"
            marginBottom="10px"
            padding="30px"
            shadow="0 0 15px 0 rgba(0, 0, 0, 0.08)"
            className={"pb-1 " + styles["card-container"]}
          >
            <Input
              Type="text"
              Name={"truly"}
              Placeholder={t("contracts.yourTruly")}
              Value={staffYoursTruly}
              HandleChange={(e) => setStaffYoursTruly(e.currentTarget.value)}
              Error={!staffYoursTruly && yoursTrulyError ? yoursTrulyError : ""}
            />
            <div className={styles["-mt-30"]}>
              <Input
                Type="text"
                Name={"staffName"}
                Placeholder={t("superAdmin.staffName")}
                Value={staffName}
                HandleChange={(e) => setStaffName(e.currentTarget.value)}
                Error={!staffName && staffNameError ? staffNameError : ""}
              />
            </div>
            <div className={styles["auth-signbox"]}>
              <Text size="13px" marginBottom="5px" color="#79869a">
                {t("contracts.authorisedSignature")}
              </Text>
              <Text
                size="10px"
                marginBottom="12px"
                weight="500"
                color="#79869a"
              >
                {t("contracts.pleaseUploadImageSignature")}
              </Text>
              {signature != "" && signature != null && (
                <div className="sign-img">
                  <img
                    src={
                      `https://${accountName}.blob.core.windows.net/` +
                      signature
                    }
                    alt="signature"
                  />
                </div>
              )}

              <div className={styles["upload-border"]}>
                <div className={styles["upload-btn-wrapper"]}>
                  <div className={styles["upload-btn"]}>Upload Signature</div>
                  <input
                    type="file"
                    name="signature"
                    onChange={(e) => fileChange(e)}
                  />
                  {!signature && signatureError && (
                    <span className="error-msg">{signatureError}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="c-field">
              <label>{t("accountOwner.date")} </label>
              <div className="d-flex inputdate">
                <DatePicker
                  selected={acceptedDate}
                  onChange={(e) => setAcceptedDate(e)}
                  dateFormat="dd-MM-yyyy"
                  className="c-form-control"
                  minDate={new Date()}
                />
              </div>
            </div>
          </Card>
        </div>

        <div className="prev-next-buttons">
          <div>
            <div className="next-step-col">
              <button
                className="button button-round button-shadow mr-md-4"
                onClick={() => {
                  acceptOffer();
                }}
              >
                {t("contracts.acceptOffer")}
              </button>
              <button
                className="button button-round button-border button-dark"
                onClick={() => {
                  setSignContract(false);
                }}
              >
                {" "}
                {t("cancel")}
              </button>
            </div>
          </div>
        </div>
      </div>
      {confirmSentModal && (
        <ConfirmContractModal
          isModalOpen={confirmSentModal}
          acceptContract={() => acceptContract()}
          closeModal={() => {
            setConfirmSentModal(false);
          }}
        />
      )}
    </Fragment>
  );
}
export default withTranslation()(SignContractForm);
