"use client";

import DashboardLayout from "@/components/dashboard-layout-component";
import {
  ArrowLeft,
  IncomingIcon,
  OutgoingIcon,
  RefreshIcon,
} from "@/utils/svg";
import { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Link from "next/link";

// Register required components in Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Transactions() {
  const [filters, setFilters] = useState({
    Block: "",
    Facility: "",
    Vendor: "",
    Technician: "",
  });

  const filterOptions = [
    { label: "Block", options: ["Block A", "Block B", "Block C"] },
    { label: "Facility", options: ["Facility 1", "Facility 2", "Facility 3"] },
    { label: "Vendor", options: ["Vendor X", "Vendor Y", "Vendor Z"] },
    {
      label: "Technician",
      options: ["Technician 1", "Technician 2", "Technician 3"],
    },
    {
      label: "Resident",
      options: ["Technician 1", "Technician 2", "Technician 3"],
    },
  ];

  const handleFilterChange = (label, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [label]: value,
    }));
  };

  const [auditLogs] = useState([
    {
      name: "Calum Allat",
      price: "10,0000",
      date: "2024-12-24",
      type: "in",
      check: "block",
    },
    {
      name: "John Tess ",
      price: "10,0000",
      date: "2024-12-24 ",
      type: "in",
      check: "block",
    },
    {
      name: "Nicole Carey",
      price: "10,0000",
      date: "2024-12-24",
      type: "out",
      check: "vendor",
    },
    {
      name: "Burian Carew",
      price: "10,0000",
      date: "2024-12-24",
      type: "out",
      check: "block",
    },
    {
      name: "Ronke Alit ",
      price: "10,0000",
      date: "2024-12-24",
      type: "out",
      check: "facility",
    },
  ]);

  const chartData = {
    labels: ["January", "February", "March", "April", "May", "June"], // X-axis labels (Months)
    datasets: [
      {
        label: "Inflow", // Label for the high values
        data: [50, 70, 20, 50, 40, 80], // High values
        fill: true, // Don't fill the area under the line
        borderColor: "rgb(75, 192, 192)", // Line color for High
        tension: 0.4, // Smoothed curve (higher value = smoother)
        pointRadius: 0, // Radius of the data points
        pointBackgroundColor: "rgb(75, 192, 192)", // Point color for High
      },
      {
        label: "Outflow", // Label for the low values
        data: [35, 50, 30, 40, 80, 60], // Low values
        fill: true, // Don't fill the area under the line
        borderColor: "rgb(255, 99, 132)", // Line color for Low
        tension: 0.4, // Smoothed curve (higher value = smoother)
        pointRadius: 0, // Radius of the data points
        pointBackgroundColor: "rgb(255, 99, 132)", // Point color for Low
      },
    ],
  };

  const chartOptions = {
    responsive: true, // Make the chart responsive
    plugins: {
      legend: {
        position: "top", // Position of the legend
      },
      tooltip: {
        enabled: true, // Enable tooltips on hover
      },
    },
    scales: {
      x: {
        beginAtZero: true, // Start X-axis from 0
      },
      y: {
        beginAtZero: true, // Start Y-axis from 0
        grid: {
          display: true, // Display horizontal grid lines
          color: "rgba(0, 0, 0, 0.1)", // Grid line color
          borderColor: "rgba(0, 0, 0, 0.1)", // Border color of the chart
          borderWidth: 1, // Border width
          tickColor: "rgba(0, 0, 0, 0.1)", // Tick color on y-axis
        },
      },
    },
    elements: {
      line: {
        tension: 0.4, // Smooth curve for the line
      },
      point: {
        radius: 5, // Radius for points on the graph
        backgroundColor: "rgb(75, 192, 192)", // Point color
      },
    },
  };

  const handleApplyFilters = () => {
    console.log("Filters Applied:", filters);
  };

  return (
    <DashboardLayout
      title="Transactions"
      detail="See balance and all transactions here"
    >
      <>
        <div className="relative bg-white rounded-2xl p-4">
          <div className="flex justify-end space-x-4 pb-2">
            {filterOptions.map((filter, index) => (
              <select
                key={index}
                className="border border-gray-300 rounded-md p-2"
                value={filters[filter.label]}
                onChange={(e) =>
                  handleFilterChange(filter.label, e.target.value)
                }
              >
                <option value="">{`Filter by ${filter.label}`}</option>
                {filter.options.map((option, idx) => (
                  <option key={idx} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ))}
          </div>
        </div>

        <div
          className="relative bg-cover bg-center bg-no-repeat rounded-2xl px-4 py-6 my-6 "
          style={{
            backgroundImage: "url('/assets/wallet-bg.jpeg')",
          }}
        >
          <div className="flex justify-between items-center pb-2">
            <span className="text-gray-200 ">Account Balance</span>
            <div className="text-white py-2 flex items-center space-x-1">
              <RefreshIcon /> <p>Refresh </p>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-white font-bold text-2xl">N14,00000.00</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white cursor-pointer"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7s-8.268-2.943-9.542-7z"
              />
            </svg>
          </div>
        </div>

        <div className="flex flex-col md:flex-row w-full h-auto space-y-4 md:space-y-0 md:space-x-4">
          {/* Left Section (Graph) */}
          <div className="w-full md:w-3/5 bg-white rounded-lg  p-6">
            <h2 className="text-base font-semibold mb-4 text-black">
              Transaction Trend
            </h2>
            <div className="h-full ">
              {/* Placeholder for the Graph */}

              {/* <Line data={chartData} options={chartOptions} /> */}
            </div>
          </div>

          {/* Right Section (Simple List) */}
          <div className="w-full md:w-2/5 bg-white p-4 rounded-lg">
            <div className="flex items-baseline text-base justify-between mb-6">
              <h2 className="font-semibold text-black">Recent Transactions</h2>
              <h2 className="font-medium text-[#A8353A] flex items-center space-x-1 cursor-pointer">
                <Link href={"/transaction/all"} >See all</Link>
                <div className="rotate-180">
                  <ArrowLeft />
                </div>
              </h2>
            </div>
            <ul>
              {auditLogs.map((log, index) => (
                <li
                  key={log.name}
                  className="flex justify-between items-start mb-4 border-b border-gray-100 last:border-b-0 pb-4"
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      {log.type === "in" ? <IncomingIcon /> : <OutgoingIcon />}
                    </div>
                    <div className="ml-4 flex flex-col">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-base text-gray-700">
                          {log.name}
                        </span>
                      </div>
                      <p className="text-gray-700 mt-1 font-thin text-sm">
                        {log.date}
                      </p>
                    </div>
                  </div>
                  {/* Price or additional information */}
                  <span className="text-gray-600 text-base font-medium">
                    N {log.price}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </>
    </DashboardLayout>
  );
}
