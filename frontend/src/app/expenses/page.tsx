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
   Chip,
   CircularProgress,
   Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import { Expense } from "@/types";
import { expenseService, ExpenseInput } from "@/lib/services/expenseService";
import { formatCurrency, formatDate } from "@/lib/format";
import ExpenseFormDialog from "@/components/expenses/ExpenseFormDialog";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import ActionMenu from "@/components/common/ActionMenu";

export default function ExpensesPage() {
   const [expenses, setExpenses] = useState<Expense[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState("");

   const [formOpen, setFormOpen] = useState(false);
   const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
   const [deleteTarget, setDeleteTarget] = useState<Expense | null>(null);

   const fetchExpenses = async () => {
      setLoading(true);
      try {
         const data = await expenseService.getAll();
         setExpenses(data);
         setError("");
      } catch {
         setError("Failed to load expenses.");
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchExpenses();
   }, []);

   const handleAddClick = () => {
      setEditingExpense(null);
      setFormOpen(true);
   };

   const handleEditClick = (expense: Expense) => {
      setEditingExpense(expense);
      setFormOpen(true);
   };

   const handleFormSubmit = async (data: ExpenseInput) => {
      if (editingExpense) {
         await expenseService.update(editingExpense.id, data);
      } else {
         await expenseService.create(data);
      }
      await fetchExpenses();
   };

   const handleDeleteConfirm = async () => {
      if (!deleteTarget) return;
      await expenseService.remove(deleteTarget.id);
      setDeleteTarget(null);
      await fetchExpenses();
   };

   const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

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
            <Typography variant="h4">Expenses</Typography>
            <Button
               variant="contained"
               startIcon={<AddIcon />}
               onClick={handleAddClick}
            >
               Add Expense
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
                        <TableCell>Category</TableCell>
                        <TableCell align="right">Amount</TableCell>
                        <TableCell>Note</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell align="right">Actions</TableCell>
                     </TableRow>
                  </TableHead>
                  <TableBody>
                     {expenses.map((e) => (
                        <TableRow key={e.id} hover>
                           <TableCell>
                              <Chip label={e.category} size="small" />
                           </TableCell>
                           <TableCell align="right">
                              {formatCurrency(e.amount)}
                           </TableCell>
                           <TableCell>{e.note || "—"}</TableCell>
                           <TableCell>{formatDate(e.date)}</TableCell>
                           <TableCell align="right">
                              <ActionMenu
                                 menuOptions={[
                                    {
                                       label: "Edit",
                                       color: "primary",
                                       icon: <EditIcon />,
                                       onClick: () => handleEditClick(e),
                                    },
                                    {
                                       label: "Delete",
                                       color: "error",
                                       icon: <DeleteIcon />,
                                       onClick: () => setDeleteTarget(e),
                                    },
                                 ]}
                              />
                           </TableCell>
                        </TableRow>
                     ))}
                     {expenses.length === 0 && (
                        <TableRow>
                           <TableCell colSpan={5} align="center">
                              No expenses recorded yet.
                           </TableCell>
                        </TableRow>
                     )}
                  </TableBody>
                  {expenses.length > 0 && (
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
                                 {formatCurrency(totalExpenses)}
                              </Typography>
                           </TableCell>
                           <TableCell colSpan={3} />
                        </TableRow>
                     </TableBody>
                  )}
               </Table>
            )}
         </Paper>

         <ExpenseFormDialog
            open={formOpen}
            initialData={editingExpense}
            onClose={() => setFormOpen(false)}
            onSubmit={handleFormSubmit}
         />

         <ConfirmDialog
            open={!!deleteTarget}
            title="Delete Expense"
            message={`Delete this ${deleteTarget?.category} expense of ${
               deleteTarget ? formatCurrency(deleteTarget.amount) : ""
            }?`}
            onConfirm={handleDeleteConfirm}
            onCancel={() => setDeleteTarget(null)}
         />
      </Box>
   );
}
