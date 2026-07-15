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
   alpha,
   useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import { Investment } from "@/types";
import {
   investmentService,
   InvestmentInput,
} from "@/lib/services/investmentService";
import { formatCurrency, formatDate } from "@/lib/format";
import InvestmentFormDialog from "@/components/investments/InvestmentFormDialog";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import ActionMenu from "@/components/common/ActionMenu";

export default function InvestmentsPage() {
   const theme = useTheme();
   const [investments, setInvestments] = useState<Investment[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState("");

   const [formOpen, setFormOpen] = useState(false);
   const [deleteTarget, setDeleteTarget] = useState<Investment | null>(null);

   const fetchInvestments = async () => {
      setLoading(true);
      try {
         const data = await investmentService.getAll();
         setInvestments(data);
         setError("");
      } catch {
         setError("Failed to load investments.");
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchInvestments();
   }, []);

   const handleFormSubmit = async (data: InvestmentInput) => {
      await investmentService.create(data);
      await fetchInvestments();
   };

   const handleDeleteConfirm = async () => {
      if (!deleteTarget) return;
      await investmentService.remove(deleteTarget.id);
      setDeleteTarget(null);
      await fetchInvestments();
   };

   const totalInvestment = investments.reduce(
      (sum, i) => sum + Number(i.amount),
      0,
   );

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
            <Typography variant="h4">Investments</Typography>
            <Button
               variant="contained"
               startIcon={<AddIcon />}
               onClick={() => setFormOpen(true)}
            >
               Add Investment
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
                     <TableRow
                        sx={{
                           "& th": {
                              backgroundColor: alpha(
                                 theme.palette.primary.main,
                                 0.1,
                              ),
                           },
                           "& :first-of-type": {
                              borderTopLeftRadius: 12,
                           },
                           "& :last-child": {
                              borderTopRightRadius: 12,
                           },
                        }}
                     >
                        <TableCell>Partner</TableCell>
                        <TableCell align="right">Amount</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell align="right">Actions</TableCell>
                     </TableRow>
                  </TableHead>
                  <TableBody>
                     {investments.map((inv) => (
                        <TableRow key={inv.id} hover>
                           <TableCell>{inv.partnerName}</TableCell>
                           <TableCell align="right">
                              {formatCurrency(inv.amount)}
                           </TableCell>
                           <TableCell>{formatDate(inv.date)}</TableCell>
                           <TableCell align="right">
                              <ActionMenu
                                 menuOptions={[
                                    {
                                       label: "Delete",
                                       color: "error",
                                       icon: <DeleteIcon />,
                                       onClick: () => setDeleteTarget(inv),
                                    },
                                 ]}
                              />
                           </TableCell>
                        </TableRow>
                     ))}
                     {investments.length === 0 && (
                        <TableRow>
                           <TableCell colSpan={4} align="center">
                              No investments recorded yet.
                           </TableCell>
                        </TableRow>
                     )}
                  </TableBody>
                  {investments.length > 0 && (
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
                                 {formatCurrency(totalInvestment) || ""}
                              </Typography>
                           </TableCell>
                           <TableCell colSpan={2} />
                        </TableRow>
                     </TableBody>
                  )}
               </Table>
            )}
         </Paper>

         <InvestmentFormDialog
            open={formOpen}
            onClose={() => setFormOpen(false)}
            onSubmit={handleFormSubmit}
         />

         <ConfirmDialog
            open={!!deleteTarget}
            title="Delete Investment"
            message={`Delete this investment of ${
               deleteTarget ? formatCurrency(deleteTarget.amount) : ""
            } by ${deleteTarget?.partnerName}?`}
            onConfirm={handleDeleteConfirm}
            onCancel={() => setDeleteTarget(null)}
         />
      </Box>
   );
}
