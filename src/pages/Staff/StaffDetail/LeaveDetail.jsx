import React from "react";
import { withTranslation } from "react-i18next";
import { useLeaveTypes } from "repositories/leave-repository";

function LeaveDetail({ t, staffLeaves }) {
  const { isLoading, data: apiRes } = useLeaveTypes();

  let leaves = null;
  if (
    !isLoading &&
    apiRes &&
    apiRes.result &&
    apiRes.result.data &&
    apiRes.result.data.leave_type
  ) {
    leaves = apiRes.result.data.leave_type.map((it) => {
      const staffLeave = staffLeaves.find((sl) => sl.typeId === it.id);
      let value = 0;
      if (staffLeave) value = staffLeave.leaves;

      return (
        <>
          <div className="data-box" key={it.id}>
            <div className="media">
              <img
                src={require("assets/images/file-icon.svg").default}
                className="align-self-center"
                alt="job"
              />
              <div className="media-body">
                <label>{it.name + " " + t("form.fields.leaves")}</label>
                <h4>
                  {value} {t("accountOwner.daysPerYear")}
                </h4>
              </div>
            </div>
          </div>
        </>
      );
    });
  }

  return leaves;
}

export default withTranslation()(LeaveDetail);
