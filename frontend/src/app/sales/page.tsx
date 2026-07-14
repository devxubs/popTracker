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
import { Sale, Product } from "@/types";
import { saleService, SaleInput } from "@/lib/services/saleService";
import { productService } from "@/lib/services/productService";
import { formatCurrency, formatDate } from "@/lib/format";
import SaleFormDialog from "@/components/sales/SaleFormDialog";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import ActionMenu from "@/components/common/ActionMenu";

export default function SalesPage() {
   const [sales, setSales] = useState<Sale[]>([]);
   const [products, setProducts] = useState<Product[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState("");

   const [formOpen, setFormOpen] = useState(false);
   const [deleteTarget, setDeleteTarget] = useState<Sale | null>(null);

   const fetchData = async () => {
      setLoading(true);
      try {
         const [salesData, productsData] = await Promise.all([
            saleService.getAll(),
            productService.getAll(),
         ]);
         setSales(salesData);
         setProducts(productsData);
         setError("");
      } catch {
         setError("Failed to load sales data.");
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchData();
   }, []);

   const handleFormSubmit = async (data: SaleInput) => {
      await saleService.create(data);
      await fetchData(); // refresh both sales and product stock levels
   };

   const handleDeleteConfirm = async () => {
      if (!deleteTarget) return;
      await saleService.remove(deleteTarget.id);
      setDeleteTarget(null);
      await fetchData();
   };

   const totalSales = sales.reduce((sum, s) => sum + s.totalPrice, 0);

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
            <Typography variant="h4">Sales</Typography>
            <Button
               variant="contained"
               startIcon={<AddIcon />}
               onClick={() => setFormOpen(true)}
               disabled={products.length === 0}
            >
               Add Sale
            </Button>
         </Box>

         {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
               {error}
            </Alert>
         )}
         {products.length === 0 && !loading && (
            <Alert severity="info" sx={{ mb: 2 }}>
               Add a product first before recording a sale.
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
                        <TableCell>Product</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell align="right">Sell Price</TableCell>
                        <TableCell align="right">Total</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell align="right">Actions</TableCell>
                     </TableRow>
                  </TableHead>
                  <TableBody>
                     {sales.map((s) => (
                        <TableRow key={s.id} hover>
                           <TableCell>{s.productName}</TableCell>
                           <TableCell align="right">{s.quantity}</TableCell>
                           <TableCell align="right">
                              {formatCurrency(s.sellPriceAtSale)}
                           </TableCell>
                           <TableCell align="right">
                              {formatCurrency(s.totalPrice)}
                           </TableCell>
                           <TableCell>{formatDate(s.date)}</TableCell>
                           <TableCell align="right">
                              <ActionMenu
                                 menuOptions={[
                                    {
                                       label: "Delete",
                                       color: "error",
                                       icon: <DeleteIcon />,
                                       onClick: () => setDeleteTarget(s),
                                    },
                                 ]}
                              />
                           </TableCell>
                        </TableRow>
                     ))}
                     {sales.length === 0 && (
                        <TableRow>
                           <TableCell colSpan={6} align="center">
                              No sales recorded yet.
                           </TableCell>
                        </TableRow>
                     )}
                  </TableBody>
                  {sales.length > 0 && (
                     <TableBody
                        sx={{
                           "&  :last-child td": { borderBottom: "none" },
                        }}
                     >
                        <TableRow>
                           <TableCell colSpan={3} align="right">
                              <Typography fontWeight={700}>Total</Typography>
                           </TableCell>
                           <TableCell align="right">
                              <Typography fontWeight={700}>
                                 {formatCurrency(totalSales)}
                              </Typography>
                           </TableCell>
                           <TableCell colSpan={2} />
                        </TableRow>
                     </TableBody>
                  )}
               </Table>
            )}
         </Paper>

         <SaleFormDialog
            open={formOpen}
            products={products}
            onClose={() => setFormOpen(false)}
            onSubmit={handleFormSubmit}
         />

         <ConfirmDialog
            open={!!deleteTarget}
            title="Delete Sale"
            message={`Delete this sale of "${deleteTarget?.productName}"? Stock will be restored.`}
            onConfirm={handleDeleteConfirm}
            onCancel={() => setDeleteTarget(null)}
         />
      </Box>
   );
}
