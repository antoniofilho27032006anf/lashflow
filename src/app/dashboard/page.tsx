import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { connectDB } from "@/lib/mongodb";
import Service from "@/models/Service";
import Appointment from "@/models/Appointment";

export default async function Dashboard() {
  const session = await getServerSession();

  if (!session) {
    redirect("/api/auth/signin");
  }

  
  // Permite acesso apenas ao admin
  if (session.user.role !== "ADMIN") {
  redirect("/booking");
}
  

  // Conecta ao banco
  await connectDB();

  // Busca os totais
  const totalServices =
    await Service.countDocuments();

  const totalAppointments =
    await Appointment.countDocuments();

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">
        Dashboard
      </h1>

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <div className="border rounded-lg p-6">
          <h2 className="text-gray-500">
            Total de Serviços
          </h2>

          <p className="text-4xl font-bold mt-2">
            {totalServices}
          </p>
        </div>

        <div className="border rounded-lg p-6">
          <h2 className="text-gray-500">
            Total de Agendamentos
          </h2>

          <p className="text-4xl font-bold mt-2">
            {totalAppointments}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        <Link
          href="/dashboard"
          className="bg-black text-white px-4 py-2 rounded"
        >
          Dashboard
        </Link>

        <Link
          href="/admin/services"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Serviços
        </Link>

        <Link
          href="/admin/appointments"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Agendamentos
        </Link>
      </div>

      <div className="border rounded-lg p-4">
        <h2 className="font-bold mb-2">
          Sessão atual
        </h2>

        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>
    </div>
  );
}