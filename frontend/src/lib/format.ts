/**
 * Formats a number as currency (BDT Taka by default).
 * Centralized here so the symbol/format can be changed once for the whole app.
 */
export const formatCurrency = (amount: number): string =>
   `৳${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const formatDate = (dateStr: string): string =>
   new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
   });
