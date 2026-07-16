"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function AdminLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   const router = useRouter();

   const [loading, setLoading] = useState(true);
   const [authenticated, setAuthenticated] = useState(false);

   useEffect(() => {
      const user = sessionStorage.getItem("user");

      if (!user) {
         router.replace("/auth/login");
      } else {
         setAuthenticated(true);
      }

      setLoading(false);
   }, [router]);

   if (loading) {
      return null; // অথবা Loader
   }

   if (!authenticated) {
      return null;
   }

   return <DashboardLayout>{children}</DashboardLayout>;
}
