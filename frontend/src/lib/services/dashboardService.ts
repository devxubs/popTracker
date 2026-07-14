import api from "../api";
import { ApiResponse, DashboardSummary, Sale, Expense } from "@/types";

export interface ReportData {
  period: string;
  totalSales: number;
  totalExpenses: number;
  netProfit: number;
  sales: Sale[];
  expenses: Expense[];
}

export const dashboardService = {
  getSummary: async (): Promise<DashboardSummary> => {
    const res = await api.get<ApiResponse<DashboardSummary>>("/dashboard/summary");
    return res.data.data;
  },

  getReport: async (
    period: "daily" | "monthly" | "yearly" | "custom",
    from?: string,
    to?: string
  ): Promise<ReportData> => {
    const res = await api.get<ApiResponse<ReportData>>("/dashboard/report", {
      params: { period, from, to },
    });
    return res.data.data;
  },
};
