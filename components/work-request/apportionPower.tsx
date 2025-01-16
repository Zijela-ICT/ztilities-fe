import { FormEvent, useEffect, useState } from "react";
import Select from "react-select";
import { multiSelectStyle } from "@/utils/ojects";
import axiosInstance from "@/utils/api";

export default function ApportionPower({
  setModalState,
  activeRowId,
  setSuccessState,
}) {
  const [formData, setFormData] = useState({
    entity: "",
    option: "",
  });

  const [facilities, setFacilities] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [options, setOptions] = useState([]);
  const [units, setUnits] = useState([]); // Holds the fetched units array
  const [consumptions, setConsumptions] = useState<
    { id: string; consumption: string }[]
  >([]); // Tracks input values

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
        response = await axiosInstance.get(`/facilities/${id}`);
      } else if (formData.entity === "block") {
        response = await axiosInstance.get(`/blocks/${id}`);
      }
      const fetchedUnits = response.data.data.units; // Assuming `units` is an array of objects
      setUnits(fetchedUnits);
      setConsumptions(
        fetchedUnits.map((unit: any) => ({
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
    console.log("Submission Data:", consumptions); // This will log the final data
    // setModalState("");
    // setSuccessState({
    //   title: "Successful",
    //   detail: `You have successfully apportioned power to the ${formData.entity}`,
    //   status: true,
    // });
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

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="mt-12 px-6 max-w-full sm:mt-6 pb-12"
      >
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

        {/* Display Units */}
        {units.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-lg mb-4">Units</h3>
            <div className="grid grid-cols-1 gap-4">
              {units.map((unit: any) => (
                <div
                  key={unit.id}
                  className="flex items-center justify-between border p-4 rounded-md"
                >
                  <div>
                    <p>ID: {unit.id}</p>
                    <p>Name: {unit.name || "Unnamed Unit"}</p>
                  </div>
                  <div>
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
                      className="border rounded-md px-2 py-1"
                    />
                  </div>
                </div>
              ))}
            </div>
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
