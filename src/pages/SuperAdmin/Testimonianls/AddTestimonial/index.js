import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  getTestimonialCat,
  addTestimonial,
  editTestimonial,
  getSastoken,
  updateTestimonialImage,
} from "actions/index";
import {
  BlobServiceClient,
  AnonymousCredential,
  newPipeline,
} from "@azure/storage-blob";
import { v4 as uuidv4 } from "uuid";
/*components*/
import _isLoading from "hoc/isLoading";
import Input from "components/Input";
import Select from "components/Select";
import Toast from "components/Toast";
import Loader from "components/Loader";
import { Modal, ModalBody, ModalFooter } from "reactstrap";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { withTranslation } from "react-i18next";
import { testRegexCheck } from "utils";

class AddTestimonial extends Component {
  state = {
    name: "",
    designation: "",
    imageUrl: "",
    content: "",
    categoryId: "",
    isProps: true,
    errors: {},
    blobLoader: false,
    isToastView: false,
    blobFileName: null,
    isCropperOpen: false,
    selectedFile: "",
    selectedFileExtension: "",
    crop: {},
  };

  componentDidMount() {
    this.props.getTestimonialCat();
    this.props.getSastoken();
    if (
      this.props.location.pathname === "/edit-testimonial" &&
      !this.props.location.state
    ) {
      this.props.history.push("/manage-testimonial");
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (
      props.location.pathname === "/edit-testimonial" &&
      props.location.state &&
      Object.keys(props.location.state).length > 0 &&
      state.isProps
    ) {
      return {
        name: props.location.state.name,
        designation: props.location.state.designation,
        imageUrl: props.location.state.imageUrl,
        content: props.location.state.content,
        categoryId: props.location.state.category.id,
        blobFileName: props.location.state.imageUrl.split(
          "testimonial-images/"
        ),
      };
    }
    return null;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.statusMessage !== this.props.statusMessage) {
      window.scrollTo(0, 0);
      this.setState({ isToastView: true });
      setTimeout(() => {
        if (!this.props.isLoadError && !this.props.imageAdded) {
          this.setState({ isToastView: false });
          this.props.history.push("/manage-testimonial");
        }
        if (this.props.imageAdded) {
          this.setState({ isToastView: false });
        }
      }, 2000);
    }
  }

  InputChange = (event) => {
    this.setState({ isProps: false });
    const { name, value } = event.target;
    let fieldsArray = ["name", "designation"];
    if (fieldsArray.includes(name) && !testRegexCheck(value)) return;
    this.setState({ [name]: value });
  };

  isValid = () => {
    const { name, designation, content, categoryId } = this.state;
    const errors = {};
    let isValid = true;
    const { t } = this.props;
    if (!name) {
      errors.name = t("form.errors.emptyField", {
        field: t("form.fields.name"),
      });
      isValid = false;
    }

    if (!designation) {
      errors.designation = t("form.errors.emptyField", {
        field: t("form.fields.designation"),
      });
      isValid = false;
    }

    if (!categoryId) {
      errors.categoryId = t("form.errors.emptyField", {
        field: t("form.fields.category"),
      });
      isValid = false;
    }

    if (!content) {
      errors.content = t("form.errors.emptyField", {
        field: t("form.fields.content"),
      });
      isValid = false;
    }

    if (content && content.length > 300) {
      errors.content = t("form.errors.contentLength");
      isValid = false;
    }

    this.setState({ errors });

    return isValid;
  };

  fileChange = (event) => {
    this.setState({ isProps: false });
    event.preventDefault();
    let files;
    if (event.dataTransfer) {
      files = event.dataTransfer.files;
    } else if (event.target) {
      files = event.target.files;
    }
    const fsize = files[0].size;
    const fileLimit = Math.round(fsize / 1024);
    let fileSizeLimit = true;
    const extFile = files.length ? files[0].type : "";

    if (fileLimit >= 5120) {
      const errors = this.state.errors;
      this.setState({
        errors: { ...errors, imageUrl: this.props.t("form.errors.fileSize") },
      });
      fileSizeLimit = false;
    }

    if (extFile != "" && fileSizeLimit) {
      if (
        extFile == "image/jpeg" ||
        extFile == "image/jpg" ||
        extFile == "image/png"
      ) {
        const reader = new FileReader();
        const fileExtension = files[0].name.split(".").pop();
        reader.onload = () => {
          this.setState({
            isCropperOpen: true,
            selectedFile: reader.result,
            selectedFileExtension: fileExtension,
          });
        };
        reader.readAsDataURL(files[0]);

        //this is done so that user can select the same image again.
        event.target.value = "";
      } else {
        const errors = this.state.errors;
        this.setState({
          errors: {
            ...errors,
            imageUrl: this.props.t("form.errors.invalidFile"),
          },
        });
      }
    }
  };

  cropAndUploadImage = async () => {
    if (this.imageRef && this.state.crop.width && this.state.crop.height) {
      const blob = await this.getCroppedImg(
        this.imageRef,
        this.state.crop,
        `croppedImage.${this.state.selectedFileExtension}`
      );

      this.setState({
        blobLoader: true,
        isCropperOpen: false,
        errors: { ...this.state.errors, imageUrl: "" },
      });

      if (this.state.blobFileName) {
        this.deleteBlob();
      }

      this.upload(new File([blob], blob.name));
    }
  };

  getCroppedImg(image, crop, fileName) {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error("Canvas is empty");
          return;
        }
        blob.name = fileName;
        resolve(blob);
      }, "image/jpeg");
    });
  }

  upload = (file) => {
    //const accountName = 'mxhhstagingstorageacc';
    const accountName = `${process.env.REACT_APP_AZURE_STORAGE_ACCOUNT}`;
    const sasString = this.props.sasToken.token;

    const pipeline = newPipeline(new AnonymousCredential());
    const containerName = "testimonial-images";
    const fileExtenstion = this.state.selectedFileExtension;
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
      const uploadBlobResponse = await blockBlobClient.uploadBrowserData(
        file,
        blobOptions
      );
      return uploadBlobResponse;
    }

    const Result = main();

    Result.then((data) => {
      if (data._response.status === 201 || data._response.status === 200) {
        this.setState({ blobLoader: false });
        const fileName = data._response.request.url.split("?");
        this.setState({ imageUrl: fileName[0] });
        if (!this.state.blobFileName) {
          this.setState({
            blobFileName: fileName[0].split("testimonial-images/"),
          });
        }
        if (this.props.location.pathname === "/edit-testimonial") {
          const Testimonialpayload = {
            resourceType: "testimonial",
            resourceId: this.props.location.state.id,
            imageUrl: this.state.imageUrl,
          };
          this.props.updateTestimonialImage({ ...Testimonialpayload });
        }
      } else {
        this.setState({ blobLoader: false });
      }
    });
  };

  deleteBlob = () => {
    const accountName = `${process.env.REACT_APP_AZURE_STORAGE_ACCOUNT}`;
    const sasString = this.props.sasToken.token;
    const pipeline = newPipeline(new AnonymousCredential());
    const containerName = "testimonial-images";
    const blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net?${sasString}`,
      pipeline
    );
    const fileName1 = this.state.blobFileName[1];
    async function main() {
      const containerClient =
        blobServiceClient.getContainerClient(containerName);
      const item = await containerClient.getBlockBlobClient(fileName1).exists();
      return item;
    }
    async function mainDeleteBlob() {
      const containerClient =
        blobServiceClient.getContainerClient(containerName);
      const blockBlobClient = containerClient.getBlockBlobClient(fileName1);
      blockBlobClient.delete();
    }
    const Result = main();
    Result.then((data) => {
      if (data) {
        this.setState({ blobFileName: null });
        mainDeleteBlob();
      }
    });
  };

  handleAddTestimonial = () => {
    const isValid = this.isValid();
    const { name, designation, content, categoryId, imageUrl } = this.state;
    if (isValid) {
      if (this.props.location.pathname === "/edit-testimonial") {
        const payload = {
          testimonialId: this.props.location.state.id,
          name,
          designation,
          imageUrl,
          content,
          categoryId: parseInt(categoryId),
        };
        this.props.editTestimonial({ ...payload });
      } else {
        const payload = {
          name,
          designation,
          imageUrl,
          content,
          categoryId: parseInt(categoryId),
        };
        this.props.addTestimonial({ ...payload });
      }
    }
  };
  toastHide = () => {
    this.setState({ isToastView: false });
  };

  closeImageCropper = () => {
    this.imageRef = null;
    this.setState({
      isCropperOpen: false,
      selectedFile: "",
      selectedFileExtension: "",
      crop: {},
    });
  };

  render() {
    const { catList, statusMessage, isLoadError, t } = this.props;
    const {
      errors,
      blobLoader,
      imageUrl,
      isToastView,
      name,
      designation,
      content,
      categoryId,
    } = this.state;
    let options = [];

    if (catList) {
      catList.forEach((item) => {
        options.push({ id: item.id, name: item.title });
      });
    }

    return (
      <div className="add-testimonial-block">
        {isToastView && statusMessage && (
          <Toast
            message={statusMessage}
            handleClose={this.toastHide}
            errorToast={isLoadError ? true : false}
          />
        )}
        <div className="container">
          <button className="back-btn">
            <Link to="/manage-testimonial">
              <span className="ico">
                <img
                  src={require("assets/images/arrow-back-icon.svg").default}
                  alt="arrow"
                />
              </span>
              {t("back")}
            </Link>
          </button>
        </div>
        {blobLoader && <Loader />}

        <Modal
          isOpen={this.state.isCropperOpen}
          className="modal-dialog-centered deactivate-modal"
          modalClassName="custom-modal"
        >
          <span className="close-btn" onClick={this.closeImageCropper}>
            <img src={require("assets/images/cross.svg").default} alt="close" />
          </span>
          <ModalBody>
            <div className="content-block ">
              <ReactCrop
                minHeight={96}
                minWidth={96}
                src={this.state.selectedFile}
                crop={this.state.crop}
                onImageLoaded={(image) => (this.imageRef = image)}
                onChange={(crop) => this.setState({ crop })}
              />
            </div>
          </ModalBody>
          <ModalFooter className="px-0">
            <div class="w-100">
              <button
                className="button button-round button-shadow button-min-100 w-sm-100 mb-2 mr-md-3"
                title={t("ok")}
                onClick={() => this.cropAndUploadImage()}
              >
                {t("ok")}
              </button>
              <button
                class="button button-round button-border button-dark btn-mobile-link"
                title={t("cancel")}
                onClick={this.closeImageCropper}
              >
                {t("cancel")}
              </button>
            </div>
          </ModalFooter>
        </Modal>

        <div className="container container-smd">
          <h2 className="title">{t("superAdmin.manageTestimonials")}</h2>
          <div className="form-wrapper">
            <div className="add-testimonial-form">
              <div className="row no-gutters">
                <div className="col-lg-4 order-lg-last">
                  <div className="file-upload-container">
                    <div className="file-upload-field">
                      <div className="img">
                        {imageUrl ? (
                          <img src={imageUrl} alt="upload" />
                        ) : (
                          <img
                            src={
                              require("assets/images/default-image.svg").default
                            }
                            alt="upload"
                          />
                        )}
                      </div>
                      <div className="ch-upload-button">
                        <input
                          id="fileUpload"
                          type="file"
                          onChange={this.fileChange}
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
                    <span className="upload-help-text">
                      {t("superAdmin.uploadAPicture")}
                    </span>
                    {Object.keys(errors).length > 0 && (
                      <span className="error-msg text-center">
                        {errors.imageUrl}{" "}
                      </span>
                    )}
                  </div>
                </div>
                <div className="col-lg-8">
                  <div className="field-group">
                    <Select
                      Title={t("form.fields.category")}
                      Options={options}
                      Name={"categoryId"}
                      HandleChange={this.InputChange}
                      Error={errors.categoryId}
                      selectedOption={categoryId}
                    />
                    <Input
                      Title={t("form.fields.name")}
                      Type="text"
                      Placeholder={t("form.placeholder1", {
                        field: t("form.fields.name"),
                      })}
                      Name={"name"}
                      HandleChange={this.InputChange}
                      Error={errors.name}
                      Value={name}
                    />
                    <Input
                      Title={t("form.fields.designation")}
                      Type="text"
                      Placeholder={t("form.placeholder1", {
                        field: t("form.fields.designation"),
                      })}
                      Name={"designation"}
                      HandleChange={this.InputChange}
                      MaxLength={100}
                      Error={errors.designation}
                      Value={designation}
                    />
                  </div>
                </div>
              </div>
              <div
                className={`c-field ${
                  errors && errors.content && "error-input"
                }`}
              >
                <label>{t("form.fields.content")}</label>
                <textarea
                  className="c-form-control"
                  onInput={this.InputChange}
                  name="content"
                  maxLength="300"
                  value={content}
                ></textarea>
                {Object.keys(errors).length > 0 && (
                  <span className="error-msg text-left">{errors.content} </span>
                )}
              </div>
              <div className="btn-field">
                <div className="row gutters-12">
                  <div className="col-md-auto">
                    <button
                      className="button button-round button-min-130 button-shadow"
                      title={t("save")}
                      onClick={this.handleAddTestimonial}
                    >
                      {t("save")}
                    </button>
                  </div>
                  <div className="col-md-auto">
                    <Link to="/manage-testimonial">
                      <button
                        className="button button-round button-border button-dark"
                        title={t("cancel")}
                      >
                        {t("cancel")}
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({
  Testimonials: { statusMessage, isLoading, catList, isLoadError, imageAdded },
  userProfile: { sasToken },
}) => ({
  statusMessage,
  isLoading,
  catList,
  isLoadError,
  sasToken,
  imageAdded,
});

export default connect(mapStateToProps, {
  getTestimonialCat,
  addTestimonial,
  editTestimonial,
  getSastoken,
  updateTestimonialImage,
})(_isLoading(withTranslation()(AddTestimonial)));
