
export const multiSelectStyle = {
  control: (base) => ({
    ...base,
    border: "none",
    boxShadow: "none",
    backgroundColor: "#f3f4f6",
    paddingTop: "10px",
    paddingBottom: "10px",
    borderRadius: "0.5rem",
  }),
  placeholder: (base) => ({
    ...base,
    fontSize: "0.9rem",
    color: "#9ca3af",
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: "#e5e7eb",
    borderRadius: "0.25rem",
    padding: "2px 4px",
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: "#111827",
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: "#9ca3af",
    ":hover": {
      color: "#6b7280",
    },
  }),
};

export const chartOptions = {
  responsive: true, // Make the chart responsive
  plugins: {
    legend: {
      position: "top" as const, // Position of the legend
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
