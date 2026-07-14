"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  MenuItem,
} from "@mui/material";
import { Expense, ExpenseCategory } from "@/types";
import { ExpenseInput } from "@/lib/services/expenseService";
import dayjs from "dayjs";

const categories: ExpenseCategory[] = [
  "Marketing",
  "Packaging",
  "Delivery",
  "Salary",
  "Office Rent",
  "Transport",
  "Utility",
  "Other",
];

interface ExpenseFormDialogProps {
  open: boolean;
  initialData?: Expense | null;
  onClose: () => void;
  onSubmit: (data: ExpenseInput) => Promise<void>;
}

const emptyForm: ExpenseInput = {
  category: "Other",
  amount: 0,
  note: "",
  date: dayjs().format("YYYY-MM-DD"),
};

export default function ExpenseFormDialog({
  open,
  initialData,
  onClose,
  onSubmit,
}: ExpenseFormDialogProps) {
  const [form, setForm] = useState<ExpenseInput>(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      const { category, amount, note, date } = initialData;
      setForm({ category, amount, note, date: dayjs(date).format("YYYY-MM-DD") });
    } else {
      setForm(emptyForm);
    }
  }, [initialData, open]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await onSubmit(form);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initialData ? "Edit Expense" : "Add Expense"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            select
            label="Category"
            value={form.category}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, category: e.target.value as ExpenseCategory }))
            }
            fullWidth
          >
            {categories.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Amount"
            type="number"
            value={form.amount}
            onChange={(e) => setForm((prev) => ({ ...prev, amount: Number(e.target.value) }))}
            fullWidth
            required
            inputProps={{ min: 0, step: "0.01" }}
          />

          <TextField
            label="Note"
            value={form.note}
            onChange={(e) => setForm((prev) => ({ ...prev, note: e.target.value }))}
            fullWidth
            multiline
            rows={2}
          />

          <TextField
            label="Date"
            type="date"
            value={form.date}
            onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={submitting}>
          {initialData ? "Save Changes" : "Add Expense"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
