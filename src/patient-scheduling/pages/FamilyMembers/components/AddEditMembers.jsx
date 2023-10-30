import React, { Fragment, useState, useEffect } from "react";
import { withTranslation } from "react-i18next";
import Page from "components/Page";
import Card from "components/Card";
import Input from "components/Input";
import { Col, Row } from "reactstrap";

import DatePicker from "react-datepicker";
import moment from "moment";
import {
  validateEmail,
  testRegexCheck,
  isOver18Years,
  getBlobnameFromUrl,
  decodeId,
} from "utils";
import { cloneDeep } from "lodash";
import useUploadService from "hooks/useUploadService";
import {
  addFamilyMember,
  getSingleMemberDetails,
  updateAddedFamilyMember,
} from "repositories/family-member-repository";
import Loader from "components/Loader";
import toast from "react-hot-toast";
import CustomDropdown from "components/Dropdown";
import { useParams } from "react-router-dom";
import FamilyModal from "./AddedMembers/FamilyModal";
import styles from "./../../FamilyMembers/familyMembers.module.scss";
import "./../../FamilyMembers/familyMembers.scss";
import constants from "../../../../constants";

/* Form initial values */
let scheme = {
  firstName: "",
  lastName: "",
  gender: "",
  dateOfBirth: "",
  relation: "",
  emailAddress: "",
  image: "",
  isNotificationReceive: false,
};

const AddEditMembers = ({ history, t }) => {
  /* for go back to previous page */
  const onBack = () => history.push(`/family-members`);

  /* get member Id from the url */
  let { memberId } = useParams();
  memberId = decodeId(memberId);

  /* Intializations & Declarations */
  const [formFields, setformFields] = useState(scheme);
  const [errors, setErrors] = useState({});
  const [singleMemberDetail, setSingleMemberDetail] = useState({});
  const [confirmModal, setConfirmModal] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [imageFile, setImageFile] = useState({
    path: "",
    file: null,
  });
  const genderOption = constants.genderOptions;
  const relations = constants.relationOptions;
  const { upload: uploadImage } = useUploadService();

  /* extract values from form object */
  const {
    firstName,
    lastName,
    gender,
    dateOfBirth,
    relation,
    emailAddress,
    isNotificationReceive,
  } = formFields;

  const containerName = "familymemberprofile";
  let today = new Date();
  let yesterday = new Date(today.setDate(today.getDate() - 1));

  /**
   * get single member details
   */
  useEffect(() => {
    if (memberId) {
      getMemberDetails();
    }
  }, []);

  /* error messages */
  const errorMessage = {
    firstName: t("form.errors.emptyField", {
      field: t("form.fields.firstName"),
    }),
    lastName: t("form.errors.emptyField", { field: t("form.fields.lastName") }),
    gender: t("form.errors.emptyField", { field: t("familyMembers.gender") }),
    relation: t("form.errors.emptyField", {
      field: t("familyMembers.relation"),
    }),
    dateOfBirth: t("form.errors.emptyField", {
      field: t("familyMembers.dateOfBirth"),
    }),
    emailAddress: t("form.errors.emptyField", {
      field: t("familyMembers.emailAddress"),
    }),
  };

  /**
   * @method: [isValid]
   * @description: use this method to check validations
   */
  const isValid = () => {
    const errorCopy = {};
    let isValidField = true;

    if (!firstName?.trim()?.length) {
      errorCopy.firstName = errorMessage.firstName;
      isValidField = false;
    }

    if (!lastName?.trim()?.length) {
      errorCopy.lastName = errorMessage.lastName;
      isValidField = false;
    }

    if (!gender) {
      errorCopy.gender = errorMessage.gender;
      isValidField = false;
    }

    if (!relation) {
      errorCopy.relation = errorMessage.relation;
      isValidField = false;
    }

    if (!dateOfBirth) {
      errorCopy.dateOfBirth = errorMessage.dateOfBirth;
      isValidField = false;
    }

    if (isOver18Years(dateOfBirth)) {
      if (validateEmail(emailAddress)) {
        delete errorCopy.emailAddress;
      } else {
        errorCopy.emailAddress = t("form.errors.invalidValue", {
          field: t("form.fields.emailAddress"),
        });
        isValidField = false;
      }
    }

    setErrors({ ...errorCopy });
    return isValidField;
  };

  /**
   * @method: [handleChange]
   * @param {object} event
   * @description: use this method to handle when the event is change
   */
  const handleChange = (event) => {
    if (!testRegexCheck(event.target.value)) return;

    const errorCopy = cloneDeep(errors);
    const { name, value } = event.target;

    if (!value.trim()?.length) {
      errorCopy[name] = errorMessage[name];
    }

    if (value?.trim()?.length) {
      delete errorCopy[name];
    }

    setformFields((prevProps) => ({ ...prevProps, [name]: value }));
    setErrors(errorCopy);
  };

  const handleCustomDropDown = (id, name) => {
    const eventObject = {
      target: {
        value: id.toString(),
        name: name,
      },
    };

    handleChange(eventObject);
  };

  /**
   * @member: [handleEmailChange]
   * @description: use this method to handle when the email event is change
   * @param {object} event
   */
  const handleEmailChange = (event) => {
    const errorCopy = cloneDeep(errors);
    const { name, value } = event.target;

    if (!value.trim().length) {
      errorCopy.emailAddress = errorMessage.emailAddress;
    } else {
      if (validateEmail(value)) {
        delete errorCopy.emailAddress;
      } else {
        errorCopy.emailAddress = t("form.errors.invalidValue", {
          field: t("form.fields.emailAddress"),
        });
      }
    }

    setformFields((prevProps) => ({ ...prevProps, [name]: value }));
    setErrors(errorCopy);
  };

  /**
   * @member: [handleDateChange]
   * @description: use this method to handle when the date event is change
   * @param {object} event
   */
  const handleDateChange = (date) => {
    setformFields({ ...formFields, dateOfBirth: date });
    setErrors((prev) => {
      delete prev.dateOfBirth;
      return prev;
    });
  };

  /**
   * @member: [getMemberDetails]
   * @description: use this method to get the single member details
   * @param {object} event
   */
  const getMemberDetails = async () => {
    setShowLoader(true);
    try {
      let response = await getSingleMemberDetails(memberId);
      const memberData = response?.data;
      setSingleMemberDetail(memberData);

      if (memberData) {
        setformFields({
          ...memberData,
          dateOfBirth: new Date(memberData.dateOfBirth.toString()),
          emailAddress: memberData.email,
          isNotificationReceive:
            memberData.isNotificationReceiveForFamilyMember,
        });

        if (memberData.image) {
          setImageFile({
            path: memberData.image,
            file: null,
          });
        }
      }
    } catch (error) {
      toast.error(error.message);
    }

    setShowLoader(false);
  };

  /**
   * @member: [onSave]
   * @description: call when we click on save button
   */
  const onSave = () => {
    if (!isValid()) return;
    setConfirmModal(true);
  };

  /**
   * mehtod: [confirmSubmitRequest]
   * @description: call when we confirm to submit
   */
  const confirmSubmitRequest = async () => {
    setConfirmModal(false);
    setShowLoader(true);

    try {
      let imageBlobName;

      if (imageFile && imageFile.file && imageFile.path) {
        const [err, blobData] = await uploadImage(
          imageFile.file,
          containerName
        );

        let fileName = blobData.blobUrl;

        imageBlobName = `${containerName}/${blobData.blobName}`;

        if (err) {
          throw new Error(err);
        }

        setImageFile({
          path: fileName,
          file: null,
        });
      }

      if (imageFile && imageFile.path && !imageFile.file) {
        imageBlobName = `${containerName}/${getBlobnameFromUrl(
          imageFile.path,
          containerName
        )}`;
      }

      const params = {
        firstName: firstName?.trim(),
        lastName: lastName?.trim(),
        DateOfBirth: moment(dateOfBirth).format("YYYY-MM-DD"),
        Gender: +gender,
        Relation: +relation,
        Image: imageBlobName,
        Email: emailAddress ? emailAddress : null,
        isNotificationReceiveForFamilyMember: isNotificationReceive
          ? isNotificationReceive
          : false,
      };

      /* this parameter added while we edit the form  */
      if (memberId) {
        params.patientFamilyMemberId = memberId;
      }

      let res = memberId
        ? await updateAddedFamilyMember(params)
        : await addFamilyMember(params);
      toast.success(res.message);
      history.push(constants.routes.familyMembers);
    } catch (err) {
      toast.error(err.message);
    }

    setShowLoader(false);
  };

  const getMemberImage = (event) => {
    if (!event || (event && !event.target)) return;

    const files = event.target.files;
    if (!files.length) return;

    let fileSupportedFormat = ["image/png", "image/jpg", "image/jpeg"];
    if (!fileSupportedFormat.includes(files[0]?.type)) {
      toast.error(t("fileNotSupported"));
      return;
    }

    const fsize = files[0].size;
    const fileLimit = Math.round(fsize / 1024);

    if (fileLimit >= 1024 * 5) {
      setErrors((prevProps) => ({
        ...prevProps,
        image: t("form.errors.fileSize"),
      }));
      return false;
    } else {
      setErrors((prevProps) => ({
        ...prevProps,
        image: "",
      }));

      setImageFile({
        path: URL.createObjectURL(event.target.files[0]),
        file: event.target.files[0],
      });
    }
  };

  return (
    <Fragment>
      <Page
        className={"add-family-member-page"}
        title={
          memberId
            ? t("familyMembers.editFamilyMember")
            : t("familyMembers.addFamilyMember")
        }
        onBack={onBack}
      >
        {showLoader && <Loader />}

        <Card
          className={styles["family-profile-card"]}
          radius="10px"
          marginBottom="10px"
          cursor="default"
          shadow="0 0 15px 0 rgba(0, 0, 0, 0.08)"
        >
          <Row>
            <Col lg="9" className="order-2 order-lg-1">
              <div className={styles["profile-form-col"]}>
                <div className={styles["inner-form"]}>
                  <Input
                    Title={t("familyMembers.firstName")}
                    Type="text"
                    Name={"firstName"}
                    Placeholder={t("form.placeholder1", {
                      field: t("familyMembers.firstName"),
                    })}
                    Error={errors.firstName}
                    Value={firstName}
                    HandleChange={handleChange}
                    MaxLength={50}
                  />
                  <Input
                    Title={t("familyMembers.lastName")}
                    Type="text"
                    Name={"lastName"}
                    Placeholder={t("form.placeholder1", {
                      field: t("familyMembers.lastName"),
                    })}
                    Error={errors.lastName}
                    Value={lastName}
                    HandleChange={handleChange}
                    MaxLength={50}
                  />
                  <div className="c-field">
                    <label>Gender</label>
                    <div className="custom-dropdown-only">
                      <CustomDropdown
                        options={genderOption}
                        selectedOption={gender}
                        selectOption={(id) =>
                          handleCustomDropDown(id, "gender")
                        }
                      />
                      {errors?.gender && (
                        <span className="error-msg">{errors.gender}</span>
                      )}
                    </div>
                  </div>
                  <div className="c-field">
                    <label>Relation</label>
                    <div className="custom-dropdown-only">
                      <CustomDropdown
                        className="custom-dropdown-only"
                        options={relations}
                        selectedOption={relation}
                        selectOption={(id) =>
                          handleCustomDropDown(id, "relation")
                        }
                      />
                    </div>
                    {errors?.relation && (
                      <span className="error-msg">{errors.relation}</span>
                    )}
                  </div>
                  <div className="c-field">
                    <label>{t("familyMembers.dateOfBirth")}</label>
                    <div className="d-flex inputdate custom-family-datepicker">
                      <DatePicker
                        dateFormat="dd-MM-yyyy"
                        className="c-form-control"
                        Name={"dateOfBirth"}
                        onSelect={handleDateChange}
                        maxDate={yesterday}
                        showMonthDropdown
                        showYearDropdown
                        selected={dateOfBirth}
                      />
                    </div>
                    {errors?.dateOfBirth && (
                      <span className="error-msg">{errors.dateOfBirth}</span>
                    )}
                    {isOver18Years(dateOfBirth) && (
                      <span className={"error-msg " + styles["terms-error"]}>
                        {" "}
                        {t("familyMembers.registerAccountForAbove18")}
                      </span>
                    )}
                  </div>
                  {isOver18Years(dateOfBirth) && (
                    <>
                      <Input
                        Title={t("familyMembers.emailAddress")}
                        Type="email"
                        Name={"emailAddress"}
                        Placeholder={t("form.placeholder1", {
                          field: t("familyMembers.emailAddress"),
                        })}
                        Error={errors.emailAddress}
                        Value={emailAddress || ""}
                        Disabled={memberId && singleMemberDetail.email}
                        HandleChange={handleEmailChange}
                        MaxLength={225}
                      />
                      <span
                        className={
                          "error-msg " + styles["custom-email-both-error"]
                        }
                      >
                        {t("familyMembers.emailInvitaion")}
                      </span>
                      <div className="ch-checkbox">
                        <label className="mb-4">
                          <input
                            type="checkbox"
                            checked={isNotificationReceive}
                            onChange={(e) => {
                              setformFields({
                                ...formFields,
                                isNotificationReceive: e.target.checked,
                              });
                            }}
                          />
                          <span className="notify">
                            {" "}
                            {t("familyMembers.notification")}
                          </span>
                        </label>
                      </div>
                    </>
                  )}
                </div>
                <button
                  className={
                    styles["button-mobile"] +
                    " button button-round button-shadow mr-4 mt-3 " +
                    styles["save-button"]
                  }
                  title={t("save")}
                  onClick={onSave}
                >
                  {t("save")}
                </button>
                <button
                  className={
                    styles["button-mobile"] +
                    " button button-round button-dark button-border btn-mobile-link"
                  }
                  title={t("cancel")}
                  onClick={onBack}
                >
                  {t("cancel")}
                </button>
              </div>
            </Col>
            <Col lg="3" className="order-1 order-lg-2">
              <div className={"profile-setup-block "}>
                <div className="profile-form ">
                  <div className=" file-upload-container pl-0">
                    <div className="file-upload-field profile-image-col">
                      <div className={"img1 profile-pic"}>
                        <img
                          src={
                            imageFile.path
                              ? imageFile.path
                              : require("assets/images/staff-default.svg")
                                  .default
                          }
                          alt="upload"
                        />
                      </div>
                      <div className="ch-upload-button">
                        <input
                          id="fileUpload"
                          type="file"
                          accept=".png, .jpg, .jpeg"
                          onChange={getMemberImage}
                        />
                        <span>
                          <img
                            src={
                              require("assets/images/upload-image.svg").default
                            }
                            alt="upload"
                          />
                        </span>
                      </div>
                    </div>
                    {errors?.image && (
                      <span className="error-msg">{errors.image}</span>
                    )}
                    <span className="upload-help-text">
                      {t("clickHereToUploadPicture")}
                    </span>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Card>

        <FamilyModal
          isFamilyModalOpen={confirmModal}
          setIsFamilyModalOpen={setConfirmModal}
          title={
            memberId
              ? t("familyMembers.editFamilyMember")
              : t("familyMembers.addFamilyMember")
          }
          subTitle1={
            isOver18Years(dateOfBirth)
              ? t("familyMembers.confirmMsgAbove18", { emailId: emailAddress })
              : t("familyMembers.confirmMsgBelow18")
          }
          subTitle2={t("familyMembers.sureForAddMember")}
          leftBtnText={t("save")}
          rightBtnText={t("cancel")}
          onConfirm={confirmSubmitRequest}
        />
      </Page>
    </Fragment>
  );
};

export default withTranslation()(AddEditMembers);
