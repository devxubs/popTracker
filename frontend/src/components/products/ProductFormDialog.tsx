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
} from "@mui/material";
import { Product } from "@/types";
import { ProductInput } from "@/lib/services/productService";

interface ProductFormDialogProps {
   open: boolean;
   initialData?: Product | null; // if provided, dialog is in "edit" mode
   onClose: () => void;
   onSubmit: (data: ProductInput) => Promise<void>;
}

const emptyForm: ProductInput = {
   name: "",
   buyPrice: 0,
   sellPrice: 0,
   stock: 0,
};

export default function ProductFormDialog({
   open,
   initialData,
   onClose,
   onSubmit,
}: ProductFormDialogProps) {
   const [form, setForm] = useState<ProductInput>(emptyForm);
   const [submitting, setSubmitting] = useState(false);

   // Pre-fill the form when editing, reset when adding
   useEffect(() => {
      if (initialData) {
         const { name, buyPrice, sellPrice, stock } = initialData;
         setForm({ name, buyPrice, sellPrice, stock });
      } else {
         setForm(emptyForm);
      }
   }, [initialData, open]);

   const handleChange =
      (field: keyof ProductInput) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
         const value =
            field === "name" ? e.target.value : Number(e.target.value);
         setForm((prev) => ({ ...prev, [field]: value }));
      };

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
         <DialogTitle>
            {initialData ? "Edit Product" : "Add Product"}
         </DialogTitle>
         <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
               <TextField
                  label="Product Name"
                  value={form.name}
                  onChange={handleChange("name")}
                  fullWidth
                  required
               />
               <TextField
                  label="Buy Price"
                  type="number"
                  value={form.buyPrice || ""}
                  onChange={handleChange("buyPrice")}
                  fullWidth
                  required
               />
               <TextField
                  label="Sell Price"
                  type="number"
                  value={form.sellPrice || ""}
                  onChange={handleChange("sellPrice")}
                  fullWidth
                  required
               />
               <TextField
                  label="Stock"
                  type="number"
                  value={form.stock || ""}
                  onChange={handleChange("stock")}
                  fullWidth
                  required
               />
            </Stack>
         </DialogContent>
         <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button
               onClick={handleSubmit}
               variant="contained"
               disabled={submitting || !form.name}
            >
               {initialData ? "Save Changes" : "Add Product"}
            </Button>
         </DialogActions>
      </Dialog>
   );
}
