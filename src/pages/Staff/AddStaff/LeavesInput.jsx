import Input from "components/Input";
import React, { useEffect } from "react";
import { withTranslation } from "react-i18next";
import { useLeaveTypes } from "repositories/leave-repository";

const LeavesInput = ({ leaves, onChange, t }) => {
  const { data: apiRes, isLoading, error } = useLeaveTypes();

  // leaves prop can be an empty array. So we have to
  // fill it with default values.
  useEffect(() => {
    if (
      !isLoading &&
      apiRes &&
      apiRes.result &&
      apiRes.result.data &&
      apiRes.result.data.leave_type &&
      apiRes.result.data.leave_type.length !== leaves.length
    ) {
      const leaveTypes = apiRes.result.data.leave_type;
      let newLeaves = [...leaves];

      for (let i = 0; i < leaveTypes.length; i++) {
        if (newLeaves.findIndex((l) => l.typeId === leaveTypes[i].id) > -1)
          continue;

        newLeaves.push({ typeId: leaveTypes[i].id, value: "0", error: "" });
      }

      onChange(newLeaves);
    }
    // eslint-disable-next-line
  }, [leaves, isLoading, apiRes]);

  if (isLoading) return null;

  if (
    error ||
    (!isLoading && !apiRes.result) ||
    (!isLoading && apiRes.result.statusCode !== 200) ||
    (!isLoading && !apiRes.result.data) ||
    (!isLoading && !apiRes.result.data.leave_type)
  ) {
    return "Could not load leave types!";
  }

  const leaveInputs = apiRes.result.data.leave_type.map((it) => {
    let leave = leaves.find((l) => l.typeId === it.id);

    let value = "0";
    let _error = "";
    if (leave) {
      value = leave.value;
      _error = leave.error;
    }

    return (
      <Input
        key={it.id}
        Title={it.name + " " + t("form.fields.leaves")}
        Type="text"
        MaxLength={3}
        Value={value}
        Error={_error}
        HelperLabel={<strong>{t("accountOwner.daysPerYear")}</strong>}
        HandleChange={(e) => {
          const v = e.target.value;

          const i = leaves.findIndex((l) => l.typeId === it.id);
          if (i > -1) {
            leaves.splice(i, 1);
          }

          onChange([...leaves, { typeId: it.id, value: v, error: _error }]);
        }}
      />
    );
  });

  return leaveInputs;
};

export default withTranslation()(LeavesInput);
