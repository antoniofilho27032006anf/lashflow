import { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

type AdminLayoutProps = {
  children: ReactNode;
};

export default async function AdminLayout({
  children,
}: AdminLayoutProps) {
  const session =
    await getServerSession(
      authOptions
    );

  // Exige login
  if (!session) {
    redirect("/auth/signin");
  }

  // Permite acesso apenas ao admin
  if (session.user.role !== "ADMIN") {
    redirect("/booking");
  }

  return <>{children}</>;
}