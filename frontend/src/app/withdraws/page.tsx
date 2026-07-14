"use client";

import React, { useEffect, useState } from "react";
import {
   Box,
   Typography,
   Button,
   Paper,
   Table,
   TableHead,
   TableBody,
   TableRow,
   TableCell,
   IconButton,
   CircularProgress,
   Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import { Withdraw } from "@/types";
import { withdrawService, WithdrawInput } from "@/lib/services/withdrawService";
import { formatCurrency, formatDate } from "@/lib/format";
import WithdrawFormDialog from "@/components/withdraws/WithdrawFormDialog";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import ActionMenu from "@/components/common/ActionMenu";

export default function WithdrawsPage() {
   const [withdraws, setWithdraws] = useState<Withdraw[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState("");

   const [formOpen, setFormOpen] = useState(false);
   const [deleteTarget, setDeleteTarget] = useState<Withdraw | null>(null);

   const fetchWithdraws = async () => {
      setLoading(true);
      try {
         const data = await withdrawService.getAll();
         setWithdraws(data);
         setError("");
      } catch {
         setError("Failed to load withdrawals.");
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchWithdraws();
   }, []);

   const handleFormSubmit = async (data: WithdrawInput) => {
      await withdrawService.create(data);
      await fetchWithdraws();
   };

   const handleDeleteConfirm = async () => {
      if (!deleteTarget) return;
      await withdrawService.remove(deleteTarget.id);
      setDeleteTarget(null);
      await fetchWithdraws();
   };

   const totalWithdraw = withdraws.reduce((sum, w) => sum + w.amount, 0);

   return (
      <Box>
         <Box
            sx={{
               display: "flex",
               justifyContent: "space-between",
               alignItems: "center",
               mb: 3,
            }}
         >
            <Typography variant="h4">Withdraws</Typography>
            <Button
               variant="contained"
               startIcon={<AddIcon />}
               onClick={() => setFormOpen(true)}
            >
               Add Withdraw
            </Button>
         </Box>

         {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
               {error}
            </Alert>
         )}

         <Paper variant="outlined">
            {loading ? (
               <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                  <CircularProgress />
               </Box>
            ) : (
               <Table>
                  <TableHead>
                     <TableRow>
                        <TableCell>Partner</TableCell>
                        <TableCell align="right">Amount</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell align="right">Actions</TableCell>
                     </TableRow>
                  </TableHead>
                  <TableBody>
                     {withdraws.map((w) => (
                        <TableRow key={w.id} hover>
                           <TableCell>{w.partnerName}</TableCell>
                           <TableCell align="right">
                              {formatCurrency(w.amount)}
                           </TableCell>
                           <TableCell>{formatDate(w.date)}</TableCell>
                           <TableCell align="right">
                              <ActionMenu
                                 menuOptions={[
                                    {
                                       label: "Delete",
                                       color: "error",
                                       icon: <DeleteIcon />,
                                       onClick: () => setDeleteTarget(w),
                                    },
                                 ]}
                              />
                           </TableCell>
                        </TableRow>
                     ))}
                     {withdraws.length === 0 && (
                        <TableRow>
                           <TableCell colSpan={4} align="center">
                              No withdrawals recorded yet.
                           </TableCell>
                        </TableRow>
                     )}
                  </TableBody>
                  {withdraws.length > 0 && (
                     <TableBody
                        sx={{
                           "&  :last-child td": { borderBottom: "none" },
                        }}
                     >
                        <TableRow>
                           <TableCell>
                              <Typography fontWeight={700}>Total</Typography>
                           </TableCell>
                           <TableCell align="right">
                              <Typography fontWeight={700}>
                                 {formatCurrency(totalWithdraw)}
                              </Typography>
                           </TableCell>
                           <TableCell colSpan={2} />
                        </TableRow>
                     </TableBody>
                  )}
               </Table>
            )}
         </Paper>

         <WithdrawFormDialog
            open={formOpen}
            onClose={() => setFormOpen(false)}
            onSubmit={handleFormSubmit}
         />

         <ConfirmDialog
            open={!!deleteTarget}
            title="Delete Withdraw"
            message={`Delete this withdrawal of ${
               deleteTarget ? formatCurrency(deleteTarget.amount) : ""
            } by ${deleteTarget?.partnerName}?`}
            onConfirm={handleDeleteConfirm}
            onCancel={() => setDeleteTarget(null)}
         />
      </Box>
   );
}
