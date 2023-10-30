import Page from "components/Page";
import React from "react";
import { useHistory } from "react-router";
import { useUser } from "repositories/user-repository";
import DetailCard from "./DetailCard";
import Offices from "./Offices";
import { decodeId } from "utils";

const PersonnelDetail = ({ match }) => {
  const history = useHistory();
  const personnelId = decodeId(match.params.personnelId);
  const goToManagePeronnel = () => history.push("/manage-personnel");

  let { isLoading, data: apiRes, error } = useUser(personnelId);

  if (!isLoading && (error || apiRes.statusCode !== 200)) {
    goToManagePeronnel();
    return null;
  }

  return (
    <Page
      titleKey="superAdmin.personnelActiveOffices"
      onBack={goToManagePeronnel}
    >
      <DetailCard isLoading={isLoading} personnel={!isLoading && apiRes.data} />

      <div className="mt-5">
        <Offices
          personnelId={personnelId}
          isLoadingPersonnel={isLoading}
          personnel={!isLoading && apiRes.data}
        />
      </div>
    </Page>
  );
};

export default PersonnelDetail;
