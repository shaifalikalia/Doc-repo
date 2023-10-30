import { debounce } from "lodash";
import React, { useState, useCallback } from "react";
import { LoaderIcon } from "react-hot-toast";

const ProgressiveImage = (props) => {
  const { src, alt } = props;
  const [loading, setLoading] = useState(true);
  const handleOnLoad = debounce(
    useCallback(() => {
      setLoading(false);
    }, []),
    1000,
    { trailing: true }
  );
  return (
    <>
      {loading && (
        <LoaderIcon style={{ margin: "auto auto", padding: "10px" }} />
      )}
      {src && (
        <img
          src={src}
          alt={alt}
          {...props}
          onLoad={handleOnLoad}
          style={{ display: loading ? "none" : "" }}
        />
      )}
    </>
  );
};

export default ProgressiveImage;
