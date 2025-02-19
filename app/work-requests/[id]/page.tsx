"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard-layout-component";
import withPermissions from "@/components/auth/permission-protected-routes";

import { useDataPermission } from "@/context";

import { useParams, useRouter } from "next/navigation";
import createAxiosInstance from "@/utils/api";
import FacilityDetails from "@/components/facility-management/view-facility";
import {
  ActionModalCompoenent,
  SuccessModalCompoenent,
} from "@/components/modal-component";

function WorkRequests() {
  const axiosInstance = createAxiosInstance();
  const { user, setUser, setUserPermissions } = useDataPermission();
  const router = useRouter();
  const { id } = useParams();

  const [workRequest, setWorkRequest] = useState<any>();

  const [successState, setSuccessState] = useState({
    title: "",
    detail: "",
    status: false,
  });
  const [activeRowId, setActiveRowId] = useState<string | null>(null); // Track active row
  const [centralState, setCentralState] = useState<string>();
  const [centralStateDelete, setCentralStateDelete] = useState<string>();

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
    >
      <SuccessModalCompoenent
        title={successState.title}
        detail={successState.detail}
        modalState={successState.status}
        setModalState={(state: boolean) =>
          setSuccessState((prevState) => ({ ...prevState, status: state }))
        }
      ></SuccessModalCompoenent>
      <ActionModalCompoenent
        title={"Delete comment"}
        detail={"Do you want to delete this comment ?"}
        modalState={centralStateDelete}
        setModalState={setCentralStateDelete}
        takeAction={
          centralStateDelete === "deleteComment" ? deleteComment : null
        }
      ></ActionModalCompoenent>
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
