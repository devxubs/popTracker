"use client";

import React, { useEffect, useState } from "react";
import { Grid, Typography, Box, CircularProgress, Alert } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import PaidIcon from "@mui/icons-material/Paid";
import SavingsIcon from "@mui/icons-material/Savings";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import StatCard from "@/components/common/StatCard";
import SalesExpenseChart from "@/components/dashboard/SalesExpenseChart";
import { dashboardService } from "@/lib/services/dashboardService";
import { DashboardSummary } from "@/types";
import { formatCurrency } from "@/lib/format";

export default function DashboardPage() {
   const [summary, setSummary] = useState<DashboardSummary | null>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState("");

   useEffect(() => {
      const load = async () => {
         try {
            const data = await dashboardService.getSummary();
            setSummary(data);
         } catch (err) {
            setError(
               "Failed to load dashboard data. Is the backend server running?",
            );
         } finally {
            setLoading(false);
         }
      };
      load();
   }, []);

   if (loading) {
      return (
         <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
            <CircularProgress />
         </Box>
      );
   }

   if (error || !summary) {
      return <Alert severity="error">{error}</Alert>;
   }

   // Placeholder weekly breakdown — in production this would come from a dedicated
   // /api/dashboard/weekly endpoint that groups sales/expenses by day.
   const chartData = [
      { name: "Mon", sales: 0, expenses: 0 },
      { name: "Tue", sales: 0, expenses: 0 },
      { name: "Wed", sales: 0, expenses: 0 },
      { name: "Thu", sales: 0, expenses: 0 },
      { name: "Fri", sales: 0, expenses: 0 },
      { name: "Sat", sales: 0, expenses: 0 },
      {
         name: "Sun",
         sales: summary.totalSales,
         expenses: summary.totalExpenses,
      },
   ];

   return (
      <Box>
         <Typography variant="h4" sx={{ mb: 3 }}>
            Dashboard
         </Typography>

         <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
               <StatCard
                  label="Total Sales"
                  value={formatCurrency(summary.totalSales)}
                  icon={<TrendingUpIcon />}
                  color="primary"
               />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
               <StatCard
                  label="Total Expenses"
                  value={formatCurrency(summary.totalExpenses)}
                  icon={<TrendingDownIcon />}
                  color="error"
               />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
               <StatCard
                  label="Net Profit"
                  value={formatCurrency(summary.totalProfit)}
                  icon={<PaidIcon />}
                  color="success"
               />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
               <StatCard
                  label="Total Investment"
                  value={formatCurrency(summary.totalInvestment)}
                  icon={<SavingsIcon />}
                  color="secondary"
               />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
               <StatCard
                  label="Total Withdraw"
                  value={formatCurrency(summary.totalWithdraw)}
                  icon={<AccountBalanceWalletIcon />}
                  color="error"
               />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
               <StatCard
                  label="Cash Balance"
                  value={formatCurrency(summary.cashBalance)}
                  icon={<AccountBalanceWalletIcon />}
                  color="primary"
               />
            </Grid>
         </Grid>

         <Box sx={{ mt: 4 }}>
            <SalesExpenseChart data={chartData} />
         </Box>
      </Box>
   );
}
