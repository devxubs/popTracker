import api from "../api";
import { ApiResponse, Investment } from "@/types";

export interface InvestmentInput {
  partnerName: string;
  amount: number;
  date?: string;
}

export const investmentService = {
  getAll: async (): Promise<Investment[]> => {
    const res = await api.get<ApiResponse<Investment[]>>("/investments");
    return res.data.data;
  },

  create: async (payload: InvestmentInput): Promise<Investment> => {
    const res = await api.post<ApiResponse<Investment>>("/investments", payload);
    return res.data.data;
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/investments/${id}`);
  },
};
