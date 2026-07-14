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
import { Product } from "@/types";
import { productService, ProductInput } from "@/lib/services/productService";
import { formatCurrency } from "@/lib/format";
import ProductFormDialog from "@/components/products/ProductFormDialog";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import ActionMenu from "@/components/common/ActionMenu";
import EditIcon from "@mui/icons-material/Edit";
import { DeleteOutlineOutlined } from "@mui/icons-material";

const LOW_STOCK_THRESHOLD = 5;

export default function ProductsPage() {
   const [products, setProducts] = useState<Product[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState("");

   const [formOpen, setFormOpen] = useState(false);
   const [editingProduct, setEditingProduct] = useState<Product | null>(null);
   const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

   const fetchProducts = async () => {
      setLoading(true);
      try {
         const data = await productService.getAll();
         setProducts(data);
         setError("");
      } catch {
         setError("Failed to load products.");
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchProducts();
   }, []);

   const handleAddClick = () => {
      setEditingProduct(null);
      setFormOpen(true);
   };

   const handleEditClick = (product: Product) => {
      setEditingProduct(product);
      setFormOpen(true);
   };

   const handleFormSubmit = async (data: ProductInput) => {
      if (editingProduct) {
         await productService.update(editingProduct.id, data);
      } else {
         await productService.create(data);
      }
      await fetchProducts();
   };

   const handleDeleteConfirm = async () => {
      if (!deleteTarget) return;
      await productService.remove(deleteTarget.id);
      setDeleteTarget(null);
      await fetchProducts();
   };

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
            <Typography variant="h4">Products</Typography>
            <Button
               variant="contained"
               startIcon={<AddIcon />}
               onClick={handleAddClick}
            >
               Add Product
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
                        <TableCell>Name</TableCell>
                        <TableCell align="right">Buy Price</TableCell>
                        <TableCell align="right">Sell Price</TableCell>
                        <TableCell align="right">Stock</TableCell>
                        <TableCell align="right">Actions</TableCell>
                     </TableRow>
                  </TableHead>
                  <TableBody
                     sx={{
                        "&  :last-child td": { borderBottom: "none" },
                     }}
                  >
                     {products.map((p) => (
                        <TableRow key={p.id} hover>
                           <TableCell>{p.name}</TableCell>
                           <TableCell align="right">
                              {formatCurrency(p.buyPrice)}
                           </TableCell>
                           <TableCell align="right">
                              {formatCurrency(p.sellPrice)}
                           </TableCell>
                           <TableCell align="right">
                              {p.stock}
                              {p.stock <= LOW_STOCK_THRESHOLD && (
                                 <Chip
                                    label="Low Stock"
                                    color="warning"
                                    size="small"
                                    sx={{ ml: 1 }}
                                 />
                              )}
                           </TableCell>
                           <TableCell align="right">
                              <ActionMenu
                                 menuOptions={[
                                    {
                                       label: "Edit",
                                       color: "primary",
                                       icon: <EditIcon />,
                                       onClick: () => handleEditClick(p),
                                    },
                                    {
                                       label: "Delete",
                                       color: "error",
                                       icon: <DeleteOutlineOutlined />,
                                       onClick: () => setDeleteTarget(p),
                                    },
                                 ]}
                              />
                           </TableCell>
                        </TableRow>
                     ))}
                     {products.length === 0 && (
                        <TableRow>
                           <TableCell colSpan={5} align="center">
                              No products yet. Click "Add Product" to create
                              one.
                           </TableCell>
                        </TableRow>
                     )}
                  </TableBody>
               </Table>
            )}
         </Paper>

         <ProductFormDialog
            open={formOpen}
            initialData={editingProduct}
            onClose={() => setFormOpen(false)}
            onSubmit={handleFormSubmit}
         />

         <ConfirmDialog
            open={!!deleteTarget}
            title="Delete Product"
            message={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`}
            onConfirm={handleDeleteConfirm}
            onCancel={() => setDeleteTarget(null)}
         />
      </Box>
   );
}
