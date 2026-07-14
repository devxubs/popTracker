// Shared type definitions used across the app, matching the backend Sequelize (MySQL) models.

export interface Product {
  id: number;
  name: string;
  buyPrice: number;
  sellPrice: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface Sale {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  sellPriceAtSale: number;
  totalPrice: number;
  date: string;
}

export type ExpenseCategory =
  | "Marketing"
  | "Packaging"
  | "Delivery"
  | "Salary"
  | "Office Rent"
  | "Transport"
  | "Utility"
  | "Other";

export interface Expense {
  id: number;
  category: ExpenseCategory;
  amount: number;
  note?: string;
  date: string;
}

export interface Investment {
  id: number;
  partnerName: string;
  amount: number;
  date: string;
}

export interface Withdraw {
  id: number;
  partnerName: string;
  amount: number;
  date: string;
}

export interface DashboardSummary {
  totalSales: number;
  totalExpenses: number;
  totalProfit: number;
  totalInvestment: number;
  totalWithdraw: number;
  cashBalance: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  message?: string;
}
