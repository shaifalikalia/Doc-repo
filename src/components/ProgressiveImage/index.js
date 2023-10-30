import { debounce } from "lodash";
import React, { useState, useCallback } from "react";
import { LoaderIcon } from "react-hot-toast";
import "./ProgressiveImage.scss";

const ProgressiveImage = (props) => {
  const { src, alt, ...rest } = props;
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
        <div className="loader-wrapper">
          <LoaderIcon />
        </div>
      )}
      {src && (
        <img
          src={src}
          alt={alt}
          {...props}
          onLoad={handleOnLoad}
          style={{ display: loading ? "none" : "" }}
          {...rest}
        />
      )}
    </>
  );
};

export default ProgressiveImage;
