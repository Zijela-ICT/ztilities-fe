"use client";

import ButtonComponent from "@/components/button-component";
import DashboardLayout from "@/components/dashboard-layout-component";
import ModalCompoenent from "@/components/modal-component";
import CreatePPM from "@/components/ppm/createPPM";
import createAxiosInstance from "@/utils/api";
import { SearchIcon } from "@/utils/svg";
import { JSX, useEffect, useState } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

export default function Ppm() {
  const axiosInstance = createAxiosInstance();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [successState, setSuccessState] = useState({
    title: "",
    detail: "",
    status: false,
  });
  const [activeRowId, setActiveRowId] = useState<string | null>(null); // Track active row
  const [centralState, setCentralState] = useState<string>();
  const [centralStateDelete, setCentralStateDelete] = useState<string>();
  const [ppms, setPpms] = useState<any[]>([]);

  const getPPMS = async () => {
    const response = await axiosInstance.get(`/ppms`);
    setPpms(response.data.data);
  };

  // Function to get all days in the selected month
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: days }, (_, i) => i + 1);
  };

  const days = getDaysInMonth(selectedDate);

  // Dummy work data for each day
  const getWorkForDay = (day) => [
    `Task ${day}-1`,
    `Task ${day}-2`,
    `Task ${day}-3`,
  ];

  const componentMap: Record<string, JSX.Element> = {
    createPPM: (
      <CreatePPM
        activeRowId={activeRowId}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
      />
    ),
  };

  useEffect(() => {
    getPPMS();
  }, []);

  return (
    <DashboardLayout title="PPM" detail="View Work Calender">
      <ModalCompoenent
        title={"CretePPM"}
        detail={""}
        modalState={centralState}
        setModalState={() => {
          setCentralState("");
          setActiveRowId(null);
        }}
      >
        {componentMap[centralState]}
      </ModalCompoenent>
      <>
        <div className="relative bg-white rounded-2xl p-4">
          <div className="flex sm:flex-row flex-col items-center md:space-x-2 space-x-0 space-y-2 md:space-y-0 font-semibold text-md">
            <div
              className={`flex items-center border rounded-md focus-within:ring-2 focus-within:ring-blue-500 w-full sm:w-[70%]`}
            >
              <span className="pl-3 text-gray-400 mt-2">
                <SearchIcon />
              </span>

              <input
                id="searchInput"
                type="text"
                placeholder="Search..."
                className="px-1 py-4 w-full focus:outline-none"
              />
            </div>

            <ButtonComponent
              text={"Add New PPM"}
              onClick={() => setCentralState("createPPM")}
              className="flex-1 px-4 py-3 text-white bg-[#A8353A]"
              permissions={["create_work-orders"]}
            />
          </div>
        </div>

        <div className="flex min-h-screen py-4 space-x-4 ">
          <div className="w-1/5 bg-white rounded-xl p-2">
            <DatePicker
              selected={selectedDate}
              onChange={(date: Date) => setSelectedDate(date)}
              dateFormat="MMMM d, yyyy"
              inline
              className="w-full"
            />
          </div>

          <div className="w-4/5 p-4 bg-white rounded-xl ">
            <h2 className="text-base font-bold mb-4">
              {selectedDate.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </h2>
            <div className="grid grid-cols-7 gap-0">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <div
                  key={day}
                  className="text-center font-semibold text-gray-500 p-2"
                >
                  {day}
                </div>
              ))}

              {days.map((day) => (
                <div
                  key={day}
                  className="border border-gray-100  p-4 text-center hover:bg-gray-100 cursor-pointer flex flex-col justify-between h-48"
                >
                  <div className="font-bold text-base">{day}</div>
                  <ul className="text-sm text-gray-600">
                    {getWorkForDay(day).map((work, index) => (
                      <li key={index} className="truncate">
                        {work}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
      PPm
    </DashboardLayout>
  );
}
