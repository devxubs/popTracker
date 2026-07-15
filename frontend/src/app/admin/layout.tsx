"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { useRouter } from "next/navigation";

export default function RootLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   // if (typeof window === "undefined") {
   //    return null;
   // }

   const router = useRouter();
   const user = sessionStorage.getItem("user");

   if (!user) {
      router.push("/auth/login");

      return;
   }

   return <DashboardLayout>{children}</DashboardLayout>;
}
