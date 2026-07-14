import api from "../api";
import { ApiResponse, Expense, ExpenseCategory } from "@/types";

export interface ExpenseInput {
  category: ExpenseCategory;
  amount: number;
  note?: string;
  date?: string;
}

export const expenseService = {
  getAll: async (): Promise<Expense[]> => {
    const res = await api.get<ApiResponse<Expense[]>>("/expenses");
    return res.data.data;
  },

  create: async (payload: ExpenseInput): Promise<Expense> => {
    const res = await api.post<ApiResponse<Expense>>("/expenses", payload);
    return res.data.data;
  },

  update: async (id: number, payload: ExpenseInput): Promise<Expense> => {
    const res = await api.put<ApiResponse<Expense>>(`/expenses/${id}`, payload);
    return res.data.data;
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/expenses/${id}`);
  },
};
