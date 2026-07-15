"use client";

import React, { useEffect, useState } from "react";
import {
   Box,
   Typography,
   Paper,
   ToggleButtonGroup,
   ToggleButton,
   Grid,
   CircularProgress,
   Alert,
   TextField,
   Stack,
   Table,
   TableHead,
   TableBody,
   TableRow,
   TableCell,
} from "@mui/material";
import StatCard from "@/components/common/StatCard";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import PaidIcon from "@mui/icons-material/Paid";
import { dashboardService, ReportData } from "@/lib/services/dashboardService";
import { formatCurrency, formatDate } from "@/lib/format";

type Period = "daily" | "monthly" | "yearly" | "custom";

export default function ReportsPage() {
   const [period, setPeriod] = useState<Period>("daily");
   const [from, setFrom] = useState("");
   const [to, setTo] = useState("");
   const [report, setReport] = useState<ReportData | null>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState("");

   const fetchReport = async () => {
      // Custom period requires both dates before we query
      if (period === "custom" && (!from || !to)) return;

      setLoading(true);
      try {
         const data = await dashboardService.getReport(period, from, to);
         setReport(data);
         setError("");
      } catch {
         setError("Failed to load report.");
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchReport();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [period, from, to]);

   return (
      <Box>
         <Typography variant="h4" sx={{ mb: 3 }}>
            Reports
         </Typography>

         <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
            <Stack
               direction={{ xs: "column", sm: "row" }}
               spacing={2}
               alignItems="center"
            >
               <ToggleButtonGroup
                  value={period}
                  exclusive
                  onChange={(_, val) => val && setPeriod(val)}
                  size="small"
               >
                  <ToggleButton value="daily">Daily</ToggleButton>
                  <ToggleButton value="monthly">Monthly</ToggleButton>
                  <ToggleButton value="yearly">Yearly</ToggleButton>
                  <ToggleButton value="custom">Custom</ToggleButton>
               </ToggleButtonGroup>

               {period === "custom" && (
                  <>
                     <TextField
                        label="From"
                        type="date"
                        size="small"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                     />
                     <TextField
                        label="To"
                        type="date"
                        size="small"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                     />
                  </>
               )}
            </Stack>
         </Paper>

         {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
               {error}
            </Alert>
         )}

         {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
               <CircularProgress />
            </Box>
         ) : report ? (
            <>
               <Grid container spacing={3} sx={{ mb: 3 }}>
                  <Grid size={{ xs: 12, sm: 4 }}>
                     <StatCard
                        label="Sales"
                        value={formatCurrency(report.totalSales)}
                        icon={<TrendingUpIcon />}
                        color="primary"
                     />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                     <StatCard
                        label="Expenses"
                        value={formatCurrency(report.totalExpenses)}
                        icon={<TrendingDownIcon />}
                        color="error"
                     />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                     <StatCard
                        label="Net Profit"
                        value={formatCurrency(report.netProfit)}
                        icon={<PaidIcon />}
                        color="success"
                     />
                  </Grid>
               </Grid>

               <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 6 }}>
                     <Paper variant="outlined">
                        <Typography variant="h6" sx={{ p: 2 }}>
                           Sales
                        </Typography>
                        <Table size="small">
                           <TableHead>
                              <TableRow>
                                 <TableCell>Product</TableCell>
                                 <TableCell align="right">Total</TableCell>
                                 <TableCell>Date</TableCell>
                              </TableRow>
                           </TableHead>
                           <TableBody
                              sx={{
                                 "&  :last-child td": { borderBottom: "none" },
                              }}
                           >
                              {report.sales.map((s) => (
                                 <TableRow key={s.id}>
                                    <TableCell>{s.productName}</TableCell>
                                    <TableCell align="right">
                                       {formatCurrency(s.totalPrice)}
                                    </TableCell>
                                    <TableCell>{formatDate(s.date)}</TableCell>
                                 </TableRow>
                              ))}
                              {report.sales.length === 0 && (
                                 <TableRow>
                                    <TableCell colSpan={3} align="center">
                                       No sales in this period.
                                    </TableCell>
                                 </TableRow>
                              )}
                           </TableBody>
                        </Table>
                     </Paper>
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                     <Paper variant="outlined">
                        <Typography variant="h6" sx={{ p: 2 }}>
                           Expenses
                        </Typography>
                        <Table size="small">
                           <TableHead>
                              <TableRow>
                                 <TableCell>Category</TableCell>
                                 <TableCell align="right">Amount</TableCell>
                                 <TableCell>Date</TableCell>
                              </TableRow>
                           </TableHead>
                           <TableBody
                              sx={{
                                 "&  :last-child td": { borderBottom: "none" },
                              }}
                           >
                              {report.expenses.map((e) => (
                                 <TableRow key={e.id}>
                                    <TableCell>{e.category}</TableCell>
                                    <TableCell align="right">
                                       {formatCurrency(e.amount)}
                                    </TableCell>
                                    <TableCell>{formatDate(e.date)}</TableCell>
                                 </TableRow>
                              ))}
                              {report.expenses.length === 0 && (
                                 <TableRow>
                                    <TableCell colSpan={3} align="center">
                                       No expenses in this period.
                                    </TableCell>
                                 </TableRow>
                              )}
                           </TableBody>
                        </Table>
                     </Paper>
                  </Grid>
               </Grid>
            </>
         ) : (
            <Alert severity="info">
               Select a date range to view the report.
            </Alert>
         )}
      </Box>
   );
}
