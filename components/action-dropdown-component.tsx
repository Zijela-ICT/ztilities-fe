import React from "react";

interface DropdownProps {
  toggleActions: (value: any) => void;
  contextMenued? :boolean;
  children: any;
}

export default function ActionDropdownComponent({ toggleActions, contextMenued, children }:DropdownProps) {
  return (
    <>
    <div
      onMouseLeave={toggleActions}
      className="absolute right-0 mt-2 w-48 bg-white z-40 border border-gray-200 rounded-2xl shadow-sm"
    >
      {children}
    </div>
    </>
  );
}

// import React from "react";

// interface DropdownProps {
//   toggleActions: (value: any) => void;
//   contextMenuedActions?: (value: any) => void;
//   contextMenued?: string | null;
//   children: any;
// }

// export default function ActionDropdownComponent({
//   toggleActions,
//   contextMenuedActions,
//   contextMenued,
//   children,
// }: DropdownProps) {
//   if (contextMenued) {
//     return (
//       // Full-screen overlay with a gray background and opacity
//       <div
//         onClick={() => {
//           toggleActions(null);
//           contextMenuedActions(null);
//         }}
//         onMouseLeave={toggleActions}
//         className="fixed inset-0 z-10 bg-gray-200 bg-opacity-30"
//       >
//         {/* Centered dropdown. Clicking inside stops propagation */}
//         <div
//           onClick={(e) => e.stopPropagation()}
//           className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 bg-white border border-gray-200 rounded-2xl shadow-sm"
//         >
//           {children}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div
//       onMouseLeave={toggleActions}
//       className="absolute right-0 mt-2 w-48 bg-white z-40 border border-gray-200 rounded-2xl shadow-sm"
//     >
//       {children}
//     </div>
//   );
// }
