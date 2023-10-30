import useQueryParam from "hooks/useQueryParam";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { withTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

const DownloadIcs = ({ t }) => {
  const history = useHistory();
  const [downloaded, setDownloaded] = useState(false);
  const link = useQueryParam("link", null);

  useEffect(() => {
    if (link && !downloaded) {
      setDownloaded(true);
      window?.open(link, "_self");
    }
  }, []);

  useEffect(() => {
    if (downloaded) {
      toast.success(t("fileDownloaded"));
      history.replace("/");
    }
  }, [downloaded]);

  return (
    <div
      style={{
        height: "100vh",
      }}
    />
  );
};

export default withTranslation()(DownloadIcs);
