import { useDataPermission } from "@/context";
import React from "react";

// Define your Role interface (or import it from your types)
export interface Role {
  name: string;
}

interface StatusBadgeProps {
  status?: string; // The raw status value (e.g., "awaiting selection")
  // List of roles for the current user
}

// Full default mapping for non-tenant users
const defaultStatusMapping: Record<
  string,
  { text: string; className: string }
> = {
  approved: { text: "Approved", className: "text-[#1E8449] bg-[#D4EFDF]" },
  active : {text : "Active", className: "text-[#036B26] bg-[#E7F6EC]"},
  inactive : {text : "In-active", className: "text-[#B76E00] bg-[#FFAB0014]"},
  pending: { text: "Pending", className: "text-[#FF8C00] bg-[#FFEFD5]" },
  rejected: { text: "Rejected", className: "text-[#C0392B] bg-[#FADBD8]" },
  closed: { text: "Closed", className: "text-[#5D6D7E] bg-[#D6DBDF]" },
  reopened: { text: "Reopened", className: "text-[#0E6655] bg-[#D1F2EB]" },
  accepted: { text: "Accepted", className: "text-[#1E8449] bg-[#D4EFDF]" },
  "payment order raised": {
    text: "Payment Order Raised",
    className: "text-[#1E8449] bg-[#D4EFDF]",
  },
  initiated: { text: "Initiated", className: "text-[#2874A6] bg-[#D6EAF8]" },
  "assigned to procurement": {
    text: "Assigned to Procurement",
    className: "text-[#2874A6] bg-[#D6EAF8]",
  },
  "quotation selected": {
    text: "Quotation Selected",
    className: "text-[#1E90FF] bg-[#D6E9FF]",
  },
  "quotation approved": {
    text: "Quotation Approved",
    className: "text-[#28A745] bg-[#DFF6DF]",
  },
  apportionment_approved: {
    text: "Apportionment Approved",
    className: "text-[#28A745] bg-[#DFF6DF]",
  },
  "awaiting selection": {
    text: "Awaiting Selection",
    className: "text-[#FFC107] bg-[#FFF8E1]",
  },
  "uploading quotations": {
    text: "Uploading Quotations",
    className: "text-[#FFC107] bg-[#FFF8E1]",
  },
  "waiting for quotations": {
    text: "Waiting for Quotations",
    className: "text-[#FF8C00] bg-[#FFF4E1]",
  },
  "quotations uploaded": {
    text: "Quotations Uploaded",
    className: "text-[#1E90FF] bg-[#D6E9FF]",
  },
  apportioned: {
    text: "Apportioned",
    className: "text-[#6A1B9A] bg-[#F3E5F5]",
  },
};

// Tenant simplified mapping for the three statuses
const tenantSimplifiedMapping: Record<
  "initiated" | "in progress" | "awaiting acceptance" | "closed",
  { text: string; className: string }
> = {
  initiated: { text: "Initiated", className: "text-blue-600 bg-blue-100" },
  "in progress": {
    text: "In Progress",
    className: "text-yellow-600 bg-yellow-100",
  },
  "awaiting acceptance" : {
    text: "Awaiting Acceptance",
    className: "text-blue-600 bg-blue-100",
  },
  closed: { text: "Closed", className: "text-gray-600 bg-gray-100" },
};

// Arrays of statuses that should be simplified for tenant users.
// Adjust the arrays below to include all statuses that you want to group.
const tenantInitiatedStatuses: string[] = ["initiated"];

const tenantInProgressStatuses: string[] = [
  "assigned to procurement",
  "quotation selected",
  "quotation approved",
  "awaiting selection",
  "uploading quotations",
  "waiting for quotations",
  "quotations uploaded",
  "approved",
  "apportioned",
  "reopened",
  "accepted",
];

const tenantAwaitingAcceptanceStatuses :string[] = [
  "awaiting acceptance"
]

const tenantClosedStatuses: string[] = ["closed", "apportionment_approved"];

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const { userRoles } = useDataPermission();
  // Normalize the status to lowercase for consistency
  const rawStatus = status?.toString().toLowerCase() || "";

  // Check if the user has the TENANT_ROLE 
  const hasTenantRole = userRoles.some(
    (role: Role) => role.name === "TENANT_ROLE " || role.name === "VENDOR_ROLE"
  );

  let finalStatus: { text: string; className: string };

  if (hasTenantRole) {
    // If tenant role is found, simplify the status based on the arrays.
    if (tenantInitiatedStatuses.includes(rawStatus)) {
      finalStatus = tenantSimplifiedMapping.initiated;
    } else if (tenantInProgressStatuses.includes(rawStatus)) {
      finalStatus = tenantSimplifiedMapping["in progress"];
    } else if (tenantClosedStatuses.includes(rawStatus)) {
      finalStatus = tenantSimplifiedMapping.closed;
    } else if (tenantAwaitingAcceptanceStatuses.includes(rawStatus)) {
      finalStatus = tenantSimplifiedMapping["awaiting acceptance"];
    } else {
      // If the status doesn't fall into any of the simplified groups,
      // fall back to the default mapping (or customize as needed).
      finalStatus = defaultStatusMapping[rawStatus] || {
        text: rawStatus,
        className: "text-[#2874A6] bg-[#D6EAF8]",
      };
    }
  } else {
    // If no tenant role, use the full default mapping.
    finalStatus = defaultStatusMapping[rawStatus] || {
      text: rawStatus,
      className: "text-[#2874A6] bg-[#D6EAF8]",
    };
  }

  return (
    <span
      className={`px-2.5 py-1 ${finalStatus.className} text-center rounded-full whitespace-nowrap`}
    >
      {finalStatus.text}
    </span>
  );
};

export default StatusBadge;
