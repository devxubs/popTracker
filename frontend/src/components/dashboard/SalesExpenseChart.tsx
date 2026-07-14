"use client";

import React from "react";
import { Card, CardContent, Typography, useTheme } from "@mui/material";
import {
   ResponsiveContainer,
   BarChart,
   Bar,
   XAxis,
   YAxis,
   Tooltip,
   Legend,
   CartesianGrid,
} from "recharts";

interface ChartDatum {
   name: string; // e.g. day label
   sales: number;
   expenses: number;
}

/**
 * Simple bar chart comparing Sales vs Expenses.
 * Accepts pre-aggregated data so it stays a "dumb" presentational component.
 */
export default function SalesExpenseChart({ data }: { data: ChartDatum[] }) {
   const theme = useTheme();

   return (
      <Card
         sx={{
            height: "100%",
         }}
      >
         <CardContent>
            <Typography variant="h6" gutterBottom>
               Sales vs Expenses
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
               <BarChart data={data}>
                  <CartesianGrid
                     strokeDasharray="3 3"
                     stroke={theme.palette.divider}
                  />
                  <XAxis dataKey="name" stroke={theme.palette.text.secondary} />
                  <YAxis stroke={theme.palette.text.secondary} />
                  <Tooltip
                     contentStyle={{
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                     }}
                  />
                  <Legend />
                  <Bar
                     dataKey="sales"
                     fill={theme.palette.primary.main}
                     radius={[6, 6, 0, 0]}
                  />
                  <Bar
                     dataKey="expenses"
                     fill={theme.palette.error.main}
                     radius={[6, 6, 0, 0]}
                  />
               </BarChart>
            </ResponsiveContainer>
         </CardContent>
      </Card>
   );
}
