"use client";

import React, { useState } from "react";
import {
   Dialog,
   DialogTitle,
   DialogContent,
   DialogActions,
   Button,
   TextField,
   Stack,
} from "@mui/material";
import { InvestmentInput } from "@/lib/services/investmentService";
import dayjs from "dayjs";

interface InvestmentFormDialogProps {
   open: boolean;
   onClose: () => void;
   onSubmit: (data: InvestmentInput) => Promise<void>;
}

export default function InvestmentFormDialog({
   open,
   onClose,
   onSubmit,
}: InvestmentFormDialogProps) {
   const [partnerName, setPartnerName] = useState("");
   const [amount, setAmount] = useState(0);
   const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));
   const [submitting, setSubmitting] = useState(false);

   const reset = () => {
      setPartnerName("");
      setAmount(0);
      setDate(dayjs().format("YYYY-MM-DD"));
   };

   const handleClose = () => {
      reset();
      onClose();
   };

   const handleSubmit = async () => {
      setSubmitting(true);
      try {
         await onSubmit({ partnerName, amount, date });
         handleClose();
      } finally {
         setSubmitting(false);
      }
   };

   return (
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
         <DialogTitle>Add Investment</DialogTitle>
         <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
               <TextField
                  label="Partner Name"
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  fullWidth
                  required
                  placeholder="e.g. Partner A"
               />
               <TextField
                  label="Amount"
                  type="number"
                  value={amount || ""}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  fullWidth
                  required
                  inputProps={{ min: 0.01, step: "0.01" }}
               />
               <TextField
                  label="Date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
               />
            </Stack>
         </DialogContent>
         <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
               onClick={handleSubmit}
               variant="contained"
               disabled={submitting || !partnerName || amount <= 0}
            >
               Add Investment
            </Button>
         </DialogActions>
      </Dialog>
   );
}
