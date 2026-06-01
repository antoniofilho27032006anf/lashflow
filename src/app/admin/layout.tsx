import { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

type AdminLayoutProps = {
  children: ReactNode;
};

export default async function AdminLayout({
  children,
}: AdminLayoutProps) {
  const session =
    await getServerSession();

  // Exige login
  if (!session) {
    redirect("/api/auth/signin");
  }

  // Permite acesso apenas ao admin
  if (
    session.user.role !== "ADMIN"
  ) {
    redirect("/booking");
  }

  return <>{children}</>;
}