"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard-layout-component";
import withPermissions from "@/components/auth/permission-protected-routes";

import { useDataPermission } from "@/context";

import { useParams, useRouter } from "next/navigation";
import createAxiosInstance from "@/utils/api";
import FacilityDetails from "@/components/facility-management/view-facility";
import PermissionGuard from "@/components/auth/permission-protected-components";
import ButtonComponent from "@/components/button-component";
import { jsPDF } from "jspdf";

function Transaction() {
  const axiosInstance = createAxiosInstance();
  const {
    pagination,
    setPagination,
    searchQuery,
    filterQuery,
    clearSearchAndPagination,
    setShowFilter,
    showFilter,
    centralState,
    setCentralState,
    centralStateDelete,
    setCentralStateDelete,
    setSuccessState,
  } = useDataPermission();
  const router = useRouter();
  const { id } = useParams();

  const [transaction, setTransaction] = useState<any>();

  const getATransaction = async () => {
    const response = await axiosInstance.get(`/transactions/${id}`);
    setTransaction(response.data.data);
  };

  useEffect(() => {
    if (id) {
      getATransaction();
    }
  }, [id]);

  const generateReceipt = async () => {
    if (!transaction) return;

    const doc = new jsPDF();

    // Add a logo (replace "logo.png" with your actual logo path or base64 data)
    const logoWidth = 30; // Adjust as needed
    const logoHeight = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.addImage(
      "/assets/logo.png",
      "PNG",
      pageWidth - logoWidth - 10,
      10,
      logoWidth,
      logoHeight
    );

    // Header
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Receipt", 20, 20);

    // Draw a horizontal line for separation
    doc.setLineWidth(0.5);
    doc.line(20, 25, pageWidth - 20, 25);

    let startY = 40; // Start position for transaction details

    // Function to process transaction details
    const addTransactionDetails = (obj, indent = 0) => {
      Object.entries(obj).forEach(([key, value]: any) => {
        if (
          value === null ||
          value === undefined ||
          value === "" ||
          key === "id"
        )
          return; // Skip null/empty values

        let text = "";
        if (typeof value === "object") {
          // Show only firstName and lastName if available
          if (value.firstName || value.lastName) {
            text = `${key}: ${value.firstName || ""} ${value.lastName || ""}`;
          } else {
            return; // Skip object if firstName/lastName are missing
          }
        } else {
          text = `${key}: ${value}`;
        }

        // Set font and styling
        doc.setFontSize(12);
        doc.setFont("helvetica", indent > 0 ? "italic" : "normal");
        doc.text(`${" ".repeat(indent * 2)}${text}`, 20, startY);
        startY += 10; // Move to the next line
      });
    };

    // Add transaction details
    addTransactionDetails(transaction);

    // Draw a final horizontal line
    doc.line(20, startY + 5, pageWidth - 20, startY + 5);

    // Save the PDF
    doc.save(`receipt_${transaction.id || "unknown"}.pdf`);

    // Reset state if necessary
    setCentralStateDelete("");
  };

  return (
    <DashboardLayout
      title={`Transaction`}
      detail="Transaction Details"
      dynamic
      onclick={() => router.back()}
      getTitle={() => "Generate Reciept"}
      getDetail={() => "Do you want to genrate reciept for this transaction?"}
      takeAction={
        centralStateDelete === "generateReciept" ? generateReceipt : null
      }
    >
      <div className="relative bg-white rounded-2xl p-8 ">
        <FacilityDetails facility={transaction} title="Transactions" />

        <div className="flex items-center bg-white p-6  rounded-lg mt-2">
          <div className="ml-auto flex gap-4">
            <PermissionGuard requiredPermissions={[]}>
              <ButtonComponent
                text="Generate Reciept"
                className="w-24 text-white"
                onClick={() => setCentralStateDelete("generateReciept")}
              />
            </PermissionGuard>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default withPermissions(Transaction, ["transactions"]);
