import React, { useEffect } from "react";

function HubspotContactForm({ region, portalId, formId, id }) {
  useEffect(() => {
    if (process.env.REACT_APP_CURRENT_ENV === "development") {
      const script = document.createElement("script");
      script.src = "https://js.hsforms.net/forms/shell.js";
      document.body.appendChild(script);
      script.addEventListener("load", () => {
        if (window.hbspt) {
          window.hbspt.forms.create({
            region: region,
            portalId: portalId,
            formId: formId,
            target: `#${id}`,
          });
        }
      });
    }
  }, []);

  return (
    <div>
      <div id={id}></div>
    </div>
  );
}

export default HubspotContactForm;
