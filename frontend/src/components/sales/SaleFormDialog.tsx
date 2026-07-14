"use client";

import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  MenuItem,
  Typography,
} from "@mui/material";
import { Product } from "@/types";
import { SaleInput } from "@/lib/services/saleService";
import { formatCurrency } from "@/lib/format";
import dayjs from "dayjs";

interface SaleFormDialogProps {
  open: boolean;
  products: Product[];
  onClose: () => void;
  onSubmit: (data: SaleInput) => Promise<void>;
}

export default function SaleFormDialog({
  open,
  products,
  onClose,
  onSubmit,
}: SaleFormDialogProps) {
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const selectedProduct = useMemo(
    () => products.find((p) => String(p.id) === productId),
    [products, productId]
  );

  // Auto-calculated total, purely for display before submitting
  const total = selectedProduct ? selectedProduct.sellPrice * quantity : 0;

  const resetForm = () => {
    setProductId("");
    setQuantity(1);
    setDate(dayjs().format("YYYY-MM-DD"));
    setErrorMsg("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    if (!selectedProduct) return;
    if (quantity > selectedProduct.stock) {
      setErrorMsg(`Only ${selectedProduct.stock} unit(s) in stock.`);
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit({ productId: Number(productId), quantity, date });
      handleClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Sale</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            select
            label="Product"
            value={productId}
            onChange={(e) => {
              setProductId(e.target.value);
              setErrorMsg("");
            }}
            fullWidth
            required
          >
            {products.map((p) => (
              <MenuItem key={p.id} value={String(p.id)} disabled={p.stock === 0}>
                {p.name} — {formatCurrency(p.sellPrice)} ({p.stock} in stock)
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Quantity"
            type="number"
            value={quantity}
            onChange={(e) => {
              setQuantity(Number(e.target.value));
              setErrorMsg("");
            }}
            fullWidth
            required
            inputProps={{ min: 1 }}
          />

          <TextField
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />

          {errorMsg && (
            <Typography color="error" variant="body2">
              {errorMsg}
            </Typography>
          )}

          {selectedProduct && (
            <Typography variant="subtitle1" fontWeight={600}>
              Total: {formatCurrency(total)}
            </Typography>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={submitting || !productId || quantity < 1}
        >
          Add Sale
        </Button>
      </DialogActions>
    </Dialog>
  );
}
