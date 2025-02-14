import { FormEvent, useEffect, useState } from "react";
import Select from "react-select";
import axiosInstance from "@/utils/api";
import { multiSelectStyle } from "@/utils/ojects";
import createAxiosInstance from "@/utils/api";
import {
  LabelInputComponent,
  LabelTextareaComponent,
} from "../input-container";

export default function AcceptQuotation({
  setModalState,
  activeRowId,
  setSuccessState,
}) {
  const axiosInstance = createAxiosInstance();
  const [quotations, setQuotations] = useState([]);
  const [selectedQuotation, setSelectedQuotation] = useState(null);

  const [formData, setFormData] = useState({
    reasonForQuotationSelection: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    if (activeRowId) {
      const fetchQuotations = async () => {
        const response = await axiosInstance.get(`/work-orders/${activeRowId}`);
        setQuotations(
          response.data.data?.quotations?.map((quotation: any) => ({
            value: quotation.quotationId,
            label: quotation.title,
          }))
        );
      };
      fetchQuotations();
    }
  }, [activeRowId]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await axiosInstance.patch(
      `/work-orders/${activeRowId}/accept-quotation/${selectedQuotation?.value}`,
      { reasonForQuotationSelection: formData.reasonForQuotationSelection }
    );
    setQuotations([]);
    setSelectedQuotation(null);
    setModalState("");
    setSuccessState({
      title: "Successful",
      detail: "Quotation accepted successfully.",
      status: true,
    });
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="mt-12 px-6 max-w-full sm:mt-6 pb-12"
      >
        <div className="relative w-full mt-6">
          <Select
            options={quotations}
            value={selectedQuotation}
            onChange={setSelectedQuotation}
            styles={multiSelectStyle}
            placeholder="Select Quotation"
          />
        </div>

        <div className="relative w-full mt-6">
          <LabelTextareaComponent
            name="reasonForQuotationSelection"
            value={formData.reasonForQuotationSelection}
            onChange={handleChange}
            label="Reason For Quotation Selection"
          />
        </div>

        <div className="mt-10 flex w-full justify-end">
          <button
            type="submit"
            className="block rounded-md bg-[#A8353A] px-4 py-3.5 text-center text-xs font-semibold text-white"
          >
            Accept Quotation
          </button>
        </div>
      </form>
    </div>
  );
}
