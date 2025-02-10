export default function formatCurrency(amount: any) {
  if (typeof amount === "string") {
    amount = amount.replace(/,/g, ""); // Remove commas if present
    if (!/^\d+(\.\d+)?$/.test(amount)) return "Invalid number"; // Ensure it's a valid number string
    amount = parseFloat(amount); // Convert to a number
  }

  if (typeof amount !== "number" || isNaN(amount)) {
    return "Invalid number";
  }

  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatCurrencyInput(amount: any) {
  // Remove non-numeric characters except for decimal point
  const numericValue = amount && amount?.replace(/[^0-9.]/g, "");
  // Format the number with commas
  return numericValue?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
