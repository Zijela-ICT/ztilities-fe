import { FormEvent, useEffect, useState } from "react";
import Select from "react-select";
import {
  LabelInputComponent,
  LabelTextareaComponent,
} from "../input-container";
import createAxiosInstance from "@/utils/api";
import { multiSelectStyle } from "@/utils/ojects";

export default function RequestQuotationApproval({
  setModalState,
  activeRowId,
  setSuccessState,
}: {
  setModalState: (state: string) => void;
  activeRowId?: string | null;
  setSuccessState: (state: {
    title: string;
    detail: string;
    status: boolean;
  }) => void;
}) {
  const axiosInstance = createAxiosInstance();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    userId: "",
    amount: "",
  });

  const [roles, setRoles] = useState<Role[]>();
  const [approvers, setApprovers] = useState<any[]>();

  const getRoles = async () => {
    const response = await axiosInstance.get("/roles");
    setRoles(response.data.data);
  };

  const getApprovers = async () => {
    const APPROVAL_ROLE = roles?.find(
      (role: Role) => role.name === "APPROVAL_ROLE"
    );
    if (APPROVAL_ROLE) {
      const response = await axiosInstance.get(`/roles/${APPROVAL_ROLE.id}`);
      setApprovers(response.data.data?.users);
    }
  };

  const getWorkRequest = async () => {
    if (activeRowId) {
      const response = await axiosInstance.get(`/work-orders/${activeRowId}`);
      const data = response.data.data;
      setFormData({
        ...formData,
        title: data.title,
        description: data.description,
        amount: data.amount,
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (selected: any) => {
    setFormData({ ...formData, userId: selected?.value || "" });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { amount, ...payload } = formData;
    await axiosInstance.patch(
      `/work-orders/${activeRowId}/quotations/request-quotation-approval`,
      payload
    );
    setModalState("");
    setSuccessState({
      title: "Successful",
      detail: `You have successfully requested for quotation approval`,
      status: true,
    });
  };

  useEffect(() => {
    getRoles();
    getWorkRequest();
  }, [activeRowId]);

  useEffect(() => {
    if (roles) {
      getApprovers();
    }
  }, [roles]);

  const availableApprovers = approvers?.filter(
    (approver) => approver.approvalLimit > formData.amount
  );

  const approverOptions = availableApprovers?.map((approver: any) => ({
    value: approver?.id,
    label: `${approver.firstName} ${approver.lastName} - Approval Limit ( ${
      approver.approvalLimit || 0
    } )`,
  }));

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="mt-12 px-6 max-w-full sm:mt-6 pb-12"
      >

          <LabelInputComponent
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            label="Title"
          />
     
        <div className="relative w-full mt-6">
          <LabelTextareaComponent
            name="description"
            value={formData.description}
            onChange={handleChange}
            label="Description"
          />
        </div>

        <div className="relative w-full mt-6">
          <Select
            options={approverOptions}
            value={approverOptions?.find(
              (option) => option.value === formData.userId
            )}
            onChange={handleSelectChange}
            styles={multiSelectStyle}
            placeholder="Select Approval Officer"
          />
        </div>

        <div className="mt-10 flex w-full justify-end">
          <button
            type="submit"
            className="block rounded-md bg-[#A8353A] px-4 py-3.5 text-center text-xs font-semibold text-white"
          >
            Request Approval
          </button>
        </div>
      </form>
    </div>
  );
}
