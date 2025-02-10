import React from "react";

interface DropdownProps {
  toggleActions: (value: any) => void;
  children: any;
}

export default function ActionDropdownComponent({ toggleActions, children }:DropdownProps) {
  return (
    <div
      onMouseLeave={toggleActions}
      className="absolute right-0 mt-2 w-48 bg-white z-40 border border-gray-200 rounded-2xl shadow-sm"
    >
      {children}
    </div>
  );
}
