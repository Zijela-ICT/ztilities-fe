import { useState } from "react";

export default function DashboardSection() {
  const [expandedCard, setExpandedCard] = useState(null);

  // Array for "Open work order by categories"
  const workOrderCategories = [
    {
      id: 1,
      name: "HEAT, VENTILATION(HVAC)",
      openCount: 38,
      percent: 16,
      barWidth: "16%",
    },
    {
      id: 2,
      name: "ENVIRONMENTAL - CLEANING",
      openCount: 24,
      percent: 10,
      barWidth: "10%",
    },
    {
      id: 3,
      name: "ELECTRICAL SYSTEM",
      openCount: 15,
      percent: 8,
      barWidth: "8%",
    },
    {
      id: 4,
      name: "HEAT, VENTILATION (HVAC)",
      openCount: 38,
      percent: 16,
      barWidth: "16%",
    },
    {
      id: 5,
      name: "ENVIRONMENTAL - CLEANING",
      openCount: 24,
      percent: 10,
      barWidth: "10%",
    },
    {
      id: 6,
      name: "ELECTRICAL SYSTEM",
      openCount: 15,
      percent: 8,
      barWidth: "8%",
    },
  ];

  // Array for "Overdue work order by duration"
  const overdueWorkOrders = [
    { id: 1, duration: "<3months", count: 105, percent: 7, color: "#E63946" },
    { id: 2, duration: "3-6months", count: 1, percent: 7, color: "#F4A261" },
    { id: 3, duration: "1-2weeks", count: 7, percent: 7, color: "#2A9D8F" },
    { id: 4, duration: ">1days", count: 20, percent: 7, color: "#264653" },
  ];

  // Common classes for both cards
  const baseCardClasses =
    "bg-white rounded-lg shadow p-6  transform transition-all duration-500";

  // Classes applied when card is expanded to center in the middle of the screen.
  const expandedClasses =
    "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 z-50";

  return (
    <div className="container mx-auto mt-8 relative">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Open Work Order by Categories Card */}
        <div
          className={`${baseCardClasses} ${
            expandedCard === "workOrder" ? expandedClasses : ""
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-700 ">
              Open work order by categories
            </h2>
            <div
              className="cursor-pointer"
              onClick={() => setExpandedCard("workOrder")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                width="18"
                height="18"
              >
                <path d="M3 10V3h7v2H5v5H3zm8 0V8h5V3h2v7h-7zm5 11v-5h-5v-2h7v7h-2zm-8 0H3v-7h2v5h5v2z" />
              </svg>
            </div>
          </div>
          <ul className="space-y-4 bg-gray-100 rounded-lg p-5 max-h-64 overflow-y-auto">
            {workOrderCategories.map((item) => (
              <li key={item.id} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-700">
                    {item.name} ({item.openCount})
                  </p>
                </div>
                <div className="flex items-center ml-4 w-1/3">
                  <div className="w-full bg-white rounded-full h-2 relative">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: item.barWidth }}
                    />
                  </div>
                  <span className="text-xs text-blue-700 ml-2">
                    {item.percent}%
                  </span>
                </div>
              </li>
            ))}
          </ul>
          {expandedCard === "workOrder" && (
            <button
              className="absolute top-4 right-4 p-2 bg-white rounded"
              onClick={(e) => {
                e.stopPropagation();
                setExpandedCard(null);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                width="24"
                height="24"
              >
                <path d="M5 19h14v2H5z" />
              </svg>
            </button>
          )}
        </div>

        {/* Overdue Work Order by Duration Card */}
        <div
          className={`${baseCardClasses} ${
            expandedCard === "overdue" ? expandedClasses : ""
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-700 ">
              Overdue work order by duration
            </h2>
            <div
              className="cursor-pointer"
              onClick={() => setExpandedCard("overdue")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                width="18"
                height="18"
              >
                <path d="M3 10V3h7v2H5v5H3zm8 0V8h5V3h2v7h-7zm5 11v-5h-5v-2h7v7h-2zm-8 0H3v-7h2v5h5v2z" />
              </svg>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm border-separate border-spacing-y-2">
              <thead>
                <tr className="border-b text-gray-600 font-medium">
                  <th className="py-2 pr-4">Overdue Durations</th>
                  <th className="py-2">No. of Work Orders</th>
                  <th className="py-2">%</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-xs">
                {overdueWorkOrders.map((item) => (
                  <tr key={item.id} className="h-8 bg-gray-100">
                    <td
                      className="py-4 pr-4 pl-4 font-medium"
                      style={{ borderLeft: `4px solid ${item.color}` }}
                    >
                      {item.duration}
                    </td>
                    <td className="py-4 px-4">{item.count}</td>
                    <td className="py-4 px-4">{item.percent}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {expandedCard === "overdue" && (
            <button
              className="absolute top-4 right-4 p-2 bg-white rounded"
              onClick={(e) => {
                e.stopPropagation();
                setExpandedCard(null);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                width="24"
                height="24"
              >
                <path d="M5 19h14v2H5z" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
