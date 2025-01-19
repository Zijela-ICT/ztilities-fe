export const tableMainButtonConfigs = {
  users: [
    {
      text: "Create User",
      className: "flex-1 px-4 py-3 text-white bg-[#A8353A]",
      permissions: ["create_users", "create_users:pre-register"],
      action: "createUser",
    },
    {
      text: "Bulk User",
      className:
        "flex-1 px-4 py-3 text-[#A8353A] bg-white border border-[#A8353A]",
      permissions: ["create_users", "create_users:pre-register"],
      action: "createBulkUser",
    },
  ],
  roles: [
    {
      text: "Create Role",
      className: "flex-1 px-4 py-3 text-white bg-[#A8353A]",
      permissions: ["create_roles"],
      action: "createRole",
    },
  ],
  facilities: [
    {
      text: "Create Facility",
      className: "flex-1 px-4 py-3 text-white bg-[#A8353A]",
      permissions: ["create_facilities"],
      action: "createFacility",
    },
    {
      text: "Bulk Facility",
      className:
        "flex-1 px-4 py-3 text-[#A8353A] bg-white border border-[#A8353A]",
      permissions: ["create_facilities"],
      action: "createBulkFacility",
    },
  ],
  blocks: [
    {
      text: "Create Block",
      className: "flex-1 px-4 py-3 text-white bg-[#A8353A]",
      permissions: ["create_blocks"],
      action: "createBlock",
    },
  ],
  units: [
    {
      text: "Add New Units",
      className: "flex-1 px-4 py-3 text-white bg-[#A8353A]",
      permissions: ["create_units"],
      action: "createUnit",
    },
  ],
  assets: [
    {
      text: "Add New Assets",
      className: "flex-1 px-4 py-3 text-white bg-[#A8353A]",
      permissions: ["create_facilities"],
      action: "createAsset",
    },
  ],
  categories: [
    {
      text: "Add Category",
      className: "flex-1 px-4 py-3 text-white bg-[#A8353A]",
      permissions: ["create_assets:/category"],
      action: "createAssetCategory",
    },
  ],
  vendors: [
    {
      text: "Add New Vendor",
      className: "flex-1 px-4 py-3 text-white bg-[#A8353A]",
      permissions: ["create_vendors"],
      action: "createVendor",
    },
  ],
  technicians: [
    {
      text: "Add New Technician",
      className: "flex-1 px-4 py-3 text-white bg-[#A8353A]",
      permissions: ["create_vendors"],
      action: "createTechnician",
    },
  ],
  powers: [
    {
      text: "Power Charge",
      className: "flex-1 px-4 py-3 text-white bg-[#A8353A]",
      permissions: ["create_power-charges"],
      action: "createPowerCharge",
    },
  ],
  workrequests: [
    {
      text: "Create Work Request",
      className: "flex-1 px-4 py-3 text-white bg-[#A8353A]",
      permissions: ["create_work-requests"],
      action: "createWorkRequest",
    },
    {
      text: "Create Work Request for User",
      className:
        "flex-1 px-4 py-3 text-[#A8353A] bg-white border border-[#A8353A]",
      permissions: ["create_work-requests:for-a-user"],
      action: "createWorkRequestforUser",
    },
  ],
  workorders: [
    {
      text: "Create Work Order",
      className: "flex-1 px-4 py-3 text-white bg-[#A8353A]",
      permissions: ["create_work-orders"],
      action: "createWorkOrder",
    },
  ],
};
