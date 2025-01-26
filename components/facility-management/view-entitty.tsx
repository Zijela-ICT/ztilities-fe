import React, { JSX } from "react";

interface KeyValueListProps {
  data: Array<{ [key: string]: any }>;
  excludeKeys?: string[]; // Keys to exclude
  excludeFromNested?: {
    [key: string]: string[]; // Specific exclusions for certain nested objects
  };
}

// Recursive function to render key-value pairs with exclusions
const renderKeyValuePairs = (
  obj: any,
  excludeKeys: string[] = [],
  excludeFromNested: { [key: string]: string[] } = {}
): JSX.Element[] => {
  const combinedExcludeKeys = [...excludeKeys, "unit"];
  const elements: JSX.Element[] = [];

  Object.entries(obj).forEach(([key, value]) => {
    // Skip excluded keys
    if (
      combinedExcludeKeys.includes(key) ||
      value === null ||
      value === undefined
    )
      return;

    // Handle nested exclusions
    const nestedExclusions = excludeFromNested[key] || combinedExcludeKeys;

    if (typeof value === "object" && value !== null) {
      elements.push(
        <tr key={key}>
          <td colSpan={2} className="font-medium text-gray-600">
            {key}:
            <div className="ml-4">
              {renderKeyValuePairs(value, nestedExclusions, excludeFromNested)}
            </div>
          </td>
        </tr>
      );
    } else {
      elements.push(
        <tr key={key}>
          <td className="py-2 px-4 border-b text-gray-600 font-medium">{key}</td>
          <td className="py-2 px-4 border-b text-gray-800">{String(value)}</td>
        </tr>
      );
    }
  });

  return elements;
};

export default function EntityDetails({
  data,
  excludeKeys = [],
  excludeFromNested = {},
}: KeyValueListProps) {
  return (
    <div className="p-6 bg-gray-50 rounded-xl shadow-lg max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4">Key-Value List</h1>
      {data?.length ? (
        data.map((item, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow-md mb-4 border border-gray-200"
          >
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left py-2 px-4 font-semibold text-gray-700">Key</th>
                  <th className="text-left py-2 px-4 font-semibold text-gray-700">Value</th>
                </tr>
              </thead>
              <tbody>{renderKeyValuePairs(item, excludeKeys, excludeFromNested)}</tbody>
            </table>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center">No data available</p>
      )}
    </div>
  );
}
