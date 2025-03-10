"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard-layout-component";
import withPermissions from "@/components/auth/permission-protected-routes";

import { useDataPermission } from "@/context";

import { useParams, useRouter } from "next/navigation";
import createAxiosInstance from "@/utils/api";
import FacilityDetails from "@/components/facility-management/view-facility";

function WorkRequests() {
  const axiosInstance = createAxiosInstance();
  const {
    user,
    setUser,
    setUserPermissions,
    centralState,
    setCentralState,
    centralStateDelete,
    setCentralStateDelete,
    setSuccessState,
  } = useDataPermission();
  const router = useRouter();
  const { id } = useParams();

  const [workRequest, setWorkRequest] = useState<any>();

  const [activeRowId, setActiveRowId] = useState<string | null>(null); // Track active row

  const toggleActions = (rowId: string) => {
    setActiveRowId(rowId);
  };

  const getAWorkRequest = async () => {
    const response = await axiosInstance.get(`/work-requests/${id}`);
    setWorkRequest(response.data.data);
  };

  const deleteComment = async () => {
    const response = await axiosInstance.delete(
      `/work-requests/${id}/comments/${activeRowId}`
    );
    setCentralState("");
    setSuccessState({
      title: "Successful",
      detail: "You have successfully deleted comment",
      status: true,
    });
    getAWorkRequest();
  };

  useEffect(() => {
    if (id) {
      getAWorkRequest();
    }
  }, [id]);

  return (
    <DashboardLayout
      title={`Work Request ${workRequest?.workRequestNumber}`}
      detail="Work Request Details"
      dynamic
      onclick={() => router.back()}
      getTitle={() => "Delete Comment"}
      getDetail={() => "Do you want to delete this comment"}
      takeAction={centralStateDelete === "deleteComment" ? deleteComment : null}
      setActiveRowId={setActiveRowId}
    >
      <div className="relative bg-white rounded-2xl p-8 ">
        <FacilityDetails
          facility={workRequest}
          title="Work Request"
          toggleActions={toggleActions}
          setModalStateDelete={setCentralStateDelete}
        />
      </div>
    </DashboardLayout>
  );
}

export default withPermissions(WorkRequests, ["work-requests"]);
