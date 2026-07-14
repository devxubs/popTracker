import api from "../api";
import { ApiResponse, Sale } from "@/types";

export interface SaleInput {
  productId: number;
  quantity: number;
  date?: string;
}

export const saleService = {
  getAll: async (): Promise<Sale[]> => {
    const res = await api.get<ApiResponse<Sale[]>>("/sales");
    return res.data.data;
  },

  create: async (payload: SaleInput): Promise<Sale> => {
    const res = await api.post<ApiResponse<Sale>>("/sales", payload);
    return res.data.data;
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/sales/${id}`);
  },
};
