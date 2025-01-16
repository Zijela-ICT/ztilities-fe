import { FormEvent, useEffect, useState } from "react";
import Select from "react-select";
import { multiSelectStyle } from "@/utils/ojects";
import axiosInstance from "@/utils/api";
import ModalCompoenent from "../modal-component";
import { toast } from "react-toastify";
import { LabelInputComponent } from "../input-container";

export default function ApportionPower({
  setModalState,
  activeRowId,
  setSuccessState,
}) {
  const [formData, setFormData] = useState({
    entity: "",
    option: "",
    amount: "",
  });

  const [centralState, setCentralState] = useState<string>();
  const [facilities, setFacilities] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [options, setOptions] = useState([]);
  const [units, setUnits] = useState([]); // Holds the fetched units array
  const [consumptions, setConsumptions] = useState<
    { id: string; consumption: string }[]
  >([]); // Tracks input values

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (fieldName: string) => (selected: any) => {
    setFormData({
      ...formData,
      [fieldName]: selected?.value || "",
    });

    if (fieldName === "option" && selected?.value) {
      fetchSelectedEntityDetails(selected.value);
    }
  };

  const fetchData = async () => {
    const facilityResponse = await axiosInstance.get("/facilities/");
    const blockResponse = await axiosInstance.get("/blocks/");

    setFacilities(
      facilityResponse.data.data.map((item: any) => ({
        value: item.id.toString(),
        label: item.name || item.unitNumber || item.blockNumber,
      }))
    );
    setBlocks(
      blockResponse.data.data.map((item: any) => ({
        value: item.id.toString(),
        label: item.name || item.unitNumber || item.blockNumber,
      }))
    );
  };

  const fetchSelectedEntityDetails = async (id: string) => {
    try {
      let response;
      if (formData.entity === "facility") {
        response = await axiosInstance.get(
          `/facilities/facilities-units/all/${id}`
        );
      } else if (formData.entity === "block") {
        response = await axiosInstance.get(`/blocks/${id}`);
      }

      const fetchedUnits =
        formData.entity === "block"
          ? response.data.data?.units
          : response.data.data;
      // Assuming `units` is an array of objects
      setUnits(fetchedUnits);

      if (fetchedUnits.length > 0) {
        setCentralState("UnitsFetched");
      } else {
        toast.warning("No Units Available");
      }
      setConsumptions(
        fetchedUnits?.map((unit: any) => ({
          id: unit.id.toString(),
          consumption: "",
        }))
      ); // Initialize consumption inputs
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

  const handleConsumptionChange = (id: string, value: string) => {
    setConsumptions((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, consumption: value } : item
      )
    );
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submission Data:", consumptions, formData); // This will log the final data
    await axiosInstance.post(`/power-charges`, {
      entity:
        formData.entity?.charAt(0).toUpperCase() + formData.entity.slice(1),
      entityId: Number(formData.option),
      amount: Number(formData.amount),
      units: consumptions.map((c) => ({
        id: Number(c.id),
        consumption: Number(c.consumption),
      })),
    });
    setModalState("");
    setSuccessState({
      title: "Successful",
      detail: `You have successfully apportioned power`,
      status: true,
    });
  };

  const entityOptions = [
    { value: "facility", label: "Facility" },
    { value: "block", label: "Block" },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (formData.entity === "facility") {
      setOptions(facilities);
    } else if (formData.entity === "block") {
      setOptions(blocks);
    }
  }, [formData.entity, facilities, blocks]);

  // Function to download the data as CSV
  const downloadCSV = () => {
    const headers = ["ID", "Number", "Consumption"];
    const rows = units.map((unit: any) => [
      unit.id,
      unit.unitNumber || "Unnamed Unit",
      consumptions.find((item) => item.id === unit.id.toString())
        ?.consumption || "N/A",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "units_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <ModalCompoenent
        title={"Enter Consumption"}
        detail={""}
        modalState={centralState}
        setModalState={() => {
          setCentralState("");
        }}
      >
        {/* Display Units */}
        {/* {units?.length > 0 && (
          <div className="p-6">
            <h3 className="font-semibold text-lg mb-4">Units</h3>
            <div className="overflow-x-auto border rounded-md">
              <table className="table-auto w-full text-left border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 border">ID</th>
                    <th className="px-4 py-2 border">Nmber</th>
                    <th className="px-4 py-2 border">Consumption</th>
                  </tr>
                </thead>
                <tbody>
                  {units.map((unit: any, index: number) => (
                    <tr
                      key={unit.id}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-4 py-2 border">{unit.id}</td>
                      <td className="px-4 py-2 border">
                        {unit.unitNumber || "Unnamed Unit"}
                      </td>
                      <td className="px-4 py-2 border">
                        <input
                          type="number"
                          value={
                            consumptions.find(
                              (item) => item.id === unit.id.toString()
                            )?.consumption || ""
                          }
                          onChange={(e) =>
                            handleConsumptionChange(
                              unit.id.toString(),
                              e.target.value
                            )
                          }
                          placeholder="Enter consumption"
                          className="border rounded-md h-12 px-2 py-1 w-full outline:none"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-10 flex w-full justify-end">
              <button
                onClick={() => setCentralState("")}
                className="block rounded-md bg-[#A8353A] px-4 py-3.5 text-center text-base font-semibold text-white"
              >
                Done
              </button>
            </div>
          </div>
        )} */}

        {units?.length > 0 && (
          <div className="p-6">
            <h3 className="font-semibold text-lg mb-4">Units</h3>
            <div className="overflow-x-auto border rounded-md">
              <table className="table-auto w-full text-left border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 border">ID</th>
                    <th className="px-4 py-2 border">Number</th>
                    <th className="px-4 py-2 border">Consumption</th>
                  </tr>
                </thead>
                <tbody>
                  {units.map((unit: any, index: number) => (
                    <tr
                      key={unit.id}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-4 py-2 border">{unit.id}</td>
                      <td className="px-4 py-2 border">
                        {unit.unitNumber || "Unnamed Unit"}
                      </td>
                      <td className="px-4 py-2 border">
                        <input
                          type="number"
                          value={
                            consumptions.find(
                              (item) => item.id === unit.id.toString()
                            )?.consumption || ""
                          }
                          onChange={(e) =>
                            handleConsumptionChange(
                              unit.id.toString(),
                              e.target.value
                            )
                          }
                          placeholder="Enter consumption"
                          className="border rounded-md px-2 py-1 w-full"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-10 flex w-full justify-end space-x-4">
              <button
                onClick={() => setCentralState("")}
                className="block rounded-md bg-[#A8353A] px-4 py-3.5 text-center text-base font-semibold text-white"
              >
                Done
              </button>
              <button
                onClick={() => downloadCSV()}
                className="block rounded-md text-[#A8353A] bg-white border border-[#A8353A]  px-4 py-3.5 text-center text-base font-semibold"
              >
                Download CSV
              </button>
            </div>
          </div>
        )}
      </ModalCompoenent>

      <form
        onSubmit={handleSubmit}
        className="mt-12 px-6 max-w-full sm:mt-6 pb-12"
      >
        <div className="relative w-full mt-6">
          <LabelInputComponent
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            label="Amount"
            required
          />
        </div>
        <div className="relative w-full mt-6">
          <Select
            options={entityOptions}
            value={entityOptions?.find(
              (option) => option.value === formData.entity
            )}
            onChange={handleSelectChange("entity")}
            styles={multiSelectStyle}
            placeholder="Select Entity"
          />
        </div>

        {formData.entity && (
          <div className="relative w-full mt-6">
            <Select
              options={options}
              value={options?.find(
                (option) => option.value === formData.option
              )}
              onChange={handleSelectChange("option")}
              styles={multiSelectStyle}
              placeholder={`Select ${formData.entity}`}
            />
          </div>
        )}

        <div className="mt-10 flex w-full justify-end">
          <button
            type="submit"
            className="block rounded-md bg-[#A8353A] px-4 py-3.5 text-center text-base font-semibold text-white"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
