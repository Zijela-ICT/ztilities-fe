import { FormEvent, useEffect, useState } from "react";
import Select from "react-select";
import axiosInstance from "@/utils/api";
import { multiSelectStyle } from "@/utils/ojects";

export default function AcceptQuotation({
  setModalState,
  activeRowId,
  setSuccessState,
}) {
  const [quotations, setQuotations] = useState([]);
  const [selectedQuotation, setSelectedQuotation] = useState(null);

  useEffect(() => {
    if (activeRowId) {
      const fetchQuotations = async () => {
        const response = await axiosInstance.get(
          `/work-requests/${activeRowId}`
        );
        setQuotations(
          response.data.data?.quotations?.map((quotation: any) => ({
            value: quotation.quotationId,
            label: quotation.quotationId,
          }))
        );
      };
      fetchQuotations();
    }
  }, [activeRowId]);

  console.log(selectedQuotation);
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await axiosInstance.patch(
      `/work-requests/${activeRowId}/accept-quotation/${selectedQuotation.value}`
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

        <div className="mt-10 flex w-full justify-end">
          <button
            type="submit"
            className="block rounded-md bg-[#A8353A] px-4 py-3.5 text-center text-base font-semibold text-white"
          >
            Accept Quotation
          </button>
        </div>
      </form>
    </div>
  );
}
